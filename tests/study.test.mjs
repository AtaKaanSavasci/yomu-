import test from 'node:test';
import assert from 'node:assert/strict';
import {studyLevels,wordTopics,sentenceScenes,studyWords,studySentences,studyGrammar,defaultLearning,filterStudyItems,getStudyQuestion} from '../dist/src/study-data.js';
import {freshState,hydrateState,gradeAnswer,recordAnswer,dueStates} from '../dist/src/model.js';
import {getQuestion} from '../dist/src/content.js';
import {createStudySession,saveStudyItem,selectStudyConfig} from '../dist/src/study-flow.js';
import {additionalWordRows,additionalSentenceRows,additionalGrammarRows} from '../dist/src/study-expansion.js';
import {novemberWordRows} from '../dist/src/vocabulary-november.js';
const now=new Date('2026-10-31T12:00:00Z');

test('expanded rows have complete fields, valid bands and unambiguous gap targets',()=>{
 for(const [rows,size] of [[additionalWordRows,11],[novemberWordRows,11],[additionalSentenceRows,11],[additionalGrammarRows,13]])for(const row of rows){
  assert.equal(row.length,size);assert.ok(studyLevels.includes(row[0]));assert.ok(row.every(v=>Array.isArray(v)||typeof v==='string'&&v.trim()));
 }
 for(const row of additionalSentenceRows)assert.equal(row[3].split(row[7]).length-1,1);
 for(const row of additionalGrammarRows)assert.equal(row[7].split(row[11]).length-1,1);
});
test('kana reading answers accept mixed script, all hiragana and halfwidth katakana',()=>{
 const q=getQuestion('study:vocabulary:w-microwave:reading');
 for(const answer of ['でんしレンジ','でんしれんじ','でんしﾚﾝｼﾞ'])assert.ok(gradeAnswer(q,answer,'tr'));
 assert.equal(gradeAnswer(q,'denshi renji','tr'),false);
 assert.ok(gradeAnswer(getQuestion('study:vocabulary:w-keyboard:reading'),'きーぼーど','en'));
});

test('starter content covers each requested level, topic and setting with bilingual examples',()=>{
 assert.equal(studyWords.length,300);assert.equal(studySentences.length,120);assert.equal(studyGrammar.length,50);
 for(const level of studyLevels){
  for(const topic of wordTopics)assert.equal(studyWords.filter(i=>i.level===level&&i.category===topic.id).length,['fruits','objects','software'].includes(topic.id)?12:6);
  for(const scene of sentenceScenes)assert.equal(studySentences.filter(i=>i.level===level&&i.scene===scene.id).length,4);
  assert.equal(studyGrammar.filter(i=>i.level===level).length,10);
 }
 const all=[...studyWords,...studySentences,...studyGrammar];assert.equal(new Set(all.map(i=>i.id)).size,all.length);
 for(const i of all){assert.equal(i.editorReviewed,false);assert.ok(i.version);const ex=i.example||i;assert.ok(ex.ja&&ex.reading&&ex.translation.tr&&ex.translation.en);}
});
test('all vocabulary modes resolve stable review IDs and have exactly one correct choice per language',()=>{
 for(const item of studyWords)for(const mode of ['meaning','reading','writing']){
  const id=`study:vocabulary:${item.id}:${mode}`,q=getQuestion(id);assert.equal(q.id,id);assert.equal(q.itemId,`study-${item.id}`);assert.equal(q.context,mode==='writing'?item.reading:item.written);
  for(const lang of ['tr','en']){
   assert.ok(q.prompt[lang]&&q.explanation[lang]);assert.ok(q.answers[lang].every(a=>gradeAnswer(q,a,lang)));
   if(q.choices){assert.equal(q.choices[lang].length,4);assert.equal(q.choices[lang].filter(a=>gradeAnswer(q,a,lang)).length,1);}
  }
 }
 assert.equal(getStudyQuestion('study:sentences:s-menu:reading'),null);assert.equal(getStudyQuestion('study:grammar:missing:writing'),null);
});
test('every sentence and grammar gap hides a present target and accepts its explicit written variants',()=>{
 for(const [kind,items] of [['sentences',studySentences],['grammar',studyGrammar]])for(const item of items){
  const ja=item.ja||item.example.ja;assert.ok(ja.includes(item.target));
  const q=getQuestion(`study:${kind}:${item.id}:writing`);assert.equal(q.context,ja.replace(item.target,'［　］'));
  for(const lang of ['tr','en'])assert.ok(item.answers.every(a=>gradeAnswer(q,a,lang)));
  assert.equal(gradeAnswer(q,'unrelated answer','tr'),false);
 }
});
test('filters combine level and category with Japanese, Turkish and English search',()=>{
 assert.equal(filterStudyItems('vocabulary',{level:'N3',category:'software',search:''}).length,12);
 assert.deepEqual(filterStudyItems('vocabulary',{level:'all',category:'all',search:'ŞARJ'}).map(i=>i.id),['w-charger']);
 assert.ok(filterStudyItems('vocabulary',{level:'all',category:'software',search:'変数'}).some(i=>i.id==='w-variable'));
 assert.equal(filterStudyItems('sentences',{level:'N1',category:'work',search:''}).length,4);
 assert.equal(filterStudyItems('grammar',{level:'N4',category:'all',search:''}).length,10);
 assert.equal(filterStudyItems('vocabulary',{level:'N5',category:'fruits',search:'nonexistent'}).length,0);
});
test('practice snapshots only filtered questions, shuffles and caps a round at ten distinct cards',()=>{
 const cfg={level:'all',category:'software',search:'',mode:'reading'},s=createStudySession('vocabulary',cfg,()=>0,'round');
 assert.equal(s.ids.length,10);assert.equal(new Set(s.ids).size,10);assert.ok(s.ids.every(id=>getQuestion(id).skill==='reading'));
 assert.equal(createStudySession('vocabulary',{...cfg,search:'nonexistent'}),null);
 assert.equal(createStudySession('sentences',{level:'N5',category:'friends',search:''}).ids.length,4);
 const state=freshState();state.learning.session=s;const next=selectStudyConfig(state,'vocabulary',{level:'N1',category:'objects'});
 assert.deepEqual(next.learning.session,s);assert.ok(filterStudyItems('vocabulary',next.learning.vocabulary).some(i=>i.id===next.learning.vocabulary.selectedId));assert.equal(state.learning.vocabulary.level,'N5');
});
test('saving study cards adds due review questions without events and preserves existing intervals',()=>{
 const state=freshState(),saved=saveStudyItem(state,'vocabulary','w-apple',now);
 assert.equal(state.events.length,0);assert.equal(saved.events.length,0);assert.equal(dueStates(saved,now).length,2);
 assert.ok(dueStates(saved,now).every(s=>getQuestion(s.questionId)&&s.attempts===0));
 const q=getQuestion('study:vocabulary:w-apple:reading'),answered=recordAnswer(saved,q,'りんご',now,'read');
 assert.deepEqual(saveStudyItem(answered,'vocabulary','w-apple',now),answered);
 const all=saveStudyItem(saveStudyItem(saved,'sentences','s-menu',now),'grammar','g-desu',now);
 assert.equal(all.events.length,0);assert.equal(dueStates(all,now).length,4);
});
test('study answers schedule independent skills and keep wrong answers for a ten minute review',()=>{
 let state=freshState();for(const [mode,value] of [['meaning','elma'],['reading','りんご'],['writing','wrong']])state=recordAnswer(state,getQuestion(`study:vocabulary:w-apple:${mode}`),value,now,mode,1200,'vocabulary');
 assert.equal(Object.keys(state.skillStates).length,3);assert.equal(state.events.length,3);
 assert.equal(state.skillStates['study-w-apple:writing'].correct,0);assert.equal(new Date(state.skillStates['study-w-apple:writing'].dueAt)-now,600000);
 assert.equal(state.skillStates['study-w-apple:reading'].correct,1);assert.equal(state.events[0].mode,'vocabulary');
});
test('schema 2 answers, ongoing character session and partial learning preferences survive migration',()=>{
 const old={...freshState(),schemaVersion:2,revision:7,events:[{id:'old'}]};delete old.learning;old.practice.session={id:'kept'};
 const next=hydrateState(old);assert.equal(next.schemaVersion,3);assert.equal(next.revision,7);assert.deepEqual(next.events,old.events);assert.deepEqual(next.practice.session,old.practice.session);assert.deepEqual(next.learning,defaultLearning());
 const partial=hydrateState({...next,learning:{vocabulary:{level:'N1'}}});assert.equal(partial.learning.vocabulary.level,'N1');assert.equal(partial.learning.vocabulary.mode,'meaning');assert.ok(partial.learning.grammar);
});
