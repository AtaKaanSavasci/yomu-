import {captureView,restoreView} from './view-state.js';
import {pronunciationControls,pronunciationText,createJapaneseSpeech,syncPronunciationControls} from './word-speech.js';
import {requestTranslation} from './translation-client.js';
import {questionWord,syncReadingHints,installKanjiInfo} from './reading-ui.js';
import {learningSources} from './learning-sources.js';
import {reminderSettings,validReminderTime,reminderDue,requestReminderPermission,showReminderNotification,reminderCalendar,googleReminderUrl} from './reminders.js';
import { lessons, questions, lexemes, wordById, grammarPoints, getQuestion as getContentQuestion, CONTENT_VERSION } from './content.js';
import { freshState, dayKey, recentDayKeys, recordAnswer, dueStates, addWord, suspendItem, skillSummary, stateKey } from './model.js';
import { openStore, saveState, ConflictError } from './storage.js';
import {defaultPractice,groupsFor,createCharacterSession,getCharacterQuestion} from './characters.js';
import {animeQuotes,getAnimeQuestion,createCustomQuote} from './anime.js';
import {hubPage,charactersPage,animePage,translationBox,translationOutput} from './practice-ui.js';
import {mountClip} from './media.js';
import {applyCharacterInput,classifyCharacterInput} from './character-flow.js';
import {studyPage,studyLaunches} from './study-ui.js';
import {createStudySession,saveStudyItem,selectStudyConfig} from './study-flow.js';
import {getStudyQuestion,defaultLearning} from './study-data.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let state, busy = false, storageError = '', selectedWord = 'cafe', questionStarted = performance.now(), speaking = false;
let clipCleanup=null,renderedRoute=null;
const translationDraft={source:'tr',target:'ja',text:'',result:'',error:'',busy:false,route:[]};
let translationRequest=0,translationAbort;
let pendingCharacterInput=null,processingCharacterInput=false;
const composingCharacterInputs=new WeakSet();
const T = (tr, en) => state?.settings.language === 'en' ? en : tr;
const L = obj => obj[state.settings.language];
const getQuestion=id=>getAnimeQuestion(id,state?.anime.customQuotes)||getContentQuestion(id);
const ui=()=>({T,L,esc,icon,showQuestionReadings:!!state?.settings.questionReadings});
const hideKanjiInfo=installKanjiInfo(ui);
const speechPlayer=createJapaneseSpeech({onChange:()=>updateAudioStatus()});
const icon = (name, cls = '') => {
  const paths = {
    book: '<path d="M3 5c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2z"/><path d="M12 7v15"/>',
    home: '<path d="m3 10 9-7 9 7v11H3z"/><path d="M9 21v-8h6v8"/>',
    repeat: '<path d="M20 7H7a4 4 0 0 0-4 4m1 6h13a4 4 0 0 0 4-4"/><path d="m17 3 4 4-4 4M7 13l-4 4 4 4"/>',
    chart: '<path d="M4 3v18h18M9 16v-5m5 5V6m5 10v-8"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sound: '<path d="m11 4-6 5H2v6h3l6 5zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    leaf: '<path d="M20 3C8 2 2 8 5 15c4 7 14 4 15-12ZM3 21 16 8"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    flag: '<path d="M5 22V3c5-4 9 5 15 0v12c-6 5-10-4-15 0"/>',
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
};
const art = (theme = 'cafe', mini = false) => `<svg class="scene ${mini ? 'mini' : ''}" viewBox="0 0 360 250" aria-hidden="true" focusable="false">
  <ellipse cx="180" cy="221" rx="136" ry="10" fill="#244f4010"/>
  <circle cx="247" cy="78" r="57" fill="${theme === 'park' ? '#e8d99d' : '#e6cbb5'}"/>
  <path d="M54 174Q62 132 93 138q-21-31-9-52 30 7 32 42 8-30 34-28 3 29-28 49 30-9 41 11-29 25-48 18v39H99v-39Z" fill="#7b9b75"/>
  <path d="M106 213V126m0 33-15-16m15 33 24-15" fill="none" stroke="#4e7252" stroke-width="2"/>
  <path d="M87 195h40l-7 27H94Z" fill="#d79f7c"/>
  ${theme === 'library' ? '<rect x="152" y="74" width="118" height="141" rx="5" fill="#587968"/><path d="M160 116h102m-102 48h102" stroke="#dce4ce" stroke-width="4"/><path d="M172 84v28m15-28v28m15-25 6 24m19-27v28m16-24v24m-69 14v32m16-32v32m15-32v32m20-30 7 29m16-29v30" stroke="#edddba" stroke-width="9"/>' : theme === 'park' ? '<path d="M166 134h129v14H166Zm0 23h129v14H166Z" fill="#9d7154"/><path d="M179 130v79m101-79v79m-119-30h141" stroke="#47634e" stroke-width="7"/><path d="M238 39q-22 20-11 43-35 4-30 34 38 30 69-3 23-25-2-44 6-30-26-30" fill="#668866"/>' : '<path d="M153 181q37-14 65 2 30-17 68-2v32q-39-13-68 0-28-14-65 0Z" fill="#f9f6e9" stroke="#4d6d56" stroke-width="2"/><path d="M218 183v30m-56-23q27-8 45 0m19 0q27-8 51-1m-115 9q27-7 45 0m19 0q27-8 51-1" fill="none" stroke="#b6c0a2" stroke-width="2"/><path d="M205 120h53v22q-1 26-27 26t-26-26Z" fill="#ecbd88"/><path d="M258 126h11q20 22-13 22" fill="none" stroke="#ecbd88" stroke-width="8"/><ellipse cx="231" cy="121" rx="27" ry="6" fill="#7a5540"/><ellipse cx="231" cy="169" rx="40" ry="5" fill="#557357"/><path d="M220 103q-10-10 0-21m19 22q-10-12 0-24" fill="none" stroke="#819078" stroke-width="3" stroke-linecap="round"/>'}
  <path d="m290 45 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" fill="#9ca681"/>
</svg>`;
function announce(message) { $('#announcer').textContent = message; }
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4500); }
async function commit(next, repaint = true) {
  if (busy) return false;
  busy = true;
  try {
    state = await saveState(next);
    storageError = '';
    if (repaint) render();
    return true;
  } catch (e) {
    storageError = e instanceof ConflictError ? T('Başka bir sekmede kayıt değişti. Devam etmek için sayfayı yenile.', 'Data changed in another tab. Reload to continue.') : T('Kayıt yapılamadı. Tarayıcı depolama alanını kontrol et; bu işlem kaydedilmedi.', 'Could not save. Check browser storage; this action was not saved.');
    showStorageError();
    return false;
  } finally { busy = false; void drainCharacterInput(); }
}
function showStorageError() {
  const banner = $('#storage-error');
  if (banner) { banner.hidden = false; banner.innerHTML = `${esc(storageError)} <button data-action="reload">${T('Yenile', 'Reload')}</button>`; }
  announce(storageError);
}
function route() { return location.hash.slice(1) || 'today'; }
function navigate(where) {
  if (speaking) stopAudio();
  if (route() === where) render(); else location.hash = where;
}
function focusHeading() { $('#main h1')?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
function focusStudy(){const el=$('.study-session .answer-input')||$('.study-session input[type="radio"]')||$('#study-stage-title');el?.focus({preventScroll:true});$('.study-session')?.scrollIntoView({block:'start'});}
function navLink(id, name, label, count = '') { return `<a class="nav-link ${route() === id ? 'active' : ''}" href="#${id}" ${route() === id ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span>${count !== '' ? `<span class="nav-count">${count}</span>` : ''}</a>`; }
function render() {
  const currentRoute=route(),view=currentRoute===renderedRoute?captureView($('#app')):null;
  stopAudio();
  hideKanjiInfo();
  clipCleanup?.();clipCleanup=null;
  document.documentElement.lang = state.settings.language;
  document.documentElement.classList.toggle('large-text', state.settings.largeText);
  document.title = T('Yomu · Japonca çalışma alanı', 'Yomu · Japanese study space');
  const due = dueStates(state).length;
  const date = new Intl.DateTimeFormat(state.settings.language === 'tr' ? 'tr-TR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: state.settings.timezone }).format(new Date());
  $('#app').innerHTML = `<div class="shell"><aside class="sidebar" data-scroll-key="navigation"><a href="#today" class="brand" aria-label="Yomu">${icon('book')}<span>yomu<span class="brand-jp" lang="ja">読む</span></span></a>
    <div class="space-label">${T('JAPONCA ÇALIŞMA ALANIN', 'YOUR JAPANESE STUDY SPACE')}</div>
    <nav aria-label="${T('Ana menü', 'Main navigation')}">
      ${navLink('today', 'home', T('Bugün', 'Today'))}${navLink('characters','book',T('Harfler','Characters'))}${navLink('vocabulary','leaf',T('Kelimeler','Words'))}${navLink('sentences','book',T('Cümleler','Sentences'))}${navLink('grammar','book',T('Gramer','Grammar'))}${navLink('anime','sound',T('Anime replikleri','Anime lines'))}${navLink('library', 'leaf', T('Okuma köşesi', 'Read'))}${navLink('review', 'repeat', T('Tekrarlarım', 'Reviews'), due)}${navLink('progress', 'chart', T('İlerlemem', 'Progress'))}
    </nav><div class="sidebar-bottom"><div class="quiet-note"><span lang="ja">一歩ずつ。</span><p>${T('Her gün, küçük bir adım.', 'A small step, every day.')}</p></div>${navLink('settings', 'settings', T('Tercihler ve veriler', 'Preferences & data'))}<div class="local-label"><i></i>${T('Bu tarayıcıya kaydedilir', 'Saved in this browser')}</div></div>
  </aside><div class="workspace"><header class="topbar"><span class="top-caption">${T('Kendine biraz Japonca zamanı ayır.', 'Make a little time for Japanese.')}</span><div class="top-controls"><button class="text-size" data-action="large" aria-pressed="${state.settings.largeText}" aria-label="${T('Büyük yazı', 'Large text')}">A<span>A</span></button><div class="language-switch" aria-label="${T('Arayüz dili', 'Interface language')}"><button data-lang="tr" aria-pressed="${state.settings.language === 'tr'}">TR</button><button data-lang="en" aria-pressed="${state.settings.language === 'en'}">EN</button></div><span class="avatar" aria-hidden="true">読</span></div></header>
    <main id="main" tabindex="-1"><div id="storage-error" class="error-banner" role="alert" hidden></div><div class="date-line"><span>${esc(date)}</span><span class="prototype-tag">${T('JAPONCA ÇALIŞMA ALANI', 'JAPANESE STUDY SPACE')} · 0.7.1</span></div>${page()}</main>
    <footer><span>yomu · ${T('Küçük metinler, yeni dünyalar.', 'Small texts, new worlds.')}</span><span>${T('Çalışma notları · İnsan editörü onayı bekliyor', 'Study notes · Awaiting human editorial review')}</span></footer></div></div>`;
  $('.top-controls').insertAdjacentHTML('afterbegin', `<button class="translator-trigger" data-action="open-translation" aria-label="${T('Çeviri masasını aç','Open translation desk')}"><span>文</span><span>${T('Çevir','Translate')}</span></button><a class="mobile-settings" href="#settings" aria-label="${T('Tercihler ve veriler', 'Preferences & data')}">${icon('settings')}</a>`);
  if (storageError) showStorageError();
  updateAudioStatus();
  restoreView($('#app'),view);renderedRoute=currentRoute;
}
function page() {
  const r = route();
  if (r.startsWith('lesson/')) return lessonPage(r.split('/')[1]);
  if(r==='characters')return charactersPage(state,ui());
  if(r==='anime')return animePage(state,ui());
  if(['vocabulary','sentences','grammar'].includes(r))return studyPage(state,r,ui());
  if(r==='translate')return `${heading(T('ÇEVİRİ MASASI','TRANSLATION DESK'),T('Üç dil, altı yön.','Three languages. Six directions.'),T('Türkçe ↔ Japonca ↔ İngilizce.','Turkish ↔ Japanese ↔ English.'))}${translationBox(translationDraft,ui(),'full')}`;
  if (r === 'library') return libraryPage();
  if (r === 'review') return reviewPage();
  if (r === 'progress') return progressPage();
  if (r === 'settings') return settingsPage()+reminderSettings(state,ui())+`<p><a class="subtle-link" href="#sources">${T('Kanji kaynakları ve lisanslar','Kanji sources and licences')} →</a></p>`;
  if(r==='sources')return learningSources(ui());
  return hubPage(state,ui(),translationDraft).replace('<div class="hub-grid">',studyLaunches(ui())+'<div class="hub-grid">');
}
function button(label, action, style = 'primary', extra = '') { return `<button class="btn ${style}" data-action="${action}" ${extra}>${label}</button>`; }
function heading(eyebrow, title, sub) { return `<div class="page-heading"><p class="eyebrow">${eyebrow}</p><h1 tabindex="-1">${title}</h1><p class="muted">${sub}</p></div>`; }
function lessonTile(lesson) {
  const done = state.lessons[lesson.id]?.completedAt, skipped = state.lessons[lesson.id]?.skippedAt;
  return `<article class="lesson-tile"><button class="lesson-cover ${lesson.theme}" data-lesson="${lesson.id}" aria-label="${esc(L(lesson.title))}">${art(lesson.theme, true)}<span class="cover-jp" lang="ja">${lesson.japaneseTitle}</span><span class="lesson-number">${lesson.number}</span></button><div class="tile-body"><div class="tile-meta"><span>${T('KANA SONRASI', 'AFTER KANA')}</span><span>${lesson.minutes} ${T('dk', 'min')}</span></div><h3><button class="plain-link" data-lesson="${lesson.id}">${esc(L(lesson.title))}</button></h3><p>${esc(L(lesson.subtitle))}</p><button class="tile-link" data-lesson="${lesson.id}">${done ? T('Yeniden oku', 'Read again') : skipped ? T('Atlandı · İncele', 'Skipped · Explore') : T('Metni keşfet', 'Explore the text')}${icon(done ? 'check' : 'arrow')}</button></div></article>`;
}
function todayPage() {
  const today = dayKey(new Date(), state.settings.timezone), answered = state.events.filter(e => e.day === today).length;
  const target = Math.ceil(state.settings.dailyMinutes / 2), due = dueStates(state).length;
  const current = lessons.find(l => !state.lessons[l.id]?.completedAt && !state.lessons[l.id]?.skippedAt) || lessons[0];
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="little-line"></span>${T('BUGÜNÜN KÜÇÜK KEŞFİ', 'TODAY’S LITTLE DISCOVERY')}</p><h1 tabindex="-1">${T('Küçük bir metin,<br>yeni bir kapı.', 'A little reading.<br>A whole new door.')}</h1><p>${T('Japoncayı bağlamıyla keşfet. Oku, anlamlandır<br class="desktop-break"> ve öğrendiklerini yanında götür.', 'Find Japanese in context. Read, make sense of it,<br class="desktop-break"> and take what you learn with you.')}</p><button class="btn primary" data-lesson="${current.id}">${T('Kısa bir okumaya başla', 'Start a little reading')}${icon('arrow')}</button><span class="hero-hint">${icon('clock')}${T('5 dakika ile başla · Kana sonrası', 'Start with 5 minutes · After kana')}</span></div><div class="hero-art">${art()}<span class="art-caption" lang="ja">今日も、少しずつ。</span></div></section>
  <div class="dashboard-grid"><section class="daily-card"><div class="section-top"><div><p class="eyebrow">${T('SANA UYGUN BİR RİTİM', 'YOUR OWN PACE')}</p><h2>${T('Bugünün küçük planı', 'Your little plan for today')}</h2></div><button class="subtle-link" data-action="setup">${state.settings.onboarded ? T('Düzenle', 'Edit') : T('Kişiselleştir', 'Personalize')} ↗</button></div><div class="daily-row"><div class="progress-orbit" style="--progress:${Math.min(answered / target, 1) * 100}%"><span>${answered}<small>/ ${target}</small></span></div><div><strong>${T('Cevaplarla ilerle', 'One answer at a time')}</strong><p class="muted">${state.settings.dailyMinutes} ${T('dakikalık niyetine uygun', 'minute intention')} · ${target} ${T('cevap önerisi', 'suggested answers')}</p><span class="small muted">${T('Süre hedefin bir öneridir; çalışma süresi ölçülmez.', 'Your time goal is a guide; study minutes are not measured.')}</span></div></div><div class="flow-strip"><span>${icon('book')}${T('Oku', 'Read')}</span><span>→</span><span>${T('Anlamlandır', 'Understand')}</span><span>→</span><span>${icon('repeat')}${T('Hatırla', 'Recall')}</span></div></section>
  <section class="review-card"><div class="review-card-icon">${icon('repeat')}</div><p class="eyebrow">${T('BİRAZ DA HATIRLAYALIM', 'A MOMENT TO REMEMBER')}</p><h2>${due ? `${due} ${T('tekrar seni bekliyor.', 'reviews are waiting.')}` : T('Öğrendiklerine<br>yeniden merhaba.', 'Say hello to what<br>you’ve learned.')}</h2><p>${due ? T('Kendi kelimelerin, kendi hızında.', 'Your own words, at your own pace.') : T('Bir kelimeyi kaydettiğinde veya alıştırmayı bitirdiğinde tekrarın burada.', 'Save a word or answer an exercise to begin your review queue.')}</p><a class="subtle-link" href="#review">${T('Tekrar alanına git', 'Go to my reviews')}${icon('arrow')}</a></section></div>
  <section class="reading-section"><div class="section-top"><div><p class="eyebrow">${T('GÜNLÜK HAYATTAN BİRKAÇ SATIR', 'A FEW LINES FROM EVERYDAY LIFE')}</p><h2>${T('Okuma köşen', 'Your reading corner')}</h2></div><a class="subtle-link" href="#library">${T('Tüm metinler', 'All texts')} ${icon('arrow')}</a></div><div class="lesson-grid">${lessons.map(lessonTile).join('')}</div></section>`;
}
function libraryPage() { return `${heading(T('OKUMA KÖŞESİ', 'READING CORNER'), T('Bir metin seç. İçine gir.', 'Pick a text. Step inside.'), T('3 kısa metin · 15 kelime · 3 gramer odağı. Kana bilgisi varsayılır; bu paket tam bir N5 kursu değildir.', '3 short texts · 15 words · 3 grammar points. Assumes kana knowledge; this is not a full N5 course.'))}<div class="lesson-grid">${lessons.map(lessonTile).join('')}</div><div class="info-note">${icon('leaf')}<p>${T('İlk adım için her metin açık. Bildiğin bir metni dersin içinden atlayabilir, istediğinde geri dönebilirsin.', 'Every text is open. You can skip a familiar lesson from its reading screen and return whenever you like.')}</p></div>`; }
function renderToken(token) {
  const word = wordById[token];
  if (!word) return esc(token);
  const kana = word.readings[0].kana;
  const body = state.settings.furigana && kana !== word.written ? `<ruby>${word.written}<rt>${kana}</rt></ruby>` : word.written;
  return state.settings.explanations ? `<button class="word-token ${selectedWord === token ? 'selected' : ''}" data-word="${token}" lang="ja" aria-label="${esc(word.written)} · ${T('Açıklama', 'Explanation')}">${body}</button>` : `<span lang="ja">${body}</span>`;
}
function toggle(label, key) { return `<label class="toggle"><input type="checkbox" data-setting="${key}" ${state.settings[key] ? 'checked' : ''}><span>${label}</span></label>`; }
function lessonPage(id) {
  const lesson = lessons.find(l => l.id === id);
  if (!lesson) return emptyState(T('Metin bulunamadı.', 'Text not found.'), T('Okuma köşesine dönebilirsin.', 'Return to the reading corner.'), '#library');
  const session = state.session;
  if (session?.lessonId === id && session.phase === 'exercise') return exercisePage(session);
  if (session?.lessonId === id && session.phase === 'done') return completionPage(lesson, session);
  const grammar = grammarPoints.find(g => g.id === lesson.grammarId);
  return `<a href="#library" class="back-link">← ${T('Okuma köşesi', 'Reading corner')}</a><div class="lesson-heading"><div><p class="eyebrow">${T('KISA OKUMA', 'SHORT READING')} ${lesson.number} · ${lesson.minutes} ${T('DAKİKA', 'MINUTES')}</p><h1 tabindex="-1">${esc(L(lesson.title))}</h1><p class="muted">${esc(L(lesson.takeaway))}</p></div><span class="level-pill">${T('Kana sonrası', 'After kana')}</span></div>
  <div class="stepper" data-scroll-key="lesson-steps"><span class="current">01 ${T('Oku ve keşfet', 'Read & discover')}</span><span>02 ${T('Kendin dene', 'Try it yourself')}</span><span>03 ${T('Yanında götür', 'Take it with you')}</span></div>
  <div class="reader-grid"><section class="reading-paper"><div class="reader-controls">${toggle('Furigana', 'furigana')}${toggle(T('Açıklamalar', 'Explanations'), 'explanations')}${toggle(T('Çeviri', 'Translation'), 'translation')}</div><div class="story-content"><span class="story-label" lang="ja">${lesson.japaneseTitle}</span>${lesson.sentences.map(s => `<div class="sentence"><p class="japanese" lang="ja">${s.tokens.map(renderToken).join('')}</p>${state.settings.translation ? `<p class="translation">${esc(L(s.translation))}</p>` : ''}</div>`).join('')}</div><div class="audio-row"><button class="audio-button" data-action="audio" data-lesson-id="${id}" disabled>${icon('sound')}<span>${T('Ses denetleniyor', 'Checking audio')}</span></button><span id="audio-status" class="small muted"></span></div><div class="reader-bottom"><span class="small muted">${T('Altı çizili bir kelimeyi seçerek keşfet.', 'Select an underlined word to explore.')}</span>${button(`${T('Kendin dene', 'Try it yourself')}${icon('arrow')}`, 'practice', 'primary', `data-lesson-id="${id}"`)}</div></section>
  <aside class="context-panel">${state.settings.explanations ? wordPanel(lesson) : `<div class="context-placeholder">${icon('book')}<h2>${T('Kendi başına oku.', 'Read on your own.')}</h2><p>${T('Bir ipucu gerektiğinde açıklamaları açabilirsin.', 'Turn explanations on whenever you need a clue.')}</p></div>`}<div class="grammar-note"><p class="eyebrow">${T('GRAMER MERCEĞİ', 'GRAMMAR LENS')}</p><span class="grammar-form" lang="ja">${grammar.form}</span><h3>${esc(L(grammar.title))}</h3>${state.settings.explanations ? `<p>${esc(L(grammar.explanation))}</p>` : `<p class="muted">${T('Açıklamalar kapalı.', 'Explanations are off.')}</p>`}</div></aside></div>
  <div class="lesson-foot"><span class="small muted">${T('Örnek içerik · Editör onayı yok · Gerçek ses kaydı yok', 'Sample content · Not editor approved · No recorded audio')}</span><button class="subtle-link" data-action="skip-lesson" data-lesson-id="${id}">${T('Bu metni biliyorum · Atla', 'I know this text · Skip')} →</button></div>`;
}
function wordPanel(lesson) {
  if (!wordById[selectedWord] || !lesson.sentences.some(s => s.tokens.includes(selectedWord))) selectedWord = lesson.words[0];
  const word = wordById[selectedWord], sense = word.senses[0], saved = ['meaning', 'reading'].every(skill => state.skillStates[stateKey(word.id, skill)]);
  return `<div class="word-panel"><p class="eyebrow">${T('BU BAĞLAMDA', 'IN THIS CONTEXT')}</p><h2 class="word-large" lang="ja">${word.written}</h2><p class="word-reading" lang="ja">${word.readings[0].kana}</p>${pronunciationControls({written:word.written,reading:word.readings[0].kana},ui())}<p class="word-meaning">${esc(sense[state.settings.language])}</p><div class="word-context"><span>${T('Metindeki kullanımı', 'From the text')}</span><p lang="ja">${lesson.sentences.find(s => s.tokens.includes(word.id)).tokens.map(t => wordById[t]?.written || t).join('')}</p></div>${button(`${icon(saved ? 'check' : 'repeat')}${saved ? T('Tekrar listende', 'In your review list') : T('Tekrarıma ekle', 'Save for review')}`, 'save-word', 'secondary full-width', `data-word-id="${word.id}" ${saved ? 'disabled' : ''}`)}<p class="small muted">${T('Anlam ve okunuş için ayrı kartlar.', 'Separate cards for meaning and reading.')}</p></div>`;
}
const skillName = skill => ({ meaning: T('Anlam', 'Meaning'), reading: T('Okunuş', 'Reading'), listening: T('Dinleme', 'Listening'), writing: T('Yazılı cevap', 'Written answer') })[skill];
function currentQuestion(session) { return session.mode === 'review' ? getQuestion(session.questionId) : getQuestion(questions.filter(q => q.lessonId === session.lessonId)[session.index]?.id); }
function exercisePage(session) {
  const question = currentQuestion(session);
  if (!question) return emptyState(T('Bu soru bulunamadı.', 'Question not found.'), T('Okuma köşesine dön.', 'Return to the reading corner.'), '#library');
  const feedback = session.feedback, event = feedback ? state.events.find(e => e.id === feedback) : null;
  const total = questions.filter(q => q.lessonId === session.lessonId).length;
  const isReview = session.mode === 'review';
  return `<a class="back-link" href="${isReview ? '#today' : '#lesson/' + session.lessonId}" ${isReview ? '' : 'data-action="back-reading"'}>← ${isReview ? T('Bugün', 'Today') : T('Metne dön', 'Back to the text')}</a>${heading(isReview ? T('KİŞİSEL TEKRAR', 'PERSONAL REVIEW') : `${T('KENDİN DENE', 'TRY IT YOURSELF')} · ${(session.index || 0) + 1} / ${total}`, T('Biraz da senden.', 'Now it’s your turn.'), isReview ? T('Bir ipucu olmadan hatırlamayı dene.', 'Try to recall without a hint.') : T('Az önce keşfettiğini şimdi kullan.', 'Put what you just discovered to use.'))}
  <div class="exercise-layout"><section class="exercise-card"><div class="section-top"><span class="level-pill">${skillName(question.skill)}</span><button class="report-link" data-action="report" data-question-id="${question.id}">${icon('flag')}${T('Sorun bildir', 'Report an issue')}</button></div><h2 id="question-prompt">${esc(L(question.prompt))}</h2>${questionWord(question,event,ui(),{className:'question-context'})}
    <form id="answer-form" aria-labelledby="question-prompt">${question.choices ? `<fieldset class="choices" ${event ? 'disabled' : ''}><legend class="sr-only">${T('Cevabın', 'Your answer')}</legend>${L(question.choices).map((choice, i) => `<label class="choice"><input type="radio" name="answer" value="${esc(choice)}" required ${event?.answer === choice ? 'checked' : ''}><span class="choice-key">${i + 1}</span><span>${esc(choice)}</span></label>`).join('')}</fieldset>` : `<label class="answer-label" for="answer">${T('Cevabın', 'Your answer')}</label><input id="answer" name="answer" class="answer-input" lang="${question.skill === 'meaning' ? state.settings.language : 'ja'}" type="text" placeholder="${question.skill === 'meaning' ? T('Anlamını yaz…', 'Type the meaning…') : T('Japonca yaz…', 'Type in Japanese…')}" autocomplete="off" autocapitalize="off" spellcheck="false" required maxlength="200" ${event ? 'disabled' : ''} value="${esc(event?.answer || '')}"><p class="small muted">${T('Japonca klavye / IME kullanabilirsin. Enter ile kontrol et.', 'Japanese keyboard / IME supported. Press Enter to check.')}</p>`}
    ${event ? '' : `<button type="submit" class="btn primary full-width">${T('Cevabımı kontrol et', 'Check my answer')}${icon('check')}</button>`}</form>
    ${event ? `<div class="feedback ${event.correct ? 'correct' : 'incorrect'}" role="status"><strong>${event.correct ? T('Evet, tam olarak böyle.', 'Yes, that’s it.') : T('Birlikte bakalım.', 'Let’s take a look.')}</strong><p>${esc(L(question.explanation))}</p><p>${T('Kabul edilen cevaplar', 'Accepted answers')}: <strong>${esc(L(question.answers).join(' / '))}</strong></p><p class="small">${event.correct ? T('Bu beceri için sonraki tekrar zamanlandı.', 'The next review for this skill is scheduled.') : T('Bu beceri 10 dakika sonra tekrar kuyruğuna döner.', 'This skill returns to the review queue in 10 minutes.')}</p></div>${button(`${T('Devam et', 'Continue')}${icon('arrow')}`, 'next-question', 'primary full-width')}` : ''}
  </section><aside class="practice-note">${icon('leaf')}<h3>${T('Hatırlamak zaman ister.', 'Remembering takes time.')}</h3><p>${T('Bir yanlış cevap da işe yarar. Sadece bu sorunun ölçtüğü beceriyi kaydederiz.', 'An incorrect answer helps, too. We only record the skill tested by this question.')}</p><p class="small">${T('Yazılı tamamlama, serbest yazı veya el yazısı değerlendirmesi değildir. Dinleme puanı üretilmez.', 'Written completion does not assess free writing or handwriting. No listening score is generated.')}</p>${isReview ? button(T('Biliyorum · Kuyruktan çıkar', 'I know this · Remove from queue'), 'suspend', 'text') : ''}</aside></div>`;
}
function completionPage(lesson, session) {
  const events = state.events.filter(e => session.eventIds?.includes(e.id));
  return `<section class="completion"><div class="completion-icon">${icon('check')}</div><p class="eyebrow">${T('KÜÇÜK BİR ADIM DAHA', 'ANOTHER LITTLE STEP')}</p><h1 tabindex="-1">${T('Bu metin artık biraz daha tanıdık.', 'This text feels a little more familiar.')}</h1><p>${esc(L(lesson.title))} · ${events.length} ${T('cevap kaydedildi', 'answers saved')}, ${events.filter(e => e.correct).length} ${T('doğru', 'correct')}.</p><div class="takeaway"><span lang="ja">${grammarPoints.find(g => g.id === lesson.grammarId).form}</span><p>${esc(L(lesson.takeaway))}</p></div><p class="muted">${T('Bir sonraki tekrarın beceri bazında planlandı. Bu, ustalık puanı değil; bugünkü çalışmanın kaydı.', 'Your next reviews are scheduled by skill. This is a record of today’s practice, not a mastery score.')}</p><div class="button-row"><a class="btn primary" href="#today">${T('Bugüne dön', 'Back to today')}${icon('arrow')}</a><a class="btn secondary" href="#review">${T('Tekrarlarım', 'My reviews')}</a></div><button class="subtle-link" data-action="restart" data-lesson-id="${lesson.id}">${T('Metni yeniden oku', 'Read the text again')}</button></section>`;
}
function emptyState(title, description, href = '#library') { return `<section class="empty-state">${icon('leaf')}<h1 tabindex="-1">${title}</h1><p>${description}</p><a class="btn primary" href="${href}">${T('Devam et', 'Continue')}${icon('arrow')}</a></section>`; }
function reviewPage() {
  if (state.session?.mode === 'review' && state.session.phase === 'exercise') return exercisePage(state.session);
  const due = dueStates(state), active = Object.values(state.skillStates).filter(s => !s.suspended);
  const next = active.filter(s => new Date(s.dueAt) > new Date()).sort((a,b) => a.dueAt.localeCompare(b.dueAt))[0];
  return `${heading(T('KİŞİSEL TEKRAR', 'PERSONAL REVIEW'), T('Hatırladıkça yerleşir.', 'Let it settle. Come back to it.'), T('Kelimeler ve beceriler için küçük, ayrı tekrarlar.', 'Small, separate reviews for words and skills.'))}<section class="review-overview"><div class="review-big-number">${due.length}<span>${T('şimdi hazır', 'ready now')}</span></div><div><h2>${due.length ? T('Bir tur hatırlamaya hazır mısın?', 'Ready for a little recall?') : T('Şimdilik her şey yolunda.', 'You’re all caught up for now.')}</h2><p class="muted">${next ? `${T('Bir sonraki tekrar', 'Next review')}: ${formatDate(next.dueAt)}.` : T('Okurken bir kelime kaydet veya bir ders alıştırmasını tamamla.', 'Save a word while reading or complete an exercise.')}</p>${due.length ? button(`${T('Tekrara başla', 'Start reviewing')}${icon('arrow')}`, 'start-review') : '<a href="#library" class="btn secondary">' + T('Yeni bir metin keşfet', 'Explore a new text') + '</a>'}</div></section><div class="section-top"><h2>${T('Tekrar listem', 'My review list')}</h2><span class="small muted">${active.length} ${T('etkin beceri kartı', 'active skill cards')}</span></div><div class="review-list">${Object.values(state.skillStates).length ? Object.values(state.skillStates).map(s => `<div class="review-list-row"><div><strong lang="ja">${wordById[s.itemId]?.written || grammarPoints.find(g => g.id === s.itemId)?.form || esc(getQuestion(s.questionId)?.character?.display || getQuestion(s.questionId)?.context || s.itemId)}</strong><span class="small muted">${skillName(s.skill)}</span></div><span class="small">${s.suspended ? T('Senin seçiminle atlandı', 'Skipped by you') : formatDate(s.dueAt)}</span><button class="subtle-link" data-action="toggle-suspend" data-key="${stateKey(s.itemId, s.skill)}">${s.suspended ? T('Kuyruğa al', 'Resume') : T('Biliyorum · Atla', 'I know it · Skip')}</button></div>`).join('') : `<p class="muted">${T('Listen henüz boş. İlk kelimeni okuma ekranından ekle.', 'Your list is empty. Save your first word from a text.')}</p>`}</div><p class="info-note small">${T('Basit plan: yanlış → 10 dakika; art arda doğru → 1, 3, 7, 14, 30 gün. FSRS veya kişiselleştirilmiş tahmin kullanılmıyor.', 'Simple schedule: incorrect → 10 minutes; successive correct answers → 1, 3, 7, 14, 30 days. No FSRS or personalized prediction is used.')}</p>`;
}
function formatDate(value) { return new Intl.DateTimeFormat(state.settings.language === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: state.settings.timezone }).format(new Date(value)); }
function progressPage() {
  const days = recentDayKeys(new Date(), state.settings.timezone).map(key => ({ key, count: state.events.filter(e => e.day === key).length }));
  const max = Math.max(1, ...days.map(d => d.count));
  return `${heading(T('İLERLEMEM', 'MY PROGRESS'), T('Çabanın küçük izleri.', 'Little signs of your effort.'), T('Yalnızca kaydedilen cevaplar. Dil yeterliliği veya ustalık tahmini yok.', 'Only recorded answers. No estimate of proficiency or mastery.'))}<div class="stats-grid"><div class="stat-card"><span>${T('Toplam cevap', 'Total answers')}</span><strong>${state.events.length}</strong></div><div class="stat-card"><span>${T('Tamamlanan metin', 'Completed texts')}</span><strong>${Object.values(state.lessons).filter(l => l.completedAt).length}<small> / 3</small></strong></div><div class="stat-card"><span>${T('Çalışılan gün', 'Practice days')}</span><strong>${new Set(state.events.map(e => e.day)).size}</strong></div></div><section class="panel"><h2>${T('Beceriler ayrı, kayıtlar açık.', 'Separate skills. Clear records.')}</h2><div class="skill-grid">${['meaning', 'reading', 'listening', 'writing'].map(skill => { const sum = skillSummary(state, skill); return `<article class="skill-card"><span class="skill-dot ${skill}"></span><h3>${skillName(skill)}</h3><strong>${sum.attempts ? `${sum.correct} / ${sum.attempts}` : '—'}</strong><p class="small muted">${sum.attempts ? T('doğru / cevap · ustalık puanı değil', 'correct / attempts · not mastery') : T('Ölçülmedi', 'Not assessed')}</p>${skill === 'listening' ? `<p class="small muted">${T('Sentetik sesi dinlemek test sayılmaz.', 'Listening to synthetic speech is not a test.')}</p>` : ''}</article>`; }).join('')}</div></section><section class="panel"><h2>${T('Son 7 gün', 'Last 7 days')}</h2><div class="activity-chart" role="img" aria-label="${esc(days.map(d => `${d.key}: ${d.count}`).join(', '))}">${days.map(d => `<div class="chart-column"><span>${d.count}</span><div class="chart-track"><div class="chart-bar" style="height:${d.count/max*100}%"></div></div><small>${d.key.slice(8)}.${d.key.slice(5,7)}</small></div>`).join('')}</div><p class="small muted">${T('Gün sınırı: 00.00', 'Day boundary: 00:00')} · ${esc(state.settings.timezone)}. ${T('Geçmiş cevapların günü, cevap anındaki saat dilimine göre korunur.', 'Past answer days keep the time zone used when answering.')}</p></section><div class="button-row">${button(`${icon('download')}${T('Verilerimi dışa aktar', 'Export my data')}`, 'export', 'secondary')}<a class="subtle-link" href="#settings">${T('Tercihler ve yerel bildirimler', 'Preferences & local reports')} →</a></div>`;
}
function settingsFields() {
  return `<div class="form-grid"><label>${T('Hedefim', 'My goal')}<select name="goal"><option value="reading" ${state.settings.goal === 'reading' ? 'selected' : ''}>${T('Kısa metinlere geçmek', 'Move on to short texts')}</option><option value="everyday" ${state.settings.goal === 'everyday' ? 'selected' : ''}>${T('Günlük ifadeleri pekiştirmek', 'Practice everyday expressions')}</option></select></label><label>${T('Başlangıç noktam', 'My starting point')}<select name="level"><option value="kana" ${state.settings.level === 'kana' ? 'selected' : ''}>${T('Kana okuyabiliyorum', 'I can read kana')}</option><option value="basic" ${state.settings.level === 'basic' ? 'selected' : ''}>${T('Temel cümlelere aşinayım', 'I know basic sentences')}</option></select></label><label>${T('Günlük niyetim', 'My daily intention')}<select name="dailyMinutes">${[5,10,15].map(n => `<option value="${n}" ${state.settings.dailyMinutes === n ? 'selected' : ''}>${n} ${T('dakika', 'minutes')}</option>`).join('')}</select></label><label>${T('Gün sınırı için saat dilimi', 'Time zone for day boundaries')}<input name="timezone" value="${esc(state.settings.timezone)}" required placeholder="Europe/Istanbul" maxlength="100"><span class="small muted">${T('Gün 00.00’da başlar. IANA adı kullan: Europe/Istanbul gibi.', 'The day starts at 00:00. Use an IANA name, e.g. Europe/Istanbul.')}</span></label></div><p class="small muted">${T('Hedef ve seviye tercihi kaydedilir; bu küçük paketin içeriği değişmez. Günlük süre, cevap önerisini ayarlar.', 'Goal and level are saved; this small content pack stays the same. Daily time adjusts the suggested answer count.')}</p>`;
}
function settingsPage() {
  return `${heading(T('TERCİHLER VE VERİLER', 'PREFERENCES & DATA'), T('Kendi ritmini bul.', 'Find your own rhythm.'), T('İlerleme bu tarayıcıda saklanır. Çeviri ve videolar dış hizmetlerden gelir. Hesap/eşitleme yok.', 'Progress stays in this browser. Translation and videos use external services. No account or sync.'))}<section class="panel"><form id="settings-form">${settingsFields()}<p id="settings-validation" role="alert" class="validation"></p><button class="btn primary" type="submit">${T('Tercihlerimi kaydet', 'Save preferences')}${icon('check')}</button></form></section><section class="panel"><h2>${T('Kayıtların yanında kalsın.', 'Keep your records with you.')}</h2><p>${T('Cevapların, tekrar planın, tercihlerin ve sorun bildirimlerin JSON olarak dışa aktarılır. Bu sürümde içe aktarma yok.', 'Export answers, review schedule, preferences, and issue reports as JSON. Import is not available in this version.')}</p>${button(`${icon('download')}${T('Verilerimi dışa aktar', 'Export my data')}`, 'export', 'secondary')}<p class="small muted">${T('Tarayıcı verilerini silmek kayıtları kaldırır. Özel pencere kalıcı kayıt sağlamayabilir. Düzenli dışa aktarım önerilir.', 'Clearing browser data removes records. Private browsing may not retain them. Export regularly.')}</p></section><section class="panel"><h2>${T('Sorun bildirimlerin', 'Your issue reports')}</h2><p class="muted">${T('Yalnızca burada saklanır; bir ekibe gönderilmez. Dışa aktarılan dosyada yer alır.', 'Stored here only; not sent to a team. Included in your data export.')}</p>${state.issues.length ? `<ul class="issue-list">${state.issues.map(i => `<li><strong>${esc(i.questionId)}</strong> · ${formatDate(i.createdAt)}<p>${esc(i.description)}</p></li>`).join('')}</ul>` : `<p class="small muted">${T('Henüz bildirim yok.', 'No reports yet.')}</p>`}</section><section class="info-note"><p>${T('Paket: Hiragana/katakana için 104’er kana, 50 kanji kelimesi, 4 anime örneği ve kişisel replikler; ayrıca 3 kısa okuma, 9 soru. Çeviri MyMemory üzerinden; videolar yayıncıların YouTube oynatıcısından gelir. Eğitmen onayı ve ücretli paket yok.', 'Pack: 104 kana per script, 50 kanji words, 4 anime examples and personal lines; plus 3 short readings and 9 questions. Translation uses MyMemory; videos use publishers’ YouTube players. No teacher approval or paid tiers.')}<br><span class="small">${T('İçerik sürümü', 'Content version')}: ${CONTENT_VERSION} · ${T('Araştırma', 'Research')}: 30.10.2026.</span></p></section>`;
}
function openDialog(html) { $('#dialog').innerHTML = html; $('#dialog').showModal(); }
function setupDialog() { openDialog(`<div class="dialog-heading"><p class="eyebrow">${T('KÜÇÜK BİR BAŞLANGIÇ', 'A LITTLE BEGINNING')}</p><button class="close-dialog" data-action="close-dialog" aria-label="${T('Kapat', 'Close')}">×</button></div><h2>${T('Sana uygun bir ritim.', 'A rhythm that suits you.')}</h2><p class="muted">${T('Bir dakikada ayarla. İstediğin zaman değiştirebilirsin.', 'Set it up in a minute. Change it whenever you like.')}</p><form id="setup-form">${settingsFields()}<p id="settings-validation" role="alert" class="validation"></p><button type="submit" class="btn primary full-width">${T('Bu ritimle başlayalım', 'Let’s start at this pace')}${icon('arrow')}</button></form><button class="subtle-link dialog-skip" data-action="close-dialog">${T('Şimdilik doğrudan örnek dersi keşfet', 'Explore a sample lesson for now')}</button>`); }
function reportDialog(id) { openDialog(`<div class="dialog-heading"><p class="eyebrow">${T('SORUYA DAİR BİR NOT', 'A NOTE ABOUT THIS QUESTION')}</p><button class="close-dialog" data-action="close-dialog" aria-label="${T('Kapat', 'Close')}">×</button></div><h2>${T('Neyi düzeltmeliyiz?', 'What should we fix?')}</h2><p class="muted">${esc(id)} · ${CONTENT_VERSION}</p><form id="report-form" data-question-id="${id}"><label for="report-description">${T('Hata veya kabul edilmeyen geçerli cevap', 'Error or valid answer that was not accepted')}</label><textarea id="report-description" name="description" rows="5" required maxlength="2000"></textarea><p class="small muted">${T('Bu not yalnızca tarayıcına kaydedilir; dışa aktardığında paylaşabilirsin.', 'This note is saved only in your browser; you can share it by exporting your data.')}</p><button class="btn primary" type="submit">${T('Notu yerel kaydet', 'Save note locally')}${icon('check')}</button></form>`); }
function voices() { return speechPlayer.voices(); }
function updateAudioStatus() {
  const playback=speechPlayer.snapshot();speaking=['queued','speaking'].includes(playback.phase);
  syncPronunciationControls(document,ui(),speechPlayer);
  const btn = $('[data-action="audio"]');
  if (!btn) return;
  const available = voices().length > 0;
  btn.disabled = !available;
  btn.querySelector('span').textContent = speaking && playback.key?.startsWith('lesson:') ? T('Durdur', 'Stop') : T('Sentetik Japonca ses', 'Synthetic Japanese voice');
  $('#audio-status').textContent = playback.key?.startsWith('lesson:')&&playback.phase==='error'?T('Seslendirme başlatılamadı. Yeniden deneyebilirsin.','Speech could not be played. You can retry.'):available ? T('Tarayıcı seslendirmesi · İnsan kaydı değil', 'Browser speech · Not a human recording') : T('Bu tarayıcıda Japonca ses bulunamadı.', 'No Japanese voice is available in this browser.');
}
function stopAudio() { speechPlayer.stop(); }
function playAudio(id) {
  if (speaking && speechPlayer.snapshot().key===`lesson:${id}`) { stopAudio(); return; }
  const lesson = lessons.find(l => l.id === id);
  if(!lesson)return;
  const text=lesson.sentences.map(s=>s.tokens.map(t=>wordById[t]?.written||t).join('')).join(' ');
  const result=speechPlayer.play({text,key:`lesson:${id}`});if(!result.ok)toast(T('Japonca seslendirme kullanılamıyor.','Japanese speech is unavailable.'));
}
async function startLesson(id, restart = false) {
  selectedWord = lessons.find(l => l.id === id)?.words[0] || 'cafe';
  if (restart || state.session?.lessonId !== id || state.session?.mode !== 'lesson' || state.session?.phase === 'done') {
    const next = structuredClone(state); next.session = { mode: 'lesson', lessonId: id, phase: 'reading', index: 0, eventIds: [] };
    if (!await commit(next, false)) return;
  }
  navigate(`lesson/${id}`);
}
function invalidateTranslation() {
  translationRequest++;translationAbort?.abort();translationDraft.busy=false;translationDraft.result='';translationDraft.error='';translationDraft.route=[];
}
function syncTranslation() {
  for(const box of document.querySelectorAll('.translation-container')) {
    const form=box.querySelector('form');
    for(const name of ['source','target','text']) {const input=form.elements.namedItem(name);if(input && input!==document.activeElement)input.value=translationDraft[name];}
    form.elements.namedItem('text').lang=translationDraft.source;
    box.querySelector('.translation-counter').textContent=`${new TextEncoder().encode(translationDraft.text).length} / 500 ${T('bayt','bytes')}`;
    const submit=form.querySelector('[type="submit"]');submit.disabled=translationDraft.busy;submit.innerHTML=`${translationDraft.busy?T('Çevriliyor…','Translating…'):T('Çevir','Translate')}${icon('arrow')}`;
    box.querySelector('[data-translation-output]').innerHTML=translationOutput(translationDraft,ui());
  }
}
async function performTranslation(form) {
  if(translationDraft.busy)return;
  const data=new FormData(form);Object.assign(translationDraft,{text:String(data.get('text')||'').trim(),source:String(data.get('source')),target:String(data.get('target')),result:'',error:''});
  if(!translationDraft.text)translationDraft.error='EMPTY_TEXT';
  else if(translationDraft.source===translationDraft.target)translationDraft.error='INVALID_PAIR';
  else if(new TextEncoder().encode(translationDraft.text).length>500)translationDraft.error='TEXT_TOO_LONG';
  if(translationDraft.error){syncTranslation();return;}
  const request=++translationRequest;translationAbort=new AbortController();translationDraft.busy=true;syncTranslation();
  try{
    const result=await requestTranslation({text:translationDraft.text,source:translationDraft.source,target:translationDraft.target},{signal:translationAbort.signal});
    if(request!==translationRequest)return;
    translationDraft.result=result.text;translationDraft.route=result.route || [];
  }catch(e){if(request!==translationRequest || e.name==='AbortError')return;translationDraft.error=e.code || 'NETWORK';}
  finally{if(request===translationRequest){translationDraft.busy=false;syncTranslation();}}
}
function addQuoteDialog() {
  openDialog(`<div class="dialog-heading"><p class="eyebrow">${T('KENDİ REPLİK DEFTERİN','YOUR OWN LINE NOTEBOOK')}</p><button class="close-dialog" data-action="close-dialog" aria-label="${T('Kapat','Close')}">×</button></div><h2>${T('Sana takılan bir cümle.','A line that stayed with you.')}</h2><form id="custom-quote-form"><div class="form-grid"><label>${T('Anime adı','Anime title')}<input name="series" required maxlength="80"></label><label>${T('Zorluk','Difficulty')}<select name="level"><option value="beginner">${T('Başlangıç','Beginner')}</option><option value="intermediate" selected>${T('Orta','Intermediate')}</option><option value="advanced">${T('Zor','Advanced')}</option></select></label></div><label>${T('Japonca replik','Japanese line')}<textarea name="text" required maxlength="200" rows="2" lang="ja"></textarea></label><div class="form-grid"><label>${T('Okunuş (isteğe bağlı)','Reading (optional)')}<input name="reading" maxlength="300" lang="ja"></label><label>${T('Boşlukta sorulacak parça','Part to hide in the exercise')}<input name="target" required maxlength="60" lang="ja"></label><label>${T('Türkçe çalışma çevirin','Your Turkish study translation')}<input name="tr" maxlength="500"></label><label>${T('İngilizce çalışma çevirin','Your English study translation')}<input name="en" maxlength="500"></label></div><label>${T('YouTube kaynak bağlantısı (isteğe bağlı)','YouTube source link (optional)')}<input type="url" name="source" placeholder="https://www.youtube.com/watch?v=…"></label><p class="small muted">${T('Yalnızca bu tarayıcıya kaydedilir. Kaynağın ve cevap anahtarın doğrulanmış sayılmaz.','Saved only in this browser. Your source and answer key are not treated as verified.')}</p><p id="quote-validation" role="alert" class="validation"></p><button class="btn primary full-width" type="submit">${T('Repliği kaydet','Save line')}${icon('check')}</button></form>`);
}
async function answerNewExercise(form,kind) {
  if(busy)return;
  const session=kind==='lab-answer'?state.practice.session:state.anime.practice;
  if(!session || session.feedback)return;
  const answer=String(new FormData(form).get('answer') || '').trim();if(!answer)return;
  const question=kind==='lab-answer'?getQuestion(session.ids[session.index]):getQuestion(`anime:${session.quoteId}`),id=crypto.randomUUID();
  const next=recordAnswer(state,question,answer,new Date(),id,Math.min(600000,Math.round(performance.now()-questionStarted)),kind==='lab-answer'?'characters':'anime');
  const nextSession=kind==='lab-answer'?next.practice.session:next.anime.practice;
  nextSession.feedback=id;nextSession.eventIds.push(id);
  if(await commit(next))$('.feedback')?.focus();
}
function paintCharacterInput(form,kind) {
 const wrong=kind==='incorrect',status=form.querySelector('#lab-live-status'),input=form.querySelector('input[type="text"],input:not([type])');
 if(status){status.textContent=wrong?T('Yanlış. Aynı harfte tekrar dene.','Incorrect. Try this character again.'):'';status.classList.toggle('incorrect',wrong);}
 input?.setAttribute('aria-invalid',String(wrong));
}
function queueCharacterInput(form,submitted=false) {
 if(!form?.isConnected || !form.dataset.questionId)return;
 const input=form.querySelector('.answer-input');if(input && composingCharacterInputs.has(input))return;
 const answer=String(new FormData(form).get('answer') || '');
 const question=getCharacterQuestion(form.dataset.questionId);if(!question)return;
 paintCharacterInput(form,classifyCharacterInput(question,answer,state.settings.language,submitted));
 pendingCharacterInput={form,answer,submitted,questionId:form.dataset.questionId,sessionId:form.dataset.sessionId};
 void drainCharacterInput();
}
async function drainCharacterInput() {
 if(busy || processingCharacterInput || !pendingCharacterInput)return;
 processingCharacterInput=true;
 try{
  while(pendingCharacterInput && !busy){
   const task=pendingCharacterInput;pendingCharacterInput=null;
   if(!task.form.isConnected || route()!=='characters')continue;
   const result=applyCharacterInput(state,task.answer,{submitted:task.submitted,questionId:task.questionId,sessionId:task.sessionId,elapsedMs:Math.min(600000,Math.round(performance.now()-questionStarted))});
   if(result.kind==='stale')continue;
   if(result.state===state)continue;
   if(result.state.events.length>state.events.length)result.state.events.at(-1).pronunciationHintRequested=!!state.practice.session?.pronunciationHintIds?.includes(task.questionId);
   if(result.advanced)task.form.querySelectorAll('input,button').forEach(el=>{el.disabled=true;});
   const saved=await commit(result.state,false);
   if(!saved){if(task.form.isConnected)task.form.querySelectorAll('input,button').forEach(el=>{el.disabled=false;});continue;}
   if(result.advanced){
    questionStarted=performance.now();
    if(route()==='characters'){render();const input=$('#lab-answer-input') || $('[data-form="lab-answer"] input[type="radio"]');if(input)input.focus({preventScroll:true});else if(state.practice.session?.phase==='done'){$('.practice-welcome h2')?.setAttribute('tabindex','-1');$('.practice-welcome h2')?.focus({preventScroll:true});}if(result.kind==='revealed')$('.character-result')?.scrollIntoView({block:'nearest'});}
   }
  }
 }finally{processingCharacterInput=false;if(pendingCharacterInput&&!busy)void drainCharacterInput();}
}
async function advanceQuestion() {
  const next = structuredClone(state), session = next.session;
  if (session.mode === 'review') {
    const due = dueStates(state);
    session.questionId = due[0]?.questionId; session.feedback = null;
    if (!due.length) { next.session = null; if (await commit(next)) toast(T('Bu tur tamam. Kayıtların saklandı.', 'All done for now. Your answers are saved.')); return; }
  } else {
    session.index++; session.feedback = null;
    if (session.index >= questions.filter(q => q.lessonId === session.lessonId).length) {
      session.phase = 'done'; next.lessons[session.lessonId] = { ...next.lessons[session.lessonId], completedAt: new Date().toISOString() };
    }
  }
  if (await commit(next)) { questionStarted = performance.now(); focusHeading(); }
}
document.addEventListener('click', async e => {
  const target = e.target.closest('button, a');
  if (!target) return;
  if (target.matches('.skip-link')) { e.preventDefault(); $('#main')?.focus(); return; }
  if (target.dataset.lang) {
    if (target.dataset.lang !== state.settings.language) { const next = structuredClone(state); next.settings.language = target.dataset.lang; if (await commit(next)) $('[data-lang="' + state.settings.language + '"]')?.focus(); }
    return;
  }
  if (target.dataset.lesson) { await startLesson(target.dataset.lesson); return; }
  if (target.dataset.word) { selectedWord = target.dataset.word; render(); $('[data-word="' + selectedWord + '"]')?.focus({ preventScroll: true }); return; }
  const action = target.dataset.action;
  if (!action) return;
  if (target.tagName === 'A') e.preventDefault();
  if (action === 'reload') { location.reload(); return; }
  if (action === 'close-dialog') { $('#dialog').close(); return; }
  if (action === 'setup') { setupDialog(); return; }
  if (action === 'report') { reportDialog(target.dataset.questionId); return; }
  if(action==='stop-pronunciation'){stopAudio();return;}
  if(action==='pronounce'){
    if(busy)return;const group=target.closest('.word-pronunciation'),text=pronunciationText({reading:group?.dataset.pronunciationReading});if(!text)return;
    const result=speechPlayer.play({text,key:group.dataset.pronunciationKey,speed:target.dataset.speed});
    if(!result.ok){updateAudioStatus();return;}
    if(group.dataset.pronunciationHint==='true'){
      const next=structuredClone(state),where=route(),session=where==='vocabulary'?next.learning.session:where==='characters'?next.practice.session:where==='review'||where.startsWith('lesson/')?next.session:null;
      const id=session?.ids?.[session.index]||session?.questionId||(session?.mode==='lesson'?currentQuestion(session)?.id:null);
      if(session&&!session.feedback&&id===group.dataset.pronunciationQuestion){session.pronunciationHintIds=[...new Set([...(session.pronunciationHintIds||[]),id])];await commit(next,false);}
    }return;
  }
  if (action === 'audio') { playAudio(target.dataset.lessonId); return; }
  if(action==='open-translation'){openDialog(`<div class="dialog-heading"><span></span><button class="close-dialog" data-action="close-dialog" aria-label="${T('Kapat','Close')}">×</button></div>${translationBox(translationDraft,ui(),'dialog')}`);return;}
  if(action==='translation-swap'){const text=translationDraft.result || translationDraft.text;invalidateTranslation();[translationDraft.source,translationDraft.target]=[translationDraft.target,translationDraft.source];translationDraft.text=text;syncTranslation();return;}
  if(action==='translation-copy'){try{await navigator.clipboard.writeText(translationDraft.result);toast(T('Çeviri kopyalandı.','Translation copied.'));}catch{toast(T('Kopyalanamadı. Metni seçerek kopyalayabilirsin.','Could not copy. You can select the text manually.'));}return;}
  if(action==='reminder-permission'){
    try{const permission=await requestReminderPermission();render();toast(permission==='granted'?T('Bildirim izni açıldı. Hatırlatma yalnızca Yomu açıkken çalışır.','Notifications enabled. The reminder runs only while Yomu is open.'):T('İzin verilmedi veya bu tarayıcı desteklemiyor.','Permission was not granted or this browser is unsupported.'));}catch{toast(T('Bildirim izni açılamadı. Tarayıcı ve telefon ayarlarını kontrol et.','Could not enable notifications. Check browser and phone settings.'));}return;
  }
  if(action==='reminder-test'){await fireStudyReminder(true);return;}
  if(action==='reminder-google'){window.open(googleReminderUrl({time:state.reminder.time,url:location.origin+'/#today'}),'_blank','noopener,noreferrer');return;}
  if(action==='reminder-ics'){
   const next=structuredClone(state);next.reminder.calendarUid ||= crypto.randomUUID();if(!await commit(next,false))return;
   const text=reminderCalendar({time:state.reminder.time,url:location.origin+'/#today',uid:state.reminder.calendarUid});const url=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='yomu-gunluk-hatirlatici.ics';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),10000);toast(T('Takvim dosyası hazır. Alarmı etkinleştirmek için takvimine eklemeyi tamamla.','Calendar file ready. Complete adding it to your calendar to enable its alarm.'));return;
  }
  if(action==='add-quote'){addQuoteDialog();return;}
  if(action==='load-clip'){const quote=[...animeQuotes,...state.anime.customQuotes].find(q=>q.id===target.dataset.quote);if(quote?.videoId){clipCleanup?.();clipCleanup=mountClip($('#video-panel'),quote,ui());$('#video-panel').scrollIntoView({behavior:'smooth',block:'nearest'});}return;}
  if (action === 'export') {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), application: 'yomu', ...state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), anchor = document.createElement('a'); anchor.href = url; anchor.download = `yomu-${dayKey(new Date(), state.settings.timezone)}.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast(T('Dışa aktarma dosyası hazır.', 'Your export file is ready.')); return;
  }
  if (busy) return;
  let next = structuredClone(state);
  if(action==='reading-hint'){
   next.settings.questionReadings=!next.settings.questionReadings;
   if(next.settings.questionReadings){const session=route()==='vocabulary'?next.learning.session:route()==='review'?next.session:null;if(session){const id=session.ids?.[session.index]||session.questionId;session.readingHintIds=[...new Set([...(session.readingHintIds||[]),id])];}}
   if(await commit(next,false))syncReadingHints(ui());return;
  }
  if(action==='study-card-reading'){next.learning.vocabulary.showReading=!next.learning.vocabulary.showReading;if(await commit(next))$('[data-action="study-card-reading"]')?.focus({preventScroll:true});return;}
  if(action==='study-level'||action==='study-clear'||action==='study-reset'){
   const kind=target.dataset.kind,changes=action==='study-level'?{level:target.dataset.level}:action==='study-clear'?{search:''}:defaultLearning()[kind];
   if(await commit(selectStudyConfig(state,kind,changes))){const focus=action==='study-level'?`[data-action="study-level"][data-level="${target.dataset.level}"]`:'#study-search';$(focus)?.focus({preventScroll:true});}return;
  }
  if(action==='study-select'){next.learning[target.dataset.kind].selectedId=target.dataset.item;await commit(next);return;}
  if(action==='study-save'){if(await commit(saveStudyItem(state,target.dataset.kind,target.dataset.item)))toast(T('Tekrar listene eklendi. Başarı kaydı eklenmedi.','Saved for review. No success was recorded.'));return;}
  if(action==='study-start'){const kind=target.dataset.kind;next.learning.session=createStudySession(kind,next.learning[kind]);if(!next.learning.session)return;if(await commit(next)){questionStarted=performance.now();focusStudy();}return;}
  if(action==='study-close'){next.learning.session=null;await commit(next);return;}
  if(action==='study-next'){const s=next.learning.session;if(!s?.feedback)return;s.index++;s.feedback=null;if(s.index>=s.ids.length)s.phase='done';if(await commit(next)){questionStarted=performance.now();focusStudy();}return;}
  if(action==='quick-script'||action==='lab-script'){next.practice.script=target.dataset.script;if(await commit(next,false)){if(action==='quick-script')navigate('characters');else render();}return;}
  if(action==='lab-all'||action==='lab-none'){next.practice.groups=action==='lab-all'?groupsFor(next.practice.level).map(g=>g.id):[];await commit(next);return;}
  if(action==='lab-start'){try{next.practice.session=createCharacterSession(next.practice);if(await commit(next)){questionStarted=performance.now();$('.practice-stage')?.scrollIntoView({block:'start',behavior:'smooth'});($('#lab-answer-input') || $('[data-form="lab-answer"] input[type="radio"]'))?.focus({preventScroll:true});}}catch{$('#lab-validation').textContent=T('En az bir satır seç.','Choose at least one row.');}return;}
  if(action==='lab-next'){const s=next.practice.session;if(!s?.feedback)return;s.index++;s.feedback=null;if(s.index>=s.ids.length)s.phase='done';if(await commit(next)){questionStarted=performance.now();$('.practice-stage')?.scrollIntoView({block:'start',behavior:'smooth'});}return;}
  if(action==='lab-mistakes'){const s=next.practice.session;if(!s)return;const ids=[...new Set(state.events.filter(e=>s.eventIds.includes(e.id)&&!e.correct).map(e=>e.questionId))];if(!ids.length)return;next.practice.session={...s,id:crypto.randomUUID(),ids,index:0,eventIds:[],feedback:null,phase:'exercise',wrongForCurrent:false,draft:'',lastResult:null};if(await commit(next)){questionStarted=performance.now();($('#lab-answer-input') || $('[data-form="lab-answer"] input[type="radio"]'))?.focus({preventScroll:true});}return;}
  if(action==='open-quote'||action==='select-quote'){next.anime.activeId=target.dataset.quote;next.anime.practice=null;if(action==='open-quote'){next.anime.level='all';next.anime.series='all';}if(await commit(next,false)){if(action==='open-quote')navigate('anime');else render();}return;}
  if(action==='anime-reset'){next.anime.level='all';next.anime.series='all';await commit(next);return;}
  if(action==='quote-practice'){next.anime.practice={quoteId:target.dataset.quote,eventIds:[],feedback:null};if(await commit(next)){questionStarted=performance.now();$('.quote-exercise')?.scrollIntoView({block:'start',behavior:'smooth'});}return;}
  if(action==='quote-finish'){next.anime.practice=null;if(await commit(next))toast(T('Cevabın kaydedildi ve tekrar planına eklendi.','Answer saved and added to your review schedule.'));return;}
  if (action === 'large') { next.settings.largeText = !next.settings.largeText; if (await commit(next)) $('[data-action="large"]')?.focus(); return; }
  if (action === 'save-word') { if (await commit(addWord(state, target.dataset.wordId))) toast(T('Anlam ve okunuş kartları tekrar listene eklendi.', 'Meaning and reading cards saved for review.')); return; }
  if (action === 'practice') { stopAudio(); next.session = next.session?.lessonId === target.dataset.lessonId && next.session.phase !== 'done' ? { ...next.session, phase: 'exercise' } : { mode: 'lesson', lessonId: target.dataset.lessonId, phase: 'exercise', index: 0, eventIds: [] }; if (await commit(next)) { questionStarted = performance.now(); focusHeading(); } return; }
  if (action === 'back-reading') { next.session.phase = 'reading'; await commit(next); return; }
  if (action === 'next-question') { await advanceQuestion(); return; }
  if (action === 'restart') { await startLesson(target.dataset.lessonId, true); return; }
  if (action === 'skip-lesson') { next.lessons[target.dataset.lessonId] = { ...next.lessons[target.dataset.lessonId], skippedAt: new Date().toISOString() }; next.session = null; if (await commit(next, false)) { navigate('library'); toast(T('Metin atlandı. Ustalık veya başarı kaydı eklenmedi.', 'Text skipped. No mastery or success was recorded.')); } return; }
  if (action === 'start-review') { const due = dueStates(state); if (!due.length) { render(); return; } next.session = { mode: 'review', phase: 'exercise', questionId: due[0].questionId, feedback: null, eventIds: [] }; if (await commit(next)) { questionStarted = performance.now(); focusHeading(); } return; }
  if (action === 'suspend') { const q = currentQuestion(state.session); next = suspendItem(state, q.itemId, q.skill); const due = dueStates(next); next.session = due.length ? { ...next.session, questionId: due[0].questionId, feedback: null } : null; await commit(next); return; }
  if (action === 'toggle-suspend') { const item = next.skillStates[target.dataset.key]; item.suspended = !item.suspended; await commit(next); }
});
document.addEventListener('change', async e => {
  if(e.target.dataset.study){if(busy)return;const kind=e.target.dataset.studyKind,key=e.target.dataset.study;const value=key==='showReading'?e.target.checked:e.target.value;if(await commit(selectStudyConfig(state,kind,{[key]:value})))$(`[data-study="${key}"]`)?.focus({preventScroll:true});return;}
  if(e.target.matches('[data-form="lab-answer"] input[type="radio"]')){queueCharacterInput(e.target.form);return;}
  if(e.target.closest('[data-form="translation"]')){if(['source','target'].includes(e.target.name)){invalidateTranslation();translationDraft[e.target.name]=e.target.value;if(translationDraft.source===translationDraft.target){const other=e.target.name==='source'?'target':'source';translationDraft[other]=['tr','ja','en'].find(l=>l!==e.target.value);}syncTranslation();}return;}
  if(e.target.dataset.lab){const key=e.target.dataset.lab,next=structuredClone(state);next.practice[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;if(key==='level')next.practice.groups=groupsFor(e.target.value).map(g=>g.id);await commit(next);return;}
  if(e.target.dataset.kanaGroup){const id=e.target.dataset.kanaGroup,next=structuredClone(state);next.practice.groups=e.target.checked?[...new Set([...next.practice.groups,id])]:next.practice.groups.filter(g=>g!==id);await commit(next);return;}
  if(e.target.dataset.anime){const next=structuredClone(state);next.anime[e.target.dataset.anime]=e.target.value;next.anime.practice=null;await commit(next);return;}
  if (e.target.dataset.setting) { const key = e.target.dataset.setting; const next = structuredClone(state); next.settings[key] = e.target.checked; if (await commit(next)) $('[data-setting="' + key + '"]')?.focus({ preventScroll: true }); }
});
document.addEventListener('input',e=>{
 if(e.target.matches('[data-form="lab-answer"] .answer-input')){if(!e.isComposing)queueCharacterInput(e.target.form);return;}
 if(e.target.matches('[data-form="translation"] textarea')){invalidateTranslation();translationDraft.text=e.target.value;syncTranslation();}
});
document.addEventListener('compositionstart',e=>{if(e.target.matches('[data-form="lab-answer"] .answer-input'))composingCharacterInputs.add(e.target);});
document.addEventListener('compositionend',e=>{if(e.target.matches('[data-form="lab-answer"] .answer-input')){composingCharacterInputs.delete(e.target);queueCharacterInput(e.target.form);}});
document.addEventListener('keydown', e => {
  if(e.key==='Enter' && e.target.matches('[data-form="lab-answer"] .answer-input')){if(e.isComposing||e.keyCode===229||composingCharacterInputs.has(e.target))return;e.preventDefault();if(!e.repeat)queueCharacterInput(e.target.form,true);return;}
  if (e.isComposing || e.ctrlKey || e.altKey || e.metaKey || e.target.matches('input,textarea,select') || state.session?.feedback) return;
  if (/^[1-4]$/.test(e.key)) {
    const radio = document.querySelectorAll('.choices input')[Number(e.key)-1];
    if (radio && !radio.disabled) { radio.checked = true; radio.focus(); }
  }
});
document.addEventListener('submit', async e => {
  const form = e.target;
  if(form.dataset.form==='reminder-settings'){
   e.preventDefault();if(busy)return;const data=new FormData(form),time=String(data.get('time')||'');if(!validReminderTime(time))return;const next=structuredClone(state);Object.assign(next.reminder,{time,enabled:data.get('enabled')==='on',lastFired:next.reminder.time===time?next.reminder.lastFired:null});if(await commit(next))toast(T('Saat kaydedildi. Kapalıyken alarm için takvim seçeneğini kullan.','Time saved. Use the calendar option for reminders when closed.'));return;
  }
  if(form.dataset.form==='study-search'){e.preventDefault();if(busy)return;if(await commit(selectStudyConfig(state,form.dataset.kind,{search:String(new FormData(form).get('search')||'').trim()})))$('#study-search')?.focus({preventScroll:true});return;}
  if(form.dataset.form==='study-answer'){
   e.preventDefault();if(busy)return;const s=state.learning.session;if(!s||s.phase!=='exercise'||s.feedback||route()!==s.kind)return;
   const answer=String(new FormData(form).get('answer')||'').trim();if(!answer)return;
   const q=getStudyQuestion(s.ids[s.index]),id=crypto.randomUUID();if(!q)return;
   const next=recordAnswer(state,q,answer,new Date(),id,Math.min(600000,Math.round(performance.now()-questionStarted)),s.kind);next.learning.session.feedback=id;next.learning.session.eventIds.push(id);next.events.at(-1).readingHintShown=!!state.settings.questionReadings||!!s.readingHintIds?.includes(q.id);next.events.at(-1).pronunciationHintRequested=!!s.pronunciationHintIds?.includes(q.id);
   if(await commit(next))$('.study-session .feedback')?.focus({preventScroll:true});return;
  }
  if(form.dataset.form==='lab-answer' && form.dataset.questionId){e.preventDefault();queueCharacterInput(form,true);return;}
  if(form.dataset.form==='translation'){e.preventDefault();await performTranslation(form);return;}
  if(['lab-answer','quote-answer'].includes(form.dataset.form)){e.preventDefault();await answerNewExercise(form,form.dataset.form);return;}
  if(form.id==='custom-quote-form'){
    e.preventDefault();if(busy)return;
    try{const quote=createCustomQuote(Object.fromEntries(new FormData(form)),crypto.randomUUID()),next=structuredClone(state);next.anime.customQuotes.push(quote);next.anime.activeId=quote.id;next.anime.level='all';next.anime.series='all';next.anime.practice=null;if(await commit(next,false)){$('#dialog').close();navigate('anime');}}
    catch{$('#quote-validation').textContent=T('Boşlukta sorulacak parça repliğin içinde bulunmalı. Kaynak eklediysen geçerli bir YouTube video bağlantısı kullan.','The hidden part must occur in the line. Use a valid YouTube video link if you add a source.');}return;
  }
  if (!['answer-form','settings-form','setup-form','report-form'].includes(form.id)) return;
  e.preventDefault();
  if (busy) return;
  const data = new FormData(form);
  if (form.id === 'answer-form') {
    if (state.session?.feedback) return;
    const answer = String(data.get('answer') || '').trim();
    if (!answer) return;
    const q = currentQuestion(state.session), id = crypto.randomUUID();
    const next = recordAnswer(state, q, answer, new Date(), id, Math.min(600000, Math.round(performance.now() - questionStarted)), state.session.mode);
    next.session.feedback = id; next.session.eventIds.push(id); next.events.at(-1).readingHintShown=!!state.settings.questionReadings||!!state.session.readingHintIds?.includes(q.id);next.events.at(-1).pronunciationHintRequested=!!state.session.pronunciationHintIds?.includes(q.id);
    if (await commit(next)) { $('.feedback')?.setAttribute('tabindex','-1'); $('.feedback')?.focus(); }
  } else if (form.id === 'settings-form' || form.id === 'setup-form') {
    const timezone = String(data.get('timezone')).trim();
    try { new Intl.DateTimeFormat('en', { timeZone: timezone }).format(); } catch { $('#settings-validation').textContent = T('Geçerli bir saat dilimi yaz. Örnek: Europe/Istanbul', 'Enter a valid time zone, e.g. Europe/Istanbul'); return; }
    const next = structuredClone(state);
    Object.assign(next.settings, { goal: data.get('goal'), level: data.get('level'), dailyMinutes: Number(data.get('dailyMinutes')), timezone, onboarded: true });
    if (await commit(next)) { if ($('#dialog').open) $('#dialog').close(); toast(T('Tercihlerin kaydedildi.', 'Preferences saved.')); }
  } else {
    const next = structuredClone(state);
    next.issues.push({ id: crypto.randomUUID(), questionId: form.dataset.questionId, contentVersion: getQuestion(form.dataset.questionId)?.version || CONTENT_VERSION, description: String(data.get('description')).trim(), createdAt: new Date().toISOString(), status: 'local-only' });
    if (!next.issues.at(-1).description) return;
    if (await commit(next)) { $('#dialog').close(); toast(T('Notun bu tarayıcıya kaydedildi.', 'Your note was saved in this browser.')); }
  }
});
window.addEventListener('hashchange', () => { stopAudio(); render(); focusHeading(); });
window.addEventListener('pagehide', stopAudio);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAudio(); else if (!state.session || state.session.phase !== 'exercise') render(); });
if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', updateAudioStatus);
let reminding=false;
async function fireStudyReminder(test=false){
 const title=T('Yomu · Japonca zamanı','Yomu · Time for Japanese'),body=T('Küçük bir pratik için çalışma alanını aç.','Open your study space for a little practice.');
 let shown=false;try{shown=await showReminderNotification(title,body);}catch{}
 toast(test?(shown?T('Deneme bildirimi gönderildi.','Test notification displayed.'):T('Deneme hatırlatması: Japonca çalışma zamanı. Sistem bildirimi için önce izin ver.','Test reminder: time for Japanese. Enable permission for system notifications.')):body);
}
async function checkStudyReminder(){
 if(!state||busy||reminding||document.visibilityState!=='visible')return;const day=reminderDue(state.reminder);if(!day)return;reminding=true;
 try{const next=structuredClone(state);next.reminder.lastFired=day;if(await commit(next,false))await fireStudyReminder();}finally{reminding=false;}
}
setInterval(()=>void checkStudyReminder(),15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void checkStudyReminder();});
try { state = await openStore(); render(); void checkStudyReminder(); }
catch {
  state = freshState();
  $('#app').innerHTML = `<main class="fatal"><h1>${T('Yerel kayıt alanı açılamadı.', 'Local storage could not be opened.')}</h1><p>${T('Bu prototip cevaplarını güvenle kaydedebilmek için IndexedDB gerektirir. Tarayıcı ayarlarını kontrol edip sayfayı yenile.', 'This prototype needs IndexedDB to save your answers. Check browser settings and reload.')}</p><button class="btn primary" data-action="reload">${T('Yenile', 'Reload')}</button></main>`;
}
