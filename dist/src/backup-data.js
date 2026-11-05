import {freshState,hydrateState,schedule} from './model.js';
import {validateBackup} from './backup-schema.js';
export {parseBackup,BackupError} from './backup-schema.js';
const clone=v=>v===undefined?undefined:structuredClone(v);
const stable=v=>v===undefined?'undefined':JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x);
const equal=(a,b)=>stable(a)===stable(b);
export function syncProjection(state){
 const result={application:'yomu',schemaVersion:3,contentVersion:state.contentVersion,settings:clone(state.settings),events:clone(state.events),skillStates:clone(state.skillStates),lessons:clone(state.lessons),issues:clone(state.issues),personal:{decks:clone(state.personal?.decks||[]),words:clone(state.personal?.words||[])},anime:{customQuotes:clone(state.anime?.customQuotes||[])},genki:{completedLessons:clone(state.genki?.completedLessons||{})},exams:{history:clone(state.exams?.history||[])}};
 return result;
}
export function backupSummary(state){return{answers:state.events?.length||0,decks:state.personal?.decks?.length||0,words:state.personal?.words?.filter(w=>!w.deletedAt).length||0,genki:Object.keys(state.genki?.completedLessons||{}).length,exams:state.exams?.history?.length||0};}
export function applyProjection(current,projection){
 validateBackup(projection);const next=hydrateState(current);
 for(const key of ['settings','events','skillStates','lessons','issues'])next[key]=clone(projection[key]);
 next.personal={...freshState().personal,...clone(projection.personal||{})};next.anime={...freshState().anime,...clone(projection.anime||{})};
 next.genki={...next.genki,...clone(projection.genki||{}),session:null};next.exams={...next.exams,...clone(projection.exams||{}),session:null};
 next.session=null;next.practice.session=null;next.learning.session=null;next.weakness.session=null;next.listening.session=null;next.revision=current.revision;return next;
}
export function mergeProjections(local,remote,base=null,{prefer=null}={}){
 const conflicts=[];
 const merge=(l,r,b,path)=>{
  if(equal(l,r))return clone(l);
  if(Array.isArray(l)&&Array.isArray(r)&&[...l,...r].every(x=>x&&typeof x==='object'&&typeof x.id==='string')){
   const lm=new Map(l.map(x=>[x.id,x])),rm=new Map(r.map(x=>[x.id,x])),bm=new Map((Array.isArray(b)?b:[]).map(x=>[x.id,x]));
   // Absence in an older device snapshot is not deletion. Personal removals use tombstones.
   return [...new Set([...lm.keys(),...rm.keys()])].sort().map(id=>!lm.has(id)?clone(rm.get(id)):!rm.has(id)?clone(lm.get(id)):merge(lm.get(id),rm.get(id),bm.get(id),`${path}[${id}]`)).filter(x=>x!==undefined);
  }
  if(l&&r&&typeof l==='object'&&typeof r==='object'&&!Array.isArray(l)&&!Array.isArray(r)){
   const out={};for(const key of new Set([...Object.keys(l),...Object.keys(r),...Object.keys(b||{})])){const v=merge(l[key],r[key],b?.[key],path?path+'.'+key:key);if(v!==undefined)out[key]=v;}return out;
  }
  if(equal(l,b))return clone(r);if(equal(r,b))return clone(l);
  conflicts.push(path);return clone(prefer==='remote'?r:l);
 };
 // Answer rows are immutable, while review counts/schedules are rebuilt after deduplication.
 const l=clone(local),r=clone(remote),b=base?clone(base):null;delete l.skillStates;delete r.skillStates;if(b)delete b.skillStates;
 const merged=merge(l,r,b,'');merged.skillStates={};
 for(const key of new Set([...Object.keys(local.skillStates),...Object.keys(remote.skillStates)])){
  const left=local.skillStates[key],right=remote.skillStates[key],before=base?.skillStates?.[key];
  let card=clone(!left?right:!right?left:(left.lastAnsweredAt||'')>=(right.lastAnsweredAt||'')?left:right);
  if(left&&right){const suspended=merge(left.suspended,right.suspended,before?.suspended,'skillStates.'+key+'.suspended');card.suspended=suspended;}
  merged.skillStates[key]=card;
 }
 const byCard=new Map();for(const event of merged.events){const key=`${event.itemId}:${event.skill}`;if(!byCard.has(key))byCard.set(key,[]);byCard.get(key).push(event);}
 for(const [key,events] of byCard){events.sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id));let step;for(const event of events)step=schedule(step,event.correct,event.answeredAt);const last=events.at(-1),old=merged.skillStates[key];merged.skillStates[key]={...old,...step,itemId:last.itemId,skill:last.skill,questionId:last.questionId,attempts:events.length,correct:events.filter(e=>e.correct).length,lastAnsweredAt:last.answeredAt,suspended:old?.suspended??false,source:'answer'};}
 for(const word of merged.personal.words){
  const lw=local.personal.words.find(w=>w.id===word.id),rw=remote.personal.words.find(w=>w.id===word.id);
  if(lw&&rw&&!equal(word,lw)&&!equal(word,rw))word.revision=Math.max(lw.revision,rw.revision)+1;
  const previous=base?.personal?.words?.find(w=>w.id===word.id),core=w=>stable([w?.written,w?.reading,w?.meaning]);
  const semanticChange=previous?core(previous)!==core(word):!!(lw&&rw&&core(lw)!==core(rw));
  for(const [key,card] of Object.entries(merged.skillStates))if(card.itemId===`personal-${word.id}`){
   if(word.deletedAt){card.suspended=true;card.removedByPersonal=true;}
   else{const editTimes=[local.skillStates[key],remote.skillStates[key]].filter(c=>c?.source==='personal-edit').map(c=>c.dueAt);if(semanticChange)editTimes.push(word.updatedAt);const editedAt=editTimes.sort().at(-1);if(editedAt&&editedAt>(card.lastAnsweredAt||'')){card.step=-1;card.dueAt=editedAt;card.source='personal-edit';}}
  }
 }
 const identities=new Map();for(const word of merged.personal.words.filter(w=>!w.deletedAt)){const key=stable([word.deckId,word.written.normalize('NFKC').trim().toLocaleLowerCase('tr'),word.reading.normalize('NFKC').replace(/\s+/gu,'')]);if(!identities.has(key))identities.set(key,[]);identities.get(key).push(word);}
 for(const group of identities.values())if(group.length>1){
  conflicts.push('personal.words.duplicate');const preferred=(prefer==='remote'?remote:local).personal.words;
  const keep=group.find(word=>preferred.some(w=>w.id===word.id&&!w.deletedAt))||group[0];
  for(const word of group)if(word!==keep){word.deletedAt=group.map(w=>w.updatedAt).sort().at(-1);for(const card of Object.values(merged.skillStates))if(card.itemId===`personal-${word.id}`){card.suspended=true;card.removedByPersonal=true;}}
 }
 merged.events.sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id));
 merged.exams.history.sort((a,b)=>(b.finishedAt||b.completedAt||'').localeCompare(a.finishedAt||a.completedAt||''));merged.exams.history=merged.exams.history.slice(0,30);
 // Enforce cross-record invariants after a merge, never partially apply malformed combinations.
 validateBackup(merged);return{snapshot:merged,conflicts:[...new Set(conflicts)],changed:!equal(local,merged)};
}
export const sameProjection=(a,b)=>equal(a,b);
