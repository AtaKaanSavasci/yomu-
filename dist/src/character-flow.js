import {gradeAnswer,normalizeQuestionAnswer,recordAnswer} from './model.js';
import {getCharacterQuestion} from './characters.js';

export function classifyCharacterInput(question,answer,language,submitted=false) {
 const value=String(answer).trim();
 if(!value)return submitted?'revealed':'pending';
 if(gradeAnswer(question,value,language))return 'correct';
 const normalized=normalizeQuestionAnswer(question,value,language);
 // A partial reading such as "sh" is still being typed, not an incorrect answer.
 if(!submitted && !question.choices && normalized && question.answers[language].some(a=>normalizeQuestionAnswer(question,a,language).startsWith(normalized)))return 'pending';
 return 'incorrect';
}
export function applyCharacterInput(state,answer,{submitted=false,questionId,sessionId,now=new Date(),eventId=crypto.randomUUID(),elapsedMs=0}={}) {
 const session=state.practice.session;
 if(!session || session.phase!=='exercise' || session.feedback || (questionId && session.ids[session.index]!==questionId) || (sessionId && (session.id || session.startedAt)!==sessionId))return {state,kind:'stale',advanced:false};
 const question=getCharacterQuestion(session.ids[session.index]);
 const kind=classifyCharacterInput(question,answer,state.settings.language,submitted);
 if(kind==='pending' || (kind==='incorrect' && session.wrongForCurrent))return {state,kind,advanced:false};
 const next=recordAnswer(state,question,String(answer).trim(),now,eventId,elapsedMs,'characters');
 const current=next.practice.session;
 current.eventIds.push(eventId);
 if(kind==='incorrect') {
  current.wrongForCurrent=true;current.draft=String(answer);return {state:next,kind,advanced:false};
 }
 if(kind==='revealed')Object.assign(next.events.at(-1),{revealed:true,outcome:'revealed'});
 current.lastResult={kind,context:question.context,answers:question.answers};
 current.index++;current.feedback=null;current.wrongForCurrent=false;current.draft='';
 if(current.index>=current.ids.length)current.phase='done';
 return {state:next,kind,advanced:true};
}
