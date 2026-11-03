import test from 'node:test';
import assert from 'node:assert/strict';
import {aggregateWeakness,createWeaknessSession,defaultWeakness,weaknessConfig,weaknessQuestion,weaknessScope} from '../dist/src/weakness-data.js';
import {createWeaknessFeature} from '../dist/src/weakness-feature.js';
const now=new Date('2026-11-03T12:00:00Z');
const question=(id='q-school',itemId='school',skill='reading',extra={})=>({id,itemId,skill,version:'test-v1',context:'学校',word:{written:'学校',reading:'がっこう'},prompt:{tr:'Okunuş?',en:'Reading?'},answers:{tr:['がっこう'],en:['がっこう']},explanation:{tr:'学校 → がっこう',en:'学校 → がっこう'},sourceType:'vocabulary',...extra});
const event=(id,extra={})=>({id,questionId:'q-school',itemId:'school',skill:'reading',correct:false,answeredAt:'2026-11-02T12:00:00Z',...extra});
const resolver=id=>id==='q-school'?question():null;
const all=(events,options={})=>aggregateWeakness(events,{getQuestion:resolver,history:'all',now,...options});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ui={T:(tr,en)=>tr,L:value=>value.tr,esc,icon:()=>'',showQuestionReadings:false};

test('wrong then independently correct stays in history with honest latest status and separate skills',()=>{
 const events=[event('wrong'),event('correct',{correct:true,answeredAt:'2026-11-03T10:00:00Z'}),event('meaning-wrong',{questionId:'meaning',skill:'meaning'})];
 const rows=all(events,{getQuestion:id=>id==='meaning'?question('meaning','school','meaning'):resolver(id)});
 const reading=rows.find(row=>row.skill==='reading');assert.equal(rows.length,2);assert.equal(reading.attempts,2);assert.equal(reading.wrong,1);assert.equal(reading.independentCorrect,1);assert.equal(reading.latestOutcome,'independent-correct');assert.equal(reading.unresolved,false);
 assert.equal(aggregateWeakness(events,{getQuestion:resolver,now,history:'unresolved'}).some(row=>row.skill==='reading'),false);
 assert.equal(aggregateWeakness(events,{getQuestion:resolver,now}).some(row=>row.skill==='reading'),true);
 assert.deepEqual(events[0],event('wrong'));
});
test('reveals and both hint flags count once as difficulty but are reported in separate overlapping columns',()=>{
 const rows=all([event('a',{readingHintShown:true,pronunciationHintRequested:true}),event('b',{revealed:true}),event('c',{correct:true,readingHintShown:true,answeredAt:'2026-11-03T10:00:00Z'})]);
 assert.equal(rows[0].attempts,3);assert.equal(rows[0].difficultyCount,3);assert.equal(rows[0].wrong,1);assert.equal(rows[0].revealed,1);assert.equal(rows[0].assisted,2);assert.equal(rows[0].assistedCorrect,1);assert.equal(rows[0].independentCorrect,0);assert.equal(rows[0].latestOutcome,'assisted-correct');assert.equal(rows[0].unresolved,true);
 assert.equal(all([event('dup'),event('dup')])[0].attempts,1);
 assert.deepEqual(all([]),[]);
});
test('deleted or mismatched questions remain visible but never become fabricated practice questions',()=>{
 const missing=all([event('a',{questionId:'deleted'})]);assert.equal(missing[0].available,false);assert.equal(missing[0].itemId,'school');assert.equal(createWeaknessSession(missing),null);
 const mismatch=all([event('b')],{getQuestion:()=>question('q-school','different')});assert.equal(mismatch[0].available,false);
 const fallback=all([event('older'),event('newer',{questionId:'deleted',answeredAt:'2026-11-03T10:00:00Z'})]);assert.equal(fallback[0].available,true);assert.equal(fallback[0].questionId,'q-school');
 assert.doesNotThrow(()=>all([event('throws')],{getQuestion:()=>{throw Error('Deleted');}}));
});
test('filters keep actual weak history and simple ordering prioritizes recent difficulty',()=>{
 const events=[event('old',{questionId:'old',itemId:'old',answeredAt:'2026-08-01T00:00:00Z'}),event('new',{questionId:'new',itemId:'new',skill:'listening',correct:true,pronunciationHintRequested:true,answeredAt:'2026-11-03T00:00:00Z'})];
 const getQuestion=id=>question(id,id,id==='new'?'listening':'reading',{sourceType:id==='new'?'listening':'personal'});
 const rows=all(events,{getQuestion});assert.deepEqual(rows.map(row=>row.itemId),['new','old']);
 assert.equal(all(events,{getQuestion,history:'recent'}).length,1);assert.equal(all(events,{getQuestion,type:'personal'})[0].itemId,'old');assert.equal(all(events,{getQuestion,skill:'listening'})[0].itemId,'new');assert.equal(all(events,{getQuestion,reason:'wrong'})[0].itemId,'old');assert.equal(all(events,{getQuestion,reason:'assisted'})[0].itemId,'new');
});
test('a short round snapshots at most ten distinct actual questions and discloses unavailable rows',()=>{
 const events=Array.from({length:16},(_,i)=>event('event-'+i,{questionId:'q'+i,itemId:'item'+i})),questions=new Map(events.map(e=>[e.questionId,question(e.questionId,e.itemId)]));
 const rows=all(events,{getQuestion:id=>id==='q0'?null:questions.get(id)}),session=createWeaknessSession(rows,{limit:100,id:'round',now});
 assert.equal(session.ids.length,10);assert.equal(new Set(session.ids).size,10);assert.equal(session.skippedUnavailable,1);assert.deepEqual(session.eventIds,[]);assert.deepEqual(session.readingHintIds,[]);assert.equal(session.phase,'exercise');
 const original=questions.get(session.ids[0]);original.context='changed';assert.equal(weaknessQuestion(session).context,'学校');assert.equal(weaknessScope(session),'weakness:round:0');
 assert.equal(weaknessConfig({type:'bad',skill:'bad',reason:'bad',history:'bad',size:999}).size,5);assert.equal(defaultWeakness().session,null);
});
function harness({q=question(),gate,evidence,renderExercise}={}){
 let state={settings:{language:'tr',timezone:'Europe/Istanbul',questionReadings:false},events:[event('history',{questionId:q.id,itemId:q.itemId,skill:q.skill})],skillStates:{},weakness:defaultWeakness()},started=[],toasts=[],available=true;
 const feature=createWeaknessFeature({getState:()=>state,commit:async next=>{state=next;return true;},ui,toast:value=>toasts.push(value),getQuestion:id=>available&&id===q.id?q:null,isBusy:()=>false,onQuestionStart:(question,scope)=>started.push({id:question?.id,scope}),canAnswer:gate,answerEvidence:evidence,renderExercise});
 return {feature,started,toasts,get state(){return state;},set state(value){state=value;},set available(value){available=value;}};
}
async function withForm(answer,callback,session){const NativeFormData=globalThis.FormData;globalThis.FormData=class{constructor(form){this.form=form;}get(name){return name==='answer'?answer:null;}};try{return await callback({dataset:{form:'weakness-answer',sessionId:session?.id,questionId:session?.ids[session.index],questionIndex:String(session?.index)}});}finally{globalThis.FormData=NativeFormData;}}
test('starting and filtering a weakness round never fabricates answers or silently changes its snapshot',async()=>{
 const h=harness();assert.equal(await h.feature.click({dataset:{action:'weakness-start'}}),true);assert.equal(h.state.events.length,1);assert.equal(h.state.weakness.session.ids.length,1);assert.equal(h.started.length,1);
 const ids=[...h.state.weakness.session.ids];await h.feature.change({dataset:{weaknessFilter:'skill'},value:'meaning'});assert.deepEqual(h.state.weakness.session.ids,ids);
 assert.equal(await h.feature.click({dataset:{action:'unrelated'}}),false);assert.equal(await h.feature.change({dataset:{other:'x'}}),false);
});
test('listening weaknesses use the delegated hidden renderer and cannot record before the completion gate',async()=>{
 let ready=false,calls=[];const q=question('listen:school','school','listening',{sourceType:'listening'}),h=harness({q,gate:(question,scope)=>{calls.push(scope);return ready;},evidence:()=>({audioPlaybackCompleted:ready}),renderExercise:(question,event,options)=>`<form data-form="${options.form}" data-scope="${options.scopeKey}">audio-only</form>`});
 await h.feature.click({dataset:{action:'weakness-start'}});const page=h.feature.page();assert.match(page,/audio-only/);assert.doesNotMatch(page,/学校/);
 await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);assert.equal(h.state.events.length,1);assert.equal(h.state.weakness.session.feedback,null);assert.ok(h.toasts.length);
 ready=true;await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);assert.equal(h.state.events.length,2);assert.equal(h.state.events.at(-1).skill,'listening');assert.equal(h.state.events.at(-1).readingHintShown,false);assert.equal(calls[0],`weakness:${h.state.weakness.session.id}:0`);
});
test('answers use the existing schedule, retain hints/evidence and cannot be recorded twice',async()=>{
 const h=harness({gate:()=>true,evidence:()=>({audioCompleted:true,id:'must-not-override',correct:false})});await h.feature.click({dataset:{action:'weakness-start'}});
 h.state.weakness.session.readingHintIds=['q-school'];h.state.weakness.session.pronunciationHintIds=['q-school'];
 await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);const answer=h.state.events.at(-1);assert.equal(answer.correct,true);assert.notEqual(answer.id,'must-not-override');assert.equal(answer.audioCompleted,true);assert.equal(answer.readingHintShown,true);assert.equal(answer.pronunciationHintRequested,true);assert.equal(answer.mode,'weakness');assert.ok(h.state.skillStates['school:reading'].dueAt);
 await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);assert.equal(h.state.events.length,2);
 await h.feature.click({dataset:{action:'weakness-next'}});assert.equal(h.state.weakness.session.phase,'done');await h.feature.click({dataset:{action:'weakness-close'}});assert.equal(h.state.weakness.session,null);assert.equal(h.state.events.length,2);
});
test('a stale asynchronous gate and an unavailable listening renderer never save unverified answers',async()=>{
 let release;const q=question('listen:school','school','listening',{sourceType:'listening'}),h=harness({q,gate:()=>new Promise(resolve=>{release=resolve;})});await h.feature.click({dataset:{action:'weakness-start'}});assert.doesNotMatch(h.feature.page(),/学校/);
 await withForm('がっこう',async form=>{const pending=h.feature.submit(form);h.state.weakness.session.index=1;release(true);await pending;},h.state.weakness.session);assert.equal(h.state.events.length,1);
 const ungated=harness({q});await ungated.feature.click({dataset:{action:'weakness-start'}});await withForm('がっこう',form=>ungated.feature.submit(form),ungated.state.weakness.session);assert.equal(ungated.state.events.length,1);
});
test('unavailable historical records are escaped and skipping a missing snapshot does not create an answer',async()=>{
 const h=harness();h.state.events=[event('gone',{questionId:'gone',itemId:'<img src=x>'})];const page=h.feature.page();assert.match(page,/kullanılamıyor/);assert.doesNotMatch(page,/<img src=x>/);assert.match(page,/Kullanılamayan geçmiş kayıt/);
 h.state.weakness.session={id:'broken-round',ids:['missing'],questions:[null],index:0,eventIds:[],phase:'exercise',feedback:null};assert.match(h.feature.page(),/weakness-skip/);await h.feature.click({dataset:{action:'weakness-skip'}});assert.equal(h.state.weakness.session.phase,'done');assert.equal(h.state.events.length,1);assert.deepEqual(h.state.weakness.session.skippedMissing,['missing']);
});
test('deleting a question during a frozen round blocks answering and permits an honest skip',async()=>{
 const h=harness();await h.feature.click({dataset:{action:'weakness-start'}});const ids=[...h.state.weakness.session.ids];h.available=false;
 assert.match(h.feature.page(),/weakness-skip/);assert.doesNotMatch(h.feature.page(),/学校/);await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);assert.equal(h.state.events.length,1);assert.deepEqual(h.state.weakness.session.ids,ids);
 await h.feature.click({dataset:{action:'weakness-skip'}});assert.equal(h.state.weakness.session.phase,'done');assert.equal(h.state.events.length,1);
});
test('deleting after a recorded answer preserves its snapshot feedback and never labels it unanswered',async()=>{
 const h=harness();await h.feature.click({dataset:{action:'weakness-start'}});await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);h.available=false;
 assert.match(h.feature.page(),/Doğru, böyle devam/);await h.feature.click({dataset:{action:'weakness-skip'}});assert.equal(h.state.weakness.session.index,0);
 await h.feature.click({dataset:{action:'weakness-next'}});assert.equal(h.state.weakness.session.phase,'done');assert.deepEqual(h.state.weakness.session.skippedMissing,[]);assert.equal(h.state.events.length,2);
});
test('rendered forms are stamped and detached forms from a previous round are rejected',async()=>{
 const h=harness();await h.feature.click({dataset:{action:'weakness-start'}});const old=structuredClone(h.state.weakness.session),page=h.feature.page();
 assert.match(page,new RegExp(`data-session-id="${old.id}"`));assert.match(page,/data-question-id="q-school"/);assert.match(page,/data-question-index="0"/);
 await h.feature.click({dataset:{action:'weakness-close'}});await h.feature.click({dataset:{action:'weakness-start'}});assert.notEqual(h.state.weakness.session.id,old.id);
 await withForm('がっこう',form=>h.feature.submit(form),old);assert.equal(h.state.events.length,1);
 await withForm('がっこう',form=>{form.dataset.questionIndex='99';return h.feature.submit(form);},h.state.weakness.session);assert.equal(h.state.events.length,1);
});
test('listening requires completed playback evidence even if a misconfigured gate returns true',async()=>{
 const q=question('listening:school','school','listening',{sourceType:'listening'}),h=harness({q,gate:()=>true,evidence:()=>({})});await h.feature.click({dataset:{action:'weakness-start'}});
 await withForm('がっこう',form=>h.feature.submit(form),h.state.weakness.session);assert.equal(h.state.events.length,1);assert.ok(h.toasts.length);
 const valid=harness({q,gate:()=>true,evidence:()=>({audioPlaybackCompleted:true})});await valid.feature.click({dataset:{action:'weakness-start'}});valid.state.settings.questionReadings=true;valid.state.weakness.session.readingHintIds=[q.id];valid.state.weakness.session.pronunciationHintIds=[q.id];
 await withForm('がっこう',form=>valid.feature.submit(form),valid.state.weakness.session);assert.equal(valid.state.events.at(-1).readingHintShown,false);assert.equal(valid.state.events.at(-1).pronunciationHintRequested,false);assert.equal(valid.state.events.at(-1).audioPlaybackCompleted,true);
});
test('removed personal labels are friendly and available user text remains escaped',()=>{
 const h=harness();h.state.events=[event('removed',{questionId:'personal:internal-uuid:reading',itemId:'personal-internal-uuid'})];const page=h.feature.page();assert.match(page,/Kaldırılmış kişisel kelime/);assert.doesNotMatch(page,/internal-uuid/);
 const unsafe=harness({q:question('q-school','school','reading',{word:{written:'<img src=x>',reading:'がっこう'}})});assert.match(unsafe.feature.page(),/&lt;img src=x&gt;/);assert.doesNotMatch(unsafe.feature.page(),/<img src=x>/);
});
