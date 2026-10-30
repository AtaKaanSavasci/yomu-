# Yomu · Japonca çalışma alanı

**0.3.0 · 31 Ekim 2026** — N5–N1 çalışma bantlarında kelimeler, ortama göre cümleler ve gramer. Harf pratiği, anime, çeviri, okuma ve kişisel tekrar alanlarıyla birlikte çalışır.

## Çalıştırma

Node.js 22+ gerekir. Windows'ta **Yomu-baslat.cmd** dosyasını çift tıkla veya bu klasörde **npm start** çalıştır. Adres: http://127.0.0.1:4173. Kurulum veya derleme gerekmez. Durdurmak için sunucu penceresinde Ctrl+C kullan.

Önceden açılmış 0.1 sunucusu varsa önce o sunucuyu durdurup yeniden başlat: yeni çeviri API'si eski sunucuda bulunmaz. Başka bir port için PowerShell'de **$env:PORT = '4174'** ardından **npm start** kullanılabilir.

Dil tercihi, ilerleme, cevaplar ve tekrarlar IndexedDB'de **aynı tarayıcı + aynı adres/port** için saklanır. Farklı portta önceki verilerin görünmemesi silindikleri anlamına gelmez. 0.1/0.2 kayıtları şema 3’e eklemeli olarak taşınır; cevaplar, tercihler ve mevcut harf oturumları korunur.

## 0.3 · Kelime, cümle ve gramer

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
- **Kanji:** Başlangıçta 8, ortada 14, zor düzeyde 20 örnek kelime. Kanjiler kelime bağlamında sorulur. Örneğin 日本 için にほん / nihon ve にっぽん / nippon kabul edilir; bir kanjinin tüm okumaları ölçülmüş sayılmaz.
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

**npm ci**, **npm run check**, **npm test**: güncel toplam 41 test. Eski kayıtların taşınması, 208 kana varyantının soru çözümlemesi, bağlamlı kanji, cevap varyantları, anime/kullanıcı soruları, altı çeviri yönü ve hata/kota durumları dahil. [Doğrulama kaydı](docs/qa.md).

0.2 ana sayfası, karakter seçim ekranı ve çeviri isteği gerçek tarayıcıda açıldı. Sonrasında Computer Use, Chrome adresini güvenilir biçimde doğrulayamadığı için durdu; yeni akışların tümü için mobil/görsel uçtan uca doğrulama tamamlanamadı. docs/qa içindeki önceki üç görsel **0.1 sürümüne aittir**; alphabet-auto-flow.jpg, 0.2.1 alfabe geri bildirim ekranıdır. Bu sınır yeni ekranların tamamı görsel olarak doğrulanmış gibi yorumlanmamalıdır.

0.3 dosyaları: dist/src/study-data.js, study-flow.js, study-ui.js, dist/study.css ve tests/study.test.mjs. Başlıca önceki dosyalar: dist/src/characters.js, anime.js, practice-ui.js, media.js; önceki app.js/content.js/model.js/storage.js; scripts/translation.mjs; tests/practice.test.mjs ve translation.test.mjs.

## Araştırma ve GitHub

30 Ekim 2026 araştırması [docs/research/rapor.md](docs/research/rapor.md), [yorum kanıtları](docs/research/yorum-kanitlari.json) ve [koruma kaydı](docs/research/provenance.json) ile korunur. Özgün araştırma dosyaları byte düzeyinde kopyalandı; Git satır sonu dönüşümünden de hariç tutuldu. Küçük, rastgele olmayan 27 yorumdan şikâyet oranı veya öğrenme üstünlüğü çıkarılmaz.

Systema deposu değiştirilmedi. Yomu'nun ayrı yerel Git deposunda ilk prototip, yeni özellikler ve doğrulama/belgeleme ayrı commitlerdir. GitHub hedefi kullanıcı tarafından oluşturuldu: [AtaKaanSavasci/yomu-](https://github.com/AtaKaanSavasci/yomu-). Depo herkese açıktır; görünürlüğü değiştirilmez. Kod aktarımı bağlı GitHub araçlarıyla yapılır; hesap sırrı veya yerel kullanıcı ilerlemesi depoya dahil edilmez. Git geçmişinin taşınabilir kopyası ayrıca yomu-history.bundle olarak verilir.
