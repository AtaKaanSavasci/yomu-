# Yomu · Japonca çalışma alanı

**0.9.0 · 5 Kasım 2026** — Cihazlar arası eşitleme, JSON yedeğini geri yükleme, Genki çalışma yolu, replikten desteye kelime ve N5–N1 süreli denemeler.

## 0.9 · Kitabın, destelerin ve cihazların birlikte

- **Eşitleme:** Tercihler ve veriler → Eşitlemeyi kur. Yayımlanan sitede aynı ChatGPT hesabıyla giriş yapıp her cihazda önizlemeyi onayla. Cevaplar, kişisel desteler, tekrar kartları, tercihler, kişisel replikler, Genki tamamlama işaretleri ve deneme geçmişi hesaba bağlı D1 kaydında birleştirilir. İnternetsiz değişiklikler yerelde bekler; uygulama açıkken yeniden denenir. Aktif turlar, bildirim/takvim ayarları ve ekran seçimleri aktarılmaz. Yazarken veya aktif bir turdayken gelen değişiklikler ertelenir. Aynı alan düzenlendiyse cihaz/bulut tercihi istenir; birleştirmede eksik kayıt silme sayılmaz. Aynı kelime bağımsız eklenmişse tercih edilmeyen kopya kaldırılanlara alınır, geçmişi korunur. Bulut snapshot sınırı 1,8 MB; aşılırsa yerel veriler korunur ve JSON yedeği alınabilir.
- **Yedekten geri yükleme:** Eski Yomu JSON dışa aktarımları da desteklenir (en fazla 8 MB). Dosya/alan doğrulaması → kayıt sayıları → birleştir veya bu cihazı değiştir → açık onay. Uygulama öncesinde bu cihazda kurtarma kopyası saklanır ve indirilebilir. Aktif turlar sıfırlanır; eşitleme bu cihazda duraklatılır. Hatalı, gelecekteki şemaya ait veya güvenli olmayan içerik kısmen uygulanmaz.
- **Genki yolu:** GENKI I ders 1–12 ve GENKI II ders 13–23 için 3. baskı sırasıyla hazırlanmış 23 özgün TR/EN rehber, kana örnekleri ve birer mini pratik. Kaldığın ders ve kişisel tamamlama işaretleri; ilgili Yomu içeriklerine ve kendi `genki-3-l01` … `genki-3-l23` etiketli destelerine geçiş vardır. Kitap metinleri, alıştırmaları, kelime listeleri ve cevap anahtarları kopyalanmaz. Başka baskılar eşleştirilmedi. [Kaynak ve kapsam](docs/sources-genki.md).
- **Replikten kelime:** Anime sayfasındaki altı çizili, kaynakla desteklenen altı kelimeye dokun; okunuş/anlam/kısa bağlamı incele ve bir deste seçerek onayla. Replik, özgün kaynak bağlantısı ve sözlük bağlantısı tarihsel `sourceSnapshot` içinde saklanır. Sonraki kişisel düzenleme bu kaynak kopyasını değiştirmez. Kişisel repliklerde okunuş ve anlam kullanıcı tarafından girilir; otomatik kanji okunuşu veya kelime ayırma yoktur. Kaydetmek yeni cevap/başarı üretmez.
- **Seviye denemeleri:** N5–N1 için 8 kelime, 6 gramer ve seviyenin özgün okuma metnine bağlı 6 anlama sorusu. Japonca cihaz sesi varsa isteğe bağlı 4 kelime dinleme sorusu eklenir. 10/20/30/45 dakika; yenileme süreyi yeniden başlatmaz. Serbest soru gezinmesi, kayıtlı cevaplar, bitişte bölüm bazlı doğru/yanlış/boş/yapılmadı ve açıklamalı inceleme vardır. Son 30 sonuç tutulur ve eşitlenebilir. Resmî JLPT soruları veya ölçeklenmiş geçme/yeterlik puanı kullanılmaz; normal SRS olayları değişmez. [Kapsam](docs/sources-exams.md).

156/156 otomatik test, JavaScript kontrolü ve 55 tarayıcı varlıklı Worker derlemesi başarılı. Gerçek UI’da Genki/anime/deneme/yedek akışları; iki ayrı yerel origin ve aynı SQLite veritabanıyla çift yönlü eşitleme denendi. Yerel eşitleme QA’sı simüle edilmiş kullanıcı kimliğini açıkça işaretler; üretim girişinin veya fiziksel telefonun doğrulanması anlamına gelmez. [Doğrulama kaydı](docs/qa.md).

## 0.8.1 · Daha rahat gezinme ve çalışma

Telefon ve tablette **Bölümler → Tümü** menüsü bütün sayfaları açar; bulunduğun bölüm adı ve seçili bağlantı görünür. Mobil alt menü beş sık kullanılan alanı daha okunur etiketlerle gösterir. Masaüstündeki yinelenen üst bağlantılar kaldırıldı; tablet ikonlarına erişilebilir adlar ve açıklamalar eklendi. Düğme/form alanları büyütüldü, metin kontrastı artırıldı ve telefonun alt güvenli alanı için yer ayrıldı.

Kişisel kelime formu gerekli alanlar ve isteğe bağlı ayrıntılar olarak bölümlendi. Uzun CSV/deste yönetimi açılır bölümlerde kalır. Zorlandıklarım filtreleri, çalışılabilir soru sayısı ve geçmişin ayrı sayaçları daha net görünür. Dinleme ayarları tur başlayınca kapanır; açıp düzenlenebilir, devam eden turun soruları aynı kalır.

## 0.8 · Sana ait çalışma alanları

**Zorlandıklarım / Destelerim / Dinleme** alanlarına yan menüden, telefon/tablet Bölümler menüsünden veya ana sayfadaki başlangıç kartlarından ulaşılır. Bu üç alan arasında kısa geçiş bağlantıları da vardır. Mevcut harf, kelime, cümle, gramer, anime ve tekrar alanları korunur.

- **Zorlandıklarım:** Tüm cevap geçmişini öğe × beceri olarak toplar. Yanlış, cevap gösterimi, ipucu kullanımı ve ipucusuz doğruyu ayrı gösterir; ipucu sütunu diğerleriyle kesişebilir. Sonradan doğru cevap vermek önceki yanlışları silmez. İçerik, beceri, zorlanma türü ve geçmiş filtrelerinden 5 veya 10 soruya kadar bir tur başlatılır. Sorular başlangıç seçkisi/sürümüyle dondurulur; normal tekrar vadesini beklemek gerekmez. Bu sıralama bir ustalık veya JLPT tahmini değildir.
- **Destelerim:** Deste oluştur/adını değiştir; kelime, kana okunuşu, Türkçe anlam, isteğe bağlı İngilizce anlam, etiket, örnek ve not ekle. Genki kitabının/bölümünün adını kendi etiketin olarak kullanabilirsin. Kelimeler kullanıcı içeriğidir; otomatik çevrilmez veya editör onaylı sayılmaz. Anlamını, okunuşunu ve Japonca yazımını ayrı çalışabilir; normal tekrar listesine kaydedebilirsin. Düzenleme eski cevapları değiştirmez. Kaldırılan kelimeler geri alınabilir; geçmiş cevapları silinmez.
- **CSV:** Destelerim içinde örnek dosya indir veya bir CSV dosyası/metni seç. En fazla 1 MB / 1000 satır; gerekli sütunlar `written,reading,tr`, isteğe bağlı `en,deck,tags,notes,example,level`. Önce satırları ve hataları önizle, sonra eklemeyi onayla. Tek hatalı satır varsa hiçbir kelime eklenmez. Dosya yalnızca tarayıcıda okunur. Seçili kelimeler CSV olarak da dışa aktarılabilir; formül benzeri alanlar elektronik tablo için korunur. JSON dışa aktarma desteleri de içerir; JSON yedeğini geri yükleme henüz yoktur.
- **Dinleme:** Hazır kelimeler veya kişisel destelerden anlam seçme/kana dikte turu oluştur. Japonca yazım cevap verilene kadar gizlidir. Sesi en az bir kez tamamlamadan cevap kaydedilmez. İptal, eksik oynatma veya hata yeni dinleme cevabı üretmez. Cevaptan sonra yazım, okunuş ve anlam açılır; cevap dinleme becerisi olarak ayrıca zamanlanır. Aynı ses kuralı normal tekrar ve Zorlandıklarım içindeki dinleme sorularında da uygulanır.

Dinleme cihazın/tarayıcının Japonca sentetik sesine bağlıdır. Japonca ses yoksa dinleme turu başlatılamaz; başka dilde ses kullanılmaz. Yeni ücretli API/hesap veya ses kaydı hizmeti eklenmedi. Oynatıcının tamamlanma kaydı insanın duyduğunu kanıtlamaz. Yenilemeden sonra cevapsız dinleme sorusu için sesi yeniden dinlemek gerekir. Veriler hâlâ aynı cihaz + tarayıcı + adresin IndexedDB alanındadır; otomatik cihaz eşitlemesi eklenmedi.

Otomatik testlere ek olarak kişisel kelime ekleme, CSV hatası/onayı, yanlış → Zorlandıklarım turu, mobil/dar ekran ve kontrollü ses motoruyla üç farklı dinleme cevap yolu denendi. Gerçek Japonca ses çıkışı ve fiziksel telefon testi yapılmadı. [Ayrıntılı QA](docs/qa.md).

## 0.7.1 · Seçerken bulunduğun yerde kal

Hiragana/katakana satırlarını seçmek veya kaldırmak tabloyu başa döndürmez. Aynı sayfanın yeniden çizilmesinde tablo ve sayfa kaydırması, açık/kapalı satır alanı ve klavye odağı korunur. Kelime, cümle ve gramer listelerinde de seçimden sonra liste başına veya kart ayrıntısına otomatik atlama kaldırıldı. Yeni sayfaya geçiş ve alıştırmayı başlatma gibi açık gezinme eylemleri kendi normal davranışını sürdürür.

67/67 test başarılı. Mobilde uzun hiragana/katakana tablosu, üç içerik listesi, klavyeyle seçim; ayrıca 320 piksel büyük yazı ve masaüstü kontrol edildi. [QA kaydı](docs/qa.md).

## 0.7 · Kelimeleri dinle

Kelime kartlarında, kelime alıştırmalarında, kanji kelime pratiğinde, kaydedilmiş kelimelerin tekrarlarında ve okuma metninin kelime panelinde **Dinle** / **Yavaş dinle** düğmeleri vardır. Kelimenin içerikte kayıtlı kana okunuşu seslendirilir; tek kanjiden otomatik okunuş çıkarılmaz. Örneğin 学校 için がっこう kullanılır. Normal hız 1, yavaş hız 0,65’tir; ses motorunun hız desteği değişebilir. Otomatik çalma yoktur. Çalarken Durdur düğmesi görünür; başka karta/sayfaya geçmek veya uygulamayı arka plana almak sesi keser.

Bu özellik cihazın/tarayıcının sunduğu Japonca sentetik sesi kullanır; ücretli API, servis hesabı veya anahtar eklenmedi. Japonca ses yoksa başka dilde ses kullanılmaz, düğmeler açıklamayla devre dışı kalır. Cihazın seslendirme ayarlarından Japonca ses eklemek ve uygulamayı yeniden açmak gerekebilir. Sesin kalitesi, kullanılabilirliği ve internet ihtiyacı cihaza/motora bağlıdır; çevrimdışı çalışma veya insan kaydı doğruluğu garantisi yoktur. [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices).

Soruyu cevaplamadan dinlemek ipucu olarak etiketlenir. Kabul edilen seslendirme isteği oturumda ve sonraki cevapta `pronunciationHintRequested` olarak korunur; bu sesin gerçekten duyulduğunu veya bağımsız hatırlamayı kanıtlamaz. Sesi çalmak yeni cevap, başarı veya dinleme testi üretmez. Mevcut okunuş gizleme tercihi ve yazılmış cevap korunur; geçmiş veriler değiştirilmez.

**64/64 test başarılı.** Japonca ses yokluğu, geç yüklenen sesler, normal/yavaş hız, çakışan/stale geri çağrılar, durdurma, oynatma hatası ve bütün kelime okunuşlarının kana kaynağı doğrulandı. Yerel test tarayıcısında Japonca ses olmadığı için gerçek ses çıkışı ve fiziksel telefon telaffuzu doğrulanamadı. Ses motorunun başarılı akışı kontrollü test motoruyla sınandı. [QA kaydı](docs/qa.md).

## 0.6 · Okunuş, kanji bilgisi ve hatırlatma

Kelime sorularında doğru veya yanlış cevaptan sonra Japonca yazımın hemen altında kana okunuşu görünür. Soru sırasında **Okunuşu göster / gizle** tercihi kullanılabilir; düğme yazılmış cevabı silmez. Okunuş gösterilerek cevaplanan kelime/tekrar soruları olay kaydında `readingHintShown` ile işaretlenir. Kart inceleme ekranında da ayrı okunuş düğmesi vardır. Alfabenin Enter gerektirmeyen akışı korunur.

Japonca soru ve kart başlıklarındaki kanjiye fareyle yaklaş, klavyeyle odaklan veya telefonda dokun. KANJIDIC2 kaynaklı anlamlar/okunuşlar ve KanjiVG yazım bileşenleri internetten alınır. Anlamlar kaynak İngilizcesiyle etiketlenir. Bileşenler tarihsel köken veya sesleri yan yana ekleme kuralı sayılmaz; yalnızca üç özel karakterde bağlantılı Kanjipedia oluşum notu vardır. Eksik bilgi tahmin edilmez. Kaynak/lisans bağlantıları panelde ve **Kanji kaynakları** sayfasındadır. [Kaynak ve lisans notu](docs/sources-v06.md).

**Tercihler ve veriler → Çalışma hatırlatıcısı** altında saat ve dakika seçilir. Yomu yalnızca açık ve görünürken seçilen dakikada günde bir kez kontrol eder; kullanıcı izin verirse tarayıcı bildirimi, vermezse uygulama içi mesaj gösterir. Servis çalışanı yalnızca bu bildirimi gösterme/açma içindir; arka plan saati, push hizmeti veya çevrimdışı önbellek sağlamaz. Telefon uyurken veya uygulama kapalıyken doğrudan web bildirimi henüz etkin değildir.

Kapalı uygulama için aynı bölüm Google Takvim’de günlük etkinlik taslağı açar veya günlük alarm içeren `.ics` dosyası hazırlar. Kullanıcı takvime eklemeyi ve bildirimi etkinleştirmeyi tamamlar; takvim uygulamasının desteği gerekir. Yomu saati değiştirmek mevcut takvim kaydını değiştirmez. OneSignal hesabı/API anahtarı veya zamanlayıcı bağlanmadı; ücretsiz plan bilgisi bir etkinleştirme iddiası değildir. Telefonlar arası ayar/ilerleme eşitlemesi eklenmedi.

**59/59 test başarılı.** Okunuş gizleme/cevap sonrası gösterme, yazma geri bildirimi, kaynak kimliği doğrulama, eksik SVG yapısı, kaynak atfı, saat/dakika sınırı ve günlük takvim alarmı testleri eklendi. Gerçek tarayıcıda kelime cevapları, panel açma/kapama, 390 ve 320 piksel görünüm, ayarların yenilemede korunması ve takvim indirmesi denendi. Sistem bildirim izni verilmedi; fiziksel telefon veya gerçek kapalı uygulama push testi yapılmadı. [QA](docs/qa.md).

## Telefonda ve çevrimiçi kullanım

Yayınlanan Sites adresi HTTPS üzerinden, bilgisayardan bağımsız çalışır. Site hesabın sahibine özeldir; telefonda aynı ChatGPT hesabıyla giriş gerekir. Çalışma alanını Safari veya Chrome’da açıp tarayıcının ana ekrana ekleme seçeneğiyle kısayol oluşturabilirsin. Manifest başlangıç adresi ve uygulama görünümünü tanımlar; çevrimdışı önbellek veya çevrimdışı çalışma garantisi yoktur.

Çalışma kayıtları varsayılan olarak cihazın o tarayıcısındaki IndexedDB’de tutulur. 0.9 sürümünde aynı yayımlanmış Site hesabındaki cihazlar için isteğe bağlı eşitleme vardır; her cihazda önizleme/onayı bir kez tamamlamak gerekir. Yerel geliştirme adresindeki kayıtlar otomatik taşınmaz; JSON yedeğiyle aktarılabilir. Siteye giriş yapmak tek başına eşitlemeyi açmaz. Çeviri ve video için internet gerekir. Site adresi ve yayın durumu teslim mesajında verilir; source deposunun GitHub adresi çalışan uygulamanın adresi değildir.

Canlı bulut sunucusundan MyMemory’ye yapılan ilk istekte günlük kota hatası görüldü; cihazdan yapılan isteğe sağlayıcı yanıt verdi. Bu yüzden yalnızca sunucu QUOTA/429 döndürürse tarayıcı aynı MyMemory /get hizmetine doğrudan bağlanır. Yeni sağlayıcı veya anahtar yoktur. Girdi doğrulaması, 500 UTF-8 bayt sınırı, İngilizce ara dil ve iptal denetimi korunur. Cihazın da kotası doluysa hata gösterilir; sınırsız çeviri garantisi yoktur. Bu davranış çeviri alanında gönderimden önce açıklanır.

Sunucu sürümü Worker ESM’dir: aynı kökende POST /api/translate ve yalnızca izin verilen tarayıcı dosyalarını sunar. 200 kelime, 120 cümle, 50 gramer ve 50 kanji kelimesi korunur. Yeni üretim bağımlılığı veya ücretli API anahtarı eklenmedi. Yayın kimliği .openai/hosting.json içinde, erişim anahtarları yalnızca yayın oturumunun belleğindedir.

Geliştirici için **npm run build:hosted**, dist/server/index.js ve dist/.openai/hosting.json üretir. Build, dist altındaki tarayıcı kaynaklarını ve src modüllerini tek Worker’a gömer; Node sunucusu, testler, dokümanlar ve kişisel kayıtlar HTTP üzerinden sunulmaz. Üretilen dosyalar Git’e alınmaz. Yayın paketi Sites source helper ile, doğrulanmış ve aynı kaynaktan üretilmiş commit üzerinden hazırlanır.

**49 test başarılı.** Yeni Worker testleri HTTPS same-origin çeviri, İngilizce ara dil, yanlış köken, gövde/UTF-8 sınırı, hatalı JSON, yöntem ve yalnızca izin verilen statik dosyaların sunulmasını kapsar. Worker derlemesi ana sayfa, uygulama modülü ve manifest yanıtlarını ayrıca doğrular. [QA](docs/qa.md).

## Bilgisayarda yerel çalıştırma

Node.js 22+ gerekir. Windows'ta **Yomu-baslat.cmd** dosyasını çift tıkla veya bu klasörde **npm start** çalıştır. Adres: http://127.0.0.1:4173. Kurulum veya derleme gerekmez. Durdurmak için sunucu penceresinde Ctrl+C kullan.

Önceden açılmış 0.1 sunucusu varsa önce o sunucuyu durdurup yeniden başlat: yeni çeviri API'si eski sunucuda bulunmaz. Başka bir port için PowerShell'de **$env:PORT = '4174'** ardından **npm start** kullanılabilir.

Dil tercihi, ilerleme, cevaplar ve tekrarlar IndexedDB'de **aynı tarayıcı + aynı adres/port** için saklanır. Farklı portta önceki verilerin görünmemesi silindikleri anlamına gelmez. 0.1/0.2 kayıtları şema 3’e eklemeli olarak taşınır; cevaplar, tercihler ve mevcut harf oturumları korunur.

## 0.4 · Genişletilmiş içerik

Kelime havuzu **60 → 200**, cümleler **40 → 120**, gramer konuları **25 → 50**, kanji kelime pratiği **20 → 50** oldu. Önceki soruların kimlikleri ve yerel ilerleme korunur; şema 3 değişmez.

- Yedi kelime başlığı: meyveler, eşyalar, yazılım, aile ve insanlar, yiyecek/içecek, zaman/planlar, ulaşım/seyahat. Önceki üç başlıkta her N5–N1 bandında 8; yeni dört başlıkta her bantta 4 kelime. Her kelimede Japonca örnek, kana okunuşu ve TR/EN açıklama var.
- Altı cümle ortamı: restoran, günlük hayat, iş, arkadaş arası, alışveriş ve yolculuk. Her bant/ortamda 4 cümle; toplam 120. Kullanım notları ve boşluk doldurma cevapları dahil.
- Her çalışma bandında 10 gramer konusu; toplam 50. Aitlik/varlık, davet, yapabilme, önceden hazırlama, yardım etme/alma, koşul, dolaylı bilgi, güçlü çıkarım ve resmî ileri ifadeler eklendi.
- Kanji havuzu başlangıçta 18, ortada 34, zor düzeyde 50 kelimeyi kümülatif olarak kapsar. Bu etiketler JLPT bantlarından ayrıdır. Hiragana/katakana tabloları ve doğru cevapta otomatik ilerleme korunur.
- Kelime okunuş soruları karışık kana, tamamen hiragana ve Unicode normalizasyonuyla yarım genişlikte katakana yazımlarını kabul eder. Örneğin でんしレンジ / でんしれんじ. Romaji bu soruların cevap türü değildir; harf atölyesinde romaji desteği sürer.
- Ana sayfa ve kanji kapsam sayıları içerikten hesaplanır; yeni içerik eklenince eski sayıda kalmaz.

**44 test başarılı.** Aile kelimesi kaydetme/cevaplama/yenileme, alışveriş cümlesi ve yeni gramer cevabı gerçek tarayıcıda denendi; kanji kapsamı ve otomatik geçiş doğrulandı. Mobil 390 piksel ve 320 piksel büyük yazı/İngilizce kelime ekranı incelendi. [QA kaydı](docs/qa.md).

Kullanıcı elindeki Genki 1/2 kaynaklarının İngilizce–Japonca olduğunu belirtti; kitap dosyaları çalışma alanında yoktu ve baskısı belirlenmedi. Resmî tanıtım yalnızca başlangıç konu kapsamını görmek için incelendi. Yeni örnekler özgün hazırlandı; kitapların kelime, diyalog, alıştırma veya bölüm listelerinin aktarımı değildir. [Kaynak ve içerik notu](docs/sources-v04.md). Düzeyler yaklaşık; Japonca insan editörü onayı yoktur.

## 0.3 · İlk kelime, cümle ve gramer paketi (tarihsel)

- **Kelimeler:** Her N5/N4/N3/N2/N1 bandında meyveler (ilgili tarım/gıda sözcükleri dahil), eşyalar ve yazılım başlıkları. Her başlık ve düzeyde dört kelime: toplam 60. Japonca yazım, kana okunuşu, TR/EN anlamı ve örnek cümle. Anlam seçme, kana okunuşu yazma veya Japonca yazma alıştırmaları.
- **Cümleler:** Restoranda, günlük hayatta, iş yerinde ve arkadaş arasında; her düzey/ortam için iki örnek: toplam 40. Çeviri, kana okunuşu ve samimi/resmî kullanım notları. Boşluk doldurma pratiği; tanımlı kanji/kana varyantları kabul edilir.
- **Gramer:** Her düzeyde beş konu, toplam 25. Biçim, TR/EN açıklama, okunuşlu örnek ve boşluk doldurma. N5’te です ve たい; ileri düzeylerde にもかかわらず ve べく gibi yapılar.
- Düzey/başlık filtreleri, iki arayüz dilinde ve Japonca içerikte arama, okunuşu gizleme, önceki/sonraki kart ve tekrara kaydetme. Aramayı **Ara** düğmesi veya Enter ile uygula. Her tur seçilmiş içerikten en fazla 10 farklı, karıştırılmış soru içerir. Devam eden tur başlangıç seçkisini korur; yeni tur düğmesi güncel filtreyi kullanır.
- Kaydetmek cevap veya başarı üretmez. Kelimeler anlam/okunuş; cümle ve gramer boşluk doldurma kartları olarak ortak tekrar listesine eklenir. Cevap, gerekçe ve tur konumu sayfa yenilemesinde korunur.

Bu, **60 kelime + 40 cümle + 25 gramer konusundan oluşan başlangıç paketidir**. Düzey etiketleri yaklaşık çalışma bantlarıdır; resmî veya eksiksiz JLPT kelime/gramer listeleri değildir. Özellikle yazılım terimleri alan söz varlığıdır. İçerik AI yardımıyla özgün hazırlandı; insan Japonca editörü onayı yoktur. [İçerik notları ve kaynak](docs/sources-v03.md).

**41 otomatik test başarılı**; yeni üç ekran gerçek tarayıcıda, 390 ve 320 piksel mobil genişliklerde ve büyük yazıda kontrol edildi. Ayrıntılar [QA](docs/qa.md) kaydında.

## 0.2.1 · Enter gerektirmeyen alfabe pratiği

Doğru cevap tamamlanınca otomatik sonraki karaktere geçilir ve cevap alanına odaklanılır. Yanlış cevapta aynı karakter kalır, “Yanlış” mesajı gösterilir; cevap açığa çıkmadan tekrar denenir. shi için sh gibi tamamlanmamış geçerli bir başlangıç yanlış sayılmaz. Boş alanda Enter, cevabı üstte gösterip sonraki karaktere geçer; bu işlem doğru cevap sayılmaz ve tekrar için kaydedilir. Son karakterde gösterilen cevap tur özetinde de görünür.

Yanlış yazımı her tuşta ayrı deneme olarak kaydetmek yerine bir karakterdeki ilk yanlış kaydedilir; sonradan doğru tamamlamak ayrı cevap olayıdır. Tur özeti tamamlanan karakter sayısını esas alır. Japonca IME bileşimi bitmeden değerlendirme yapılmaz. Anime ve okuma derslerinin cevap akışı korunur.

33 test ve bu akış için gerçek tarayıcı kontrolleri başarılı: [QA](docs/qa.md).

## Kullanım

- **Bugün:** Harf atölyesi, dört anime alanı ve görünür çeviri masası.
- **Harfler:** Hiragana/katakana satırlarını seç; zorluk, soru türü ve yazı tipini ayarla. Başlangıç 46 temel kana, orta 71 (dakuten/handakuten dahil), zor 104 (33 birleşik ses dahil). İki yazı sistemi için ayrı karakterler. Bu, Japoncanın bütün küçük/uzatılmış/yabancı ses kombinasyonlarını kapsayan bir müfredat değildir.
- **Kanji:** Başlangıçta 18, ortada 34, zor düzeyde 50 örnek kelime. Kanjiler kelime bağlamında sorulur. Örneğin 日本 için にほん / nihon ve にっぽん / nippon kabul edilir; bir kanjinin tüm okumaları ölçülmüş sayılmaz.
- **Üç egzersiz türü:** Romajiyle okunuşu yazma; doğru okunuşu seçme; okunuştan Japonca karakter/kelimeyi klavyeyle yazma. El yazısı/vuruş veya telaffuz değerlendirmesi yok. shi/si, chi/ti, tsu/tu gibi tanımlı varyantlar ve uzun ünlü işaretleri desteklenir.
- Her tur en fazla 10 farklı soru. Cevap gerekçeleri ve tur özeti; yanlışları hemen yeniden çalışma. Soru bazlı yerel sorun notu. Tur ve cevap gerekçesi yenilemede korunur. Ayar değişiklikleri sonraki turu etkiler.
- **Anime replikleri:** Naruto, Bleach, Vinland Saga ve Jujutsu Kaisen için dört kısa örnek. Anime/zorluk filtreleri, Japonca metin, okunuş, Türkçe/İngilizce çalışma çevirisi, dil notu ve alıştırma. Kendi kısa repliğini ve boşluk cevabını ekleyebilirsin; isteğe bağlı YouTube bağlantısı desteklenir. Kişisel içerik bağımsız doğrulanmış sayılmaz.
- **Çeviri:** Ana sayfada ve her sayfanın üstündeki 文 düğmesinde. TR↔JA, TR↔EN ve JA↔EN. Girdi ve çıktı geçici bellekte tutulur; çeviri geçmişi kaydedilmez. Dil değiştirme, yön çevirme, kopyalama, hata ve kota mesajları.
- **Okuma köşesi:** Önceki üç kısa metin, dokuz soru, 15 kelime ve üç gramer noktası; furigana/açıklama/çeviri anahtarları.
- **Tekrar/ilerleme:** Karakter, anime ve ders cevapları ayrı soru kimlikleriyle ortak tekrar planına girer. Anlam, okunuş ve yazılı cevap ayrı tutulur. Dinleme testi yok: ses/video açmak başarı puanı oluşturmaz. Doğru/deneme kayıtları ustalık veya JLPT seviyesi değildir.
- Tercihler ve verilerden JSON dışa aktar. Kişisel replikler dahil edilir. İçe aktarma ve cihazlar arası eşitleme henüz yok.

## Videolar ve altyazılar

Dosyaya anime videosu indirilmedi veya yeniden yüklenmedi. Kullanıcı “Kesiti aç” dediğinde yayıncının YouTube oynatıcısı yüklenir. Kaynaklar VIZ, Netflix Anime ve Crunchyroll kanallarında oEmbed başlık/yayıncı bilgisiyle doğrulandı. Kaynak ve durum ayrıntıları: [docs/sources-v02.md](docs/sources-v02.md).

Videonun kendi altyazısı, dublajı, bölge ve gömme izni yayıncıya bağlıdır. İngilizce CC varsa istenir; her videoda veya bölgede varmış gibi gösterilmez. **Vinland Saga'nın kısa satırı için 83–89 saniye zaman bilgisi doğrulandı**; yalnızca bu aralıkta uygulamanın TR/JA/EN çalışma altyazısı eşzamanlı görünür. Diğer örneklerin ayrı çalışma metni zaman eşlemesi yapılmış altyazı olarak sunulmaz. Naruto'nun resmî tanıtım kesitinin ve Jujutsu Kaisen alıntısının birebir Japonca replik/ses eşleşmesi ayrıca editör kontrolü bekliyor. Tüm bölümler için tam veya otomatik üretilmiş Türkçe altyazı yoktur.

İçerik spoiler içerebilir. Kısa alıntıların hakları eser sahiplerinde; çalışma çevirileri/notları AI yardımıyla hazırlandı, insan Japonca editörü onayı yoktur. Anime üslubu resmî/gündelik konuşma modeli olarak genellenmemelidir.

## Gerçek çeviri hizmeti

Yerel Node sunucusundaki **POST /api/translate**, MyMemory'nin belgelenmiş **/get** API'sini kullanır. Anahtar veya ücretli abonelik eklenmedi. Metin, butona basıldığında dış hizmete gönderilir; sağlayıcı metni saklayabilir ve diğer çeviri sağlayıcılarını kullanabilir. Gizli metin göndermemek kullanıcının seçimidir. Uygulama metni loglamaz ve MyMemory'nin herkese açık arşive katkı yapan /set API'sini çağırmaz.

Hizmet sınırı: istekte en fazla **500 UTF-8 bayt** ve tek paragraf; anonim kota belgede **5.000 karakter/gün** olarak belirtilir. Kota tüm uygulama garantisi değil, sağlayıcı sınırıdır; geçerli koşulları kaynak sayfasından kontrol et. Sınırı aşan metin parçalara bölünerek gönderilmez.

Doğrudan Türkçe/Japonca çeviri hafızasında “Merhaba” için bile hatalı sonuç görüldü. Bu iki yönde artık **İngilizce üzerinden iki istek** kullanılır; sonuçta bu yol açıklanır. Diğer dört yön doğrudandır. Ara dil anlam kaymasına yol açabilir; otomatik öneriler editör onaylı çeviri veya alıştırma cevap anahtarı değildir. Gerçek hizmette altı yön çağrıldı; düzeltilmiş TR↔JA yolu ayrıca denendi. Genel çeviri doğruluğu ölçülmedi.

## Veri ve tekrar

Şema 3; IndexedDB veritabanı sürümü 1. Kelime, okunuş, anlam, cümle, gramer, sürümlü soru ve beceri durumu ayrı kimliklere sahiptir. Her cevap UUID, zaman, saat dilimi, gün, içerik/algoritma sürümü, mod ve cevap türü içerir. Tek IndexedDB işlemi ve revizyon karşılaştırması eski sekmenin kayıtları ezmesini önler. Başarı yalnızca kayıt tamamlanınca gösterilir.

Tekrar algoritması **fixed-interval-v1**: yanlışta 10 dakika; ardışık doğru cevaplarda 1, 3, 7, 14, 30 gün. FSRS veya kişisel bellek tahmini kullanılmaz. Ayrıntılar ve MIT lisanslı FSRS adayının değerlendirmesi [docs/architecture.md](docs/architecture.md) dosyasında.

Gün sınırı seçili IANA saat diliminde 00.00; aralık “1 gün” için geçen 24 saattir. Tarihsel cevap kendi saat dilimini korur. Tarayıcı verisi silinirse yerel kayıtlar gider; düzenli dışa aktarma önerilir. Hesap, bulut eşitlemesi, abonelik, öğretmen/AI değerlendirmesi veya öğrenme üstünlüğü iddiası yoktur. Yerel sunucu artık statik dosyalara ek olarak yalnızca çeviri aracılığı yapar.

## Geliştirme ve doğrulama

Üretim bağımlılığı yok; HTML/CSS/ES modülleri ve Node HTTP. Tek geliştirme bağımlılığı fake-indexeddb 6.2.7 (Apache-2.0).

**npm ci**, **npm run check**, **npm test**: güncel toplam 49 test. Eski kayıtların taşınması, 208 kana varyantının soru çözümlemesi, bağlamlı kanji, cevap varyantları, anime/kullanıcı soruları, altı çeviri yönü ve hata/kota durumları dahil. [Doğrulama kaydı](docs/qa.md).

0.2 ana sayfası, karakter seçim ekranı ve çeviri isteği gerçek tarayıcıda açıldı. Sonrasında Computer Use, Chrome adresini güvenilir biçimde doğrulayamadığı için durdu; yeni akışların tümü için mobil/görsel uçtan uca doğrulama tamamlanamadı. docs/qa içindeki önceki üç görsel **0.1 sürümüne aittir**; alphabet-auto-flow.jpg, 0.2.1 alfabe geri bildirim ekranıdır. Bu sınır yeni ekranların tamamı görsel olarak doğrulanmış gibi yorumlanmamalıdır.

0.4 içerik ekleri: dist/src/study-expansion.js ve kanji-expansion.js. 0.3 dosyaları: dist/src/study-data.js, study-flow.js, study-ui.js, dist/study.css ve tests/study.test.mjs. Başlıca önceki dosyalar: dist/src/characters.js, anime.js, practice-ui.js, media.js; önceki app.js/content.js/model.js/storage.js; scripts/translation.mjs; tests/practice.test.mjs ve translation.test.mjs.

## Araştırma ve GitHub

30 Ekim 2026 araştırması [docs/research/rapor.md](docs/research/rapor.md), [yorum kanıtları](docs/research/yorum-kanitlari.json) ve [koruma kaydı](docs/research/provenance.json) ile korunur. Özgün araştırma dosyaları byte düzeyinde kopyalandı; Git satır sonu dönüşümünden de hariç tutuldu. Küçük, rastgele olmayan 27 yorumdan şikâyet oranı veya öğrenme üstünlüğü çıkarılmaz.

Systema deposu değiştirilmedi. Yomu'nun ayrı yerel Git deposunda ilk prototip, yeni özellikler ve doğrulama/belgeleme ayrı commitlerdir. GitHub hedefi kullanıcı tarafından oluşturuldu: [AtaKaanSavasci/yomu-](https://github.com/AtaKaanSavasci/yomu-). Depo herkese açıktır; görünürlüğü değiştirilmez. Kod aktarımı bağlı GitHub araçlarıyla yapılır; hesap sırrı veya yerel kullanıcı ilerlemesi depoya dahil edilmez. Git geçmişinin taşınabilir kopyası ayrıca yomu-history.bundle olarak verilir.
