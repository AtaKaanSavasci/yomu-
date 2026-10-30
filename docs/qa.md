# Doğrulama kaydı · 30 Ekim 2026

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
