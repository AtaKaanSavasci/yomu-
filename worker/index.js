import {translate,TranslationError} from '../scripts/translation-core.mjs';
import {syncRequest} from './sync.js';

const responseHeaders={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{...responseHeaders,'Content-Type':'application/json; charset=utf-8'}});
async function translationRequest(request,translateImpl) {
 if(request.method!=='POST')return json(405,{error:'METHOD_NOT_ALLOWED'});
 const origin=request.headers.get('Origin');
 if(origin&&origin!==new URL(request.url).origin)return json(403,{error:'ORIGIN_NOT_ALLOWED'});
 if(!String(request.headers.get('Content-Type')||'').startsWith('application/json'))return json(415,{error:'JSON_REQUIRED'});
 let reader;
 try{
  const length=Number(request.headers.get('Content-Length')||0);if(length>4000)return json(413,{error:'TEXT_TOO_LONG'});
  const parts=[];let bytes=0;reader=request.body?.getReader();
  if(reader)while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>4000){await reader.cancel();return json(413,{error:'TEXT_TOO_LONG'});}parts.push(chunk.value);}
  const joined=new Uint8Array(bytes);let offset=0;for(const part of parts){joined.set(part,offset);offset+=part.length;}
  let input;try{input=JSON.parse(new TextDecoder().decode(joined));}catch{return json(400,{error:'INVALID_JSON'});}
  if(!input||typeof input!=='object'||Array.isArray(input))return json(400,{error:'INVALID_JSON'});
  return json(200,await translateImpl(input));
 }catch(error){return json(error instanceof TranslationError?error.status:500,{error:error instanceof TranslationError?error.code:'SERVER_ERROR'});}
 finally{reader?.releaseLock();}
}
export function createHostedApp(assets,translateImpl=translate) {
 return {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/sync')return syncRequest(request,env);
  if(url.pathname==='/api/translate')return translationRequest(request,translateImpl);
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:responseHeaders});
  let path;try{path=decodeURIComponent(url.pathname);}catch{return new Response('Not found',{status:404,headers:responseHeaders});}
  if(path==='/')path='/index.html';
  const asset=Object.hasOwn(assets,path)?assets[path]:null;
  if(!asset)return new Response('Not found',{status:404,headers:responseHeaders});
  const headers={...responseHeaders,'Content-Type':asset.type,'Cache-Control':asset.immutable?'private, max-age=31536000, immutable':'private, no-cache',Vary:'Accept-Encoding',...(asset.etag?{ETag:asset.etag}:{})};
  const matches=request.headers.get('If-None-Match')?.split(',').map(tag=>tag.trim().replace(/^W\//,''));
  if(asset.etag&&matches?.some(tag=>tag==='*'||tag===asset.etag.replace(/^W\//,'')))return new Response(null,{status:304,headers});
  const encodings=(request.headers.get('Accept-Encoding')||'').toLowerCase().split(',').map(part=>part.trim().split(';').map(value=>value.trim()));
  const gzip=encodings.find(([name])=>name==='gzip')||encodings.find(([name])=>name==='*');
  const quality=gzip?.slice(1).find(part=>part.startsWith('q='));
  const compressed=!!asset.gzip&&!!gzip&&(!quality||Number(quality.slice(2))>0);
  if(compressed)headers['Content-Encoding']='gzip';
  let body=null;
  if(request.method!=='HEAD'){
   if(asset.gzip){const bytes=Uint8Array.from(atob(asset.gzip),char=>char.charCodeAt(0));body=compressed?bytes:new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));}
   else body=asset.body;
  }
  // Cloudflare must send build-time gzip bytes unchanged, without a second compression pass.
  return new Response(body,{headers,encodeBody:'manual'});
 }};
}
// The deterministic build embeds only the browser app's allowlisted source assets.
const bundledAssets=/* YOMU_BUNDLED_ASSETS */{};
export default createHostedApp(bundledAssets);
