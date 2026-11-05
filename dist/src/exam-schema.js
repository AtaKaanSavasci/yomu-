// Dependency-free: shared by local snapshots, backup validation and the sync worker.
const examSchemaLevels=['N5','N4','N3','N2','N1'];
const examSchemaSections=['vocabulary','grammar','reading','listening'];
const examSchemaObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const examSchemaText=(value,max,empty=false)=>typeof value==='string'&&value.length<=max&&(empty||value.trim().length>0);
const examSchemaDate=value=>examSchemaText(value,40)&&Number.isFinite(Date.parse(value));
export function isExamSession(value){
 if(!examSchemaObject(value)||!examSchemaText(value.id,160)||!examSchemaText(value.version,200)||!['active','finished'].includes(value.phase)||!examSchemaLevels.includes(value.level)||!['tr','en'].includes(value.language))return false;
 if(![10,20,30,45].includes(value.durationMinutes)||!examSchemaDate(value.startedAt)||!examSchemaDate(value.deadline)||Date.parse(value.deadline)-Date.parse(value.startedAt)!==value.durationMinutes*60000)return false;
 if(!Array.isArray(value.questions)||value.questions.length<1||value.questions.length>40||!Number.isInteger(value.index)||value.index<0||value.index>=value.questions.length||!examSchemaObject(value.answers)||!Array.isArray(value.audioUnavailableIds)||value.audioUnavailableIds.length>40||new Set(value.audioUnavailableIds).size!==value.audioUnavailableIds.length||!['included','not-taken'].includes(value.listeningStatus))return false;
 if(value.listeningStatus==='included'?value.listeningReason!=='':!['no-voice','not-selected'].includes(value.listeningReason))return false;
 const ids=new Set();
 for(const q of value.questions){
  if(!examSchemaObject(q)||!examSchemaText(q.id,300)||ids.has(q.id)||!examSchemaText(q.version,200)||!examSchemaSections.includes(q.section)||!examSchemaText(q.prompt,1200)||!examSchemaText(q.context,4000,true)||!examSchemaText(q.explanation,4000)||!Array.isArray(q.choices)||q.choices.length!==4||q.choices.some(choice=>!examSchemaText(choice,2000))||new Set(q.choices).size!==4||!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>=4)return false;
  for(const [field,max] of [['passage',10000],['passageTitle',300],['translation',2000],['written',300],['reading',500],['sourceId',300]])if(q[field]!==undefined&&!examSchemaText(q[field],max,true))return false;
  if(q.section==='reading'&&(!examSchemaText(q.passage,10000)||!examSchemaText(q.passageTitle,300)))return false;
  if(q.passage&&!examSchemaText(q.passageTitle,300))return false;
  if(q.section==='listening'&&(!examSchemaObject(q.audio)||!examSchemaText(q.audio.reading,500)||q.audio.source!=='browser-tts'))return false;
  ids.add(q.id);
 }
 const listening=value.questions.some(q=>q.section==='listening');if(listening!==(value.listeningStatus==='included'))return false;
 for(const [id,answer] of Object.entries(value.answers)){
  const q=value.questions.find(q=>q.id===id);if(!q||!examSchemaObject(answer)||!Number.isInteger(answer.choice)||answer.choice<0||answer.choice>=4||!examSchemaDate(answer.answeredAt)||Date.parse(answer.answeredAt)>=Date.parse(value.deadline)||Date.parse(answer.answeredAt)<Date.parse(value.startedAt))return false;
  if(q.section==='listening'&&answer.audioPlaybackCompleted!==true)return false;
  if(answer.audioSource!==undefined&&answer.audioSource!=='browser-tts'||answer.audioSpeed!==undefined&&!['normal','slow'].includes(answer.audioSpeed))return false;
 }
 if(value.audioUnavailableIds.some(id=>!examSchemaText(id,300)||!value.questions.some(q=>q.id===id&&q.section==='listening')||Object.hasOwn(value.answers,id)))return false;
 return value.phase!=='finished'||examSchemaDate(value.finishedAt)&&Date.parse(value.finishedAt)>=Date.parse(value.startedAt)&&['submitted','deadline'].includes(value.finishReason);
}
