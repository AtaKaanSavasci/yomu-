import {studyWords} from './study-data.js';
import {personalWordPool} from './personal-data.js';
import {pronunciationText} from './word-speech.js';
const bi=(tr,en)=>({tr,en});
export const defaultListening=()=>({source:'builtin',level:'N5',category:'all',deckId:'all',mode:'meaning',session:null});
const kana=value=>String(value).normalize('NFKC').replace(/[ァ-ヶ]/gu,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/\s+/gu,'').trim();
export function listeningWordPool(state){
 return [...studyWords.map(word=>({...word,source:'builtin',sourceId:word.id,itemId:`study-${word.id}`})),...personalWordPool(state).map(word=>({...word,source:'personal',sourceId:word.id,itemId:`personal-${word.id}`}))].filter(pronunciationText);
}
export function filterListeningWords(state,config){
 return listeningWordPool(state).filter(word=>(config.source==='all'||word.source===config.source)&&(word.source==='personal'?(config.deckId==='all'||word.deckId===config.deckId):((config.level==='all'||word.level===config.level)&&(config.category==='all'||word.category===config.category))));
}
export function getListeningQuestion(id,state){
 const match=/^listening:(builtin|personal):([a-z0-9-]+):(meaning|dictation)$/.exec(id);if(!match)return null;
 const [,source,sourceId,mode]=match,pool=listeningWordPool(state),word=pool.find(w=>w.source===source&&w.sourceId===sourceId);if(!word)return null;
 const readings=[...new Set([word.reading.normalize('NFKC').trim(),kana(word.reading),kana(word.reading).replace(/[ぁ-ゖ]/gu,c=>String.fromCharCode(c.charCodeAt(0)+0x60))])];
 const answers=mode==='dictation'?bi(readings,readings):bi([word.meaning.tr],[word.meaning.en||word.meaning.tr]);
 const question={id,itemId:word.itemId,version:`${word.version||word.revision||1}:listening-v1`,sourceType:'listening',skill:'listening',listeningMode:mode,context:'',word:{written:word.written,reading:word.reading},meaning:word.meaning,audio:{reading:word.reading,source:'browser-tts'},responseType:mode==='meaning'?'choice':'typed',prompt:mode==='meaning'?bi('Dinlediğin kelimenin anlamını seç.','Choose the meaning of the word you hear.'):bi('Dinlediğini kana ile yaz.','Write what you hear in kana.'),answers,explanation:bi(`${word.written} → ${word.reading} · ${word.meaning.tr}`,`${word.written} → ${word.reading} · ${word.meaning.en||word.meaning.tr}`),personal:source==='personal',englishFallback:!!word.englishFallback};
 if(mode==='meaning'){
  question.choices={};
  for(const lang of ['tr','en']){
   const correct=word.meaning[lang]||word.meaning.tr,options=[correct],seen=new Set([correct.toLocaleLowerCase(lang==='tr'?'tr-TR':'en-US')]);
   for(const other of pool){
    if(kana(other.reading)===kana(word.reading))continue;
    const value=other.meaning[lang]||other.meaning.tr,key=value.toLocaleLowerCase(lang==='tr'?'tr-TR':'en-US');if(seen.has(key))continue;
    seen.add(key);options.push(value);if(options.length===4)break;
   }
   const offset=[...id].reduce((sum,c)=>sum+c.codePointAt(0),0)%options.length;
   question.choices[lang]=options.slice(offset).concat(options.slice(0,offset));
  }
 }
 return question;
}
export function createListeningSession(state,config,random=Math.random,id=crypto.randomUUID()){
 const words=filterListeningWords(state,config);for(let i=words.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[words[i],words[j]]=[words[j],words[i]];}
 const questions=words.slice(0,10).map(word=>getListeningQuestion(`listening:${word.source}:${word.sourceId}:${config.mode}`,state)).filter(Boolean);
 if(!questions.length)return null;
 return {id,ids:questions.map(q=>q.id),questions,index:0,eventIds:[],feedback:null,phase:'exercise'};
}
export const listeningKey=(question,scope)=>`${scope}|${question.id}|${question.version}`;
// A completed synthesizer callback is evidence of playback, not proof of human hearing.
export function createListeningGate(){
 const completed=new Map();let active=null;
 function update(snapshot){
  if(!snapshot.key){active=null;return;}
  if(snapshot.phase==='queued'){active={key:snapshot.key,started:false,speed:snapshot.speed};return;}
  if(active?.key!==snapshot.key)return;
  if(snapshot.phase==='speaking')active.started=true;
  if(snapshot.phase==='idle'){if(active.started)completed.set(active.key,{audioSource:'browser-tts',audioPlaybackCompleted:true,audioSpeed:active.speed||'normal'});active=null;}
  if(snapshot.phase==='error')active=null;
  if(completed.size>500)completed.delete(completed.keys().next().value);
 }
 return {update,has:key=>completed.has(key),evidence:key=>completed.has(key)?{...completed.get(key)}:{},clear:()=>{completed.clear();active=null;}};
}
