import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {freshState,recordAnswer} from '../dist/src/model.js';
import {getQuestion} from '../dist/src/content.js';
import {createCustomQuote} from '../dist/src/anime.js';
import {createPersonalDeck,upsertPersonalWord,removePersonalWord,getPersonalQuestion} from '../dist/src/personal-data.js';
import {validateBackup,parseBackup} from '../dist/src/backup-schema.js';
import {syncProjection,mergeProjections,applyProjection} from '../dist/src/backup-data.js';
import {openStore,writeStoreMeta,readStoreMeta} from '../dist/src/storage.js';
import {createDataFeature} from '../dist/src/data-feature.js';
import {syncRequest} from '../worker/sync.js';

const stamp='2026-11-05T09:00:00.000Z',esc=value=>String(value??'').replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const exported=state=>({application:'yomu',exportedAt:stamp,...structuredClone(state)});
const question=()=>getQuestion('c-reading');
const answer=(state,id,correct=true,at=stamp)=>recordAnswer(state,question(),correct?'ほん':'wrong',at,id);
const projection=state=>syncProjection(state||freshState());
function personal(){let state=createPersonalDeck(freshState(),'Study',{id:'deck-test',now:stamp});return upsertPersonalWord(state,{deckId:'deck-test',written:'学校',reading:'がっこう',tr:'okul',en:'school'},{id:'word-test',now:stamp});}
const errorCode=code=>error=>error.code===code;
const origin='https://yomu.example';
function sqliteD1({table=true}={}){
 const sqlite=new DatabaseSync(':memory:');if(table)sqlite.exec('CREATE TABLE yomu_sync (user_id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL, snapshot TEXT NOT NULL, updated_at TEXT NOT NULL)');
 return {sqlite,DB:{prepare(sql){return{bind(...values){return{async first(){return sqlite.prepare(sql).get(...values)||null;}};}};}}};
}
const request=({method='GET',user='user-a',headers={},body,url=origin+'/api/sync'}={})=>new Request(url,{method,headers:{...(user===null?{}:{'oai-authenticated-user-id':user}),...(method==='PUT'?{'Origin':origin,'Content-Type':'application/json'}:{}),...headers},...(body===undefined?{}:{body:typeof body==='string'?body:JSON.stringify(body)})});
const put=(snapshot,expectedRevision=0,extra={})=>request({method:'PUT',body:{expectedRevision,snapshot},...extra});
const decode=async response=>({status:response.status,body:await response.json()});

test('legacy full exports restore additively, while malformed, future and prototype-bearing backups are rejected',()=>{
 const old=exported(answer(freshState(),'legacy-answer'));old.schemaVersion=1;delete old.personal;delete old.anime;delete old.weakness;delete old.listening;
 const parsed=parseBackup('\uFEFF'+JSON.stringify(old));assert.equal(parsed.events[0].id,'legacy-answer');const restored=applyProjection(freshState(),projection(parsed));assert.equal(restored.events[0].id,'legacy-answer');assert.deepEqual(restored.personal.words,[]);
 for(const mutate of [value=>{value.schemaVersion=4;},value=>{value.settings.language='ja';},value=>{value.events[0].correct='yes';},value=>{value.skillStates['book:reading'].attempts=-1;},value=>{value.personal={decks:[],words:[{}]};}]){const invalid=exported(answer(freshState(),'valid'));mutate(invalid);assert.throws(()=>parseBackup(JSON.stringify(invalid)),errorCode('INVALID_BACKUP'));}
 assert.throws(()=>parseBackup('{not-json'),errorCode('INVALID_JSON'));const polluted=JSON.stringify(exported(freshState())).replace('"settings":{','"settings":{"__proto__":{"polluted":true},');assert.throws(()=>parseBackup(polluted),errorCode('INVALID_BACKUP'));assert.equal({}.polluted,undefined);
 const constructor=JSON.stringify(exported(freshState())).replace('"lessons":{}','"lessons":{"constructor":{"prototype":{"polluted":true}}}');assert.throws(()=>parseBackup(constructor),errorCode('INVALID_BACKUP'));
});
test('first sync combines independently collected words and answers without treating the other device as a deletion',()=>{
 let left=answer(personal(),'left-answer'),right=answer(freshState(),'right-answer',false,'2026-11-05T10:00:00Z');right=createPersonalDeck(right,'Other',{id:'other-deck',now:stamp});right=upsertPersonalWord(right,{deckId:'other-deck',written:'本',reading:'ほん',tr:'kitap',en:'book'},{id:'other-word',now:stamp});
 const {snapshot,conflicts}=mergeProjections(projection(left),projection(right),projection());assert.deepEqual(snapshot.events.map(event=>event.id),['left-answer','right-answer']);assert.equal(snapshot.personal.words.length,2);assert.equal(snapshot.personal.decks.length,2);assert.equal(conflicts.length,0);assert.equal(snapshot.skillStates['book:reading'].attempts,2);assert.equal(snapshot.skillStates['book:reading'].correct,1);assert.equal(snapshot.skillStates['book:reading'].step,-1);assert.equal(snapshot.skillStates['book:reading'].dueAt,'2026-11-05T10:10:00.000Z');
});
test('restored custom anime records cannot inject markup through identifiers or theme attributes',()=>{
 const original=createCustomQuote({text:'学校へ行きます。',target:'学校',reading:'がっこうへいきます。'},'backup-safe'),state=freshState();state.anime.customQuotes.push(original);assert.doesNotThrow(()=>validateBackup(exported(state)));
 for(const changes of [{id:'custom-x" autofocus onfocus="alert(1)'},{theme:'custom"><img src=x onerror=alert(1)>'}]){const invalid=exported(state);Object.assign(invalid.anime.customQuotes[0],changes);assert.throws(()=>validateBackup(invalid),errorCode('INVALID_BACKUP'));}
});
test('shared answer IDs are deduplicated before chronological scheduling and manual suspension is retained',()=>{
 const initial=answer(freshState(),'shared-answer',true,'2026-11-01T09:00:00Z');let left=answer(initial,'local-answer',false,'2026-11-02T09:00:00Z'),right=answer(initial,'remote-answer',true,'2026-11-03T09:00:00Z');left.skillStates['book:reading'].suspended=true;
 const {snapshot}=mergeProjections(projection(left),projection(right),projection(initial));assert.equal(snapshot.events.length,3);const card=snapshot.skillStates['book:reading'];assert.equal(card.attempts,3);assert.equal(card.correct,2);assert.equal(card.step,0);assert.equal(card.dueAt,'2026-11-04T09:00:00.000Z');assert.equal(card.suspended,true);
 const again=mergeProjections(snapshot,snapshot,snapshot);assert.equal(again.changed,false);assert.equal(again.snapshot.events.length,3);assert.equal(again.snapshot.skillStates['book:reading'].attempts,3);
});
test('an older device snapshot cannot erase immutable answers or saved words merely by omitting them',()=>{
 const known=projection(answer(personal(),'known-answer')),older=projection(),result=mergeProjections(older,known,known);assert.equal(result.snapshot.events.length,1);assert.equal(result.snapshot.events[0].id,'known-answer');assert.equal(result.snapshot.personal.decks[0].id,'deck-test');assert.equal(result.snapshot.personal.words[0].id,'word-test');assert.equal(result.snapshot.skillStates['book:reading'].attempts,1);
});
test('independent word edits merge but same-field changes require an explicit conflict preference',()=>{
 const initial=personal(),left=upsertPersonalWord(initial,{...initial.personal.words[0],notes:'Local note'},{now:'2026-11-05T10:00:00Z'}),right=upsertPersonalWord(initial,{...initial.personal.words[0],example:'学校へ行きます。'},{now:'2026-11-05T10:00:00Z'});
 const independent=mergeProjections(projection(left),projection(right),projection(initial));assert.equal(independent.snapshot.personal.words[0].notes,'Local note');assert.equal(independent.snapshot.personal.words[0].example,'学校へ行きます。');assert.equal(independent.snapshot.personal.words[0].revision,3);
 const localMeaning=upsertPersonalWord(initial,{...initial.personal.words[0],meaning:{tr:'yerel anlam',en:'school'}},{now:'2026-11-05T11:00:00Z'}),remoteMeaning=upsertPersonalWord(initial,{...initial.personal.words[0],meaning:{tr:'uzak anlam',en:'school'}},{now:'2026-11-05T12:00:00Z'});
 const unresolved=mergeProjections(projection(localMeaning),projection(remoteMeaning),projection(initial));assert.ok(unresolved.conflicts.some(path=>path.endsWith('.meaning.tr')));const resolved=mergeProjections(projection(localMeaning),projection(remoteMeaning),projection(initial),{prefer:'remote'});assert.equal(resolved.snapshot.personal.words[0].meaning.tr,'uzak anlam');
});
test('removal tombstones keep historical answers and suspend a concurrently answered personal word',()=>{
 const q=getPersonalQuestion('personal:word-test:reading',personal()),initial=recordAnswer(personal(),q,'がっこう','2026-11-05T09:10:00Z','before-removal'),left=removePersonalWord(initial,'word-test',{now:'2026-11-05T10:00:00Z'}),right=recordAnswer(initial,q,'がっこう','2026-11-05T11:00:00Z','other-device-answer');
 const merged=mergeProjections(projection(left),projection(right),projection(initial));assert.equal(merged.snapshot.events.length,2);assert.equal(merged.snapshot.personal.words[0].deletedAt,'2026-11-05T10:00:00.000Z');assert.equal(merged.snapshot.skillStates['personal-word-test:reading'].suspended,true);assert.equal(merged.snapshot.skillStates['personal-word-test:reading'].attempts,2);
});
test('independently added duplicate words require a preference, keep the selected ID active and preserve both histories',()=>{
 const initial=createPersonalDeck(freshState(),'Shared deck',{id:'shared-deck',now:stamp}),values={deckId:'shared-deck',written:'学校',reading:'がっこう',tr:'yerel okul notu',en:'school'};
 let local=upsertPersonalWord(initial,values,{id:'word-local',now:'2026-11-05T10:00:00Z'}),remote=upsertPersonalWord(initial,{...values,tr:'bulut okul notu'},{id:'word-remote',now:'2026-11-05T10:05:00Z'});
 local=recordAnswer(local,getPersonalQuestion('personal:word-local:reading',local),'がっこう','2026-11-05T11:00:00Z','local-word-answer');remote=recordAnswer(remote,getPersonalQuestion('personal:word-remote:reading',remote),'がっこう','2026-11-05T11:05:00Z','remote-word-answer');
 const lp=projection(local),rp=projection(remote),bp=projection(initial),unresolved=mergeProjections(lp,rp,bp);assert.ok(unresolved.conflicts.some(path=>path.startsWith('personal.words')),'semantic duplicate must be visible as a conflict');assert.doesNotThrow(()=>validateBackup(unresolved.snapshot));
 for(const [prefer,activeId,removedId,meaning] of [['local','word-local','word-remote','yerel okul notu'],['remote','word-remote','word-local','bulut okul notu']]){
  const result=mergeProjections(lp,rp,bp,{prefer}),words=result.snapshot.personal.words,active=words.filter(word=>!word.deletedAt),removed=words.find(word=>word.id===removedId);assert.equal(words.length,2);assert.equal(active.length,1);assert.equal(active[0].id,activeId);assert.equal(active[0].meaning.tr,meaning);assert.ok(Number.isFinite(Date.parse(removed.deletedAt)));assert.deepEqual(result.snapshot.events.map(event=>event.id).sort(),['local-word-answer','remote-word-answer']);assert.equal(result.snapshot.skillStates[`personal-${removedId}:reading`].suspended,true);assert.equal(result.snapshot.skillStates[`personal-${removedId}:reading`].attempts,1);assert.equal(result.snapshot.skillStates[`personal-${activeId}:reading`].suspended,false);assert.equal(result.snapshot.skillStates[`personal-${activeId}:reading`].attempts,1);assert.doesNotThrow(()=>validateBackup(result.snapshot));
 }
 assert.equal(local.personal.words[0].deletedAt,undefined);assert.equal(remote.personal.words[0].deletedAt,undefined);
});
test('note-only word edits retain review scheduling across merge while changed meanings remain due again',()=>{
 let initial=personal(),q=getPersonalQuestion('personal:word-test:reading',initial);initial=recordAnswer(initial,q,'がっこう','2026-11-05T09:10:00Z','word-first-answer');initial=recordAnswer(initial,q,'がっこう','2026-11-05T09:30:00Z','word-second-answer');
 const key='personal-word-test:reading',before=structuredClone(initial.skillStates[key]),notes=upsertPersonalWord(initial,{...initial.personal.words[0],notes:'Only a new memory aid',example:'学校へ行きます。'},{now:'2026-11-05T10:00:00Z'}),other=answer(initial,'other-item-answer',true,'2026-11-05T10:05:00Z');
 const result=mergeProjections(projection(notes),projection(other),projection(initial)),card=result.snapshot.skillStates[key];assert.equal(result.snapshot.personal.words[0].notes,'Only a new memory aid');assert.equal(card.dueAt,before.dueAt);assert.equal(card.step,before.step);assert.equal(card.lastAnsweredAt,before.lastAnsweredAt);assert.equal(card.attempts,2);assert.equal(card.correct,2);assert.equal(result.snapshot.events.length,3);
 const meaning=upsertPersonalWord(initial,{...initial.personal.words[0],meaning:{tr:'yenilenmiş okul anlamı',en:'school'}},{now:'2026-11-05T12:00:00Z'}),changed=mergeProjections(projection(meaning),projection(other),projection(initial));assert.equal(changed.snapshot.skillStates[key].step,-1);assert.equal(changed.snapshot.skillStates[key].dueAt,'2026-11-05T12:00:00.000Z');assert.equal(changed.snapshot.skillStates[key].attempts,2);assert.equal(changed.snapshot.events.length,3);
});
test('applying a projection preserves the current device revision and resets every active practice session',()=>{
 const current=freshState();current.revision=34;for(const name of ['practice','learning','weakness','listening','personal'])current[name].session={id:'local-'+name};current.session={id:'review-local'};current.anime.practice={quoteId:'vinland-enemies'};current.genki={completedLessons:{},session:{id:'genki-local'}};current.exams={history:[],session:{id:'exam-local'}};current.reminder.enabled=true;
 const restored=applyProjection(current,projection(answer(personal(),'imported-answer')));assert.equal(restored.revision,34);for(const name of ['practice','learning','weakness','listening','personal','genki','exams'])assert.equal(restored[name].session,null);assert.equal(restored.session,null);assert.equal(restored.anime.practice,null);assert.equal(restored.reminder.enabled,true);assert.equal(restored.events[0].id,'imported-answer');assert.equal(current.events.length,0);
});
test('worker authenticates per user and atomically enforces create/update revisions in real SQLite',async()=>{
 const {DB,sqlite}=sqliteD1();try{
  assert.deepEqual(await decode(await syncRequest(request(),{DB})),{status:200,body:{revision:0,snapshot:null,updatedAt:null}});
  const snapshot=projection(answer(freshState(),'user-a-answer'));const create=await decode(await syncRequest(put(snapshot),{DB}));assert.equal(create.status,200);assert.equal(create.body.revision,1);assert.ok(create.body.updatedAt);
  assert.equal((await syncRequest(put(snapshot),{DB})).status,409);let loaded=await decode(await syncRequest(request(),{DB}));assert.equal(loaded.body.snapshot.events[0].id,'user-a-answer');
  const b=await decode(await syncRequest(request({user:'user-b'}),{DB}));assert.equal(b.body.snapshot,null);assert.equal(b.body.revision,0);assert.equal((await syncRequest(put(projection(),0,{user:'user-b'}),{DB})).status,200);
  const edited=projection(answer(freshState(),'newer-a'));assert.equal((await decode(await syncRequest(put(edited,1),{DB}))).body.revision,2);assert.equal((await syncRequest(put(snapshot,1),{DB})).status,409);loaded=await decode(await syncRequest(request(),{DB}));assert.equal(loaded.body.snapshot.events[0].id,'newer-a');assert.equal(loaded.body.revision,2);assert.equal((await decode(await syncRequest(request({user:'user-b'}),{DB}))).body.revision,1);
 }finally{sqlite.close();}
});
test('worker rejects missing identity, cross-origin mutation, unsupported methods, invalid bodies and oversized streams',async()=>{
 const {DB,sqlite}=sqliteD1();try{
  const checks=[
   [request({user:null}),401],[request({user:'x'.repeat(201)}),401],[request({method:'POST',body:'{}'}),405],
   [request({headers:{Origin:'https://attacker.example'}}),403],[put(projection(),0,{headers:{Origin:'https://attacker.example'}}),403],[put(projection(),0,{headers:{Origin:'','Sec-Fetch-Site':'same-origin'}}),403],[put(projection(),0,{headers:{'Sec-Fetch-Site':'cross-site'}}),403],
   [put(projection(),0,{headers:{'Content-Type':'text/plain'}}),415],[request({method:'PUT',body:'{broken'}),400],[put(projection(),-1),400],[put(projection(),1.5),400],[put({...projection(),schemaVersion:99}),400],[put({...projection(),session:{id:'transient'}}),400],
   [request({method:'PUT',body:' '.repeat(1_802_000)}),413],[put(projection(),0,{headers:{'Content-Length':'1802000'}}),413]
  ];
  for(const [req,expected] of checks){const response=await syncRequest(req,{DB});assert.equal(response.status,expected,req.method+' '+req.headers.get('Content-Type'));assert.match(response.headers.get('Cache-Control'),/no-store/u);assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');}
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM yomu_sync').get().count,0);
 }finally{sqlite.close();}
 assert.equal((await syncRequest(request(),{})).status,503);const unavailable=sqliteD1({table:false});try{assert.equal((await syncRequest(request(),{DB:unavailable.DB})).status,503);}finally{unavailable.sqlite.close();}
});

await openStore();
async function resetMetadata(){await writeStoreMeta('cloud-sync',null);await writeStoreMeta('restore-recovery',null);}
function controller(initial,fetchImpl=async()=>new Response(JSON.stringify({revision:0,snapshot:null}),{headers:{'Content-Type':'application/json'}})){
 let state=initial,commits=0;const feature=createDataFeature({getState:()=>state,commit:async next=>{commits++;state={...next,revision:state.revision+1};return true;},render:()=>{},ui:()=>({T:tr=>tr,esc}),toast:()=>{},isBusy:()=>false,fetchImpl});
 return{feature,get state(){return state;},set state(value){state=value;},get commits(){return commits;}};
}
const backupTarget=(value,name='backup.json')=>({matches:selector=>selector==='[data-backup-file]',files:[{size:100,name,text:async()=>JSON.stringify(exported(value))}]});
test('a restore refuses a preview that became stale before confirmation',async()=>{
 await resetMetadata();const f=controller(freshState());await f.feature.change(backupTarget(answer(freshState(),'from-backup')));f.state={...answer(f.state,'new-local'),revision:1};await f.feature.click({dataset:{action:'data-restore'}});assert.equal(f.commits,0);assert.equal(f.state.events[0].id,'new-local');assert.match(f.feature.page(),/Yeniden önizle/u);
});
test('an older failed file read cannot replace the result or status of the newer backup selection',async()=>{
 await resetMetadata();const f=controller(freshState());let finishOld;const old=f.feature.change({matches:selector=>selector==='[data-backup-file]',files:[{size:20,name:'old-broken.json',text:()=>new Promise(resolve=>{finishOld=resolve;})}]});await f.feature.change(backupTarget(answer(freshState(),'new-file-answer'),'new-valid.json'));finishOld('{invalid');await old;const html=f.feature.page();assert.match(html,/new-valid.json/u);assert.doesNotMatch(html,/Dosya geçerli JSON değil/u);assert.equal(f.commits,0);
});
test('a restore does not erase an answer committed while its recovery metadata is being saved',async()=>{
 await resetMetadata();const f=controller(freshState());await f.feature.change(backupTarget(answer(freshState(),'from-backup')));await f.feature.change({matches:()=>false,dataset:{dataSetting:'restore-mode'},value:'replace'});
 const pending=f.feature.click({dataset:{action:'data-restore'}});f.state={...answer(f.state,'during-restore'),revision:1};await pending;assert.ok(f.state.events.some(event=>event.id==='during-restore'),'new local answer survives asynchronous recovery writes');assert.equal(f.commits,0,'an outdated restore must be rejected instead of rebased onto the new revision');
});
test('local changes made during cloud upload remain pending without acknowledging unapplied remote data as the local base',async()=>{
 await resetMetadata();const local=answer(freshState(),'local-old'),remote=answer(freshState(),'remote-only',false,'2026-11-05T10:00:00Z');await writeStoreMeta('cloud-sync',{enabled:true,base:projection(),revision:1});let releaseUpload,uploadStarted;
 const started=new Promise(resolve=>{uploadStarted=resolve;}),fetchImpl=async(_url,options)=>{if(options.method==='GET')return new Response(JSON.stringify({revision:1,snapshot:projection(remote),updatedAt:stamp}),{headers:{'Content-Type':'application/json'}});uploadStarted();await new Promise(resolve=>{releaseUpload=resolve;});return new Response(JSON.stringify({revision:2,updatedAt:stamp}),{headers:{'Content-Type':'application/json'}});};
 const f=controller(local,fetchImpl),pending=f.feature.syncNow({setup:true});await pending;const confirmation=f.feature.click({dataset:{action:'data-confirm-sync'}});await started;f.state={...answer(f.state,'during-upload',true,'2026-11-05T11:00:00Z'),revision:1};releaseUpload();await confirmation;
 assert.ok(f.state.events.some(event=>event.id==='during-upload'));const meta=await readStoreMeta('cloud-sync');assert.ok(!meta?.base?.events?.some(event=>event.id==='remote-only')||f.state.events.some(event=>event.id==='remote-only'),'base must not acknowledge remote records that were never applied locally');assert.doesNotMatch(f.feature.page(),/data-sync-status[^>]*>Eşitlendi\./u,'unsent local edits cannot be reported as synced');await f.feature.click({dataset:{action:'data-pause'}});
});
