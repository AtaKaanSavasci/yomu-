export const PERSONAL_LIMITS={decks:50,words:2000,importRows:1000,csvBytes:1000000};
export const defaultPersonal=()=>({decks:[],words:[],selectedDeckId:'all',selectedWordId:'',search:'',mode:'meaning',showReading:true,session:null});
export class PersonalError extends Error{constructor(code,field=''){super(code);this.name='PersonalError';this.code=code;this.field=field;}}
const fail=(code,field)=>{throw new PersonalError(code,field);};
const clean=(value,max,field,{required=false,multiline=false}={})=>{const text=String(value??'').normalize('NFKC').trim();if(required&&!text)fail('required',field);if(text.length>max)fail('too-long',field);if((multiline?/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u:/[\u0000-\u001F\u007F]/u).test(text))fail('control-character',field);return text;};
const sameName=value=>String(value).normalize('NFKC').trim().toLocaleLowerCase('tr-TR');
const dateString=value=>new Date(value??new Date()).toISOString();
const own=state=>state.personal||defaultPersonal();
const copy=state=>{const next=structuredClone(state);next.personal={...defaultPersonal(),...next.personal};return next;};
const active=word=>!word.deletedAt;
const readingAnswers=reading=>[...new Set([reading,reading.replace(/[ァ-ヶ]/gu,c=>String.fromCharCode(c.charCodeAt(0)-0x60))])];
const identity=(deckId,written,reading)=>JSON.stringify([deckId,sameName(written),reading.normalize('NFKC').replace(/\s+/gu,'')]);
export function validatePersonalWord(value){
 const written=clean(value.written,80,'written',{required:true}),reading=clean(value.reading,150,'reading',{required:true});
 if(!/^[\p{Script=Hiragana}\p{Script=Katakana}ー・\s]+$/u.test(reading))fail('kana-required','reading');
 const meaning={tr:clean(value.meaning?.tr??value.tr,200,'tr',{required:true}),en:clean(value.meaning?.en??value.en,200,'en')};
 const rawTags=Array.isArray(value.tags)?value.tags:String(value.tags||'').split(/[|,;]/u);
 const tags=[...new Set(rawTags.map(tag=>clean(tag,40,'tags')).filter(Boolean))];if(tags.length>12)fail('too-many-tags','tags');
 const level=value.level||'unassigned';if(!['unassigned','N5','N4','N3','N2','N1'].includes(level))fail('invalid-level','level');
 return {written,reading,meaning,notes:clean(value.notes,1000,'notes',{multiline:true}),example:clean(value.example,300,'example',{multiline:true}),tags,level};
}
export function createPersonalDeck(state,name,{id=crypto.randomUUID(),now}={}){
 const next=copy(state),p=next.personal,title=clean(name,80,'deck',{required:true});
 if(p.decks.length>=PERSONAL_LIMITS.decks)fail('deck-limit','deck');if(p.decks.some(deck=>sameName(deck.name)===sameName(title)))fail('duplicate-deck','deck');
 if(p.decks.some(deck=>deck.id===id))fail('duplicate-id','deck');const stamp=dateString(now);
 p.decks.push({id,name:title,createdAt:stamp,updatedAt:stamp});p.selectedDeckId=id;p.session=null;return next;
}
export function renamePersonalDeck(state,id,name,{now}={}){
 const next=copy(state),p=next.personal,deck=p.decks.find(d=>d.id===id);if(!deck)fail('missing-deck','deck');
 const title=clean(name,80,'deck',{required:true});if(p.decks.some(d=>d.id!==id&&sameName(d.name)===sameName(title)))fail('duplicate-deck','deck');
 deck.name=title;deck.updatedAt=dateString(now);return next;
}
export function upsertPersonalWord(state,draft,{id=crypto.randomUUID(),now}={}){
 const next=copy(state),p=next.personal,values=validatePersonalWord(draft),deckId=String(draft.deckId||'');
 if(!p.decks.some(deck=>deck.id===deckId))fail('missing-deck','deck');
 const previous=draft.id?p.words.find(word=>word.id===draft.id&&active(word)):null;if(draft.id&&!previous)fail('missing-word','written');
 if(!previous&&p.words.length>=PERSONAL_LIMITS.words)fail('word-limit','written');
 const wordId=previous?.id||id;if(p.words.some(word=>word.id!==previous?.id&&word.id===wordId))fail('duplicate-id','written');
 if(p.words.some(word=>active(word)&&word.id!==wordId&&identity(word.deckId,word.written,word.reading)===identity(deckId,values.written,values.reading)))fail('duplicate-word','written');
 const stamp=dateString(now),word={...values,id:wordId,deckId,revision:(previous?.revision||0)+1,createdAt:previous?.createdAt||stamp,updatedAt:stamp,editorReviewed:false};
 const changed=previous&&JSON.stringify([previous.written,previous.reading,previous.meaning])!==JSON.stringify([word.written,word.reading,word.meaning]);
 if(previous)p.words[p.words.indexOf(previous)]=word;else p.words.push(word);
 if(changed)for(const card of Object.values(next.skillStates||{}))if(card.itemId===`personal-${wordId}`){card.step=-1;card.dueAt=stamp;card.source='personal-edit';}
 p.selectedDeckId=deckId;p.selectedWordId=wordId;p.search='';p.session=null;return next;
}
export function removePersonalWord(state,id,{now}={}){
 const next=copy(state),word=next.personal.words.find(w=>w.id===id&&active(w));if(!word)fail('missing-word','written');word.deletedAt=dateString(now);next.personal.session=null;
 for(const card of Object.values(next.skillStates||{}))if(card.itemId===`personal-${id}`){card.suspendedBeforePersonalRemoval=!!card.suspended;card.removedByPersonal=true;card.suspended=true;}
 return next;
}
export function restorePersonalWord(state,id){
 const next=copy(state),p=next.personal,word=p.words.find(w=>w.id===id&&w.deletedAt);if(!word)fail('missing-word','written');
 if(p.words.some(other=>active(other)&&identity(other.deckId,other.written,other.reading)===identity(word.deckId,word.written,word.reading)))fail('duplicate-word','written');
 delete word.deletedAt;
 for(const card of Object.values(next.skillStates||{}))if(card.itemId===`personal-${id}`&&card.removedByPersonal){card.suspended=!!card.suspendedBeforePersonalRemoval;delete card.removedByPersonal;delete card.suspendedBeforePersonalRemoval;}
 return next;
}
export function personalWordPool(state){return own(state).words.filter(active).map(word=>({...word,sourceType:'personal',itemId:`personal-${word.id}`,meaning:{tr:word.meaning.tr,en:word.meaning.en||word.meaning.tr},englishFallback:!word.meaning.en,version:`personal-${word.id}-r${word.revision}`}));}
export function filteredPersonalWords(state){const p=own(state),query=String(p.search||'').normalize('NFKC').trim().toLocaleLowerCase('tr-TR');return personalWordPool(state).filter(word=>(p.selectedDeckId==='all'||word.deckId===p.selectedDeckId)&&(!query||JSON.stringify([word.written,word.reading,word.meaning,word.notes,word.tags,word.example]).toLocaleLowerCase('tr-TR').includes(query)));}
export function getPersonalQuestion(id,state){
 const match=/^personal:([a-z0-9-]{3,80}):(meaning|reading|writing)$/.exec(id);if(!match)return null;
 const [,wordId,mode]=match,word=own(state).words.find(w=>w.id===wordId&&active(w));if(!word)return null;
 const kana=readingAnswers(word.reading),written=[...new Set([word.written,...kana])],fallback=!word.meaning.en;
 return {id,itemId:`personal-${word.id}`,version:`personal-${word.id}-r${word.revision}`,sourceType:'personal',personalWordId:word.id,personalDeckId:word.deckId,editorReviewed:false,responseType:'typed',skill:mode,word:{written:word.written,reading:word.reading},context:mode==='writing'?word.reading:word.written,
  prompt:mode==='meaning'?{tr:'Bu kelimenin anlamını kendi notundaki gibi yaz.',en:fallback?'Type the meaning from your Turkish note (no English meaning was provided).':'Type the meaning from your own note.'}:mode==='reading'?{tr:'Okunuşunu kana ile yaz.',en:'Type the reading in kana.'}:{tr:`“${word.meaning.tr}” kelimesini Japonca yaz.`,en:`Write the Japanese word for “${word.meaning.en||word.meaning.tr}”.${fallback?' Your Turkish meaning is shown.':''}`},
  answers:mode==='meaning'?{tr:[word.meaning.tr],en:[word.meaning.en||word.meaning.tr]}:{tr:mode==='reading'?kana:written,en:mode==='reading'?kana:written},
  explanation:{tr:`${word.written} → ${word.reading} · ${word.meaning.tr} — Kendi notun; editör doğrulaması yok.`,en:`${word.written} → ${word.reading} · ${word.meaning.en||word.meaning.tr} — Your own note; not editor reviewed.${fallback?' No English meaning was provided; your Turkish note is shown.':''}`},englishFallback:fallback};
}
export function createPersonalSession(state,{mode=own(state).mode,random=Math.random,id=crypto.randomUUID()}={}){
 if(!['meaning','reading','writing'].includes(mode))fail('invalid-mode','mode');
 const questions=filteredPersonalWords(state).map(word=>getPersonalQuestion(`personal:${word.id}:${mode}`,state));
 for(let i=questions.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[questions[i],questions[j]]=[questions[j],questions[i]];}
 if(!questions.length)return null;const snapshot=structuredClone(questions.slice(0,10));
 return {id,kind:'personal',ids:snapshot.map(q=>q.id),questions:snapshot,index:0,eventIds:[],feedback:null,phase:'exercise',readingHintIds:[],pronunciationHintIds:[],config:{deckId:own(state).selectedDeckId,search:own(state).search,mode}};
}
export function savePersonalForReview(state,wordId,{now}={}){
 const next=copy(state);for(const mode of ['meaning','reading']){const q=getPersonalQuestion(`personal:${wordId}:${mode}`,next);if(!q)fail('missing-word','written');const key=`${q.itemId}:${q.skill}`;if(!next.skillStates[key])next.skillStates[key]={itemId:q.itemId,skill:q.skill,questionId:q.id,dueAt:dateString(now),step:-1,attempts:0,correct:0,suspended:false,source:'saved-personal'};}return next;
}
const headerAliases={written:'written',japonca:'written',kelime:'written',reading:'reading',okunus:'reading',kana:'reading',tr:'tr',turkce:'tr',meaning:'tr',en:'en',ingilizce:'en',notes:'notes',not:'notes',example:'example',ornek:'example',tags:'tags',etiketler:'tags',deck:'deck',deste:'deck',level:'level',duzey:'level'};
const headerKey=value=>String(value).normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().trim();
function parseRows(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>PERSONAL_LIMITS.csvBytes)fail('csv-size');text=text.replace(/^\uFEFF/u,'');
 let quotes=false,commas=0,semicolons=0;for(const c of text){if(c==='"')quotes=!quotes;else if(!quotes&&(c==='\r'||c==='\n'))break;else if(!quotes&&c===',')commas++;else if(!quotes&&c===';')semicolons++;}
 const delimiter=semicolons>commas?';':',',rows=[];let row=[],field='',quoted=false,closed=false,line=1,start=1;
 const finishField=()=>{row.push(field);field='';closed=false;};
 const finishRow=()=>{finishField();if(row.some(value=>value.trim()))rows.push({row:start,values:row});row=[];if(rows.length>PERSONAL_LIMITS.importRows+1)fail('csv-row-limit');};
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else{field+=c;if(c==='\n')line++;}if(field.length>4000)fail('csv-field-limit');continue;}
  if(c==='"'){if(field.trim()||closed)fail('csv-quotes');field='';quoted=true;}
  else if(c===delimiter)finishField();
  else if(c==='\r'||c==='\n'){finishRow();if(c==='\r'&&text[i+1]==='\n')i++;line++;start=line;}
  else if(closed){if(!/\s/u.test(c))fail('csv-quotes');}
  else field+=c;
 }
 if(quoted)fail('csv-quotes');if(field||row.length||closed)finishRow();return{rows,delimiter};
}
export function preparePersonalImport(text,state,{deckId=own(state).selectedDeckId}={}){
 const result={rows:[],errors:[],delimiter:',',count:0};let parsed;
 try{parsed=parseRows(text);result.delimiter=parsed.delimiter;}catch(error){result.errors.push({row:0,code:error.code||'csv-invalid',field:error.field||''});return result;}
 if(!parsed.rows.length){result.errors.push({row:0,code:'csv-empty',field:''});return result;}
 const header=parsed.rows[0].values.map(value=>headerAliases[headerKey(value)]||'');
 if(header.some(key=>!key)||new Set(header).size!==header.length||!['written','reading','tr'].every(key=>header.includes(key))){result.errors.push({row:parsed.rows[0].row,code:'csv-header',field:''});return result;}
 const p=own(state),target=p.decks.find(deck=>deck.id===deckId),seen=new Set(p.words.filter(active).map(word=>identity(sameName(p.decks.find(d=>d.id===word.deckId)?.name||''),word.written,word.reading)));
 for(const record of parsed.rows.slice(1)){
  if(record.values.length!==header.length){result.errors.push({row:record.row,code:'csv-columns',field:''});continue;}
  const draft=Object.fromEntries(header.map((key,index)=>[key,record.values[index]]));
  try{const values=validatePersonalWord(draft),deckName=clean(draft.deck||target?.name||'İçe aktarılanlar',80,'deck',{required:true}),key=identity(sameName(deckName),values.written,values.reading);if(seen.has(key))fail('duplicate-word','written');seen.add(key);result.rows.push({...values,deckName,row:record.row});}
  catch(error){result.errors.push({row:record.row,code:error.code||'csv-invalid',field:error.field||''});}
 }
 result.count=result.rows.length;
 if(!parsed.rows.slice(1).length)result.errors.push({row:0,code:'csv-empty',field:''});
 const newNames=new Set(result.rows.map(row=>sameName(row.deckName)).filter(name=>!p.decks.some(deck=>sameName(deck.name)===name)));
 if(p.decks.length+newNames.size>PERSONAL_LIMITS.decks)result.errors.push({row:0,code:'deck-limit',field:'deck'});
 if(p.words.length+result.rows.length>PERSONAL_LIMITS.words)result.errors.push({row:0,code:'word-limit',field:'written'});
 return result;
}
export function applyPersonalImport(state,preview,{now,idFactory=()=>crypto.randomUUID()}={}){
 if(!preview||preview.errors?.length||!preview.rows?.length||preview.rows.length>PERSONAL_LIMITS.importRows)fail('csv-invalid');let next=copy(state);
 for(const row of preview.rows){let deck=next.personal.decks.find(d=>sameName(d.name)===sameName(row.deckName));if(!deck){next=createPersonalDeck(next,row.deckName,{id:idFactory(),now});deck=next.personal.decks.at(-1);}next=upsertPersonalWord(next,{...row,deckId:deck.id},{id:idFactory(),now});}
 return next;
}
const csvValue=value=>{let text=String(value??'');if(/^[\s]*[=+\-@]/u.test(text))text="'"+text;return `"${text.replace(/"/gu,'""')}"`;};
export function personalCSV(state,{template=false}={}){
 const header=['written','reading','tr','en','deck','tags','notes','example','level'],p=own(state),rows=template?[['学校','がっこう','okul','school','Genki 1','Genki 1|Bölüm 1','','学校へ行きます。','N5']]:filteredPersonalWords(state).map(word=>[word.written,word.reading,word.meaning.tr,p.words.find(w=>w.id===word.id)?.meaning.en||'',p.decks.find(deck=>deck.id===word.deckId)?.name||'',word.tags.join('|'),word.notes,word.example,word.level]);
 return '\uFEFF'+[header.map(csvValue).join(','),...rows.map(row=>row.map(csvValue).join(','))].join('\r\n')+'\r\n';
}
