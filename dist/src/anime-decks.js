import {animeQuotes,ANIME_VERSION} from './anime.js';
import {defaultPersonal,createPersonalDeck,upsertPersonalWord,PersonalError,PERSONAL_LIMITS} from './personal-data.js';

export const ANIME_GLOSSARY_VERSION='anime-glossary-2026-11-05.1';
const dictionary=(slug)=>({label:'小学館 デジタル大辞泉 · Kotobank',url:`https://kotobank.jp/word/${slug}`});
// Small, source-checked study glosses. No generated readings or automatic segmentation.
// Japanese dictionary prose is not copied; translations and context notes are study aids.
const entries=[
 {id:'vinland-ore',quoteId:'vinland-enemies',surface:'俺',written:'俺',reading:'おれ',meaning:{tr:'ben (samimi, çoğunlukla erkek konuşması)',en:'I (informal, predominantly masculine)'},note:{tr:'Konuşanın kendisini belirtir. Resmî veya kibar bir “ben” biçimi değildir.',en:'Refers to the speaker. It is not a formal or polite form of “I”.'},source:dictionary('%E4%BF%BA-455493')},
 {id:'vinland-teki',quoteId:'vinland-enemies',surface:'敵',written:'敵',reading:'てき',meaning:{tr:'düşman',en:'enemy'},note:{tr:'Bu replikte “düşman” anlamında, てき okunur. 敵 başka bağlamlarda かたき de okunabilir; kanjinin tek bir okunuşu olduğu anlamına gelmez.',en:'In this line, it means “enemy” and is read てき. 敵 can also be read かたき in other contexts; this is not a universal kanji reading.'},source:dictionary('%E6%95%B5-463355')},
 {id:'naruto-jibun',quoteId:'naruto-nindo',surface:'自分',written:'自分',reading:'じぶん',meaning:{tr:'kendi; kendisi',en:'oneself; own self'},note:{tr:'Buradaki 自分の, “kendi …” anlamını verir: kendi sözleri. Kime gönderme yaptığı bağlama bağlıdır.',en:'Here 自分の means “one’s own”: his own words. Its reference depends on the context.'},source:dictionary('%E8%87%AA%E5%88%86-523303')},
 {id:'naruto-kotoba',quoteId:'naruto-nindo',surface:'言葉',written:'言葉',reading:'ことば',meaning:{tr:'söz; kelime',en:'word; words'},note:{tr:'Bu bağlamda kişinin söylediği sözleri anlatır. Tüm repliğin çevirisi, kelimenin tek başına anlamından daha geniştir.',en:'Here it refers to the words someone has said. The translation of the whole line is broader than this word’s gloss.'},source:dictionary('%E8%A8%80%E8%91%89-490828')},
 {id:'bleach-bankai',quoteId:'bleach-bankai',surface:'卍解',written:'卍解',reading:'ばんかい',meaning:{tr:'Bankai (Bleach’e özgü ikinci aşama kılıç salımı)',en:'Bankai (Bleach-specific second-stage sword release)'},fictional:true,note:{tr:'Bleach’in kurgu terimidir; gündelik sözlük kelimesi veya kanji parçalarının genel çevirisi değildir. Resmî seri sözlüğü, okunuşu ve serideki ikinci aşama açığa çıkarmayı açıklar.',en:'A fictional Bleach term, not an everyday word or a general translation of its kanji parts. The official series glossary gives this reading and describes the second release stage.'},source:{label:'Studio Pierrot · BLEACH 公式用語集',url:'https://pierrot.jp/title/bleach/keyword_ha.html'}},
 {id:'jjk-kakkotsukeru',quoteId:'jjk-showoff',surface:'カッコつけ',written:'カッコつける',reading:'かっこつける',meaning:{tr:'havalı görünmeye çalışmak; gösteriş yapmak',en:'try to look cool; show off'},note:{tr:'Kart sözlük biçimi カッコつける’yi kaydeder. Replikte bu fiil カッコつけさせて biçiminin parçasıdır; tıklanan カッコつけ tek başına tam fiil değildir. Sözlükte かっこ付ける yazımıyla bulunur.',en:'The card saves the dictionary form カッコつける. In the line, this verb is part of カッコつけさせて; the clickable カッコつけ is not a complete verb by itself. The dictionary lists the spelling かっこ付ける.'},source:dictionary('%E3%81%8B%E3%81%A4%E3%81%93%E4%BB%98%E3%81%91%E3%82%8B-2121628')}
];
const expectedText=Object.fromEntries(animeQuotes.map(quote=>[quote.id,quote.text]));
const safeURL=value=>{try{const url=new URL(String(value||''));return url.protocol==='https:'&&!url.username&&!url.password&&url.href.length<=500?url.href:'';}catch{return '';}};
const safeId=value=>String(value||'').replace(/[^a-zA-Z0-9_-]/gu,'-').slice(0,90);
const knownEntries=quote=>quote&&expectedText[quote.id]===quote.text?entries.filter(entry=>entry.quoteId===quote.id):[];
export function animeGlossaryFor(quote){return structuredClone(knownEntries(quote));}

export function animeQuoteTokens(quote,{T,esc}){
 const text=String(quote?.text||''),tokens=knownEntries(quote).map(entry=>({...entry,start:text.indexOf(entry.surface)})).filter(entry=>entry.start>=0).sort((a,b)=>a.start-b.start);
 let cursor=0,html='';
 for(const token of tokens){if(token.start<cursor)continue;html+=esc(text.slice(cursor,token.start));html+=`<button type="button" class="anime-deck-token" data-action="anime-deck-select" data-quote-id="${esc(quote.id)}" data-token-id="${esc(token.id)}" aria-label="${esc(T(`${token.surface} kelimesini desteye eklemek için incele`,`Preview ${token.surface} for your deck`))}" aria-controls="anime-deck-panel-${safeId(quote.id)}">${esc(token.surface)}</button>`;cursor=token.start+token.surface.length;}
 return html+esc(text.slice(cursor));
}

const allQuotes=state=>[...animeQuotes,...(state.anime?.customQuotes||[])];
const displayedQuote=state=>{const a=state.anime||{},filtered=allQuotes(state).filter(quote=>(!a.level||a.level==='all'||quote.level===a.level)&&(!a.series||a.series==='all'||quote.series===a.series));return filtered.find(quote=>quote.id===a.activeId)||filtered[0];};
const ownPersonal=state=>({...defaultPersonal(),...state.personal});
const duplicateIdentity=(written,reading)=>JSON.stringify([String(written).normalize('NFKC').trim().toLocaleLowerCase('tr-TR'),String(reading).normalize('NFKC').trim().replace(/\s+/gu,'')]);
const hasDuplicate=(state,draft)=>ownPersonal(state).words.some(word=>!word.deletedAt&&word.deckId===draft.deckId&&duplicateIdentity(word.written,word.reading)===duplicateIdentity(draft.written,draft.reading));

export function createAnimeDeckFeature({getState,commit,ui,toast=()=>{},isBusy=()=>false,render=()=>{}}){
 let selection=null,draft=null,error=null,saving=false,saved=null;
 const repaint=()=>render();
 const quoteFor=id=>allQuotes(getState()).find(quote=>quote.id===id);
 const validSelection=()=>selection&&displayedQuote(getState())?.id===selection.quote.id;
 const readForm=form=>{const data=new FormData(form);return Object.fromEntries(['written','reading','tr','en','deckId','newDeckName','note'].map(key=>[key,String(data.get(key)||'')]));};
 const errorText=issue=>{
  const {T}=ui(),messages={required:T('Japonca kelime, kana okunuşu ve Türkçe anlamı doldur.','Fill in the Japanese word, kana reading and Turkish meaning.'),'kana-required':T('Okunuşu hiragana veya katakana ile kendin yaz.','Enter the reading yourself in hiragana or katakana.'),'missing-deck':T('Bir deste seç veya yeni deste adı yaz.','Choose a deck or enter a new deck name.'),'duplicate-deck':T('Bu adla bir deste zaten var. Listeden o desteyi seç.','A deck with this name already exists. Select it from the list.'),'duplicate-word':T('Bu kelime ve okunuş seçtiğin destede zaten var. Var olan kart değiştirilmedi.','This word and reading are already in the selected deck. The existing card was kept.'),'deck-limit':T(`En fazla ${PERSONAL_LIMITS.decks} deste oluşturabilirsin.`,`You can create up to ${PERSONAL_LIMITS.decks} decks.`),'word-limit':T(`Kaldırılanlar dahil ${PERSONAL_LIMITS.words} kelime sınırına ulaştın.`,`You reached the limit of ${PERSONAL_LIMITS.words} words, including removed words.`),'too-long':T('Bir alan çok uzun. Kelime, okunuş, anlam veya notu kısalt.','A field is too long. Shorten the word, reading, meaning or note.'),'not-in-quote':T('Japonca alanına bu replikte geçen bir kelime veya kısa parça yaz.','Enter a word or short fragment that occurs in this line.'),'stale-capture':T('Replik veya önizleme değişti. Kelimeyi yeniden seç.','The line or preview changed. Select the word again.'),'save-failed':T('Kelime kaydedilemedi. Bilgilerin burada duruyor; yeniden deneyebilirsin.','The word was not saved. Your details are still here; you can retry.')};
  if(issue?.code==='required'&&issue?.field==='deck')return T('Yeni deste için bir ad yaz.','Enter a name for the new deck.');
  return messages[issue?.code]||T('Kelime eklenemedi. Alanları kontrol et.','The word could not be added. Check the fields.');
 };
 const sourceLink=(url,label)=>{const href=safeURL(url);return href?`<a href="${ui().esc(href)}" target="_blank" rel="noopener noreferrer">${ui().esc(label)} <span aria-hidden="true">↗</span></a>`:'';};
 function begin(quote,entry){
  const p=ownPersonal(getState()),deckId=p.decks.find(deck=>deck.id===p.selectedDeckId)?.id||p.decks[0]?.id||'new';
  selection={id:crypto.randomUUID(),quote:structuredClone(quote),entry:entry?structuredClone(entry):null};
  draft={written:entry?.written||'',reading:entry?.reading||'',tr:entry?.meaning.tr||'',en:entry?.meaning.en||'',deckId,newDeckName:'',note:''};error=null;saved=null;
 }
 function panel(quoteId){
  const quote=quoteFor(quoteId);if(!quote)return '';const {T,esc}=ui(),p=ownPersonal(getState()),tokens=knownEntries(quote),id=`anime-deck-panel-${safeId(quoteId)}`;
  if(!selection||selection.quote.id!==quoteId){return `<section id="${id}" class="anime-deck-intro" aria-label="${T('Replikten kelime topla','Collect words from this line')}"><p>${tokens.length?T('Altı çizili kelimelere dokun: okunuşunu ve anlamını incele, sonra kendi destene ekle.','Tap an underlined word to check its reading and meaning, then add it to your deck.'):T('Bu kişisel replik için hazır sözlük notu yok. Bir kelimeyi kendi okunuşun ve anlam notunla ekleyebilirsin.','There is no prepared glossary for this personal line. Add a word with your own reading and meaning note.')}</p>${!tokens.length?`<button type="button" class="btn secondary" data-action="anime-deck-custom" data-quote-id="${esc(quoteId)}">+ ${T('Kendi notumla kelime ekle','Add a word with my note')}</button>`:''}${saved?.quoteId===quoteId?`<p class="anime-deck-saved" role="status">${esc(saved.message)} <a href="#personal">${T('Destelerime git','Go to my decks')} →</a></p>`:''}</section>`;}
  const entry=selection.entry,values=draft,original=selection.quote,duplicate=values.deckId!=='new'&&hasDuplicate(getState(),values),disabled=saving||isBusy();
  const target=p.decks.find(deck=>deck.id===values.deckId),canCreate=p.decks.length<PERSONAL_LIMITS.decks;
  return `<section id="${id}" class="anime-deck-panel" aria-labelledby="anime-deck-title"><div class="anime-deck-heading"><div><p class="eyebrow">${T('REPLİKTEN DESTENE','FROM THE LINE TO YOUR DECK')}</p><h3 id="anime-deck-title" tabindex="-1">${entry?T('Kelime kartı önizlemesi','Word card preview'):T('Kendi kelime notun','Your word note')}</h3></div><button type="button" class="anime-deck-close" data-action="anime-deck-cancel" aria-label="${T('Kelime önizlemesini kapat','Close word preview')}">×</button></div>
   ${error?`<p class="anime-deck-error" role="alert">${esc(errorText(error))}</p>`:''}
   ${entry?`<div class="anime-deck-word"><strong lang="ja">${esc(entry.written)}</strong><span lang="ja">${esc(entry.reading)}</span></div><dl class="anime-deck-meanings"><div><dt>${T('Türkçe','Turkish')}</dt><dd>${esc(entry.meaning.tr)}</dd></div><div><dt>${T('İngilizce','English')}</dt><dd>${esc(entry.meaning.en)}</dd></div></dl>${entry.fictional?`<span class="anime-deck-fictional">${T('Kurgu terimi · Bleach','Fictional term · Bleach')}</span>`:''}<p class="anime-deck-context">${esc(ui().L(entry.note))}</p>`:`<p class="anime-deck-help">${T('Hazır sözlük verisi yok: okunuş ve anlam tahmin edilmeyecek. Replikte geçen bir parça seçip kendi notunu doldur. Bu içerik kaynak doğrulamasından geçmiş sayılmaz.','No glossary is available: no reading or meaning will be guessed. Choose a fragment from the line and enter your own note. This content is not treated as source-verified.')}</p>`}
   <div class="anime-deck-origin"><span>${T('Replikteki bağlam','Context in the line')} · ${esc(original.series)}</span><p lang="ja">${esc(original.text)}</p><div class="anime-deck-source-links">${sourceLink(original.source,T('Orijinal kaynak','Original source'))}${entry?sourceLink(entry.source.url,entry.source.label):''}</div></div>
   <form data-form="anime-deck-save" data-capture-id="${esc(selection.id)}" data-quote-id="${esc(quoteId)}">
    ${!entry?`<div class="anime-deck-form-grid"><label>${T('Replikteki Japonca kelime / parça','Japanese word / fragment in the line')}<input name="written" lang="ja" required maxlength="80" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(values.written)}"></label><label>${T('Kana okunuşu','Kana reading')}<input name="reading" lang="ja" required maxlength="150" aria-describedby="anime-deck-kana-help" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(values.reading)}"></label><label>${T('Türkçe anlam','Turkish meaning')}<input name="tr" required maxlength="200" value="${esc(values.tr)}"></label><label>${T('İngilizce anlam · isteğe bağlı','English meaning · optional')}<input name="en" maxlength="200" value="${esc(values.en)}"></label></div><p id="anime-deck-kana-help" class="anime-deck-help">${T('Hiragana veya katakana kullan. Boş alanlar otomatik tamamlanmaz.','Use hiragana or katakana. Empty fields are not filled automatically.')}</p>`:''}
    <div class="anime-deck-destination"><label>${T('Hedef deste','Destination deck')}<select name="deckId" data-anime-deck="destination" required>${p.decks.map(deck=>`<option value="${esc(deck.id)}" ${values.deckId===deck.id?'selected':''}>${esc(deck.name)}</option>`).join('')}<option value="new" ${values.deckId==='new'?'selected':''} ${!canCreate?'disabled':''}>+ ${T('Yeni deste oluştur','Create a new deck')}</option></select></label>${values.deckId==='new'?`<label>${T('Yeni deste adı','New deck name')}<input name="newDeckName" required maxlength="80" placeholder="${T('Anime kelimelerim','My anime words')}" value="${esc(values.newDeckName)}"></label>`:''}</div>
    ${duplicate?`<p class="anime-deck-duplicate" role="status">${esc(errorText({code:'duplicate-word'}))} <a href="#personal">${T('Destelerimi aç','Open my decks')} →</a></p>`:''}
    <details class="anime-deck-extra" data-disclosure-key="anime-deck-note-${esc(selection.id)}" ${values.note?'open':''}><summary>${T('Kendi notunu ekle','Add your own note')} · ${T('isteğe bağlı','optional')}</summary><label>${T('Notun','Your note')}<textarea name="note" rows="2" maxlength="250">${esc(values.note)}</textarea></label></details>
    <p class="anime-deck-help">${entry?T('Okunuş ve temel anlam için yukarıdaki kaynak kullanılır. Kayıt kişisel notlarına eklenir; replik, kaynak bağlantıları ve etiketler de saklanır.','The source above supports the reading and core meaning. The card joins your personal notes with the line, source links and tags.'):T('Replik ve kaynak bağlantısı notunla birlikte saklanır. İngilizce anlam boşsa İngilizce arayüzde Türkçe notun gösterilir.','The line and source link are saved with your note. If English is empty, the English interface shows your Turkish note.')} ${T('Kaydetmek alıştırma sonucu veya başarı kaydı oluşturmaz.','Saving does not create an exercise result or a success record.')}</p>
    <div class="anime-deck-actions"><button class="btn primary" type="submit" ${disabled||duplicate||(!canCreate&&values.deckId==='new')?'disabled':''}>${saving?T('Ekleniyor…','Adding…'):T('Desteye eklemeyi onayla','Confirm adding to deck')}</button><button class="btn secondary" type="button" data-action="anime-deck-cancel" ${disabled?'disabled':''}>${T('Vazgeç','Cancel')}</button></div>${target?`<p class="anime-deck-target">${T('Eklenecek deste','Adding to')}: <strong>${esc(target.name)}</strong></p>`:''}
   </form></section>`;
 }
 async function click(target){
  const action=target.dataset?.action;if(!action?.startsWith('anime-deck-'))return false;if(saving||isBusy())return true;
  if(action==='anime-deck-cancel'){selection=null;draft=null;error=null;repaint();return true;}
  if(!['anime-deck-select','anime-deck-custom'].includes(action))return false;
  const quote=quoteFor(target.dataset.quoteId);if(!quote||displayedQuote(getState())?.id!==quote.id)return true;
  const entry=knownEntries(quote).find(token=>token.id===target.dataset.tokenId);
  if(action==='anime-deck-select'&&!entry)return true;if(action==='anime-deck-custom'&&knownEntries(quote).length)return true;
  begin(quote,action==='anime-deck-select'?entry:null);repaint();const heading=globalThis.document?.querySelector('#anime-deck-title');heading?.focus({preventScroll:true});heading?.closest('.anime-deck-panel')?.scrollIntoView({block:'start'});return true;
 }
 async function change(target){
  if(!target.matches?.('[data-anime-deck="destination"]'))return false;if(saving||isBusy())return true;
  const form=target.closest?.('form');if(!form||form.dataset.captureId!==selection?.id||!validSelection())return true;
  const values=readForm(form);draft={...draft,...values,...(selection.entry?{written:selection.entry.written,reading:selection.entry.reading,tr:selection.entry.meaning.tr,en:selection.entry.meaning.en}:{})};error=null;repaint();return true;
 }
 async function submit(form){
  if(form.dataset?.form!=='anime-deck-save')return false;if(saving||isBusy())return true;
  if(!validSelection()||form.dataset.captureId!==selection.id||form.dataset.quoteId!==selection.quote.id){error={code:'stale-capture'};repaint();return true;}
  const values=readForm(form),snapshot=structuredClone(selection),entry=snapshot.entry;draft={...draft,...values,...(entry?{written:entry.written,reading:entry.reading,tr:entry.meaning.tr,en:entry.meaning.en}:{})};error=null;saving=true;
  try{
   if(draft.note.length>250)throw new PersonalError('too-long','notes');
   if(!entry&&(!draft.written.trim()||!snapshot.quote.text.includes(draft.written.trim())))throw new PersonalError('not-in-quote','written');
   let next=getState(),deckId=draft.deckId;
   if(deckId==='new'){next=createPersonalDeck(next,draft.newDeckName);deckId=next.personal.selectedDeckId;}
   const original=snapshot.quote,sourceUrl=safeURL(original.source),glossarySource=entry?{...entry.source}:null,context=entry?entry.note:null;
   const notes=[entry?`${context.tr}\n${context.en}`:'Kendi notum / My own note — okunuş ve anlam bağımsız doğrulanmadı / reading and meaning not independently verified.',`Anime: ${original.series}`,sourceUrl?`Replik kaynağı / Line source: ${sourceUrl}`:'',glossarySource?`Sözlük / Glossary: ${glossarySource.url}`:'',draft.note.trim()].filter(Boolean).join('\n\n');
   const tags=['Anime',String(original.series).slice(0,40),'Anime alıntısı',...(!entry?['Kullanıcı notu']:[]),...(entry?.fictional?['Kurgu terimi']:[])];
   const word={deckId,written:draft.written,reading:draft.reading,tr:draft.tr,en:draft.en,example:original.text,notes,tags,level:'unassigned'};
   next=upsertPersonalWord(next,word);const savedWord=next.personal.words.find(word=>word.id===next.personal.selectedWordId);
   savedWord.sourceSnapshot={kind:'anime-quote',quoteId:original.id,quoteVersion:original.version||ANIME_VERSION,series:original.series,speaker:original.speaker,text:original.text,sourceUrl,tokenId:entry?.id||null,surface:entry?.surface||draft.written.trim(),written:savedWord.written,reading:savedWord.reading,meaning:{...savedWord.meaning},glossarySource,glossaryVersion:entry?ANIME_GLOSSARY_VERSION:null,verifiedGlossary:!!entry,capturedAt:savedWord.createdAt};
   if(await commit(next,false)){
    const {T}=ui(),deck=next.personal.decks.find(deck=>deck.id===deckId);saved={quoteId:original.id,message:T(`${savedWord.written}, “${deck.name}” destene eklendi.`,`${savedWord.written} was added to “${deck.name}”.`)};selection=null;draft=null;toast(saved.message);
   }else error={code:'save-failed'};
  }catch(issue){error={code:issue.code||'invalid',field:issue.field||''};}
  finally{saving=false;repaint();}
  return true;
 }
 return {panel,click,submit,change};
}
