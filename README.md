# Yomu · Japonca çalışma alanı

Kana okuyabilen, kısa Japonca metinlere geçmek isteyen Türkçe/İngilizce konuşanlar için **yerelde çalışan 0.1 prototipi**. Hazırlanma ve araştırma tarihi: **30 Ekim 2026**.

## Çalıştırma

Node.js 22 veya üstü gerekir. Windows'ta `Yomu-baslat.cmd` dosyasını çift tıkla. Sunucu hazır olduğunda tarayıcı açılır. Durdurmak için açılan komut penceresinde `Ctrl+C` kullan.

Alternatif olarak bu klasörde:

```powershell
npm start
```

Ardından <http://127.0.0.1:4173> adresini aç. Uygulamayı çalıştırmak için paket kurulumu veya derleme gerekmez. `dist/index.html` dosyasını `file://` ile açmak yerine yerel sunucuyu kullan.

Port doluysa:

```powershell
$env:PORT = '4174'
npm start
```

**Aynı tarayıcıyı ve aynı adresi kullan.** `localhost`, `127.0.0.1`, farklı portlar ve farklı tarayıcılar birbirinden ayrı IndexedDB alanlarıdır. Port değiştirince kayıtlar kaybolmuş gibi görünebilir; önceki adreste kalırlar.

## İlk deneme

1. Ana sayfadan doğrudan kısa okumaya başla veya “Kişiselleştir” ile hedef/seviye ve günlük süreyi seç.
2. Metinde altı çizili kelimeyi seç. Furigana, açıklamalar ve çeviriyi ayrı aç/kapat. Kelimeyi tekrar listene ekle.
3. “Kendin dene” ile anlam, okunuş ve **yeni bağlamda** parçacık tamamlama sorularını cevapla. Yanlış ve doğru cevapların gerekçesini incele.
4. Tekrarlarım ve İlerlemem ekranlarını aç. Tercihler ve verilerden JSON dışa aktar.

## Gerçek çalışan kapsam

- Türkçe/İngilizce arayüz, açıklamalar ve cevap anahtarları; kalıcı dil tercihi.
- Üç kısa okuma, dokuz ders sorusu, 15 kelime ve üç gramer noktası. Bütün metinler baştan açık.
- Kelimeye bağlı anlam/okunuş kartları; cümleye bağlı açıklamalar, furigana ve çeviri.
- Çoktan seçmeli, kana girişi ve dar kapsamlı yazılı tamamlama. Örneğin `図書館［ ］行きます` için `に` ve `へ` kabul edilir. Belirtilmiş eş anlamlılar ve normalleştirme kuralları desteklenir; açık uçlu semantik puanlama yoktur.
- Soru kimliği ve içerik sürümüyle **yerel** sorun notları. Hiçbir ekibe gönderilmez; dışa aktarmaya dahil edilir.
- Gerçek zaman damgalı cevap olayları, beceri bazında tekrar listesi, bilinen kartı/metni atlama ve kartı geri alma.
- IndexedDB kaydı; sayfa yenilemesinden sonra aktif ders/soru ve gösterilmiş cevap gerekçesi korunur. Tek aktif oturum saklanır; farklı bir derse başlamak önceki oturumun konumunu değiştirir, cevap geçmişini korur.
- Kaydetme tamamlanmadan başarı gösterilmez. Atomik işlem ve sürüm karşılaştırması eski bir sekmenin yeni kayıtları ezmesini engeller. Çakışmada sayfayı yenileme mesajı görünür.
- Büyük yazı, mobil düzen, semantik form etiketleri, görünür klavye odağı, ana içeriğe atlama, modal odak yönetimi. Formda Enter; seçeneklerde 1/2/3 kullanılabilir. Japonca yazmak için işletim sisteminin klavyesi/IME'si gerekir.
- Son yedi günlük gerçek cevap sayıları ve ayrı beceri kayıtları. Süre tercihi önerilen günlük cevap sayısını ayarlar; aktif dakika hedefi ölçülmez.
- Tam JSON dışa aktarma: tercihler, cevaplar, tekrar durumları, dersler ve sorun notları. **İçe aktarma henüz yok.**

## Ses, içerik ve ölçümün sınırları

Gerçek ses kaydı yok. Web Speech API yalnızca tarayıcı Japonca bir ses bildirdiğinde açılır; arayüz bunu **sentetik tarayıcı sesi** olarak adlandırır. Ses bulunmazsa düğme devre dışıdır. Bu ortamda Japonca ses bulunmadığı durum doğrulandı; gerçek ses oynatma bu ortamda doğrulanamadı. Tarayıcının ses sağlayıcısı ağa ihtiyaç duyabilir ve telaffuz doğruluğu editörce onaylanmış değildir.

Japonca metin, Türkçe/İngilizce açıklama ve cevap anahtarları bu prototip için AI yardımıyla özgün hazırlandı. **İnsan Japonca editörü onayı yoktur.** Rakip dersleri, sesleri veya sözlük veritabanları kopyalanmadı. Görseller özgün SVG kodudur; harici görsel/font/CDN bağımlılığı yoktur. Japonca için sistemdeki Yu Gothic/Meiryo gibi fontlara dönülür.

`meaning`, `reading`, `listening`, `writing` veri modelinde ayrıdır. “Okunuş” kana cevabını, “yazılı tamamlama” bir parçacığın yazılmasını ölçer. Serbest yazı, kanji vuruşu, konuşma ve genel dil yeterliliği ölçülmez. Dinleme testi yok; dinleme **ölçülmedi** görünür. Ustalık veya bilimsel öğrenme üstünlüğü puanı üretilmez.

Hedef/seviye tercihi kaydedilir; ilk paketin müfredatı buna göre değişmez. Kana öğretimi veya seviye sınavı yoktur. Tam N5 kursu, hesap, eşitleme, çalışan backend, ücretli paket, ödeme, lig, canlı AI hizmeti veya editör paneli bulunmaz. Yerel HTTP sunucusu yalnızca dosya sunar.

## Tekrar ve gün sınırı

Algoritma: `fixed-interval-v1`.

- Yanlış: **10 dakika** sonra, doğru serisi sıfırlanır.
- Art arda doğru: **1, 3, 7, 14, 30 gün**, sonra 30 günde kalır.
- Sadece kaydedilen kelimenin anlam/okunuş kartları hemen kuyruğa girer; eklemek cevap veya başarı sayılmaz.
- Kullanıcının “biliyorum” seçimi kartı askıya alır; doğru cevap veya ustalık eklemez. Tekrar listesinden geri alınabilir.

Aralıklar cevap anından itibaren geçen saat/dakikalardır; “1 gün”, 24 saattir. Günlük istatistikler seçili IANA saat diliminde **00.00** sınırını kullanır. İlk tercih cihazdan alınır, ayarlardan değişir. Geçmiş olaylar cevap anındaki saat dilimini ve gününü korur. Tekrar kuyruğu ve istatistikler sayfa açılışında, görünür olduğunda veya etkileşimde yenilenir; canlı saniye sayacı yoktur. Cihaz saatinin doğruluğu varsayılır.

FSRS değerlendirmesi ve neden bu sürüme eklenmediği: [docs/architecture.md](docs/architecture.md). Bu basit plan kişiselleştirilmiş bellek tahmini değildir.

## Veri güvenilirliği

Kayıtlar yalnızca **bu tarayıcıda ve bu origin'de** saklanır; sunucuya yüklenmez. Tarayıcı verilerini silmek veya tarayıcının depolamayı boşaltması kayıtları kaldırabilir. Özel gezinme kalıcılığı garanti etmez. Düzenli JSON dışa aktar; bu sürümde otomatik yedekleme/geri yükleme yoktur.

Dosyalar yerel sunucudan gelir; uygulama çalışma sırasında harici API çağırmaz. Servis worker/PWA yok: sunucu kapalıyken yeniden açılış veya önbelleksiz çevrimdışı yükleme desteklenmez. Açık dersin içerik ve veri işlemleri ağ API'si beklemez. Öğrenme etkinliği telemetrisi gönderilmez.

## Teknoloji ve dosyalar

Derlemesiz HTML/CSS ve ES modülleri seçildi: küçük pakette üretim bağımlılığı yok, davranış ve içerik kolayca incelenebilir. Saf model katmanı daha sonra React/Vue gibi bir arayüze taşınabilir. Tek test bağımlılığı `fake-indexeddb@6.2.7` (Apache-2.0); çalışan uygulamaya paketlenmez.

```text
dist/index.html           Giriş
dist/styles.css          Mobil/büyük yazı dahil görsel sistem
dist/src/app.js           Arayüz, oturum, ses ve etkileşimler
dist/src/content.js       Sürümlü özgün içerik ve cevap anahtarları
dist/src/model.js         Puanlama, beceri ayrımı, takvim ve olay modeli
dist/src/storage.js       IndexedDB, atomik kayıt ve sekme çakışma kontrolü
scripts/server.mjs       Yalnızca loopback'te çalışan statik sunucu
tests/                   Model ve IndexedDB işlem testleri
docs/research/           Tarihi ve kaynakları korunmuş özgün araştırma
docs/qa/                 Görsel doğrulama ekran görüntüleri
```

## Kontroller

```powershell
npm ci
npm run check
npm test
```

16 otomatik test ve gerçek tarayıcı kontrolleri: [docs/qa.md](docs/qa.md). Testler için Node.js 26.11.1 kullanıldı. Görünüm: [masaüstü](docs/qa/desktop.jpg), [ders](docs/qa/reader-desktop.jpg), [büyük yazılı mobil](docs/qa/mobile-large-text.jpg).

## Kaynak ve sonraki adımlar

[Araştırma raporu](docs/research/rapor.md), [yorum kanıtları](docs/research/yorum-kanitlari.json) ve [koruma kaydı](docs/research/provenance.json). Küçük, rastgele olmayan 27 yorumdan şikâyet oranı, pazar payı veya öğrenme üstünlüğü çıkarılmadı. Türkçe açıklamalara ödeme isteği ve hedef kitle uyumu hâlâ hipotezdir.

Bir sonraki öncelikler: Japonca editör kontrolü ve ses/cevap test seti; 8–12 hedef kullanıcıyla kullanılabilirlik denemesi; dışa aktarma/geri yükleme akışı; gerçek gecikmeli hatırlama ölçümü; yeterli kayıt ve uygun test kapsamıyla FSRS entegrasyonu. Hesap ihtiyacı doğrulanırsa modüler tek backend + PostgreSQL ve ses için nesne depolama değerlendirilebilir.

Proje ayrı klasörde oluşturuldu. Mevcut Systema uygulaması/deposu değiştirilmedi. GitHub'a veya Sites'a yükleme ve dağıtım yapılmadı.
