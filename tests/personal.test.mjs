import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultPersonal,createPersonalDeck,renamePersonalDeck,upsertPersonalWord,removePersonalWord,restorePersonalWord,personalWordPool,getPersonalQuestion,createPersonalSession,savePersonalForReview,preparePersonalImport,applyPersonalImport,personalCSV,validatePersonalWord} from '../dist/src/personal-data.js';
import {gradeAnswer,recordAnswer,hydrateState} from '../dist/src/model.js';
import {createPersonalFeature} from '../dist/src/personal-feature.js';
const now=new Date('2026-11-03T12:00:00Z');
const base=()=>({schemaVersion:3,revision:0,personal:defaultPersonal(),events:[],skillStates:{},settings:{language:'tr',timezone:'Europe/Istanbul',questionReadings:false}});
const draft={deckId:'deck-1',written:'学校',reading:'がっこう',tr:'okul',en:'school',tags:'Genki 1, Bölüm 3',example:'学校へ行きます。'};
function setup(){return upsertPersonalWord(createPersonalDeck(base(),'Genki 1',{id:'deck-1',now}),draft,{id:'word-1',now});}
const code=expected=>error=>error.code===expected;

test('personal decks and notes validate kana, bounds and duplicate identities without creating answers',()=>{
 let state=createPersonalDeck(base(),'Genki 1',{id:'deck-1',now});assert.equal(state.personal.selectedDeckId,'deck-1');assert.equal(state.events.length,0);
 assert.throws(()=>createPersonalDeck(state,'Genki 1',{id:'deck-2'}),code('duplicate-deck'));
 state=upsertPersonalWord(state,draft,{id:'word-1',now});assert.equal(state.personal.words[0].revision,1);assert.deepEqual(state.personal.words[0].tags,['Genki 1','Bölüm 3']);assert.equal(state.personal.words[0].editorReviewed,false);
 assert.throws(()=>upsertPersonalWord(state,draft,{id:'word-2'}),code('duplicate-word'));
 assert.throws(()=>validatePersonalWord({...draft,reading:'gakkou'}),code('kana-required'));
 assert.throws(()=>validatePersonalWord({...draft,reading:'学校'}),code('kana-required'));
 assert.equal(validatePersonalWord({...draft,reading:'ｺｰﾋｰ'}).reading,'コーヒー');
 assert.throws(()=>validatePersonalWord({...draft,tags:Array.from({length:13},(_,i)=>'tag-'+i)}),code('too-many-tags'));
 assert.throws(()=>validatePersonalWord({...draft,written:'x'.repeat(81)}),code('too-long'));
 assert.equal(state.events.length,0);assert.equal(Object.keys(state.skillStates).length,0);
});
test('personal questions keep stable IDs, explicit fallback and reading/writing skills separate',()=>{
 let state=setup();for(const mode of ['meaning','reading','writing']){const q=getPersonalQuestion(`personal:word-1:${mode}`,state);assert.equal(q.itemId,'personal-word-1');assert.equal(q.sourceType,'personal');assert.equal(q.skill,mode);assert.ok(q.word.reading);for(const lang of ['tr','en'])for(const answer of q.answers[lang])assert.equal(gradeAnswer(q,answer,lang),true);}
 state=upsertPersonalWord(state,{...draft,id:'word-1',en:''},{now});const q=getPersonalQuestion('personal:word-1:meaning',state);assert.equal(q.answers.en[0],'okul');assert.equal(q.englishFallback,true);assert.match(q.explanation.en,/Turkish/);assert.equal(personalWordPool(state)[0].meaning.en,'okul');assert.equal(personalWordPool(state)[0].version,q.version);
 assert.equal(getPersonalQuestion('personal:missing:reading',state),null);assert.equal(getPersonalQuestion('personal:word-1:listening',state),null);
});
test('editing keeps identity and history, cancels active personal rounds and resets existing content reviews only',()=>{
 let state=setup();state=savePersonalForReview(state,'word-1',{now});const oldQ=getPersonalQuestion('personal:word-1:reading',state);state=recordAnswer(state,oldQ,'がっこう',now,'old-answer');state.personal.session=createPersonalSession(state,{mode:'reading',id:'round-1'});const snapshot=structuredClone(state.personal.session),oldDue=state.skillStates['personal-word-1:reading'].dueAt;
 let notesOnly=upsertPersonalWord(state,{...draft,id:'word-1',notes:'A note'},{now:new Date(now.getTime()+60000)});assert.equal(notesOnly.skillStates['personal-word-1:reading'].dueAt,oldDue);assert.equal(notesOnly.personal.session,null);
 const edited=upsertPersonalWord(state,{...draft,id:'word-1',reading:'がくこう'},{now:new Date(now.getTime()+60000)});assert.equal(edited.personal.words[0].id,'word-1');assert.equal(edited.personal.words[0].revision,2);assert.equal(edited.skillStates['personal-word-1:reading'].step,-1);assert.equal(edited.skillStates['personal-word-1:reading'].attempts,1);assert.deepEqual(edited.events,state.events);assert.equal(snapshot.questions[0].word.reading,'がっこう');assert.equal(snapshot.questions[0].version,'personal-word-1-r1');
 assert.equal(renamePersonalDeck(state,'deck-1','Genki 1 · Bölüm 3',{now}).personal.words[0].id,'word-1');
});
test('removing a personal word preserves events, suspends every skill and supports restoration',()=>{
 let state=savePersonalForReview(setup(),'word-1',{now});state.events.push({id:'historic',itemId:'personal-word-1',correct:false});state.skillStates['personal-word-1:listening']={itemId:'personal-word-1',skill:'listening',suspended:true,attempts:2};
 const removed=removePersonalWord(state,'word-1',{now});assert.equal(getPersonalQuestion('personal:word-1:reading',removed),null);assert.equal(personalWordPool(removed).length,0);assert.deepEqual(removed.events,state.events);for(const card of Object.values(removed.skillStates))assert.equal(card.suspended,true);
 const restored=restorePersonalWord(removed,'word-1');assert.ok(getPersonalQuestion('personal:word-1:reading',restored));assert.equal(restored.skillStates['personal-word-1:reading'].suspended,false);assert.equal(restored.skillStates['personal-word-1:listening'].suspended,true);assert.deepEqual(restored.events,state.events);
});
test('practice snapshots a filtered selection and saving for review never fakes successes',()=>{
 let state=setup();for(let i=2;i<=15;i++)state=upsertPersonalWord(state,{...draft,written:`語${i}`,reading:'ご',tags:i%2?'tek':'çift'},{id:`word-${i}`,now});state.personal.search='çift';state.personal.mode='reading';
 const session=createPersonalSession(state,{random:()=>.5,id:'round-1'});assert.equal(session.ids.length,7);assert.equal(new Set(session.ids).size,7);assert.equal(session.questions.length,7);assert.equal(session.questions.every(q=>q.skill==='reading'),true);assert.equal(state.events.length,0);
 const saved=savePersonalForReview(state,'word-1',{now});assert.equal(saved.events.length,0);assert.equal(Object.keys(saved.skillStates).length,2);assert.equal(saved.skillStates['personal-word-1:meaning'].attempts,0);
 state.personal.search='no results';assert.equal(createPersonalSession(state),null);
});
test('CSV preview supports BOM, quotes, embedded newlines, semicolons and explicit atomic confirmation',()=>{
 const source='\uFEFFwritten,reading,tr,en,deck,tags,notes,example\r\n"学校","がっこう","okul","school","Genki 1","Genki 1|Bölüm 3","İlk satır\nİkinci, satır","学校へ行きます。"\r\n';
 const state=base(),preview=preparePersonalImport(source,state);assert.equal(preview.errors.length,0);assert.equal(preview.rows[0].notes,'İlk satır\nİkinci, satır');assert.equal(state.personal.words.length,0);assert.equal(state.personal.decks.length,0);
 let i=0;const imported=applyPersonalImport(state,preview,{now,idFactory:()=>`import-${++i}`});assert.equal(imported.personal.words.length,1);assert.equal(imported.personal.decks[0].name,'Genki 1');assert.equal(imported.events.length,0);assert.equal(Object.keys(imported.skillStates).length,0);
 const semicolon=preparePersonalImport('Japonca;Okunuş;Türkçe;Deste\n本;ほん;kitap;Genki 2',state);assert.equal(semicolon.delimiter,';');assert.equal(semicolon.errors.length,0);assert.equal(semicolon.rows[0].meaning.tr,'kitap');
 const duplicate=preparePersonalImport(source,imported);assert.equal(duplicate.errors[0].code,'duplicate-word');
 const forged=structuredClone(preview);forged.rows.push({...forged.rows[0],written:'本',meaning:{tr:'',en:''}});assert.throws(()=>applyPersonalImport(state,forged,{now,idFactory:()=>`atomic-${++i}`}),code('required'));assert.equal(state.personal.words.length,0);assert.equal(state.personal.decks.length,0);
});
test('invalid CSV is rejected without partially importing rows and export protects spreadsheet formulas',()=>{
 const state=base();for(const source of ['wrong,reading,tr\n学校,がっこう,okul','written,reading,tr\n学校,gakkou,okul','written,reading,tr\n"学校,がっこう,okul','written,reading,tr\n学校,がっこう,okul\n学校,がっこう,okul']){const preview=preparePersonalImport(source,state);assert.ok(preview.errors.length);assert.throws(()=>applyPersonalImport(state,preview),code('csv-invalid'));}
 let own=createPersonalDeck(state,'Genki',{id:'deck-1',now});own=upsertPersonalWord(own,{...draft,written:'=SUM(1)',notes:'+formula'},{id:'formula-1',now});const csv=personalCSV(own);assert.match(csv,/"'=SUM\(1\)"/);assert.match(csv,/"'\+formula"/);assert.equal(preparePersonalImport(personalCSV(base(),{template:true}),base()).errors.length,0);
});
test('personal page escapes user-authored markup, keeps provenance visible and additive migration preserves old records',()=>{
 let state=setup();state=upsertPersonalWord(state,{...draft,id:'word-1',written:'<script>alert(1)</script>',notes:'<img src=x>',tr:'<b>meaning</b>'},{now});
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const feature=createPersonalFeature({getState:()=>state,commit:async()=>true,ui:()=>({T:(tr,en)=>tr,L:value=>value.tr,esc,icon:()=>''}),toast:()=>{}}),html=feature.page();assert.doesNotMatch(html,/<script>|<img src=x>|<b>meaning/);assert.match(html,/&lt;script&gt;/);assert.match(html,/otomatik çevrilmez/);
 const migrated=hydrateState({schemaVersion:3,settings:{language:'en'},events:[{id:'old'}],personal:{decks:[{id:'deck-1',name:'Genki'}]}});assert.deepEqual(migrated.events,[{id:'old'}]);assert.equal(migrated.personal.showReading,true);assert.equal(migrated.personal.selectedDeckId,'all');assert.equal(migrated.personal.decks.length,1);
});
test('a rejected storage commit preserves word and deck form drafts for the next repaint',async()=>{
 const state=createPersonalDeck(base(),'Existing deck',{id:'deck-1',now}),esc=value=>String(value??'').replace(/"/gu,'&quot;'),u={T:tr=>tr,L:value=>value.tr,esc,icon:()=>''};
 const feature=createPersonalFeature({getState:()=>state,commit:async()=>false,render:()=>{},ui:()=>u,toast:()=>{}}),OriginalFormData=globalThis.FormData;
 globalThis.FormData=class{constructor(form){this.values=form.values;}get(key){return this.values[key]??null;}*[Symbol.iterator](){yield*Object.entries(this.values);}};
 try{
  await feature.submit({dataset:{form:'personal-word'},values:{...draft,notes:'Not saved yet'}});
  let html=feature.page();assert.match(html,/data-form="personal-word"/);assert.match(html,/Not saved yet/);assert.match(html,/value="学校"/);assert.equal(state.personal.words.length,0);
  await feature.submit({dataset:{form:'personal-deck'},values:{name:'Uncommitted deck'}});html=feature.page();assert.match(html,/value="Uncommitted deck"/);assert.equal(state.personal.decks.length,1);
 }finally{globalThis.FormData=OriginalFormData;}
});
test('a newer CSV file selection wins when earlier file reads finish out of order',async()=>{
 const state=base(),u={T:tr=>tr,L:value=>value.tr,esc:value=>String(value??''),icon:()=>''},feature=createPersonalFeature({getState:()=>state,commit:async()=>true,render:()=>{},ui:()=>u,toast:()=>{}});
 let finishFirst,finishSecond;
 const target=finish=>({matches:selector=>selector==='[data-personal-file="csv"]',files:[{size:40,text:()=>new Promise(resolve=>finish(resolve))}]});
 const first=feature.change(target(resolve=>{finishFirst=resolve;}));for(let i=0;!finishFirst&&i<10;i++)await Promise.resolve();assert.equal(typeof finishFirst,'function');
 const second=feature.change(target(resolve=>{finishSecond=resolve;}));for(let i=0;!finishSecond&&i<10;i++)await Promise.resolve();assert.equal(typeof finishSecond,'function');
 finishSecond('second-file-marker');await second;finishFirst('first-file-marker');await first;
 const html=feature.page();assert.match(html,/second-file-marker/);assert.doesNotMatch(html,/first-file-marker/);assert.equal(state.personal.words.length,0);
});
