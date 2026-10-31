# Doğrulama kaydı · 31 Ekim 2026

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
