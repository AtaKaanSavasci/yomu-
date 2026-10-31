import {getCharacterQuestion} from './characters.js';
import {getAnimeQuestion} from './anime.js';
import {getStudyQuestion} from './study-data.js';
// Original prototype content, generated for this project; not human-editor approved.
export const CONTENT_VERSION = '2026-10-30.1';
export const provenance = { author: 'AI-assisted original prototype content', humanReviewed: false, audio: null, version: CONTENT_VERSION };
const w = (id, written, reading, tr, en, trAlternatives = [], enAlternatives = []) => ({
  id, written, readingId: `${id}-reading`, senseId: `${id}-sense`,
  readings: [{ id: `${id}-reading`, kana: reading }],
  senses: [{ id: `${id}-sense`, tr, en, alternatives: { tr: [tr, ...trAlternatives], en: [en, ...enAlternatives] } }], source: provenance,
});
export const lexemes = [
  w('morning', '朝', 'あさ', 'sabah', 'morning'),
  w('cafe', '喫茶店', 'きっさてん', 'kafe', 'café', ['kahve dükkanı', 'kahve dükkânı'], ['cafe', 'coffee shop']),
  w('coffee', 'コーヒー', 'コーヒー', 'kahve', 'coffee'),
  w('drink', '飲みます', 'のみます', 'içmek', 'to drink', ['içerim', 'içer'], ['drink']),
  w('book', '本', 'ほん', 'kitap', 'book'),
  w('read', '読みます', 'よみます', 'okumak', 'to read', ['okurum', 'okur'], ['read']),
  w('library', '図書館', 'としょかん', 'kütüphane', 'library'),
  w('today', '今日', 'きょう', 'bugün', 'today'),
  w('friend', '友達', 'ともだち', 'arkadaş', 'friend'),
  w('japanese', '日本語', 'にほんご', 'Japonca', 'Japanese'),
  w('study', '勉強します', 'べんきょうします', 'ders çalışmak', 'to study', ['çalışmak', 'ders çalışırım'], ['study']),
  w('saturday', '土曜日', 'どようび', 'cumartesi', 'Saturday'),
  w('park', '公園', 'こうえん', 'park', 'park'),
  w('go', '行きます', 'いきます', 'gitmek', 'to go', ['giderim', 'gider'], ['go']),
  w('tea', 'お茶', 'おちゃ', 'çay', 'tea'),
];
export const wordById = Object.fromEntries(lexemes.map(x => [x.id, x]));
export const grammarPoints = [
  { id: 'de', form: '場所 + で', title: { tr: 'Bir eylemin gerçekleştiği yer', en: 'Where an action happens' }, explanation: { tr: 'で, eylemin gerçekleştiği yeri gösterir. 喫茶店で読みます: Kafede okurum. Burada で, “-de / -da” anlamındadır.', en: 'で marks where an action takes place. 喫茶店で読みます means “I read at the café.”' } },
  { id: 'to', form: '人 + と', title: { tr: 'Birisiyle birlikte', en: 'Together with someone' }, explanation: { tr: 'と, bu bağlamda eylemi kiminle yaptığını gösterir. 友達と勉強します: Bir arkadaşımla ders çalışırım.', en: 'In this context, と marks a companion. 友達と勉強します means “I study with a friend.”' } },
  { id: 'ni', form: '行き先 + に', title: { tr: 'Gidilen yer', en: 'A destination' }, explanation: { tr: 'に, 行きます ile gidilen yeri gösterir. 公園に行きます: Parka giderim. Bu cümlede へ de geçerli bir yön bildirme alternatifidir.', en: 'With 行きます, に marks the destination. 公園に行きます means “I go to the park.” Here へ is also a valid direction marker.' } },
];
const s = (id, tokens, tr, en) => ({ id, tokens, translation: { tr, en }, version: CONTENT_VERSION });
export const lessons = [
  { id: 'cafe-morning', number: '01', title: { tr: 'Bir sabah, bir kahve', en: 'A morning, a coffee' }, subtitle: { tr: 'Küçük bir kafede güne başla.', en: 'Start the day in a little café.' }, japaneseTitle: '朝の喫茶店', theme: 'cafe', minutes: 5, grammarId: 'de', words: ['morning', 'cafe', 'coffee', 'drink', 'book', 'read'], sentences: [
    s('c1', ['morning', '、', 'cafe', 'で', 'coffee', 'を', 'drink', '。'], 'Sabah, kafede kahve içerim.', 'In the morning, I drink coffee at a café.'),
    s('c2', ['cafe', 'で', 'book', 'を', 'read', '。'], 'Kafede kitap okurum.', 'I read a book at the café.'),
  ], takeaway: { tr: 'Bir eylemin nerede yapıldığını söyle.', en: 'Say where an action takes place.' } },
  { id: 'library-friend', number: '02', title: { tr: 'Kütüphanede buluşalım', en: 'Meet me at the library' }, subtitle: { tr: 'Bir arkadaşla çalışmak daha güzel.', en: 'A little study time with a friend.' }, japaneseTitle: '図書館で', theme: 'library', minutes: 5, grammarId: 'to', words: ['today', 'library', 'friend', 'japanese', 'study'], sentences: [
    s('l1', ['today', '、', 'library', 'に', 'go', '。'], 'Bugün kütüphaneye giderim.', 'Today, I go to the library.'),
    s('l2', ['friend', 'と', 'japanese', 'を', 'study', '。'], 'Bir arkadaşımla Japonca çalışırım.', 'I study Japanese with a friend.'),
  ], takeaway: { tr: 'Birlikte yaptığın bir şeyi anlat.', en: 'Describe something you do together.' } },
  { id: 'weekend-park', number: '03', title: { tr: 'Hafta sonu, biraz yavaşla', en: 'A slower kind of weekend' }, subtitle: { tr: 'Park, bir kitap ve biraz çay.', en: 'A park, a book, and some tea.' }, japaneseTitle: '土曜日の公園', theme: 'park', minutes: 5, grammarId: 'ni', words: ['saturday', 'park', 'go', 'tea', 'book', 'read'], sentences: [
    s('p1', ['saturday', 'に', 'park', 'に', 'go', '。'], 'Cumartesi günü parka giderim.', 'On Saturday, I go to the park.'),
    s('p2', ['park', 'で', 'tea', 'を', 'drink', '。'], 'Parkta çay içerim.', 'I drink tea in the park.'),
    s('p3', ['book', 'も', 'read', '。'], 'Kitap da okurum.', 'I also read a book.'),
  ], takeaway: { tr: 'Nereye gittiğini söyle.', en: 'Say where you are going.' } },
];
const q = (id, lessonId, itemId, skill, prompt, context, answers, explanation, choices) => ({ id, lessonId, itemId, skill, prompt, context, answers, explanation, choices, version: CONTENT_VERSION });
export const questions = [
  q('c-meaning', 'cafe-morning', 'coffee', 'meaning', { tr: 'コーヒー bu metinde ne anlama geliyor?', en: 'What does コーヒー mean in this text?' }, '喫茶店でコーヒーを飲みます。', { tr: ['kahve'], en: ['coffee'] }, { tr: 'コーヒー, “kahve” demektir. を, içilen şeyi işaretler.', en: 'コーヒー means “coffee”. を marks what is being drunk.' }, { tr: ['Çay', 'Kahve', 'Su'], en: ['Tea', 'Coffee', 'Water'] }),
  q('c-reading', 'cafe-morning', 'book', 'reading', { tr: '本 nasıl okunur? Hiragana ile yaz.', en: 'How do you read 本? Type in hiragana.' }, '本を読みます。', { tr: ['ほん'], en: ['ほん'] }, { tr: 'Bu cümlede 本, ほん (kitap) diye okunur.', en: 'Here, 本 is read ほん and means “book”.' }),
  q('c-writing', 'cafe-morning', 'de', 'writing', { tr: 'Yeni bağlam: “Parkta kitap okurum.” Boşluğa uygun parçacığı yaz.', en: 'New context: “I read a book in the park.” Fill in the particle.' }, '公園［　］本を読みます。', { tr: ['で'], en: ['で'] }, { tr: 'で, okuma eyleminin nerede yapıldığını gösterir. に burada eylemin gerçekleştiği yeri işaretlemez.', en: 'で marks where reading takes place. に does not mark the location of this action.' }),
  q('l-meaning', 'library-friend', 'friend', 'meaning', { tr: '友達 bu cümlede kimdir?', en: 'Who is 友達 in this sentence?' }, '友達と日本語を勉強します。', { tr: ['arkadaş', 'bir arkadaş', 'arkadaşım'], en: ['friend', 'a friend', 'my friend'] }, { tr: '友達, “arkadaş” demektir. と, birlikte çalışılan kişiyi gösterir.', en: '友達 means “friend”. と marks the person you study with.' }, { tr: ['Öğretmen', 'Arkadaş', 'Öğrenci'], en: ['Teacher', 'Friend', 'Student'] }),
  q('l-reading', 'library-friend', 'today', 'reading', { tr: '今日 nasıl okunur? Hiragana ile yaz.', en: 'How do you read 今日? Type in hiragana.' }, '今日、図書館に行きます。', { tr: ['きょう'], en: ['きょう'] }, { tr: '“Bugün” anlamındaki 今日 bu bağlamda きょう diye okunur.', en: '今日, meaning “today”, is read きょう here.' }),
  q('l-writing', 'library-friend', 'to', 'writing', { tr: 'Yeni bağlam: “Bir arkadaşımla çay içerim.” Parçacığı tamamla.', en: 'New context: “I drink tea with a friend.” Fill in the particle.' }, '友達［　］お茶を飲みます。', { tr: ['と'], en: ['と'] }, { tr: 'と, bu cümlede “ile / birlikte” anlamındadır.', en: 'Here, と means “with / together with”.' }),
  q('p-meaning', 'weekend-park', 'tea', 'meaning', { tr: 'お茶 bu metinde ne demektir?', en: 'What does お茶 mean in this text?' }, '公園でお茶を飲みます。', { tr: ['çay'], en: ['tea'] }, { tr: 'お茶, “çay” demektir. お burada kibar bir önektir.', en: 'お茶 means “tea”. お is a polite prefix here.' }, { tr: ['Kahve', 'Çay', 'Kitap'], en: ['Coffee', 'Tea', 'Book'] }),
  q('p-reading', 'weekend-park', 'park', 'reading', { tr: '公園 nasıl okunur? Hiragana ile yaz.', en: 'How do you read 公園? Type in hiragana.' }, '公園に行きます。', { tr: ['こうえん'], en: ['こうえん'] }, { tr: '公園, こうえん diye okunur ve “park” demektir.', en: '公園 is read こうえん and means “park”.' }),
  q('p-writing', 'weekend-park', 'ni', 'writing', { tr: 'Yeni bağlam: “Kütüphaneye giderim.” Yön parçacığını yaz.', en: 'New context: “I go to the library.” Fill in a destination particle.' }, '図書館［　］行きます。', { tr: ['に', 'へ'], en: ['に', 'へ'] }, { tr: 'に varış yerini, へ yönü vurgular. Bu cümlede ikisi de kabul edilir.', en: 'に emphasizes the destination; へ emphasizes the direction. Both work in this sentence.' }),
];
export function getQuestion(id) {
  const study=getStudyQuestion(id);if(study)return study;
  const extra=getCharacterQuestion(id)||getAnimeQuestion(id);if(extra)return extra;
  const existing = questions.find(q => q.id === id);
  if (existing) {const w=wordById[existing.itemId];return w?{...existing,word:{written:w.written,reading:w.readings[0].kana}}:existing;}
  const match = /^lex-(meaning|reading)-(.+)$/.exec(id);
  if (!match || !wordById[match[2]]) return null;
  const word = wordById[match[2]], sense = word.senses[0], skill = match[1];
  return { id, itemId: word.id, skill, version: CONTENT_VERSION, context: word.written, word:{written:word.written,reading:word.readings[0].kana},
    prompt: skill === 'meaning' ? { tr: 'Bu kelimenin anlamını yaz.', en: 'Type the meaning of this word.' } : { tr: 'Okunuşunu kana ile yaz.', en: 'Type the reading in kana.' },
    answers: skill === 'meaning' ? sense.alternatives : { tr: word.id === 'coffee' ? ['コーヒー', 'こーひー'] : [word.readings[0].kana], en: word.id === 'coffee' ? ['コーヒー', 'こーひー'] : [word.readings[0].kana] },
    explanation: { tr: `${word.written} → ${word.readings[0].kana} · ${sense.tr}`, en: `${word.written} → ${word.readings[0].kana} · ${sense.en}` },
  };
}
