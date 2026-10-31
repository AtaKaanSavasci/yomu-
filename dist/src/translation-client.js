import {translate,validateTranslation,TranslationError} from './translation-core.js';
export async function requestTranslation(input,{fetchImpl=fetch,signal}={}) {
 const data=validateTranslation(input);
 const response=await fetchImpl('/api/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal});
 let result;try{result=await response.json();}catch{throw new TranslationError('PROVIDER_ERROR',502);}
 if(response.status===429&&result.error==='QUOTA'){
  signal?.throwIfAborted();
  const directFetch=(url,options)=>fetchImpl(url,{...options,signal:signal?AbortSignal.any([signal,options.signal]):options.signal});
  return {...await translate(data,directFetch),transport:'browser'};
 }
 if(!response.ok)throw new TranslationError(result.error||'PROVIDER_ERROR',response.status);
 return {...result,transport:'server'};
}
