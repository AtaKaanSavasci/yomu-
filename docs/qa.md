# Doğrulama kaydı · 11 Kasım 2026

## 0.9.4 · Her seviyeye yeni çalışma içeriği

70 kelime (her N5–N1 bandına 14), 15 gramer konusu (her banda 3) ve 15 kanji bağlam kelimesi (başlangıç/orta/zora 5'er) eklendi. Toplam 370 kelime, 120 cümle, 65 gramer konusu ve 65 kanji kelime kartı. Başlangıç/orta/zor kanji havuzları kümülatif 23/44/65. Kana tabloları aynı kalır. [Kaynak ve kapsam](sources-v094.md).

Yeni 85 kelime/kanji kaydının tüm yazım-kana çiftleri, okunuş kısıtları korunarak JMdict 2026-11-07 snapshotında bulundu. Seçilen çalışma anlamları sözlük anlamlarıyla karşılaştırıldı; örnekler özgün hazırlandı. Önceki sürümden alınmış repo dışı snapshotla ilk 300 kelime, 50 gramer ve 50 kanji kaydının kimlik/sıra/içerik eşitliği doğrulandı; yalnız paket sürümleri değişti. Şema veya veritabanı göçü yok.

160/160 test ve sözdizimi kontrolleri başarılı. Mevcut kapsam döngüleri artık 370 kelimenin anlam/okunuş/yazım ve iki dinleme modunu, 65 gramerin hedef/cevaplarını, 65 kanji kelimesinin üç soru türünü iki dilde denetler. Seviye/konu sayıları, tek doğru seçenek, karışık kana, eski ID'lerin çözülmesi, kayıt/tekrar ve oturum snapshotları kontrol edilir. Başlangıç aktarımı 3 temel istek ve 217.420 bayt gzip; 220 KB bütçesi korunur.

Gerçek tarayıcıda ana sayfa 370/65 saydı. N2 yazılımda yeni 圧縮 → あっしゅく / sıkıştırma ve örneği açıldı; tekrara ekleme iki beceri kartı oluşturdu, kana cevabı doğru kaydedildi. N5 gramer listesi 13 konu ve yeni üç başlığı gösterdi. N1 に即して kaydedilip kana varyantı にそくして ile cevaplandı; yenilemede geri bildirim korundu. Kanji ekranında 23/44/65 sayıları doğrulandı; başlangıçta 10 soruluk normal otomatik ilerleme turu tamamlandı. Bu rastgele turda eski kartlar çıktı; yeni 15 kartın tüm soru çözümlemeleri otomatik testte denetlendi.

375 piksel mobilde yeni N1 gramer kartı, uzun açıklama, örnek ve kana gizle/göster kontrol edildi; belge ve kaydırma genişliği 360 piksel, yatay taşma yok. Kaynaklar ekranındaki yeni sözlük sayıları ve gramer bağlantıları görüldü. Konsolda hata/uyarı yoktu. Kanıt görüntüsü repo dışında `yomu-v094-grammar-mobile.png`; geçici sekme/viewport kapatıldı. Japonca cihaz sesi bulunmadığından gerçek ses çıkışı veya fiziksel telefon testi iddia edilmez.

## 0.9.3 · Her ekranda çeviri baloncuğu

Sabit çeviri düğmesi uygulama sayfalarını yeniden çizen alanın dışında tutulur. Türkçe/İngilizce etiketi güncellenir; native dialog, erişilebilir ad, açılma durumu ve kapatınca odağın düğmeye dönmesi korunur. Üst menüdeki eski düğme ve ona ait CSS kaldırıldı. Mobilde alt menü ve safe-area için boşluk ayrılır; sayfa sonu ve kaydırma boşluğu sabit düğmeye göre ayarlandı. Çeviri paneli açıkken arka plandaki alıştırmanın sayı kısayolları çalışmaz.

160/160 mevcut test, JavaScript kontrolü ve son CSS düzenlemesinden sonra üretim paketi/boyut/deterministik derleme testleri başarılı. Gerçek tarayıcıda ana sayfa ve kelime ekranından panel açma, tıklama/Enter ile açılış, Escape/kapat düğmesi, odağın geri gelmesi, dil değişimi, taslak/sonuç koruma ve alıştırmada yazılmış `しき` cevabının panel açıp kapatınca kaybolmaması doğrulandı. Gerçek Japonca → İngilizce isteği `こんにちは` için `Hi` döndürdü. Bu kontrol genel çeviri doğruluğu ölçümü değildir.

375×812 görünümde düğme kaydırma öncesi/sonrası aynı konumda kaldı: alt kenarı 716, alt menünün üstü 736 piksel; arada 20 piksel boşluk vardı. 320 piksel normal ve İngilizce büyük yazıda yatay taşma görülmedi; yatay 812×375 görünümde panel kaydırılabilir, kapat düğmesi erişilebilir kaldı. 1280×900 masaüstü konumu da kontrol edildi. Konsolda hata/uyarı yoktu. Fiziksel telefon/ekran okuyucu testi yapılmadı. Repo dışındaki kanıt görüntüsü `yomu-v093-translation-bubble.png`; geçici sekme ve viewport kapatıldı.

## 0.9.2 · Açılış performansı

160/160 test ve JavaScript sözdizimi kontrolleri başarılı. Yeni kontroller, gerçek üretim derlemesinin tek JS/tek CSS ile başladığını, içerik karmalı URL'leri, gzip/identity eşitliğini, 220 KB başlangıç aktarım bütçesini, deterministik derlemeyi, gzip q=0 ve wildcard davranışını, HEAD/304 yanıtlarını ve HTML/servis çalışanının yeniden doğrulanmasını kapsar. API doğrulaması ve eşitleme kullanıcı ayrımı testleri de geçer.

Derleme raporu: HTML + 39 modül + 13 stil dosyası = 53 temel istek; yeni HTML + tek JS + tek CSS = 3. Ham kaynak 708.254 bayt, küçültülmüş içerik 621.279 bayt, gzip aktarımı 204.292 bayt (HTML 562, JS 181.116, CSS 22.614). Favicon/manifest, isteğe bağlı API/kanji/video istekleri bu toplamın dışında. Worker dosyası önceki sürümdeki 742.561 bayttan 296.330 bayta düşer. Eski üretimin gerçek ağ sıkıştırması veya fiziksel telefondaki süre ölçülmedi; %71 fark yalnızca ham kaynak ile yeni gzip toplamının karşılaştırmasıdır.

Aynı Worker çıktısı yerel 4188 sunucusunda HTTP üzerinden denendi: üç yanıtta da Content-Encoding: gzip, geçerli gzip gövdesi ve toplam 204.292 bayt; ETag ile koşullu üç istek 304 ve boş gövde döndürdü. İçerik karmalı JS/CSS private/immutable, HTML private/no-cache başlıklarını taşıdı. Kullanıcıya ait API verileri için no-store korunur.

Gerçek uygulama içi tarayıcıda paketlenmiş 0.9.2 ana sayfası, 300 kelimelik havuz, önceki N2/Yazılım/識別子 seçimi, hiragana tablosu ve gramer ekranı açıldı. 識別子 okunuş pratiğinde しきべつし doğru kaydedildi; yenilemede aynı cevap ve önceki kayıtlar korundu. Dar ekranda minify edilmiş CSS görünümü kontrol edildi; konsolda hata/uyarı yoktu. Kanıt görüntüsü repo dışında yomu-v092-startup.png olarak kaydedildi. Geçici sekme kapatıldı. Gerçek açılış süresi için tarayıcı Performance API bu denetim yüzeyinde kullanılamadı; saniye bazlı hızlanma iddiası yoktur.

## 0.9.1 · 100 yeni kelime

Toplam kelime sayısı 200 → 300. Mevcut seviye/konu kapsamı testleri 300 kayda güncellendi; bütün kelimeler üç soru türü ve iki dilde cevap/tek doğru seçenek kontrollerinden, iki dinleme modu için de havuz/cevap kontrollerinden geçer. 156/156 test, JavaScript sözdizimi kontrolü ve 56 tarayıcı dosyalı Worker derlemesi başarılı.

Repo dışındaki doğrulama aracı, JMdict English 2026-11-07 snapshotında yeni 100 yazım/kana çiftinin tamamını buldu; okunuşun ilgili yazıma ait olmasını sınırlayan re_restr alanları kontrol edildi. Önceki 200 kaydın kimlik/sıra/içerik eşitliği, içerik sürümü alanı dışında doğrudan eski snapshotla karşılaştırıldı. [Sözlük kaynağı, kapsam ve atıf](sources-v091.md).

Gerçek uygulama içi tarayıcıda ayrı yerel 4188 adresi: paket 300 kelime gösterdi; N5 meyve seçkisinde 12 içerik ve yeni 果物/オレンジ/ジャム/ジュース kartları görüldü. N2 Yazılım başlığında yeni 識別子 aranıp しきべつし / tanımlayıcı ve özgün örneği açıldı. Tekrara eklemek iki beceri kartı oluşturdu; okunuş pratiğinde しきべつし doğru kabul edilip yalnız okunuş kartının vadesi değişti. 390 piksel mobilde belge 375 piksel genişlikte kaldı; kart/örnek satırları taşmadı. Kaynaklar sayfasında yeni JMdict atfı görüldü, konsol temizdi. Test sekmesi, geçici viewport ve sahip olunan sunucu kapatıldı.

Bu içerik genişletmesinde gerçek Japonca ses çıkışı veya fiziksel telefon denenmedi; yeni kelimelerin dinleme havuzunda bulunması otomatik kontrollerle doğrulandı. Örnek cümle ve çeviriler özgün yardımcı materyaldir, insan editörü onayı iddia edilmez.

## 0.9 · Eşitleme, yedek, Genki, replik ve denemeler

156/156 test, tüm uygulama/sunucu JavaScript sözdizimi kontrolü ve 55 tarayıcı dosyalı Worker derlemesi başarılı. Yeni testler 23 Genki rehberinin kaynak/ID/cevap ilişkisi ve stale form/hint davranışını; beş seviyenin dondurulmuş deneme soruları, süre/dil/boş/çifte teslim/dinleme kanıtı davranışını; replikten deste işlemi, kaynak metadata ve HTML güvenliğini; eski JSON, şema/boyut/alan doğrulaması, olay dedup/schedule, kelime çakışma/kaldırma/not düzenlemesi, asenkron stale dosya/restore/upload yarışlarını kapsar. Node’un gerçek SQLite motoruyla kullanıcı ayrımı, koşullu INSERT/UPDATE/409, kimlik/origin/yöntem/gövde sınırları doğrulandı.

Gerçek uygulama içi tarayıcı, ayrı 4185 adresi:

- Genki ders 1 mini sorusu は cevabını doğru kaydetti; tamamlandı işareti ayrı seçilip yenileme/geri yüklemede korundu. İlk entegrasyon denemesinde genel `data-lesson` handlerının Genki düğmesini okuma sayfasına yönlendirdiği bulundu; action taşıyan düğmeler bu handlerdan ayrılıp gerçek tur yeniden doğrulandı.
- Vinland Saga’daki 敵 önizlemesinden てき / düşman / enemy ve kaynak bağlantılarıyla “Anime kelimelerim” destesi oluşturuldu. Kaydetme yeni cevap sayısı oluşturmadı. Mobilde önizleme açılınca panel başlığına odak/kaydırma eklendi.
- N5 20 soruluk denemede 電車/tren ve okuma metninin pazar günü cevabı kaydedildi. Yenilemede cevaplar ve azalmış süre korundu; teslimde 2 doğru / 0 yanlış / 18 boş ve dinleme “yapılmadı” gösterildi. Genki olayı normal ilerlemede 1 cevap kaldı.
- UI’dan JSON indirildi ve aynı dosya yeniden seçildi: 1 cevap / 1 deste / 1 kelime / 1 Genki bölümü / 1 deneme önizlendi, açık onayla birleştirilip kurtarma kopyası indirme düğmesi oluştu. Kişisel replik kaynak snapshotı ve deneme geçmişi dosya doğrulamasından geçti.
- 390 piksel Türkçe; 320 piksel büyük yazı+İngilizce Genki, deneme sonucu, yedek ayarı ve anime önizlemesi kontrol edildi. Belge genişliği 375/305 piksel olup görünümü aşmadı. Konsolda hata/uyarı yoktu.

Repo dışındaki `work/v09-cloud-qa-server.mjs`, gerçek üretilmiş Worker ve migrationları ortak bellek SQLite’a bağladı; 4186/4187 ayrı origin/IndexedDB ile iki cihaz veri alanı temsil edildi. Görünür “Local sync QA · simulated identity” bandı altında yalnız sunucu `qa-user` kimliği sağladı. İlk alanın 1 cevap/deste/kelime/Genki/deneme verisi açık onayla buluta, sonra boş ikinci alana geldi. İkinci alanda ders 2 işaretlendi; ilk alanda eşitleme sonrası 2/23 işaret görüldü. Yenilemede eşitleme açık kaldı ve “Şimdi eşitle” düğmesi korundu. Konsol temizdi. QA sunucuları/sekme/viewportlar kapatıldı; örnek kayıtlar ve QA kimliği Git/yayın paketine alınmaz.

Fiziksel iki telefon, gerçek Japonca ses çıkışı, ekran okuyucu ve giriş yapılmış üretim eşitleme UI’ı bu kayıtla doğrulanmış sayılmaz. Üretim yayın ve veritabanı sonucu ayrıca teslimde belirtilir. Genki yalnız 3. baskı için seçilmiş özgün yardımcı içeriktir; denemeler resmî JLPT veya geçme tahmini değildir.

## 0.8.1 · Arayüz iyileştirmeleri

105/105 test, JavaScript sözdizimi kontrolü ve 42 tarayıcı dosyalı Worker derlemesi başarılı. Yeni davranış testi, kişisel deste/zorlanma/dinleme filtrelerinin kayıttan sonraki yeniden çizimde klavye odağını ve sayfa konumunu koruduğunu doğrular.

Yerel 4183 arayüzünde masaüstü yan menüsü ve yinelenen üst bağlantıların kaldırılması, 390 piksel Türkçe gezinme, Bölümler menüsünden Dinleme’ye geçiş ve menünün kapanması incelendi. Alt menünün ilk CSS denemesinde üst boşluk yüzünden etiketlerin aşağı kaydığı görüldü; mobil üst padding sıfırlanıp etiketler görünür olarak yeniden doğrulandı.

320 piksel büyük yazı + İngilizce görünümde kişisel kelime formu, CSV önizlemesi, Zorlandıklarım filtreleri/sayaçları ve Dinleme sayfası kontrol edildi. Belge genişliği 305 piksel, görünüm 320 pikseldi. Kişisel alanlar 20 piksel yazıyla ekran içinde kaldı; zorlanma sayaçları iki sütunda taşmadı. CSV tablosu kendi yatay kaydırma alanında kaldı, belgeyi genişletmedi. 山 / やま / dağ / mountain formu kaydedildi; isteğe bağlı alan açılırken taslak korundu. CSV metin açılır alanından tek satırlı önizleme üretildi; içe aktarma onaylanmadı.

Kontrollü 4184 ses QA’sında yeni tur başlatılınca ayarlar kapalı, soru görünür, cevap alanı ses öncesinde devre dışıydı. Bu ek kontrol gerçek ses çıkışı doğrulaması değildir. Fiziksel telefon, ekran okuyucu ve gerçek çentikli ekran güvenli alanı denenmedi.

## 0.8 · Kişisel çalışma paketi

104/104 test, uygulama/sunucu JavaScript sözdizimi kontrolü ve 41 tarayıcı dosyalı Worker derlemesi başarılı.

Yeni testler kişisel alan/sınır/kimlik doğrulaması, revizyon ve geri alınabilir kaldırma, CSV BOM/alıntı/yeni satır/ayırıcı/hata atomikliği, formül korumalı dışa aktarma, eski verinin göçü, zorlanma geçmişi ve ayrı beceriler, eksik kaynaklar, dondurulmuş turlar, eski form gönderimleri ve dinleme renderer/gate/evidence entegrasyonunu kapsar. Dinleme sözlüğünün tüm hazır kelimelerinde iki modun cevap/çeldirici kimlikleri taranır; iptal/hata/eski callback/başka sürüm tamamlanma kanıtı sayılmaz.

Gerçek uygulama içi tarayıcı, ayrı yerel 4183 adresi:

- Genki 1 · Bölüm 1 destesi oluşturuldu. 学校 / がっこう / okul / school, etiket ve örnek eklendi. Anlam pratiğinde yazılan cevap, okunuş açılıp kapanırken korundu. Yanlış tren cevabı ve ipucu kullanımı kaydedildi; Zorlandıklarım bunu ayrı sütunlarda gösterdi. Aynı soruya kısa turda okul cevabı doğru kabul edildi; eski yanlış korunup ipucusuz doğru sayısı 1 oldu.
- CSV önizlemesinde 本 geçerli, 水 için water okunuşu hatalıydı. 1 hata varken onay devre dışı ve kelime sayısı değişmeden kaldı. Okunuş みず olarak düzeltildikten sonra iki kelime açık onayla eklendi. Yenilemede deste ve üç kelime korundu.
- Kişisel deste, Zorlandıklarım ve Dinleme sayfaları 390 piksel, 320 piksel büyük yazı ve İngilizce görünümde incelendi; yatay belge taşması yoktu. Kişisel kelimeler dinleme kaynağına 3 kelime olarak geldi. Normal test tarayıcısında Japonca ses yoktu; gerçek dinleme başlatma düğmesi açıklamayla devre dışı kaldı.

Kontrollü ses/clock QA proxy’si, ayrı 4184 adresi (yalnız repo dışındaki work dosyası, yayınlanmaz):

- Görünür “Simulated audio · QA only” etiketi altında sahte Japonca motoru başlama/bitiş callback’leri üretti; gerçek ses yoktu. Ses öncesinde Japonca kelime görünmedi ve cevap alanları kapalıydı; 1–4 kısayolu devre dışı seçenekleri işaretlemedi. Ses iptalinden sonra cevap kapısı kapalı kaldı.
- Dikte sorusunda ses tamamlandıktan sonra yanlış cevap kaydedildi. Yalnız test saatini 11 dakika ilerleterek aynı soru normal tekrar kuyruğunda açıldı; yeniden dinlemeden cevap verilemedi. Tamamlanan ses sonrası doğru cevap kaydedildi. Zorlandıklarım turundaki aynı dinleme sorusunda da bağımsız scope kapısı çalıştı.
- UI’dan indirilen JSON incelendi: tam 3 benzersiz olay, becerilerin tümü listening, modlar listening/review/weakness, tümünde audioPlaybackCompleted:true; sonuçlar yanlış/doğru/doğru. Başlatılan/iptal edilen ilk sesli tur cevap üretmedi. QA verisi, proxy, sahte motor ve saat kaydırma dosyaları kaynak deposuna alınmaz.

Gerçek ses çıkışı/telaffuz, fiziksel telefon ve ekran okuyucu denenmedi. Yeni kişisel içeriğin doğruluğu kullanıcıya aittir; N5–N1 etiketleri kullanıcı etiketi/çalışma bandıdır. Bu sürüm bulut eşitlemesi veya yeni bildirim servisi eklemez. Önceki 14 piksel mobil okunuş düğmesi boşluğu bu kaynak commitine dahil edilir.

## 0.7.1 · Seçim tablolarında kaydırma

67/67 test ve JavaScript sözdizimi kontrolü başarılı. Üç yeni test, değiştirilmiş DOM üzerinde çoklu tablo kaydırması ve sayfa konumu; tablo kapsamında doğru odağın preventScroll ile bulunması ve açıklık durumunun art arda korunması; kaldırılan tablolar ve uygulama dışındaki odak durumunu doğrular.

Gerçek uygulama içi tarayıcıda ayrı yerel 4182 adresinde:

- 390×844 zor hiragana tablosunda ky satırını seçme/kaldırma ve klavyeyle seçim denendi. Kararlı başlangıçta tablo scrollTop 953 ve sayfa 550, seçimden sonra aynı kaldı; odak ky üzerinde korundu.
- Kelime listesinde son satırdan önceki パイナップル seçilirken liste 429, sayfa 1380 olarak korundu. Cümle listesinde önceki お会計をお願いします。 satırına geçişte liste 89 olarak kaldı; sayfa konumunda 1 piksel yuvarlama farkı görüldü. Gramerde önceki kibar davet satırını seçerken liste 599 ve sayfa 1038 değişmedi.
- 320×740 büyük yazı katakana tablosunda doğrudan klavye seçimiyle tablo 937, sayfa 800; masaüstünde de aynı değerler korundu. Test aracının görünmeyen öğeyi tıklamadan önce otomatik görünür alana getirmesi ile uygulamanın seçim sonrası kaydırması birbirinden ayrılarak ölçüldü.
- Yakalanmış konsol hatası/uyarısı yoktu. Fiziksel telefon ve ekran okuyucu testi yapılmadı; tarayıcıdaki mobil görünüm ve klavye kullanıldı.

## 0.7 · Kelimelerin sesli okunuşu

64/64 test, sözdizimi kontrolü ve Worker derlemesi başarılı. Beş yeni test grubu: 200 kelime/50 kanji kelimesi/eski sözlük kelimelerinin açık kana kaynağı; Japonca olmayan sese geçmeme ve geç yüklenen Japonca ses; normal/yavaş hız ve doğru dil/okunuş; yeni kelimeye geçiş/durdurma/hata sırasında eski callback’lerin yok sayılması; soru öncesi ipucu ve iki geri bildirim sonucunda denetimlerin korunması. Ses motoru testleri kontrollü sahte motorla yapılır; gerçek telaffuz kalitesini kanıtlamaz.

Gerçek uygulama içi tarayıcıda ayrı yerel 4180 adresinde kelime kartı, okunuşu gizleme, N3 yazılım okunuş sorusu ve doğru 不具合 → ふぐあい geri bildirimi incelendi. Cevap öncesi ipucu açıklaması vardı; cevap sonrasında kana satırı ve iki ses düğmesi korundu, ipucu notu kaldırıldı. Eski kafe metni ve kelime paneli açıldı; metin sesi ve yeni kelime ses denetimleri aynı anda doğru destek durumunu gösterdi. 390×844 ve 320×740 büyük yazıda yatay taşma görülmedi. Konsol kontrolünde hata/uyarı yoktu.

Bu tarayıcı Japonca ses sunmadı; normal/yavaş düğmeleri açıklamayla devre dışı kaldı ve İngilizce sesle yanıltıcı oynatma yapılmadı. Gerçek ses çıkışı, Japonca sesli fiziksel telefon ve telaffuz/vurgu kalitesi doğrulanmadı. Başarılı oynatımın düğmeye tıklamadan ses motoruna kadar gerçek cihaz üzerinde uçtan uca doğrulaması bu kayıtta yoktur. Ücretli hizmet veya yeni ses hesabı bağlanmadı.

## 0.6 · Okunuş, kanji ve hatırlatma

59/59 test, JavaScript sözdizimi kontrolü ve Worker derlemesi başarılı. Yeni on test; cevap öncesi/sonrası kana, yazma sorusunda tam kelime, eski tekrar kimlikleri, kaçırılmış/erişilebilir kanji metni, eksik/tam SVG grupları, sözlük kimliği ve önbellek, kaynak/lisans kapsamı, kapalı varsayılan, seçili dakikada günde bir tetikleme, günlük ICS/VALARM ve kaydedilmemiş Google Takvim taslağını kapsar.

Uygulama içi tarayıcıda ayrı yerel 4179 adresinde:

- N3 yazılım kartında okunuş gizle/göster çalıştı. Okunuş sorusuna yazılan `taslak`, ipucu açılıp kapanırken korundu. Yanlış 不具合 cevabından sonra ふぐあい yazımın hemen altında gösterildi. Sonraki 定義 sorusunda ていぎ doğru kabul edildi ve aynı satırda kaldı. Yenilemede cevap ve okunuş korundu.
- Kanji paneli gerçek API’den 定 anlamı, on/kun okunuşları, 宀/疋 yazım parçaları ve bunların kaynak anlamlarını getirdi. İlk tıklamadaki odak/kapanma yarışı ve panelin görünümün altını aşması bulundu, düzeltildi ve tekrar denendi. Kapat düğmesi aynı pencereyi yeniden açmadı. Kaynaklar sayfası İngilizce arayüzde incelendi.
- Hatırlatma 19:37 olarak kaydedildi; yenilemede saat ve açık tercihi korundu. Deneme düğmesi, bildirim izni olmadan uygulama içi mesaj verdi. İzin açılmadı; OS bildirimi gönderildiği iddia edilmez. İndirilen ICS ayrıştırıldı: günlük RRULE, 19:37 yerel başlangıç, sabit UID ve olay saatinde VALARM mevcut. Dış takvim etkinliği kaydedilmedi.
- 390×844 telefon görünümü ve 320×740 büyük yazıda kelime/panel sınırları denendi; belge yatay taşmadı, panel ekran içinde kaldı. Son konsol denetiminde hata/uyarı yoktu.

Fiziksel telefon, ekran okuyucu, giriş yapılmış canlı UI, sistem izni/OS bildirim teslimi ve dış takvim alarmının telefon teslimi test edilmedi. Kapalı uygulama push hizmeti bağlanmadı. Harici sözlüklerin tüm kayıtları insan editörü tarafından doğrulanmış değildir. Önceki anime/çeviri akışları bu sürümde yeniden elle denenmedi; regresyon testleri geçti. Yerel yapay QA cevapları ve takvim indirmesi kaynak deposuna eklenmez.

## 0.5.1 · Canlı erişim ve çeviri düzeltmesi

49/49 test ve Worker derlemesi başarılı. Yeni iki test, sunucu QUOTA cevabında sabit sağlayıcıya tarayıcıdan geçişi ve İngilizce ara dili; başarılı sunucu yanıtında/başka hatada/iptalde gereksiz doğrudan çağrı yapılmamasını doğrular.

İlk yayın Sites tarafından başarılı olarak bildirildi. Canlı HTTP kontrolünde oturumsuz istek 401; Site servis erişimiyle ana sayfa, çalışma modülü ve manifest 200 döndürdü. HTTPS çeviri doğrulaması 400 ile aynı dil çiftini reddetti. Gerçek sağlayıcı isteği bulut sunucusunda 429/QUOTA döndürdü. Cihazdan aynı sağlayıcıya istek 200 ve CORS * döndürdü.

Üretilen Worker yerel test sunucusunda çalıştırıldı; API kasıtlı olarak aynı 429/QUOTA yanıtını verdi. Gerçek uygulama içi tarayıcıda Merhaba girişi MyMemory’ye doğrudan, İngilizce üzerinden gönderildi ve Japonca sonuç alındı. Bu bir çeviri kalitesi değerlendirmesi değildir. Fiziksel telefon veya giriş yapılmış canlı tarayıcı oturumu test edilmedi; canlı sitede hesabın sahibinin ChatGPT girişi gerekir.

## 0.5 · Çevrimiçi yayın hazırlığı

47/47 otomatik test başarılı. Üç yeni test grubu: Worker statik izin listesi/HEAD/UTF-8/yöntem kontrolleri; HTTPS same-origin çeviri, İngilizce ara dil ve yanlış köken reddi; JSON/yöntem/gövde boyutu hatalarının sağlayıcı çağrısı yapmadan reddi. Önceki karakter, içerik, depolama ve altı çeviri yönü testleri de geçti. Derleme, üretilen Worker’ın default.fetch dışa aktarımını ve ana sayfa/uygulama modülü/manifest için HTTP 200 yanıtını doğruladı.

Bu kayıt yayın öncesi otomatik kontroldür. Gerçek yayın sonucu ve varsa canlı hizmet kontrolleri teslim mesajında belirtilir. Yeni hesap/cihaz eşitlemesi veya fiziksel telefon testi yapıldığı anlamına gelmez. Eski kayıtların bulunduğu Node yerel sunucusu loopback üzerinde korunur.

## 0.4 · İçerik genişletmesi

44/44 otomatik test ve bütün uygulama/sunucu JS dosyalarının sözdizimi kontrolü başarılı. Önceki kapsam testleri genişletilmiş havuzu baştan sona tarar: 200 kelimenin üç soru türü, 120 cümle ve 50 gramer sorusunun hedef/varyantları, 50 kanji kelimesinin üç soru türü. Yeni testler ham içerik alanlarının tamlığı, boşluk hedefinin tek kez geçmesi, karışık/hiragana/yarım genişlikte okunuşların değerlendirilmesi, kanji kimliklerinin benzersizliği ve 18/34/50 kümülatif kapsamı içindir. Önceki 33 alfabe/model/depolama/çeviri kontrolü de bu toplamın içindedir.

Gerçek uygulama içi tarayıcıda, ayrı yerel 4176 portunda:

- Ana sayfa 200 kelime / 7 başlık, 120 cümle / 6 ortam ve 50 gramer konusu gösterdi.
- N5 aile başlığı dört kelime ve kendi ailesinden bahsetme notunu getirdi. 父 kaydetme iki tekrar kartı oluşturdu; 母 → annem seçimi doğru kabul edildi. Yenilemede aynı geri bildirim korundu.
- Alışveriş başlığı dört yeni N5 cümle getirdi. それをください sorusunda それ doğru kabul edildi.
- N4 gramerde Türkçe önceden araması yeni ておく konusunu buldu; おき doğru kabul edilip açıklama gösterildi.
- Kanji havuzu zor düzeyde 50, açıklama 18/34/50 gösterdi. Turdaki 敵 için teki girişi Enter gerektirmeden 1/10 → 2/10 ilerledi.
- Mobil 390×844 ana sayfa ve 320×740 büyük yazılı yeni aile ekranı incelendi; belge genişliği görünümü aşmadı. İngilizce yeni konu adları, anlam ve açıklamalar açıldı; aynı dar genişlikte taşma görülmedi. Son tarayıcı konsolunda yakalanmış hata yoktu.

Kitap dosyaları sağlanmadığından Genki baskısı/kelime listeleriyle birebir karşılaştırma yapılmadı. İnsan Japonca editörü doğrulaması yapılmadı. Bu sürümde anime oynatıcısı veya gerçek çeviri hizmeti yeniden denenmedi. Test kayıtları yapay ve yereldir; GitHub’a/pakete dahil edilmez.

## 0.3 · Kelime, cümle ve gramer

Windows, Node.js 26.11.1 ve uygulama içi Chromium. 41/41 otomatik test ve bütün uygulama/sunucu JS dosyalarının sözdizimi kontrolü başarılı. Sekiz yeni test: 60/40/25 içerik sayısı ve tüm düzey/konu/ortam kapsamı; benzersiz kimlikler ve TR/EN örnekler; tüm soru türlerinin tekrar kimlikleriyle çözümlenmesi; tek doğru seçenek; boşluk hedefleri ve varyantları; birleşik filtre/arama; karışık turun 10 soruyla sınırı ve seçki anlık görüntüsü; başarı üretmeden kaydetme ve önceki aralıkları koruma; beceri ayrımı ve yanlışta 10 dakika; şema 2 cevap/harf oturumunun şema 3’te korunması. Önceki alfabe otomatik geçiş testleri de geçti.

Gerçek tarayıcıda gözlenenler:

- N3 → Yazılım seçimi dört doğru kart getirdi. 変数 kaydı iki ayrı tekrar kartı oluşturdu. Arama tek kelimeye daraltıldı ve temizleme dört karta döndü.
- Yanlış anlam seçimi gerekçe/cevap gösterdi; yenilemede aynı geri bildirim korundu. へんすう doğru kabul edildi; tek soruluk turun özeti 1/1 gösterdi.
- N1 → İş yerinde cümleleri ve resmî kullanım notu açıldı. をよぎなく kana varyantı doğru kabul edildi.
- N4 gramer kartından boşluk doldurmaya geçildi. ことが doğru kabul edildi ve açıklama gösterildi.
- Ortak tekrar listesinde yeni kelime, cümle ve gramer kartları doğru Japonca bağlamla çözümlendi. Kaydedilen 変数 anlam kartı tekrar ekranında cevaplanıp zamanlandı. Dördüncü seçenek klavyede 4 ile seçilebildi.
- Ana sayfada üç yeni bağlantı; menüde Kelimeler/Cümleler/Gramer. Yeni kelime sayfası İngilizce açıldı; Türkçeye dönüş çalıştı.
- Mobil 390×844, ayrıca 320×740 ve büyük yazı açıkken üç yeni sayfa ile ana sayfa incelendi; belge genişliği görünüm genişliğini aşmadı. Alt menü altı öğe içeriyor; anime, okuma ve tekrar ana sayfadan erişilebilir.
- Son tarayıcı kontrolünde yakalanmış konsol hatası yoktu. QA için ayrı yerel portlar kullanıldı; test verileri GitHub’a veya pakete eklenmedi.

Bu kontrol insan Japonca editörü onayı, eksiksiz JLPT müfredatı, fiziksel telefon veya ekran okuyucu testi değildir. 0.2 anime oynatıcısı/gerçek çeviri hizmeti bu sürümde yeniden sınanmadı. Aşağıdaki eski sürüm kayıtları tarihsel olarak korunur.

## 0.2.1 · Alfabe akışı

[Yeni alfabe geri bildirim ekranı](qa/alphabet-auto-flow.jpg): yanlış giriş aynı karakterde kalır; cevap açılmadan tekrar yazılabilir.

33 otomatik test başarılı. Yeni altı test: kısmi yazım, doğru cevabın Enter olmadan ilerlemesi, yanlışta kalma ve tekrar deneme, boş Enter ile cevabı açıp ilerleme, son kartta cevabın korunması, eski/tekrarlanan giriş olaylarının sonraki soruyu cevaplamaması, Japonca yazma ve seçenekli soru davranışı.

Gerçek uygulama içi tarayıcıda beş harflik tur denendi: yanlışta aynı kart kaldı; doğru girince 1/5 → 2/5 otomatik geçti; odak yeni cevap alanında kaldı; yenilemede konum korundu. Boş Enter ile kalan dört cevap açıldı ve özet 1/5 doğru + 4 gösterilen cevap olarak göründü. Ayrı turda beş cevap Enter olmadan doğru tamamlandı; sh başlangıcında yanlış mesajı çıkmadı, si varyantı kabul edildi. Katakana yazarak cevaplama ve seçenekli yanlış/doğru geçişi de doğrulandı. Fiziksel Japonca IME ile uçtan uca deneme yapılmadı; bileşim olayları değerlendirmede beklenir. Bu kontrol, 0.2 ekranlarının tümünün yeniden test edildiği anlamına gelmez.

## 0.2 güncellemesi

**27 test başarılı**, uygulama ve sunucu JS dosyalarının tamamı sözdizimi kontrolünden geçti. Yeni testler: 46/71/104 kana kapsamı, satır filtresi, rastgele turun benzersiz soruları, üç egzersiz türü, tüm karakter soru kimliklerinin tekrar kuyruğunda çözülmesi, romaji alternatifleri, eski şema 1 kayıtlarının korunarak şema 2'ye taşınması, dört anime örneği, kişisel replik doğrulaması, altı çeviri yönü, UTF-8 sınırı, kota/yanlış yanıt/timeout/ağ hatası.

Gerçek tarayıcıda yeni ana sayfa, görünür çeviri masası, çeviri isteği ve karakter seçimi ekranı açıldı. Ardından Computer Use, Chrome'un geçerli URL'sini güvenilir şekilde doğrulayamadığı için tüm bilgisayar/tarayıcı kontrolü durduruldu. 0.2 için bütün tur akışları, gerçek embed oynatımı ve mobil/büyük yazı görsel doğrulaması tamamlanamadı. Aşağıdaki ekran görüntüleri ve ilk akış kontrolü **0.1 geçmiş kaydıdır**; 0.2 kanıtı olarak sunulmaz.

HTTP üzerinden altı gerçek çeviri yönü denendi. Doğrudan TR↔JA sonuçlarında bariz kalite hatası bulundu; İngilizce ara dil eklenip bu iki yönde gerçek hizmet tekrar denendi. HTTP 200 yalnızca hizmet yanıtını kanıtlar; dil doğruluğu garanti edilmez. Örnek sonuçlar alıştırma anahtarına aktarılmadı. Kaynak ve sınırlar [sources-v02.md](sources-v02.md) dosyasında.

GitHub hedefi kullanıcı tarafından sağlandı: [AtaKaanSavasci/yomu-](https://github.com/AtaKaanSavasci/yomu-). Depo oluşturma aracı olmadığı ve yerel Git kimliği bulunmadığı için oluşturma adımını kullanıcı yaptı; kaynak aktarımı bağlı GitHub araçlarıyla yürütülür. Systema deposuna dokunulmadı.

## 0.1 tarihsel doğrulama

Ortam: Windows, Node.js 26.11.1, npm 11.20.0; gerçek Chromium tabanlı uygulama içi tarayıcı. Aşağıdaki test kayıtları yalnızca bu inceleme sırasında üretilen yapay QA verileridir; ekran görüntülerindeki ilerleme gerçek kullanıcının öğrenme başarısı değildir.

## Otomatik kontroller

`npm run check` ve sunucu sözdizimi kontrolü başarılı. `npm test`: **16 / 16 başarılı**.

- Üç ders, dokuz soru ve 15 kelimenin referans bütünlüğü; iki dilde cevap anahtarları ve çoktan seçmeli sorularda tek geçerli seçenek.
- Türkçe büyük/küçük harf, Unicode NFKC, uç noktalama ve boşluk normalleştirmesi; okunuş sorusunda romajinin reddi.
- `に/へ` varyantları, İngilizce/Türkçe eş anlamlılar, katakana/hiragana kahve okunuşu.
- 10 dakika ve 1/3/7/14/30 günlük zamanlama; yanlış sonrası basamak sıfırlama.
- UUID tekilleştirme, içerik/algoritma sürümü ve girilen cevabın korunması.
- Anlam/okunuş/yazılı tamamlama ayrımı; sıfır dinleme olayı.
- Kelime eklemenin cevap üretmemesi; askıya almanın başarı üretmemesi; vadesi gelen kart sınırı.
- İstanbul/Los Angeles gün sınırları, yaz saati geçişleri ve geçmiş olayların saat dilimini koruması; yedi benzersiz takvim günü.
- `fake-indexeddb` ile atomik cevap+oturum kaydı ve tekrar açılış; eski sekmenin yazmasının reddi; aynı revizyona iki eşzamanlı yazmada tek kazanan.

## Gerçek tarayıcı kontrolleri

| Akış | Gözlenen sonuç |
| --- | --- |
| Ana sayfa → metin → alıştırma → tamamlanma | Üç ders de tamamlandı; 9 ders cevabı kaydedildi |
| Yanlış anlam cevabı | Gerekçe, doğru cevap ve 10 dakika sonraki tekrar mesajı gösterildi |
| Yenileme | Aynı sorunun girilmiş cevabı/gerekçesi korundu; ikinci olay üretilmedi |
| Japonca yazma + Enter | `ほん`, `きょう`, `こうえん`, `で`, `と`, `へ` ile cevaplar kabul edildi |
| Yeni bağlamda alternatif cevap | Son derste `へ` kabul edildi ve `に/へ` farkı açıklandı |
| Kelime kaydetme → tekrar | Ayrı anlam/okunuş kartları oluştu; `coffee shop` eş anlamlısı kabul edildi |
| “Biliyorum” | Okunuş kartı askıya alındı; liste “Skipped by you” ve “Resume” gösterdi |
| Yerel sorun bildirimi | `c-reading` ve içerik sürümüyle not kaydedildi; tercihlerde listelendi |
| Dil tercihi | İngilizceye geçiş ve sayfa yenilemesinden sonra İngilizce korundu; Türkçeye dönüş çalıştı |
| Furigana/açıklama/çeviri | Bağımsız anahtarlar metin ve yan paneli değiştirdi |
| Saat dilimi | `invalid/zone` kaydedilmedi; açıklayıcı hata gösterildi. `Europe/Istanbul` kabul edildi |
| Başlangıç ve günlük süre | Modal üzerinden 5/10 dakika tercihi ve önerilen cevap sayısı güncellendi |
| JSON dışa aktarma | Dosya indirildi ve ayrıştırıldı: 10 benzersiz cevap, 3 tamamlanmış ders, 1 sorun notu, şema 1, 0 dinleme olayı |
| İki gerçek sekme | Eski sekmenin yazması reddedildi; yenileme mesajı ve yeni dil tercihi doğrulandı |
| Japonca ses yok | Sentetik ses düğmesi devre dışı; “Japonca ses bulunamadı” mesajı gösterildi |
| Klavye | Cevap formunda Enter ve ana içeriğe atlama denendi; atlama mevcut rotayı koruyarak `main` odağını aldı |
| Tamamlanan metni yeniden açma | Okuma ekranına döndü; önceki başarı geçmişi korundu |

## Görsel kontrol

Masaüstü 1440×1000; mobil 390×844 ve dar ekran 320×800 incelendi. Büyük yazı modu varsayılan kök yazı boyutunu 16'dan 20 piksele çıkarır. İlk dar ekran incelemesinde günlük plan kartı taşması bulundu; grid ve esnek satır sınırları düzeltilip Türkçe/İngilizce tekrar incelendi. Mobilde tercihler için üst araç çubuğu bağlantısı eklendi.

- [Masaüstü günlük alan](qa/desktop.jpg)
- [Masaüstü okuma ve bağlam paneli](qa/reader-desktop.jpg)
- [Mobil okuma, büyük yazı açık](qa/mobile-large-text.jpg)

Ekran görüntüleri tam sayfadır. Mobilde sabit alt gezinme çubuğu, ekran görüntüsünde ilk görünüm yüksekliğinde içerik üzerinde görünür; gerçek kullanımda içerik kaydırılır ve sayfanın altında gezinme alanı kadar boşluk bırakılır.

## Henüz doğrulanmayanlar

İnsan Japonca editör kontrolü, gerçek ses oynatma (bu ortamda Japonca ses yok), farklı işletim sistemi/tarayıcılar, fiziksel mobil cihazlar, ekran okuyucuyla uçtan uca deneme, tarayıcı %200 yakınlaştırma, gerçek disk kotası/işletim sistemi çökmesi ve büyük veri kümeleri test edilmedi. `fake-indexeddb` gerçek tarayıcı depolamasının tüm disk davranışlarını temsil etmez. Öğrenme performansı veya gecikmeli hatırlama deneyi yapılmadı.

Araştırma kopyalarının SHA-256 değerleri özgün dosyalarla eşleştirildi. Mevcut Systema dosyalarına dokunulmadı. Dağıtım/yayın yapılmadı.
