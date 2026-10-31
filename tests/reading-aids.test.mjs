import test from 'node:test';
import assert from 'node:assert/strict';
import {getQuestion} from '../dist/src/content.js';
import {questionWord,kanjiPanel,kanjiText} from '../dist/src/reading-ui.js';
import {isKanji,parseKanjiComponents,lookupKanji,constructionNotes} from '../dist/src/kanji-info.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const u={T:(tr,en)=>tr,L:x=>x.tr,esc,showQuestionReadings:false};
test('word questions keep kana hidden before an unassisted answer and reveal it after correct or incorrect answers',()=>{
 const q=getQuestion('study:vocabulary:w-variable:meaning');assert.equal(q.word.reading,'へんすう');
 assert.match(questionWord(q,null,u),/class="question-reading"[^>]*hidden/);
 assert.doesNotMatch(questionWord(q,null,{...u,showQuestionReadings:true}),/class="question-reading"[^>]*hidden/);
 for(const correct of [true,false]){const html=questionWord(q,{correct},u);assert.match(html,/>へんすう<\/p>/);assert.doesNotMatch(html,/class="question-reading"[^>]*hidden/);assert.doesNotMatch(html,/data-action="reading-hint"/);}
});
test('writing feedback reveals the complete written word; old word and kanji review questions keep readings',()=>{
 const q=getQuestion('study:vocabulary:w-variable:writing');assert.equal(q.context,'へんすう');
 const html=questionWord(q,{correct:false},u);assert.ok(html.indexOf('data-glyph="変"')<html.indexOf('class="question-reading"'));
 assert.match(questionWord(getQuestion('lex-reading-book'),{correct:true},u),/>ほん<\/p>/);
 assert.match(questionWord(getQuestion('character:reading:kanji-school'),{correct:false},u),/>がっこう<\/p>/);
});
test('kanji text has touch and keyboard buttons and escapes non-kanji markup',()=>{
 const html=kanjiText('本<script>1</script>',u);assert.match(html,/type="button"/);assert.match(html,/data-glyph="本"/);assert.doesNotMatch(html,/<script>/);assert.ok(isKanji('語'));assert.equal(isKanji('々'),false);assert.equal(isKanji('あ'),false);assert.equal(isKanji('学校'),false);
});
test('writing structure preserves positions and never labels incomplete groups as a full construction',()=>{
 const svg='<g><g kvg:element="明"><g kvg:element="日" kvg:position="left"><path/></g><g kvg:element="月" kvg:position="right"><path/></g></g></g>';
 const parsed=parseKanjiComponents(svg,'明');assert.deepEqual(parsed.components.map(c=>c.element),['日','月']);assert.equal(parsed.complete,true);assert.equal(parsed.components[0].position,'left');
 assert.equal(parseKanjiComponents('<g kvg:element="本"><g kvg:element="木"><path/></g><path/></g>','本').complete,false);
 assert.equal(parseKanjiComponents('<g kvg:element="五"><g kvg:element="二" kvg:part="1"/><g kvg:element="二" kvg:part="2"/></g>','五').complete,false);
 assert.equal(parseKanjiComponents(svg,'語'),null);
});
test('dictionary lookup validates identity, uses fixed sources and caches repeated lookups',async()=>{
 let calls=0;const fetched=async url=>{calls++;assert.ok(url.startsWith('https://kanjiapi.dev/v1/kanji/')||url.startsWith('https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/'));return url.includes('kanjiapi.dev')?new Response(JSON.stringify({kanji:decodeURIComponent(url.split('/').at(-1)),meanings:['word','language'],on_readings:['ゴ'],kun_readings:['かた.る'],stroke_count:14})):new Response('<g kvg:element="語"><g kvg:element="言"/><g kvg:element="吾"/></g>');};
 const result=await lookupKanji('語',fetched);assert.deepEqual(result.dictionary.on,['ゴ']);assert.equal(result.structure.complete,true);await lookupKanji('語',fetched);assert.equal(calls,4);
 const bad=await lookupKanji('錯',async url=>url.includes('kanjiapi.dev')?new Response(JSON.stringify({kanji:'別',meanings:[],on_readings:[],kun_readings:[]})):new Response('',{status:404}));assert.equal(bad.dictionary,null);assert.equal(bad.structure,null);assert.equal(bad.note,null);
});
test('kanji panels attribute live dictionary/structure sources and use only specifically sourced construction notes',()=>{
 assert.deepEqual(Object.keys(constructionNotes).sort(),['時','校','語'].sort());
 const panel=kanjiPanel({glyph:'明',dictionary:{meanings:['bright','<img src=x>'],on:['メイ'],kun:['あか.るい']},structure:{components:[{element:'日'},{element:'月'}],complete:true}},u);
 assert.match(panel,/EDRDG/);assert.match(panel,/KanjiVG/);assert.match(panel,/CC BY-SA 4.0/);assert.match(panel,/CC BY-SA 3.0/);assert.match(panel,/İngilizce/);assert.doesNotMatch(panel,/<img/);assert.doesNotMatch(panel,/Kaynaklı oluşum notu/);
});
