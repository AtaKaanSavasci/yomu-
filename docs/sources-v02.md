# 0.2 kaynak ve sınır kaydı · 30 Ekim 2026

## Karakter pratiği

[RealKana](https://realkana.com/) doğrudan incelendi. Ana sayfası hiragana/katakana/kanji seçimi ve romaji karşılığını yazarak çalışma akışını açıklar. Yomu bu etkileşim fikrinden yararlanır; RealKana kaynak kodu, tasarımı, veritabanı veya özel varlıkları kopyalanmadı.

Kana tablosu özgün yapılandırılmış veridir: 46 temel + 25 dakuten/handakuten + 33 yōon. Her öğe iki yazı sistemi ve tanımlı romaji alternatiflerini taşır. Kanji paketi 20 özgün örnek kelime ve çalışma anlamı içerir. Editör onayı bekler; standart bir JLPT kapsamı iddiası yoktur.

## Anime kaynakları

| Alan | Birincil kaynak | Doğrulanan bilgi / sınır |
| --- | --- | --- |
| Naruto | [VIZ: Naruto’s Ninja Way](https://www.youtube.com/watch?v=NKoGCBZ1izY), [resmî Japonca Naruto yazısı](https://naruto-official.com/news/01_1296) | YouTube başlığı ve VIZ kanalı oEmbed ile doğrulandı; video sayfası açıldı. Japonca kısa alıntı resmî yazıda mevcut. Tanıtım kesitinde birebir ses/alıntı ve zaman eşlemesi henüz doğrulanmadı. |
| Bleach | [VIZ: Bankai Compilation](https://www.youtube.com/watch?v=_uw291z2CUQ) | YouTube başlığı ve vizmedia kanalı oEmbed ile doğrulandı. Alıntı tek kısa seriye özgü terimdir; belirli bir karakter veya saniye atfedilmez. |
| Vinland Saga | [Netflix Anime: I Have No Enemies](https://www.youtube.com/watch?v=h8-MxeYYwJE) | Başlık/yayıncı, oynatıcı ve altyazı incelendi. Dışa aktarılan Almanca yayıncı altyazısı kısa satırı 1:23'te gösterdi. Bu nedenle çalışma altyazısı yalnızca 83–89 saniyeye bağlandı. Japonca transkripsiyon ve Türkçe çeviri insan editörü onaylı değildir. |
| Jujutsu Kaisen | [Crunchyroll: Gojo vs Sukuna](https://www.youtube.com/watch?v=NyPf5ipLFkU) | Başlık ve Crunchyroll kanalı oEmbed ile doğrulandı. Kısa Japonca alıntının yazımı/ses eşleşmesi editör kontrolü bekler; zaman kodu veya eşzamanlı altyazı iddiası yoktur. |

Kısa alıntılar eğitim açıklaması ve soru için kullanılır. Video, bölüm, altyazı dosyası veya karakter görseli yeniden yayımlanmadı. YouTube oynatıcısı yalnızca açık kullanıcı eylemiyle yüklenir. Engelliyse kaynak bağlantısı görünür kalır. **Resmî video kaynağının doğrulanması, her altyazı dili ve her ülkede oynatımın doğrulanması değildir.**

Video gömme ve zaman okuma için [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) ve [oynatıcı parametreleri](https://developers.google.com/youtube/player_parameters) esas alındı. Otomatik oynatma yok; gömülü oynatıcı en az 200 piksel yüksekliğinde. Uygulamanın kısa çalışma altyazısı, yayıncının kendi altyazısından ayrı etiketlenir.

## Çeviri

MyMemory [teknik belge](https://mymemory.translated.net/doc/spec.php), [kullanım sınırları](https://mymemory.translated.net/doc/usagelimits.php) ve [hizmet/veri koşulları](https://mymemory.translated.net/terms-and-conditions) incelendi. /get, UTF-8'de 500 bayt sınırını ve ISO dil çifti parametresini belgeler. Anonim kullanım için günlük 5.000 karakter belirtilir. Uygulama kota aşımını atlatmak için metni bölmez ve /set katkı API'sini kullanmaz.

Altı dil yönünde gerçek örnek istekler yapıldı. Doğrudan Türkçe/Japonca hafıza eşleşmelerinde temel selamlaşmada bile bariz hata bulundu. Bu nedenle TR↔JA İngilizce üzerinden çalışır ve sonuçta yol etiketlenir. Yeniden denemede TR→JA selamlaşma ve JA→TR selamlaşma anlamlı sonuç verdi; bu genel çeviri kalitesini kanıtlayan bir test değildir. Hizmet çeviri hafızası ve otomatik çeviri sonuçları verebilir; sonuç “editör onaylı” veya kesin doğru sayılmaz.

İstek metni sağlayıcıya gider; sağlayıcı segmentleri uzun süre saklayabileceğini ve dış makine çeviri ortaklarıyla veri paylaşabileceğini belirtir. Bu bilgi çeviri ekranında görünür. İstek/sonuç uygulamanın kalıcı ilerleme kaydına veya loguna eklenmez.
