import test from 'node:test';
import assert from 'node:assert/strict';
import {pronunciationText,pronunciationControls,createJapaneseSpeech} from '../dist/src/word-speech.js';
import {studyWords} from '../dist/src/study-data.js';
import {kanjiWords} from '../dist/src/characters.js';
import {lexemes,getQuestion} from '../dist/src/content.js';
import {questionWord} from '../dist/src/reading-ui.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const u={T:(tr,en)=>tr,esc,showQuestionReadings:false};
function fakeSpeech(voices=[{lang:'en-US',name:'English'},{lang:'ja-JP',name:'Japanese'}]){
 const spoken=[],changes=[];let cancellations=0;
 class Utterance{constructor(text){this.text=text;}}
 const engine={getVoices:()=>voices,speak:value=>spoken.push(value),cancel:()=>{cancellations++;}};
 const player=createJapaneseSpeech({engine,Utterance,onChange:s=>changes.push(s)});
 return {player,spoken,changes,engine,get cancellations(){return cancellations;}};
}
test('all vocabulary, kanji words and saved-word readings use explicit kana rather than guessing from kanji',()=>{
 for(const word of [...studyWords,...kanjiWords.map(w=>({written:w.word,reading:w.kana})),...lexemes.map(w=>({written:w.written,reading:w.readings[0].kana}))])assert.ok(pronunciationText(word),word.written);
 assert.equal(pronunciationText({written:'生'}),null);
 assert.equal(pronunciationText({reading:'school'}),null);
 assert.equal(pronunciationText({reading:'学校'}),null);
 assert.equal(pronunciationText({reading:'ｺｰﾋｰ'}),'コーヒー');
 assert.equal(pronunciationText({reading:'あ'.repeat(301)}),null);
});
test('missing Japanese voices never fall back to an English voice and later-loaded Japanese voices become available',()=>{
 const voices=[{lang:'en-US'}],f=fakeSpeech(voices);
 assert.deepEqual(f.player.play({text:'がっこう',key:'school'}),{ok:false,reason:'no-japanese-voice'});assert.equal(f.spoken.length,0);
 voices.push({lang:'ja'});assert.equal(f.player.voices().length,1);assert.equal(f.player.play({text:'がっこう',key:'school'}).ok,true);assert.equal(f.spoken[0].lang,'ja');
 const unsupported=createJapaneseSpeech({engine:null,Utterance:null});assert.equal(unsupported.voices().length,0);
});
test('normal and slow speech select Japanese, preserve the kana reading and update playback state',()=>{
 const f=fakeSpeech();assert.equal(f.player.play({text:'がっこう',key:'school'}).ok,true);
 const normal=f.spoken[0];assert.equal(normal.text,'がっこう');assert.equal(normal.lang,'ja-JP');assert.equal(normal.rate,1);assert.equal(normal.voice.name,'Japanese');assert.equal(f.player.snapshot().phase,'queued');
 normal.onstart();assert.equal(f.player.snapshot().phase,'speaking');
 assert.equal(f.player.play({text:'コーヒー',key:'coffee',speed:'slow'}).ok,true);assert.equal(f.cancellations,1);assert.equal(f.spoken[1].rate,.65);
 normal.onend();normal.onerror();assert.equal(f.player.snapshot().key,'coffee');assert.equal(f.player.snapshot().phase,'queued');
 f.spoken[1].onstart();f.spoken[1].onend();assert.equal(f.player.snapshot().phase,'idle');
});
test('stopping and playback errors cannot leave a stale speaking state or affect a subsequent word',()=>{
 const f=fakeSpeech();f.player.play({text:'ほん',key:'book'});const old=f.spoken[0];f.player.stop();assert.equal(f.cancellations,1);old.onstart();assert.equal(f.player.snapshot().phase,'idle');
 f.player.play({text:'みず',key:'water'});f.spoken[1].onerror();assert.equal(f.player.snapshot().phase,'error');assert.equal(f.player.snapshot().key,'water');
 f.engine.speak=()=>{throw Error('Device failed');};assert.deepEqual(f.player.play({text:'き',key:'tree'}),{ok:false,reason:'playback-error'});assert.equal(f.player.snapshot().phase,'error');
 assert.equal(f.player.play({text:'き',key:'tree',speed:'unexpected'}).ok,false);
});
test('question audio is an explicit hint, survives both feedback outcomes and is absent from sentence gaps',()=>{
 const q=getQuestion('study:vocabulary:w-variable:reading');
 const before=questionWord(q,null,u);assert.match(before,/data-pronunciation-reading="へんすう"/);assert.match(before,/data-pronunciation-hint="true"/);assert.match(before,/class="question-reading"[^>]*hidden/);
 for(const correct of [true,false]){const html=questionWord(q,{correct},u);assert.match(html,/data-pronunciation-hint="false"/);assert.match(html,/data-speed="slow"/);}
 assert.doesNotMatch(questionWord({context:'___をください。'},null,u),/data-action="pronounce"/);
 const html=pronunciationControls({written:'<unsafe>',reading:'ほん'},u);assert.doesNotMatch(html,/<unsafe>/);assert.match(html,/&lt;unsafe&gt;/);assert.equal(pronunciationControls({written:'生'},u),'');
});
