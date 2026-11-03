export const weaknessTypes=['all','characters','vocabulary','sentences','grammar','anime','personal','reading','listening','other'];
export const weaknessSkills=['all','meaning','reading','writing','listening'];
export const weaknessReasons=['all','wrong','assisted'];
export const weaknessHistories=['unresolved','recent','all'];
export const defaultWeakness=()=>({type:'all',skill:'all',reason:'all',history:'all',size:5,session:null});
export function weaknessConfig(saved={}){
 const defaults=defaultWeakness(),result={...defaults,...saved};
 for(const [key,allowed] of [['type',weaknessTypes],['skill',weaknessSkills],['reason',weaknessReasons],['history',weaknessHistories]])if(!allowed.includes(result[key]))result[key]=defaults[key];
 result.size=Number(result.size)===10?10:5;return result;
}
export const isRevealed=event=>event.revealed===true||event.outcome==='revealed';
export const isAssisted=event=>event.readingHintShown===true||event.pronunciationHintRequested===true;
export const isDifficult=event=>event.correct===false||isRevealed(event)||isAssisted(event);
export function weaknessOutcome(event){return isRevealed(event)?'revealed':event.correct===false?'wrong':isAssisted(event)?'assisted-correct':'independent-correct';}
const timestamp=value=>{const time=Date.parse(value);return Number.isFinite(time)?time:0;};
function questionType(question,event){
 if(weaknessTypes.includes(question?.sourceType)&&question.sourceType!=='all')return question.sourceType;
 const id=String(question?.id||event.questionId||''),item=String(event.itemId||'');
 if(question?.character||id.startsWith('character:')||item.startsWith('character-'))return 'characters';
 if(id.startsWith('personal:')||item.startsWith('personal-'))return 'personal';
 if(question?.studyKind&&weaknessTypes.includes(question.studyKind))return question.studyKind;
 if(id.startsWith('study:')){const kind=id.split(':')[1];if(weaknessTypes.includes(kind))return kind;}
 if(id.startsWith('anime:')||item.startsWith('anime-'))return 'anime';
 if(question?.lessonId||event.mode==='lesson')return 'reading';
 if(question?.word||id.startsWith('lex-'))return 'vocabulary';
 if(event.skill==='listening')return 'listening';
 return 'other';
}
export function isPracticeQuestion(question,identity={}){
 if(!question||typeof question.id!=='string'||typeof question.itemId!=='string'||typeof question.skill!=='string'||typeof question.context!=='string')return false;
 if(identity.id&&question.id!==identity.id||identity.itemId&&question.itemId!==identity.itemId||identity.skill&&question.skill!==identity.skill)return false;
 return ['tr','en'].every(language=>typeof question.prompt?.[language]==='string'&&typeof question.explanation?.[language]==='string'&&Array.isArray(question.answers?.[language])&&question.answers[language].length&&question.answers[language].every(answer=>typeof answer==='string'));
}
export function aggregateWeakness(events,{getQuestion=()=>null,type='all',skill='all',reason='all',history='all',now=new Date()}={}){
 const grouped=new Map(),seen=new Set();
 for(const [index,event] of (Array.isArray(events)?events:[]).entries()){
  if(!event||typeof event.itemId!=='string'||typeof event.skill!=='string'||typeof event.correct!=='boolean')continue;
  if(event.id&&seen.has(event.id))continue;if(event.id)seen.add(event.id);
  const key=JSON.stringify([event.itemId,event.skill]);
  if(!grouped.has(key))grouped.set(key,{key,itemId:event.itemId,skill:event.skill,events:[]});
  grouped.get(key).events.push({event,index,time:timestamp(event.answeredAt)});
 }
 const result=[];
 for(const group of grouped.values()){
  group.events.sort((a,b)=>a.time-b.time||a.index-b.index);
  const ordered=group.events.map(row=>row.event),difficult=ordered.filter(isDifficult);if(!difficult.length)continue;
  const latest=ordered.at(-1),lastDifficulty=difficult.at(-1);
  let question=null;
  // Pick an actually attempted, resolvable question from this item and skill.
  const candidates=[...difficult].reverse().concat([...ordered].reverse()),tried=new Set();
  for(const event of candidates){if(typeof event.questionId!=='string'||tried.has(event.questionId))continue;tried.add(event.questionId);let resolved;try{resolved=getQuestion(event.questionId);}catch{continue;}
   if(isPracticeQuestion(resolved,{id:event.questionId,itemId:group.itemId,skill:group.skill})){question=resolved;break;}}
  const row={key:group.key,itemId:group.itemId,skill:group.skill,type:questionType(question,latest),attempts:ordered.length,
   wrong:ordered.filter(event=>event.correct===false&&!isRevealed(event)).length,revealed:ordered.filter(isRevealed).length,
   assisted:ordered.filter(isAssisted).length,assistedCorrect:ordered.filter(event=>event.correct&&!isRevealed(event)&&isAssisted(event)).length,
   independentCorrect:ordered.filter(event=>event.correct&&!isRevealed(event)&&!isAssisted(event)).length,
   difficultyCount:difficult.length,lastDifficultyAt:lastDifficulty.answeredAt||null,lastDifficultyTime:timestamp(lastDifficulty.answeredAt),latestAt:latest.answeredAt||null,
   latestOutcome:weaknessOutcome(latest),latestAssisted:isAssisted(latest),unresolved:weaknessOutcome(latest)!=='independent-correct',
   question,questionId:question?.id||latest.questionId||null,available:!!question,
   label:question?.word?.written||question?.character?.display||question?.context||group.itemId};
  if(type!=='all'&&row.type!==type||skill!=='all'&&row.skill!==skill)continue;
  if(reason==='wrong'&&row.wrong+row.revealed===0||reason==='assisted'&&row.assisted===0)continue;
  if(history==='unresolved'&&!row.unresolved||history==='recent'&&row.lastDifficultyTime<new Date(now).getTime()-30*86400000)continue;
  result.push(row);
 }
 return result.sort((a,b)=>b.lastDifficultyTime-a.lastDifficultyTime||b.difficultyCount-a.difficultyCount||(a.key<b.key?-1:a.key>b.key?1:0));
}
export function createWeaknessSession(rows,{limit=5,id=crypto.randomUUID(),now=new Date(),config={}}={}){
 const maximum=Math.max(1,Math.min(10,Math.floor(Number(limit)||5))),questions=[],seen=new Set();let skippedUnavailable=0;
 for(const row of rows){if(!row.available||!isPracticeQuestion(row.question,{itemId:row.itemId,skill:row.skill})){skippedUnavailable++;continue;}
  if(seen.has(row.question.id))continue;seen.add(row.question.id);if(questions.length>=maximum)continue;
  try{questions.push(structuredClone(row.question));}catch{skippedUnavailable++;}}
 if(!questions.length)return null;
 return {id,ids:questions.map(question=>question.id),questions,index:0,feedback:null,eventIds:[],phase:'exercise',readingHintIds:[],pronunciationHintIds:[],skippedMissing:[],skippedUnavailable,candidateCount:rows.length,startedAt:new Date(now).toISOString(),config:{...config,size:maximum}};
}
export function weaknessQuestion(session){const question=session?.questions?.[session.index];return session?.phase==='exercise'&&isPracticeQuestion(question,{id:session.ids?.[session.index]})?question:null;}
export const weaknessScope=session=>`weakness:${session.id}:${session.index}`;
