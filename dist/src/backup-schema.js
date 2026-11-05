import {isExamSession} from './exam-schema.js';
// Shared validation for backup files and authenticated cloud snapshots.
export const BACKUP_BYTES=8_000_000;
export const SYNC_BYTES=1_800_000;
export class BackupError extends Error{constructor(code,path=''){super(code);this.code=code;this.path=path;}}
const bad=(path)=>{throw new BackupError('INVALID_BACKUP',path);};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const text=(value,path,max=500,required=true)=>{if(typeof value!=='string'||value.length>max||(required&&!value.trim()))bad(path);};
const date=(value,path)=>{if(typeof value!=='string'||!Number.isFinite(Date.parse(value)))bad(path);};
const identifier=(value,path)=>{text(value,path,300);if(!/^[A-Za-z0-9][A-Za-z0-9:_.\/-]*$/.test(value))bad(path);};
function keyedRows(rows,path,max){
 if(!Array.isArray(rows)||rows.length>max)bad(path);const ids=new Set();
 for(const row of rows){if(!object(row))bad(path);identifier(row.id,path+'.id');if(ids.has(row.id))bad(path+'.duplicate-id');ids.add(row.id);}return rows;
}
export function validateBackup(value,{maxBytes=BACKUP_BYTES,cloud=false}={}){
 if(!object(value)||value.application!=='yomu'||!Number.isInteger(value.schemaVersion)||value.schemaVersion<1||value.schemaVersion>3)bad('application/schemaVersion');
 let nodes=0;const walk=(node,depth=0)=>{if(++nodes>250000||depth>25)bad('depth/size');if(typeof node==='string'&&node.length>20000)bad('text-size');if(typeof node==='number'&&!Number.isFinite(node))bad('number');if(node&&typeof node==='object')for(const [key,v] of Object.entries(node)){if(['__proto__','constructor','prototype'].includes(key))bad('unsafe-key');walk(v,depth+1);}};walk(value);
 if(new TextEncoder().encode(JSON.stringify(value)).length>maxBytes)throw new BackupError('BACKUP_TOO_LARGE');
 if(!object(value.settings)||!['tr','en'].includes(value.settings.language))bad('settings.language');
 if(!Number.isFinite(value.settings.dailyMinutes)||value.settings.dailyMinutes<1||value.settings.dailyMinutes>120)bad('settings.dailyMinutes');
 try{new Intl.DateTimeFormat('en',{timeZone:value.settings.timezone}).format();}catch{bad('settings.timezone');}
 if(!['reading','everyday'].includes(value.settings.goal)||!['kana','basic'].includes(value.settings.level))bad('settings.goal/level');
 for(const [key,v] of Object.entries(value.settings))if(!['language','goal','level','dailyMinutes','timezone'].includes(key)&&typeof v!=='boolean')bad('settings.'+key);
 for(const event of keyedRows(value.events,'events',20000)){
  for(const key of ['questionId','itemId','contentVersion','algorithmVersion'])text(event[key],'events.'+key,300);
  identifier(event.questionId,'events.questionId');identifier(event.itemId,'events.itemId');
  if(!['meaning','reading','writing','listening'].includes(event.skill)||typeof event.correct!=='boolean'||!['tr','en'].includes(event.language))bad('events.skill/correct/language');
  text(event.answer,'events.answer',2000,false);date(event.answeredAt,'events.answeredAt');text(event.day,'events.day',10);if(!/^\d{4}-\d{2}-\d{2}$/.test(event.day))bad('events.day');
 }
 if(!object(value.skillStates)||Object.keys(value.skillStates).length>30000)bad('skillStates');
 for(const [key,card] of Object.entries(value.skillStates)){
  if(!object(card)||!['meaning','reading','writing','listening'].includes(card.skill)||key!==`${card.itemId}:${card.skill}`)bad('skillStates.key');
  text(card.itemId,'skillStates.itemId',300);text(card.questionId,'skillStates.questionId',300);date(card.dueAt,'skillStates.dueAt');
  identifier(card.itemId,'skillStates.itemId');identifier(card.questionId,'skillStates.questionId');
  for(const field of ['attempts','correct'])if(!Number.isInteger(card[field])||card[field]<0)bad('skillStates.'+field);
  if(card.correct>card.attempts||typeof card.suspended!=='boolean'||!Number.isInteger(card.step)||card.step< -1||card.step>4)bad('skillStates.counts');
 }
 if(!object(value.lessons)||!Array.isArray(value.issues)||value.issues.length>2000)bad('lessons/issues');
 for(const lesson of Object.values(value.lessons)){if(!object(lesson))bad('lessons');for(const key of ['completedAt','skippedAt'])if(lesson[key])date(lesson[key],'lessons.'+key);}
 for(const issue of value.issues){if(!object(issue))bad('issues');text(issue.id,'issues.id',160);text(issue.questionId,'issues.questionId',300);text(issue.description,'issues.description',2000,false);date(issue.createdAt,'issues.createdAt');}
 if(value.personal!==undefined){
  if(!object(value.personal))bad('personal');const decks=keyedRows(value.personal.decks,'personal.decks',50),words=keyedRows(value.personal.words,'personal.words',2000),deckIds=new Set(decks.map(d=>d.id));
  for(const deck of decks){text(deck.name,'decks.name',80);date(deck.createdAt,'decks.createdAt');date(deck.updatedAt,'decks.updatedAt');}
  const unique=new Set();for(const word of words){
   if(!deckIds.has(word.deckId)||!object(word.meaning))bad('words.deckId/meaning');text(word.written,'words.written',80);text(word.reading,'words.reading',150);
   if(!/^[\p{Script=Hiragana}\p{Script=Katakana}ー・\s]+$/u.test(word.reading))bad('words.reading');text(word.meaning.tr,'words.meaning.tr',200);text(word.meaning.en,'words.meaning.en',200,false);
   if(!Number.isInteger(word.revision)||word.revision<1||!['unassigned','N5','N4','N3','N2','N1'].includes(word.level))bad('words.revision/level');
   if(!Array.isArray(word.tags)||word.tags.length>12)bad('words.tags');for(const tag of word.tags)text(tag,'words.tags',40);text(word.notes,'words.notes',1000,false);text(word.example,'words.example',300,false);
   date(word.createdAt,'words.createdAt');date(word.updatedAt,'words.updatedAt');if(word.deletedAt)date(word.deletedAt,'words.deletedAt');
   if(!word.deletedAt){const identity=JSON.stringify([word.deckId,word.written.normalize('NFKC').trim().toLocaleLowerCase('tr'),word.reading.normalize('NFKC').replace(/\s+/gu,'')]);if(unique.has(identity))bad('words.duplicate');unique.add(identity);}
  }
 }
 if(value.anime!==undefined){if(!object(value.anime))bad('anime');for(const q of keyedRows(value.anime.customQuotes,'anime.customQuotes',500)){
  text(q.text,'anime.text',200);text(q.reading,'anime.reading',300,false);text(q.series,'anime.series',80);if(!['beginner','intermediate','advanced'].includes(q.level))bad('anime.level');
  if(!/^custom-[A-Za-z0-9_-]+$/.test(q.id)||q.theme!=='custom')bad('anime.id/theme');
  text(q.speaker,'anime.speaker',200);text(q.publisher,'anime.publisher',100);
  for(const field of ['translation','note'])if(!object(q[field])||typeof q[field].tr!=='string'||typeof q[field].en!=='string')bad('anime.'+field);
  if(!object(q.question)||!object(q.question.answers)||!['meaning','reading','writing','listening'].includes(q.question.skill))bad('anime.question');
  text(q.question.context,'anime.context',300);
  for(const field of ['prompt','explanation']){if(!object(q.question[field]))bad('anime.question.'+field);for(const lang of ['tr','en'])text(q.question[field][lang],'anime.question.'+field,2000,false);}
  if(q.question.choices!==undefined){if(!object(q.question.choices))bad('anime.choices');for(const lang of ['tr','en']){if(!Array.isArray(q.question.choices[lang])||q.question.choices[lang].length>10)bad('anime.choices');for(const c of q.question.choices[lang])text(c,'anime.choice',300);}}
  for(const lang of ['tr','en']){if(!Array.isArray(q.question.answers[lang])||!q.question.answers[lang].length)bad('anime.answers');for(const answer of q.question.answers[lang])text(answer,'anime.answer',300);}
  if(q.videoId&&!/^[A-Za-z0-9_-]{11}$/.test(q.videoId))bad('anime.videoId');if(q.source){try{if(new URL(q.source).protocol!=='https:')bad('anime.source');}catch{bad('anime.source');}}
 }}
 if(value.genki!==undefined){if(!object(value.genki)||!object(value.genki.completedLessons))bad('genki');for(const [id,stamp] of Object.entries(value.genki.completedLessons)){if(!/^\d{1,2}$/.test(id)||Number(id)<1||Number(id)>23)bad('genki.lesson');date(typeof stamp==='string'?stamp:stamp?.completedAt,'genki.completedAt');}}
 if(value.exams!==undefined){if(!object(value.exams))bad('exams');for(const item of keyedRows(value.exams.history,'exams.history',30))if(!isExamSession(item)||item.phase!=='finished')bad('exams.history');}
 if(cloud&&('session'in value||'sync'in value))bad('cloud.transient');return value;
}
export function parseBackup(textValue){
 if(typeof textValue!=='string'||new TextEncoder().encode(textValue).length>BACKUP_BYTES)throw new BackupError('BACKUP_TOO_LARGE');
 let value;try{value=JSON.parse(textValue.replace(/^\uFEFF/u,''));}catch{throw new BackupError('INVALID_JSON');}return validateBackup(value);
}
