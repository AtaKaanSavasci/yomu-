import {isKanji,lookupKanji,kanjiSources} from './kanji-info.js';
import {pronunciationControls} from './word-speech.js';
export function kanjiText(text,{esc,T}) {
 return [...String(text)].map(c=>isKanji(c)?`<button type="button" class="kanji-trigger" data-action="kanji-info" data-glyph="${esc(c)}" aria-label="${esc(c)} · ${T('Kanji bilgisi','Kanji information')}">${esc(c)}</button>`:esc(c)).join('');
}
export function wordInfo(question){return question.word||(question.character?.script==='kanji'?{written:question.character.word,reading:question.character.kana}:null);}
export function questionWord(question,event,u,{className='lab-glyph'}={}) {
 const {T,esc}=u,word=wordInfo(question),revealed=!!event;
 const context=revealed&&word&&question.skill==='writing'?word.written:question.context;
 if(!word)return `<div class="${className}" lang="ja">${kanjiText(context,u)}</div>`;
 const visible=revealed||u.showQuestionReadings;
 return `<div class="question-word" data-reading-forced="${revealed}"><div class="${className} ${question.character?.script==='kanji'?'kanji-word':''}" lang="ja">${kanjiText(context,u)}</div><p class="question-reading" lang="ja" ${visible?'':'hidden'}>${context===word.written||context===word.reading?'':`${esc(word.written)}: `}${esc(word.reading)}</p>${revealed?'':`<button type="button" class="reading-hint-button" data-action="reading-hint" aria-pressed="${!!u.showQuestionReadings}">${u.showQuestionReadings?T('Okunuşu gizle','Hide reading'):T('Okunuşu göster','Show reading')}</button>`}${pronunciationControls(word,u,{questionId:question.id,hint:!revealed})}</div>`;
}
export function syncReadingHints(u){
 for(const block of document.querySelectorAll('.question-word')){
  const visible=block.dataset.readingForced==='true'||u.showQuestionReadings;
  block.querySelector('.question-reading').hidden=!visible;
  const button=block.querySelector('.reading-hint-button');if(button){button.setAttribute('aria-pressed',String(!!u.showQuestionReadings));button.textContent=u.showQuestionReadings?u.T('Okunuşu gizle','Hide reading'):u.T('Okunuşu göster','Show reading');}
 }
}
export function kanjiPanel(result,u){
 const {T,esc}=u,d=result.dictionary,s=result.structure;
 const readings=(label,values)=>`<div><h3>${label}</h3><p lang="ja">${values?.length?esc(values.join(' / ')):T('Bu kaynakta kayıt yok.','No entry in this source.')}</p></div>`;
 const positions={left:T('sol','left'),right:T('sağ','right'),top:T('üst','top'),bottom:T('alt','bottom')};
 return `<div class="kanji-panel-heading"><h2 lang="ja">${esc(result.glyph)}</h2><button type="button" data-action="close-kanji" aria-label="${T('Kanji bilgisini kapat','Close kanji information')}">×</button></div>${d?`<h3>${T('Karakter anlamları · kaynak dil: İngilizce','Character meanings · English source')}</h3><p lang="en">${esc(d.meanings.join('; '))}</p>${readings(T('On okunuşları · Çin kökenli','On readings · Chinese-derived'),d.on)}${readings(T('Kun okunuşları · Japonca kökenli','Kun readings · Japanese-derived'),d.kun)}<p class="small muted">${T('Nokta, okurigana sınırını; kısa çizgi, ek kullanımını gösteren sözlük işaretidir. Her okunuş her kelimede kullanılmaz.','Dots mark the okurigana boundary; hyphens indicate affix use. Not every reading applies to every word.')}</p>`:`<p>${T('Sözlük bilgisi alınamadı. Bağlantını kontrol ederek tekrar deneyebilirsin.','Dictionary information could not be loaded. Check your connection and retry.')}</p>`}${s?.components.length?`<h3>${s.complete?T('Yazım bileşenleri','Writing components'):T('İşaretlenmiş yazım parçaları · tam ayrıştırma değil','Labelled writing parts · not a complete decomposition')}</h3><div class="kanji-parts">${s.components.map(c=>`<span><b lang="ja">${esc(c.element)}</b>${c.original?` <small>(${esc(c.original)} ${T('biçimi','form')})</small>`:''}${positions[c.position]?`<small>${positions[c.position]}</small>`:''}${result.componentDefinitions?.[c.original||c.element]?`<small lang="en">${esc(result.componentDefinitions[c.original||c.element].meanings.join('; '))}</small>`:''}</span>`).join('')}</div><p class="small muted">${T('KanjiVG şekil yapısını gösterir; bu liste tek başına tarihsel köken veya okunuş kuralı değildir.','KanjiVG describes written structure; this list alone is not an etymology or a reading rule.')}</p>`:`<p class="small muted">${T('Bu kaynakta gösterilecek bileşen kaydı bulunamadı. Bileşen veya köken tahmin edilmez.','No component entry is available here. Components and etymology are not guessed.')}</p>`}${result.note?`<h3>${T('Kaynaklı oluşum notu','Sourced construction note')}</h3><p>${esc(result.note[T('tr','en')])}</p><a href="${result.note.source}" target="_blank" rel="noopener noreferrer">Kanjipedia ↗</a>`:''}<p class="small muted">${T('Bir karakterin sözlük anlamı, tek başına bağımsız kelime olarak kullanıldığı anlamına gelmez. Kelimenin tamamının okunuşunu ayrıca öğren.','A character’s dictionary meaning does not imply that it is a standalone word. Learn the whole word’s reading separately.')}</p><div class="kanji-source-note">KANJIDIC2 © EDRDG · <a href="${kanjiSources.dictionary}" target="_blank" rel="noopener noreferrer">kanjiapi.dev</a> · <a href="${kanjiSources.dictionaryLicense}" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a><br>KanjiVG © Ulrich Apel · <a href="${kanjiSources.structure}" target="_blank" rel="noopener noreferrer">KanjiVG</a> · <a href="${kanjiSources.structureLicense}" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a><br><a href="#sources">${T('Kaynaklar ve kapsam','Sources and scope')}</a></div>`;
}
export function installKanjiInfo(getUI){
 let panel,anchor,pinned=false,revision=0,openTimer,closeTimer,suppressFocus=false;
 const hide=()=>{revision++;clearTimeout(openTimer);clearTimeout(closeTimer);if(panel)panel.hidden=true;anchor=null;pinned=false;};
 const open=async(button,pin=false)=>{
  clearTimeout(closeTimer);if(panel&&!panel.hidden&&anchor===button){if(pin)pinned=true;return;}
  anchor=button;pinned=pin;const id=++revision,u=getUI();
  if(!panel){panel=document.createElement('aside');panel.id='kanji-info-panel';panel.className='kanji-info-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label',u.T('Kanji bilgisi','Kanji information'));document.body.append(panel);panel.addEventListener('pointerenter',()=>clearTimeout(closeTimer));panel.addEventListener('pointerleave',()=>{if(!pinned)closeTimer=setTimeout(hide,250);});}
  panel.hidden=false;panel.innerHTML=`<p>${u.esc(button.dataset.glyph)} · ${u.T('Kaynaklardan yükleniyor…','Loading sources…')}</p><button data-action="close-kanji">${u.T('Kapat','Close')}</button>`;
  const rect=button.getBoundingClientRect(),top=Math.max(12,Math.min(rect.bottom+8,innerHeight-360));panel.style.left=`${Math.max(12,Math.min(rect.left,innerWidth-Math.min(420,innerWidth-24)-12))}px`;panel.style.top=`${top}px`;panel.style.maxHeight=`${innerHeight-top-12}px`;
  const result=await lookupKanji(button.dataset.glyph).catch(()=>({glyph:button.dataset.glyph}));
  if(id===revision&&anchor===button&&!panel.hidden)panel.innerHTML=kanjiPanel(result,getUI());
 };
 document.addEventListener('pointerover',e=>{const button=e.target.closest?.('.kanji-trigger');if(button&&e.pointerType!=='touch'){clearTimeout(openTimer);openTimer=setTimeout(()=>void open(button),300);}});
 document.addEventListener('pointerout',e=>{if(e.target.closest?.('.kanji-trigger')&&!pinned){clearTimeout(openTimer);closeTimer=setTimeout(()=>{if(!pinned)hide();},250);}});
 const returnFocus=previous=>{suppressFocus=true;previous?.focus();suppressFocus=false;};
 document.addEventListener('focusin',e=>{const button=e.target.closest?.('.kanji-trigger');if(button&&!suppressFocus&&button.matches(':focus-visible'))void open(button);});
 document.addEventListener('click',e=>{const close=e.target.closest?.('[data-action="close-kanji"]');if(close){const previous=anchor;hide();returnFocus(previous);return;}const button=e.target.closest?.('.kanji-trigger');if(button){void open(button,true);return;}if(panel&&!panel.hidden&&!panel.contains(e.target))hide();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden){const previous=anchor;hide();returnFocus(previous);}});
 window.addEventListener('hashchange',hide);window.addEventListener('resize',hide);
 return hide;
}
