// Speak the content's explicit kana reading, never infer a kanji pronunciation.
export function pronunciationText(word) {
 const text=typeof word?.reading==='string'?word.reading.normalize('NFKC').trim():'';
 return text&&text.length<=300&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー・\s]+$/u.test(text)?text:null;
}
export function pronunciationControls(word,{T,esc},{questionId='',hint=false}={}) {
 const reading=pronunciationText(word);if(!reading)return '';
 const key=questionId?`question:${questionId}`:`word:${word.written}:${reading}`;
 return `<div class="word-pronunciation" data-pronunciation-key="${esc(key)}" data-pronunciation-reading="${esc(reading)}" data-pronunciation-question="${esc(questionId)}" data-pronunciation-hint="${hint}"><div class="pronunciation-buttons" role="group" aria-label="${T('Kelimenin sesli okunuşu','Word pronunciation')}"><button type="button" class="pronunciation-play" data-action="pronounce" data-speed="normal" aria-pressed="false" disabled><span aria-hidden="true">▷</span> ${T('Dinle','Listen')}</button><button type="button" class="pronunciation-play" data-action="pronounce" data-speed="slow" aria-pressed="false" disabled>${T('Yavaş dinle','Listen slowly')}</button><button type="button" data-action="stop-pronunciation" hidden>${T('Durdur','Stop')}</button></div><p class="pronunciation-status" role="status">${T('Japonca ses denetleniyor…','Checking Japanese voice…')}</p>${hint?`<p class="pronunciation-hint-note">${T('Soruyu cevaplamadan dinlemek bir ipucudur.','Listening before answering is a hint.')}</p>`:''}</div>`;
}
export function createJapaneseSpeech({engine=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,onChange=()=>{}}={}) {
 let revision=0,activeUtterance=null,current={key:null,phase:'idle',speed:null};
 const voices=()=>{try{return typeof Utterance==='function'&&engine?.getVoices?engine.getVoices().filter(v=>/^ja(?:[-_]|$)/i.test(v.lang)):[];}catch{return [];}};
 const emit=value=>{current=value;onChange({...current});};
 const stop=()=>{const active=['queued','speaking'].includes(current.phase);revision++;activeUtterance=null;current={key:null,phase:'idle',speed:null};if(active)try{engine.cancel();}catch{}onChange({...current});};
 function play({text,key,speed='normal'}) {
  if(typeof text!=='string'||!text.trim()||text.length>2000)return {ok:false,reason:'invalid-text'};
  if(!['normal','slow'].includes(speed))return {ok:false,reason:'invalid-speed'};
  const available=voices(),voice=available.find(v=>/^ja[-_]JP$/i.test(v.lang))||available[0];
  if(!voice)return {ok:false,reason:'no-japanese-voice'};
  stop();const id=revision;
  try {
   const utterance=new Utterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=speed==='slow'?0.65:1;
   utterance.onstart=()=>{if(id===revision)emit({key,phase:'speaking',speed});};
   utterance.onend=()=>{if(id===revision){activeUtterance=null;emit({key,phase:'idle',speed:null});}};
   utterance.onerror=()=>{if(id===revision){activeUtterance=null;emit({key,phase:'error',speed:null});}};
   // Keep the utterance alive until completion; browsers may release callbacks otherwise.
   activeUtterance=utterance;emit({key,phase:'queued',speed});engine.speak(activeUtterance);return {ok:true};
  }catch{if(id===revision){activeUtterance=null;emit({key,phase:'error',speed:null});}return {ok:false,reason:'playback-error'};}
 }
 return {voices,play,stop,snapshot:()=>({...current})};
}
export function syncPronunciationControls(root,u,player) {
 const {T}=u,available=player.voices().length>0,current=player.snapshot();
 for(const group of root.querySelectorAll('.word-pronunciation')) {
  const selected=current.key===group.dataset.pronunciationKey,active=selected&&['queued','speaking'].includes(current.phase);
  for(const button of group.querySelectorAll('.pronunciation-play')){button.disabled=!available;button.setAttribute('aria-pressed',String(active&&current.speed===button.dataset.speed));}
  group.querySelector('[data-action="stop-pronunciation"]').hidden=!active;
  group.querySelector('.pronunciation-status').textContent=!available?T('Bu cihaz/tarayıcıda Japonca ses bulunamadı. Cihazının seslendirme ayarlarından Japonca ses ekleyip yeniden açabilirsin.','No Japanese voice was found on this device/browser. You can add a Japanese voice in your device’s speech settings and reopen the app.'):selected&&current.phase==='error'?T('Ses çalınamadı. Yeniden deneyebilirsin.','Audio could not be played. You can retry.'):active?(current.phase==='queued'?T('Ses hazırlanıyor…','Preparing audio…'):T('Okunuyor…','Speaking…')):T('Sentetik Japonca ses · Ses cihaza göre değişir.','Synthetic Japanese voice · Voice varies by device.');
 }
}
