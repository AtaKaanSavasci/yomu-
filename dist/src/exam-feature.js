import {studyLevels} from './study-data.js';
import {defaultExams,normaliseExams,createExamSession,saveExamAnswer,finishExamState,scoreExamSession,examRemaining,markExamAudioUnavailable,createListeningGate} from './exam-data.js';

export function createExamFeature({getState,commit,ui,toast,isBusy,player,onQuestionStart,root=globalThis.document}){
 const gate=createListeningGate(),contexts=new Map();let writing=false;
 const state=()=>getState(),config=()=>normaliseExams(state().exams),hasAudio=()=>!!player?.voices().length;
 const audioKey=(session,q)=>`exam:${session.id}|${q.id}|${q.version}`;
 const sections=()=>{const {T}=ui();return {vocabulary:T('Kelime','Vocabulary'),grammar:T('Gramer','Grammar'),reading:T('Okuma','Reading'),listening:T('Dinleme','Listening')};};
 const heading=()=>{const {T}=ui();return `<div class="page-heading"><p class="eyebrow">N5 → N1</p><h1 tabindex="-1">${T('Seviye denemeleri','Level practice tests')}</h1><p class="muted">${T('Süreni seç, soruları gez ve sonucu bitirdiğinde incele.','Choose a time limit, move between questions and review your answers when finished.')}</p></div><p class="exam-disclosure">${T('Bu özgün bir çalışma denemesidir; resmî JLPT sınavı değildir. Düzeyler yaklaşık çalışma bantlarıdır. Doğru sayısı geçme, yeterlik veya resmî JLPT puanı göstermez.','This is an original practice test, not an official JLPT examination. Levels are approximate study bands. Correct-answer counts do not indicate a pass, proficiency or an official JLPT score.')}</p>`;};
 const formatTime=remaining=>{const seconds=Math.ceil(remaining/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
 const scopeAttrs=s=>`data-exam-session="${ui().esc(s.id)}" data-exam-question="${ui().esc(s.questions[s.index]?.id||'')}" data-exam-index="${s.index}"`;
 const sameScope=(target,s)=>!!s&&target.dataset.examSession===s.id&&target.dataset.examQuestion===s.questions[s.index]?.id&&Number(target.dataset.examIndex)===s.index;
 const focusQuestion=()=>{root?.querySelector('#exam-question-title')?.focus({preventScroll:true});root?.querySelector('.exam-stage')?.scrollIntoView({block:'start'});};
 function historyHTML(){
  const {T,esc}=ui(),history=config().history||[];if(!history.length)return '';
  return `<section class="panel exam-history"><h2>${T('Son denemelerin','Recent tests')}</h2><p class="small muted">${T('Bu tarayıcıda en fazla 30 sonuç tutulur.','Up to 30 results are kept in this browser.')}</p><ul>${history.map(s=>{const result=scoreExamSession(s);return `<li><div><strong>${esc(s.level)}</strong> <span>${esc(new Date(s.finishedAt).toLocaleDateString(state().settings.language==='en'?'en-GB':'tr-TR'))}</span><small>${result.correct} ${T('doğru','correct')} · ${result.wrong} ${T('yanlış','incorrect')} · ${result.blank} ${T('boş','unanswered')}</small></div><button class="btn secondary" data-action="exam-history" data-exam-history="${esc(s.id)}">${T('Gözden geçir','Review')}</button></li>`;}).join('')}</ul></section>`;
 }
 function setupHTML(){
  const {T}=ui(),c=config(),supported=hasAudio();
  return `<section class="panel exam-setup"><h2>${T('Kısa bir deneme hazırla','Set up a short test')}</h2><div class="form-grid"><label>${T('Çalışma düzeyi','Study level')}<select data-exam-setting="level">${studyLevels.map(level=>`<option ${level===c.level?'selected':''}>${level}</option>`).join('')}</select></label><label>${T('Toplam süre','Total time')}<select data-exam-setting="durationMinutes">${[10,20,30,45].map(n=>`<option value="${n}" ${n===Number(c.durationMinutes)?'selected':''}>${n} ${T('dakika','minutes')}</option>`).join('')}</select></label></div><label class="exam-audio-option"><input type="checkbox" data-exam-setting="includeListening" ${supported&&c.includeListening?'checked':''} ${supported?'':'disabled'}><span>${T('4 dinleme sorusu da ekle · sentetik Japonca ses','Include 4 listening questions · synthetic Japanese voice')}</span></label>${supported?'':`<p class="exam-notice" role="status">${T('Bu cihazda Japonca ses bulunamadı. Dinleme bölümü eklenemez; sonuçta “yapılmadı” olarak gösterilir.','No Japanese voice is available on this device. Listening cannot be included and is shown as “not taken” in the result.')}</p>`}<p>${T('8 kelime, 6 gramer ve aynı özgün kısa metne bağlı 6 okuduğunu anlama sorusu. Dinleme seçilirse toplam 24, seçilmezse 20 soru.','8 vocabulary questions, 6 grammar questions and 6 comprehension questions about one original short passage. 24 questions with listening, or 20 without it.')}</p><p class="small muted">${T('Sorular ve soru dili başlarken sabitlenir. Cevapların anında kaydedilir; istediğin sırayla ilerleyebilir ve boş bırakabilirsin. Süre başka sayfada veya uygulama kapalıyken de devam eder. Cevap anahtarı yalnız bitirdiğinde açılır.','Questions and their language are fixed at the start. Answers save immediately; move in any order and leave questions unanswered. The deadline keeps running on other pages or while the app is closed. The answer key opens only when the test finishes.')}</p><button class="btn primary" data-action="exam-start">${T('Denemeyi başlat','Start practice test')}</button></section>${historyHTML()}`;
 }
 function resultHTML(s){
  const {T,esc}=ui(),names=sections(),result=scoreExamSession(s);
  return `<section class="panel exam-results"><p class="eyebrow">${esc(s.level)} · ${s.language.toUpperCase()}</p><h2 tabindex="-1" id="exam-result-title">${T('Deneme tamamlandı','Practice test complete')}</h2><p>${s.finishReason==='deadline'?T('Süre doldu. O ana kadar kaydedilen cevaplar kullanıldı.','Time expired. The result uses answers saved before the deadline.'):T('Denemeyi teslim ettin.','You submitted the test.')}</p><div class="exam-result-total"><strong>${result.correct} / ${result.total}</strong><span>${T('doğru cevap','correct answers')}</span></div><p class="small muted">${T('Bu sayılar yalnız bu denemeye aittir. Geçme veya dil yeterliği değerlendirmesi yapılmaz; normal tekrar planın değişmez.','These counts describe this test only. They do not assess a pass or language proficiency; your normal review schedule is unchanged.')}</p><div class="exam-results-scroll"><table><caption class="sr-only">${T('Bölüm sonuçları','Results by section')}</caption><thead><tr><th scope="col">${T('Bölüm','Section')}</th><th scope="col">${T('Doğru','Correct')}</th><th scope="col">${T('Yanlış','Incorrect')}</th><th scope="col">${T('Boş','Unanswered')}</th><th scope="col">${T('Durum','Status')}</th></tr></thead><tbody>${result.sections.map(row=>`<tr><th scope="row">${names[row.section]}</th><td>${row.correct}</td><td>${row.wrong}</td><td>${row.blank}</td><td>${row.status==='not-taken'?T('Yapılmadı','Not taken'):row.notTaken?T(`${row.notTaken} soru ses yokluğu nedeniyle yapılmadı`,`${row.notTaken} questions not taken because audio was unavailable`):T('Tamamlandı','Completed')}</td></tr>`).join('')}</tbody></table></div><button class="btn secondary" data-action="exam-close">${T('Yeni deneme seç','Set up another test')}</button></section><section class="exam-review" aria-label="${T('Açıklamalı gözden geçirme','Review with explanations')}"><h2>${T('Cevaplarını gözden geçir','Review your answers')}</h2>${s.questions.map((q,index)=>{const answer=s.answers[q.id],notTaken=q.section==='listening'&&s.audioUnavailableIds.includes(q.id)&&!answer,outcome=notTaken?T('Yapılmadı','Not taken'):!answer?T('Boş','Unanswered'):answer.choice===q.answerIndex?T('Doğru','Correct'):T('Yanlış','Incorrect');return `<details class="panel exam-review-item" data-disclosure-key="exam-review:${esc(s.id)}:${index}"><summary><span>${index+1}. ${names[q.section]}</span><strong>${outcome}</strong></summary>${q.passage?`<p class="exam-passage" lang="ja">${esc(q.passage)}</p>`:''}${q.context?`<p class="exam-context" lang="ja">${esc(q.context)}</p>`:''}<p ${q.section==='reading'?'lang="ja"':''}>${esc(q.prompt)}</p>${q.translation?`<p>${esc(q.translation)}</p>`:''}<p>${T('Cevabın','Your answer')}: <strong>${answer?esc(q.choices[answer.choice]):'—'}</strong></p><p>${T('Doğru cevap','Correct answer')}: <strong>${esc(q.choices[q.answerIndex])}</strong></p><p class="exam-explanation">${esc(q.explanation)}</p>${notTaken?`<p class="small muted">${T('Ses desteği bulunmadığı için bu soru doğru/yanlış/boş toplamına katılmadı.','This question is excluded from correct/incorrect/unanswered counts because audio was unavailable.')}</p>`:''}</details>`;}).join('')}</section>${historyHTML()}`;
 }
 function activeHTML(s){
  const {T,esc}=ui(),names=sections(),q=s.questions[s.index],answer=s.answers[q.id],listening=q.section==='listening',key=audioKey(s,q),unavailable=s.audioUnavailableIds.includes(q.id),expired=examRemaining(s)<=0,heard=!listening||gate.has(key),blocked=expired||unavailable||!heard;
  if(listening)contexts.set(key,{sessionId:s.id,q});
  return `<section class="exam-running" data-exam-running="${esc(s.id)}"><div class="exam-session-bar"><div><strong>${esc(s.level)}</strong><span>${T('Soru dili','Question language')}: ${s.language.toUpperCase()}</span></div><div class="exam-clock"><span>${T('Kalan süre','Time left')}</span><strong data-exam-clock>${formatTime(examRemaining(s))}</strong></div></div><p class="small muted">${Object.keys(s.answers).length} / ${s.questions.length} ${T('cevap kaydedildi. Sorular arasında serbestçe gezebilirsin.','answers saved. Move freely between questions.')}</p><nav class="exam-question-nav" aria-label="${T('Soru gezinmesi','Question navigation')}">${s.questions.map((item,index)=>`<button type="button" data-action="exam-jump" ${scopeAttrs(s)} data-exam-target="${index}" ${index===s.index?'aria-current="step"':''} ${s.answers[item.id]?'class="exam-answered"':''} aria-label="${esc(`${index+1}. ${names[item.section]} · ${s.answers[item.id]?T('cevaplandı','answered'):s.audioUnavailableIds.includes(item.id)?T('yapılmadı','not taken'):T('boş','unanswered')}`)}">${index+1}${s.answers[item.id]?'<span aria-hidden="true">✓</span>':''}</button>`).join('')}</nav><section class="panel exam-stage" ${listening?`data-exam-audio-key="${esc(key)}"`:''}><p class="eyebrow">${names[q.section]} · ${s.index+1} / ${s.questions.length}</p><h2 tabindex="-1" id="exam-question-title" ${q.section==='reading'?'lang="ja"':''}>${esc(q.prompt)}</h2>${q.passage?`<div class="exam-passage-block"><h3>${esc(q.passageTitle)}</h3><p class="exam-passage" lang="ja">${esc(q.passage)}</p></div>`:''}${q.context?`<p class="exam-context" lang="ja">${esc(q.context)}</p>`:''}${q.translation?`<p class="exam-translation">${esc(q.translation)}</p>`:''}${listening?`<div class="exam-audio-controls"><button type="button" class="btn secondary" data-action="exam-play" ${scopeAttrs(s)} data-speed="normal" ${hasAudio()&&!unavailable&&!expired?'':'disabled'}>▷ ${T('Dinle','Listen')}</button><button type="button" class="btn secondary" data-action="exam-play" ${scopeAttrs(s)} data-speed="slow" ${hasAudio()&&!unavailable&&!expired?'':'disabled'}>${T('Yavaş dinle','Listen slowly')}</button><button type="button" class="subtle-link" data-action="exam-stop" hidden>${T('Durdur','Stop')}</button></div><p class="exam-audio-status" role="status">${unavailable?T('Ses desteği yok. Bu soru yapılmadı olarak ayrıldı.','Audio is unavailable. This question is marked as not taken.'):heard?T('Ses tamamlandı. Cevaplayabilirsin.','Playback finished. You may answer.'):T('Cevaplamadan önce sesi bir kez sonuna kadar dinle.','Listen to the audio to the end once before answering.')}</p><p class="small muted">${T('Sentetik Japonca ses. Kelime ve okunuşu sonuçta açılır.','Synthetic Japanese speech. The word and reading are revealed in the result.')}</p>`:''}<form data-form="exam-answer" ${scopeAttrs(s)} aria-labelledby="exam-question-title"><fieldset class="exam-choices" ${blocked?'disabled':''}><legend class="sr-only">${T('Cevabın','Your answer')}</legend>${q.choices.map((value,index)=>`<label class="exam-choice"><input type="radio" name="answer" value="${index}" data-exam-choice="true" ${answer?.choice===index?'checked':''}><span ${q.section==='reading'||q.section==='grammar'?'lang="ja"':''}>${esc(value)}</span></label>`).join('')}</fieldset><div class="exam-question-actions"><button type="button" class="btn secondary" data-action="exam-clear" ${scopeAttrs(s)} ${answer&&!expired?'':'disabled'}>${T('Cevabı temizle','Clear answer')}</button><button type="submit" class="btn primary" ${expired?'disabled':''}>${s.index===s.questions.length-1?T('Cevabı kaydet','Save answer'):T('Kaydet ve sonraki soru','Save and next question')}</button></div></form><div class="exam-navigation-actions"><button type="button" class="subtle-link" data-action="exam-prev" ${scopeAttrs(s)} ${s.index===0?'disabled':''}>← ${T('Önceki','Previous')}</button><button type="button" class="subtle-link" data-action="exam-next" ${scopeAttrs(s)} ${s.index===s.questions.length-1?'disabled':''}>${T('Sonraki / boş bırak','Next / leave unanswered')} →</button></div></section><details class="exam-finish" data-disclosure-key="exam-finish:${esc(s.id)}"><summary>${T('Denemeyi teslim et','Submit this test')}</summary><p>${T('Teslim edince cevapları değiştiremezsin. Boş sorular boş sayılır; yanlış sayısına eklenmez.','After submitting you cannot change answers. Unanswered questions remain unanswered and are not counted as incorrect.')}</p><button class="btn primary" data-action="exam-finish" data-exam-session="${esc(s.id)}">${T('Bitir ve sonuçları aç','Finish and show results')}</button></details></section>`;
 }
 function page(){const s=config().session;return `<div class="exams-page">${heading()}${s?.phase==='active'?activeHTML(s):s?.phase==='finished'?resultHTML(s):setupHTML()}</div>`;}
 async function persist(next){writing=true;try{return await commit(next);}finally{writing=false;}}
 async function finish(id,reason='submitted'){
  const s=config().session;if(writing||isBusy()||s?.phase!=='active'||s.id!==id)return false;
  const next=finishExamState(state(),{now:Date.now(),reason,hasAudio:hasAudio()});if(await persist(next)){player?.stop();root?.querySelector('#exam-result-title')?.focus({preventScroll:true});return true;}return false;
 }
 async function click(target){
  const action=target.dataset.action;if(!action?.startsWith('exam-'))return false;
  if(action==='exam-stop'){player?.stop();return true;}
  if(writing||isBusy())return true;
  const s=config().session;
  if(action==='exam-play'){
   if(!sameScope(target,s)||s.phase!=='active'||examRemaining(s)<=0)return true;
   const q=s.questions[s.index];if(q.section!=='listening'||s.audioUnavailableIds.includes(q.id))return true;
   const key=audioKey(s,q);contexts.set(key,{sessionId:s.id,q});const result=player?.play({text:q.audio.reading,key,speed:target.dataset.speed});if(!result?.ok)toast(ui().T('Ses çalınamadı.','Audio could not play.'));sync();return true;
  }
  if(action==='exam-start'){
   if(s?.phase==='active')return true;const next=structuredClone(state());next.exams=normaliseExams(next.exams);next.exams.session=createExamSession(next.exams,{language:state().settings.language,hasAudio:hasAudio()});gate.clear();contexts.clear();if(await persist(next)){onQuestionStart?.();focusQuestion();}return true;
  }
  if(action==='exam-history'){
   if(s?.phase==='active')return true;const saved=config().history.find(item=>item.id===target.dataset.examHistory);if(!saved)return true;const next=structuredClone(state());next.exams.session=structuredClone(saved);if(await persist(next))root?.querySelector('#exam-result-title')?.focus({preventScroll:true});return true;
  }
  if(action==='exam-close'){
   if(s?.phase==='active')return true;const next=structuredClone(state());next.exams.session=null;await persist(next);return true;
  }
  if(action==='exam-finish'){await finish(target.dataset.examSession);return true;}
  if(!s||s.phase!=='active'||!sameScope(target,s))return true;
  if(examRemaining(s)<=0){await finish(s.id,'deadline');return true;}
  const next=structuredClone(state());
  if(action==='exam-clear')delete next.exams.session.answers[s.questions[s.index].id];
  else if(['exam-prev','exam-next','exam-jump'].includes(action)){
   const index=action==='exam-jump'?Number(target.dataset.examTarget):s.index+(action==='exam-prev'?-1:1);if(!Number.isInteger(index)||index<0||index>=s.questions.length)return true;next.exams.session.index=index;player?.stop();
  }else return true;
  if(await persist(next))focusQuestion();return true;
 }
 async function saveChoice(form,choice,advance=false){
  const s=config().session;if(!s||s.phase!=='active'||!sameScope(form,s))return;
  if(examRemaining(s)<=0){await finish(s.id,'deadline');return;}
  const q=s.questions[s.index],evidence=q.section==='listening'?gate.evidence(audioKey(s,q)):{};
  let updated=s;
  if(choice!==null){updated=saveExamAnswer(s,{sessionId:s.id,questionId:q.id,index:s.index,choice},{audioEvidence:evidence});if(updated===s){toast(ui().T('Cevap kaydedilemedi. Dinleme sorusunda önce sesi tamamla.','The answer could not be saved. Complete playback before answering a listening question.'));return;}}
  if(advance&&updated.index<updated.questions.length-1)updated={...structuredClone(updated),index:updated.index+1};
  if(updated===s)return;const next=structuredClone(state());next.exams.session=updated;if(await persist(next)){if(advance){player?.stop();focusQuestion();}}
 }
 async function submit(form){
  if(form.dataset.form!=='exam-answer')return false;if(writing||isBusy())return true;
  const s=config().session;if(!s||s.phase!=='active'||!sameScope(form,s))return true;if(examRemaining(s)<=0){await finish(s.id,'deadline');return true;}
  const value=new FormData(form).get('answer');await saveChoice(form,value===null?null:Number(value),true);return true;
 }
 async function change(target){
  if(target.dataset.examChoice){if(writing||isBusy())return true;const form=target.closest('form');if(form&&target.checked)await saveChoice(form,Number(target.value));return true;}
  const setting=target.dataset.examSetting;if(!setting)return false;if(writing||isBusy()||config().session?.phase==='active')return true;
  const next=structuredClone(state());next.exams={...defaultExams(),...next.exams};
  if(setting==='level'&&studyLevels.includes(target.value))next.exams.level=target.value;
  else if(setting==='durationMinutes'&&[10,20,30,45].includes(Number(target.value)))next.exams.durationMinutes=Number(target.value);
  else if(setting==='includeListening')next.exams.includeListening=hasAudio()&&target.checked;
  else return true;
  await persist(next);return true;
 }
 function sync(){
  if(!root)return;const s=config().session;if(s?.phase!=='active')return;const q=s.questions[s.index],current=player?.snapshot(),expired=examRemaining(s)<=0;
  for(const clock of root.querySelectorAll('[data-exam-clock]'))clock.textContent=formatTime(examRemaining(s));
  for(const block of root.querySelectorAll('[data-exam-audio-key]')){
   const key=block.dataset.examAudioKey,heard=gate.has(key),unavailable=s.audioUnavailableIds.includes(q.id),active=current?.key===key&&['queued','speaking'].includes(current.phase);
   const fieldset=block.querySelector('fieldset');if(fieldset)fieldset.disabled=expired||unavailable||!heard;
   for(const button of block.querySelectorAll('[data-action="exam-play"]'))button.disabled=expired||unavailable||!hasAudio();
   const stop=block.querySelector('[data-action="exam-stop"]');if(stop)stop.hidden=!active;
   const status=block.querySelector('.exam-audio-status');if(status){const {T}=ui();status.textContent=unavailable?T('Ses yokluğu nedeniyle bu soru yapılmadı olarak ayrıldı.','This question is not taken because audio is unavailable.'):active?T('Ses çalınıyor…','Audio is playing…'):heard?T('Ses tamamlandı. Cevaplayabilirsin.','Playback finished. You may answer.'):current?.key===key&&current.phase==='error'?T('Ses tamamlanamadı. Yeniden dinle.','Playback did not finish. Listen again.'):T('Cevaplamadan önce sesi bir kez sonuna kadar dinle.','Listen to the audio to the end once before answering.');}
  }
 }
 async function tick(){
  sync();const s=config().session;if(!s||s.phase!=='active'||writing||isBusy())return;
  if(examRemaining(s)<=0){await finish(s.id,'deadline');return;}
  if(!hasAudio()&&s.listeningStatus==='included'){
   const updated=markExamAudioUnavailable(s);if(updated!==s){const next=structuredClone(state());next.exams.session=updated;await persist(next);}
  }
 }
 function onSpeechChange(snapshot){if(!snapshot.key||contexts.has(snapshot.key))gate.update(snapshot);sync();}
 return {page,click,submit,change,tick,onSpeechChange,sync};
}
