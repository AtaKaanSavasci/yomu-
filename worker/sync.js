import {validateBackup,SYNC_BYTES} from '../dist/src/backup-schema.js';
const syncJSON=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'oai-authenticated-user-id'}});
export async function syncRequest(request,env){
 const id=request.headers.get('oai-authenticated-user-id');if(!id||id.length>200)return syncJSON(401,{error:'SIGN_IN_REQUIRED'});
 if(!['GET','PUT'].includes(request.method))return syncJSON(405,{error:'METHOD_NOT_ALLOWED'});
 const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return syncJSON(403,{error:'ORIGIN_NOT_ALLOWED'});
 if(request.method==='PUT'&&(!origin||request.headers.get('Sec-Fetch-Site')==='cross-site'))return syncJSON(403,{error:'ORIGIN_NOT_ALLOWED'});
 if(!env?.DB)return syncJSON(503,{error:'SYNC_UNAVAILABLE'});
 try{
  if(request.method==='GET'){const row=await env.DB.prepare('SELECT revision, snapshot, updated_at FROM yomu_sync WHERE user_id = ?').bind(id).first();return syncJSON(200,row?{revision:row.revision,snapshot:JSON.parse(row.snapshot),updatedAt:row.updated_at}:{revision:0,snapshot:null,updatedAt:null});}
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return syncJSON(415,{error:'JSON_REQUIRED'});
  if(Number(request.headers.get('Content-Length')||0)>SYNC_BYTES+1000)return syncJSON(413,{error:'SYNC_TOO_LARGE'});
  const reader=request.body?.getReader();let bytes=0;const parts=[];if(reader){try{while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>SYNC_BYTES+1000){await reader.cancel();return syncJSON(413,{error:'SYNC_TOO_LARGE'});}parts.push(part.value);}}finally{reader.releaseLock();}}
  const joined=new Uint8Array(bytes);let offset=0;for(const part of parts){joined.set(part,offset);offset+=part.byteLength;}
  let input;try{input=JSON.parse(new TextDecoder().decode(joined));}catch{return syncJSON(400,{error:'INVALID_JSON'});}
  if(!Number.isSafeInteger(input?.expectedRevision)||input.expectedRevision<0)return syncJSON(400,{error:'INVALID_REVISION'});
  try{validateBackup(input.snapshot,{maxBytes:SYNC_BYTES,cloud:true});}catch(error){return syncJSON(error.code==='BACKUP_TOO_LARGE'?413:400,{error:error.code==='BACKUP_TOO_LARGE'?'SYNC_TOO_LARGE':'INVALID_SNAPSHOT'});}
  const stamp=new Date().toISOString(),snapshot=JSON.stringify(input.snapshot);
  const statement=input.expectedRevision===0?env.DB.prepare('INSERT INTO yomu_sync (user_id, revision, snapshot, updated_at) VALUES (?, 1, ?, ?) ON CONFLICT(user_id) DO NOTHING RETURNING revision, updated_at').bind(id,snapshot,stamp):env.DB.prepare('UPDATE yomu_sync SET revision = revision + 1, snapshot = ?, updated_at = ? WHERE user_id = ? AND revision = ? RETURNING revision, updated_at').bind(snapshot,stamp,id,input.expectedRevision);
  const row=await statement.first();if(!row)return syncJSON(409,{error:'REVISION_CONFLICT'});return syncJSON(200,{revision:row.revision,updatedAt:row.updated_at});
 }catch{return syncJSON(503,{error:'SYNC_UNAVAILABLE'});}
}
