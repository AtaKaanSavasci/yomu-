# Mimari ve tekrar kararı · 30 Ekim 2026

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
