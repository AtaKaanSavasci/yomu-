import test from 'node:test';
import assert from 'node:assert/strict';
import {requestTranslation} from '../dist/src/translation-client.js';
const response=(body,status=200)=>new Response(JSON.stringify(body),{status});
test('a server quota response falls back to the fixed provider from the browser, preserving the English pivot',async()=>{
 const calls=[];const result=await requestTranslation({text:'Merhaba',source:'tr',target:'ja'},{fetchImpl:async(url,options)=>{
  calls.push({url,options});if(url==='/api/translate')return response({error:'QUOTA'},429);
  assert.equal(url.origin,'https://api.mymemory.translated.net');assert.equal(url.pathname,'/get');
  return response({responseStatus:200,responseData:{translatedText:calls.length===2?'Hello':'こんにちは'}});
 }});
 assert.equal(calls.length,3);assert.equal(result.text,'こんにちは');assert.deepEqual(result.route,['tr','en','ja']);assert.equal(result.transport,'browser');
 assert.equal(calls[1].url.searchParams.get('langpair'),'tr|en');assert.equal(calls[2].url.searchParams.get('langpair'),'en|ja');
});
test('server success, validation, unrelated errors and cancellation do not trigger direct provider calls',async()=>{
 let calls=0;const fetchImpl=async()=>{calls++;return response({text:'hello',route:['ja','en']});};
 assert.equal((await requestTranslation({text:'こんにちは',source:'ja',target:'en'},{fetchImpl})).transport,'server');assert.equal(calls,1);
 await assert.rejects(requestTranslation({text:'あ'.repeat(167),source:'ja',target:'en'},{fetchImpl}),e=>e.code==='TEXT_TOO_LONG');assert.equal(calls,1);
 await assert.rejects(requestTranslation({text:'hello',source:'en',target:'tr'},{fetchImpl:async()=>response({error:'PROVIDER_ERROR'},502)}),e=>e.code==='PROVIDER_ERROR');
 const controller=new AbortController();controller.abort();let abortedCalls=0;
 await assert.rejects(requestTranslation({text:'hello',source:'en',target:'tr'},{signal:controller.signal,fetchImpl:async()=>{abortedCalls++;return response({error:'QUOTA'},429);}}),e=>e.name==='AbortError');assert.equal(abortedCalls,1);
});
