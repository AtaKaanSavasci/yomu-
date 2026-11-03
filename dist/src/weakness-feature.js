import {recordAnswer} from './model.js';
import {answerCard} from './practice-ui.js';
import {aggregateWeakness,createWeaknessSession,isPracticeQuestion,weaknessConfig,weaknessQuestion,weaknessScope,weaknessTypes,weaknessSkills,weaknessReasons,weaknessHistories} from './weakness-data.js';

export function createWeaknessFeature({getState,commit,ui,toast=()=>{},isBusy=()=>false,getQuestion=()=>null,onQuestionStart=()=>{},renderExercise,canAnswer,answerEvidence}={}){
 let questionStarted=performance.now();
 const U=()=>typeof ui==='function'?ui():ui;
 const configuration=state=>weaknessConfig(state.weakness);
 const aggregate=(state,config=configuration(state))=>aggregateWeakness(state.events,{...config,getQuestion});
 const currentSession=()=>getState().weakness?.session;
 const availableQuestion=session=>{const snapshot=weaknessQuestion(session);if(!snapshot)return null;let current;try{current=getQuestion(snapshot.id);}catch{return null;}return isPracticeQuestion(current,{id:snapshot.id,itemId:snapshot.itemId,skill:snapshot.skill})?snapshot:null;};
 const startQuestion=()=>{questionStarted=performance.now();const session=currentSession();if(session?.phase==='exercise')onQuestionStart(availableQuestion(session),weaknessScope(session));globalThis.document?.querySelector('#weakness-stage-title')?.focus({preventScroll:true});globalThis.document?.querySelector('.weakness-session,.weakness-complete')?.scrollIntoView({block:'start'});};
 function page(){
  const state=getState(),config=configuration(state),session=config.session,{T,esc}=U();
  const heading=`<div class="page-heading"><p class="eyebrow">${T('KİŞİSEL ÇALIŞMA','PERSONAL PRACTICE')}</p><h1 tabindex="-1">${T('Zorlandıklarım','My difficult items')}</h1><p class="muted">${T('Yanlışlarını, gösterilen cevapları ve ipucuyla cevapladıklarını birlikte gör. Bu bir ustalık ya da JLPT puanı değildir.','See mistakes, revealed answers and assisted answers together. This is not a mastery or JLPT score.')}</p></div>`;
  if(session?.phase==='exercise'){
   const event=state.events.find(event=>event.id===session.feedback),question=event?weaknessQuestion(session):availableQuestion(session),scopeKey=weaknessScope(session);
   const exercise=!question?`<div class="info-note"><p>${T('Bu turdaki soru kaydı kullanılamıyor. Atlamak cevap veya başarı üretmez.','This question record is unavailable. Skipping does not create an answer or success.')}</p><button class="btn secondary" data-action="${session.feedback?'weakness-next':'weakness-skip'}">${session.feedback?T('Devam et','Continue'):T('Bu kaydı atla','Skip this record')}</button></div>`:question.skill==='listening'&&!renderExercise?`<p class="info-note">${T('Dinleme alıştırması bu görünümde yüklenemedi. Cevap kaydedilmez.','The listening exercise could not load in this view. No answer is recorded.')}</p>`:(renderExercise?renderExercise(question,event,{form:'weakness-answer',next:'weakness-next',scopeKey}):answerCard(question,event,U(),{form:'weakness-answer',next:'weakness-next',practiceClass:'weakness-question'}));
   const stamped=question?exercise.replace(/(<form\b[^>]*\bdata-form=(["'])weakness-answer\2)/,match=>`${match} data-session-id="${esc(session.id)}" data-question-id="${esc(question.id)}" data-question-index="${session.index}"`):exercise;
   return `${heading}<section class="weakness-session"><div class="section-top"><h2 tabindex="-1" id="weakness-stage-title">${T('Kısa çalışma','Short practice')} · ${session.index+1} / ${session.ids.length}</h2><button class="subtle-link" data-action="weakness-close">${T('Listeye dön','Back to list')}</button></div><p class="small muted">${T('Bu tur başlarken seçilen soruları korur ve normal tekrar vadesinden bağımsız çalışır.','This round keeps its starting questions and works independently of normal review due times.')}${session.skippedUnavailable?` ${T(`${session.skippedUnavailable} kullanılamayan kayıt tura alınmadı.`,`${session.skippedUnavailable} unavailable records were excluded.`)}`:''}</p>${stamped}</section>`;
  }
  if(session?.phase==='done'){
   const events=state.events.filter(event=>session.eventIds.includes(event.id)),independent=events.filter(event=>event.correct&&!event.readingHintShown&&!event.pronunciationHintRequested&&!event.revealed).length;
   return `${heading}<section class="panel weakness-complete"><h2 tabindex="-1" id="weakness-stage-title">${T('Bu kısa tur tamam.','Short round complete.')}</h2><p>${T(`${events.length} cevap · ${events.filter(event=>event.correct).length} doğru · ${independent} ipucusuz doğru.`,`${events.length} answers · ${events.filter(event=>event.correct).length} correct · ${independent} unassisted correct.`)}</p>${session.skippedMissing?.length?`<p>${T(`${session.skippedMissing.length} kullanılamayan kayıt atlandı; cevap sayılmadı.`,`${session.skippedMissing.length} unavailable records were skipped without an answer.`)}</p>`:''}<p class="small muted">${T('Cevapların mevcut tekrar planına kaydedildi. Bu özet yalnızca bu turdaki cevapları gösterir.','Answers were saved to your existing review schedule. This summary shows only this round’s answers.')}</p><button class="btn primary" data-action="weakness-close">${T('Güncel listeye dön','Back to updated list')}</button></section>`;
  }
  const rows=aggregate(state,config),available=rows.filter(row=>row.available).length;
  const typeLabels={all:T('Tüm içerikler','All content'),characters:T('Harfler','Characters'),vocabulary:T('Kelimeler','Vocabulary'),sentences:T('Cümleler','Sentences'),grammar:T('Gramer','Grammar'),anime:T('Anime','Anime'),personal:T('Kişisel kelimeler','Personal words'),reading:T('Okuma dersleri','Reading lessons'),listening:T('Dinleme','Listening'),other:T('Diğer kayıtlar','Other records')};
  const skillLabels={all:T('Tüm beceriler','All skills'),meaning:T('Anlam','Meaning'),reading:T('Okunuş','Reading'),writing:T('Yazılı cevap','Written answer'),listening:T('Dinleme','Listening')};
  const reasonLabels={all:T('Yanlış, gösterilen veya ipucuyla','Mistakes, revealed or assisted'),wrong:T('Yanlış / cevap gösterildi','Mistake / answer revealed'),assisted:T('İpucu kullanıldı','Hint used')};
  const historyLabels={unresolved:T('Son cevabında zorlandıkların','Difficult on the latest answer'),recent:T('Son 30 günde zorlandıkların','Difficulty in the last 30 days'),all:T('Bütün zorlanma geçmişi','All difficulty history')};
  const select=(key,label,values,names)=>`<label>${label}<select data-weakness-filter="${key}">${values.map(value=>`<option value="${value}" ${config[key]===value?'selected':''}>${esc(names[value])}</option>`).join('')}</select></label>`;
  const latestLabels={'wrong':T('Yanlış','Incorrect'),'revealed':T('Cevap gösterildi','Answer revealed'),'assisted-correct':T('İpucuyla doğru','Correct with a hint'),'independent-correct':T('İpucusuz doğru','Correct without a hint')};
  const rowLabel=row=>!row.available?(row.type==='personal'?T('Kaldırılmış kişisel kelime','Removed personal word'):T('Kullanılamayan geçmiş kayıt','Unavailable history record')):row.label===row.itemId?T('Çalışma kaydı','Practice record'):row.label;
  return `${heading}<section class="panel weakness-filters" aria-label="${T('Zorlandıklarım filtreleri','Difficult item filters')}">${select('type',T('İçerik','Content'),weaknessTypes,typeLabels)}${select('skill',T('Beceri','Skill'),weaknessSkills,skillLabels)}${select('reason',T('Zorlanma türü','Difficulty type'),weaknessReasons,reasonLabels)}${select('history',T('Geçmiş','History'),weaknessHistories,historyLabels)}<label>${T('Tur uzunluğu','Round length')}<select data-weakness-filter="size">${[5,10].map(size=>`<option value="${size}" ${config.size===size?'selected':''}>${size} ${T('soruya kadar','questions at most')}</option>`).join('')}</select></label></section><div class="weakness-start"><button class="btn primary" data-action="weakness-start" ${available?'':'disabled'}>${T('Kısa tur başlat','Start a short round')}</button><p class="small muted">${T(`${rows.length} öğe/beceri kaydı · ${available} soru kullanılabilir.`,`${rows.length} item/skill records · ${available} questions available.`)}</p></div><p class="small muted">${T('Sıralama: en yeni yanlış, cevap gösterimi veya ipucu isteği önce; eşitlikte daha çok zorlanılan kayıt. Kaydetmek veya sadece ses oynatmak cevap sayılmaz.','Order: most recent mistake, reveal or hint request first; ties favour more difficulty events. Saving or playing audio alone is not an answer.')}</p>${rows.length?`<div class="weakness-list" data-scroll-key="weakness-history">${rows.map(row=>`<article class="weakness-row"><div><h2 lang="ja">${esc(rowLabel(row))}</h2><span class="level-pill">${esc(typeLabels[row.type]||typeLabels.other)} · ${esc(skillLabels[row.skill]||row.skill)}</span><p>${T('Son cevap','Latest answer')}: <strong>${esc(latestLabels[row.latestOutcome])}</strong>${row.latestAssisted&&row.latestOutcome!=='assisted-correct'?` · ${T('İpucu kullanıldı','Hint used')}`:''}</p>${!row.available?`<p class="weakness-unavailable">${T('Soru artık kullanılamıyor; geçmiş korunur, yeni tura eklenmez.','This question is no longer available. Its history is kept and it is excluded from new rounds.')}</p>`:''}</div><dl class="weakness-counts"><div><dt>${T('Cevap','Answers')}</dt><dd>${row.attempts}</dd></div><div><dt>${T('Yanlış','Incorrect')}</dt><dd>${row.wrong}</dd></div><div><dt>${T('Gösterildi','Revealed')}</dt><dd>${row.revealed}</dd></div><div><dt>${T('İpucu kullanılan','Assisted')}</dt><dd>${row.assisted}</dd></div><div><dt>${T('İpucusuz doğru','Unassisted correct')}</dt><dd>${row.independentCorrect}</dd></div></dl></article>`).join('')}</div><p class="small muted">${T('İpucu sayısı yanlış/gösterilen cevaplarla kesişebilir; sütunlar birbirine eklenmez. Son cevabın doğru olması geçmişteki yanlışları silmez.','Assisted counts can overlap mistakes/reveals; columns are not added together. A correct latest answer does not erase previous mistakes.')}</p>`:`<section class="panel"><h2>${T('Bu seçkide zorlanma kaydı yok.','No difficulty records in this selection.')}</h2><p>${T('Önce bir alıştırma yapabilir veya geçmiş filtresini değiştirebilirsin. Kaydedilmiş ama cevaplanmamış kartlar burada zorlanma sayılmaz.','Try an exercise or change the history filter. Saved but unanswered cards are not counted as difficult.')}</p><a class="btn secondary" href="#characters">${T('Harflerle çalış','Practice characters')}</a></section>`}`;
 }
 async function advance(skip=false){
  const state=getState(),session=state.weakness?.session;if(!session||session.phase!=='exercise'||(!skip&&!session.feedback)||(skip&&session.feedback))return;
  const next=structuredClone(state),round=next.weakness.session;if(skip)round.skippedMissing=[...(round.skippedMissing||[]),round.ids[round.index]];
  round.index++;round.feedback=null;if(round.index>=round.ids.length)round.phase='done';
  if(await commit(next))startQuestion();
 }
 async function click(target){
  const action=target?.dataset?.action;if(!['weakness-start','weakness-close','weakness-next','weakness-skip'].includes(action))return false;
  if(isBusy())return true;
  const state=getState(),config=configuration(state),{T}=U();
  if(action==='weakness-start'){
   if(config.session?.phase==='exercise')return true;
   const session=createWeaknessSession(aggregate(state,config),{limit:config.size,config:{type:config.type,skill:config.skill,reason:config.reason,history:config.history}});
   if(!session){toast(T('Bu seçkide çalışılabilir soru yok. Kullanılamayan kayıtlar atlanır.','There are no available questions in this selection. Unavailable records are skipped.'));return true;}
   const next=structuredClone(state);next.weakness={...config,session};if(await commit(next))startQuestion();
  }else if(action==='weakness-close'){const next=structuredClone(state);next.weakness={...config,session:null};await commit(next);}
  else if(action==='weakness-next')await advance();
  else if(!availableQuestion(config.session))await advance(true);
  return true;
 }
 async function change(target){
  const key=target?.dataset?.weaknessFilter;if(!['type','skill','reason','history','size'].includes(key))return false;if(isBusy())return true;
  const state=getState(),next=structuredClone(state),config=configuration(state);next.weakness=weaknessConfig({...config,[key]:target.value});await commit(next);return true;
 }
 async function submit(form){
  if(form?.dataset?.form!=='weakness-answer')return false;if(isBusy())return true;
  let state=getState(),session=state.weakness?.session,question=availableQuestion(session);if(!question||session.feedback)return true;
  if(form.dataset.sessionId!==session.id||form.dataset.questionId!==question.id||form.dataset.questionIndex!==String(session.index))return true;
  const answer=String(new FormData(form).get('answer')||'').trim();if(!answer)return true;
  const {T}=U(),scopeKey=weaknessScope(session),sessionId=session.id,index=session.index,questionId=question.id,version=question.version;
  let evidence={};try{
   if(question.skill==='listening'&&!canAnswer||canAnswer&&!await canAnswer(question,scopeKey)){toast(T('Önce sorunun sesini sonuna kadar dinle. Ses hazır değilse cevap kaydedilmez.','Listen to the question audio to the end first. No answer is recorded while audio is unavailable.'));return true;}
   if(answerEvidence)evidence=await answerEvidence(question,scopeKey)||{};
   if(question.skill==='listening'&&evidence.audioPlaybackCompleted!==true){toast(T('Sesin tamamlandığı doğrulanamadı; cevap kaydedilmedi.','Completed audio playback could not be verified; no answer was saved.'));return true;}
  }catch{toast(T('Sorunun dinleme kanıtı doğrulanamadı; cevap kaydedilmedi.','Listening evidence could not be verified; no answer was saved.'));return true;}
  state=getState();session=state.weakness?.session;if(!session||session.id!==sessionId||session.index!==index||session.feedback||session.phase!=='exercise')return true;
  question=availableQuestion(session);if(!question||question.id!==questionId||question.version!==version)return true;
  const next=recordAnswer(state,question,answer,new Date(),crypto.randomUUID(),Math.max(0,Math.min(600000,Math.round(performance.now()-questionStarted))),'weakness'),event=next.events.at(-1);
  event.readingHintShown=question.skill!=='listening'&&!!(question.word||question.character?.script==='kanji')&&(!!state.settings.questionReadings||!!session.readingHintIds?.includes(question.id));
  event.pronunciationHintRequested=question.skill!=='listening'&&!!session.pronunciationHintIds?.includes(question.id);
  if(evidence&&typeof evidence==='object'&&!Array.isArray(evidence))for(const [key,value] of Object.entries(evidence))if(!Object.hasOwn(event,key)&&!['__proto__','constructor','prototype'].includes(key))event[key]=value;
  next.weakness.session.feedback=event.id;next.weakness.session.eventIds.push(event.id);
  if(await commit(next))globalThis.document?.querySelector('.weakness-session .feedback')?.focus({preventScroll:true});return true;
 }
 return {page,click,submit,change};
}
