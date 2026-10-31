import {translate,TranslationError} from './translation-core.mjs';
export {LANGUAGES,TranslationError,validateTranslation,translate} from './translation-core.mjs';
export async function handleTranslation(req,res) {
 const send=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));};
 if(req.method!=='POST'){send(405,{error:'METHOD_NOT_ALLOWED'});return;}
 const origin=req.headers.origin;
 if(origin && ![`http://${req.headers.host}`].includes(origin)){send(403,{error:'ORIGIN_NOT_ALLOWED'});return;}
 if(!String(req.headers['content-type'] || '').startsWith('application/json')){send(415,{error:'JSON_REQUIRED'});return;}
 try{
  const chunks=[];let bytes=0;
  for await(const chunk of req){bytes+=chunk.length;if(bytes>4000)throw new TranslationError('TEXT_TOO_LONG',413);chunks.push(chunk);}
  const raw=Buffer.concat(chunks).toString('utf8');
  let input;try{input=JSON.parse(raw);}catch{throw new TranslationError('INVALID_JSON');}
  if(!input || typeof input!=='object')throw new TranslationError('INVALID_JSON');
  send(200,await translate(input));
 }catch(e){send(e instanceof TranslationError?e.status:500,{error:e instanceof TranslationError?e.code:'SERVER_ERROR'});}
}
