# Mimari ve tekrar kararı · 30 Ekim 2026

## 0.9.2 · Üretim açılış paketi

Kaynak ES modülleri ve stil dosyaları okunabilir halde kalır. build-hosted.mjs, esbuild ile tarayıcı grafiğini bir ESM dosyasına, HTML'deki sırayı koruyan CSS grafiğini tek stile dönüştürür. SHA-256 içerik karmaları paket URL'lerinin parçasıdır. HTML bu URL'leri kullanır; üretim Worker'ı ham /src modüllerini sunmaz. Node geliştirme sunucusunun --hosted seçeneği üretilmiş Worker'ı yerelde çalıştırır.

Gzip derleme anında hazırlanıp base64 olarak gömülür; Worker'da büyük ham metnin ikinci kopyası tutulmaz. Accept-Encoding gzip kabul ediyorsa baytlar encodeBody: manual ile aynen gönderilir. Gzip istemeyen istemciye DecompressionStream ile identity gövde sunulur. ETag aynı içeriğin kodlamaları arasında zayıf doğrulayıcıdır. HEAD gövdesiz, eşleşen If-None-Match 304'tür. İçerik karmalı paketler private/immutable; HTML, manifest ve reminders-sw.js private/no-cache kullanır. API yanıtları no-store kalır. Tarayıcı önbelleği uygulamaya ait kişisel verileri veya bulut API yanıtlarını içermez; yeni offline/service-worker cache katmanı yoktur.


## 0.9 · Kalıcı bulut kaydı ve kitap/deneme alanları

Yerel state şema 3 / IndexedDB sürümü 1 korunur. Genki ve deneme varsayılanları eklenir; deneme snapshotları `exam-schema.js` ile doğrulanır. Genki mini cevapları standart olay modelini kullanır; seviye denemeleri kendi sonuç geçmişini tutar, SRS olaylarına yapay cevap eklemez. Replikten kelime yakalama saf kişisel deste işlemlerini ve kaynak snapshotını kullanır.

`backup-schema.js`, dosya ve sunucu için ortak alan/boyut/kimlik/HTML güvenlik sınırıdır. `backup-data.js` kalıcı alanları projekte eder, eski snapshotların yokluğunu kayıt silme saymadan üçlü birleşim yapar. Aynı cevap ID’si tek kez sayılır, tekrar sayaçları/tarihleri birleşik olay sırasından hesaplanır. Aynı alanın iki bağımsız düzenlemesi tercih gerektirir; kişisel kaldırmalar tombstone olarak kalır. Yinelenen kelimeler tercih sonrası aktif/kaldırılmış olarak korunur. Nota özel değişiklik tekrar vadesini sıfırlamaz. JSON uygulaması mevcut yerel revision üzerinde CAS ile yapılır ve öncesi kurtarma kopyası tutulur.

`worker/sync.js` yalnız Sites tarafından doğrulanan `oai-authenticated-user-id` kimliğiyle GET/PUT kabul eder. E-posta veya istemciden gönderilen kullanıcı kimliği kullanılmaz. D1 sorguları kullanıcıya bağlı parametrelerle çalışır; PUT aynı origin ve JSON ister. `yomu_sync` satırındaki revision koşullu INSERT/UPDATE ile atomik artırılır, eski revision 409 alır. Request içinde DDL çalışmaz. `db/schema.ts` ve `npm run db:generate` ile üretilmiş `drizzle/` migrationları commit edilir; Sites yayın öncesi uygular. Manifest mantıksal `d1: DB` bağını bildirir; veritabanı kimliği/erişim anahtarı kaynakta yoktur.

`data-feature.js` ilk bağlantıda önizleme/onay, sonra gecikmeli yerel değişiklik ve görünür uygulamada 30 saniyelik kontrol kullanır. Yerel revision, ağ ve metadata await noktaları boyunca tekrar denetlenir. Bulut base ancak gelen kayıtlar yerel CAS ile uygulandıktan sonra kabul edilir; eşzamanlı cevap gelirse yeni önizleme/yeniden deneme yapılır. Base/tercih ve kurtarma kopyası ayrı IndexedDB metadata anahtarlarındadır, buluta gönderilmez. Aktif turlar ve yazı taslakları varken gelen birleşim ertelenir. Geri yükleme eşitlemeyi duraklatır. Worker çıktısı yalnız izinli tarayıcı dosyalarını ve sunucu kodunu içerir; QA kimliği, saat/ses taklitleri ve kişisel QA dosyaları pakete girmez.

Tek D1 satırının boyut sınırı altında kalmak için bulut snapshotı 1,8 MB ile sınırlıdır; JSON içe aktarma 8 MB sınırındadır. Bu sınırlar UI’da açıklanır. [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/).

## 0.8 · Kişisel desteler, zorlanma geçmişi ve dinleme

personal-data.js döngüsüz doğrulama/CSV/soru çözümleme/snapshot mantığını; personal-feature.js sayfa ve olay denetimlerini taşır. Kişisel sorular personal:<uuid>:<mode>, öğeler personal-<uuid> kimliğiyle kalır. Düzenlemelerde revision/soru içerik sürümü değişir; eski cevap olayları korunur, mevcut kişisel tekrarlar yeni içerik için yeniden vadesi gelmiş yapılır. Kelime kaldırma tombstone + beceri kartlarının suspension bilgisiyle geri alınabilir; uygulama çözülemeyen soruları tekrar kuyruğuna başlatmaz.

weakness-data.js tüm geçmişi öğe×beceri olarak toplar ve en son zorlanma tarihine göre sıralar. Gösterilen/yanlış/ipuculu olaylar ayrı sayılır; çift sayılan ipucu sütunları açıkça açıklanır. Varsayılan tüm geçmiş; yalnız son cevap veya son 30 gün filtreleri ayrıca seçilebilir. 5–10 soruluk tur gerçek adaylardan snapshot üretir. Dinleme, enjekte edilen özel renderer/gate/evidence olmadan asla normal kelime sorusu gibi gösterilip kaydedilmez. Eski/detached form kimlikleri ve asenkron gate sonrası değişmiş oturumlar reddedilir.

listening-data.js hazır ve kişisel açık kana okunuşlarından anlam/dikte soruları çözer. Beceri listening, soru kimliği listening:<source>:<wordId>:<mode>; öğe kimliği ilgili kelimeyle ortaktır, böylece okunuş/anlam/dinleme ayrı skillState olur. Kaynak sürümü soru sürümüne eklenir. Dikte kana varyantlarını kabul eder; kanji okunuşu tahmin edilmez. Yanlış çeldiriciler aynı okunuşlu kelimelerden seçilmez.

listening-feature.js doğal queued → speaking → aynı anahtarlı idle callback dizisini gerektiren bellek içi kapıyı yönetir. key:null iptal ve error tamamlanma değildir. Kanıt scope + soru kimliği + sürüme bağlıdır; başka tur/sorunun eski callback’i kapıyı açmaz. Oynatma tek başına DB’ye cevap yazmaz. Bir dinleme cevabı kaydedilirken audioPlaybackCompleted/audioSource/audioSpeed metadata’sı eklenir; bu insanın gerçekten duyduğunu kanıtlamaz. Cevap öncesi Japonca yazım/okunuş HTML’de gösterilmez. Ortak tekrar ve Zorlandıklarım aynı renderer/kapıyı kullanır. Yenileme geçici kanıtı temizler, tekrar dinlemek gerekir.

Şema 3 / IndexedDB sürümü 1 korunur; personal, weakness ve listening varsayılanları eklemeli birleştirilir. Feature form submit’leri native gezinmeyi engellemek için await öncesinde prefix’e göre yakalanır. Yeni özellikler üretilen Worker’a normal tarayıcı modülleri olarak gömülür. Kişisel kelimeler, CSV önizlemesi ve cevaplar sunucuya gönderilmez; ücretli ses/AI servisi kurulmadı. Mevcut cihaz sesi motorunun ağ davranışı ayrıca uygulama tarafından denetlenmez.

## 0.7.1 · Aynı sayfada görünümün korunması

view-state.js, render öncesinde data-scroll-key ile işaretlenen panellerin iki eksendeki kaydırmasını, data-disclosure-key ile işaretlenen details durumunu, sayfa konumunu ve uygulama içindeki odak kimliğini yakalar. Yeniden çizimden sonra önce açıklık/odak, sonra paneller ve sayfa kaydırması anlık olarak geri yüklenir. Odak preventScroll ile ve kendi tablo kapsamı içinde eşleştirilir. Kaldırılan/devre dışı öğeler sessizce atlanır. Yeni rotaya geçişte eski sayfanın görünümü taşınmaz. Görünüm verisi IndexedDB’ye yazılmaz; cevaplar ve çalışma seçimi normal kalıcı kayıt akışında kalır. study-select artık ayrıntı başlığına scrollIntoView çağırmaz; kullanıcı liste içinde seçim yapmaya devam edebilir.

## 0.7 · Kelime seslendirme

word-speech.js mevcut içerikteki kana okunuşunu NFKC ile normalleştirip doğrular. Kanji/Latin yazımından tahmin yapmaz. Aynı modül kart/quiz denetimlerini üretir ve tek Web Speech oynatıcısını yönetir. Japonca ses bulunmazsa başka dilde sese düşmez. Başarılı seçimde normal 1 veya yavaş 0,65 hız kullanılır. voiceschanged, sonradan yüklenen Japonca seslerle düğmeleri günceller. Kuyruğa alma, başlangıç, bitiş, hata ve iptal durumları ayrı tutulur; revision eski sesin callback’lerinin yeni kelimenin durumunu bozmasını engeller. Utterance tamamlanana kadar referansı korunur.

Mevcut metin seslendirmesi de aynı oynatıcıyı kullanır; bir kelime/metin başlatmak öncekini durdurur. Yeni sayfa/kart çizimi ve pagehide/visibilitychange sesi keser. Düğme durumu ve mesaj yalnızca ilgili DOM alanlarında güncellenir; ses başlatmak veya durdurmak cevap alanını yeniden oluşturmaz. Sentez doğrudan kullanıcı tıklamasında çağrılır; ardından gerekiyorsa ipucu isteği IndexedDB’ye yazılır. Yeni ücretli sağlayıcı, sunucu ses uç noktası veya uygulama ses dosyası yoktur. Cihaz ses motorunun kendi ağ davranışı uygulama tarafından denetlenmez.

Cevap öncesinde kabul edilen oynatma isteği oturumdaki pronunciationHintIds listesine, sonraki olayın pronunciationHintRequested alanına aktarılır. Bu alan teslim/dinleme kanıtı değildir. Kart inceleme ve cevap sonrası dinleme yeni cevap olayı üretmez. Dinleme becerisi hâlâ ölçülmez. Şema 3 ve mevcut veriler korunur; yeni alanlar isteğe bağlıdır.

## 0.6 · Okunuş, kaynaklı kanji ve hatırlatıcı

reading-ui.js soru/kart yazımını kaçırır ve Han karakterlerini bağımsız erişilebilir düğmelere dönüştürür. Okunuş ipucu güncellemesi yalnızca ilgili satırı/düğmeyi değiştirir; cevap alanı yeniden oluşturulmaz. Cevap sonrası kana her iki sonuçta görünür. Kelime meta verisi study-data/content çözümleyicilerinden gelir; cümle okunuşu otomatik üretilmez. Yeni kelime/tekrar olaylarına readingHintShown eklenir; geçmiş cevaplar değiştirilmez.

kanji-info.js sabit kanjiapi.dev ve KanjiVG GitHub uçlarından seçilen tek karakter için veri ister. Yanıttaki karakter kimliği ve alan tipleri doğrulanır. SVG çalıştırılmaz veya DOM’a eklenmez; yalnızca sınırlandırılmış g/path öznitelikleri okunur. Tam olmayan gruplar açıkça etiketlenir. phon özniteliğinden ses/köken çıkarımı yapılmaz. En fazla sekiz doğrudan bileşenin sözlük anlamı ayrıca alınır. Bellek önbelleği 24 saat ve 500 karakterle sınırlıdır; çevrimdışı sözlük kopyası tutulmaz. Özel oluşum notları yalnızca üç bağlantılı Kanjipedia maddesine dayanır. Kaynaklardan biri çalışmazsa diğeri gösterilebilir; bilgi uydurulmaz. Bu, insan editörü doğrulaması veya kusursuzluk garantisi değildir.

Şema 3 ve IndexedDB sürümü 1 korunur. settings.questionReadings ve reminder alanı eklemeli varsayılan birleştirmesiyle yüklenir; mevcut kullanıcıda hatırlatıcı kapalı başlar. Yerel saat HH:mm, son tetiklenen yerel tarih ve takvim UID’si cihazda tutulur. 15 saniyelik ön plan kontrolü yalnızca seçilen dakikada, görünür belgede çalışır. CAS kaydı bildirimden önce tamamlanır; iki sekmenin aynı günü iki kez işaretlemesi engellenir. OS bildiriminin teslim garantisi verilmez.

reminders-sw.js yalnızca kullanıcı izniyle kaydedilir; gösterilen bildirime tıklanınca aynı kökendeki çalışma alanını açar/odaklar. Push handler, ağdan push kaydı, sunucu zamanlayıcısı, harici bildirim hesabı veya offline cache yoktur. Google Takvim taslağı kaydedilmez; ICS günlük yerel saatli olay ve VALARM içerir. Dış takvim kaydının oluşturulması/kaldırılması kullanıcının takvimindedir. Önceki 0.5 service worker kapsamı açıklaması bu sürümde yalnızca offline/push için geçerlidir.

## 0.5.1 · Sunucu kotasında tarayıcı yolu

Gerçek bulut isteğinde sağlayıcı 429/QUOTA döndürürken cihaz bağlantısında 200 görüldü. translation-client.js önce aynı kökendeki API’yi çağırır; yalnızca bu açık kota hatasında, sabit MyMemory /get adresine tarayıcıdan gider. Başka hatalar doğrudan dış isteğe dönüşmez. Bütün doğrudan isteklerde de aynı doğrulama, ara dil, zaman aşımı ve iptal sinyalleri kullanılır. Asıl ortak mantık dist/src/translation-core.js içindedir; scripts/translation-core.mjs uyumluluk dışa aktarımıdır. Worker derlemesi aynı ortak dosyayı gömer.

## 0.5 · HTTPS üzerinde yayın

Mevcut Node sunucusu yerel kullanım için korunur. translation-core.mjs saf doğrulama/sağlayıcı mantığını tutar; Buffer.byteLength yerine TextEncoder kullanıldığı için Node ve Worker aynı kuralları paylaşır. translation.mjs Node HTTP uyarlamasını ve eski dışa aktarımları korur. worker/index.js Web Request/Response akışını kullanır; beklenen Origin, isteğin HTTPS origin’iyle karşılaştırılır. Çeviri uç noktasında 4000 bayt gövde ve 500 UTF-8 bayt metin sınırı, JSON/yöntem kontrolleri sürer.

build-hosted.mjs, izin verilen dist kök dosyaları ve dist/src modüllerini tek, bağımsız ES modülüne gömer. Build çıktıları dist/server ve dist/.openai altındadır; mevcut dist kaynakları silinmez ve üretilen çıktı tekrar içine alınmaz. Worker içinde Node modülü veya filesystem çağrısı yoktur. Yalnızca gömülü yollar sunulur; Git metadata’sı, README, testler ve sunucu kaynakları erişilemez. Hosting manifesti kayıtlı Sites proje kimliğini içerir; statik yayın olarak etiketlenmez.

Sites katmanı owner-only erişimi uygular. Uygulama ayrıca hesap/parola/eşitleme servisi kurmaz. Tarayıcı verileri cihaz ve origin’e bağlıdır; bulutta kayıt tutulduğu iddia edilmez. manifest.webmanifest ana ekrana ekleme görünümünü destekler; service worker ve çevrimdışı çalışma kapsam dışıdır.

## 0.4 ekleri

study-expansion.js özgün ek satırları; kanji-expansion.js 30 yeni bağlam kelimesini içerir. study-data.js eski dizilere ekleme yaparak 200 kelime, 120 cümle, 50 gramer konusu üretir. Eski kimlikler korunur. Kelime okunuşlarında katakananın hiraganaya dönüştürülmüş eşdeğeri de kabul edilir; anlam seçeneği veya kanji karakteri romajiye dönüştürülmez. çalışma paketi sürümü study-2026-10-31.2, karakter paketi characters-2026-10-31.2 olur. Olayların geçmiş içerik sürümleri değiştirilmez. Şema 3 ve veritabanı sürümü 1 kalır.

studyStats ve characterPool üzerinden görünen sayıların veri kaynağından türetilmesi, kitaplık büyüdükçe ekranda eski sabit sayıların kalmasını önler. N5–N1 etiketleri yaklaşık çalışma bantları; harf atölyesindeki başlangıç/orta/zor ise ayrı, kümülatif seçimlerdir. Yeni içerik tamamen yerel çalışır; yayıncı içeriği indirme/servis bağımlılığı eklenmez.

## 0.3 ekleri

Güncel durum şema 3’tür; IndexedDB sürümü 1 kalır. learning alanında vocabulary/sentences/grammar için ayrı düzey, konu/ortam, arama, seçili kart ve okunuş tercihleri bulunur. Bir ortak çalışma oturumu, başlarken karıştırılmış en fazla 10 soru kimliğini saklar; filtreler değişince bu oturum sessizce değişmez. Yeni tur açıkça başlatılır. Şema 1/2 kayıtları derin varsayılan birleştirmesiyle taşınır; cevaplar, tekrar aralıkları ve harf/anime oturumları korunur.

study-data.js özgün 60 kelime, 40 cümle ve 25 gramer konusunu içerir. study-flow.js seçki/oturum/kaydetme kararları, study-ui.js üç ekran ve ana sayfa bağlantıları içindir. study:<kind>:<itemId>:<mode> kimlikleri content.getQuestion üzerinden ortak tekrar kuyruğunda çözülür. study- öneki eski sözlük kimlikleriyle çakışmayı önler. Anlam/okunuş/Japonca yazma ayrı becerilerdir; cümle ve gramer yalnızca kontrollü boşluk doldurmadır. Kaydetme cevap olayı üretmez, mevcut aralıkları sıfırlamaz. Yeni paketin içerik sürümü study-2026-10-31.1’dir.

Yeni üç modül harici ağ isteği gerektirmez. Düzeyler yaklaşık çalışma bantlarıdır; dil editörü doğrulaması ve resmî müfredat eşlemesi iddiası yoktur. Aşağıdaki 0.2/0.1 kararları tarihsel kayıttır.

## 0.2 ekleri

Önceki kararların tarihsel kaydı aşağıda korunur. Uygulama durumu şema 2'dir; veritabanı sürümü 1 kalır ve hydrateState eski cevapları/tercihleri koruyarak yeni practice/anime alanlarını ekler. Karakter ve anime soruları sürümlü, kararlı kimliklerle aynı cevap/tekrar modelinde çözülür; cevap türü tanıma ve klavyeyle geri çağırmayı ayırmak için olayda tutulur.

Sunucu artık statik dosyalara ek olarak sabit MyMemory /get hedefine POST /api/translate aracılığı yapar. İstek UTF-8 bayt/paragraf/dil çifti kontrolü ve zaman aşımı içerir. Cross-origin tarayıcı istekleri reddedilir; anahtar gerektirmez, metin veya sonuç loglanmaz. TR↔JA iki adımda İngilizce üzerinden çevrilir; ara dil yolu sonuçta gösterilir. Çeviri hiçbir alıştırmanın puanlamasına bağlanmaz.

YouTube IFrame API ve oynatıcı yalnızca kullanıcının kesiti açmasıyla dış kaynaktan yüklenir. Gerçek medya indirilmez veya yerel olarak dağıtılmaz. Bir doğrulanmış kısa altyazı aralığı getCurrentTime ile eşlenir; diğer kartlarda otomatik zaman eşlemesi iddia edilmez. Harici hizmetler nedeniyle 0.1'deki “hiç harici istek yok” sınırı artık yalnızca yerel karakter/okuma/tekrar modülleri için geçerlidir.

## Geri alınabilir başlangıç kararları

Üç metinlik doğrulama paketinde framework ve backend olmadan ES modülleri; IndexedDB'de tek sürümlü durum kaydı. Bu, veri modelindeki varlıkları birleştirmez: sözlük, okunuş, anlam, cümle, gramer, içerik sürümü, cevap olayı ve beceri durumu ayrı kimliklere sahiptir. Küçük veri kümesinin tümü tek IndexedDB işlemiyle kaydedilir. Hacim büyürse ayrı store'lara ayrılabilir.

```text
content.js → app.js → model.js (saf kararlar) → storage.js (IndexedDB)
                           ↓
                    cevap olayları + beceri durumları
```

`lexeme.id` yazım metninden farklıdır. Her kelimenin `readings[].id` ve `senses[].id` alanı vardır. `sentence.id` ve `grammarPoint.id` ayrı kalır. İçerik `2026-10-30.1` sürümünde donduruldu; gelecekte cevap anahtarı değişince yeni sürüm gerekir. Ses varlığı sağlanmadığından gerçek `audio_segment` kaydı yoktur; kaynak metadata'sındaki `audio` null'dır.

`review_event`: UUID, soru/öğe kimliği, beceri, girilen cevap, değerlendirme, dil, zaman damgası, cevap gününün saat dilimi, içerik ve algoritma sürümü, mod ve sınırlandırılmış soru süresi. Soru süresi sayfa üzerinde geçen süredir; aktif öğrenme dakikası iddiası olarak kullanılmaz. Aynı UUID yeniden uygulanmaz. Şimdiki istemci UUID'yi kendisi üretir; sunucu/eşitleme yoktur.

`skill_state`: öğe × beceri, soru bağlantısı, son cevap, deneme/doğru sayıları, basamak, sonraki zaman, kullanıcının askıya alma seçimi. Anlam, okunuş, dinleme ve yazılı tamamlama ayrı anahtarlanır. Kaydedilen kelime 0 denemeli iki kart oluşturur. Bilineni atlama ayrı kullanıcı kararıdır.

`storage.revision`: readwrite işleminde önce mevcut sürüm okunur, eşleşirse tüm durum yazılır. İşlem tamamlanmadan arayüz durumunu ilerletmez. Eski sekme sessizce veri kaybettirmek yerine yenileme ister. Çakışma birleştirme/senkronizasyon değildir. Şema sürümü 1; henüz bir önceki yayımlanmış şemadan göç gerekmiyor.

## FSRS uygulaması ve lisans değerlendirmesi

İncelenen mevcut JavaScript/TypeScript adayı: [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs). Resmî [lisans dosyası](https://github.com/open-spaced-repetition/ts-fsrs/blob/main/LICENSE) MIT lisansıdır; kullanılırsa telif/lisans metni dağıtımda korunmalıdır. İnceleme tarihi 30.10.2026. Bu projeye FSRS kodu, paketi veya varsayılan parametreleri alınmadı; üretim bağımlılığı ve sabitlenmiş FSRS sürümü yoktur.

Resmî [dokümantasyon](https://open-spaced-repetition.github.io/ts-fsrs/) zamanlayıcıyı, parametre optimizasyonunu ve değerlendirmeyi ayırır. Yeni bir kullanıcıda gerçek kişiselleştirme geçmişi bulunmaz. Bu sürümün ilk doğrulama sorusu okuma → açıklama → üretim → tekrar akışının kullanılabilirliğidir. Basit planın zaman ve yanlış davranışını görünür tutarak içerik/etkileşim sorunlarını incelemek tercih edildi. Bu karar FSRS'nin yararsız olduğu veya sabit planın daha iyi öğrendiği iddiası değildir.

Şimdiki plan: yanlışta 10 dakika; doğru serisinde 1/3/7/14/30 gün; gün 24 saat. Geçmişin tamamını optimize etmez, unutma eğrisi veya hedef hatırlama olasılığı tahmin etmez. Sabit aralıkların bu kullanıcı kitlesinde öğrenme etkisi ölçülmedi.

İleride algoritma `model.schedule` yerine bir adapter ile takılabilir. Entegrasyondan önce kesin paket sürümü ve dağıtım dosyaları sabitlenmeli; olaylar FSRS notlama ölçeğine açıkça eşlenmeli, varsayılan parametre ile kişisel optimizasyon ayrılmalı ve saat/yanlış/gecikme/göç senaryoları test edilmelidir. Uygulama şu an yalnızca doğru/yanlış toplar; geçmiş verilerden kendiliğinden “Again/Hard/Good/Easy” öz değerlendirmesi çıkarılmamalıdır.

## Güven sınırları

Sunucu yalnızca `127.0.0.1` dinler, `dist/` dışına yol geçişini reddeder. Hesap, token veya uzaktaki kullanıcı verisi yok. Kullanıcı cevabı ve sorun notu HTML'e eklenmeden kaçırılır. Harici içerik/analitik/script/font isteği yok. Sentetik ses tarayıcı/işletim sistemine bağlıdır; ses sağlayıcısının çevrimdışı olduğu garanti edilmez.

İçe aktarma, depolama göçleri, büyük olay günlüklerinin performansı, veri şifreleme, çok cihaz ve gerçek sunucu çatışmaları bu prototipin dışında. Üretime geçmeden ayrıca tasarlanmalıdır.
