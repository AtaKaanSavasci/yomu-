export const LANGUAGES=['tr','ja','en'];
export class TranslationError extends Error {constructor(code,status=400){super(code);this.code=code;this.status=status;}}
export function validateTranslation(input) {
 const text=typeof input.text==='string'?input.text.trim():'';
 if(!LANGUAGES.includes(input.source)||!LANGUAGES.includes(input.target)||input.source===input.target)throw new TranslationError('INVALID_PAIR');
 if(!text)throw new TranslationError('EMPTY_TEXT');
 if(Buffer.byteLength(text,'utf8')>500)throw new TranslationError('TEXT_TOO_LONG');
 if(/\n\s*\n/.test(text))throw new TranslationError('ONE_PARAGRAPH');
 return {text,source:input.source,target:input.target};
}
function decodeText(text) {
 return text.replace(/&(?:amp|lt|gt|quot|apos|#39);/g,s=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"}[s]));
}
async function translateSegment(input,fetchImpl=fetch) {
 const data=validateTranslation(input);
 const url=new URL('https://api.mymemory.translated.net/get');
 url.searchParams.set('q',data.text);url.searchParams.set('langpair',`${data.source}|${data.target}`);url.searchParams.set('mt','1');
 let response;
 try {response=await fetchImpl(url,{signal:AbortSignal.timeout(12000),headers:{Accept:'application/json'}});}catch(e){throw new TranslationError(e.name==='TimeoutError'||e.name==='AbortError'?'TIMEOUT':'NETWORK',503);}
 if(response.status===429)throw new TranslationError('QUOTA',429);
 if(!response.ok)throw new TranslationError('PROVIDER_ERROR',502);
 let body;try {const raw=await response.text();if(raw.length>256000)throw new Error();body=JSON.parse(raw);}catch{throw new TranslationError('BAD_RESPONSE',502);}
 if(body.quotaFinished || Number(body.responseStatus)===429)throw new TranslationError('QUOTA',429);
 if(Number(body.responseStatus)!==200 || typeof body.responseData?.translatedText!=='string' || !body.responseData.translatedText.trim())throw new TranslationError('PROVIDER_ERROR',502);
 return {text:decodeText(body.responseData.translatedText),source:data.source,target:data.target,provider:'MyMemory',machineAssisted:true};
}
export async function translate(input,fetchImpl=fetch) {
 const data=validateTranslation(input);
 // Direct TR/JA public-memory matches were incorrect even for basic greetings in QA.
 // Use the larger EN language pairs, and disclose the pivot in the UI/output.
 if([data.source,data.target].includes('tr') && [data.source,data.target].includes('ja')) {
  const intermediate=await translateSegment({...data,target:'en'},fetchImpl);
  const result=await translateSegment({text:intermediate.text,source:'en',target:data.target},fetchImpl);
  return {...result,source:data.source,route:[data.source,'en',data.target]};
 }
 return {...await translateSegment(data,fetchImpl),route:[data.source,data.target]};
}
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
