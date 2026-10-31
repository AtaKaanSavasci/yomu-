// Only dictionary readings/meanings and explicitly labelled writing structure.
// No automatic etymology or concatenation of component pronunciations.
export const kanjiSources={dictionary:'https://kanjiapi.dev/',edrdg:'https://www.edrdg.org/kanjidic/kanjd2index_legacy.html',dictionaryLicense:'https://www.edrdg.org/edrdg/licence.html',structure:'https://kanjivg.tagaini.net/',structureLicense:'https://creativecommons.org/licenses/by-sa/3.0/'};
export const isKanji=value=>/^\p{Unified_Ideograph}$/u.test(value);
export const constructionNotes={
 '語':{source:'https://www.kanjipedia.jp/kanji/0002110200',tr:'Kanjipedia bunu 言 ile ses öğesi 吾 içeren bir 形声 (şekil–ses) yapısı olarak açıklar. Parçaların bağımsız okunuşları yan yana eklenmez.',en:'Kanjipedia describes a phonosemantic construction with 言 and the sound component 吾. The components’ standalone readings are not concatenated.'},
 '校':{source:'https://www.kanjipedia.jp/kanji/0002236900',tr:'Kanjipedia 木 ile ses öğesi 交 yapısını verir; ses öğesinde tarihî カウ yazımı kullanılır. Güncel kelimenin okunuşunu kendi bağlamında öğren.',en:'Kanjipedia gives 木 and the sound component 交, using the historical spelling カウ. Learn the modern word reading in its own context.'},
 '時':{source:'https://www.kanjipedia.jp/kanji/0002876900',tr:'Kanjipedia 日 ile ses öğesi 寺 içeren bir 形声 yapısı verir. Bu yapı, parçaların bugünkü bağımsız okunuşlarının birleştirilmesi anlamına gelmez.',en:'Kanjipedia gives a phonosemantic construction with 日 and the sound component 寺. This does not mean joining their modern standalone readings.'}
};
const attr=(token,name)=>new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(token)?.[1]||'';
export function parseKanjiComponents(svg,glyph) {
 if(!isKanji(glyph)||typeof svg!=='string'||svg.length>250000)return null;
 const stack=[],components=[];let root=null,hasUngroupedStrokes=false;
 for(const match of svg.matchAll(/<\/?g\b[^>]*>|<path\b[^>]*>/g)){
  const token=match[0];
  if(token.startsWith('</g')){stack.pop();continue;}
  if(token.startsWith('<path')){if(stack.at(-1)===root)hasUngroupedStrokes=true;continue;}
  const node={element:attr(token,'kvg:element'),original:attr(token,'kvg:original'),position:attr(token,'kvg:position'),partial:attr(token,'kvg:partial')==='true',part:attr(token,'kvg:part')};
  if(!root&&node.element===glyph)root=node;
  else if(root&&stack.at(-1)===root&&node.element)components.push(node);
  stack.push(node);if(token.endsWith('/>'))stack.pop();
 }
 if(!root)return null;
 return {components,complete:components.length>=2&&!hasUngroupedStrokes&&components.every(c=>!c.partial&&!c.part)};
}
export function validateKanjiEntry(value,glyph){
 if(value?.kanji!==glyph)throw Error('Mismatched dictionary entry');
 const strings=key=>{if(!Array.isArray(value[key])||!value[key].every(s=>typeof s==='string'&&s.length<=250))throw Error('Invalid dictionary entry');return value[key];};
 return {kanji:glyph,meanings:strings('meanings'),on:strings('on_readings'),kun:strings('kun_readings'),strokes:Number.isInteger(value.stroke_count)?value.stroke_count:null};
}
const cache=new Map();
export async function lookupKanji(glyph,fetchImpl=fetch) {
 if(!isKanji(glyph))throw Error('One kanji required');
 const saved=cache.get(glyph);if(saved&&Date.now()-saved.time<86400000)return saved.promise;
 const promise=(async()=>{
  const code=glyph.codePointAt(0).toString(16).padStart(5,'0');
  const results=await Promise.allSettled([
   fetchImpl(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(glyph)}`,{signal:AbortSignal.timeout(10000)}).then(async r=>{if(!r.ok)throw Error('Dictionary unavailable');return validateKanjiEntry(await r.json(),glyph);}),
   fetchImpl(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${code}.svg`,{signal:AbortSignal.timeout(10000)}).then(async r=>r.ok?parseKanjiComponents(await r.text(),glyph):null)
  ]);
  const structure=results[1].status==='fulfilled'?results[1].value:null,componentDefinitions={};
  const components=[...new Set((structure?.components||[]).map(c=>c.original||c.element).filter(isKanji))].filter(c=>c!==glyph).slice(0,8);
  await Promise.allSettled(components.map(async component=>{const r=await fetchImpl(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(component)}`,{signal:AbortSignal.timeout(10000)});if(r.ok)componentDefinitions[component]=validateKanjiEntry(await r.json(),component);}));
  return {glyph,dictionary:results[0].status==='fulfilled'?results[0].value:null,structure,componentDefinitions,note:constructionNotes[glyph]||null,fetchedAt:new Date().toISOString()};
 })();
 cache.set(glyph,{time:Date.now(),promise});if(cache.size>500)cache.delete(cache.keys().next().value);
 const result=await promise;if(!result.dictionary&&!result.structure)cache.delete(glyph);return result;
}
