// Original examples and bilingual notes, not transcribed from a textbook.
// Level labels are approximate study bands, including specialist vocabulary.
const rows=text=>text.trim().split('\n').map(line=>line.trim().split('|'));
export const additionalWordRows=rows(`
N5|fruits|lemon|レモン|レモン|limon|lemon|レモンを半分に切ります。|レモンを はんぶんに きります。|Limonu ikiye keserim.|I cut the lemon in half.
N5|fruits|melon|メロン|メロン|kavun|melon|このメロンはおいしいです。|この メロンは おいしいです。|Bu kavun lezzetli.|This melon is delicious.
N5|fruits|pineapple|パイナップル|パイナップル|ananas|pineapple|パイナップルを食べます。|パイナップルを たべます。|Ananas yerim.|I eat pineapple.
N5|fruits|kiwi|キウイ|キウイ|kivi|kiwi fruit|キウイを二つ買います。|キウイを ふたつ かいます。|İki kivi alırım.|I buy two kiwi fruit.
N4|fruits|persimmon|柿|かき|Trabzon hurması|persimmon|秋に柿を食べました。|あきに かきを たべました。|Sonbaharda Trabzon hurması yedim.|I ate persimmons in autumn.
N4|fruits|cherry|さくらんぼ|さくらんぼ|kiraz|cherry|さくらんぼを洗っておきます。|さくらんぼを あらって おきます。|Kirazları önceden yıkayacağım.|I will wash the cherries in advance.
N4|fruits|plum|梅|うめ|Japon eriği|Japanese plum|梅でジュースを作りました。|うめで ジュースを つくりました。|Japon eriğiyle meyve suyu yaptım.|I made juice with Japanese plums.
N4|fruits|chestnut|栗|くり|kestane|chestnut|栗をゆでて食べます。|くりを ゆでて たべます。|Kestaneyi haşlayıp yerim.|I boil chestnuts and eat them.
N3|fruits|yuzu|柚子|ゆず|yuzu meyvesi|yuzu|柚子の香りがするお茶です。|ゆずの かおりが する おちゃです。|Bu, yuzu kokulu bir çay.|This tea has a yuzu aroma.
N3|fruits|sour|酸っぱい|すっぱい|ekşi|sour|このみかんは少し酸っぱいです。|この みかんは すこし すっぱいです。|Bu mandalina biraz ekşi.|This mandarin is a little sour.
N3|fruits|rot|腐る|くさる|çürümek|to rot|果物が腐る前に食べましょう。|くだものが くさる まえに たべましょう。|Meyveleri çürümeden yiyelim.|Let us eat the fruit before it rots.
N3|fruits|fresh|新鮮|しんせん|taze|fresh|市場で新鮮な果物を選びます。|いちばで しんせんな くだものを えらびます。|Pazarda taze meyve seçerim.|I choose fresh fruit at the market.
N2|fruits|seedling|苗|なえ|fide|seedling|春にいちごの苗を植えます。|はるに いちごの なえを うえます。|İlkbaharda çilek fidesi dikeriz.|We plant strawberry seedlings in spring.
N2|fruits|variety|品種|ひんしゅ|bitki çeşidi|cultivar|この品種は寒さに強いです。|この ひんしゅは さむさに つよいです。|Bu çeşit soğuğa dayanıklı.|This cultivar is resistant to cold.
N2|fruits|fertilizer|肥料|ひりょう|gübre|fertilizer|土の状態に応じて肥料を使います。|つちの じょうたいに おうじて ひりょうを つかいます。|Toprağın durumuna göre gübre kullanırız.|We use fertilizer according to the soil condition.
N2|fruits|maturation|熟成|じゅくせい|olgunlaştırma|maturation|熟成の進み方を記録します。|じゅくせいの すすみかたを きろくします。|Olgunlaşmanın ilerleyişini kaydederiz.|We record how maturation progresses.
N1|fruits|grafting|接ぎ木|つぎき|aşılama|grafting|接ぎ木には熟練した技術が求められます。|つぎきには じゅくれんした ぎじゅつが もとめられます。|Aşılama ustalık gerektirir.|Grafting requires skilled technique.
N1|fruits|pruning|剪定|せんてい|budama|pruning|剪定によって枝の込み具合を調整します。|せんていに よって えだの こみぐあいを ちょうせいします。|Budamayla dalların sıkışıklığını ayarlarız.|We adjust branch density through pruning.
N1|fruits|fruit-drop|落果|らっか|meyve dökümü|fruit drop|強風による落果を防ぐ対策を講じます。|きょうふうに よる らっかを ふせぐ たいさくを こうじます。|Kuvvetli rüzgârın meyveleri dökmesini önlemek için önlem alırız.|We take measures to prevent wind-related fruit drop.
N1|fruits|storage|貯蔵|ちょぞう|depolama|storage|長期貯蔵に適した温度を保ちます。|ちょうきちょぞうに てきした おんどを たもちます。|Uzun süreli depolamaya uygun sıcaklığı koruruz.|We maintain a temperature suitable for long-term storage.
N5|objects|pencil|鉛筆|えんぴつ|kurşun kalem|pencil|鉛筆で名前を書きます。|えんぴつで なまえを かきます。|Adımı kurşun kalemle yazarım.|I write my name with a pencil.
N5|objects|clock|時計|とけい|saat|clock|部屋に時計があります。|へやに とけいが あります。|Odada bir saat var.|There is a clock in the room.
N5|objects|shoes|靴|くつ|ayakkabı|shoes|新しい靴を買います。|あたらしい くつを かいます。|Yeni ayakkabı alırım.|I buy new shoes.
N5|objects|umbrella|傘|かさ|şemsiye|umbrella|傘を持っていきます。|かさを もって いきます。|Şemsiyemi yanıma alırım.|I take an umbrella with me.
N4|objects|towel|タオル|タオル|havlu|towel|タオルを洗って干しました。|タオルを あらって ほしました。|Havluyu yıkayıp astım.|I washed the towel and hung it up.
N4|objects|plate|皿|さら|tabak|plate|皿を割ってしまいました。|さらを わって しまいました。|Tabağı yanlışlıkla kırdım.|I accidentally broke the plate.
N4|objects|key|鍵|かぎ|anahtar|key|鍵をなくしたことがあります。|かぎを なくした ことが あります。|Daha önce anahtarımı kaybetmişliğim var.|I have lost my key before.
N4|objects|fridge|冷蔵庫|れいぞうこ|buzdolabı|refrigerator|牛乳を冷蔵庫に入れてください。|ぎゅうにゅうを れいぞうこに いれて ください。|Sütü buzdolabına koyun lütfen.|Please put the milk in the refrigerator.
N3|objects|vacuum|掃除機|そうじき|elektrikli süpürge|vacuum cleaner|掃除機の音で目が覚めました。|そうじきの おとで めが さめました。|Elektrikli süpürgenin sesiyle uyandım.|The vacuum cleaner woke me up.
N3|objects|microwave|電子レンジ|でんしレンジ|mikrodalga fırın|microwave oven|電子レンジで温め直します。|でんしレンジで あたためなおします。|Mikrodalga fırında yeniden ısıtırım.|I reheat it in the microwave.
N3|objects|blanket|毛布|もうふ|battaniye|blanket|寒そうなので毛布を持ってきました。|さむそうなので もうふを もって きました。|Üşüyor gibi göründüğün için battaniye getirdim.|You looked cold, so I brought a blanket.
N3|objects|shelf|棚|たな|raf|shelf|棚に本を並べておきます。|たなに ほんを ならべて おきます。|Kitapları önceden rafa dizerim.|I arrange the books on the shelf in advance.
N2|objects|lighting|照明|しょうめい|aydınlatma|lighting|照明を変えるだけで部屋の印象が変わります。|しょうめいを かえる だけで へやの いんしょうが かわります。|Sadece aydınlatmayı değiştirerek odanın havası değişir.|Changing only the lighting changes the room’s atmosphere.
N2|objects|bedding|寝具|しんぐ|yatak takımı|bedding|季節に応じて寝具を替えます。|きせつに おうじて しんぐを かえます。|Yatak takımını mevsime göre değiştiririz.|We change the bedding according to the season.
N2|objects|tableware|食器|しょっき|sofra takımı|tableware|食器を種類ごとに整理しました。|しょっきを しゅるいごとに せいりしました。|Sofra takımlarını türlerine göre düzenledim.|I sorted the tableware by type.
N2|objects|organizing|収納|しゅうのう|eşyaları düzenleyip yerleştirme|putting things away|収納の工夫で空間を広く使えます。|しゅうのうの くふうで くうかんを ひろく つかえます。|Eşyaları akıllıca yerleştirerek alanı daha geniş kullanabiliriz.|Thoughtful storage lets us use the space more efficiently.
N1|objects|shop-fixtures|什器|じゅうき|mağaza donanımı|shop fixtures|店舗の改装に伴い什器を入れ替えます。|てんぽの かいそうに ともない じゅうきを いれかえます。|Mağaza yenilenirken donanımını da değiştiririz.|We replace shop fixtures as part of the renovation.
N1|objects|ceramics|陶磁器|とうじき|seramik ve porselen eşyalar|ceramics and porcelain|陶磁器は衝撃に弱いため慎重に扱います。|とうじきは しょうげきに よわい ため しんちょうに あつかいます。|Seramik ve porselen darbeye hassas olduğu için dikkatle ele alınır.|We handle ceramics and porcelain carefully because they are vulnerable to impact.
N1|objects|pulley|滑車|かっしゃ|makara|pulley|滑車を用いて重い荷物を持ち上げます。|かっしゃを もちいて おもい にもつを もちあげます。|Ağır yükü makaradan yararlanarak kaldırırız.|We lift the heavy load using a pulley.
N1|objects|hinge|蝶番|ちょうつがい|menteşe|hinge|扉の蝶番が緩んでいないか点検します。|とびらの ちょうつがいが ゆるんで いないか てんけんします。|Kapının menteşesinin gevşeyip gevşemediğini kontrol ederiz.|We check whether the door hinge is loose.
N5|software|keyboard|キーボード|キーボード|klavye|keyboard|キーボードで文字を打ちます。|キーボードで もじを うちます。|Klavyeyle harfleri yazarım.|I type characters on the keyboard.
N5|software|internet|インターネット|インターネット|internet|internet|インターネットを使います。|インターネットを つかいます。|İnterneti kullanırım.|I use the internet.
N5|software|email|メール|メール|e-posta|email|先生にメールを送ります。|せんせいに メールを おくります。|Öğretmene e-posta gönderirim.|I send an email to the teacher.
N5|software|app|アプリ|アプリ|uygulama|app|このアプリは便利です。|この アプリは べんりです。|Bu uygulama kullanışlı.|This app is useful.
N4|software|delete|削除|さくじょ|silme|deletion|古いファイルを削除しました。|ふるい ファイルを さくじょしました。|Eski dosyayı sildim.|I deleted the old file.
N4|software|connection|接続|せつぞく|bağlantı|connection|接続が切れてしまいました。|せつぞくが きれて しまいました。|Bağlantı kesildi.|The connection was lost.
N4|software|search|検索|けんさく|arama|search|名前で検索してみてください。|なまえで けんさくして みて ください。|İsimle aramayı deneyin lütfen.|Please try searching by name.
N4|software|display|表示|ひょうじ|görüntüleme|display|結果が画面に表示されます。|けっかが がめんに ひょうじされます。|Sonuç ekranda gösterilir.|The result is displayed on the screen.
N3|software|definition|定義|ていぎ|tanım|definition|使う前に関数を定義します。|つかう まえに かんすうを ていぎします。|Kullanmadan önce fonksiyonu tanımlarız.|We define the function before using it.
N3|software|condition|条件|じょうけん|koşul|condition|条件を満たす場合だけ実行します。|じょうけんを みたす ばあいだけ じっこうします。|Yalnızca koşul sağlandığında çalıştırırız.|We execute it only when the condition is met.
N3|software|return-value|戻り値|もどりち|dönüş değeri|return value|戻り値が空かどうか確認します。|もどりちが からか どうか かくにんします。|Dönüş değerinin boş olup olmadığını kontrol ederiz.|We check whether the return value is empty.
N3|software|execution|実行|じっこう|çalıştırma|execution|変更後にテストを実行します。|へんこうごに テストを じっこうします。|Değişiklikten sonra testleri çalıştırırız.|We run tests after the change.
N2|software|authentication|認証|にんしょう|kimlik doğrulama|authentication|認証に失敗した場合は再試行します。|にんしょうに しっぱいした ばあいは さいしこうします。|Kimlik doğrulama başarısızsa yeniden deneriz.|We retry if authentication fails.
N2|software|permission|権限|けんげん|yetki|permission|操作に必要な権限を確認します。|そうさに ひつような けんげんを かくにんします。|İşlem için gerekli yetkiyi kontrol ederiz.|We check the permission required for the operation.
N2|software|configuration|構成|こうせい|yapılandırma|configuration|構成を変更する前に記録を残します。|こうせいを へんこうする まえに きろくを のこします。|Yapılandırmayı değiştirmeden önce kayıt tutarız.|We keep a record before changing the configuration.
N2|software|validation|検証|けんしょう|doğrulama|validation|入力内容の検証を自動化しました。|にゅうりょくないようの けんしょうを じどうかしました。|Girdi doğrulamasını otomatikleştirdik.|We automated input validation.
N1|software|mutual-exclusion|排他制御|はいたせいぎょ|karşılıklı dışlama denetimi|mutual exclusion|共有資源へのアクセスに排他制御を用います。|きょうゆうしげんへの アクセスに はいたせいぎょを もちいます。|Paylaşılan kaynağa erişimde karşılıklı dışlama kullanırız.|We use mutual exclusion for access to shared resources.
N1|software|concurrency|並行処理|へいこうしょり|eşzamanlı işleme|concurrent processing|並行処理では状態の共有に注意が必要です。|へいこうしょりでは じょうたいの きょうゆうに ちゅういが ひつようです。|Eşzamanlı işlemede durum paylaşımına dikkat gerekir.|Concurrent processing requires care when sharing state.
N1|software|observability|可観測性|かかんそくせい|gözlemlenebilirlik|observability|可観測性を高めて障害の原因を特定します。|かかんそくせいを たかめて しょうがいの げんいんを とくていします。|Gözlemlenebilirliği artırarak arızanın nedenini belirleriz.|We improve observability to identify the cause of failures.
N1|software|vulnerability|脆弱性|ぜいじゃくせい|güvenlik açığı|vulnerability|公開前に既知の脆弱性を調査します。|こうかいまえに きちの ぜいじゃくせいを ちょうさします。|Yayımlamadan önce bilinen güvenlik açıklarını araştırırız.|We investigate known vulnerabilities before release.
N5|family|father|父|ちち|babam|my father|父は会社員です。|ちちは かいしゃいんです。|Babam şirket çalışanı.|My father is a company employee.
N5|family|mother|母|はは|annem|my mother|母は家にいます。|ははは いえに います。|Annem evde.|My mother is at home.
N5|family|older-brother|兄|あに|ağabeyim|my older brother|兄は大学生です。|あには だいがくせいです。|Ağabeyim üniversite öğrencisi.|My older brother is a university student.
N5|family|older-sister|姉|あね|ablam|my older sister|姉は東京に住んでいます。|あねは とうきょうに すんで います。|Ablam Tokyo’da yaşıyor.|My older sister lives in Tokyo.
N4|family|younger-brother|弟|おとうと|erkek kardeşim|my younger brother|弟と買い物に行きました。|おとうとと かいものに いきました。|Erkek kardeşimle alışverişe gittim.|I went shopping with my younger brother.
N4|family|younger-sister|妹|いもうと|kız kardeşim|my younger sister|妹は料理が上手です。|いもうとは りょうりが じょうずです。|Kız kardeşim yemek yapmakta iyi.|My younger sister is good at cooking.
N4|family|grandfather|祖父|そふ|dedem|my grandfather|祖父に手紙を書きました。|そふに てがみを かきました。|Dedeme mektup yazdım.|I wrote a letter to my grandfather.
N4|family|grandmother|祖母|そぼ|büyükannem|my grandmother|祖母が作った料理が好きです。|そぼが つくった りょうりが すきです。|Büyükannemin yaptığı yemekleri severim.|I like the food my grandmother makes.
N3|family|relatives|親戚|しんせき|akrabalar|relatives|正月に親戚が集まります。|しょうがつに しんせきが あつまります。|Yılbaşında akrabalar bir araya gelir.|Our relatives gather at New Year.
N3|family|couple|夫婦|ふうふ|evli çift|married couple|あの夫婦は一緒に店を経営しています。|あの ふうふは いっしょに みせを けいえいして います。|O evli çift dükkânı birlikte işletiyor.|That married couple runs a shop together.
N3|family|raising-children|子育て|こそだて|çocuk yetiştirme|raising children|子育てについて友達と話しました。|こそだてに ついて ともだちと はなしました。|Arkadaşımla çocuk yetiştirme üzerine konuştum.|I talked with a friend about raising children.
N3|family|housework|家事|かじ|ev işleri|housework|家事を家族で分担しています。|かじを かぞくで ぶんたんして います。|Ev işlerini ailece paylaşıyoruz.|We share the housework as a family.
N2|family|support-dependents|扶養|ふよう|geçimini sağlama|supporting dependents|扶養に関する書類を提出しました。|ふように かんする しょるいを ていしゅつしました。|Bakmakla yükümlü olduğum kişilerle ilgili belgeleri sundum.|I submitted documents concerning my dependents.
N2|family|childcare|育児|いくじ|çocuk bakımı|childcare|育児と仕事を両立できる制度が必要です。|いくじと しごとを りょうりつできる せいどが ひつようです。|Çocuk bakımıyla işi birlikte yürütmeyi sağlayan bir sistem gerekli.|We need a system that allows people to balance childcare and work.
N2|family|household|世帯|せたい|hane|household|この地域では一人暮らしの世帯が増えています。|この ちいきでは ひとりぐらしの せたいが ふえて います。|Bu bölgede tek kişilik haneler artıyor.|Single-person households are increasing in this area.
N2|family|caregiving|介護|かいご|bakıma muhtaç kişiye bakım|caregiving|家族の介護について相談しました。|かぞくの かいごに ついて そうだんしました。|Aile üyemin bakımı konusunda danıştım.|I sought advice about caring for a family member.
N1|family|lineage|家系|かけい|soy|family lineage|古い資料から家系をたどります。|ふるい しりょうから かけいを たどります。|Eski belgelerden aile soyunu takip ederiz.|We trace the family lineage through old records.
N1|family|adoptive-ties|縁組|えんぐみ|aile bağı kurma|forming family ties|養子縁組を題材にした小説を読みました。|ようしえんぐみを だいざいに した しょうせつを よみました。|Evlat edinmeyi konu alan bir roman okudum.|I read a novel about adoption.
N1|family|successor|後継者|こうけいしゃ|halef|successor|家業を継ぐ後継者を育てています。|かぎょうを つぐ こうけいしゃを そだてて います。|Aile işini devralacak bir halef yetiştiriyorlar.|They are training a successor for the family business.
N1|family|inheritance|相続|そうぞく|mirasın devralınması|inheritance|相続をめぐる物語が映画になりました。|そうぞくを めぐる ものがたりが えいがに なりました。|Miras etrafında geçen bir hikâye filme uyarlandı.|A story about inheritance was adapted into a film.
N5|food|rice|ご飯|ごはん|pişmiş pirinç; yemek|cooked rice; meal|毎朝ご飯を食べます。|まいあさ ごはんを たべます。|Her sabah yemek yerim.|I eat a meal every morning.
N5|food|drinking-water|水|みず|su|water|水を飲みます。|みずを のみます。|Su içerim.|I drink water.
N5|food|green-tea|お茶|おちゃ|çay|tea|お茶はいかがですか。|おちゃは いかがですか。|Çay ister misiniz?|Would you like some tea?
N5|food|bread|パン|パン|ekmek|bread|パンを一つ買います。|パンを ひとつ かいます。|Bir ekmek alırım.|I buy a loaf of bread.
N4|food|meat|肉|にく|et|meat|肉を食べない人もいます。|にくを たべない ひとも います。|Et yemeyen insanlar da var.|Some people do not eat meat.
N4|food|fish|魚|さかな|balık|fish|昨日魚を焼きました。|きのう さかなを やきました。|Dün balık pişirdim.|I grilled fish yesterday.
N4|food|egg|卵|たまご|yumurta|egg|卵を使わない料理を探しています。|たまごを つかわない りょうりを さがして います。|Yumurta kullanılmayan bir yemek arıyorum.|I am looking for a dish without eggs.
N4|food|vegetables|野菜|やさい|sebze|vegetables|野菜をもっと食べたいです。|やさいを もっと たべたいです。|Daha fazla sebze yemek istiyorum.|I want to eat more vegetables.
N3|food|seasoning|調味料|ちょうみりょう|çeşni malzemesi|seasoning|調味料を少しずつ加えます。|ちょうみりょうを すこしずつ くわえます。|Çeşni malzemesini azar azar ekleriz.|We add seasoning little by little.
N3|food|nutrition|栄養|えいよう|besin değeri|nutrition|食品の栄養について授業で学びました。|しょくひんの えいように ついて じゅぎょうで まなびました。|Derste yiyeceklerin besin değeri hakkında öğrendik.|We learned about nutrition in class.
N3|food|meal-plan|献立|こんだて|yemek planı|meal plan|一週間の献立を考えます。|いっしゅうかんの こんだてを かんがえます。|Bir haftalık yemek planını düşünürüm.|I plan the meals for one week.
N3|food|steam|蒸す|むす|buharda pişirmek|to steam|野菜は蒸すこともできます。|やさいは むす ことも できます。|Sebzeler buharda da pişirilebilir.|Vegetables can also be steamed.
N2|food|preservative|保存料|ほぞんりょう|koruyucu katkı|preservative|包装の保存料に関する表示を読みました。|ほうそうの ほぞんりょうに かんする ひょうじを よみました。|Ambalajdaki koruyucu katkı açıklamasını okudum.|I read the preservative information on the package.
N2|food|spice|香辛料|こうしんりょう|baharat|spice|香辛料の種類によって香りが変わります。|こうしんりょうの しゅるいに よって かおりが かわります。|Koku, baharatın türüne göre değişir.|The aroma varies with the type of spice.
N2|food|fermentation|発酵|はっこう|fermantasyon|fermentation|発酵の仕組みを実験で観察しました。|はっこうの しくみを じっけんで かんさつしました。|Fermantasyonun işleyişini deneyde gözlemledik.|We observed fermentation in an experiment.
N2|food|intake|摂取|せっしゅ|vücuda alma|intake|授業で栄養素の摂取について学びます。|じゅぎょうで えいようその せっしゅに ついて まなびます。|Derste besin öğelerinin vücuda alınmasını öğreniriz.|We study nutrient intake in class.
N1|food|taste-preference|嗜好|しこう|damak tercihi|taste preference|地域によって食の嗜好が異なります。|ちいきに よって しょくの しこうが ことなります。|Yemek tercihleri bölgeye göre değişir.|Food preferences differ by region.
N1|food|nourishment|滋養|じよう|besleyicilik|nourishment|昔の広告には滋養という言葉が見られます。|むかしの こうこくには じようと いう ことばが みられます。|Eski reklamlarda besleyicilik anlamındaki bu kelime görülür.|The word for nourishment appears in old advertisements.
N1|food|flavor|風味|ふうみ|kendine özgü tat ve koku|flavor and aroma|焼くことで素材の風味を引き出します。|やく ことで そざいの ふうみを ひきだします。|Pişirme, malzemenin kendine özgü tat ve kokusunu ortaya çıkarır.|Roasting brings out the ingredient’s flavor and aroma.
N1|food|umami|旨味|うまみ|umami tadı|umami|だしの旨味を生かした料理です。|だしの うまみを いかした りょうりです。|Et suyunun umami tadını öne çıkaran bir yemek.|This dish makes use of the stock’s umami.
N5|time|today|今日|きょう|bugün|today|今日は休みです。|きょうは やすみです。|Bugün tatil.|Today is a day off.
N5|time|tomorrow|明日|あした|yarın|tomorrow|明日図書館に行きます。|あした としょかんに いきます。|Yarın kütüphaneye gideceğim.|I will go to the library tomorrow.
N5|time|yesterday|昨日|きのう|dün|yesterday|昨日は忙しかったです。|きのうは いそがしかったです。|Dün yoğundum.|I was busy yesterday.
N5|time|every-day|毎日|まいにち|her gün|every day|毎日日本語を勉強します。|まいにち にほんごを べんきょうします。|Her gün Japonca çalışırım.|I study Japanese every day.
N4|time|weekend|週末|しゅうまつ|hafta sonu|weekend|週末は何をする予定ですか。|しゅうまつは なにを する よていですか。|Hafta sonu ne yapmayı planlıyorsun?|What are you planning to do this weekend?
N4|time|this-morning|今朝|けさ|bu sabah|this morning|今朝はいつもより早く起きました。|けさは いつもより はやく おきました。|Bu sabah her zamankinden erken kalktım.|I got up earlier than usual this morning.
N4|time|next-week|来週|らいしゅう|gelecek hafta|next week|来週から新しい授業が始まります。|らいしゅうから あたらしい じゅぎょうが はじまります。|Gelecek hafta yeni ders başlayacak.|A new class starts next week.
N4|time|appointment|約束|やくそく|sözleşilmiş buluşma; söz|appointment; promise|友達と会う約束があります。|ともだちと あう やくそくが あります。|Bir arkadaşımla buluşma sözüm var.|I have arranged to meet a friend.
N3|time|deadline|締め切り|しめきり|son teslim tarihi|deadline|締め切りまでに提出してください。|しめきりまでに ていしゅつして ください。|Son teslim tarihine kadar teslim edin lütfen.|Please submit it by the deadline.
N3|time|plan|予定|よてい|plan|plan|予定が変わったら連絡します。|よていが かわったら れんらくします。|Plan değişirse haber veririm.|I will contact you if the plan changes.
N3|time|postponement|延期|えんき|erteleme|postponement|試合の延期が決まりました。|しあいの えんきが きまりました。|Maçın ertelenmesine karar verildi.|It was decided to postpone the match.
N3|time|period|期間|きかん|süre|period|申し込みの期間を確認します。|もうしこみの きかんを かくにんします。|Başvuru süresini kontrol ederim.|I check the application period.
N2|time|time-limit|期限|きげん|sürenin dolduğu tarih|time limit|期限を過ぎると申し込めません。|きげんを すぎると もうしこめません。|Süre dolduktan sonra başvurulamaz.|Applications cannot be made after the time limit.
N2|time|schedule|日程|にってい|takvim; program|schedule|参加者に合わせて日程を調整します。|さんかしゃに あわせて にっていを ちょうせいします。|Programı katılımcılara göre ayarlarız.|We adjust the schedule to suit the participants.
N2|time|elapsed-course|経過|けいか|sürecin ilerleyişi|progress over time|作業の経過を記録しておきます。|さぎょうの けいかを きろくして おきます。|İşin ilerleyişini kaydederiz.|We keep a record of the work’s progress.
N2|time|required-time|所要時間|しょようじかん|gereken süre|required time|所要時間は交通状況によって異なります。|しょようじかんは こうつうじょうきょうに よって ことなります。|Gereken süre trafik durumuna göre değişir.|The time required varies with traffic conditions.
N1|time|grace-period|猶予|ゆうよ|ek süre|grace period|提出まで一週間の猶予が認められました。|ていしゅつまで いっしゅうかんの ゆうよが みとめられました。|Teslim için bir haftalık ek süre tanındı.|A one-week grace period was granted for submission.
N1|time|provisional|暫定|ざんてい|geçici belirleme|provisional arrangement|暫定の日程を共有します。|ざんていの にっていを きょうゆうします。|Geçici programı paylaşırız.|We share the provisional schedule.
N1|time|deferral|先送り|さきおくり|ileriye erteleme|deferral|問題の先送りでは解決につながりません。|もんだいの さきおくりでは かいけつに つながりません。|Sorunu ileriye ertelemek çözüm getirmez.|Deferring the problem will not solve it.
N1|time|as-needed|随時|ずいじ|gerektikçe|as needed|変更があれば随時お知らせします。|へんこうが あれば ずいじ おしらせします。|Değişiklik oldukça size haber veririz.|We will inform you of changes as they arise.
N5|travel|station|駅|えき|istasyon|station|駅で友達に会います。|えきで ともだちに あいます。|İstasyonda arkadaşımla buluşurum.|I meet a friend at the station.
N5|travel|train|電車|でんしゃ|tren|train|電車で学校に行きます。|でんしゃで がっこうに いきます。|Okula trenle giderim.|I go to school by train.
N5|travel|bus|バス|バス|otobüs|bus|バスは何時に来ますか。|バスは なんじに きますか。|Otobüs saat kaçta gelir?|What time does the bus come?
N5|travel|ticket|切符|きっぷ|bilet|ticket|駅で切符を買います。|えきで きっぷを かいます。|İstasyonda bilet alırım.|I buy a ticket at the station.
N4|travel|transfer|乗り換え|のりかえ|aktarma|transfer|次の駅で乗り換えが必要です。|つぎの えきで のりかえが ひつようです。|Bir sonraki istasyonda aktarma gerekli.|A transfer is needed at the next station.
N4|travel|airport|空港|くうこう|havalimanı|airport|空港まで迎えに行きます。|くうこうまで むかえに いきます。|Seni karşılamaya havalimanına gideceğim.|I will go to the airport to pick you up.
N4|travel|departure|出発|しゅっぱつ|kalkış|departure|出発する前に電話してください。|しゅっぱつする まえに でんわして ください。|Yola çıkmadan önce arayın lütfen.|Please call before you leave.
N4|travel|arrival|到着|とうちゃく|varış|arrival|到着したら連絡します。|とうちゃくしたら れんらくします。|Varınca haber veririm.|I will contact you when I arrive.
N3|travel|round-trip|往復|おうふく|gidiş dönüş|round trip|往復の切符を予約しました。|おうふくの きっぷを よやくしました。|Gidiş dönüş bilet ayırttım.|I reserved a round-trip ticket.
N3|travel|one-way|片道|かたみち|tek yön|one way|片道で二時間ほどかかります。|かたみちで にじかんほど かかります。|Tek yön yaklaşık iki saat sürer.|It takes about two hours one way.
N3|travel|lodging|宿泊|しゅくはく|konaklama|lodging|宿泊する場所を探しています。|しゅくはくする ばしょを さがして います。|Konaklayacak yer arıyorum.|I am looking for a place to stay.
N3|travel|fare|運賃|うんちん|ulaşım ücreti|fare|運賃には特急料金が含まれていません。|うんちんには とっきゅうりょうきんが ふくまれて いません。|Ücrete ekspres tren ek ücreti dahil değil.|The fare does not include the limited-express surcharge.
N2|travel|detour|迂回|うかい|dolanma; alternatif yol|detour|工事のため別の道を迂回します。|こうじの ため べつの みちを うかいします。|İnşaat nedeniyle başka yoldan dolaşırız.|We take a detour because of construction.
N2|travel|service-suspension|運休|うんきゅう|sefer iptali|service suspension|大雪で一部の列車が運休しています。|おおゆきで いちぶの れっしゃが うんきゅうして います。|Yoğun kar nedeniyle bazı tren seferleri yapılmıyor.|Some train services are suspended because of heavy snow.
N2|travel|boarding-ticket|乗車券|じょうしゃけん|yolculuk bileti|travel ticket|乗車券を改札で見せました。|じょうしゃけんを かいさつで みせました。|Yolculuk biletimi gişedeki kontrolde gösterdim.|I showed my travel ticket at the gate.
N2|travel|via|経由|けいゆ|üzerinden geçiş|via|大阪経由で京都に向かいます。|おおさかけいゆで きょうとに むかいます。|Osaka üzerinden Kyoto’ya gideriz.|We head to Kyoto via Osaka.
N1|travel|overseas-travel|渡航|とこう|yurt dışına seyahat|overseas travel|渡航前に必要な準備を確認しました。|とこうまえに ひつような じゅんびを かくにんしました。|Yurt dışı seyahatinden önce gereken hazırlıkları kontrol ettim.|I checked the preparations needed before travelling overseas.
N1|travel|itinerary|旅程|りょてい|seyahat güzergâhı ve planı|itinerary|天候を踏まえて旅程を見直します。|てんこうを ふまえて りょていを みなおします。|Hava durumunu dikkate alarak seyahat planını gözden geçiririz.|We review the itinerary in light of the weather.
N1|travel|quarantine|検疫|けんえき|karantina denetimi|quarantine inspection|検疫に関する案内を読みました。|けんえきに かんする あんないを よみました。|Karantina denetimiyle ilgili açıklamayı okudum.|I read the information about quarantine inspection.
N1|travel|carrying|携行|けいこう|yanında taşıma|carrying with oneself|案内には証明書の携行について書かれていました。|あんないには しょうめいしょの けいこうに ついて かかれて いました。|Açıklamada belgenin yanında taşınması hakkında bilgi vardı.|The notice contained information about carrying the certificate.
`);

export const additionalSentenceRows=rows(`
N5|restaurant|extra-bill|お会計をお願いします。|おかいけいを おねがいします。|Hesabı alabilir miyim?|The bill, please.|お会計|おかいけい|Kibar hesap isteği|Polite request for the bill
N5|restaurant|extra-coffee|コーヒーを一つください。|コーヒーを ひとつ ください。|Bir kahve lütfen.|One coffee, please.|一つ|ひとつ|Kibar sipariş; genel sayaç|Polite order; general counter
N4|restaurant|extra-not-yet|注文した料理がまだ来ていません。|ちゅうもんした りょうりが まだ きて いません。|Sipariş ettiğimiz yemek henüz gelmedi.|The food we ordered has not arrived yet.|まだ||Kibar durum açıklaması|Polite statement of the situation
N4|restaurant|extra-add-order|これを一つ追加してもいいですか。|これを ひとつ ついかしても いいですか。|Bundan bir tane daha ekleyebilir miyim?|May I add one more of these?|追加|ついか|Kibar ek sipariş|Polite additional order
N3|restaurant|extra-wrong-order|注文を間違えたかもしれません。|ちゅうもんを まちがえた かも しれません。|Siparişi yanlış vermiş olabilirim.|I may have ordered the wrong thing.|かもしれません||Kesin olmayan durum; kibar|Uncertain situation; polite
N3|restaurant|extra-no-egg|卵を抜いてもらえますか。|たまごを ぬいて もらえますか。|Yumurtayı çıkartabilir misiniz?|Could you leave out the egg?|抜いて|ぬいて|Kibar değişiklik isteği|Polite request for a change
N2|restaurant|extra-wait-time|提供までに時間がかかる場合は、お知らせください。|ていきょうまでに じかんが かかる ばあいは、おしらせください。|Servis uzun sürecekse haber verin lütfen.|Please let me know if serving it will take time.|場合|ばあい|Kibar koşullu rica|Polite conditional request
N2|restaurant|extra-before-cold|料理が冷めないうちにお召し上がりください。|りょうりが さめない うちに おめしあがりください。|Yemek soğumadan afiyetle yiyin lütfen.|Please enjoy the food before it gets cold.|うちに||Personelin müşteriye saygılı ifadesi|Respectful staff-to-customer expression
N1|restaurant|extra-reservation-change|ご予約の変更につきましては、受付にお問い合わせください。|ごよやくの へんこうに つきましては、うけつけに おといあわせください。|Rezervasyon değişikliği için resepsiyona danışın lütfen.|Please ask reception about changes to your reservation.|につきまして||Resmî müşteri yönlendirmesi|Formal customer guidance
N1|restaurant|extra-hygiene|衛生管理はもとより、味にもこだわっています。|えいせいかんりは もとより、あじにも こだわって います。|Hijyen yönetiminin yanı sıra tada da özen gösteriyoruz.|We pay attention to flavor as well as hygiene management.|はもとより||İşletmenin resmî tanıtım dili|Formal language used by a business
N5|daily|extra-name|お名前は何ですか。|おなまえは なんですか。|Adınız nedir?|What is your name?|お名前|おなまえ|Kibar tanışma|Polite introduction
N5|daily|extra-from|トルコから来ました。|トルコから きました。|Türkiye’den geldim.|I came from Turkey.|から||Tanışmada çıkış yeri|Place of origin in an introduction
N4|daily|extra-photo|ここで写真を撮ってはいけません。|ここで しゃしんを とっては いけません。|Burada fotoğraf çekmek yasak.|You must not take photos here.|てはいけません||Kural bildirme; fiilin て kısmı da boşlukta|Stating a rule; the gap includes the verb’s て
N4|daily|extra-home|買い物をしてから家に帰ります。|かいものを してから いえに かえります。|Alışveriş yaptıktan sonra eve döneceğim.|I will go home after shopping.|てから||Eylemleri sıraya koyma|Sequencing actions
N3|daily|extra-new-city|この町に住むことにしました。|この まちに すむ ことに しました。|Bu şehirde yaşamaya karar verdim.|I decided to live in this town.|ことに||Kişisel karar; kibar|Personal decision; polite
N3|daily|extra-forgot|急いでいたので、財布を忘れてしまいました。|いそいで いたので、さいふを わすれて しまいました。|Acelem olduğu için cüzdanımı unuttum.|I was in a hurry and forgot my wallet.|てしまいました||İstenmeyen sonucu açıklama|Explaining an unwanted outcome
N2|daily|extra-although-busy|忙しいとはいえ、休む時間も必要です。|いそがしいとは いえ、やすむ じかんも ひつようです。|Yoğun olsam da dinlenecek zamana ihtiyacım var.|Although I am busy, I also need time to rest.|とはいえ||Önceki yargıya sınırlama|Qualifying a preceding statement
N2|daily|extra-moving|引っ越しに伴って、住所が変わりました。|ひっこしに ともなって、じゅうしょが かわりました。|Taşınmayla birlikte adresim değişti.|My address changed when I moved.|に伴って|にともなって|Kibar değişiklik bildirimi|Polite notice of a change
N1|daily|extra-unable-ignore|その説明を聞いて、驚かずにはいられませんでした。|その せつめいを きいて、おどろかずには いられませんでした。|O açıklamayı duyunca şaşırmadan edemedim.|I could not help being surprised by that explanation.|ずには||Yazılı veya özenli konuşma|Written or careful speech
N1|daily|extra-evening|日が暮れるにつれて、辺りは静かになった。|ひが くれるに つれて、あたりは しずかに なった。|Hava karardıkça çevre sessizleşti.|As evening fell, the surroundings grew quiet.|につれて||İleri okuma bağlamı; yapı tek başına N1 değildir|Advanced reading context; the pattern alone is not N1
N5|work|extra-start|九時から働きます。|くじから はたらきます。|Saat dokuzdan itibaren çalışırım.|I work from nine o’clock.|九時|くじ|Kibar çalışma saati açıklaması|Polite statement of working hours
N5|work|extra-pen|ペンを貸してください。|ペンを かして ください。|Kalemi ödünç verir misiniz?|Please lend me a pen.|貸して|かして|Kibar ama doğrudan rica|Polite but direct request
N4|work|extra-contact|終わったら連絡してください。|おわったら れんらくして ください。|Bitince haber verin lütfen.|Please contact me when you finish.|たら||İşin bitişine bağlı rica|Request conditional on completion
N4|work|extra-help|荷物を運ぶのを手伝いましょうか。|にもつを はこぶのを てつだいましょうか。|Eşyaları taşımana yardım edeyim mi?|Shall I help you carry the luggage?|ましょうか||Yardım teklif etme|Offering help
N3|work|extra-progress|作業がどこまで進んだか教えてください。|さぎょうが どこまで すすんだか おしえて ください。|İşin nereye kadar ilerlediğini söyler misiniz?|Please tell me how far the work has progressed.|か||Dolaylı soru içeren iş talebi|Work request with an embedded question
N3|work|extra-until|確認が終わるまで、公開しないでください。|かくにんが おわるまで、こうかいしないで ください。|Kontrol bitene kadar yayımlamayın lütfen.|Please do not publish it until the check is complete.|まで||Zaman sınırına bağlı talimat|Instruction with a time boundary
N2|work|extra-based-on|調査結果に基づいて、方針を決めます。|ちょうさけっかに もとづいて、ほうしんを きめます。|Politikayı araştırma sonuçlarına dayanarak belirleriz.|We decide the policy based on the survey results.|に基づいて|にもとづいて|Resmî iş açıklaması|Formal work statement
N2|work|extra-as-soon|準備ができ次第、会議を始めます。|じゅんびが できしだい、かいぎを はじめます。|Hazırlık tamamlanır tamamlanmaz toplantıya başlayacağız.|We will start the meeting as soon as preparations are complete.|次第|しだい|Resmî zamanlama bildirimi|Formal timing announcement
N1|work|extra-without-check|確認を怠ることなく、作業を進めてください。|かくにんを おこたる ことなく、さぎょうを すすめて ください。|Kontrolleri aksatmadan çalışmayı sürdürün lütfen.|Please proceed without neglecting the checks.|ことなく||Resmî talimat; tüm bağlam ileri bantta|Formal instruction; the overall context is in the advanced band
N1|work|extra-not-tolerate|これ以上の遅延は容認しがたい状況です。|これいじょうの ちえんは ようにんしがたい じょうきょうです。|Daha fazla gecikmenin kabulünün zor olduğu bir durumdayız.|We are in a situation where further delay is difficult to accept.|がたい||Resmî ve güçlü değerlendirme|Formal, strong assessment
N5|friends|extra-together|一緒に帰ろう。|いっしょに かえろう。|Birlikte dönelim.|Let us go home together.|一緒に|いっしょに|Arkadaşlar arasında samimi|Casual between friends
N5|friends|extra-favorite|どんな音楽が好き？|どんな おんがくが すき？|Nasıl müzik seversin?|What kind of music do you like?|どんな||Samimi ilgi alanı sorusu|Casual question about interests
N4|friends|extra-borrow|その本、借りてもいい？|その ほん、かりても いい？|O kitabı ödünç alabilir miyim?|Can I borrow that book?|借りて|かりて|Samimi izin isteği|Casual permission request
N4|friends|extra-seems-fun|それ、楽しそうだね。|それ、たのしそうだね。|O eğlenceli görünüyor.|That looks fun.|そう||Görünüşe dayalı samimi yorum|Casual comment based on appearance
N3|friends|extra-just-arrived|今、駅に着いたばかりだよ。|いま、えきに ついた ばかりだよ。|İstasyona daha yeni vardım.|I have just arrived at the station.|ばかり||Samimi yakın zaman açıklaması|Casual statement about a recent action
N3|friends|extra-no-need|無理して来なくてもいいよ。|むりして こなくても いいよ。|Kendini zorlayıp gelmene gerek yok.|You do not have to push yourself to come.|なくても||Samimi rahatlatma|Casual reassurance
N2|friends|extra-not-entirely|別に怒っているわけじゃないよ。|べつに おこって いる わけじゃ ないよ。|Öfkeli olduğumdan değil.|It is not that I am angry.|わけじゃ||Samimi açıklama|Casual clarification
N2|friends|extra-since|せっかく来たんだから、少し見ていこうよ。|せっかく きたんだから、すこし みて いこうよ。|Madem buraya kadar geldik, biraz bakalım.|Since we came all this way, let us look around a little.|んだから||Samimi öneri; gerekçe vurgusu|Casual suggestion emphasizing a reason
N1|friends|extra-worthy|君の説明は一理あるけど、賛成しかねるな。|きみの せつめいは いちり あるけど、さんせいしかねるな。|Açıklamanda haklı bir yan var ama katılamıyorum.|Your explanation has a point, but I cannot agree.|かねる||Resmî ifade samimi sonda; mesafeli duyulabilir|Formal expression with a casual ending; may sound distant
N1|friends|extra-now-that|ここまで来たからには、最後までやろう。|ここまで きたからには、さいごまで やろう。|Bu noktaya kadar geldiğimize göre sonuna kadar yapalım.|Now that we have come this far, let us finish it.|からには||Kararlılık içeren samimi öneri|Casual suggestion expressing determination
N5|shopping|shop-price|これはいくらですか。|これは いくらですか。|Bu ne kadar?|How much is this?|いくら||Kibar fiyat sorusu|Polite price question
N5|shopping|shop-that|それをください。|それを ください。|Şunu alayım lütfen.|I will take that, please.|それ||Karşıdakine yakın nesne|An object near the other person
N5|shopping|shop-size|大きいのはありますか。|おおきいのは ありますか。|Büyük olanı var mı?|Do you have a large one?|大きい|おおきい|Kibar ürün sorusu|Polite product question
N5|shopping|shop-two|これを二つください。|これを ふたつ ください。|Bundan iki tane lütfen.|Two of these, please.|二つ|ふたつ|Genel sayaçla kibar istek|Polite request with a general counter
N4|shopping|shop-try-on|この服を着てみてもいいですか。|この ふくを きて みても いいですか。|Bu kıyafeti deneyebilir miyim?|May I try on these clothes?|みても||Denemek için kibar izin isteği|Polite permission to try something
N4|shopping|shop-card|カードで払うことができますか。|カードで はらう ことが できますか。|Kartla ödeyebilir miyim?|Can I pay by card?|ことが||Bir işlemin mümkün olup olmadığını sorma|Asking whether an action is possible
N4|shopping|shop-cheaper|もう少し安いものを探しています。|もう すこし やすい ものを さがして います。|Biraz daha ucuz bir şey arıyorum.|I am looking for something a little cheaper.|安い|やすい|Kibar ürün arama|Polite product search
N4|shopping|shop-receipt|レシートをもらえますか。|レシートを もらえますか。|Fişi alabilir miyim?|Could I have the receipt?|もらえますか||Kibar rica|Polite request
N3|shopping|shop-fit|もう少し小さいサイズがあれば、試したいです。|もう すこし ちいさい サイズが あれば、ためしたいです。|Biraz daha küçük bedeni varsa denemek isterim.|If there is a smaller size, I would like to try it.|あれば||Koşullu ürün isteği|Conditional product request
N3|shopping|shop-return|サイズが合わないので、交換してもらえますか。|サイズが あわないので、こうかんして もらえますか。|Beden uymadığı için değiştirebilir misiniz?|Could you exchange it because the size does not fit?|交換|こうかん|Değişim politikasına bağlı kibar rica|Polite request subject to the exchange policy
N3|shopping|shop-soldout|欲しかった商品は売り切れていました。|ほしかった しょうひんは うりきれて いました。|İstediğim ürün tükenmişti.|The item I wanted was sold out.|売り切れて|うりきれて|Alışveriş sonucunu anlatma|Describing a shopping outcome
N3|shopping|shop-gift|友達にあげるために買いました。|ともだちに あげる ために かいました。|Arkadaşıma vermek için aldım.|I bought it to give to a friend.|ために||Amaç açıklaması|Explanation of purpose
N2|shopping|shop-compare|値段だけでなく、品質も比較したいです。|ねだんだけで なく、ひんしつも ひかくしたいです。|Yalnızca fiyatı değil kaliteyi de karşılaştırmak istiyorum.|I want to compare quality as well as price.|だけでなく||Karşılaştırma ölçütlerini genişletme|Broadening the comparison criteria
N2|shopping|shop-condition|未使用に限り、返品を受け付けます。|みしように かぎり、へんぴんを うけつけます。|Yalnızca kullanılmamış ürünlerin iadesini kabul ediyoruz.|We accept returns only for unused items.|に限り|にかぎり|Örnek mağaza politikası; genel kural değildir|Example shop policy, not a universal rule
N2|shopping|shop-stock|在庫を確認した上で、ご連絡します。|ざいこを かくにんした うえで、ごれんらくします。|Stoku kontrol ettikten sonra size haber vereceğiz.|We will contact you after checking the stock.|上で|うえで|Personelin kibar açıklaması|Polite statement by staff
N2|shopping|shop-budget|予算に応じて、商品をご提案します。|よさんに おうじて、しょうひんを ごていあんします。|Bütçenize göre ürün önereceğiz.|We will suggest products according to your budget.|に応じて|におうじて|Personelin müşteriye açıklaması|Staff speaking to a customer
N1|shopping|shop-discontinued|製造中止に伴い、販売を終了いたしました。|せいぞうちゅうしに ともない、はんばいを しゅうりょういたしました。|Üretimin durmasıyla satışımız sona erdi.|Sales have ended following the discontinuation of production.|に伴い|にともない|Resmî mağaza duyurusu|Formal shop announcement
N1|shopping|shop-only-here|当店ならではの商品を取りそろえております。|とうてんならではの しょうひんを とりそろえて おります。|Mağazamıza özgü ürünler sunuyoruz.|We offer products unique to our shop.|ならでは||Resmî tanıtım dili|Formal promotional language
N1|shopping|shop-cannot-refund|ご使用後の返金には応じかねます。|ごしようごの へんきんには おうじかねます。|Kullanım sonrasında para iadesi yapamıyoruz.|We are unable to offer a refund after use.|かねます||Örnek politika; resmî ve kibar ret|Example policy; formal polite refusal
N1|shopping|shop-new-model|従来品に比べ、耐久性が格段に向上しています。|じゅうらいひんに くらべ、たいきゅうせいが かくだんに こうじょうして います。|Önceki ürüne göre dayanıklılık belirgin biçimde arttı.|Durability has improved markedly compared with the previous product.|格段に|かくだんに|Ürün tanıtımı; örnek iddia|Product description; an example claim
N5|travel|travel-destination|この電車は京都に行きますか。|この でんしゃは きょうとに いきますか。|Bu tren Kyoto’ya gider mi?|Does this train go to Kyoto?|京都|きょうと|Kibar güzergâh sorusu|Polite route question
N5|travel|travel-platform|乗り場はどこですか。|のりばは どこですか。|Biniş yeri nerede?|Where is the boarding area?|どこ||Kibar yer sorusu|Polite location question
N5|travel|travel-hotel|ホテルは駅の前です。|ホテルは えきの まえです。|Otel istasyonun önünde.|The hotel is in front of the station.|前|まえ|Temel yer tarifi|Basic directions
N5|travel|travel-bus|バスで行きます。|バスで いきます。|Otobüsle gideceğim.|I will go by bus.|で||Ulaşım aracını belirten parçacık|Particle marking transport
N4|travel|travel-transfer|どこで乗り換えればいいですか。|どこで のりかえれば いいですか。|Nerede aktarma yapmalıyım?|Where should I transfer?|ば||Koşul biçimiyle tavsiye sorma|Asking advice with a conditional form
N4|travel|travel-luggage|荷物を預けたいんですが。|にもつを あずけたいんですが。|Bagajımı bırakmak istiyordum.|I would like to leave my luggage.|たい||Kibar isteğe giriş|Polite opening to a request
N4|travel|travel-reservation|二泊の予約をしています。|にはくの よやくを して います。|İki gecelik rezervasyonum var.|I have a reservation for two nights.|二泊|にはく|Otelde kibar açıklama|Polite statement at a hotel
N4|travel|travel-map|地図を見せてもらえますか。|ちずを みせて もらえますか。|Haritayı gösterebilir misiniz?|Could you show me the map?|見せて|みせて|Kibar rica|Polite request
N3|travel|travel-late|電車が遅れているようです。|でんしゃが おくれて いる ようです。|Tren gecikiyor gibi görünüyor.|It seems that the train is delayed.|よう||Bilgiye dayalı çıkarım|Inference based on information
N3|travel|travel-until-six|六時までに空港に着く必要があります。|ろくじまでに くうこうに つく ひつようが あります。|Saat altıya kadar havalimanına varmam gerekiyor.|I need to reach the airport by six.|までに||Son zamana kadar tamamlanma|Completion by a deadline
N3|travel|travel-window|窓側の席にしていただけますか。|まどがわの せきに して いただけますか。|Pencere kenarında bir koltuk ayarlayabilir misiniz?|Could you arrange a window seat for me?|いただけますか||Daha özenli ve kibar rica|A more deferential request
N3|travel|travel-weather|天気によって、予定を変えるかもしれません。|てんきに よって、よていを かえる かも しれません。|Havaya göre planı değiştirebiliriz.|We may change the plan depending on the weather.|によって||Koşullara bağlı plan|A plan depending on conditions
N2|travel|travel-suspended|悪天候により、本日の運航は中止となりました。|あくてんこうに より、ほんじつの うんこうは ちゅうしと なりました。|Kötü hava nedeniyle bugünkü sefer iptal edildi.|Today’s service has been cancelled due to bad weather.|により||Resmî ulaşım duyurusu|Formal transport announcement
N2|travel|travel-rebook|空席があり次第、別の便をご案内します。|くうせきが ありしだい、べつの びんを ごあんないします。|Yer açılır açılmaz başka bir sefer hakkında bilgi vereceğiz.|We will offer another service as soon as a seat becomes available.|次第|しだい|Personelin resmî açıklaması|Formal statement by staff
N2|travel|travel-included|宿泊料金には朝食が含まれています。|しゅくはくりょうきんには ちょうしょくが ふくまれて います。|Konaklama ücretine kahvaltı dahildir.|Breakfast is included in the accommodation price.|含まれて|ふくまれて|Örnek otel koşulu|Example hotel condition
N2|travel|travel-according|ご希望に沿って、旅程を調整いたします。|ごきぼうに そって、りょていを ちょうせいいたします。|İsteklerinize uygun olarak seyahat planını ayarlayacağız.|We will adjust the itinerary to your wishes.|に沿って|にそって|Personelin müşteriye saygılı ifadesi|Respectful staff-to-customer expression
 N1|travel|travel-difficult|現状に鑑みると、予定どおりの出発は困難です。|げんじょうに かんがみると、よていどおりの しゅっぱつは こんなんです。|Mevcut durumu göz önüne alınca planlanan saatte kalkmak zor.|Considering the current situation, departure as scheduled is difficult.|鑑みる|かんがみる|Resmî ve yazılı üslup|Formal written style
N1|travel|travel-no-choice|急な運休で、宿泊先の変更を余儀なくされました。|きゅうな うんきゅうで、しゅくはくさきの へんこうを よぎなく されました。|Ani sefer iptali yüzünden kalacağımız yeri değiştirmek zorunda kaldık.|The sudden service suspension forced us to change our accommodation.|を余儀なく|をよぎなく|Resmî olay anlatımı|Formal account of an event
N1|travel|travel-worth|この景色は一見に値します。|この けしきは いっけんに あたいします。|Bu manzara görülmeye değer.|This scenery is worth seeing.|に値します|にあたいします|Özenli değerlendirme|Carefully worded evaluation
N1|travel|travel-regardless|天候のいかんによっては、旅程を変更します。|てんこうの いかんに よっては、りょていを へんこうします。|Hava durumuna bağlı olarak seyahat planını değiştirebiliriz.|Depending on the weather, we may change the itinerary.|いかん||Çok resmî koşul açıklaması|Very formal statement of conditions
`).map(row=>{row[8]=row[8].split('~').filter(Boolean);return row;});

export const additionalGrammarRows=rows(`
N5|ownership|名詞 + の + 名詞|Aitlik ilişkisi|Possession|の iki ismi bağlayarak aitlik gösterebilir. Bu örnekte kitabın kime ait olduğu sorulur.|の can connect two nouns to express possession. Here it identifies whose book it is.|これは姉の本です。|これは あねの ほんです。|Bu, ablamın kitabı.|This is my older sister’s book.|の|の
N5|existence|場所 + に + 物 + がある|Bir şeyin var olduğu yer|Location of an object|Cansız bir şeyin bulunduğu yeri に, var olan şeyi が ile gösteririz. Canlılar için いる kullanılır.|に marks the location and が marks the existing object. Use いる for people and animals.|机の上に本があります。|つくえの うえに ほんが あります。|Masanın üzerinde bir kitap var.|There is a book on the desk.|に|に
N5|polite-negative|動詞のます語幹 + ません|Kibar olumsuz fiil|Polite negative verb|ます yerine ません kullanarak kibar geniş/gelecek zaman olumsuzu kurulur.|Replace ます with ません for a polite nonpast negative verb.|今日はコーヒーを飲みません。|きょうは コーヒーを のみません。|Bugün kahve içmeyeceğim.|I will not drink coffee today.|ません|ません
N5|invitation|動詞のます語幹 + ませんか|Kibar davet|Polite invitation|ませんか soru biçimi birlikte bir eylem yapmaya kibar davet olabilir. Bağlam sıradan olumsuz sorudan ayırır.|ませんか can politely invite someone to do something together. Context distinguishes this from a negative question.|一緒に昼ご飯を食べませんか。|いっしょに ひるごはんを たべませんか。|Birlikte öğle yemeği yiyelim mi?|Would you like to have lunch together?|ませんか|ませんか
N5|addition|名詞 + も|Aynı durumun eklenmesi|Also / too|も önceki kişi veya şey için doğru olanın diğeri için de geçerli olduğunu gösterir.|も indicates that the same statement also applies to another person or thing.|兄は学生です。私も学生です。|あには がくせいです。わたしも がくせいです。|Ağabeyim öğrenci. Ben de öğrenciyim.|My older brother is a student. I am a student too.|も|も
N4|potential|一段動詞の語幹 + られる|Yapabilmek|Potential form|İkinci grup (一段) fiillerde る yerine られる eklenir. Bu kart standart 食べられる biçimini çalıştırır.|For an ichidan verb, replace る with られる. This card practices the standard form 食べられる.|私は納豆が食べられます。|わたしは なっとうが たべられます。|Ben natto yiyebilirim.|I can eat natto.|られ|られ
N4|preparation|動詞て形 + おく|Önceden hazırlamak|Doing something in preparation|ておく bir şeyi ileride gerekeceği için önceden yapmayı anlatabilir. Bu örnekte みておく kısaltılmaz.|ておく can mean doing something in advance for a later need. The full form is used here.|旅行の前に地図を見ておきます。|りょこうの まえに ちずを みて おきます。|Seyahatten önce haritaya bakacağım.|I will look at the map before the trip.|おき|おき
N4|giving-help|動詞て形 + あげる|Birine yardım niteliğinde eylem|Doing something for someone|てあげる başkası için yapılan eylemi yarar açısından anlatır. Doğrudan karşıdakine kullanıldığında lütuf yapıyormuş gibi duyulabilir.|てあげる presents an action as benefiting someone else. Saying it directly to the recipient can sound patronizing.|友達に道を教えてあげました。|ともだちに みちを おしえて あげました。|Arkadaşıma yolu tarif ettim.|I showed my friend the way.|あげ|あげ
N4|receiving-help|動詞て形 + くれる|Birinin benim için yaptığı eylem|Someone doing something for me|てくれる eylemin konuşana veya konuşanın tarafına yarar sağladığını anlatır.|てくれる describes an action benefiting the speaker or someone in the speaker’s group.|友達が荷物を持ってくれました。|ともだちが にもつを もって くれました。|Arkadaşım eşyalarımı taşıdı.|My friend carried my luggage for me.|くれ|くれ
N4|tara|動詞た形 + ら|Olursa / olunca|If / when|た biçimine ら eklenerek koşul ya da bir şey olduktan sonraki durum anlatılır. Burada yağmur yağması koşuldur.|Add ら to the た form for a condition or a situation after an event. Here rain is the condition.|雨が降ったら、家にいます。|あめが ふったら、いえに います。|Yağmur yağarsa evde kalacağım.|If it rains, I will stay home.|ら|ら
N3|while-still|動詞ない形 + うちに|Durum değişmeden önce|Before a state changes|ないうちに bir şey gerçekleşmeden önceki fırsatı kullanmayı anlatır. Bu örnekte hava kararmadan dönülür.|ないうちに describes acting before something happens. Here the speaker returns before it gets dark.|暗くならないうちに帰りましょう。|くらく ならない うちに かえりましょう。|Hava kararmadan dönelim.|Let us return before it gets dark.|うちに|うちに
N3|apparently|普通形 + らしい|Dolaylı bilgiye dayalı çıkarım|Apparently / reportedly|らしい duyulan veya dolaylı elde edilen bilgiden yapılan çıkarımı anlatabilir. Burada konuşan bir bilgiyi aktarıyor.|らしい can express an inference from indirect or reported information. Here the speaker passes on information.|田中さんは来月引っ越すらしいです。|たなかさんは らいげつ ひっこす らしいです。|Tanaka gelecek ay taşınacakmış.|Apparently Tanaka is moving next month.|らしい|らしい
N3|hearsay|普通形 + そうだ|Duyulan bilgiyi aktarmak|Reporting what one has heard|Düz biçim + そうだ duyulan bilgiyi aktarır. Yağacak gibi görünme anlamındaki 降りそうだ ile aynı değildir.|A plain form + そうだ reports information heard. It differs from 降りそうだ, meaning that it looks likely to rain.|天気予報によると、明日は雨が降るそうです。|てんきよほうに よると、あしたは あめが ふる そうです。|Hava tahminine göre yarın yağmur yağacakmış.|According to the forecast, it will rain tomorrow.|そう|そう
N3|even-if|動詞て形 + も|Olsa bile|Even if / even though|ても önceki koşul olsa da sonraki sonucun geçerli kalmasını anlatır.|ても indicates that the following result holds despite the preceding condition.|雨が降っても、試合はあります。|あめが ふっても、しあいは あります。|Yağmur yağsa da maç yapılacak.|The match will take place even if it rains.|も|も
N3|no-need|動詞辞書形 + ことはない|Yapmaya gerek yok|There is no need to|ことはない bir eylemin gerekli olmadığını söyleyebilir. Burada endişe etmeye gerek olmadığı ifade edilir.|ことはない can say an action is unnecessary. Here it means there is no need to worry.|そんなに心配することはありません。|そんなに しんぱいする ことは ありません。|O kadar endişelenmene gerek yok.|There is no need to worry so much.|ことは|ことは
N2|certainty|普通形 + に違いない|Güçlü kanaat|Strong conviction|Konuşanın güçlü çıkarımını belirtir; nesnel bir garanti değildir. İsim ve な sıfatlarıyla だ kullanılmaz.|Expresses the speaker’s strong inference, not an objective guarantee. Omit だ after nouns and な adjectives.|あの人は専門家に違いありません。|あの ひとは せんもんかに ちがいありません。|O kişi kesinlikle uzman olmalı.|That person must be an expert.|に違いありません|に違いありません~にちがいありません
N2|cannot-social|動詞辞書形 + わけにはいかない|Koşullar yüzünden yapamamak|Unable because of circumstances|Ahlaki, sosyal veya durumsal bir engelden dolayı eylemin yapılamayacağını anlatır; fiziksel yeteneksizlik değildir.|Describes a social, moral or situational barrier to acting rather than physical inability.|約束したので、休むわけにはいきません。|やくそくしたので、やすむ わけには いきません。|Söz verdiğim için izin yapamam.|I cannot take time off because I made a promise.|わけには|わけには
N2|not-only-formal|名詞 + のみならず|Sadece bununla sınırlı değil|Not only, formal|のみならず kapsamı başka öğelere de genişletir; だけでなく ifadesinden daha resmîdir.|のみならず extends the scope to other items. It is more formal than だけでなく.|この店は味のみならず、接客でも評判です。|この みせは あじのみならず、せっきゃくでも ひょうばんです。|Bu yer sadece lezzetiyle değil hizmetiyle de ünlü.|This place is known not only for its food but also its service.|のみならず|のみならず
N2|as-changes|動詞辞書形 + に従って|Bir değişimle birlikte|As something changes|Bir değişim ilerlerken diğerinin de ona paralel değiştiğini anlatabilir. İsimle kullanıldığında talimata uyma anlamı da vardır.|Can describe one change accompanying another. With a noun it can also mean following instructions.|高度が上がるに従って、気温が下がります。|こうどが あがるに したがって、きおんが さがります。|Yükseklik arttıkça sıcaklık düşer.|As altitude increases, the temperature drops.|に従って|に従って~にしたがって
N2|risk|動詞のます語幹 + かねない|Olumsuz sonucun ihtimali|Risk of an undesirable outcome|かねない genellikle istenmeyen bir sonucun mümkün olduğunu belirtir. Yapamamak anlamındaki かねる ile farklıdır.|かねない usually indicates a possible undesirable result. It differs from かねる, meaning being unable to do something.|このままでは誤解を招きかねません。|このままでは ごかいを まねきかねません。|Böyle giderse yanlış anlaşılmaya yol açabilir.|This could lead to misunderstanding if it continues.|かねません|かねません
N1|prohibition-formal|動詞辞書形 + べからず|Yazılı sert yasak|Formal written prohibition|べからず eski ve sert bir yasak biçimidir. Uyarı levhalarında görülebilir; normal kibar rica yerine kullanılmaz.|べからず is an old-fashioned, strong prohibition seen on signs. It is not a substitute for an ordinary polite request.|ここに入るべからず。|ここに はいるべからず。|Buraya girilmez.|Do not enter here.|べからず|べからず
N1|overwhelmed|感情を表す名詞 + に堪えない|Duygunun çok güçlü olması|An overwhelming feeling|感謝 veya 感激 gibi duygularla çok güçlü his anlatır. Görmeye dayanamamak gibi başka kullanımlarla karıştırılmamalıdır.|With emotions such as gratitude, expresses an overwhelming feeling. Distinguish other uses meaning being unable to bear something.|皆様のご協力には感謝に堪えません。|みなさまの ごきょうりょくには かんしゃに たえません。|İşbirliğiniz için minnettarlığımı anlatamam.|I cannot express how grateful I am for your cooperation.|に堪えません|に堪えません~にたえません
N1|need-not-go-so-far|動詞辞書形 + までもない|O kadarına gerek yok|There is no need to go so far as|Açık veya gereksiz görülen bir eylemi yapmaya kadar gitmenin gerekmediğini belirtir.|Indicates that there is no need to go so far as to do an action considered obvious or unnecessary.|そのことは改めて説明するまでもありません。|その ことは あらためて せつめいする までも ありません。|Bunu yeniden açıklamaya gerek yok.|There is no need to explain that again.|までも|までも
N1|cannot-suppress|感情を表す名詞 + を禁じ得ない|Duyguyu bastıramamak|Unable to suppress an emotion|Şaşkınlık veya sempati gibi duyguları bastıramamayı resmî biçimde anlatır.|A formal written expression for being unable to suppress an emotion such as surprise or sympathy.|その知らせに驚きを禁じ得ません。|その しらせに おどろきを きんじえません。|O haber karşısında şaşkınlığımı gizleyemiyorum.|I cannot suppress my surprise at that news.|を禁じ得ません|を禁じ得ません~をきんじえません
N1|immediately|動詞辞書形 + なり|Bir eylemin hemen ardından|Immediately upon doing|Aynı kişinin ilk eylemin hemen ardından çoğu kez beklenmedik ikinci eylemini anlatır. Burada geçmişteki tek olaydır.|Describes the same person doing a second, often unexpected action immediately after the first. Here it is one past event.|彼は部屋に入るなり、窓を開けました。|かれは へやに はいるなり、まどを あけました。|Odaya girer girmez pencereyi açtı.|He opened the window as soon as he entered the room.|なり|なり
`).map(row=>{row[12]=row[12].split('~');return row;});
