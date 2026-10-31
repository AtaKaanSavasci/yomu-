export const defaultReminder=()=>({enabled:false,time:'19:00',lastFired:null,calendarUid:null});
export const validReminderTime=value=>typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const pad=n=>String(n).padStart(2,'0');
export const localDateKey=date=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
export function reminderDue(config,now=new Date()) {
 if(!config?.enabled||!validReminderTime(config.time))return null;
 const day=localDateKey(now),minutes=now.getHours()*60+now.getMinutes(),[hour,minute]=config.time.split(':').map(Number);
 return config.lastFired!==day&&minutes===hour*60+minute?day:null;
}
export function nextReminderDate(time,now=new Date()) {
 if(!validReminderTime(time))throw Error('Invalid time');const [hour,minute]=time.split(':').map(Number),date=new Date(now);
 date.setHours(hour,minute,0,0);if(date<=now)date.setDate(date.getDate()+1);return date;
}
const icsEscape=value=>String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function foldLine(line){let out='',current='',bytes=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(bytes+n>75){out+=current+'\r\n';current=' ';bytes=1;}current+=c;bytes+=n;}return out+current;}
export function reminderCalendar({time,title='Yomu · Japonca çalışma zamanı',url,uid=crypto.randomUUID(),now=new Date()}) {
 const target=new URL(url);if(!['https:','http:'].includes(target.protocol))throw Error('Invalid calendar URL');
 const start=nextReminderDate(time,now),stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const dateTime=date=>`${localDateKey(date).replace(/-/g,'')}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
 const end=new Date(start.getTime()+10*60000),description=`Japonca pratiğine küçük bir zaman ayır. ${target.href}`;
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Yomu//Study Reminder//TR','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${icsEscape(uid)}@yomu`,`DTSTAMP:${stamp}`,`DTSTART:${dateTime(start)}`,`DTEND:${dateTime(end)}`,'RRULE:FREQ=DAILY',`SUMMARY:${icsEscape(title)}`,`DESCRIPTION:${icsEscape(description)}`,`URL:${target.href}`,'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:PT0S',`DESCRIPTION:${icsEscape(title)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'];
 return lines.map(foldLine).join('\r\n')+'\r\n';
}
export function googleReminderUrl({time,url,title='Yomu · Japonca çalışma zamanı',now=new Date()}) {
 const date=nextReminderDate(time,now),end=new Date(date.getTime()+10*60000),format=d=>`${localDateKey(d).replace(/-/g,'')}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
 const result=new URL('https://calendar.google.com/calendar/render');
 result.searchParams.set('action','TEMPLATE');result.searchParams.set('text',title);result.searchParams.set('dates',`${format(date)}/${format(end)}`);result.searchParams.set('ctz',Intl.DateTimeFormat().resolvedOptions().timeZone);result.searchParams.set('recur','RRULE:FREQ=DAILY');result.searchParams.set('details',`Japonca çalışma zamanı. ${new URL(url).href}`);return result.href;
}
export function notificationSupport(){return typeof Notification!=='undefined'&&'serviceWorker' in navigator;}
export async function requestReminderPermission(){
 if(!notificationSupport())return 'unsupported';
 const permission=await Notification.requestPermission();if(permission==='granted')await navigator.serviceWorker.register('/reminders-sw.js',{scope:'/'});return permission;
}
export async function showReminderNotification(title,body){
 if(!notificationSupport()||Notification.permission!=='granted')return false;
 const registration=await navigator.serviceWorker.getRegistration('/');if(!registration)return false;
 await registration.showNotification(title,{body,tag:'yomu-study-reminder',icon:'/favicon.svg',data:{url:'/#today'}});return true;
}
export function reminderSettings(state,{T,esc}) {
 const c=state.reminder,supported=notificationSupport(),permission=supported?Notification.permission:'unsupported';
 const labels={granted:T('Tarayıcı izni açık.','Browser permission granted.'),denied:T('Tarayıcı izni kapalı. Değiştirmek için sitenin bildirim ayarını kullan.','Browser permission denied. Use the site notification settings to change it.'),default:T('Tarayıcı bildirimi için izin verilmedi.','Browser notifications have not been enabled.'),unsupported:T('Bu tarayıcıda bildirim desteği yok. iPhone’da ana ekrana eklenmiş web uygulaması gerekir.','Notifications are unavailable in this browser. On iPhone, use the web app added to the Home Screen.')};
 return `<section class="panel reminder-panel" id="study-reminders"><h2>${T('Çalışma hatırlatıcısı','Study reminder')}</h2><p>${T('Günlük saatini ve dakikanı seç. Saat, bu cihazın yerel saatidir.','Choose your daily hour and minute. Times use this device’s local clock.')}</p><form data-form="reminder-settings"><div class="reminder-fields"><label>${T('Her gün saat','Every day at')}<input type="time" name="time" required value="${esc(c.time)}"></label><label class="toggle"><input type="checkbox" name="enabled" ${c.enabled?'checked':''}><span>${T('Yomu açıkken hatırlat','Remind while Yomu is open')}</span></label><button class="btn primary" type="submit">${T('Hatırlatmayı kaydet','Save reminder')}</button></div></form><p class="reminder-status" role="status">${c.enabled?`${T('Açık','Enabled')} · ${esc(c.time)}`:T('Hatırlatıcı kapalı.','Reminder disabled.')} ${esc(labels[permission])}</p><p class="small muted">${T('Bu sürüm yalnızca Yomu açık ve görünürken saat kontrolü yapar. Kapalıyken, telefon uyurken veya tarayıcı askıya alınmışken web bildirimi göndermez. İzin yoksa uygulama içinde mesaj gösterir.','This version checks the time only while Yomu is open and visible. It does not send web notifications when closed, the phone is asleep or the browser is suspended. Without permission it shows an in-app message.')}</p><div class="button-row"><button class="btn secondary" data-action="reminder-permission" ${!supported||permission==='denied'?'disabled':''}>${T('Tarayıcı bildirimine izin ver','Enable browser notifications')}</button><button class="btn secondary" data-action="reminder-test">${T('Hatırlatmayı dene','Test reminder')}</button></div><details><summary>${T('Uygulama kapalıyken telefonum hatırlatsın','Remind me when the app is closed')}</summary><p>${T('Günlük etkinliği telefon takvimine ekleyebilirsin. Google Takvim’de kaydetmeden önce bildirimi “Etkinlik saatinde” seç. ICS dosyası aynı anda alarm içerir; içe aktarma ve uyarı desteği takvim uygulamana bağlıdır. Takvimde ekleme işlemini sen tamamlamalısın.','You can add a daily event to your phone’s calendar. In Google Calendar, choose a notification at the event time before saving. The ICS file includes an alarm at the event time; import and alert support depend on your calendar app. You must complete adding the event.')}</p><div class="button-row"><button class="btn secondary" data-action="reminder-google">Google ${T('Takvim’de hazırla','Calendar draft')}</button><button class="btn secondary" data-action="reminder-ics">${T('Takvim dosyasını indir (.ics)','Download calendar file (.ics)')}</button></div><p class="small muted">${T('Önce yukarıdaki saati kaydet. Takvim saati telefon takviminin saat dilimine göre yorumlanır. Yomu’daki değişiklik mevcut takvim kaydını otomatik değiştirmez.','Save your time above first. The calendar time is interpreted in your phone calendar’s time zone. Changing Yomu does not automatically update an existing calendar event.')}</p></details><details><summary>${T('Kapalıyken doğrudan web bildirimi','Direct web push while closed')}</summary><p>${T('Henüz bir web push sağlayıcısı bağlanmadı; bu özellik etkin değildir. OneSignal gibi bir hizmetin ücretsiz planıyla bağlantı kurulabilir. Hesap/uygulama ayarları ve telefonda bildirim izni gerekir.','A web push provider has not been connected; this feature is not active. It can be connected using a service’s free plan, such as OneSignal. Account/app configuration and phone notification permission are required.')}</p><a href="https://onesignal.com/blog/which-onesignal-plan-is-best-for-you/" target="_blank" rel="noopener noreferrer">OneSignal · ${T('Plan bilgisi','Plan information')} ↗</a></details></section>`;
}
