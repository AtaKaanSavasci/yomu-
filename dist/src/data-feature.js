import {readStoreMeta,writeStoreMeta} from './storage.js';
import {freshState} from './model.js';
import {validateBackup} from './backup-schema.js';
import {parseBackup,syncProjection,applyProjection,mergeProjections,backupSummary,sameProjection} from './backup-data.js';

export function createDataFeature({getState,commit,render,ui,toast,isBusy,canApply=()=>true,fetchImpl=globalThis.fetch}){
 let meta={enabled:false,base:null,revision:0,lastSyncedAt:null},running=false,applying=false,dirty=false,timer,status='local',error='',plan=null,backup=null,recovery=false,generation=0;
 const message=()=>{const{T}=ui();return error||({local:T('Bu cihazda saklanıyor.','Saved on this device.'),syncing:T('Eşitleniyor…','Syncing…'),synced:T('Eşitlendi.','Synced.'),waiting:T('Yeni veriler hazır. Yazmayı veya aktif turu bitirdiğinde eşitlenecek.','New data is ready. Sync resumes after editing or the active round.'),conflict:T('İki cihaz aynı alanı değiştirmiş. Önizlemede bir tercih yap.','Two devices changed the same field. Choose a preference in the preview.'),pending:T('Yeni yerel değişiklikler bekliyor.','Local changes are waiting.')})[status]||'';};
 const refresh=()=>{for(const node of globalThis.document?.querySelectorAll('[data-sync-status]')||[])node.textContent=message();for(const node of globalThis.document?.querySelectorAll('[data-action="data-setup"],[data-action="data-sync"]')||[])node.disabled=running;};
 const show=()=>{render();refresh();};
 const stamp=()=>meta.lastSyncedAt?new Date(meta.lastSyncedAt).toLocaleString(ui().T('tr-TR','en-GB')):'';
 const conflictLabel=path=>{const {T}=ui();return path==='personal.words.duplicate'?T('Aynı kelimenin iki kopyası','Two copies of the same word'):path.startsWith('personal.')?T('Kişisel deste veya kelime alanı','Personal deck or word field'):path.startsWith('settings.')?T('Tercih: ','Preference: ')+path.split('.').at(-1):path.startsWith('genki.')?T('Genki tamamlama kaydı','Genki completion record'):path.startsWith('skillStates.')?T('Tekrar kartı tercihi','Review card preference'):T('Geçmiş kayıt alanı','History record field');};
 const counts=s=>{const n=backupSummary(s),{T}=ui();return `${n.answers} ${T('cevap','answers')} · ${n.decks} ${T('deste','decks')} · ${n.words} ${T('kelime','words')} · ${n.genki} ${T('Genki bölümü','Genki lessons')} · ${n.exams} ${T('deneme','exams')}`;};
 const problem=e=>{const{T}=ui();const codes={SIGN_IN_REQUIRED:T('Eşitleme için yayımlanan sitede aynı ChatGPT hesabıyla oturum aç.','Sign in to the published site with the same ChatGPT account to sync.'),SYNC_UNAVAILABLE:T('Eşitleme sunucusuna şu anda ulaşılamıyor. Yerel kayıtların korunuyor.','Cloud sync is unavailable. Your local records are safe.'),NETWORK:T('İnternet bağlantısı kurulamadı. Yerel kayıtların bekliyor.','Connection failed. Your local changes are waiting.'),SYNC_TOO_LARGE:T('Eşitleme kaydı 1,8 MB sınırını aşıyor. JSON yedeğini dışa aktar; veriler yerelde korunur.','Sync data exceeds 1.8 MB. Export a JSON backup; local data is retained.'),BACKUP_TOO_LARGE:T('Yedek en fazla 8 MB olabilir.','Backups must be no larger than 8 MB.'),INVALID_JSON:T('Dosya geçerli JSON değil.','The file is not valid JSON.'),INVALID_BACKUP:T('Yedek biçimi veya alanları geçersiz. Hiçbir kayıt değiştirilmedi.','Invalid backup format or fields. No records were changed.'),REVISION_CONFLICT:T('Bulut kaydı değişti. Yeniden önizleyip birleştir.','Cloud data changed. Preview and merge again.'),STALE:T('Bu cihazdaki kayıt değişti. Yeniden önizle.','Local records changed. Preview again.')};return codes[e.code]||T('İşlem tamamlanamadı. Yerel kayıtların korundu.','The operation failed. Local records were retained.');};
 async function api(method='GET',body){
  const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),15000);
  try{const response=await fetchImpl('/api/sync',{method,credentials:'same-origin',cache:'no-store',redirect:'error',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:abort.signal});
   if(!response.headers.get('Content-Type')?.includes('application/json'))throw{code:'SIGN_IN_REQUIRED'};const result=await response.json();if(!response.ok)throw{code:result.error||'NETWORK'};
   if(method==='GET'){if(!Number.isSafeInteger(result.revision)||result.revision<0)throw{code:'INVALID_BACKUP'};if(result.snapshot)validateBackup(result.snapshot,{cloud:true});}return result;
  }catch(e){if(e.code)throw e;throw{code:'NETWORK'};}finally{clearTimeout(timeout);}
 }
 function preview(local,remote,{base=meta.base,prefer=null}={}){const result=remote.snapshot?mergeProjections(local,remote.snapshot,base||syncProjection(freshState()),{prefer}):{snapshot:local,conflicts:[],changed:false};return{...result,local,remote,prefer,localRevision:getState().revision};}
 async function syncNow({setup=false,confirm=false}={}){
  if(running||isBusy()||(!meta.enabled&&!setup&&!confirm))return;running=true;error='';status='syncing';refresh();
  try{
   if(confirm&&plan){
    if(plan.localRevision!==getState().revision)throw{code:'STALE'};
    if(plan.conflicts.length&&!plan.prefer){status='conflict';return;}
   }else{
    meta={...meta,...await readStoreMeta('cloud-sync')};if(!meta.enabled&&!setup&&!confirm){status='local';return;}const before=getState().revision,remote=await api();if(before!==getState().revision){status='pending';dirty=true;return;}
    plan=preview(syncProjection(getState()),remote);
   }
   if(setup||plan.conflicts.length&&!plan.prefer){status=plan.conflicts.length?'conflict':'pending';show();return;}
   if(plan.changed&&!canApply()){status='waiting';return;}
   const candidate=plan;if(candidate.localRevision!==getState().revision)throw{code:'STALE'};const before=structuredClone(getState());dirty=false;
   const saved=candidate.remote.snapshot&&sameProjection(candidate.snapshot,candidate.remote.snapshot)?{revision:candidate.remote.revision,updatedAt:candidate.remote.updatedAt}:await api('PUT',{expectedRevision:candidate.remote.revision,snapshot:candidate.snapshot});
   meta.enabled=true;
   if(getState().revision!==candidate.localRevision){status='pending';plan=null;dirty=true;return;}
   if(candidate.changed){applying=true;try{if(!await commit(applyProjection(before,candidate.snapshot))){dirty=true;throw{code:'STALE'};}}finally{applying=false;}}
   // Acknowledge a cloud base only after its incoming records were committed locally.
   meta={enabled:true,revision:saved.revision,base:candidate.snapshot,lastSyncedAt:saved.updatedAt||new Date().toISOString()};await writeStoreMeta('cloud-sync',meta);
   plan=null;status=dirty?'pending':'synced';if(confirm)show();
  }catch(e){error=problem(e);status=e.code==='REVISION_CONFLICT'?'conflict':'pending';if(e.code==='REVISION_CONFLICT'||e.code==='STALE')plan=null;if(setup||confirm)show();}
  finally{running=false;refresh();if(dirty&&meta.enabled){clearTimeout(timer);timer=setTimeout(()=>void syncNow(),1500);}}
 }
 function changed(){if(applying||!meta.enabled)return;dirty=true;status='pending';refresh();clearTimeout(timer);timer=setTimeout(()=>void syncNow(),1500);}
 async function init(){try{meta={...meta,...await readStoreMeta('cloud-sync')};recovery=!!await readStoreMeta('restore-recovery');if(globalThis.document?.querySelector('#data-cloud')&&canApply())show();if(meta.enabled)void syncNow();}catch{error=ui().T('Eşitleme tercihi okunamadı.','Sync preference could not be loaded.');}refresh();}
 function page(){
  const{T,esc}=ui();
  const previewHTML=plan?`<div class="data-preview"><h3>${T('Eşitleme önizlemesi','Sync preview')}</h3><p>${T('Bu cihaz','This device')}: ${esc(counts(plan.local))}</p><p>${T('Bulut','Cloud')}: ${plan.remote.snapshot?esc(counts(plan.remote.snapshot)):T('Henüz kayıt yok.','No record yet.')}</p><p><strong>${T('Birleşim','Merged')}: ${esc(counts(plan.snapshot))}</strong></p>${plan.conflicts.length?`<p>${plan.conflicts.length} ${T('alan farklı düzenlenmiş. Tercihin yalnız çakışan alanlara uygulanır; diğer kayıtlar birleştirilir.','fields were edited differently. Your preference affects conflicting fields; other records are merged.')}</p><details><summary>${T('Çakışan alanları gör','View conflicting fields')}</summary><ul>${plan.conflicts.slice(0,30).map(path=>`<li>${esc(conflictLabel(path))}</li>`).join('')}</ul></details><div class="button-row"><button type="button" class="btn secondary" data-action="data-prefer-local" aria-pressed="${plan.prefer==='local'}">${T('Çakışmalarda bu cihaz','Prefer this device for conflicts')}</button><button type="button" class="btn secondary" data-action="data-prefer-remote" aria-pressed="${plan.prefer==='remote'}">${T('Çakışmalarda bulut','Prefer cloud for conflicts')}</button></div>`:''}<p class="small muted">${T('Aynı kelime iki kez eklendiyse tercih edilmeyen kopya kaldırılanlara taşınır; geçmişi silinmez. Aktif turlar aktarılmaz. Kaynak kayıtlar birleştirilir; otomatik cihaz eşitlemesi bu onaydan sonra açılır.','If a word was added twice, the other copy moves to removed words; its history is retained. Active rounds are not transferred. Study records are merged; automatic sync starts after confirmation.')}</p><button type="button" class="btn primary" data-action="data-confirm-sync" ${plan.conflicts.length&&!plan.prefer?'disabled':''}>${T('Birleştir ve eşitlemeyi aç','Merge and enable sync')}</button><button type="button" class="btn text" data-action="data-cancel-sync">${T('Vazgeç','Cancel')}</button></div>`:'';
  const backupHTML=backup?`<div class="data-preview"><h3>${T('Yedek önizlemesi','Backup preview')}</h3><p>${T('Dosya','File')}: ${esc(backup.name)}</p><p>${T('Şu an','Current')}: ${esc(counts(getState()))}</p><p>${T('Yedekte','Backup')}: ${esc(counts(backup.snapshot))}</p><label>${T('Yükleme şekli','Restore mode')}<select data-data-setting="restore-mode"><option value="merge" ${backup.mode==='merge'?'selected':''}>${T('Kayıtları birleştir','Merge records')}</option><option value="replace" ${backup.mode==='replace'?'selected':''}>${T('Bu cihazı yedekle değiştir','Replace this device with backup')}</option></select></label>${backup.conflicts.length&&backup.mode==='merge'?`<p>${backup.conflicts.length} ${T('çakışma var. Çakışan alanlar için tercih seç.','conflicts. Choose which version to keep for conflicting fields.')}</p><div class="button-row"><button class="btn secondary" data-action="data-backup-local" aria-pressed="${backup.prefer==='local'}">${T('Bu cihaz','This device')}</button><button class="btn secondary" data-action="data-backup-remote" aria-pressed="${backup.prefer==='remote'}">${T('Yedekteki','Backup')}</button></div>`:''}<p><strong>${T('Yüklenecek','To restore')}: ${esc(counts(backup.result))}</strong></p><p class="small muted">${T('Uygulamadan önce mevcut kayıtların kurtarma kopyası bu cihazda saklanır. Aktif turlar sıfırlanır ve bu cihazın eşitlemesi duraklatılır; sonra yeniden açabilirsin.','A recovery copy of current records is kept on this device. Active rounds reset and sync pauses on this device; you can enable it again afterwards.')}</p><button class="btn primary" data-action="data-restore" ${backup.mode==='merge'&&backup.conflicts.length&&!backup.prefer?'disabled':''}>${T('Önizlenen yedeği uygula','Apply previewed backup')}</button><button class="btn text" data-action="data-cancel-backup">${T('Vazgeç','Cancel')}</button></div>`:'';
  return `<section class="panel data-panel" id="data-cloud"><h2>${T('Telefon ve bilgisayar birlikte.','Phone and computer together.')}</h2><p>${T('Yayımlanan sitede aynı ChatGPT hesabıyla oturum aç. Her cihazda eşitlemeyi bir kez aç; cevapların, destelerin, tercihlerin, Genki ilerlemen ve deneme geçmişin hesabına bağlı bulut kaydında birleşsin.','Sign in to the published site with the same ChatGPT account. Enable sync once on each device to combine answers, decks, settings, Genki progress and exam history in your account’s cloud record.')}</p><p class="data-sync-status" data-sync-status role="status">${esc(message())}</p>${meta.lastSyncedAt?`<p class="small muted">${T('Son eşitleme','Last sync')}: ${esc(stamp())}</p>`:''}<div class="button-row"><button type="button" class="btn primary" data-action="${meta.enabled?'data-sync':'data-setup'}" ${running?'disabled':''}>${meta.enabled?T('Şimdi eşitle','Sync now'):T('Eşitlemeyi kur','Set up sync')}</button>${meta.enabled?`<button class="btn secondary" data-action="data-pause">${T('Bu cihazda duraklat','Pause on this device')}</button>`:''}</div><p class="small muted">${T('İnternet kesilirse kayıtlar cihazda kalır. Uygulama açıkken yeniden denenir. Bildirim izni, takvim ayarı ve aktif turlar cihazda kalır. Bulut sınırı 1,8 MB.','Offline changes stay on this device and retry while the app is open. Notification permissions, calendar settings and active rounds stay local. Cloud limit: 1.8 MB.')}</p>${previewHTML}</section><section class="panel data-panel"><h2>${T('JSON yedeğini geri yükle.','Restore a JSON backup.')}</h2><p>${T('Eski Yomu dışa aktarımlarını veya yeni yedeklerini seç. Dosya önce bu tarayıcıda doğrulanır; onaylamadan hiçbir kayıt değiştirilmez. En fazla 8 MB.','Choose an old Yomu export or a new backup. The file is validated in this browser; nothing changes before confirmation. Maximum 8 MB.')}</p>${error?`<p class="data-error" role="alert">${esc(error)}</p>`:''}<label>${T('Yomu JSON dosyası','Yomu JSON file')}<input type="file" accept=".json,application/json" data-backup-file></label>${backupHTML}<div class="button-row"><button class="btn secondary" data-action="export">${T('Yeni JSON yedeği indir','Download new JSON backup')}</button>${recovery?`<button class="btn secondary" data-action="data-recovery">${T('Son geri yükleme öncesi kopyayı indir','Download copy from before last restore')}</button>`:''}</div></section>`;
 }
 const recomputeBackup=()=>{const candidate=backup.mode==='replace'?{snapshot:backup.snapshot,conflicts:[]}:mergeProjections(syncProjection(getState()),backup.snapshot,syncProjection(freshState()),{prefer:backup.prefer});backup.result=candidate.snapshot;backup.conflicts=candidate.conflicts;backup.localRevision=getState().revision;};
 async function click(target){
  const action=target.dataset.action;if(!action?.startsWith('data-'))return false;if(running||isBusy())return true;error='';
  try{
   if(action==='data-setup'){await syncNow({setup:true});return true;}if(action==='data-sync'){await syncNow();show();return true;}if(action==='data-confirm-sync'){await syncNow({confirm:true});return true;}
   if(action==='data-pause'){meta.enabled=false;await writeStoreMeta('cloud-sync',meta);plan=null;status='local';show();return true;}
   if(action==='data-cancel-sync'){plan=null;show();return true;}
   if(action.startsWith('data-prefer-')&&plan){plan=preview(syncProjection(getState()),plan.remote,{prefer:action.endsWith('local')?'local':'remote'});show();return true;}
   if(action==='data-cancel-backup'){backup=null;generation++;show();return true;}
   if(action.startsWith('data-backup-')&&backup){backup.prefer=action.endsWith('local')?'local':'remote';recomputeBackup();show();return true;}
   if(action==='data-restore'&&backup){
    if(backup.localRevision!==getState().revision)throw{code:'STALE'};if(backup.mode==='merge'&&backup.conflicts.length&&!backup.prefer)return true;
    const before=structuredClone(getState()),token=++generation;running=true;applying=true;
    try{
     await writeStoreMeta('restore-recovery',{application:'yomu',exportedAt:new Date().toISOString(),...before});recovery=true;
     if(getState().revision!==before.revision||generation!==token)throw{code:'STALE'};
     meta.enabled=false;await writeStoreMeta('cloud-sync',meta);
     if(getState().revision!==before.revision||generation!==token)throw{code:'STALE'};
     if(!await commit(applyProjection(before,backup.result)))throw{code:'STALE'};
    }finally{applying=false;running=false;}
    backup=null;plan=null;status='local';toast(ui().T('Yedek uygulandı. Önceki kayıtlarının kurtarma kopyası hazır.','Backup restored. A recovery copy of previous records is available.'));show();return true;
   }
   if(action==='data-recovery'){const value=await readStoreMeta('restore-recovery');if(value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='yomu-kurtarma.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}return true;}
  }catch(e){error=problem(e);show();}return true;
 }
 async function change(target){
  if(running||isBusy())return target.matches('[data-backup-file],[data-data-setting]');
  if(target.matches('[data-backup-file]')){
   const file=target.files?.[0],token=++generation;if(!file)return true;backup=null;error='';
   try{if(file.size>8_000_000)throw{code:'BACKUP_TOO_LARGE'};const value=parseBackup(await file.text());if(token!==generation)return true;backup={snapshot:syncProjection({...freshState(),...value}),name:file.name,mode:'merge',prefer:null};recomputeBackup();show();}catch(e){if(token!==generation)return true;error=problem(e);show();}return true;
  }
  if(target.dataset.dataSetting==='restore-mode'&&backup){backup.mode=target.value==='replace'?'replace':'merge';try{recomputeBackup();show();}catch(e){error=problem(e);show();}return true;}return false;
 }
 return{page,click,change,init,changed,syncNow,refresh};
}
