import {studyLevels,wordTopics} from './study-data.js';
import {recordAnswer} from './model.js';
import {defaultListening,filterListeningWords,createListeningSession,getListeningQuestion,listeningKey,createListeningGate} from './listening-data.js';
import {kanjiText} from './reading-ui.js';

export function createListeningFeature({getState,commit,ui,toast,isBusy,player,onQuestionStart,root=globalThis.document}){
 const gate=createListeningGate(),contexts=new Map();let startedAt=0;
 const scope=session=>`listening:${session.id}:${session.index}`;
 const available=()=>player.voices().length>0;
 const canAnswer=(q,scopeKey)=>q.skill!=='listening'||gate.has(listeningKey(q,scopeKey));
 const answerEvidence=(q,scopeKey)=>q.skill==='listening'?{...gate.evidence(listeningKey(q,scopeKey)),listeningMode:q.listeningMode,readingHintShown:false,pronunciationHintRequested:false}:{};
 function sync(){
  if(!root)return;
  const current=player.snapshot(),supported=available(),{T}=ui();
  for(const block of root.querySelectorAll('[data-listening-key]')){
   const key=block.dataset.listeningKey,heard=gate.has(key),active=current.key===key&&['queued','speaking'].includes(current.phase);
   for(const button of block.querySelectorAll('[data-action="listening-play"]'))button.disabled=!supported;
   const stop=block.querySelector('[data-action="listening-stop"]');if(stop)stop.hidden=!active;
   const form=block.querySelector('form');if(form&&!block.dataset.feedback){for(const field of form.querySelectorAll('input,fieldset,button'))field.disabled=!heard;}
   const status=block.querySelector('.listening-status');if(status)status.textContent=!supported?T('Bu cihaz/tarayıcıda Japonca ses bulunamadı. Dinleme soruları için Japonca ses desteği gerekir.','No Japanese voice is available on this device/browser. Listening questions require Japanese speech support.'):active?T('Ses çalınıyor…','Audio is playing…'):current.key===key&&current.phase==='error'?T('Ses tamamlanamadı. Yeniden dinle; tamamlanmadan cevap kaydedilmez.','Audio could not finish. Replay it; answers cannot be recorded before playback completes.'):heard?T('Ses tamamlandı. Cevaplayabilir veya yeniden dinleyebilirsin.','Playback finished. Answer or listen again.'):T('Cevaplamadan önce sesi bir kez sonuna kadar dinle.','Play the audio to the end once before answering.');
  }
  for(const button of root.querySelectorAll('[data-action="listening-start"]'))button.disabled=!supported||!filterListeningWords(getState(),getState().listening).length;
 }
 function renderExercise(question,event,{form='listening-answer',next='listening-next',scopeKey}={}){
  const {T,L,esc}=ui(),key=listeningKey(question,scopeKey),heard=canAnswer(question,scopeKey),blocked=!heard||!!event;
  contexts.set(key,{question,scopeKey});if(contexts.size>500)contexts.delete(contexts.keys().next().value);
  const formAttrs=(form==='answer-form'?'id="answer-form"':`data-form="${esc(form)}"`)+` data-listening-question="${esc(question.id)}" data-listening-scope="${esc(scopeKey)}"`;
  return `<section class="exercise-card listening-exercise" data-listening-key="${esc(key)}" ${event?'data-feedback="true"':''}><span class="level-pill">${T('Dinleme','Listening')} · ${question.listeningMode==='dictation'?T('Dikte','Dictation'):T('Anlam','Meaning')}</span><h2 id="listening-prompt">${esc(L(question.prompt))}</h2><div class="listening-ear" aria-hidden="true">♪</div><div class="pronunciation-buttons listening-buttons"><button type="button" data-action="listening-play" data-speed="normal" ${available()?'':'disabled'}>▷ ${T('Dinle','Listen')}</button><button type="button" data-action="listening-play" data-speed="slow" ${available()?'':'disabled'}>${T('Yavaş dinle','Listen slowly')}</button><button type="button" data-action="listening-stop" hidden>${T('Durdur','Stop')}</button></div><p class="listening-status" role="status">${T('Cevaplamadan önce sesi bir kez sonuna kadar dinle.','Play the audio to the end once before answering.')}</p><p class="small muted">${T('Sentetik Japonca ses · Ses cihaza göre değişir.','Synthetic Japanese voice · Voice varies by device.')}</p>${question.personal?`<p class="small muted">${T('Kişisel destendeki okunuş kullanılır; kullanıcı içeriğidir.','Uses your personal deck reading; this is user-authored content.')}</p>`:''}<form ${formAttrs} aria-labelledby="listening-prompt">${question.choices?`<fieldset class="choices listening-choices" ${blocked?'disabled':''}><legend class="sr-only">${T('Cevabın','Your answer')}</legend>${L(question.choices).map(value=>`<label class="choice"><input type="radio" name="answer" value="${esc(value)}" required ${event?.answer===value?'checked':''}><span>${esc(value)}</span></label>`).join('')}</fieldset>`:`<label class="answer-label" for="listening-answer-input">${T('Duyduğun okunuş · kana','What you hear · kana')}</label><input id="listening-answer-input" class="answer-input" name="answer" lang="ja" maxlength="300" required autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${T('Kana ile yaz…','Type in kana…')}" ${blocked?'disabled':''} value="${esc(event?.answer||'')}">`}${event?'':`<button type="submit" class="btn primary full-width" ${blocked?'disabled':''}>${T('Kontrol et','Check answer')}</button>`}</form>${event?`<div class="feedback ${event.correct?'correct':'incorrect'}" tabindex="-1" role="status"><strong>${event.correct?T('Doğru!','Correct!'):T('Birlikte bakalım.','Let’s take a look.')}</strong><div class="listening-reveal" lang="ja"><h3>${kanjiText(question.word.written,ui())}</h3><p>${esc(question.audio.reading)}</p></div><p>${esc(question.meaning[getState().settings.language]||question.meaning.tr)}</p><p>${T('Kabul edilen','Accepted')}: ${esc(L(question.answers).join(' / '))}</p><p class="small muted">${T('Bu cevap dinleme becerisine kaydedildi; genel dil yeterliliği puanı değildir.','This answer was recorded for listening; it is not an overall proficiency score.')}</p></div><button type="button" class="btn primary full-width" data-action="${esc(next)}">${T('Devam et','Continue')}</button>`:''}</section>`;
 }
 function page(){
  const state=getState(),config=state.listening,{T,esc}=ui(),s=config.session,words=filterListeningWords(state,config);
  const options=(values,current)=>values.map(([value,label])=>`<option value="${esc(value)}" ${value===current?'selected':''}>${esc(label)}</option>`).join('');
  let stage='';
  if(s?.phase==='exercise'){
   const q=s.questions[s.index],event=state.events.find(e=>e.id===s.feedback);
   const exercise=getListeningQuestion(q.id,state)?renderExercise(q,event,{scopeKey:scope(s)}):`<div class="info-note"><p>${T('Bu kelime kaldırılmış veya artık kullanılamıyor. Atlamak cevap kaydı oluşturmaz.','This word was removed or is unavailable. Skipping does not record an answer.')}</p><button type="button" class="btn secondary" data-action="listening-skip">${T('Bu soruyu atla','Skip this question')}</button></div>`;
   stage=`<section class="listening-round"><div class="section-top"><h2 tabindex="-1" id="listening-round-title">${T('Dinleme turu','Listening round')} · ${s.index+1} / ${s.questions.length}</h2><button type="button" class="subtle-link" data-action="listening-close">${T('Turu kapat','Close round')}</button></div>${exercise}</section>`;
  }else if(s?.phase==='done'){
   const events=state.events.filter(e=>s.eventIds.includes(e.id));stage=`<section class="panel listening-complete"><h2>${T('Dinleme turu tamam.','Listening round complete.')}</h2><p>${events.filter(e=>e.correct).length} / ${events.length} ${T('doğru cevap','correct answers')}</p><p>${T('Cevapların dinleme becerisi olarak tekrar planına eklendi.','Your answers were added to listening reviews.')}</p><button type="button" class="btn secondary" data-action="listening-close">${T('Seçime dön','Back to selection')}</button></section>`;
  }
  return `<div class="page-heading"><p class="eyebrow">${T('DİNLEME ATÖLYESİ','LISTENING STUDIO')}</p><h1 tabindex="-1">${T('Önce dinle. Sonra hatırla.','Listen first. Then recall.')}</h1><p class="muted">${T('Kelimeyi görmeden anlamını seç veya duyduğun okunuşu kana ile yaz.','Choose the meaning without seeing the word, or write what you hear in kana.')}</p></div><section class="panel listening-config"><div class="form-grid"><label>${T('Kelime kaynağı','Word source')}<select data-listening-setting="source">${options([['builtin',T('Hazır kelimeler','Built-in words')],['personal',T('Kişisel desteler','Personal decks')],['all',T('Hepsi','All')]],config.source)}</select></label><label>${T('Alıştırma','Exercise')}<select data-listening-setting="mode">${options([['meaning',T('Duyduğunun anlamını seç','Choose the meaning')],['dictation',T('Duyduğunu kana ile yaz','Write what you hear in kana')]],config.mode)}</select></label>${config.source!=='personal'?`<label>${T('Hazır kelime düzeyi','Built-in word level')}<select data-listening-setting="level">${options([['all',T('Tümü','All')],...studyLevels.map(level=>[level,level])],config.level)}</select></label><label>${T('Hazır kelime konusu','Built-in word topic')}<select data-listening-setting="category">${options([['all',T('Tümü','All')],...wordTopics.map(topic=>[topic.id,topic[state.settings.language]])],config.category)}</select></label>`:''}${config.source!=='builtin'?`<label>${T('Kişisel deste','Personal deck')}<select data-listening-setting="deckId">${options([['all',T('Tüm desteler','All decks')],...state.personal.decks.map(deck=>[deck.id,deck.name])],config.deckId)}</select></label>`:''}</div><p class="small muted">${words.length} ${T('kelime uygun · Tur en fazla 10 farklı soru içerir.','words available · Each round contains up to 10 different questions.')}</p>${available()?'':`<p class="info-note">${T('Bu cihaz/tarayıcı Japonca ses sunmuyor. Japonca ses ekleyip uygulamayı yeniden açtığında dinleme turu başlatabilirsin.','This device/browser does not provide a Japanese voice. Add one and reopen the app to start a listening round.')}</p>`}<button type="button" class="btn primary" data-action="listening-start" ${available()&&words.length?'':'disabled'}>${T('Dinleme turu başlat','Start listening round')}</button><p class="small muted">${T('Mevcut tur başladıktan sonra kaynak seçimini değiştirmek o turu değiştirmez. Kişisel destelerin etiketleri kullanıcıya aittir.','Changing the selection does not replace an existing round. Personal deck labels are user-authored.')}</p></section>${stage}`;
 }
 async function click(target){
  const action=target.dataset.action;if(!action?.startsWith('listening-'))return false;
  if(action==='listening-stop'){player.stop();return true;}
  if(action==='listening-play'){
   const key=target.closest('[data-listening-key]')?.dataset.listeningKey,context=contexts.get(key);if(!context)return true;
   const result=player.play({text:context.question.audio.reading,key,speed:target.dataset.speed});if(!result.ok)toast(ui().T('Japonca ses çalınamadı.','Japanese audio could not play.'));sync();return true;
  }
  if(isBusy())return true;
  const state=getState(),next=structuredClone(state);
  if(action==='listening-start'){
   if(!available())return true;const s=createListeningSession(state,state.listening);if(!s)return true;next.listening.session=s;
   if(await commit(next)){startedAt=performance.now();onQuestionStart?.();document.querySelector('#listening-round-title')?.focus({preventScroll:true});document.querySelector('.listening-round')?.scrollIntoView({block:'start'});}return true;
  }
  if(action==='listening-close'){next.listening.session=null;await commit(next);return true;}
  if(action==='listening-next'||action==='listening-skip'){
   const s=next.listening.session;if(!s||(!s.feedback&&(action!=='listening-skip'||getListeningQuestion(s.questions[s.index]?.id,state))))return true;s.index++;s.feedback=null;if(s.index>=s.questions.length)s.phase='done';
   if(await commit(next)){startedAt=performance.now();onQuestionStart?.();document.querySelector('#listening-round-title')?.focus({preventScroll:true});}return true;
  }
  return true;
 }
 async function submit(form){
  if(form.dataset.form!=='listening-answer')return false;if(isBusy())return true;
  const state=getState(),s=state.listening.session;if(!s||s.phase!=='exercise'||s.feedback)return true;const q=s.questions[s.index],key=scope(s);
  if(form.dataset.listeningQuestion!==q.id||form.dataset.listeningScope!==key){toast(ui().T('Soru değişti. Güncel soruyla devam et.','The question changed. Continue with the current question.'));return true;}
  if(!getListeningQuestion(q.id,state)){toast(ui().T('Bu kelime artık kullanılamıyor. Soruyu atlayabilirsin.','This word is no longer available. You can skip the question.'));return true;}
  if(!canAnswer(q,key)){toast(ui().T('Önce sesi sonuna kadar dinle.','Play the audio to the end first.'));return true;}
  const answer=String(new FormData(form).get('answer')||'').trim();if(!answer)return true;
  const id=crypto.randomUUID(),next=recordAnswer(state,q,answer,new Date(),id,Math.min(600000,Math.round(performance.now()-startedAt)),'listening');
  next.listening.session.feedback=id;next.listening.session.eventIds.push(id);Object.assign(next.events.at(-1),answerEvidence(q,key));if(await commit(next))document.querySelector('.listening-exercise .feedback')?.focus({preventScroll:true});return true;
 }
 async function change(target){
  const name=target.dataset.listeningSetting;if(!name)return false;if(isBusy())return true;
  const defaults=defaultListening();if(!(name in defaults)||name==='session')return true;
  const next=structuredClone(getState());next.listening[name]=target.value;await commit(next);return true;
 }
 function onSpeechChange(snapshot){if(snapshot.key&&contexts.has(snapshot.key)||!snapshot.key)gate.update(snapshot);sync();}
 return {page,click,submit,change,renderExercise,canAnswer,answerEvidence,onSpeechChange,sync};
}
