import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultExams,normaliseExams,isExamSession,createExamSession,saveExamAnswer,finishExamSession,finishExamState,scoreExamSession,examRemaining,markExamAudioUnavailable,examReadings} from '../dist/src/exam-data.js';
import {createExamFeature} from '../dist/src/exam-feature.js';
import {createJapaneseSpeech} from '../dist/src/word-speech.js';
import {studyWords,studyGrammar} from '../dist/src/study-data.js';
import {isExamSession as sharedExamValidation} from '../dist/src/exam-schema.js';

const now=Date.parse('2026-11-05T10:00:00Z');
const make=(options={},extra={})=>createExamSession({...defaultExams(),...options},{now,id:'exam-one',random:()=>.25,...extra});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const u={T:(tr,en)=>tr,esc};
const root={querySelector:()=>null,querySelectorAll:()=>[]};
function harness(session=null,{voices=true,deferCommit=false}={}){
 let state={settings:{language:'tr'},events:[{id:'srs-before'}],skillStates:{card:{attempts:2}},exams:{...defaultExams(),session}},commits=0,commitRelease,feature,pending;
 const spoken=[];let supported=voices;
 class Utterance{constructor(text){this.text=text;}}
 const player=createJapaneseSpeech({engine:{getVoices:()=>supported?[{lang:'ja-JP'}]:[],cancel(){pending=null;},speak(value){pending=value;spoken.push(value);}},Utterance,onChange:snapshot=>feature?.onSpeechChange(snapshot)});
 const commit=async next=>{commits++;if(deferCommit)await new Promise(resolve=>{commitRelease=resolve;});state=next;return true;};
 feature=createExamFeature({getState:()=>state,commit,ui:()=>u,toast(){},isBusy:()=>false,player,root});
 return {feature,player,spoken,get state(){return state;},get commits(){return commits;},get pending(){return pending;},release(){commitRelease?.();},removeVoice(){supported=false;}};
}
const scope=s=>({examSession:s.id,examQuestion:s.questions[s.index].id,examIndex:String(s.index)});

test('each approximate level has 20 unique real section items, or 24 with available optional audio',()=>{
 for(const level of ['N5','N4','N3','N2','N1']){
  for(const language of ['tr','en']){
   const s=make({level,includeListening:true},{hasAudio:true,language});assert.equal(s.questions.length,24);assert.equal(new Set(s.questions.map(q=>q.id)).size,24);
   assert.deepEqual(['vocabulary','grammar','reading','listening'].map(section=>s.questions.filter(q=>q.section===section).length),[8,6,6,4]);
   for(const q of s.questions){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.answerIndex>=0&&q.answerIndex<4);assert.ok(q.explanation.length>5);}
   const reading=s.questions.filter(q=>q.section==='reading');assert.ok(reading.every(q=>q.passage.length>110));assert.equal(new Set(reading.map(q=>q.passage)).size,1);assert.equal(new Set(reading.map(q=>q.prompt)).size,6);assert.ok(reading.every(q=>!q.sourceId));
   assert.ok(s.questions.filter(q=>q.section==='vocabulary').every(q=>!studyWords.find(word=>word.id===q.sourceId).technical));
   for(const q of s.questions.filter(q=>q.section==='grammar')){const item=studyGrammar.find(item=>item.id===q.sourceId);assert.equal(q.choices[q.answerIndex],item.target);assert.equal(q.context.replace('［　］',q.choices[q.answerIndex]),item.example.ja);assert.equal(q.translation,item.example.translation[language]);}
  }
  const without=make({level,includeListening:true},{hasAudio:false});assert.equal(without.questions.length,20);assert.equal(without.listeningStatus,'not-taken');assert.equal(without.listeningReason,'no-voice');assert.equal(scoreExamSession(without).sections[3].status,'not-taken');
 }
 assert.equal(examReadings.length,5);assert.equal(new Set(examReadings.map(p=>p.text)).size,5);
});

test('vocabulary distractors are unique same-level same-topic words and listening uses different source words',()=>{
 const words=new Map(studyWords.map(word=>[word.id,word]));
 for(const level of ['N5','N4','N3','N2','N1']){
  const s=make({level,includeListening:true},{hasAudio:true});
  for(const q of s.questions.filter(q=>['vocabulary','listening'].includes(q.section))){
   const source=words.get(q.sourceId),allowed=studyWords.filter(w=>w.level===level&&w.category===source.category).map(w=>w.meaning.tr);
   assert.ok(q.choices.every(choice=>allowed.includes(choice)));assert.equal(q.choices[q.answerIndex],source.meaning.tr);
  }
  const vocab=new Set(s.questions.filter(q=>q.section==='vocabulary').map(q=>q.sourceId));assert.ok(s.questions.filter(q=>q.section==='listening').every(q=>!vocab.has(q.sourceId)));
 }
});

test('questions, choices, explanations, language and deadline survive reload without borrowing current corpus references',()=>{
 const s=make({includeListening:true},{language:'en',hasAudio:true});const reloaded=JSON.parse(JSON.stringify(s));assert.deepEqual(reloaded,s);
 const word=studyWords.find(w=>w.id===s.questions[0].sourceId),before=word.meaning.en;word.meaning.en='changed after the test started';
 try{assert.deepEqual(s,reloaded);assert.ok(!s.questions[0].explanation.includes('changed after'));}finally{word.meaning.en=before;}
 assert.equal(examRemaining(reloaded,now+120000),18*60000);assert.equal(examRemaining(reloaded,now+99999999),0);assert.equal(reloaded.deadline,new Date(now+20*60000).toISOString());
});

test('saving accepts only current session/question/index and valid choices before the persistent deadline',()=>{
 const s=make(),q=s.questions[0],input={sessionId:s.id,questionId:q.id,index:0,choice:q.answerIndex};
 for(const invalid of [{sessionId:'old'},{questionId:'old-question'},{index:1},{choice:-1},{choice:4},{choice:1.1}])assert.equal(saveExamAnswer(s,{...input,...invalid},{now}),s);
 assert.equal(saveExamAnswer(s,input,{now:now+20*60000}),s);
 const answered=saveExamAnswer(s,input,{now});assert.notEqual(answered,s);assert.deepEqual(s.answers,{});assert.equal(answered.answers[q.id].choice,q.answerIndex);
 const done=finishExamSession(answered,{now:now+1000});assert.equal(saveExamAnswer(done,input,{now}),done);
});

test('final results separate correct, wrong and unanswered without writing SRS or duplicating completion/history',()=>{
 let s=make();s=saveExamAnswer(s,{sessionId:s.id,questionId:s.questions[0].id,index:0,choice:s.questions[0].answerIndex},{now});s.index=1;s=saveExamAnswer(s,{sessionId:s.id,questionId:s.questions[1].id,index:1,choice:(s.questions[1].answerIndex+1)%4},{now});
 const state={events:[{id:'retained'}],skillStates:{key:{attempts:10}},exams:{...defaultExams(),session:s,history:[]}},finished=finishExamState(state,{now:now+5000});
 assert.equal(finished.exams.session.phase,'finished');assert.equal(finished.exams.session.result.correct,1);assert.equal(finished.exams.session.result.wrong,1);assert.equal(finished.exams.session.result.blank,18);assert.equal(finished.exams.session.result.total,20);assert.deepEqual(finished.events,state.events);assert.deepEqual(finished.skillStates,state.skillStates);assert.equal(state.exams.history.length,0);
 assert.equal(finishExamState(finished,{now:now+6000}),finished);assert.equal(finished.exams.history.length,1);
 const many={...state,exams:{...state.exams,history:Array.from({length:35},(_,index)=>({...finished.exams.session,id:'historic-'+index}))}};assert.equal(finishExamState(many,{now:now+5000}).exams.history.length,30);
});

test('listening rejects a selected answer without completed evidence and lost audio is not fabricated as a wrong answer',()=>{
 let s=make({includeListening:true},{hasAudio:true});s.index=20;const q=s.questions[20],input={sessionId:s.id,questionId:q.id,index:20,choice:q.answerIndex};
 assert.equal(saveExamAnswer(s,input,{now}),s);assert.equal(saveExamAnswer(s,input,{now,audioEvidence:{audioPlaybackCompleted:false}}),s);
 s=saveExamAnswer(s,input,{now,audioEvidence:{audioPlaybackCompleted:true,audioSource:'browser-tts'}});
 const lost=markExamAudioUnavailable(s);assert.equal(lost.audioUnavailableIds.length,3);assert.equal(lost.answers[q.id].choice,q.answerIndex);
 const result=finishExamSession(lost,{now:now+5000,hasAudio:false}).result,section=result.sections[3];assert.equal(section.correct,1);assert.equal(section.wrong,0);assert.equal(section.blank,0);assert.equal(section.notTaken,3);assert.equal(section.status,'partial');assert.equal(result.total,21);
 const none=finishExamSession(make({includeListening:true},{hasAudio:true}),{now:now+1000,hasAudio:false});assert.equal(none.result.sections[3].status,'not-taken');assert.equal(none.result.total,20);assert.equal(none.result.wrong,0);
});

test('the controller hides listening Japanese and all explanations until final submission',()=>{
 const s=make({includeListening:true},{hasAudio:true,now:Date.now()});s.index=20;const h=harness(s),q=s.questions[20],html=h.feature.page();
 assert.ok(!html.includes(q.written));assert.ok(!html.includes(q.reading));assert.ok(!html.includes(esc(q.explanation)));assert.match(html,/<fieldset class="exam-choices" disabled/);assert.ok(!html.includes('exam-review-item'));
 const finished=finishExamSession(s,{now:Date.now()});const result=harness(finished).feature.page();assert.ok(result.includes(esc(q.explanation)));assert.ok(result.includes('exam-review-item'));assert.ok(result.includes('Doğru cevap'));
});

test('controller playback completion gates choice saving and stale/detached forms cannot answer another question',async()=>{
 const s=make({includeListening:true},{hasAudio:true,now:Date.now()});s.index=20;const h=harness(s),q=s.questions[20];h.feature.page();
 const currentForm={dataset:scope(s)},choice={dataset:{examChoice:'true'},checked:true,value:String(q.answerIndex),closest:()=>currentForm};
 await h.feature.change(choice);assert.equal(h.commits,0);
 await h.feature.click({dataset:{action:'exam-play',...scope(s),speed:'normal'}});assert.equal(h.spoken.at(-1).text,q.reading);h.pending.onstart();await h.feature.change(choice);assert.equal(h.commits,0);
 h.pending.onend();await h.feature.change({...choice,closest:()=>({dataset:{...scope(s),examSession:'old'}})});assert.equal(h.commits,0);
 await h.feature.change(choice);assert.equal(h.commits,1);assert.equal(h.state.exams.session.answers[q.id].audioPlaybackCompleted,true);assert.deepEqual(h.state.events,[{id:'srs-before'}]);
 // Completed evidence is memory-only: a re-created controller must replay, even with a saved answer.
 const reloaded=harness(h.state.exams.session);await reloaded.feature.change(choice);assert.equal(reloaded.commits,0);
});

test('cancelled or failed audio never unlocks an exam question',async()=>{
 for(const fail of ['cancel','error']){
  const s=make({includeListening:true},{hasAudio:true,now:Date.now()});s.index=20;const h=harness(s);h.feature.page();await h.feature.click({dataset:{action:'exam-play',...scope(s),speed:'slow'}});const utterance=h.pending;utterance.onstart();if(fail==='cancel')h.player.stop();else utterance.onerror({error:'synthesis-failed'});utterance.onend();
  await h.feature.change({dataset:{examChoice:'true'},checked:true,value:'0',closest:()=>({dataset:scope(s)})});assert.equal(h.commits,0);
 }
});

test('deadline tick finalizes persisted expired sessions and concurrent finishes produce one history record',async()=>{
 const expired=make({}, {now:Date.now()-86400000}),h=harness(expired,{deferCommit:true});const first=h.feature.tick();const second=h.feature.tick();assert.equal(h.commits,1);h.release();await Promise.all([first,second]);
 assert.equal(h.state.exams.session.phase,'finished');assert.equal(h.state.exams.session.finishReason,'deadline');assert.equal(h.state.exams.history.length,1);assert.equal(h.state.exams.session.result.blank,20);assert.equal(h.state.exams.session.result.wrong,0);
 await h.feature.click({dataset:{action:'exam-finish',examSession:expired.id}});assert.equal(h.commits,1);
});

test('loss of the Japanese voice excludes only unanswered listening items and does not finish early',async()=>{
 const s=make({includeListening:true},{hasAudio:true,now:Date.now()}),h=harness(s);h.removeVoice();await h.feature.tick();assert.equal(h.state.exams.session.phase,'active');assert.equal(h.state.exams.session.audioUnavailableIds.length,4);assert.equal(h.state.events.length,1);assert.equal(h.commits,1);await h.feature.tick();assert.equal(h.commits,1);
});

test('outdated navigation cannot move a new question or finish a different exam session',async()=>{
 const s=make({}, {now:Date.now()}),h=harness(s),originalScope=scope(s);
 await h.feature.click({dataset:{action:'exam-next',...originalScope}});assert.equal(h.state.exams.session.index,1);assert.equal(h.commits,1);
 await h.feature.click({dataset:{action:'exam-next',...originalScope}});assert.equal(h.state.exams.session.index,1);assert.equal(h.commits,1);
 await h.feature.click({dataset:{action:'exam-finish',examSession:'previous-session'}});assert.equal(h.commits,1);assert.equal(h.state.exams.session.phase,'active');
 await h.feature.submit({dataset:{form:'exam-answer',...originalScope}});assert.equal(h.commits,1);
});

test('normalisation rejects malformed imported histories rather than rendering invented or broken results',()=>{
 const valid=finishExamSession(make(),{now:now+1000}),invalid=[{id:'only-id'},{...valid,questions:null},{...valid,questions:[{...valid.questions[0],answerIndex:8}]},{...valid,deadline:valid.startedAt},{...valid,answers:{missing:{choice:0,answeredAt:new Date(now).toISOString()}}}];
 assert.ok(isExamSession(valid));assert.ok(invalid.every(item=>!isExamSession(item)));
 const clean=normaliseExams({level:'N8',durationMinutes:0,session:{id:'malformed'},history:[...invalid,valid,valid]});assert.equal(clean.session,null);assert.equal(clean.level,'N5');assert.equal(clean.durationMinutes,20);assert.equal(clean.history.length,1);assert.equal(clean.history[0].id,valid.id);
 const completed=finishExamState({exams:{...defaultExams(),session:make(),history:[null,...invalid]}},{now:now+1000});assert.equal(completed.exams.history.length,1);
 assert.equal(isExamSession,sharedExamValidation);
 for(const invalidField of [{version:undefined},{version:'x'.repeat(201)},{questions:[{...valid.questions[0],choices:['a','b','c','d'.repeat(2001)]}]},{questions:[{...valid.questions[14],passageTitle:{unsafe:'object'}}]},{questions:[{...valid.questions[0],translation:[]}]},{questions:[{...valid.questions[0],passage:'text',passageTitle:undefined}]}])assert.equal(sharedExamValidation({...valid,index:0,...invalidField}),false);
});
