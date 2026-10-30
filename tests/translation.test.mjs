import test from 'node:test';
import assert from 'node:assert/strict';
import {translate,validateTranslation} from '../scripts/translation.mjs';
const response=(body,status=200)=>new Response(JSON.stringify(body),{status});
test('all six supported translation directions use the fixed provider endpoint',async()=>{
 for(const source of ['tr','ja','en'])for(const target of ['tr','ja','en'])if(source!==target){
  const calls=[];const result=await translate({text:'こんにちは',source,target},async url=>{calls.push(url);return response({responseStatus:200,responseData:{translatedText:'Hello &amp; welcome'}});});
  for(const called of calls){assert.equal(called.origin,'https://api.mymemory.translated.net');assert.equal(called.pathname,'/get');}
  const pivot=[source,target].includes('tr')&&[source,target].includes('ja');assert.equal(calls.length,pivot?2:1);assert.deepEqual(result.route,pivot?[source,'en',target]:[source,target]);assert.equal(result.text,'Hello & welcome');assert.equal(result.provider,'MyMemory');
 }
});
test('UTF-8 byte limit is enforced before any network request',()=>{
 assert.throws(()=>validateTranslation({text:'あ'.repeat(167),source:'ja',target:'tr'}),e=>e.code==='TEXT_TOO_LONG');
 assert.equal(validateTranslation({text:'a'.repeat(500),source:'en',target:'ja'}).text.length,500);
 assert.throws(()=>validateTranslation({text:'hello',source:'en',target:'en'}),e=>e.code==='INVALID_PAIR');
 assert.throws(()=>validateTranslation({text:'one\n\ntwo',source:'en',target:'tr'}),e=>e.code==='ONE_PARAGRAPH');
});
test('quota, invalid provider responses, timeout and offline state are not fake translations',async()=>{
 const input={text:'Hello',source:'en',target:'tr'};
 await assert.rejects(translate(input,async()=>response({quotaFinished:true,responseStatus:429})),e=>e.code==='QUOTA');
 await assert.rejects(translate(input,async()=>response({responseStatus:403,responseData:{translatedText:'ERROR'}})),e=>e.code==='PROVIDER_ERROR');
 await assert.rejects(translate(input,async()=>new Response('not json')),e=>e.code==='BAD_RESPONSE');
 await assert.rejects(translate(input,async()=>{throw Object.assign(new Error(),{name:'TimeoutError'});}),e=>e.code==='TIMEOUT');
 await assert.rejects(translate(input,async()=>{throw new Error('offline');}),e=>e.code==='NETWORK');
});
