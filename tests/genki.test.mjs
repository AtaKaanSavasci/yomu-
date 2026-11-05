import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultGenki,genkiConfig,genkiLessons,getGenkiLesson,getGenkiQuestion,createGenkiSession,genkiQuestion,genkiScope,markGenkiLesson,genkiSources} from '../dist/src/genki-data.js';
import {createGenkiFeature} from '../dist/src/genki-feature.js';
import {gradeAnswer} from '../dist/src/model.js';
import {defaultLearning} from '../dist/src/study-data.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,value=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[value]));
const ui={T:(tr,en)=>tr,L:value=>value?.tr,esc};
const now='2026-11-05T12:30:00Z';
const action=(name,extra={})=>({dataset:{action:`genki-${name}`,...extra}});
function harness({language='tr',busy=false,accept=true}={}){
 let state={settings:{language,timezone:'Europe/Istanbul',questionReadings:false},events:[],skillStates:{},genki:defaultGenki(),learning:defaultLearning(),personal:{decks:[],words:[],search:'',selectedDeckId:'all',session:null}},commits=0;
 const navigated=[],started=[],toasts=[];
 const feature=createGenkiFeature({getState:()=>state,commit:async next=>{commits++;if(accept)state=next;return accept;},ui:{...ui,T:(tr,en)=>language==='tr'?tr:en,L:value=>value?.[language]},isBusy:()=>busy,navigate:where=>navigated.push(where),onQuestionStart:(q,scope)=>started.push({q,scope}),toast:text=>toasts.push(text)});
 return {feature,started,navigated,toasts,get state(){return state;},set state(value){state=value;},get commits(){return commits;}};
}
async function submit(h,answer,session=h.state.genki.session,extra={}){
 const NativeFormData=globalThis.FormData;
 globalThis.FormData=class{get(name){return name==='answer'?answer:null;}};
 try{return await h.feature.submit({dataset:{form:'genki-answer',sessionId:session?.id,questionId:session?.ids[session.index],...extra}});}finally{globalThis.FormData=NativeFormData;}
}
test('third-edition path covers exactly 23 stable lessons across both volumes and resolves each original question',()=>{
 assert.equal(genkiLessons.length,23);assert.equal(genkiLessons.filter(l=>l.book===1).length,12);assert.equal(genkiLessons.filter(l=>l.book===2).length,11);
 assert.deepEqual(genkiLessons.map(l=>l.number),Array.from({length:23},(_,index)=>index+1));assert.equal(new Set(genkiLessons.map(l=>l.question.id)).size,23);
 for(const lesson of genkiLessons){const q=getGenkiQuestion(lesson.question.id);assert.equal(q.itemId,lesson.id);assert.equal(q.sourceType,'genki');assert.equal(q.skill,'writing');assert.match(q.context,/［　］/);assert.match(q.contextReading,/［　］/);assert.ok(lesson.example.reading);assert.notEqual(lesson.example.ja,q.context);assert.ok(lesson.theme.tr&&lesson.theme.en&&lesson.explanation.tr&&lesson.explanation.en);for(const language of ['tr','en']){assert.ok(q.prompt[language]);assert.ok(q.answers[language].length);for(const answer of q.answers[language])assert.equal(gradeAnswer(q,answer,language),true);assert.equal(gradeAnswer(q,'not a valid answer',language),false);}}
 assert.equal(getGenkiQuestion('genki:l24:mini'),null);assert.equal(getGenkiQuestion('genki:l1:mini'),null);assert.equal(getGenkiLesson('genki-l13').book,2);assert.equal(getGenkiLesson(99),null);
 assert.equal(new URL(genkiSources.structure).hostname,'genki3.japantimes.co.jp');assert.equal(new URL(genkiSources.syllabus).hostname,'bookclub2.japantimes.co.jp');
});
test('completion is an explicit personal mark with UTC timestamps and never creates answer or skill records',()=>{
 const h=harness(),original=structuredClone(h.state),marked=markGenkiLesson(h.state,13,true,{now});assert.equal(marked.genki.completedLessons['13'],'2026-11-05T12:30:00.000Z');assert.deepEqual(marked.events,[]);assert.deepEqual(marked.skillStates,{});assert.deepEqual(h.state,original);
 const unmarked=markGenkiLesson(marked,13,false);assert.deepEqual(unmarked.genki.completedLessons,{});assert.equal(markGenkiLesson(marked,99,true),marked);
});
test('additive defaults normalise imported completion marks and ignore invalid lesson keys without altering saved state',()=>{
 const saved={selectedLesson:99,book:'invalid',custom:'keep',completedLessons:{1:now,13:{completedAt:now},24:now,2:'bad date'}},snapshot=structuredClone(saved),config=genkiConfig(saved);
 assert.equal(config.selectedLesson,1);assert.equal(config.book,'all');assert.equal(config.custom,'keep');assert.deepEqual(Object.keys(config.completedLessons),['1','13']);assert.deepEqual(saved,snapshot);assert.equal(defaultGenki().session,null);assert.equal(genkiConfig(null).selectedLesson,1);
});
test('a round snapshots the real lesson question and reading exposure without mutating shared content',()=>{
 const session=createGenkiSession(2,{id:'snapshot',now,showReading:true});assert.deepEqual(session.ids,['genki:l02:mini']);assert.deepEqual(session.readingHintIds,['genki:l02:mini']);assert.deepEqual(session.eventIds,[]);assert.equal(genkiScope(session),'genki:snapshot:0');assert.equal(genkiQuestion(session).genkiLesson,2);
 const original=getGenkiQuestion(session.ids[0]);session.questions[0].context='snapshot changed';assert.equal(getGenkiQuestion(original.id).context,original.context);assert.equal(createGenkiSession(25),null);assert.equal(Object.isFrozen(genkiLessons[0].question),true);
});
test('invalid snapshots cannot be answered and the page offers a safe return',async()=>{
 const h=harness();h.state.genki.session=createGenkiSession(1,{id:'broken'});h.state.genki.session.questions[0].answers.tr='not an array';assert.equal(genkiQuestion(h.state.genki.session),null);assert.match(h.feature.page(),/Bu tur yüklenemedi/);await submit(h,'は');assert.equal(h.state.events.length,0);
 await h.feature.click(action('close'));assert.equal(h.state.genki.session,null);
});
test('selecting a lesson and switching books retain the place independently of completion or answers',async()=>{
 const h=harness();await h.feature.click(action('select',{lesson:'8'}));assert.equal(h.state.genki.selectedLesson,8);assert.ok(h.state.genki.lastOpenedAt.endsWith('Z'));assert.deepEqual(h.state.events,[]);assert.deepEqual(h.state.genki.completedLessons,{});
 await h.feature.change({dataset:{genkiFilter:'book'},value:'2'});assert.equal(h.state.genki.book,'2');assert.equal(h.state.genki.selectedLesson,13);await h.feature.click(action('select',{lesson:'12'}));assert.equal(h.state.genki.book,'1');assert.equal(h.state.genki.selectedLesson,12);
 assert.equal(await h.feature.change({dataset:{other:'book'},value:'1'}),false);assert.equal(await h.feature.click({dataset:{action:'unrelated'}}),false);
});
test('answers use the existing schedule, snapshot identity and hints; a correct mini answer never completes the lesson',async()=>{
 const h=harness();await h.feature.click(action('start',{lesson:'1'}));assert.equal(h.state.events.length,0);assert.match(h.feature.page(),/data-session-id=/);assert.equal(h.started[0].scope,`genki:${h.state.genki.session.id}:0`);
 await h.feature.click(action('toggle-reading'));await h.feature.click(action('toggle-reading'));assert.equal(h.state.genki.session.showReading,false);await submit(h,'は');const event=h.state.events[0];assert.equal(event.correct,true);assert.equal(event.mode,'genki');assert.equal(event.skill,'writing');assert.equal(event.readingHintShown,true);assert.equal(event.pronunciationHintRequested,false);assert.equal(event.genkiLesson,1);assert.equal(event.practiceScope,h.started[0].scope);assert.ok(h.state.skillStates['genki-l01:writing'].dueAt.endsWith('Z'));assert.deepEqual(h.state.genki.completedLessons,{});
 await submit(h,'は');assert.equal(h.state.events.length,1);await h.feature.click(action('next'));assert.equal(h.state.genki.session.phase,'done');assert.deepEqual(h.state.genki.completedLessons,{});await h.feature.click(action('complete',{lesson:'1'}));assert.ok(h.state.genki.completedLessons['1']);assert.equal(h.state.events.length,1);
});
test('blank or stale forms cannot grade a new round; unsubmitted navigation never fabricates answers',async()=>{
 const h=harness();await h.feature.click(action('start',{lesson:'1'}));const stale=structuredClone(h.state.genki.session);await submit(h,'');assert.equal(h.state.events.length,0);await h.feature.click(action('next'));assert.equal(h.state.genki.session.phase,'exercise');
 await h.feature.click(action('close'));await h.feature.click(action('start',{lesson:'2'}));await submit(h,'は',stale);await submit(h,'この',h.state.genki.session,{questionId:'genki:l01:mini'});assert.equal(h.state.events.length,0);await submit(h,'この');assert.equal(h.state.events.length,1);assert.equal(h.state.events[0].correct,true);
});
test('an incorrect answer is honestly stored, and an active snapshot is protected from detached selection/filter controls',async()=>{
 const h=harness();await h.feature.click(action('start',{lesson:'3'}));const id=h.state.genki.session.id;await h.feature.click(action('select',{lesson:'5'}));await h.feature.change({dataset:{genkiFilter:'book'},value:'2'});assert.equal(h.state.genki.session.id,id);assert.equal(h.state.genki.selectedLesson,3);
 await submit(h,'に');assert.equal(h.state.events[0].correct,false);assert.equal(h.state.events[0].readingHintShown,false);assert.equal(h.state.skillStates['genki-l03:writing'].step,-1);assert.match(h.feature.page(),/Birlikte gözden geçirelim/);
});
test('personal-word handoff uses the stable lesson tag and preserves saved decks and answers',async()=>{
 const h=harness();h.state.personal.words=[{id:'own',tags:['genki-3-l13'],written:'自分'},{id:'deleted',tags:['genki-3-l13'],deletedAt:now},{id:'other',tags:['genki-3-l12']}];h.state.genki.selectedLesson=13;const words=structuredClone(h.state.personal.words);assert.match(h.feature.page(),/1 etiketli kelime/);
 await h.feature.click(action('personal',{lesson:'13'}));assert.deepEqual(h.navigated,['personal']);assert.equal(h.state.personal.search,'genki-3-l13');assert.equal(h.state.personal.selectedDeckId,'all');assert.deepEqual(h.state.personal.words,words);assert.deepEqual(h.state.events,[]);
});
test('related-content links open real selections without inventing textbook vocabulary',async()=>{
 const h=harness();await h.feature.click(action('related',{lesson:'6',kind:'grammar'}));assert.equal(h.state.learning.grammar.selectedId,'g-permission');assert.equal(h.state.learning.grammar.level,'all');assert.equal(h.navigated.at(-1),'grammar');
 await h.feature.click(action('related',{lesson:'2',kind:'vocabulary'}));assert.equal(h.state.learning.vocabulary.category,'objects');assert.equal(h.navigated.at(-1),'vocabulary');await h.feature.click(action('related',{lesson:'15',kind:'sentences'}));assert.equal(h.state.learning.sentences.category,'travel');assert.equal(h.navigated.at(-1),'sentences');assert.deepEqual(h.state.events,[]);
});
test('busy or rejected commits retain prior state and do not navigate or start question audio',async()=>{
 const busy=harness({busy:true});await busy.feature.click(action('start',{lesson:'1'}));await busy.feature.change({dataset:{genkiFilter:'book'},value:'2'});assert.equal(busy.commits,0);
 const denied=harness({accept:false});await denied.feature.click(action('start',{lesson:'1'}));assert.equal(denied.state.genki.session,null);assert.equal(denied.started.length,0);await denied.feature.click(action('personal',{lesson:'1'}));assert.deepEqual(denied.navigated,[]);
});
test('English page has edition/scope and accessible controls; saved typed answers are escaped',async()=>{
 const h=harness({language:'en'}),page=h.feature.page();assert.match(page,/3rd edition/);assert.match(page,/original to Yomu/);assert.match(page,/aria-current="step"/);assert.match(page,/data-scroll-key="genki-lessons"/);assert.match(page,/0 tagged words/);
 await h.feature.click(action('start',{lesson:'1'}));await submit(h,'<img src=x>');assert.doesNotMatch(h.feature.page(),/<img src=x>/);assert.match(h.feature.page(),/&lt;img src=x&gt;/);
});
