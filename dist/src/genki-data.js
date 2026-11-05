// Lesson numbering and selected topics checked against the publisher's 3rd-edition syllabus.
// All explanations, examples and exercises below are original Yomu material, not book extracts.
export const GENKI_VERSION='genki-original-2026-11-05.1';
export const genkiSources={
 structure:'https://genki3.japantimes.co.jp/en/intro/index.html',
 syllabus:'https://bookclub2.japantimes.co.jp/download/files/genki3/genki-3rd_syllabus_E.pdf',
 checkedAt:'2026-11-05'
};
const bi=(tr,en)=>({tr,en});
const rows=[
 [1,'Kendinden söz et','About yourself','は · です · の',
  'Bir isim cümlesi kur; kimlik ve aitlik bilgisini ayır.','Build a noun sentence; distinguish identity from possession.',
  'は cümlenin konusunu işaretler ve burada “wa” okunur. İsimden sonraki です kibar bir yargı kurar.','は marks the topic and is read “wa” here. After a noun, です makes a polite statement.',
  '私は会社員です。','わたしは かいしゃいんです。','Ben bir şirket çalışanıyım.','I am a company employee.',
  'ミナさん［　］先生です。','ミナさん［　］せんせいです。','Mina öğretmendir. Konuyu işaretleyen parçacığı yaz.','Mina is a teacher. Type the topic particle.',['は'],
  'ミナさんは先生です。 Konu ミナさん olduğu için は kullanılır.','ミナさんは先生です。 は marks ミナさん as the topic.','g-desu','time','daily'],
 [2,'Eşyaları işaret et','Point out objects','これ · この · だれの',
  'Yakınlık belirten sözcükleri seç; bir eşyanın kime ait olduğunu sor.','Choose a demonstrative; ask who owns an object.',
  'この, konuşana yakın bir şeyi belirtir ve hemen ardından isim gelir. これ ise tek başına isim gibi kullanılabilir.','この refers to something near the speaker and must precede a noun. これ can stand on its own as a noun phrase.',
  'このかばんは軽いです。','この かばんは かるいです。','Bu çanta hafif.','This bag is light.',
  '［　］ノートはいくらですか。','［　］ノートは いくらですか。','Elindeki defteri gösteriyorsun: “Bu defter kaç para?” İsimden önce gelen “bu” sözcüğünü yaz.','You point to the notebook in your hand: “How much is this notebook?” Type “this” before the noun.',['この'],
  'このノートはいくらですか。 ノート isminden önce この gelir.','このノートはいくらですか。 この directly modifies ノート.','g-ownership','objects','shopping'],
 [3,'Rutin ve buluşma','Routines and meeting up','ます · で · ませんか',
  'Bir eylemin yerini belirt; kibar bir davet kur.','Mark where an activity happens; make a polite invitation.',
  'Bir eylemin gerçekleştiği yeri で ile gösterebilirsin. Gidilen hedef için kullanılan に ile görevleri farklıdır.','で can mark the place where an activity happens. It differs from に used for a destination.',
  '駅で友だちを待ちます。','えきで ともだちを まちます。','İstasyonda arkadaşımı bekleyeceğim.','I will wait for my friend at the station.',
  '家［　］日本語を勉強します。','いえ［　］にほんごを べんきょうします。','Evde Japonca çalışırım. Eylemin yerini belirten parçacığı yaz.','I study Japanese at home. Type the particle marking the place of the activity.',['で'],
  '家で日本語を勉強します。 Çalışma eyleminin gerçekleştiği yer 家で ile belirtilir.','家で日本語を勉強します。 家で marks where the studying happens.','g-invitation','time','friends'],
 [4,'Yer ve geçmiş','Location and the past','あります · います · ました',
  'Birinin nerede olduğunu anlat; geçmiş bir eylemden söz et.','Describe where someone is; talk about a past action.',
  'います, burada bir insanın veya hayvanın bulunduğunu belirtir. Cansız nesnelerin varlığı için genellikle あります kullanılır.','います describes the presence of a person or animal here. あります is generally used for inanimate things.',
  '庭に犬がいます。','にわに いぬが います。','Bahçede bir köpek var.','There is a dog in the garden.',
  '机の下に猫が［　］。','つくえの したに ねこが［　］。','Masanın altında bir kedi var. Kibar, olumlu varlık fiilini yaz.','There is a cat under the desk. Type the polite affirmative existence verb.',['います'],
  '机の下に猫がいます。 猫 bir hayvan olduğu için burada います uygundur.','机の下に猫がいます。 います is appropriate because 猫 is an animal.','g-existence','objects','daily'],
 [5,'Nitelik ve beğeni','Description and preferences','い／な形容詞 · 好き · ましょう',
  'Bir ismi sıfatla nitele; sevdiğin şeyleri belirt.','Modify a noun with an adjective; express a preference.',
  '静か bir な sıfatıdır. Doğrudan bir ismin önünde kullanıldığında 静かな olur; cümle sonunda 静かです denir.','静か is a な-adjective. Directly before a noun it becomes 静かな; at the end of a polite sentence use 静かです.',
  '静かな公園が好きです。','しずかな こうえんが すきです。','Sessiz parkları severim.','I like quiet parks.',
  'ここは［　］店です。','ここは［　］みせです。','Burası sessiz bir dükkân. 静か sıfatını 店 isminden önce doğru biçimde yaz.','This is a quiet shop. Put 静か in the correct form before 店.',['静かな','しずかな'],
  'ここは静かな店です。 İsimden önce 静か + な kullanılır.','ここは静かな店です。 静か takes な before the noun.','g-suki','food','restaurant'],
 [6,'Rica ve izin','Requests and permission','て形 · てください · てもいい',
  'て biçimini tanı; bir eylem için izin iste.','Recognise the て-form; ask permission to do something.',
  'Fiilin て biçimine もいいですか eklemek, o eylem için izin sorar. Fiile göre て biçimi değişir: 休む → 休んで.','Add もいいですか to a verb’s て-form to ask permission. The て-form depends on the verb: 休む → 休んで.',
  'ここで電話してもいいですか。','ここで でんわしても いいですか。','Burada telefon edebilir miyim?','May I make a phone call here?',
  'ここで休んで［　］ですか。','ここで やすんで［　］ですか。','Burada dinlenebilir miyim? İzin sorusunun eksik kısmını yaz.','May I rest here? Complete the permission question.',['もいい'],
  'ここで休んでもいいですか。 休んで + もいいですか izin sorusudur.','ここで休んでもいいですか。 休んで + もいいですか asks permission.','g-permission','objects','restaurant'],
 [7,'Süren eylemler','Actions in progress','ている · くて／で · 人数',
  'Şu anda süren bir eylemi anlat; insanları betimle.','Describe an action in progress; describe people.',
  'ている, bağlama göre süren eylem veya ortaya çıkmış durum anlatabilir. Burada 寝ています, kişinin şu anda uyuduğunu söyler.','ている can describe an ongoing action or a resulting state, depending on context. Here 寝ています means someone is sleeping now.',
  '妹は今、本を読んでいます。','いもうとは いま、ほんを よんで います。','Kız kardeşim şu anda kitap okuyor.','My younger sister is reading a book now.',
  '弟は今、［　］います。','おとうとは いま、［　］います。','Erkek kardeşim şu anda uyuyor. 寝る fiilinin て biçimini yaz.','My younger brother is sleeping now. Type the て-form of 寝る.',['寝て','ねて'],
  '弟は今、寝ています。 寝る → 寝て; ardından います gelir.','弟は今、寝ています。 寝る becomes 寝て before います.','g-nagara','family','daily'],
 [8,'Samimi konuşma ve görüş','Casual speech and opinions','普通形 · と思う · ないでください',
  'Düz biçimleri kullan; bir düşünceyi alıntıla.','Use plain forms; express a thought.',
  'と思います öncesinde düz biçim kullanılır. İsimler ve な sıfatlarının olumlu şimdiki zamanında だ korunur: 便利だと思います.','Use a plain form before と思います. Affirmative present nouns and な-adjectives keep だ: 便利だと思います.',
  'この道は安全だと思います。','この みちは あんぜんだと おもいます。','Bu yolun güvenli olduğunu düşünüyorum.','I think this road is safe.',
  'このアプリは便利［　］思います。','この アプリは べんり［　］おもいます。','Bu uygulamanın kullanışlı olduğunu düşünüyorum. 便利 ile 思います arasını tamamla.','I think this app is useful. Complete the part between 便利 and 思います.',['だと'],
  'このアプリは便利だと思います。 便利 bir な sıfatıdır; düz olumlu yargı 便利だ olur.','このアプリは便利だと思います。 便利 is a な-adjective, so its plain affirmative predicate is 便利だ.','g-think','software','friends'],
 [9,'Geçmişi samimi anlat','Talk casually about the past','た形 · 名詞修飾 · まだ',
  'Düz geçmiş biçimi kur; isimleri kısa cümlelerle nitele.','Build a plain past form; modify nouns with short clauses.',
  'Bir ichidan fiilinin olumlu düz geçmişinde る yerine た gelir. 食べる → 食べた; bu biçim kibar 食べました ile aynı üslupta değildir.','For an ichidan verb’s affirmative plain past, replace る with た. 食べる → 食べた; this has a different register from polite 食べました.',
  '昨日、新しい映画を見た。','きのう、あたらしい えいがを みた。','Dün yeni bir film izledim.','I watched a new film yesterday.',
  '昨日、パンを［　］。','きのう、パンを［　］。','Dün ekmek yedim. 食べる fiilinin olumlu düz geçmişini yaz.','I ate bread yesterday. Type the affirmative plain past of 食べる.',['食べた','たべた'],
  '昨日、パンを食べた。 食べる ichidan fiilidir: る çıkar, た eklenir.','昨日、パンを食べた。 食べる is ichidan: remove る and add た.','g-experience','food','friends'],
 [10,'Karşılaştır ve planla','Compare and plan','より · つもり · なる',
  'İki şeyi karşılaştır; gelecek niyetini belirt.','Compare two things; express an intention.',
  'A は B より + sıfat yapısında B karşılaştırma ölçütüdür. “Bugün düne göre daha soğuk” derken 昨日より kullanılır.','In A は B より + adjective, B is the comparison standard. 昨日より means “than yesterday”.',
  '電車はバスより速いです。','でんしゃは バスより はやいです。','Tren otobüsten daha hızlıdır.','The train is faster than the bus.',
  '今日は昨日［　］寒いです。','きょうは きのう［　］さむいです。','Bugün dünden daha soğuk. Karşılaştırma parçasını yaz.','Today is colder than yesterday. Type the comparison marker.',['より'],
  '今日は昨日より寒いです。 昨日より karşılaştırmanın ölçütünü gösterir.','今日は昨日より寒いです。 昨日より gives the comparison standard.','g-tai','travel','travel'],
 [11,'İstek ve deneyim','Wishes and experiences','たい · たり · たことがある',
  'Yapmak istediğin şeyi söyle; yaşanmış bir deneyimi anlat.','Say what you want to do; describe an experience you have had.',
  'Fiilin た biçimi + ことがある, bir şeyi daha önce yapmış olmayı anlatır. Belirli bir gün gerçekleşen tek olayı bildirmekten farklıdır.','A verb’s た-form + ことがある expresses having done something before. It differs from reporting one event on a specific day.',
  '一人で旅行したことがあります。','ひとりで りょこうした ことが あります。','Tek başıma seyahat etmişliğim var.','I have travelled alone before.',
  '北海道に行った［　］あります。','ほっかいどうに いった［　］あります。','Hokkaido’ya gitmişliğim var. Deneyim yapısının eksik kısmını yaz.','I have been to Hokkaido. Complete the experience pattern.',['ことが'],
  '北海道に行ったことがあります。 行った + ことがあります deneyimi belirtir.','北海道に行ったことがあります。 行った + ことがあります expresses the experience.','g-experience','travel','travel'],
 [12,'Açıkla ve öner','Explain and suggest','んです · ほうがいい · なければ',
  'Bağlamı açıkla; olumlu bir eylem önerisi kur.','Give context; suggest taking an action.',
  'Olumlu öneride fiilin た biçimi + ほうがいいです kullanılır. Bu kalıptaki た biçimi, önerinin geçmişte yapıldığını söylemez.','For affirmative advice, use a verb’s た-form + ほうがいいです. The た-form in this pattern does not mean the advised action happened in the past.',
  '今日は早く寝たほうがいいです。','きょうは はやく ねた ほうが いいです。','Bugün erken yatsan iyi olur.','You should go to bed early today.',
  '少し［　］ほうがいいです。','すこし［　］ほうが いいです。','Biraz dinlensen iyi olur. 休む fiilini bu öneriye uygun biçimde yaz.','You should rest a little. Put 休む in the form needed for this advice.',['休んだ','やすんだ'],
  '少し休んだほうがいいです。 休む fiilinin た biçimi 休んだ olur.','少し休んだほうがいいです。 The た-form of 休む is 休んだ.','g-must','time','daily'],
 [13,'Yapabildiklerin','What you can do','可能形 · そう · てみる',
  'Bir beceri veya imkânı anlat; yeni bir şeyi denemeyi öner.','Express an ability or possibility; try something new.',
  'Godan fiili 撮る için olasılık/yeterlik biçimi 撮れる, kibar biçimi 撮れます olur. Potansiyel biçim bazen izin anlamıyla da kullanılır; anlam bağlama bağlıdır.','The potential form of godan 撮る is 撮れる; its polite form is 撮れます. Potential forms can also concern permission in context.',
  'この店ではカードが使えます。','この みせでは カードが つかえます。','Bu dükkânda kart kullanılabilir.','You can use a card at this shop.',
  'ここで写真が［　］。','ここで しゃしんが［　］。','Burada fotoğraf çekilebilir. 撮る fiilinin kibar olumlu potansiyel biçimini yaz.','You can take photos here. Type the polite affirmative potential of 撮る.',['撮れます','とれます'],
  'ここで写真が撮れます。 撮る → 撮れる → 撮れます.','ここで写真が撮れます。 撮る → 撮れる → 撮れます.','g-potential','travel','work'],
 [14,'Hediye ve belirsizlik','Gifts and uncertainty','ほしい · あげる／くれる · かもしれない',
  'Alma-verme yönünü takip et; kesin olmayan bir olasılığı belirt.','Track the direction of giving; express uncertainty.',
  'あげる, konuşanın veya onun bakış açısından birinin başkasına bir şey vermesini anlatır. Alan kişi に ile belirtilebilir.','あげる describes the speaker, or someone viewed from that side, giving something to another person. に can mark the recipient.',
  '私は姉にマフラーをあげました。','わたしは あねに マフラーを あげました。','Ablama bir atkı verdim.','I gave my older sister a scarf.',
  '私は友だちに花を［　］。','わたしは ともだちに はなを［　］。','Arkadaşıma çiçek verdim. あげる fiilini kibar olumlu geçmişe çevir.','I gave my friend flowers. Put あげる in the polite affirmative past.',['あげました'],
  '私は友だちに花をあげました。 Veren 私, alan 友だち olduğu için あげる yönü uygundur.','私は友だちに花をあげました。 私 gives and 友だち receives, matching あげる.','g-giving-help','objects','friends'],
 [15,'Birlikte karar ver','Plans and preparation','意向形 · ておく · 名詞修飾',
  'Bir planı konuş; sonraki iş için önceden hazırlık yap.','Discuss a plan; prepare in advance for a later activity.',
  'ておく, çoğunlukla daha sonra lazım olacağı için önceden bir eylem yapmayı anlatır. Kibar olumlu biçimi ておきます olur.','ておく commonly means doing something in advance for a later purpose. Its polite affirmative form is ておきます.',
  '会議の前に、資料を読んでおきます。','かいぎの まえに、しりょうを よんで おきます。','Toplantıdan önce belgeleri okuyup hazırlanacağım.','I will read the documents before the meeting to prepare.',
  '旅行の前に、ホテルを予約して［　］。','りょこうの まえに、ホテルを よやくして［　］。','Seyahate hazırlık için oteli önceden ayırtacağım. ておく yapısının kibar sonunu tamamla.','I will book the hotel in advance for the trip. Complete the polite ending of ておく.',['おきます'],
  '旅行の前に、ホテルを予約しておきます。 予約して + おきます önceden hazırlığı anlatır.','旅行の前に、ホテルを予約しておきます。 予約して + おきます expresses preparation.','g-preparation','travel','travel'],
 [16,'Yardımlaşma ve rica','Favours and requests','てくれる · ていただけませんか · 時',
  'Senin yararına yapılan eylemi anlat; daha nazik bir ricayı tanı.','Describe an action done for your benefit; recognise a more polite request.',
  'てくれる, birinin konuşan veya onun yakını yararına yaptığı eylemi anlatabilir. Burada arkadaşım benim yükümü taşıyarak bana yardım eder.','てくれる can describe someone doing an action for the speaker or someone close to them. Here a friend helps by carrying my luggage.',
  '友だちが駅まで送ってくれました。','ともだちが えきまで おくって くれました。','Arkadaşım beni istasyona kadar götürdü.','My friend took me to the station as a favour.',
  '友だちが私の荷物を持って［　］。','ともだちが わたしの にもつを もって［　］。','Arkadaşım benim için bagajımı taşıdı. くれる yardımcı fiilinin kibar geçmişini yaz.','My friend carried my luggage for me. Type the polite past of auxiliary くれる.',['くれました'],
  '友だちが私の荷物を持ってくれました。 てくれる yardımı alan konuşanın bakış açısını yansıtır.','友だちが私の荷物を持ってくれました。 てくれる reflects the benefited speaker’s viewpoint.','g-receiving-help','travel','friends'],
 [17,'Duydukların ve varsayımlar','Reports and possibilities','伝聞そう · たら · なくてもいい',
  'Duyduğun bilgiyi aktar; bir koşul altında ne olacağını söyle.','Report information you heard; describe a conditional situation.',
  'Duyum bildiren そうです, düz biçimdeki cümleye eklenir. İsim yargısındaki だ korunur: 雨だそうです. Bu, görünüş bildiren そう ile aynı yapıda değildir.','Hearsay そうです attaches to a plain-form statement. A noun predicate keeps だ: 雨だそうです. This differs from appearance そう.',
  '予報によると、週末は暖かいそうです。','よほうに よると、しゅうまつは あたたかい そうです。','Tahmine göre hafta sonu sıcak olacakmış.','According to the forecast, the weekend will be warm.',
  '天気予報によると、明日は雨［　］。','てんきよほうに よると、あしたは あめ［　］。','Hava tahminine göre yarın yağmurlu olacakmış. İsimden sonra duyum bildiren kibar sonu yaz.','According to the weather forecast, tomorrow will be rainy. Add the polite hearsay ending after the noun.',['だそうです'],
  '天気予報によると、明日は雨だそうです。 雨 isimdir; düz yargı 雨だ üzerine そうです eklenir.','天気予報によると、明日は雨だそうです。 雨 is a noun, so add そうです to plain 雨だ.','g-hearsay','time','daily'],
 [18,'Durum ve pişmanlık','States and regrets','自他動詞 · てしまう · ながら',
  'Bir eylemi oluşan durumdan ayır; istenmeyen bir sonuçtan söz et.','Distinguish an action from a resulting state; discuss an unwanted result.',
  '開く geçişsiz, 開ける geçişli fiildir. 窓が開いています, pencerenin açık durumda olduğunu söyler; birinin açma eylemini sürdürdüğünü söylemez.','開く is intransitive; 開ける is transitive. 窓が開いています describes the window being open, rather than someone continuing to open it.',
  'ドアが閉まっています。','ドアが しまって います。','Kapı kapalı.','The door is closed.',
  '窓が［　］います。','まどが［　］います。','Pencere açık durumda. 開く (あく) fiilinin て biçimini yaz.','The window is open. Type the て-form of 開く (あく).',['開いて','あいて'],
  '窓が開いています。 開く → 開いて; ている bu bağlamda oluşan durumu anlatır.','窓が開いています。 開く → 開いて; ている expresses the resulting state in this context.','g-nagara','objects','work'],
 [19,'Saygılı dil','Respectful language','尊敬語 · てくれてありがとう · はず',
  'Başkasının eylemini saygıyla anlat; teşekkür ve beklenti kur.','Speak respectfully about another person’s action; express gratitude and expectation.',
  '召し上がる, 食べる ve 飲む için saygılı bir fiildir. Başkasının eylemini yükseltir; kendi eylemini anlatmak için bu şekilde kullanılmaz.','召し上がる is an honorific verb for 食べる and 飲む. It elevates another person’s action and is not used this way for your own action.',
  '先生はお茶を召し上がります。','せんせいは おちゃを めしあがります。','Öğretmen çay içer. (Saygılı anlatım.)','The teacher drinks tea. (Respectful wording.)',
  '先生はもう昼ご飯を［　］。','せんせいは もう ひるごはんを［　］。','Öğretmen öğle yemeğini zaten yedi. 召し上がる fiilinin kibar olumlu geçmişini yaz.','The teacher has already eaten lunch. Type the polite affirmative past of 召し上がる.',['召し上がりました','めしあがりました'],
  '先生はもう昼ご飯を召し上がりました。 召し上がる → 召し上がりました.','先生はもう昼ご飯を召し上がりました。 召し上がる → 召し上がりました.','g-hazu','food','work'],
 [20,'Kendinden alçakgönüllü söz et','Modest self-expression','謙譲語 · かどうか · やすい',
  'Kendi eylemini uygun biçimde alçalt; cümle içine soru yerleştir.','Speak modestly about your own action; embed a question in a sentence.',
  'İsim söylerken ～と申します, ～といいます ifadesinin daha resmî ve alçakgönüllü karşılığıdır. Buradaki と, söylenen adı işaretler.','When introducing your name, ～と申します is a more formal and modest counterpart of ～といいます. と marks the name being stated.',
  '私はヤマダと申します。','わたしは ヤマダと もうします。','Ben Yamada. (Resmî tanışma.)','My name is Yamada. (Formal introduction.)',
  '私はサトウと［　］。','わたしは サトウと［　］。','Resmî tanışmada “Adım Sato” de. 申す fiilinin kibar olumlu şimdiki biçimini yaz.','Introduce yourself formally as Sato. Type the polite affirmative present form of 申す.',['申します','もうします'],
  '私はサトウと申します。 申す → 申します; adını resmî biçimde sunar.','私はサトウと申します。 申す → 申します is used to state your name formally.','g-ownership','software','work'],
 [21,'Etkilenilen olaylar','Events that affect you','受身 · てある · てほしい',
  'Edilgen bir olayı anlat; bir hazırlığın sonucunu tanı.','Describe a passive event; recognise the result of preparation.',
  'Godan 読む fiilinin edilgen biçimi 読まれる olur. Bu örnekte günlük sahibinin, başkasının okumasından etkilendiği anlatılır.','The passive of godan 読む is 読まれる. Here the diary’s owner is affected by another person reading it.',
  '私は妹に手紙を読まれました。','わたしは いもうとに てがみを よまれました。','Kız kardeşim mektubumu okudu. (Bundan etkilendim.)','My younger sister read my letter, affecting me.',
  '私は弟に日記を［　］。','わたしは おとうとに にっきを［　］。','Erkek kardeşim günlüğümü okudu; etkilenen kişi olarak anlat. 読む fiilinin kibar geçmiş edilgenini yaz.','My younger brother read my diary, affecting me. Type the polite past passive of 読む.',['読まれました','よまれました'],
  '私は弟に日記を読まれました。 読む → 読まれる → 読まれました.','私は弟に日記を読まれました。 読む → 読まれる → 読まれました.','g-receiving-help','family','daily'],
 [22,'Yaptırma ve koşul','Causing actions and conditions','使役 · ば · のに',
  'Bir eylemi yaptırmayı anlat; bir koşul kur.','Describe causing someone to act; form a condition.',
  'Ichidan 食べる fiilinin ettirgen biçimi 食べさせる olur. Bağlam, birini yedirmek/zorlamak ile yemesine izin vermek arasındaki anlamı belirler.','The causative of ichidan 食べる is 食べさせる. Context distinguishes making someone eat from allowing them to eat.',
  '先生は学生に作文を書かせました。','せんせいは がくせいに さくぶんを かかせました。','Öğretmen öğrencilere kompozisyon yazdırdı.','The teacher had the students write an essay.',
  '親は子どもに野菜を［　］。','おやは こどもに やさいを［　］。','Ebeveyn çocuğuna sebze yedirdi. 食べる fiilinin kibar geçmiş ettirgenini yaz.','The parent had the child eat vegetables. Type the polite past causative of 食べる.',['食べさせました','たべさせました'],
  '親は子どもに野菜を食べさせました。 食べる → 食べさせる → 食べさせました.','親は子どもに野菜を食べさせました。 食べる → 食べさせる → 食べさせました.','g-tara','family','daily'],
 [23,'Karar ve yeni alışkanlık','Decisions and new habits','使役受身 · ても · ことにする',
  'Kendi kararını belirt; istenmeden yapılan eylemleri tanı.','State your own decision; recognise actions done unwillingly.',
  'Sözlük biçimi + ことにする, kişinin kendi kararını anlatabilir. ことにしました, kararın verildiğini kibar geçmiş biçimde bildirir.','Dictionary form + ことにする can express a personal decision. ことにしました politely states that the decision has been made.',
  '来年、日本語の試験を受けることにしました。','らいねん、にほんごの しけんを うける ことに しました。','Gelecek yıl Japonca sınavına girmeye karar verdim.','I decided to take a Japanese exam next year.',
  '来月から毎日歩く［　］しました。','らいげつから まいにち あるく［　］しました。','Gelecek aydan itibaren her gün yürümeye karar verdim. Kendi kararını bildiren yapıyı tamamla.','I decided to walk every day starting next month. Complete the personal-decision pattern.',['ことに'],
  '来月から毎日歩くことにしました。 歩く + ことにしました kişinin kararını anlatır.','来月から毎日歩くことにしました。 歩く + ことにしました expresses the person’s decision.','g-even-if','time','daily']
];
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const genkiLessons=freeze(rows.map(([number,tr,en,focus,goalTr,goalEn,noteTr,noteEn,ja,kana,exampleTr,exampleEn,context,contextReading,promptTr,promptEn,answers,explainTr,explainEn,grammarId,wordTopic,scene])=>{
 const key=`l${String(number).padStart(2,'0')}`,id=`genki-${key}`;
 return {id,number,book:number<=12?1:2,theme:bi(tr,en),focus,goals:bi(goalTr,goalEn),explanation:bi(noteTr,noteEn),example:{ja,reading:kana,translation:bi(exampleTr,exampleEn)},tag:`genki-3-${key}`,related:{grammarId,wordTopic,scene},question:{id:`genki:${key}:mini`,itemId:id,version:GENKI_VERSION,sourceType:'genki',studyKind:'grammar',genkiLesson:number,skill:'writing',responseType:'typed',context,contextReading,prompt:bi(promptTr,promptEn),answers:{tr:answers,en:[...answers]},explanation:bi(explainTr,explainEn)}};
}));
export const defaultGenki=()=>({selectedLesson:1,book:'all',completedLessons:{},lastOpenedAt:null,session:null});
export function genkiConfig(saved={}){
 const selectedLesson=Number(saved?.selectedLesson),completedLessons={};
 for(const lesson of genkiLessons){const record=saved?.completedLessons?.[lesson.number],stamp=typeof record==='object'?record?.completedAt:record;if(typeof stamp==='string'&&Number.isFinite(Date.parse(stamp)))completedLessons[lesson.number]=new Date(stamp).toISOString();}
 return {...defaultGenki(),...saved,selectedLesson:Number.isInteger(selectedLesson)&&selectedLesson>=1&&selectedLesson<=23?selectedLesson:1,book:['all','1','2'].includes(String(saved?.book))?String(saved.book):'all',completedLessons};
}
export const getGenkiLesson=value=>genkiLessons.find(lesson=>lesson.number===Number(value)||lesson.id===value)||null;
export function getGenkiQuestion(id){const question=genkiLessons.find(lesson=>lesson.question.id===id)?.question;return question?structuredClone(question):null;}
export function createGenkiSession(lessonNumber,{id=crypto.randomUUID(),now=new Date(),showReading=false}={}){
 const lesson=getGenkiLesson(lessonNumber);if(!lesson)return null;
 const question=structuredClone(lesson.question);
 return {id,lessonNumber:lesson.number,ids:[question.id],questions:[question],index:0,phase:'exercise',feedback:null,eventIds:[],readingHintIds:showReading?[question.id]:[],pronunciationHintIds:[],showReading:!!showReading,startedAt:new Date(now).toISOString()};
}
export function genkiQuestion(session){
 if(!session||typeof session.id!=='string'||!session.id||session.phase!=='exercise'||session.index!==0||!Array.isArray(session.ids)||session.ids.length!==1||!Array.isArray(session.eventIds)||!Array.isArray(session.readingHintIds)||!Array.isArray(session.pronunciationHintIds))return null;
 const question=session.questions?.[0],original=getGenkiQuestion(session.ids[0]);
 if(!question||!original||question.id!==original.id||question.itemId!==original.itemId||question.skill!=='writing'||question.version!==GENKI_VERSION||session.lessonNumber!==original.genkiLesson||!['context','contextReading'].every(key=>typeof question[key]==='string'))return null;
 return ['tr','en'].every(lang=>typeof question.prompt?.[lang]==='string'&&typeof question.explanation?.[lang]==='string'&&Array.isArray(question.answers?.[lang])&&question.answers[lang].length&&question.answers[lang].every(answer=>typeof answer==='string'&&answer))?question:null;
}
export const genkiScope=session=>session?`genki:${session.id}:${session.index}`:'';
export function markGenkiLesson(state,lessonNumber,complete,{now=new Date()}={}){
 if(!getGenkiLesson(lessonNumber))return state;
 const next=structuredClone(state);next.genki=genkiConfig(next.genki);
 if(complete)next.genki.completedLessons[Number(lessonNumber)]=new Date(now).toISOString();else delete next.genki.completedLessons[Number(lessonNumber)];
 return next;
}
