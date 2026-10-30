import {filterStudyItems,studyCollection,getStudyQuestion} from './study-data.js';

export function createStudySession(kind,config,random=Math.random,id=crypto.randomUUID()) {
 const pool=filterStudyItems(kind,config).map(item=>`study:${kind}:${item.id}:${kind==='vocabulary'?config.mode:'writing'}`);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 if(!pool.length)return null;
 return {id,kind,ids:pool.slice(0,10),index:0,eventIds:[],feedback:null,phase:'exercise'};
}
export function saveStudyItem(state,kind,itemId,now=new Date()) {
 const item=studyCollection(kind).find(i=>i.id===itemId);if(!item)return state;
 const next=structuredClone(state);
 for(const mode of kind==='vocabulary'?['meaning','reading']:['writing']){
  const q=getStudyQuestion(`study:${kind}:${item.id}:${mode}`),key=`${q.itemId}:${q.skill}`;
  if(!next.skillStates[key])next.skillStates[key]={itemId:q.itemId,skill:q.skill,questionId:q.id,dueAt:now.toISOString(),step:-1,attempts:0,correct:0,suspended:false,source:'saved-study'};
 }
 return next;
}
export function selectStudyConfig(state,kind,changes) {
 const next=structuredClone(state),config=next.learning[kind];Object.assign(config,changes);
 const items=filterStudyItems(kind,config);
 if(!items.some(i=>i.id===config.selectedId))config.selectedId=items[0]?.id || '';
 // A session is a snapshot: changing filters does not silently replace its questions.
 return next;
}
