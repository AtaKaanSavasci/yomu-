// Original bilingual study material. Levels are approximate study bands.
// Dictionary and grammar references: docs/sources-v094.md.
const rows=text=>text.trim().split('\n').map(line=>line.trim().split('|'));
export const expansionWordRows=rows(`
N5|fruits|grapefruit|グレープフルーツ|グレープフルーツ|greyfurt|grapefruit|朝ご飯にグレープフルーツを食べます。|あさごはんに グレープフルーツを たべます。|Kahvaltıda greyfurt yerim.|I eat grapefruit for breakfast.
N5|fruits|raisin|レーズン|レーズン|kuru üzüm|raisin|パンにレーズンを入れます。|パンに レーズンを いれます。|Ekmeğe kuru üzüm koyarım.|I put raisins in the bread.
N5|objects|drinking-glass|コップ|コップ|bardak|drinking glass|コップに水を入れます。|コップに みずを いれます。|Bardağa su koyarım.|I put water in the glass.
N5|objects|bed|ベッド|ベッド|yatak|bed|部屋にベッドがあります。|へやに ベッドが あります。|Odada bir yatak var.|There is a bed in the room.
N5|software|copy-action|コピー|コピー|kopyalama|copying|この文をコピーします。|この ぶんを コピーします。|Bu cümleyi kopyalarım.|I copy this sentence.
N5|software|photograph|写真|しゃしん|fotoğraf|photograph|スマホで写真を撮ります。|スマホで しゃしんを とります。|Telefonla fotoğraf çekerim.|I take photos with my phone.
N5|family|family-group|家族|かぞく|aile|family|家族と晩ご飯を食べます。|かぞくと ばんごはんを たべます。|Ailemle akşam yemeği yerim.|I eat dinner with my family.
N5|family|child|子供|こども|çocuk|child|子供が公園で遊んでいます。|こどもが こうえんで あそんでいます。|Çocuk parkta oynuyor.|The child is playing in the park.
N5|food|soup|スープ|スープ|çorba|soup|温かいスープを飲みます。|あたたかい スープを のみます。|Sıcak çorba içerim.|I have some warm soup.
N5|food|cheese|チーズ|チーズ|peynir|cheese|パンにチーズをのせます。|パンに チーズを のせます。|Ekmeğin üzerine peynir koyarım.|I put cheese on the bread.
N5|time|this-week|今週|こんしゅう|bu hafta|this week|今週は毎日勉強します。|こんしゅうは まいにち べんきょうします。|Bu hafta her gün ders çalışırım.|I study every day this week.
N5|time|afternoon|午後|ごご|öğleden sonra|afternoon|午後、図書館に行きます。|ごご、としょかんに いきます。|Öğleden sonra kütüphaneye giderim.|I go to the library in the afternoon.
N5|travel|bicycle|自転車|じてんしゃ|bisiklet|bicycle|自転車で学校に行きます。|じてんしゃで がっこうに いきます。|Okula bisikletle giderim.|I go to school by bicycle.
N5|travel|taxi|タクシー|タクシー|taksi|taxi|駅までタクシーに乗ります。|えきまで タクシーに のります。|İstasyona kadar taksiye binerim.|I take a taxi to the station.
N4|fruits|lime|ライム|ライム|misket limonu|lime|ライムを薄く切ります。|ライムを うすく きります。|Misket limonunu ince keserim.|I slice the lime thinly.
N4|fruits|coconut|ココナッツ|ココナッツ|Hindistan cevizi|coconut|ココナッツの果肉を使います。|ココナッツの かにくを つかいます。|Hindistan cevizinin etli kısmını kullanırım.|I use the flesh of the coconut.
N4|objects|futon|布団|ふとん|futon yatak|futon bedding|朝、布団を畳みます。|あさ、ふとんを たたみます。|Sabah futon yatağı katlarım.|I fold the futon in the morning.
N4|objects|light-bulb|電球|でんきゅう|ampul|light bulb|切れた電球を取り替えます。|きれた でんきゅうを とりかえます。|Yanmış ampulü değiştiririm.|I replace the burnt-out light bulb.
N4|software|selection|選択|せんたく|seçim|selection|必要な項目を選択します。|ひつような こうもくを せんたくします。|Gerekli öğeleri seçerim.|I select the required items.
N4|software|image|画像|がぞう|görüntü|image|画像をメールで送ります。|がぞうを メールで おくります。|Görüntüyü e-postayla gönderirim.|I send the image by email.
N4|family|parents|両親|りょうしん|anne ve baba|parents|週末に両親に会います。|しゅうまつに りょうしんに あいます。|Hafta sonu annemle babamı görürüm.|I see my parents at the weekend.
N4|family|cousin|いとこ|いとこ|kuzen|cousin|いとこと映画を見ました。|いとこと えいがを みました。|Kuzenimle film izledim.|I watched a film with my cousin.
N4|food|miso|味噌|みそ|miso ezmesi|miso paste|味噌を少し入れます。|みそを すこし いれます。|Biraz miso koyarım.|I add a little miso.
N4|food|soy-sauce|醤油|しょうゆ|soya sosu|soy sauce|豆腐に醤油をかけます。|とうふに しょうゆを かけます。|Tofunun üzerine soya sosu dökerim.|I pour soy sauce over the tofu.
N4|time|week-after-next|再来週|さらいしゅう|gelecek haftadan sonraki hafta|the week after next|再来週、京都に行きます。|さらいしゅう、きょうとに いきます。|Gelecek haftadan sonraki hafta Kyoto'ya giderim.|I am going to Kyoto the week after next.
N4|time|next-year|来年|らいねん|gelecek yıl|next year|来年、日本語の試験を受けます。|らいねん、にほんごの しけんを うけます。|Gelecek yıl Japonca sınavına gireceğim.|I will take a Japanese exam next year.
N4|travel|sightseeing|観光|かんこう|turistik gezi|sightseeing|京都で観光を楽しみました。|きょうとで かんこうを たのしみました。|Kyoto'da turistik gezinin tadını çıkardım.|I enjoyed sightseeing in Kyoto.
N4|travel|japanese-inn|旅館|りょかん|Japon tarzı konukevi|Japanese-style inn|駅の近くの旅館に泊まりました。|えきの ちかくの りょかんに とまりました。|İstasyon yakınındaki Japon tarzı konukevinde kaldım.|I stayed at a Japanese-style inn near the station.
N3|fruits|fruit-shop|果物屋|くだものや|meyve dükkânı|fruit shop|駅前の果物屋で梨を買いました。|えきまえの くだものやで なしを かいました。|İstasyon önündeki meyve dükkânından armut aldım.|I bought pears at the fruit shop in front of the station.
N3|fruits|drying|乾燥|かんそう|kurutma|drying|ぶどうを乾燥させて保存します。|ぶどうを かんそうさせて ほぞんします。|Üzümleri kurutarak saklarım.|I dry the grapes to preserve them.
N3|objects|ruler|物差し|ものさし|cetvel|ruler|物差しで長さを測ります。|ものさしで ながさを はかります。|Uzunluğu cetvelle ölçerim.|I measure the length with a ruler.
N3|objects|kitchen-knife|包丁|ほうちょう|mutfak bıçağı|kitchen knife|包丁で野菜を細かく切ります。|ほうちょうで やさいを こまかく きります。|Sebzeleri mutfak bıçağıyla küçük küçük doğrarım.|I finely chop the vegetables with a kitchen knife.
N3|software|operation|操作|そうさ|kullanım işlemleri|operation|新しいアプリの操作に慣れました。|あたらしい アプリの そうさに なれました。|Yeni uygulamanın kullanımına alıştım.|I got used to operating the new app.
N3|software|decompression|解凍|かいとう|sıkıştırılmış dosyayı açma|decompression|受け取ったファイルを解凍します。|うけとった ファイルを かいとうします。|Gelen sıkıştırılmış dosyayı açarım.|I decompress the file I received.
N3|family|acquaintance-familiar|知り合い|しりあい|tanıdık kişi|an acquaintance|近所の知り合いに道を教えてもらいました。|きんじょの しりあいに みちを おしえて もらいました。|Mahalleden bir tanıdığım bana yolu tarif etti.|An acquaintance from the neighbourhood gave me directions.
N3|family|companion|仲間|なかま|aynı gruptan arkadaş|companion|同じ目標を持つ仲間と勉強しています。|おなじ もくひょうを もつ なかまと べんきょうしています。|Aynı hedefi paylaşan arkadaşlarımla çalışıyorum.|I study with companions who share the same goal.
N3|food|deep-fry|揚げる|あげる|bol yağda kızartmak|to deep-fry|油で野菜を揚げます。|あぶらで やさいを あげます。|Sebzeleri bol yağda kızartırım.|I deep-fry the vegetables in oil.
N3|food|bake-grill|焼く|やく|ızgara yapmak veya fırında pişirmek|to grill or bake|オーブンで魚を焼きます。|オーブンで さかなを やきます。|Balığı fırında pişiririm.|I bake the fish in the oven.
N3|time|leeway|余裕|よゆう|zaman payı|time to spare|早く着いたので、時間に余裕があります。|はやく ついたので、じかんに よゆうが あります。|Erken vardığım için zamanım var.|I arrived early, so I have time to spare.
N3|time|just-before|直前|ちょくぜん|hemen öncesi|just before|出発の直前に荷物を確認します。|しゅっぱつの ちょくぜんに にもつを かくにんします。|Hareketten hemen önce eşyaları kontrol ederim.|I check my luggage just before departure.
N3|travel|crowding|混雑|こんざつ|kalabalık ve yoğunluk|crowding|朝の駅は混雑しています。|あさの えきは こんざつしています。|İstasyon sabahları kalabalık oluyor.|The station is crowded in the morning.
N3|travel|luggage|荷物|にもつ|bagaj|luggage|重い荷物を棚に置きます。|おもい にもつを たなに おきます。|Ağır bagajı rafa koyarım.|I put the heavy luggage on the shelf.
N2|fruits|farm-plantation|農園|のうえん|tarım işletmesi|farm|週末に果物の農園を見学しました。|しゅうまつに くだものの のうえんを けんがくしました。|Hafta sonu bir meyve çiftliğini gezdim.|I visited a fruit farm at the weekend.
N2|fruits|shipment|出荷|しゅっか|ürün sevkiyatı|shipment|収穫した果物を市場へ出荷します。|しゅうかくした くだものを いちばへ しゅっかします。|Hasat edilen meyveleri pazara sevk ederiz.|We ship the harvested fruit to the market.
N2|objects|component-part|部品|ぶひん|bileşen parçası|component part|故障した部品を交換しました。|こしょうした ぶひんを こうかんしました。|Arızalı parçayı değiştirdim.|I replaced the faulty component.
N2|objects|pedestal|台座|だいざ|kaide|pedestal|花瓶を安定した台座に置きます。|かびんを あんていした だいざに おきます。|Vazoyu sağlam bir kaideye koyarım.|I put the vase on a stable pedestal.
N2|software|compression|圧縮|あっしゅく|sıkıştırma|compression|送信する前に画像を圧縮します。|そうしんする まえに がぞうを あっしゅくします。|Görüntüyü göndermeden önce sıkıştırırım.|I compress the image before sending it.
N2|software|analysis|解析|かいせき|çözümleme|analysis|不具合の原因を解析します。|ふぐあいの げんいんを かいせきします。|Hatanın nedenini çözümleriz.|We analyse the cause of the bug.
N2|family|filial-care|親孝行|おやこうこう|anne babaya ilgi ve iyilik|filial devotion|両親を旅行に招待して親孝行をしました。|りょうしんを りょこうに しょうたいして おやこうこうを しました。|Annemi babamı geziye davet ederek onlara bir iyilik yaptım.|I did something for my parents by inviting them on a trip.
N2|family|dual-income|共働き|ともばたらき|eşlerin ikisinin de çalışması|both spouses working|共働きなので、家事を分担しています。|ともばたらきなので、かじを ぶんたんしています。|İkimiz de çalıştığımız için ev işlerini paylaşıyoruz.|We both work, so we share the housework.
N2|food|heating|加熱|かねつ|ısıtma|heating|材料を十分に加熱します。|ざいりょうを じゅうぶんに かねつします。|Malzemeleri iyice ısıtırım.|I heat the ingredients thoroughly.
N2|food|freezing|冷凍|れいとう|dondurma işlemi|freezing|残ったスープを冷凍します。|のこった スープを れいとうします。|Kalan çorbayı dondururum.|I freeze the leftover soup.
N2|time|middle-of-month|中旬|ちゅうじゅん|ayın orta on günü|middle ten days of a month|会議は五月中旬に開かれます。|かいぎは ごがつ ちゅうじゅんに ひらかれます。|Toplantı mayıs ayının ortalarında yapılır.|The meeting is held in mid-May.
N2|time|end-of-month|下旬|げじゅん|ayın 21'inden sonuna kadar|last third of a month|十一月下旬に結果が出ます。|じゅういちがつ げじゅんに けっかが でます。|Sonuçlar kasım ayının sonlarında çıkar.|The results come out in late November.
N2|travel|stay|滞在|たいざい|bir yerde kalma|stay|大阪に三日間滞在しました。|おおさかに みっかかん たいざいしました。|Osaka'da üç gün kaldım.|I stayed in Osaka for three days.
N2|travel|hand-luggage|手荷物|てにもつ|el bagajı|hand luggage|手荷物は座席の下に置いてください。|てにもつは ざせきの したに おいてください。|El bagajınızı koltuğun altına koyun.|Please put your hand luggage under the seat.
N1|fruits|irrigation|灌漑|かんがい|sulama|irrigation|この農園では雨水を灌漑に利用しています。|この のうえんでは あまみずを かんがいに りようしています。|Bu çiftlikte yağmur suyu sulamada kullanılıyor.|This farm uses rainwater for irrigation.
N1|fruits|quality-control|品質管理|ひんしつかんり|kalite kontrolü|quality control|出荷の前に品質管理の記録を確認します。|しゅっかの まえに ひんしつかんりの きろくを かくにんします。|Sevkiyattan önce kalite kontrol kayıtlarını kontrol ederiz.|We check the quality-control records before shipment.
N1|objects|fire-resistance|耐火|たいか|ateşe dayanım|fire resistance|この材料は耐火性能が高いです。|この ざいりょうは たいかせいのうが たかいです。|Bu malzemenin ateşe dayanımı yüksektir.|This material has high fire resistance.
N1|objects|structural-member|部材|ぶざい|yapı elemanı|structural member|古い建物の部材を再利用します。|ふるい たてものの ぶざいを さいりようします。|Eski binanın yapı elemanlarını yeniden kullanırız.|We reuse structural members from the old building.
N1|software|asynchronous|非同期|ひどうき|eşzamansız çalışma|asynchronous operation|このアプリは非同期でデータを取得します。|この アプリは ひどうきで データを しゅとくします。|Bu uygulama veriyi eşzamansız olarak alır.|This app retrieves data asynchronously.
N1|software|recursion|再帰|さいき|özyineleme|recursion|再帰を使って階層構造を調べます。|さいきを つかって かいそうこうぞうを しらべます。|Hiyerarşik yapıyı özyinelemeyle inceleriz.|We examine the hierarchical structure using recursion.
N1|family|blood-relation|血縁|けつえん|kan bağı|blood relationship|血縁のない人たちも家族として暮らしています。|けつえんの ない ひとたちも かぞくとして くらしています。|Kan bağı olmayan insanlar da aile olarak yaşıyor.|People without blood ties also live as families.
N1|family|relation-by-marriage|姻戚|いんせき|evlilik yoluyla akraba|relative by marriage|結婚によって両家は姻戚関係になりました。|けっこんに よって りょうけは いんせきかんけいに なりました。|Evlilikle iki aile arasında akrabalık oluştu.|The marriage made the two families related by marriage.
N1|food|mastication|咀嚼|そしゃく|çiğneme|chewing|咀嚼によって食べ物が細かくなります。|そしゃくに よって たべものが こまかく なります。|Çiğneme yiyecekleri küçük parçalara ayırır.|Chewing breaks food into smaller pieces.
N1|food|dietary-fibre|食物繊維|しょくもつせんい|besin lifi|dietary fibre|この献立では食物繊維の量も考えます。|この こんだてでは しょくもつせんいの りょうも かんがえます。|Bu menüde besin lifi miktarını da düşünürüz.|We also consider the amount of dietary fibre in this menu.
N1|time|moment|一刻|いっこく|kısacık bir an|a brief moment|一刻も早く準備を終えたいです。|いっこくも はやく じゅんびを おえたいです。|Hazırlığı bir an önce bitirmek istiyorum.|I want to finish the preparations as soon as possible.
N1|time|putting-off|先延ばし|さきのばし|erteleyip durma|putting off|難しい作業を先延ばしにしないようにしています。|むずかしい さぎょうを さきのばしに しない ように しています。|Zor işleri ertelememeye çalışıyorum.|I try not to put off difficult tasks.
N1|travel|entering-leaving-country|出入国|しゅつにゅうこく|ülkeye giriş ve çıkış|entering and leaving a country|出入国の手続きに必要な書類を確認します。|しゅつにゅうこくの てつづきに ひつような しょるいを かくにんします。|Ülkeye giriş çıkış işlemleri için gerekli belgeleri kontrol ederim.|I check the documents needed for entry and exit procedures.
N1|travel|shipping-route|航路|こうろ|gemi veya uçak rotası|sea or air route|台風のため、船の航路が変更されました。|たいふうの ため、ふねの こうろが へんこうされました。|Tayfun nedeniyle geminin rotası değiştirildi.|The ship's route was changed because of the typhoon.
`);

export const expansionKanjiRows=[
 ['book','本','本','ほん','hon','kitap','book','beginner'],
 ['dog','犬','犬','いぬ','inu','köpek','dog','beginner'],
 ['cat','猫','猫','ねこ','neko','kedi','cat','beginner'],
 ['rice-field','田','田','た','ta','pirinç tarlası','rice field','beginner'],
 ['rain','雨','雨','あめ','ame','yağmur','rain','beginner'],
 ['flower','花','花','はな','hana','çiçek','flower','intermediate'],
 ['sea','海','海','うみ','umi','deniz','sea','intermediate'],
 ['sky','空','空','そら','sora','gökyüzü','sky','intermediate'],
 ['country','国','国','くに','kuni','ülke','country','intermediate'],
 ['name','名','名前','なまえ','namae','isim','name','intermediate'],
 ['experience','験','経験','けいけん','keiken','deneyim','experience','advanced'],
 ['promise','約','約束','やくそく','yakusoku','söz verme','promise','advanced'],
 ['explanation','説','説明','せつめい','setsumei','açıklama','explanation','advanced'],
 ['preparation','準','準備','じゅんび','junbi','hazırlık','preparation','advanced'],
 ['select','選','選択','せんたく','sentaku','seçim','selection','advanced'],
];

export const expansionGrammarRows=rows(`
N5|reason-kara|理由の文（普通形・丁寧形）+ から|Neden belirtmek|Giving a reason|から önceki cümleyi neden olarak sunar. İsim ve na-sıfatın olumlu şimdiki biçiminde だから veya ですから kullanılır; örnekte kibar bir fiil cümlesi vardır.|から presents the preceding clause as a reason. With affirmative present nouns and na-adjectives, use だから or ですから. This example uses a polite verb clause.|雨が降っていますから、傘を持っていきます。|あめが ふっていますから、かさを もっていきます。|Yağmur yağdığı için yanıma şemsiye alacağım.|I will take an umbrella because it is raining.|から|から
N5|request-kudasai|動詞て形 + ください|Bir eylemi rica etmek|Requesting an action|て biçimine ください eklenir. Kibar bir rica veya yönerge olabilir; her sosyal durumda en yumuşak rica biçimi olduğu anlamına gelmez.|Add ください to a verb's て form for a request or instruction. It is polite, but other forms may be softer in some situations.|ここに名前を書いてください。|ここに なまえを かいてください。|Lütfen buraya adınızı yazın.|Please write your name here.|ください|ください
N5|lets-mashou|動詞のます語幹 + ましょう|Birlikte yapmayı önermek|Suggesting an action together|ます çıkarılıp ましょう eklenir. Bu örnekte konuşan, karşısındaki kişiye birlikte yürümeyi önerir.|Replace ます with ましょう. Here the speaker suggests walking together with the listener.|駅まで一緒に歩きましょう。|えきまで いっしょに あるきましょう。|İstasyona kadar birlikte yürüyelim.|Let us walk to the station together.|ましょう|ましょう
N4|possibility-kamo|普通形 + かもしれません（名詞・な形容詞は「だ」を付けない）|Bir olasılıktan bahsetmek|Expressing a possibility|Kesin olmayan bir olasılık belirtir. İsim ve na-sıfatın olumlu şimdiki biçiminde だ kullanılmaz: 雨かもしれません.|Marks a possibility rather than certainty. Omit だ after a noun or na-adjective in the affirmative present: 雨かもしれません.|明日は雪が降るかもしれません。|あしたは ゆきが ふるかもしれません。|Yarın kar yağabilir.|It might snow tomorrow.|かもしれません|かもしれません
N4|completion-shimau|動詞て形 + しまう|Tamamlanma veya pişmanlık|Completion or regret|Bir eylemin tamamen bitmesini veya istenmeden olmasını anlatabilir. Bu örnekte unutma eylemine pişmanlık tonu katar; her kullanım olumsuz değildir.|Can mark completion or an unwanted occurrence. Here it adds regret about forgetting; it does not always express a negative feeling.|財布を忘れてしまいました。|さいふを わすれてしまいました。|Ne yazık ki cüzdanımı unuttum.|Unfortunately, I forgot my wallet.|しまいました|しまいました
N4|advice-houga|動詞た形 + ほうがいいです|Tavsiye vermek|Giving advice|Bir eylemi yapmayı önermek için ta biçimi kullanılır; burada geçmiş zaman anlatılmaz. Yapmamayı önermek için ないほうがいいです kullanılabilir.|The た form gives advice here, rather than describing a past event. ないほうがいいです can advise against an action.|疲れているなら、少し休んだほうがいいです。|つかれているなら、すこし やすんだほうがいいです。|Yorgunsan biraz dinlensen iyi olur.|If you are tired, you should rest a little.|ほうがいい|ほうがいい
N3|every-time-tabi|動詞辞書形 + たびに／名詞 + の + たびに|Her defasında|Every time|Bir olay tekrarlandığında ona eşlik eden durumu belirtir. Fiil sözlük biçiminden sonra doğrudan, isimden sonra の ile kullanılır.|Describes what happens whenever an event recurs. Attach directly to a dictionary-form verb, or use の after a noun.|日本に来るたびに、新しい店を見つけます。|にほんに くるたびに、あたらしい みせを みつけます。|Japonya'ya her geldiğimde yeni bir dükkân bulurum.|Every time I come to Japan, I find a new shop.|たびに|たびに
N3|not-only-bakari|名詞 + ばかりでなく + 名詞 + も|Yalnızca biriyle sınırlı olmamak|Not only one thing|İlk öğeye ikinci bir öğe ekler; bu isim örüntüsünde ikinci öğeyi も izler. Yalnızca olumsuz bir durumla sınırlı değildir.|Adds a second item to the first. In this noun pattern, も marks the additional item; the construction is not limited to negative situations.|この図書館では、本ばかりでなく、雑誌も借りられます。|この としょかんでは、ほんばかりでなく、ざっしも かりられます。|Bu kütüphanede yalnızca kitap değil dergi de ödünç alınabilir.|At this library, you can borrow not only books but magazines as well.|ばかりでなく|ばかりでなく
N3|thanks-to-okage|動詞普通形 + おかげで／名詞 + の + おかげで|Olumlu sonucu bir nedene bağlamak|Attributing a good result|Genellikle olumlu sonucu bir kişinin yardımı veya bir duruma bağlar. İsimden sonra の gelir; örnekte önceki fiil cümlesine bağlanır.|Usually attributes a favourable result to help or circumstances. Use の after a noun; this example follows a verb clause.|友達が手伝ってくれたおかげで、準備が早く終わりました。|ともだちが てつだって くれた おかげで、じゅんびが はやく おわりました。|Arkadaşımın yardımı sayesinde hazırlık erken bitti.|Thanks to my friend's help, the preparations finished early.|おかげで|おかげで
N2|accompany-tomonatte|名詞／動詞辞書形 + に伴って|Bir değişime eşlik etmek|Accompanying a change|Bir olayla bağlantılı olarak başka bir değişimin oluşmasını anlatır. Sıkça açıklayıcı veya resmî metinlerde kullanılır; mutlaka doğrudan neden kanıtı vermez.|Links a change to an accompanying event or change, often in explanatory or formal writing. It does not necessarily prove direct causation.|利用者の増加に伴って、通信量も増えました。|りようしゃの ぞうかに ともなって、つうしんりょうも ふえました。|Kullanıcı sayısındaki artışla birlikte veri trafiği de arttı.|Data traffic increased along with the number of users.|に伴って|に伴って~にともなって
N2|although-monono|動詞普通形 + ものの|Bir durumu kabul edip karşıt sonuç eklemek|Conceding a fact before a contrast|Önceki durumu kabul eder, ardından beklenenden farklı sonucu belirtir. Bu fiil örneğindeki kullanım yazı dilinde yaygındır.|Acknowledges the first fact before adding an unexpected or contrasting result. This verb-clause use is common in written language.|資料を読んだものの、内容がよく分かりませんでした。|しりょうを よんだものの、ないようが よく わかりませんでした。|Belgeleri okudum ama içeriğini pek anlayamadım.|Although I read the documents, I did not understand the contents very well.|ものの|ものの
N2|gradual-tsutsu|動詞のます語幹 + つつある|Sürmekte olan değişim|An ongoing gradual change|Fiilin ます gövdesine eklenir. Değişimin devam ettiğini anlatır; bu örnekte nüfusun azalması vurgulanır. Her sıradan eylem için ています yerine geçmez.|Follows a verb's ます stem and highlights an ongoing change, here a declining population. It is not a general replacement for ています in every action.|町の人口は減りつつあります。|まちの じんこうは へりつつあります。|Kasabanın nüfusu giderek azalıyor.|The town's population is gradually declining.|つつあります|つつあります
N1|formal-cutoff-womotte|時点を表す名詞 + をもって|Resmî bitiş sınırı belirtmek|Announcing a formal cutoff|Bu kullanımda bir zaman noktasını resmî bitiş sınırı olarak sunar. Araç veya yöntem bildiren ayrı をもって kullanımından farklıdır.|In this use, a time expression marks an officially announced endpoint. Distinguish the separate use of をもって for a means or method.|本日の受付は午後五時をもって終了いたします。|ほんじつの うけつけは ごご ごじを もって しゅうりょういたします。|Bugünkü başvuru kabulü saat 17.00 itibarıyla sona erecektir.|Today's registration closes at five p.m.|をもって|をもって
N1|stage-tomonaruto|名詞 + ともなると|Bir aşamaya gelindiğinde|Once a stage is reached|Belirli bir aşamaya veya zamana ulaşınca ortaya çıkan, konuşanın beklediği durumu anlatır. Bu örnekte kışın ilerlemesi söz konusudur.|Presents an outcome the speaker considers characteristic once a stage or time is reached. Here it refers to the progression of winter.|十二月ともなると、この町では雪が積もります。|じゅうにがつともなると、この まちでは ゆきが つもります。|Aralık ayına gelindiğinde bu kasabada kar birikir.|By the time December comes, snow accumulates in this town.|ともなると|ともなると
N1|in-line-sokushite|名詞 + に即して|Gerçek koşullara uygun olarak|In line with actual conditions|Bir eylemi gerçek durum veya koşullara uyarlamayı anlatan resmî bir ifadedir. Bu örnekte sahadaki mevcut koşullar esas alınır.|A formal expression for adapting an action to actual circumstances. This example takes the current conditions on site into account.|現場の状況に即して、作業手順を見直します。|げんばの じょうきょうに そくして、さぎょうてじゅんを みなおします。|Sahadaki koşullara uygun olarak çalışma adımlarını gözden geçiririz.|We review the work procedures in line with conditions on site.|に即して|に即して~にそくして
`).map(row=>{row[12]=row[12].split('~');return row;});
