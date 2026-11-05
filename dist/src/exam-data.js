import {studyWords,studyGrammar,studyLevels,STUDY_VERSION} from './study-data.js';
import {createListeningGate} from './listening-data.js';
import {isExamSession} from './exam-schema.js';

export {createListeningGate,isExamSession};
export const EXAM_VERSION='exam-2026-11-05.1';
export const examSections=['vocabulary','grammar','reading','listening'];
export const defaultExams=()=>({level:'N5',includeListening:false,durationMinutes:20,session:null,history:[]});
export function normaliseExams(saved={}){
 const defaults=defaultExams(),history=[],seen=new Set();
 for(const item of Array.isArray(saved?.history)?saved.history:[]){if(!isExamSession(item)||item.phase!=='finished'||seen.has(item.id))continue;history.push(item);seen.add(item.id);if(history.length===30)break;}
 return {...defaults,level:studyLevels.includes(saved?.level)?saved.level:defaults.level,durationMinutes:[10,20,30,45].includes(Number(saved?.durationMinutes))?Number(saved.durationMinutes):defaults.durationMinutes,includeListening:saved?.includeListening===true,session:isExamSession(saved?.session)?saved.session:null,history};
}
const bi=(tr,en)=>({tr,en});
const pick=(value,language)=>value?.[language]??value?.tr??'';
const copy=value=>structuredClone(value);
const time=value=>value instanceof Date?value.getTime():typeof value==='number'?value:Date.parse(value);
const iso=value=>new Date(time(value)).toISOString();
const normal=value=>String(value).normalize('NFKC').trim().toLocaleLowerCase('en-US');
const shuffle=(values,random)=>{const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};

// These are deliberately selected alternatives, not unrelated generated grammar fragments.
// The translation fixes the intended meaning when another form could work in another context.
const grammarOptions={
 'g-desu':['です','ではありません','でした','ではありませんでした'],
 'g-masu':['ます','ません','ました','ませんでした'],
 'g-suki':['が','で','に','と'],
 'g-tai':['たい','たく','たかった','たくない'],
 'g-permission':['も','が','に','を'],
 'g-ownership':['の','を','で','と'],
 'g-experience':['ことが','ものが','ところが','ためが'],
 'g-nagara':['ながら','までに','ために','だけに'],
 'g-temiru':['み','おき','しまい','いき'],
 'g-must':['なければ','なくても','ないのに','ないので'],
 'g-think':['と','を','に','で'],
 'g-potential':['られ','させ','たがり','すぎ'],
 'g-younisuru':['ように','ような','ようで','ようだ'],
 'g-kotoninaru':['ことに','ために','ところに','ばかりに'],
 'g-bakari':['ばかり','はず','ため','つもり'],
 'g-hazu':['はず','つもり','ところ','ばかり'],
 'g-tameni':['ために','のに','からには','につれて'],
 'g-while-still':['うちに','ところに','かわりに','ばかりに'],
 'g-despite':['にもかかわらず','のおかげで','のために','に備えて'],
 'g-zaru':['ざるを得ません','ずにはいられません','ないわけではありません','なくてもかまいません'],
 'g-wakedehanai':['わけでは','はずでは','ところでは','つもりでは'],
 'g-oujite':['に応じて','に反して','を問わず','を除いて'],
 'g-kagirazu':['に限らず','に限って','を除いて','に先立って'],
 'g-certainty':['に違いありません','とは限りません','ではあるまいか','かもしれません'],
 'g-yoginaku':['を余儀なく','をものとも','にかこつけて','に先駆けて'],
 'g-itarumade':['に至るまで','に先立って','をよそに','を経て'],
 'g-tokorode':['ところで','からには','からこそ','ばかりに'],
 'g-toatte':['とあって','とはいえ','にもかかわらず','をよそに'],
 'g-beku':['べく','まいと','かたがた','がてら'],
 'g-prohibition-formal':['べからず','べし','まじき','べく']
};

// Original passages and comprehension items. No published examination items are reproduced.
// The bands are editorial study labels; they have not been psychometrically calibrated.
export const examReadings=[
 {level:'N5',id:'weekend-library',title:bi('Pazar planı','Sunday plans'),text:'日曜日、あきさんは友達のゆきさんと図書館へ行きます。十時に駅の前で会います。図書館は駅から歩いて五分です。午前中、二人は日本語の本を読みます。十二時に図書館の隣の店で昼ご飯を食べます。あきさんは午後、家で勉強します。ゆきさんは公園へ行きます。',items:[
  ['あきさんはいつ図書館へ行きますか。',['日曜日','月曜日','金曜日','土曜日'],0,bi('İlk cümle planın pazar günü olduğunu söyler.','The first sentence places the visit on Sunday.')],
  ['二人は何時に会いますか。',['九時','十時','十二時','午後二時'],1,bi('İstasyonda saat onda buluşacaklar.','They meet at the station at ten.')],
  ['二人はどこで会いますか。',['図書館の中','店の前','駅の前','公園の中'],2,bi('Metinde buluşma yeri 駅の前, istasyonun önü olarak verilir.','駅の前 means in front of the station, their meeting point.')],
  ['駅から図書館まで、どうやって行きますか。',['バスで五分','電車で十分','車で五分','歩いて五分'],3,bi('図書館は駅から歩いて五分: kütüphane beş dakika yürüme mesafesinde.','The library is a five-minute walk from the station.')],
  ['二人はどこで昼ご飯を食べますか。',['図書館の隣の店','駅の中の店','あきさんの家','公園'],0,bi('Öğle yemeği kütüphanenin yanındaki dükkânda yenir.','Lunch is at the shop next to the library.')],
  ['午後、家で勉強する人はだれですか。',['ゆきさん','あきさん','二人とも','だれもいません'],1,bi('Son iki cümle Aki’nin evde çalışacağını, Yuki’nin parka gideceğini ayırır.','The last two sentences distinguish Aki studying at home from Yuki going to the park.')]
 ]},
 {level:'N4',id:'class-change',title:bi('Kurs duyurusu','Class notice'),text:'料理教室に参加する皆さんへ。土曜日の教室は、先生の都合で日曜日に変わりました。時間は午後二時から四時までで、場所は前と同じ市民センターの二階です。今回は野菜のカレーを作ります。材料はこちらで用意するので、買ってくる必要はありません。エプロンと飲み物を持ってきてください。日曜日に来られない人は、金曜日の午後五時までにメールで連絡してください。その人には、あとでレシピを送ります。',items:[
  ['教室はいつ行われますか。',['金曜日','土曜日','日曜日','月曜日'],2,bi('Duyuru dersin cumartesiden pazara alındığını belirtir.','The notice moves the class from Saturday to Sunday.')],
  ['教室の時間はどれですか。',['午前二時から四時','午後四時から五時','午後五時から七時','午後二時から四時'],3,bi('午後二時から四時まで, 14.00–16.00 aralığıdır.','午後二時から四時まで means from 2 p.m. to 4 p.m.')],
  ['今回、場所はどうなりますか。',['前と同じです','別の建物です','先生の家です','まだ決まっていません'],0,bi('場所は前と同じ, mekânın değişmediğini söyler.','場所は前と同じ explicitly says the location is unchanged.')],
  ['参加する人が持ってくるものはどれですか。',['カレーの材料と皿','エプロンと飲み物','野菜と飲み物','エプロンと米'],1,bi('Malzemeler hazırlanacak; katılımcı önlük ve içecek getirmeli.','Ingredients are supplied; participants should bring an apron and a drink.')],
  ['来られない人は、いつまでに連絡しますか。',['土曜日の午後五時','日曜日の午後二時','金曜日の午後五時','金曜日の午前五時'],2,bi('Gelemeyenler cuma günü saat 17.00’ye kadar e-posta göndermeli.','Those unable to attend should email by 5 p.m. on Friday.')],
  ['来られない人は、あとで何をもらいますか。',['材料','エプロン','飲み物','レシピ'],3,bi('Son cümlede gelemeyenlere sonradan tarif gönderileceği söylenir.','The final sentence says the recipe will be sent to those who cannot attend.')]
 ]},
 {level:'N3',id:'team-meeting',title:bi('Toplantı düzeni','Meeting arrangements'),text:'私たちのチームでは、毎週月曜日の朝に一時間の会議をしていた。しかし、報告だけで時間が終わり、相談したい問題について話せないことが多かった。そこで、来月から報告は前の週の金曜日までに共有ページに書くことにした。会議は三十分に短くし、解決したい問題を二つまで選んで話し合う。急ぎの問題は月曜日を待たず、担当者に直接連絡する。一か月後、会議の長さだけでなく、問題を解決できたかも確認して、この方法を続けるか決める。',items:[
  ['これまでの会議には、どんな問題がありましたか。',['報告だけで時間が終わることが多かった','参加者が毎週変わっていた','月曜日にだれも来なかった','共有ページが読めなかった'],0,bi('Eski toplantıda raporlar süreyi doldurduğu için sorunlar tartışılamıyordu.','Reports often used all the time, leaving no room to discuss problems.')],
  ['来月から、報告はどうしますか。',['月曜日に口で伝える','前の週の金曜日までに共有ページに書く','会議のあとでメールを送る','報告をやめる'],1,bi('Raporların önceki cuma gününe kadar ortak sayfaya yazılması kararlaştırılmış.','Reports will be written on the shared page by the preceding Friday.')],
  ['新しい会議で話す問題は、いくつまでですか。',['一つ','三つ','二つ','四つ'],2,bi('二つまで, en fazla iki sorun anlamındadır.','二つまで limits discussion to at most two problems.')],
  ['急ぎの問題があるときは、どうしますか。',['次の月曜日まで待つ','金曜日に書くだけにする','会議を一時間に戻す','担当者に直接連絡する'],3,bi('Acil sorunlar için pazartesi beklenmeden ilgili kişiye doğrudan ulaşılır.','Urgent issues go directly to the person responsible without waiting for Monday.')],
  ['一か月後、何を確認しますか。',['会議の長さと、問題を解決できたか','共有ページの色だけ','報告を書いた人の年齢','月曜日が何回あったか'],0,bi('Değerlendirme hem toplantı süresini hem çözülen sorunları kapsar.','The evaluation checks both meeting length and whether problems were resolved.')],
  ['この変更の目的として最も合うものはどれですか。',['報告の量を増やすこと','問題を相談する時間を作ること','金曜日の会議を増やすこと','直接の連絡をなくすこと'],1,bi('Başlangıçtaki sorun ve yeni düzen birlikte, asıl amacın sorun tartışmaya zaman ayırmak olduğunu gösterir.','The original problem and new arrangement show the purpose is to make time for discussing problems.')]
 ]},
 {level:'N2',id:'library-pilot',title:bi('Kütüphane denemesi','A library pilot'),text:'市立図書館は、来月から三か月間、平日の閉館時間を午後七時から九時に延長する。仕事帰りに利用したいという要望に応じた試みだ。ただし、開館時間を延ばすだけで利用者が増えるとは限らない。そこで期間中は、午後七時以降の入館者数に加え、利用目的と来館しやすくなったかを尋ねる簡単な調査も行う。貸出窓口は九時まで利用できるが、資料の詳しい調査を職員に依頼するサービスは、従来どおり七時に終了する。延長を恒常化するかどうかは、調査結果と職員の負担を併せて検討したうえで判断する。休日の開館時間に変更はない。',items:[
  ['閉館時間を延長する主なきっかけは何ですか。',['職員数が増えたこと','休日の利用者が減ったこと','仕事帰りに利用したいという要望','貸出をやめたいという意見'],2,bi('İkinci cümle, iş çıkışı kullanmak isteyenlerin taleplerini neden olarak gösterir.','The second sentence identifies requests from people wanting to visit after work.')],
  ['延長の対象と期間の組み合わせはどれですか。',['休日・一か月','毎日・三か月','平日・一年','平日・三か月'],3,bi('İlk cümle hafta içi kapanışının üç aylığına uzatıldığını söyler.','The first sentence specifies a three-month extension on weekdays.')],
  ['午後八時にも利用できるものはどれですか。',['貸出窓口','詳しい資料調査の依頼','休日の延長サービス','すべての職員向けサービス'],0,bi('Ödünç verme gişesi dokuza kadar, ayrıntılı araştırma hizmeti ise yediye kadar açıktır.','The lending desk stays open until nine; detailed research requests end at seven.')],
  ['入館者数以外に、何を調べますか。',['職員の通勤経路だけ','利用目的と来館しやすくなったか','本の表紙の色','休日の天気だけ'],1,bi('Anket, kullanım amacını ve gelişin kolaylaşıp kolaylaşmadığını sorar.','The survey asks about visit purpose and whether visiting has become easier.')],
  ['延長を続けるかどうかは、何に基づいて決めますか。',['入館者数だけ','職員の希望だけ','調査結果と職員の負担','休日の開館時間'],2,bi('Karar anket sonuçları ile çalışan yükünü birlikte değerlendirecek.','The decision considers the survey results together with staff workload.')],
  ['筆者の説明に合うものはどれですか。',['延長はすでに恒常化している','休日も二時間延長する','調査サービスも九時まで続く','延長の効果は試行中に確かめる'],3,bi('Bu bir deneme uygulamasıdır; etkisi ölçülmeden kalıcılaştırma kararı verilmez.','This is a pilot whose effects will be measured before a permanent decision is made.')]
 ]},
 {level:'N1',id:'local-archive',title:bi('Bölgesel arşiv','A local archive'),text:'地域の資料を電子化すれば、保存と公開の問題が一挙に解決するという見方がある。確かに、画像を遠隔地から閲覧できる意義は大きい。しかし、紙面を画像に置き換えただけでは、資料が作られた背景や、書き手が当然のこととして省略した事情まで伝わるとは限らない。むしろ、検索で一部分だけに接した読者が、その断片を地域全体の姿と受け取るおそれもある。必要なのは、電子化を断念することではなく、資料の来歴や他の記録との関係を示す説明を添え、異なる立場から読み直せるようにすることだ。その説明も完成された結論とみなすべきではない。新しい証言が得られた際には、根拠を残したうえで更新できる仕組みが望ましい。公開件数の多さのみを成果とする評価では、こうした地道な作業が後回しになりかねない。',items:[
  ['筆者が認めている電子化の利点は何ですか。',['資料の背景が自動的に分かること','すべての解釈が一致すること','紙の保存が不要になること','遠隔地から画像を閲覧できること'],3,bi('Yazar uzaktan görüntü erişiminin değerini açıkça kabul eder; bağlamın otomatik aktarılacağını söylemez.','The writer explicitly values remote access to images, without claiming context transfers automatically.')],
  ['検索で一部分だけを読むことについて、何を懸念していますか。',['断片を地域全体の姿だと受け取ること','検索が一切できなくなること','すべての資料が消えること','読者が必ず来館すること'],0,bi('Kopuk bir parça, yanlış biçimde bütün bölgenin temsili sanılabilir.','An isolated fragment may mistakenly be treated as representing the entire region.')],
  ['筆者が提案していることはどれですか。',['電子化を直ちに断念する','来歴や他の記録との関係を説明する','説明を付けず画像だけを増やす','一つの立場による解釈に固定する'],1,bi('Öneri, dijitalleştirmeyi bırakmak yerine kaynak geçmişini ve kayıtlar arası ilişkileri açıklamaktır.','The proposal is to explain provenance and relationships between records rather than abandon digitisation.')],
  ['新しい証言が得られた場合、説明はどうするべきですか。',['過去の根拠を消して書き換える','最初の結論を永久に維持する','根拠を残して更新できるようにする','証言をすべて公開対象から外す'],2,bi('根拠を残したうえで更新: dayanakları koruyarak güncelleyebilmek gerekir.','The text calls for updates that retain the supporting evidence.')],
  ['公開件数だけで成果を評価すると、何が起こりかねませんか。',['資料の背景が自動的に明らかになる','遠隔閲覧が不可能になる','紙の資料が必ず増える','説明を整える作業が後回しになる'],3,bi('Son cümle, yalnız sayı odaklı değerlendirmenin bağlam açıklama işini geciktirebileceğini belirtir.','The final sentence warns that counting publications alone can push contextual work into the background.')],
  ['文章全体の主張に最も合うものはどれですか。',['電子化と、見直せる文脈の説明を組み合わせるべきだ','電子化さえすれば解釈の問題はなくなる','資料の説明は一度完成したら変えてはならない','公開する画像の数だけを増やすべきだ'],0,bi('Bütün metin dijital erişimi, bağlamı ve yeni kanıtlarla yeniden değerlendirilebilirliği birlikte savunur.','The overall argument combines digital access with context and explanations open to revision through new evidence.')]
 ]}
];

function makeChoice(id,section,prompt,context,values,correct,explanation,language,random,extra={}){
 const order=shuffle(values.map((text,index)=>({text,correct:index===correct})),random);
 return {id,version:EXAM_VERSION,section,prompt,context,choices:order.map(x=>x.text),answerIndex:order.findIndex(x=>x.correct),explanation,...extra};
}
function wordQuestions(level,language,random,count=8,section='vocabulary',exclude=[]){
 const pool=studyWords.filter(w=>w.level===level&&!w.technical),source=shuffle(pool.filter(w=>!exclude.includes(w.id)),random),questions=[];
 for(const word of source){
  const same=[...shuffle(pool.filter(other=>other.category===word.category),random),...shuffle(pool,random)];
  const values=[pick(word.meaning,language)],seen=new Set([normal(values[0]),...(word.meaningAlternatives?.[language]||[]).map(normal)]);
  for(const other of same){
   if(other.id===word.id||other.reading===word.reading)continue;
   const value=pick(other.meaning,language);if(seen.has(normal(value)))continue;seen.add(normal(value));values.push(value);if(values.length===4)break;
  }
  if(values.length<4)continue;
  questions.push(makeChoice(`exam:${section}:${word.id}`,section,pick(section==='listening'?bi('Duyduğun kelimenin anlamını seç.','Choose the meaning of the word you hear.'):bi('Kelimenin anlamını seç.','Choose the meaning of the word.'),language),section==='listening'?'':word.written,values,0,`${word.written} → ${word.reading} · ${pick(word.meaning,language)}`,language,random,{sourceId:word.id,reading:word.reading,written:word.written,...(section==='listening'?{audio:{reading:word.reading,source:'browser-tts'}}:{})}));
  if(questions.length===count)break;
 }
 return questions;
}
export function createExamSession(config,{language='tr',hasAudio=false,now=Date.now(),id=crypto.randomUUID(),random=Math.random}={}){
 const level=studyLevels.includes(config.level)?config.level:'N5',lang=language==='en'?'en':'tr',duration=[10,20,30,45].includes(Number(config.durationMinutes))?Number(config.durationMinutes):20;
 const vocabulary=wordQuestions(level,lang,random),grammar=shuffle(studyGrammar.filter(item=>item.level===level&&grammarOptions[item.id]),random).slice(0,6).map(item=>makeChoice(`exam:grammar:${item.id}`,'grammar',pick(bi('Çeviriye uygun parçayla boşluğu tamamla.','Complete the gap to match the translation.'),lang),item.example.ja.replace(item.target,'［　］'),grammarOptions[item.id],grammarOptions[item.id].indexOf(item.target),`${item.example.ja}\n${pick(item.explanation,lang)}`,lang,random,{translation:pick(item.example.translation,lang),sourceId:item.id}));
 const passage=examReadings.find(item=>item.level===level),reading=passage.items.map(([prompt,choices,correct,explanation],index)=>makeChoice(`exam:reading:${passage.id}:${index}`,'reading',prompt,'',choices,correct,pick(explanation,lang),lang,random,{passage:passage.text,passageTitle:pick(passage.title,lang)}));
 const include=config.includeListening===true&&hasAudio,listening=include?wordQuestions(level,lang,random,4,'listening',vocabulary.map(q=>q.sourceId)):[];
 return {id,version:`${EXAM_VERSION}:${STUDY_VERSION}`,level,language:lang,durationMinutes:duration,startedAt:iso(now),deadline:iso(time(now)+duration*60000),phase:'active',index:0,questions:copy([...vocabulary,...grammar,...reading,...listening]),answers:{},audioUnavailableIds:[],listeningStatus:include?'included':'not-taken',listeningReason:include?'':config.includeListening?'no-voice':'not-selected',finishedAt:null,finishReason:null};
}
export const examRemaining=(session,now=Date.now())=>Math.max(0,time(session.deadline)-time(now));
export function saveExamAnswer(session,{sessionId,questionId,index,choice},{now=Date.now(),audioEvidence={}}={}){
 if(!session||session.phase!=='active'||session.id!==sessionId||session.index!==Number(index)||examRemaining(session,now)<=0)return session;
 const question=session.questions[session.index];if(!question||question.id!==questionId||!Number.isInteger(choice)||choice<0||choice>=question.choices.length)return session;
 if(question.section==='listening'&&(!audioEvidence.audioPlaybackCompleted||session.audioUnavailableIds.includes(question.id)))return session;
 const result=copy(session);result.answers[question.id]={choice,answeredAt:iso(now),...(question.section==='listening'?copy(audioEvidence):{})};return result;
}
export function markExamAudioUnavailable(session){
 if(!session||session.phase!=='active'||session.listeningStatus!=='included')return session;
 const ids=session.questions.filter(q=>q.section==='listening'&&!session.answers[q.id]).map(q=>q.id);
 const merged=[...new Set([...session.audioUnavailableIds,...ids])];if(merged.length===session.audioUnavailableIds.length)return session;
 return {...copy(session),audioUnavailableIds:merged};
}
export function scoreExamSession(session){
 const sections=examSections.map(section=>{
  const questions=session.questions.filter(q=>q.section===section);let correct=0,wrong=0,blank=0,notTaken=0;
  for(const question of questions){const answer=session.answers[question.id];if(section==='listening'&&session.audioUnavailableIds.includes(question.id)&&!answer){notTaken++;continue;}if(!answer){blank++;continue;}if(answer.choice===question.answerIndex)correct++;else wrong++;}
  return {section,total:questions.length,correct,wrong,blank,notTaken,status:!questions.length||notTaken===questions.length?'not-taken':notTaken?'partial':'taken'};
 });
 return {sections,total:sections.reduce((n,x)=>n+x.total-x.notTaken,0),correct:sections.reduce((n,x)=>n+x.correct,0),wrong:sections.reduce((n,x)=>n+x.wrong,0),blank:sections.reduce((n,x)=>n+x.blank,0),notTaken:sections.reduce((n,x)=>n+x.notTaken,0)};
}
export function finishExamSession(session,{now=Date.now(),reason='submitted',hasAudio=true}={}){
 if(!session||session.phase!=='active')return session;
 const source=hasAudio?session:markExamAudioUnavailable(session),result=copy(source);result.phase='finished';result.finishedAt=iso(now);result.finishReason=examRemaining(session,now)<=0?'deadline':reason;result.result=scoreExamSession(result);return result;
}
export function finishExamState(state,options={}){
 const config=normaliseExams(state.exams),session=config.session;if(!session||session.phase!=='active')return state;
 const next=copy(state),finished=finishExamSession(session,options);next.exams={...config,session:finished,history:[finished,...config.history.filter(old=>old.id!==finished.id)].slice(0,30)};return next;
}
