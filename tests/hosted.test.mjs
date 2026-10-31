import test from 'node:test';
import assert from 'node:assert/strict';
import {createHostedApp} from '../worker/index.js';
import {translate} from '../scripts/translation-core.mjs';
const assets={'/index.html':{body:'<h1>読む</h1>',type:'text/html; charset=utf-8'},'/src/app.js':{body:'export const value=1;',type:'text/javascript; charset=utf-8'}};
test('hosted Worker serves only embedded browser assets and handles HEAD without exposing source',async()=>{
 const app=createHostedApp(assets);const response=await app.fetch(new Request('https://yomu.invalid/'));
 assert.equal(response.status,200);assert.equal(await response.text(),'<h1>読む</h1>');assert.match(response.headers.get('Content-Type'),/utf-8/);
 assert.equal(await (await app.fetch(new Request('https://yomu.invalid/src/app.js',{method:'HEAD'}))).text(),'');
 for(const path of ['/README.md','/.git/config','/scripts/translation-core.mjs','/%ZZ'])assert.equal((await app.fetch(new Request('https://yomu.invalid'+path))).status,404);
 assert.equal((await app.fetch(new Request('https://yomu.invalid/',{method:'POST'}))).status,405);
});
test('HTTPS same-origin translations retain validation and the English pivot route',async()=>{
 let calls=0;const app=createHostedApp(assets,input=>translate(input,async()=>{calls++;return new Response(JSON.stringify({responseStatus:200,responseData:{translatedText:'hello'}}));}));
 const request=(body,extra={})=>new Request('https://yomu.invalid/api/translate',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://yomu.invalid',...extra},body:JSON.stringify(body)});
 const response=await app.fetch(request({text:'merhaba',source:'tr',target:'ja'}));assert.equal(response.status,200);assert.equal(calls,2);assert.deepEqual((await response.json()).route,['tr','en','ja']);
 assert.equal((await app.fetch(request({text:'hello',source:'en',target:'ja'},{Origin:'https://other.invalid'}))).status,403);assert.equal(calls,2);
 assert.equal((await app.fetch(request({text:'あ'.repeat(167),source:'ja',target:'en'}))).status,400);assert.equal(calls,2);
});
test('hosted translation rejects malformed, non-JSON and oversized bodies before provider access',async()=>{
 let calls=0;const app=createHostedApp(assets,async()=>{calls++;return {};});
 for(const [body,contentType,status] of [['bad','application/json',400],['[]','application/json',400],['hello','text/plain',415],['a'.repeat(4001),'application/json',413]]){
  const response=await app.fetch(new Request('https://yomu.invalid/api/translate',{method:'POST',headers:{'Content-Type':contentType},body}));assert.equal(response.status,status);
 }
 assert.equal((await app.fetch(new Request('https://yomu.invalid/api/translate'))).status,405);assert.equal(calls,0);
});
