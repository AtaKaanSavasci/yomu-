import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,hydrateState,gradeAnswer} from '../dist/src/model.js';
import {studyWords} from '../dist/src/study-data.js';
import {defaultListening,listeningWordPool,filterListeningWords,getListeningQuestion,createListeningSession,listeningKey,createListeningGate} from '../dist/src/listening-data.js';
import {createListeningFeature} from '../dist/src/listening-feature.js';
import {createJapaneseSpeech} from '../dist/src/word-speech.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const u={T:(tr,en)=>tr,L:value=>value.tr,esc};
test('listening questions cover the complete built-in word pool with separate stable skill identities and valid answer choices',()=>{
 const state=freshState();assert.equal(listeningWordPool(state).length,studyWords.length);
 for(const word of studyWords){
  for(const mode of ['meaning','dictation']){
   const q=getListeningQuestion(`listening:builtin:${word.id}:${mode}`,state);assert.equal(q.skill,'listening');assert.equal(q.itemId,`study-${word.id}`);assert.equal(q.audio.reading,word.reading);assert.equal(q.sourceType,'listening');
   for(const lang of ['tr','en']){assert.ok(gradeAnswer(q,q.answers[lang][0],lang));if(mode==='meaning'){assert.equal(new Set(q.choices[lang]).size,4);assert.equal(q.choices[lang].filter(answer=>gradeAnswer(q,answer,lang)).length,1);}}
  }
 }
});
test('dictation accepts hiragana, katakana and halfwidth kana while rejecting romaji and guessed kanji',()=>{
 const q=getListeningQuestion('listening:builtin:w-apple:dictation',freshState());
 for(const answer of ['りんご','リンゴ','ﾘﾝｺﾞ'])assert.ok(gradeAnswer(q,answer,'tr'));
 for(const answer of ['ringo','林檎','みかん'])assert.equal(gradeAnswer(q,answer,'tr'),false);
});
test('source filters constrain round snapshots and starting a round never manufactures an answer',()=>{
 const state=freshState(),config={...defaultListening(),level:'N3',category:'software'};const s=createListeningSession(state,config,()=>0.25,'round-one');
 assert.equal(s.questions.length,8);assert.equal(new Set(s.ids).size,s.ids.length);assert.equal(state.events.length,0);
 assert.ok(filterListeningWords(state,config).every(word=>word.level==='N3'&&word.category==='software'));
 assert.equal(createListeningSession(state,{...config,source:'personal'}),null);
 state.listening.session=s;const hydrated=hydrateState(state);assert.deepEqual(hydrated.listening.session.questions,s.questions);
});
test('the gate requires matching queued/start/end, rejects stopped, failed, stale and other-version audio',()=>{
 const gate=createListeningGate();gate.update({key:null,phase:'idle'});gate.update({key:'a',phase:'queued',speed:'slow'});gate.update({key:'a',phase:'idle'});assert.equal(gate.has('a'),false);
 gate.update({key:'a',phase:'queued'});gate.update({key:'a',phase:'speaking'});gate.update({key:null,phase:'idle'});gate.update({key:'a',phase:'idle'});assert.equal(gate.has('a'),false);
 gate.update({key:'a',phase:'queued'});gate.update({key:'a',phase:'speaking'});gate.update({key:'a',phase:'error'});assert.equal(gate.has('a'),false);
 gate.update({key:'a',phase:'queued'});gate.update({key:'b',phase:'queued',speed:'slow'});gate.update({key:'a',phase:'speaking'});gate.update({key:'a',phase:'idle'});assert.equal(gate.has('a'),false);
 gate.update({key:'b',phase:'speaking'});gate.update({key:'b',phase:'idle'});assert.deepEqual(gate.evidence('b'),{audioSource:'browser-tts',audioPlaybackCompleted:true,audioSpeed:'slow'});
 const q=getListeningQuestion('listening:builtin:w-apple:dictation',freshState());assert.notEqual(listeningKey(q,'scope-a'),listeningKey(q,'scope-b'));assert.notEqual(listeningKey(q,'scope-a'),listeningKey({...q,version:'changed'},'scope-a'));
});
test('a listening exercise hides Japanese until feedback and synchronous speech callbacks unlock only completed playback',()=>{
 let feature;const spoken=[];class Utterance{constructor(text){this.text=text;}}
 const player=createJapaneseSpeech({engine:{getVoices:()=>[{lang:'ja-JP'}],cancel(){},speak(utterance){spoken.push(utterance);utterance.onstart();utterance.onend();}},Utterance,onChange:s=>feature?.onSpeechChange(s)});
 const state=freshState();feature=createListeningFeature({getState:()=>state,commit:async()=>true,ui:()=>u,toast(){},isBusy:()=>false,player,root:{querySelectorAll:()=>[]}});
 const q=getListeningQuestion('listening:builtin:w-variable:dictation',state),scopeKey='listening:round:0',key=listeningKey(q,scopeKey);
 const before=feature.renderExercise(q,null,{scopeKey});assert.equal(feature.canAnswer(q,scopeKey),false);assert.ok(!before.includes('変数'));assert.ok(!before.includes('へんすう'));assert.match(before,/name="answer"[^>]*disabled/);
 player.play({text:q.audio.reading,key,speed:'slow'});assert.equal(feature.canAnswer(q,scopeKey),true);assert.equal(feature.canAnswer(q,'other-round'),false);assert.equal(feature.answerEvidence(q,scopeKey).audioPlaybackCompleted,true);assert.equal(spoken[0].text,'へんすう');
 const after=feature.renderExercise(q,{correct:false,answer:'ちがう'},{scopeKey});assert.match(after,/data-glyph="変"/);assert.ok(after.includes('へんすう'));assert.equal(state.events.length,0);
});
test('a detached listening form cannot submit a different current question even after its audio has completed',async()=>{
 let feature,commits=0;class Utterance{constructor(text){this.text=text;}}
 const player=createJapaneseSpeech({engine:{getVoices:()=>[{lang:'ja-JP'}],cancel(){},speak(u){u.onstart();u.onend();}},Utterance,onChange:s=>feature?.onSpeechChange(s)});
 const state=freshState();state.listening.session=createListeningSession(state,state.listening,()=>.25,'new-round');
 feature=createListeningFeature({getState:()=>state,commit:async()=>{commits++;return true;},ui:()=>u,toast(){},isBusy:()=>false,player,root:{querySelectorAll:()=>[]}});
 const q=state.listening.session.questions[0],scopeKey='listening:new-round:0';feature.renderExercise(q,null,{scopeKey});player.play({text:q.audio.reading,key:listeningKey(q,scopeKey)});
 assert.equal(feature.canAnswer(q,scopeKey),true);
 await feature.submit({dataset:{form:'listening-answer',listeningQuestion:q.id,listeningScope:'listening:old-round:0'}});
 assert.equal(commits,0);assert.equal(state.events.length,0);
});
