import test from 'node:test';
import assert from 'node:assert/strict';
import {animeQuotes,createCustomQuote} from '../dist/src/anime.js';
import {animeGlossaryFor,animeQuoteTokens,createAnimeDeckFeature,ANIME_GLOSSARY_VERSION} from '../dist/src/anime-decks.js';
import {defaultPersonal,createPersonalDeck,upsertPersonalWord,PERSONAL_LIMITS} from '../dist/src/personal-data.js';
import {animePage} from '../dist/src/practice-ui.js';
const esc=value=>String(value??'').replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ui=(language='tr')=>({T:(tr,en)=>language==='en'?en:tr,L:value=>value[language],esc,icon:()=>''});
const base=(quoteId='vinland-enemies')=>({anime:{activeId:quoteId,customQuotes:[],series:'all',level:'all',practice:null},personal:defaultPersonal(),events:[{id:'existing-history'}],skillStates:{},settings:{language:'tr'}});
function fixture(initial=base(),{fail=false,commitHook}={}){
 let state=initial,commits=0,renders=0;const messages=[];
 const feature=createAnimeDeckFeature({getState:()=>state,commit:async next=>{commits++;if(commitHook)await commitHook();if(fail)return false;state=next;return true;},render:()=>{renders++;},ui:()=>ui(),toast:message=>messages.push(message)});
 return {feature,get state(){return state;},get commits(){return commits;},get renders(){return renders;},messages};
}
async function open(f,quoteId='vinland-enemies',tokenId='vinland-teki'){
 await f.feature.click({dataset:{action:'anime-deck-select',quoteId,tokenId}});
 return f.feature.panel(quoteId).match(/data-capture-id="([^"]+)"/u)?.[1];
}
const saveForm=(captureId,values={},quoteId='vinland-enemies')=>({dataset:{form:'anime-deck-save',captureId,quoteId},values:{deckId:'new',newDeckName:'Anime kelimelerim',note:'',...values}});
async function withFormData(run){const original=globalThis.FormData;globalThis.FormData=class{constructor(form){this.values=form.values;}get(key){return this.values[key]??null;}};try{await run();}finally{globalThis.FormData=original;}}

test('glossary has explicit sourced readings for all four short lines and no guessed segmentation',()=>{
 const all=animeQuotes.flatMap(animeGlossaryFor);assert.equal(all.length,6);assert.equal(new Set(all.map(entry=>entry.id)).size,6);
 for(const quote of animeQuotes){const entries=animeGlossaryFor(quote);assert.ok(entries.length);for(const entry of entries){assert.ok(quote.text.includes(entry.surface));assert.match(entry.reading,/^[\p{Script=Hiragana}ー]+$/u);assert.match(entry.source.url,/^https:\/\//u);assert.ok(entry.meaning.tr&&entry.meaning.en);}}
 assert.equal(all.find(entry=>entry.id==='jjk-kakkotsukeru').surface,'カッコつけ');assert.equal(all.find(entry=>entry.id==='jjk-kakkotsukeru').written,'カッコつける');assert.equal(all.find(entry=>entry.id==='bleach-bankai').fictional,true);
 assert.deepEqual(animeGlossaryFor({...animeQuotes[0],text:'未知の漢字'}),[]);assert.deepEqual(animeGlossaryFor({id:'custom',text:'敵'}),[]);
 const copied=animeGlossaryFor(animeQuotes[0]);copied[0].reading='wrong';assert.equal(animeGlossaryFor(animeQuotes[0])[0].reading,'おれ');
});
test('token markup preserves the exact quote, escapes unknown text and has accessible controls',()=>{
 for(const quote of animeQuotes){const html=animeQuoteTokens(quote,ui());assert.ok(html.includes('data-action="anime-deck-select"'));assert.ok(html.includes('aria-controls="anime-deck-panel-'));assert.equal(html.replace(/<[^>]*>/gu,''),quote.text);}
 const html=animeQuoteTokens({id:'custom',text:'<img src=x onerror=alert(1)>敵'},ui());assert.doesNotMatch(html,/<img|data-action/u);assert.match(html,/&lt;img/);
});
test('opening a word is a transient preview; explicit confirmation adds only the chosen sourced word',async()=>withFormData(async()=>{
 const f=fixture(),capture=await open(f);assert.ok(capture);assert.equal(f.commits,0);assert.equal(f.state.personal.words.length,0);
 const preview=f.feature.panel('vinland-enemies');assert.match(preview,/てき/);assert.match(preview,/düşman/);assert.match(preview,/enemy/);assert.match(preview,/Orijinal kaynak/);assert.match(preview,/kotobank.jp/);
 await f.feature.submit(saveForm(capture,{written:'偽物',reading:'うそ',tr:'forged',en:'forged'}));assert.equal(f.commits,1);assert.equal(f.state.personal.decks.length,1);assert.equal(f.state.personal.words.length,1);
 const word=f.state.personal.words[0];assert.equal(word.written,'敵');assert.equal(word.reading,'てき');assert.equal(word.meaning.tr,'düşman');assert.equal(word.meaning.en,'enemy');assert.equal(word.example,animeQuotes[0].text);assert.equal(word.editorReviewed,false);assert.equal(word.level,'unassigned');assert.ok(word.tags.includes('Vinland Saga'));assert.match(word.notes,/https:\/\/kotobank.jp/);
 assert.equal(word.sourceSnapshot.quoteId,'vinland-enemies');assert.equal(word.sourceSnapshot.text,animeQuotes[0].text);assert.equal(word.sourceSnapshot.glossaryVersion,ANIME_GLOSSARY_VERSION);assert.equal(word.sourceSnapshot.verifiedGlossary,true);assert.equal(word.sourceSnapshot.sourceUrl,animeQuotes[0].source);assert.deepEqual(f.state.events,[{id:'existing-history'}]);assert.deepEqual(f.state.skillStates,{});assert.equal(f.messages.length,1);assert.match(f.feature.panel('vinland-enemies'),/role="status"/u);
 await f.feature.submit(saveForm(capture));assert.equal(f.commits,1);assert.equal(f.state.personal.words.length,1);
}));
test('all built-in previews save within bounds, and fictional/dictionary forms retain their notes',async()=>withFormData(async()=>{
 for(const quote of animeQuotes)for(const entry of animeGlossaryFor(quote)){
  const f=fixture(base(quote.id)),capture=await open(f,quote.id,entry.id);await f.feature.submit(saveForm(capture,{note:'a'.repeat(250)},quote.id));const word=f.state.personal.words[0];assert.ok(word,entry.id);assert.ok(word.notes.length<=1000);assert.equal(word.written,entry.written);assert.equal(word.reading,entry.reading);
  if(entry.fictional)assert.ok(word.tags.includes('Kurgu terimi'));if(entry.id==='jjk-kakkotsukeru')assert.match(word.notes,/sözlük biçimi/u);
 }
}));
test('duplicate and limit errors leave decks, existing cards and history unchanged',async()=>withFormData(async()=>{
 let state=createPersonalDeck(base(),'Existing',{id:'existing-deck'});state=upsertPersonalWord(state,{deckId:'existing-deck',written:'敵',reading:'てき',tr:'kendi anlam notum',en:''},{id:'existing-word'});
 const f=fixture(state),capture=await open(f);assert.match(f.feature.panel('vinland-enemies'),/zaten var/u);await f.feature.submit(saveForm(capture,{deckId:'existing-deck'}));assert.equal(f.commits,0);assert.equal(f.state.personal.words[0].meaning.tr,'kendi anlam notum');assert.equal(f.state.personal.words[0].revision,1);
 await f.feature.submit(saveForm(capture,{newDeckName:'Existing'}));assert.equal(f.commits,0);assert.equal(f.state.personal.decks.length,1);
 const limited=base();limited.personal.decks=Array.from({length:PERSONAL_LIMITS.decks},(_,i)=>({id:'deck-'+i,name:'Deck '+i}));const g=fixture(limited),id=await open(g);await g.feature.submit(saveForm(id));assert.equal(g.commits,0);assert.equal(g.state.personal.decks.length,PERSONAL_LIMITS.decks);
 const wordLimited=createPersonalDeck(base(),'Existing',{id:'existing-deck'});wordLimited.personal.words=Array.from({length:PERSONAL_LIMITS.words},(_,i)=>({id:'word-'+i,written:'語'+i,reading:'ご',deckId:'existing-deck'}));const h=fixture(wordLimited),hId=await open(h);await h.feature.submit(saveForm(hId,{deckId:'existing-deck'}));assert.equal(h.commits,0);assert.equal(h.state.personal.words.length,PERSONAL_LIMITS.words);
}));
test('custom lines require manual kana and meaning, preserve a point-in-time source, and never infer data',async()=>withFormData(async()=>{
 const quote=createCustomQuote({text:'学校へ行きます。',target:'学校',reading:'がっこうへいきます。',source:'https://www.youtube.com/watch?v=h8-MxeYYwJE',series:'My series'},'manual'),state=base(quote.id);state.anime.customQuotes.push(quote);const f=fixture(state);
 assert.doesNotMatch(animeQuoteTokens(quote,ui()),/data-action/u);await f.feature.click({dataset:{action:'anime-deck-custom',quoteId:quote.id}});let html=f.feature.panel(quote.id);assert.match(html,/name="reading"[^>]+value=""/u);assert.match(html,/name="tr"[^>]+value=""/u);assert.match(html,/tahmin edilmeyecek/u);const capture=html.match(/data-capture-id="([^"]+)"/u)[1];
 await f.feature.submit(saveForm(capture,{written:'学校',reading:'school',tr:'okul'},quote.id));assert.equal(f.commits,0);assert.match(f.feature.panel(quote.id),/hiragana veya katakana/u);
 await f.feature.submit(saveForm(capture,{written:'未知',reading:'みち',tr:'bilinmeyen'},quote.id));assert.equal(f.commits,0);assert.match(f.feature.panel(quote.id),/bu replikte geçen/u);
 state.anime.customQuotes[0].text='学校で働きます。';await f.feature.submit(saveForm(capture,{written:'学校',reading:'がっこう',tr:'okul',en:'',note:'Kendi notum'},quote.id));assert.equal(f.commits,1);const word=f.state.personal.words[0];assert.equal(word.meaning.en,'');assert.equal(word.sourceSnapshot.verifiedGlossary,false);assert.equal(word.sourceSnapshot.glossarySource,null);assert.equal(word.example,'学校へ行きます。');assert.equal(word.sourceSnapshot.text,'学校へ行きます。');assert.ok(word.tags.includes('Kullanıcı notu'));assert.match(word.notes,/bağımsız doğrulanmadı/u);assert.deepEqual(f.state.events,[{id:'existing-history'}]);
}));
test('failed storage preserves the draft; stale or concurrent confirmations cannot add duplicates',async()=>withFormData(async()=>{
 const f=fixture(base(),{fail:true}),capture=await open(f);await f.feature.submit(saveForm(capture,{newDeckName:'Uncommitted <deck>',note:'My unsaved note'}));assert.equal(f.state.personal.words.length,0);let html=f.feature.panel('vinland-enemies');assert.match(html,/Uncommitted &lt;deck&gt;/u);assert.match(html,/My unsaved note/u);assert.match(html,/yeniden deneyebilirsin/u);
 const g=fixture(),first=await open(g),second=await open(g,'vinland-enemies','vinland-ore');assert.notEqual(first,second);await g.feature.submit(saveForm(first));assert.equal(g.commits,0);g.state.anime.activeId='naruto-nindo';await g.feature.submit(saveForm(second));assert.equal(g.commits,0);
 let release;const h=fixture(base(),{commitHook:()=>new Promise(resolve=>{release=resolve;})}),id=await open(h);const pending=h.feature.submit(saveForm(id));assert.equal(h.commits,1);await h.feature.submit(saveForm(id));assert.equal(h.commits,1);release();await pending;assert.equal(h.state.personal.words.length,1);
}));
test('custom form escapes hostile values, rejects overlong notes and suppresses unsafe source URLs',async()=>withFormData(async()=>{
 const quote={...createCustomQuote({text:'学校へ行きます。',target:'学校'},'unsafe'),source:'javascript:alert(1)',series:'<img src=x onerror=alert(1)>'},state=base(quote.id);state.anime.customQuotes.push(quote);const f=fixture(state);await f.feature.click({dataset:{action:'anime-deck-custom',quoteId:quote.id}});const capture=f.feature.panel(quote.id).match(/data-capture-id="([^"]+)"/u)[1];
 await f.feature.submit(saveForm(capture,{written:'学校',reading:'がっこう',tr:'<script>alert(1)</script>',newDeckName:'<deck>',note:'x'.repeat(251)},quote.id));assert.equal(f.commits,0);let html=f.feature.panel(quote.id);assert.doesNotMatch(html,/<img|<script|href="javascript:/u);assert.match(html,/&lt;script&gt;/u);assert.match(html,/&lt;deck&gt;/u);
 await f.feature.submit(saveForm(capture,{written:'学校',reading:'がっこう',tr:'okul',note:'safe'},quote.id));assert.equal(f.state.personal.words[0].sourceSnapshot.sourceUrl,'');assert.doesNotMatch(f.state.personal.words[0].notes,/javascript:/u);
}));
test('anime page hook decorates only quote text and leaves existing exercise controls intact',()=>{
 const state=base();state.anime.practice={quoteId:'vinland-enemies',feedback:null};const html=animePage(state,ui(),{quoteTokens:animeQuoteTokens,panel:id=>`<section data-capture-panel="${id}"></section>`});assert.match(html,/data-action="anime-deck-select"/u);assert.match(html,/data-capture-panel="vinland-enemies"/u);assert.match(html,/data-form="quote-answer"/u);assert.match(html,/name="answer"/u);assert.match(html,/data-action="quote-practice"/u);assert.match(html,/id="video-panel"/u);
});
