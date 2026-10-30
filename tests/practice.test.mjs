import test from 'node:test';
import assert from 'node:assert/strict';
import {kanaGroups,defaultPractice,characterPool,createCharacterSession,getCharacterQuestion,characterQuestionId} from '../dist/src/characters.js';
import {animeQuotes,getAnimeQuestion,safeVideoId,createCustomQuote} from '../dist/src/anime.js';
import {freshState,hydrateState,gradeAnswer,recordAnswer} from '../dist/src/model.js';
import {getQuestion} from '../dist/src/content.js';
test('each kana chart has 46 basic, 25 voiced and 33 contracted entries',()=>{
 for(const [kind,count] of [['basic',46],['voiced',25],['combined',33]])assert.equal(kanaGroups.filter(g=>g.kind===kind).flatMap(g=>g.entries).length,count);
 const keys=kanaGroups.flatMap(g=>g.entries.map(e=>e.key));assert.equal(new Set(keys).size,104);
});
test('selected rows, difficulty and script constrain the random question pool',()=>{
 const config=defaultPractice();assert.equal(characterPool(config).length,15);
 config.level='beginner';config.groups=kanaGroups.map(g=>g.id);assert.equal(characterPool(config).length,46);
 config.level='intermediate';assert.equal(characterPool(config).length,71);
 config.level='advanced';assert.equal(characterPool(config).length,104);
 config.script='katakana';assert.equal(characterPool(config).find(e=>e.key==='sha').display,'シャ');
 config.groups=[];assert.throws(()=>createCharacterSession(config),/EMPTY_POOL/);
 config.script='kanji';assert.equal(characterPool(config).length,20);
});
test('every generated question resolves from review IDs and has valid choices',()=>{
 for(const script of ['hiragana','katakana','kanji'])for(const mode of ['reading','choice','writing']){
  const pool=characterPool({...defaultPractice(),script,mode,level:'advanced',groups:kanaGroups.map(g=>g.id)});
  for(const item of pool){const id=characterQuestionId(item.id,mode),q=getQuestion(id);assert.ok(q);assert.equal(q.skill,mode==='writing'?'writing':'reading');
   for(const lang of ['tr','en']){assert.ok(q.answers[lang].every(a=>gradeAnswer(q,a,lang)));if(q.choices){assert.equal(q.choices[lang].length,4);assert.equal(q.choices[lang].filter(a=>gradeAnswer(q,a,lang)).length,1);}}
  }
 }
});
test('romanization alternatives and uppercase I work in Turkish; wrong kana is rejected',()=>{
 const q=getCharacterQuestion('character:reading:hiragana-shi');assert.ok(gradeAnswer(q,'SHI','tr'));assert.ok(gradeAnswer(q,'si','tr'));assert.equal(gradeAnswer(q,'chi','tr'),false);
 assert.ok(gradeAnswer(getCharacterQuestion('character:reading:katakana-du'),'dzu','en'));
 assert.ok(gradeAnswer(getCharacterQuestion('character:writing:katakana-shi'),'シ','tr'));
 assert.equal(gradeAnswer(getCharacterQuestion('character:writing:katakana-shi'),'し','tr'),false);
});
test('rounds use at most ten distinct selected questions and no fake answer events',()=>{
 const config={...defaultPractice(),groups:['a']};const round=createCharacterSession(config,()=>0.4);assert.equal(round.ids.length,5);assert.equal(new Set(round.ids).size,5);assert.equal(round.eventIds.length,0);
 assert.ok(round.ids.every(id=>id.includes('hiragana-')));
});
test('existing schema 1 answers and preferences survive additive schema 2 migration',()=>{
 const old={schemaVersion:1,revision:4,settings:{language:'en'},events:[{id:'old'}],skillStates:{saved:{attempts:1}},lessons:{a:{completedAt:'old'}},issues:[],session:null};
 const migrated=hydrateState(old);assert.equal(migrated.schemaVersion,2);assert.equal(migrated.revision,4);assert.equal(migrated.settings.language,'en');assert.deepEqual(migrated.events,old.events);assert.deepEqual(migrated.skillStates,old.skillStates);assert.ok(migrated.practice);assert.ok(migrated.anime);assert.equal(old.schemaVersion,1);
});
test('all four requested anime have official publisher video IDs and answer keys',()=>{
 assert.deepEqual(new Set(animeQuotes.map(q=>q.series)),new Set(['Naruto','Bleach','Vinland Saga','Jujutsu Kaisen']));
 for(const quote of animeQuotes){assert.match(quote.videoId,/^[A-Za-z0-9_-]{11}$/);const q=getQuestion(`anime:${quote.id}`);assert.ok(q);for(const lang of ['tr','en'])assert.ok(q.answers[lang].every(a=>gradeAnswer(q,a,lang)));}
});
test('personal lines validate hidden text and YouTube URLs; saved keys resolve',()=>{
 assert.equal(safeVideoId('https://www.youtube.com/watch?v=h8-MxeYYwJE'),'h8-MxeYYwJE');assert.equal(safeVideoId('https://youtu.be/h8-MxeYYwJE'),'h8-MxeYYwJE');assert.equal(safeVideoId('https://youtube.com.evil.test/watch?v=h8-MxeYYwJE'),null);
 assert.equal(safeVideoId('javascript:alert(1)'),null);
 assert.throws(()=>createCustomQuote({text:'こんにちは',target:'別'},'1'),/INVALID_QUOTE/);
 const quote=createCustomQuote({text:'本を読みます。',target:'本',series:'Personal'},'1'),q=getAnimeQuestion('anime:custom-1',[quote]);assert.equal(q.context,'［　］を読みます。');assert.ok(gradeAnswer(q,'本','tr'));
 const state=recordAnswer(freshState(),q,'本',new Date(),'custom-answer',0,'anime');assert.equal(state.events[0].mode,'anime');assert.equal(state.skillStates[q.itemId+':writing'].attempts,1);
});
