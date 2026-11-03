import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,hydrateState,recordAnswer,gradeAnswer,dueStates} from '../dist/src/model.js';
import {createPersonalDeck,upsertPersonalWord,getPersonalQuestion,savePersonalForReview,removePersonalWord,restorePersonalWord,preparePersonalImport,applyPersonalImport,personalWordPool} from '../dist/src/personal-data.js';
import {getListeningQuestion,createListeningSession,filterListeningWords,listeningKey} from '../dist/src/listening-data.js';
import {createListeningFeature} from '../dist/src/listening-feature.js';
import {createWeaknessFeature} from '../dist/src/weakness-feature.js';
import {createJapaneseSpeech} from '../dist/src/word-speech.js';

const now=new Date('2026-11-03T09:00:00Z');
function school(){
 let state=freshState();state.settings.timezone='Europe/Istanbul';
 state=createPersonalDeck(state,'Genki 1',{id:'deck-main',now});
 return upsertPersonalWord(state,{deckId:'deck-main',written:'学校',reading:'がっこう',tr:'okul',en:'school',tags:['Genki 1','Bölüm 1']},{id:'word-school',now});
}
test('personal reading and listening answers keep separate skill cards and schedules for the same word',()=>{
 let state=savePersonalForReview(school(),'word-school',{now});
 const reading=getPersonalQuestion('personal:word-school:reading',state),listening=getListeningQuestion('listening:personal:word-school:dictation',state);
 assert.equal(listening.itemId,reading.itemId);assert.equal(listening.skill,'listening');assert.equal(reading.skill,'reading');
 state=recordAnswer(state,reading,'がっこう',now,'reading-event',100,'personal');
 const readingCard=structuredClone(state.skillStates['personal-word-school:reading']);
 state=recordAnswer(state,listening,'まちがい',now,'listening-event',100,'listening');
 assert.deepEqual(state.skillStates['personal-word-school:reading'],readingCard);
 assert.equal(state.skillStates['personal-word-school:listening'].correct,0);
 assert.equal(state.skillStates['personal-word-school:listening'].dueAt,'2026-11-03T09:10:00.000Z');
 assert.equal(state.skillStates['personal-word-school:meaning'].attempts,0);
 assert.deepEqual(state.events.map(event=>event.skill),['reading','listening']);
});
test('editing personal content does not rewrite a frozen listening question or old answer version',()=>{
 const state=school(),config={...state.listening,source:'personal',deckId:'all',mode:'dictation'};
 const round=createListeningSession(state,config,()=>0,'listening-round'),snapshot=round.questions[0];state.personal.session={id:'other-round'};
 const edited=upsertPersonalWord(state,{id:'word-school',deckId:'deck-main',written:'学園',reading:'がくえん',tr:'eğitim kurumu',en:'educational institution'},{now:new Date(now.getTime()+60000)});
 const current=getListeningQuestion(snapshot.id,edited);
 assert.notEqual(current.version,snapshot.version);assert.equal(snapshot.word.written,'学校');assert.equal(current.word.written,'学園');
 assert.equal(gradeAnswer(snapshot,'がっこう','tr'),true);assert.equal(gradeAnswer(current,'がっこう','tr'),false);assert.equal(gradeAnswer(current,'がくえん','tr'),true);
 assert.equal(edited.personal.session,null);
 const answered=recordAnswer(edited,snapshot,'がっこう',now,'frozen-answer',10,'listening');
 assert.equal(answered.events.at(-1).contentVersion,snapshot.version);assert.equal(answered.events.at(-1).correct,true);
});
test('removing and restoring a personal word covers listening cards without destroying history or manual suspension',()=>{
 let state=savePersonalForReview(school(),'word-school',{now});
 const listening=getListeningQuestion('listening:personal:word-school:meaning',state);
 state=recordAnswer(state,listening,'okul',now,'old-listening-answer',100,'listening');
 state.skillStates['personal-word-school:reading'].suspended=true;
 const events=structuredClone(state.events),removed=removePersonalWord(state,'word-school',{now});
 assert.equal(getPersonalQuestion('personal:word-school:meaning',removed),null);assert.equal(getListeningQuestion(listening.id,removed),null);
 assert.ok(Object.values(removed.skillStates).every(card=>card.suspended));assert.equal(dueStates(removed,now).length,0);assert.deepEqual(removed.events,events);
 const restored=restorePersonalWord(removed,'word-school');
 assert.equal(restored.skillStates['personal-word-school:meaning'].suspended,false);assert.equal(restored.skillStates['personal-word-school:reading'].suspended,true);assert.equal(restored.skillStates['personal-word-school:listening'].suspended,false);
 assert.ok(getListeningQuestion(listening.id,restored));assert.deepEqual(restored.events,events);
});
test('CSV preview/import makes only validated personal words available to listening and creates no answer events',()=>{
 const empty=freshState(),text='written,reading,tr,en,deck,tags,notes,example,level\n学校,がっこう,okul,school,Genki 1,Genki 1|Bölüm 1,"iki satır\nnot",学校へ行きます。,N5\nコーヒー,コーヒー,kahve,coffee,Genki 1,İş|İçecek,,,N5';
 const preview=preparePersonalImport(text,empty);assert.deepEqual(preview.errors,[]);assert.equal(empty.personal.words.length,0);
 let sequence=0;const imported=applyPersonalImport(empty,preview,{now,idFactory:()=>`imported-${++sequence}`});
 const config={...imported.listening,source:'personal',deckId:'all',mode:'dictation'};
 assert.equal(personalWordPool(imported).length,2);assert.equal(filterListeningWords(imported,config).length,2);assert.equal(imported.events.length,0);assert.equal(Object.keys(imported.skillStates).length,0);
 const session=createListeningSession(imported,config,()=>0,'csv-round');assert.equal(session.questions.length,2);assert.equal(new Set(session.ids).size,2);assert.ok(session.questions.every(q=>q.skill==='listening'&&q.personal));
 const invalid=preparePersonalImport(text.replace('コーヒー,コーヒー','コーヒー,coffee'),empty);assert.ok(invalid.errors.length);assert.throws(()=>applyPersonalImport(empty,invalid));assert.equal(personalWordPool(empty).length,0);
});
test('schema 3 hydration adds feature defaults while retaining old answers, revision and in-progress sessions',()=>{
 const saved=school();saved.revision=42;saved.events=[{id:'historic-answer',questionId:'old-question',answer:'そのまま',correct:false}];saved.session={mode:'review',questionId:'old-question',phase:'exercise'};
 delete saved.weakness;delete saved.listening;const hydrated=hydrateState(saved);
 assert.equal(hydrated.schemaVersion,3);assert.equal(hydrated.revision,42);assert.deepEqual(hydrated.events,saved.events);assert.deepEqual(hydrated.session,saved.session);assert.deepEqual(hydrated.personal.words,saved.personal.words);
 assert.equal(hydrated.listening.mode,'meaning');assert.equal(hydrated.listening.session,null);assert.equal(hydrated.weakness.session,null);
});
test('a real listening gate delegated to weakness practice records only an answer after completed matching playback',async()=>{
 let state=school(),pending,listener;
 const q=getListeningQuestion('listening:personal:word-school:dictation',state);
 state=recordAnswer(state,q,'ちがう',now,'past-listening-error',100,'listening');
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const u={T:(tr,en)=>tr,L:value=>value.tr,esc,icon:()=>'',showQuestionReadings:false};
 class Utterance{constructor(text){this.text=text;}}
 const player=createJapaneseSpeech({engine:{getVoices:()=>[{lang:'ja-JP'}],cancel(){pending=null;},speak(value){pending=value;}},Utterance,onChange:snapshot=>listener?.onSpeechChange(snapshot)});
 const commit=async next=>{state=next;return true;};
 listener=createListeningFeature({getState:()=>state,commit,ui:()=>u,toast(){},isBusy:()=>false,player,root:{querySelectorAll:()=>[]}});
 const weakness=createWeaknessFeature({getState:()=>state,commit,ui:()=>u,toast(){},isBusy:()=>false,getQuestion:id=>getListeningQuestion(id,state),renderExercise:(question,event,options)=>listener.renderExercise(question,event,options),canAnswer:(question,scope)=>listener.canAnswer(question,scope),answerEvidence:(question,scope)=>listener.answerEvidence(question,scope)});
 await weakness.click({dataset:{action:'weakness-start'}});
 const session=state.weakness.session,scope=`weakness:${session.id}:0`,key=listeningKey(q,scope),html=weakness.page();
 assert.ok(!html.includes('学校'));assert.ok(!html.includes('がっこう'));
 const form={dataset:{form:'weakness-answer',sessionId:session.id,questionId:q.id,questionIndex:'0'}},NativeFormData=globalThis.FormData;
 globalThis.FormData=class{get(name){return name==='answer'?'がっこう':null;}};
 try{
  await weakness.submit(form);assert.equal(state.events.length,1);
  player.play({text:q.audio.reading,key});const cancelled=pending;cancelled.onstart();player.stop();cancelled.onend();
  await weakness.submit(form);assert.equal(state.events.length,1);assert.equal(state.weakness.session.feedback,null);
  player.play({text:q.audio.reading,key,speed:'slow'});pending.onstart();assert.equal(listener.canAnswer(q,scope),false);pending.onend();
  await weakness.submit(form);assert.equal(state.events.length,2);const answer=state.events.at(-1);
  assert.equal(answer.skill,'listening');assert.equal(answer.correct,true);assert.equal(answer.audioPlaybackCompleted,true);assert.equal(answer.audioSpeed,'slow');assert.equal(answer.readingHintShown,false);assert.equal(answer.pronunciationHintRequested,false);
 }finally{globalThis.FormData=NativeFormData;}
});
