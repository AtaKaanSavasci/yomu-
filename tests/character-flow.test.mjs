import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/src/model.js';
import {getCharacterQuestion} from '../dist/src/characters.js';
import {applyCharacterInput,classifyCharacterInput} from '../dist/src/character-flow.js';
const now=new Date('2026-10-30T18:00:00Z');
function setup(ids=['character:reading:hiragana-shi','character:reading:hiragana-a']) {
 const state=freshState();state.practice.session={id:'round-1',ids,index:0,eventIds:[],phase:'exercise',feedback:null};return state;
}
test('partial romanized readings do not trigger mistakes; a completed answer advances without Enter',()=>{
 const state=setup(),q=getCharacterQuestion(state.practice.session.ids[0]);
 for(const partial of ['','s','sh']){assert.equal(classifyCharacterInput(q,partial,'tr'),'pending');assert.equal(applyCharacterInput(state,partial).state,state);}
 const result=applyCharacterInput(state,'SHI',{eventId:'correct',now});
 assert.equal(result.advanced,true);assert.equal(result.state.practice.session.index,1);assert.equal(result.state.events[0].correct,true);assert.equal(state.events.length,0);
 assert.equal(result.state.practice.session.lastResult.kind,'correct');
});
test('incorrect input stays on the character; repeated corrections do not inflate per-key attempts',()=>{
 const first=applyCharacterInput(setup(),'x',{eventId:'wrong',now});
 assert.equal(first.kind,'incorrect');assert.equal(first.advanced,false);assert.equal(first.state.practice.session.index,0);assert.equal(first.state.events.length,1);assert.equal(first.state.events[0].correct,false);
 assert.equal(first.state.practice.session.feedback,null);assert.equal(first.state.practice.session.wrongForCurrent,true);
 const retry=applyCharacterInput(first.state,'xyz',{eventId:'another-key',now});assert.equal(retry.state,first.state);
 const correct=applyCharacterInput(retry.state,'si',{eventId:'fixed',now});assert.equal(correct.advanced,true);assert.equal(correct.state.practice.session.index,1);assert.equal(correct.state.events.length,2);assert.equal(correct.state.practice.session.wrongForCurrent,false);
});
test('an empty Enter reveals and advances but does not grant a correct answer',()=>{
 const result=applyCharacterInput(setup(),'  ',{submitted:true,eventId:'reveal',now});
 assert.equal(result.kind,'revealed');assert.equal(result.state.practice.session.index,1);
 assert.equal(result.state.events[0].correct,false);assert.equal(result.state.events[0].revealed,true);assert.equal(result.state.events[0].answer,'');
 assert.deepEqual(result.state.practice.session.lastResult.answers.tr,['shi','si']);
 assert.equal(result.state.skillStates['character-hiragana-shi:reading'].correct,0);
 assert.equal(new Date(result.state.skillStates['character-hiragana-shi:reading'].dueAt)-now,600000);
});
test('nonempty incorrect Enter never reveals the answer; the final reveal remains on the summary',()=>{
 const state=setup(['character:reading:hiragana-shi']);
 const incorrect=applyCharacterInput(state,'sh',{submitted:true,eventId:'incomplete-submit',now});assert.equal(incorrect.kind,'incorrect');assert.equal(incorrect.state.practice.session.index,0);assert.equal(incorrect.state.practice.session.lastResult,undefined);
 const revealed=applyCharacterInput(incorrect.state,'',{submitted:true,eventId:'final-reveal',now});assert.equal(revealed.state.practice.session.phase,'done');assert.equal(revealed.state.practice.session.lastResult.kind,'revealed');
});
test('stale input events and repeated submits cannot answer the next character or another round',()=>{
 const first=applyCharacterInput(setup(),'shi',{questionId:'character:reading:hiragana-shi',sessionId:'round-1',eventId:'once',now});
 const stale=applyCharacterInput(first.state,'shi',{questionId:'character:reading:hiragana-shi',sessionId:'round-1',eventId:'twice',now});assert.equal(stale.kind,'stale');assert.equal(stale.state.events.length,1);
 const otherRound=applyCharacterInput(setup(),'shi',{sessionId:'old-round'});assert.equal(otherRound.kind,'stale');
});
test('Japanese typed answers and multiple choice use the same stay-until-correct progression',()=>{
 const typed=applyCharacterInput(setup(['character:writing:katakana-shi']),'シ',{eventId:'kana',now});assert.equal(typed.kind,'correct');assert.equal(typed.state.practice.session.phase,'done');assert.equal(typed.state.events[0].skill,'writing');
 const state=setup(['character:choice:hiragana-shi']);const wrong=applyCharacterInput(state,'a',{eventId:'choice-wrong',now});assert.equal(wrong.state.practice.session.index,0);
 const right=applyCharacterInput(wrong.state,'shi',{eventId:'choice-correct',now});assert.equal(right.state.practice.session.phase,'done');assert.equal(right.state.events.length,2);
});
