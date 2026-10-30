let apiPromise;
function youtubeAPI() {
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(!apiPromise)apiPromise=new Promise((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{previous?.();resolve(window.YT);};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;
  script.onerror=()=>{apiPromise=null;reject(new Error('PLAYER_UNAVAILABLE'));};document.head.append(script);
 });
 return apiPromise;
}
export function mountClip(container,quote,{T,esc}) {
 let disposed=false,player,timer;
 const watch=`https://www.youtube.com/watch?v=${quote.videoId}${quote.clipStart?'&t='+quote.clipStart+'s':''}`;
 const options=[['tr','Türkçe'],['ja','日本語'],['en','English']];
 container.innerHTML=`<div class="video-mount" id="anime-video"></div><div class="clip-caption-controls"><label>${T('Çalışma altyazısı','Study caption')}<select id="clip-caption-language">${options.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label><span class="small muted">${quote.cue?.verified?T('Doğrulanmış kısa satır · eşzamanlı','Verified short line · synchronized'):T('Zaman eşlemesi yok · ayrı çalışma metni','Not time-aligned · separate study text')}</span></div><div id="clip-study-caption" class="clip-study-caption" aria-live="off"></div><p id="clip-status" class="small muted">${T('YouTube oynatıcısı yükleniyor…','Loading YouTube player…')}</p><a class="subtle-link" target="_blank" rel="noopener noreferrer" href="${watch}">${T('Video açılmazsa YouTube’da izle','If unavailable, watch on YouTube')} ↗</a>`;
 const caption=container.querySelector('#clip-study-caption'),select=container.querySelector('#clip-caption-language');
 select.value=document.documentElement.lang==='en'?'en':'tr';
 const draw=()=>{
  if(disposed || !container.isConnected)return;
  const cue=quote.cue;
  if(cue?.verified){const time=player?.getCurrentTime?.() || 0;caption.hidden=!(time>=cue.start && time<=cue.end);}else caption.hidden=false;
  const text=select.value==='ja'?quote.text:quote.translation[select.value];
  caption.textContent=text;caption.lang=select.value;
 };
 select.addEventListener('change',draw);draw();
 const fail=()=>{if(disposed || !container.isConnected)return;const status=container.querySelector('#clip-status');status.textContent=T('Bu ortamda video yüklenemedi. Yayıncı bağlantısını kullanabilirsin.','Video could not load here. You can use the publisher link.');};
 // The external player is loaded only after an explicit click. No media files are copied.
 const timeout=setTimeout(fail,15000);
 youtubeAPI().then(YT=>{
  if(disposed || !container.isConnected)return;
  player=new YT.Player('anime-video',{host:'https://www.youtube-nocookie.com',videoId:quote.videoId,playerVars:{origin:location.origin,playsinline:1,cc_load_policy:1,cc_lang_pref:'en',rel:0,start:quote.clipStart || 0,...(quote.clipEnd?{end:quote.clipEnd}:{})},events:{onReady:()=>{clearTimeout(timeout);container.querySelector('#clip-status').textContent=T('Yayıncının oynatıcısındaki oynat düğmesine bas.','Press play in the publisher’s player.');timer=setInterval(draw,200);draw();},onError:()=>{clearTimeout(timeout);fail();}}});
 }).catch(fail);
 return ()=>{disposed=true;clearTimeout(timeout);clearInterval(timer);player?.destroy?.();};
}
