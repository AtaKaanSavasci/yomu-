import {additionalKanji} from './kanji-expansion.js';
import {expansionKanjiRows} from './learning-expansion.js';
export const PRACTICE_VERSION = 'characters-2026-11-11.1';
// Gojūon chart and common Hepburn/Kunrei variants. Original structured data.
const rows = [
 ['a','basic','あいうえお','a i u e o'], ['k','basic','かきくけこ','ka ki ku ke ko'],
 ['s','basic','さしすせそ','sa shi su se so'], ['t','basic','たちつてと','ta chi tsu te to'],
 ['n','basic','なにぬねの','na ni nu ne no'], ['h','basic','はひふへほ','ha hi fu he ho'],
 ['m','basic','まみむめも','ma mi mu me mo'], ['y','basic','やゆよ','ya yu yo'],
 ['r','basic','らりるれろ','ra ri ru re ro'], ['w','basic','わをん','wa wo n'],
 ['g','voiced','がぎぐげご','ga gi gu ge go'], ['z','voiced','ざじずぜぞ','za ji zu ze zo'],
 ['d','voiced','だぢづでど','da di du de do'], ['b','voiced','ばびぶべぼ','ba bi bu be bo'],
 ['p','voiced','ぱぴぷぺぽ','pa pi pu pe po'],
 ['ky','combined','きゃ きゅ きょ','kya kyu kyo'], ['gy','combined','ぎゃ ぎゅ ぎょ','gya gyu gyo'],
 ['sh','combined','しゃ しゅ しょ','sha shu sho'], ['j','combined','じゃ じゅ じょ','ja ju jo'],
 ['ch','combined','ちゃ ちゅ ちょ','cha chu cho'], ['ny','combined','にゃ にゅ にょ','nya nyu nyo'],
 ['hy','combined','ひゃ ひゅ ひょ','hya hyu hyo'], ['by','combined','びゃ びゅ びょ','bya byu byo'],
 ['py','combined','ぴゃ ぴゅ ぴょ','pya pyu pyo'], ['my','combined','みゃ みゅ みょ','mya myu myo'],
 ['ry','combined','りゃ りゅ りょ','rya ryu ryo'],
];
export const toKatakana = value => [...value].map(c => String.fromCharCode(c.charCodeAt(0)+0x60)).join('');
const variants = { shi:['si'], chi:['ti'], tsu:['tu'], fu:['hu'], ji:['zi'], di:['ji','zi'], du:['zu','dzu'], wo:['o'], sha:['sya'], shu:['syu'], sho:['syo'], ja:['jya','zya'], ju:['jyu','zyu'], jo:['jyo','zyo'], cha:['tya','cya'], chu:['tyu','cyu'], cho:['tyo','cyo'] };
export const kanaGroups = rows.map(([id,kind,glyphs,roman]) => ({ id, kind, entries: (glyphs.includes(' ') ? glyphs.split(' ') : [...glyphs]).map((glyph,i) => ({key:roman.split(' ')[i],hiragana:glyph,katakana:toKatakana(glyph),answers:[roman.split(' ')[i],...(variants[roman.split(' ')[i]] || [])]})) }));
const kanji = (key,glyph,word,kana,roman,tr,en,level) => ({key,glyph,word,kana,roman,meaning:{tr,en},level});
export const kanjiWords = [
 kanji('sun','日','日本','にほん','nihon','Japonya','Japan','beginner'),
 kanji('moon','月','月曜日','げつようび','getsuyoubi','pazartesi','Monday','beginner'),
 kanji('fire','火','火山','かざん','kazan','yanardağ','volcano','beginner'),
 kanji('water','水','水','みず','mizu','su','water','beginner'),
 kanji('tree','木','木','き','ki','ağaç','tree','beginner'),
 kanji('person','人','人','ひと','hito','insan','person','beginner'),
 kanji('mountain','山','山','やま','yama','dağ','mountain','beginner'),
 kanji('river','川','川','かわ','kawa','nehir','river','beginner'),
 kanji('school','学','学校','がっこう','gakkou','okul','school','intermediate'),
 kanji('electricity','電','電車','でんしゃ','densha','tren','train','intermediate'),
 kanji('eat','食','食べる','たべる','taberu','yemek yemek','to eat','intermediate'),
 kanji('speak','話','話す','はなす','hanasu','konuşmak','to speak','intermediate'),
 kanji('listen','聞','聞く','きく','kiku','dinlemek','to listen','intermediate'),
 kanji('time','時','時間','じかん','jikan','zaman','time','intermediate'),
 kanji('enemy','敵','敵','てき','teki','düşman','enemy','advanced'),
 kanji('curse','呪','呪術','じゅじゅつ','jujutsu','büyücülük','sorcery','advanced'),
 kanji('soul','魂','魂','たましい','tamashii','ruh','soul','advanced'),
 kanji('protect','守','守る','まもる','mamoru','korumak','to protect','advanced'),
 kanji('hope','希','希望','きぼう','kibou','umut','hope','advanced'),
 kanji('word','言','言葉','ことば','kotoba','söz','word','advanced'),
];
kanjiWords.push(...additionalKanji.map(row=>kanji(...row)));
kanjiWords.push(...expansionKanjiRows.map(row=>kanji(...row)));
export const defaultPractice = () => ({script:'hiragana',level:'beginner',mode:'reading',groups:['a','k','s'],showReadings:true,font:'sans',session:null});
export const levelKinds = {beginner:['basic'],intermediate:['basic','voiced'],advanced:['basic','voiced','combined']};
export function groupsFor(level) {return kanaGroups.filter(g => (levelKinds[level] || levelKinds.beginner).includes(g.kind));}
export function characterPool(config) {
 if (config.script === 'kanji') {
  const levels = ['beginner','intermediate','advanced'].slice(0,['beginner','intermediate','advanced'].indexOf(config.level)+1);
  return kanjiWords.filter(w => levels.includes(w.level)).map(w => ({...w,id:`kanji-${w.key}`,script:'kanji',display:w.word,answers:[w.kana,w.roman],canonical:w.kana}));
 }
 return groupsFor(config.level).filter(g=>config.groups.includes(g.id)).flatMap(g=>g.entries.map(e=>({...e,id:`${config.script}-${e.key}`,script:config.script,group:g.id,display:e[config.script],canonical:e.key})));
}
export function characterById(id) {
 const sep = id.indexOf('-'), script = id.slice(0,sep), key=id.slice(sep+1);
 if (script==='kanji') {const w=kanjiWords.find(w=>w.key===key); return w ? {...w,id,script,display:w.word,answers:[w.kana,w.roman,...(key==='sun'?['にっぽん','nippon']:[])],canonical:w.kana}:null;}
 if (!['hiragana','katakana'].includes(script)) return null;
 const group = kanaGroups.find(g=>g.entries.some(e=>e.key===key)), item=group?.entries.find(e=>e.key===key);
 return item ? {...item,id,script,group:group.id,display:item[script],canonical:item.key}:null;
}
export const characterQuestionId = (entryId,mode) => `character:${mode}:${entryId}`;
export function getCharacterQuestion(id) {
 const match=/^character:(reading|choice|writing):(.+)$/.exec(id); if (!match) return null;
 const mode=match[1], item=characterById(match[2]); if(!item) return null;
 const writing=mode==='writing', expected=writing?[item.display]:item.answers;
 const prompt=writing ? {tr:item.script==='kanji'?`“${item.meaning.tr}” (${item.kana}) kelimesini kanjiyle yaz.`:'Bu okunuşu seçtiğin yazı sistemiyle yaz.',en:item.script==='kanji'?`Write “${item.meaning.en}” (${item.kana}) in kanji.`:'Type this reading in the selected script.'} : {tr:item.script==='kanji'?'Gösterilen kelimenin tamamını kana veya romaji ile oku.':'Bu karakterin okunuşunu romaji ile yaz veya seç.',en:item.script==='kanji'?'Read the whole word in kana or romaji.':'Type or choose the romanized reading of this character.'};
 const question={id,itemId:`character-${item.id}`,skill:writing?'writing':'reading',prompt,context:writing?(item.script==='kanji'?item.kana:item.canonical):item.display,answers:{tr:expected,en:expected},normalization:writing?'script':'romaji',version:PRACTICE_VERSION,responseType:mode,character:item,
 explanation:{tr:`${item.display} → ${item.script==='kanji'?item.kana+' ('+item.roman+') · '+item.meaning.tr:item.answers.join(' / ')}. ${item.script==='kanji'?'Bu kart kelime bağlamındaki okunuşu ölçer; kanjinin bütün okumalarını ölçmez.':'Kabul edilen yazımlar yukarıdadır; bu bir romaji okuma alıştırmasıdır.'}`,en:`${item.display} → ${item.script==='kanji'?item.kana+' ('+item.roman+') · '+item.meaning.en:item.answers.join(' / ')}. ${item.script==='kanji'?'This tests a word in context, not every reading of a kanji.':'Accepted spellings are listed above; this is a romanized reading exercise.'}`}};
 if(mode==='choice') {
  const candidates=item.script==='kanji'?kanjiWords.map(w=>w.kana):kanaGroups.flatMap(g=>g.entries.map(e=>e.key));
  const start=candidates.indexOf(item.canonical), options=[item.canonical];
  for(let i=1;options.length<4 && i<candidates.length;i++){const v=candidates[(start+i*7)%candidates.length];if(!item.answers.includes(v)&&!options.includes(v))options.push(v);}
  const rotated=options.slice((start+4)%4).concat(options.slice(0,(start+4)%4)); question.choices={tr:rotated,en:rotated};
 }
 return question;
}
export function createCharacterSession(config, random=Math.random) {
 const pool=characterPool(config); if(!pool.length) throw new Error('EMPTY_POOL');
 const shuffled=[...pool];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 return {id:crypto.randomUUID(),ids:shuffled.slice(0,10).map(e=>characterQuestionId(e.id,config.mode)),index:0,eventIds:[],feedback:null,phase:'exercise',wrongForCurrent:false,draft:'',config:{script:config.script,level:config.level,mode:config.mode},startedAt:new Date().toISOString()};
}
