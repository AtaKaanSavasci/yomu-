export const ANIME_VERSION='anime-2026-10-30.1';
// Short excerpts only. Translations/notes are original study aids, not official subtitles.
export const animeQuotes=[
 {id:'vinland-enemies',series:'Vinland Saga',speaker:'Thorfinn',level:'beginner',theme:'vinland',
  text:'俺に敵なんかいない。',reading:'おれに てきなんか いない。',
  translation:{tr:'Benim hiç düşmanım yok.',en:'I have no enemies.'},
  note:{tr:'俺 samimi ve erkeksi bir “ben”; resmî konuşmada kullanmak yerine 私 tercih edilebilir. いない, canlı bir varlığın yokluğunu anlatır.',en:'俺 is a casual, masculine “I”; 私 can be more suitable in formal situations. いない expresses the absence of an animate being.'},
  source:'https://www.youtube.com/watch?v=h8-MxeYYwJE',publisher:'Netflix Anime',videoId:'h8-MxeYYwJE',clipStart:81,clipEnd:91,cue:{start:83,end:89,verified:true},captions:'cc',
  question:{prompt:{tr:'Replikteki 敵 ne demektir?',en:'What does 敵 mean in this line?'},context:'俺に［敵］なんかいない。',answers:{tr:['düşman'],en:['enemy']},choices:{tr:['Arkadaş','Düşman','Öğretmen'],en:['Friend','Enemy','Teacher']},skill:'meaning',explanation:{tr:'敵 (てき) “düşman” demektir. いない ile birlikte düşmanın bulunmadığını anlatır.',en:'敵 (てき) means “enemy”. With いない, the sentence says there is no enemy.'}}},
 {id:'naruto-nindo',series:'Naruto',speaker:'Naruto Uzumaki',level:'intermediate',theme:'naruto',
  text:'まっすぐ自分の言葉は曲げねェ。',reading:'まっすぐ じぶんの ことばは まげねえ。',
  translation:{tr:'Ben sözümden dönmem.',en:'I never go back on my word.'},
  note:{tr:'曲げねェ, 曲げない biçiminin sert ve samimi bir söylenişidir. Anime üslubudur; resmî konuşma modeli değildir.',en:'曲げねェ is a rough, casual form of 曲げない. It is character speech, not a model for formal conversation.'},
  source:'https://naruto-official.com/news/01_1296',publisher:'VIZ',videoId:'NKoGCBZ1izY',clipStart:0,clipEnd:null,cue:null,captions:'publisher',
  question:{prompt:{tr:'言葉 kelimesinin bu bağlamdaki okunuşunu hiragana ile yaz.',en:'Type the reading of 言葉 in hiragana.'},context:'まっすぐ自分の［言葉］は曲げねェ。',answers:{tr:['ことば'],en:['ことば']},skill:'reading',explanation:{tr:'言葉 → ことば, “söz / kelime”. “Sözünden dönmemek” bu bağlamın çalışma çevirisidir.',en:'言葉 → ことば, “word / words”. “Never go back on my word” is the contextual meaning.'}}},
 {id:'bleach-bankai',series:'Bleach',speaker:'Çeşitli karakterler / Various characters',level:'beginner',theme:'bleach',
  text:'卍解',reading:'ばんかい',translation:{tr:'Bankai · nihai açığa çıkarma',en:'Bankai · final release'},
  note:{tr:'Bu kısa ifade seriye özgü bir terimdir; gündelik bir Japonca kelime gibi genellenmemeli. 卍解, “bankai” diye okunur.',en:'This short declaration is a series-specific term, not an everyday expression. 卍解 is read “bankai”.'},
  source:'https://www.youtube.com/watch?v=_uw291z2CUQ',publisher:'VIZ',videoId:'_uw291z2CUQ',clipStart:0,clipEnd:null,cue:null,captions:'publisher',
  question:{prompt:{tr:'卍解 nasıl okunur? Kana veya romaji ile yaz.',en:'How is 卍解 read? Use kana or romaji.'},context:'卍解',answers:{tr:['ばんかい','bankai'],en:['ばんかい','bankai']},normalization:'romaji',skill:'reading',explanation:{tr:'卍解 → ばんかい / bankai. Bu kart yalnızca bu kurgu teriminin okunuşunu ölçer.',en:'卍解 → ばんかい / bankai. This card only tests the reading of this fictional term.'}}},
 {id:'jjk-showoff',series:'Jujutsu Kaisen',speaker:'Satoru Gojo',level:'advanced',theme:'jjk',
  text:'カッコつけさせてもらうよ。',reading:'かっこつけさせてもらうよ。',
  translation:{tr:'Biraz gösteriş yapmama izin ver.',en:'Let me show off a little.'},
  note:{tr:'カッコつける, “havalı görünmeye çalışmak / gösteriş yapmak”. 〜させてもらう, bir şeyi yapmaya izin verilmesi çerçevesini taşır. Burada samimi bir karakter üslubu var.',en:'カッコつける means to look cool or show off. 〜させてもらう frames an action as something one is allowed to do. This is casual character speech.'},
  source:'https://www.youtube.com/watch?v=NyPf5ipLFkU',publisher:'Crunchyroll',videoId:'NyPf5ipLFkU',clipStart:0,clipEnd:null,cue:null,captions:'publisher',
  question:{prompt:{tr:'Repliği tamamla. “Yapmama izin ver” yapısının eksik kısmını kana ile yaz.',en:'Complete the line. Type the missing kana for “let me do it”.'},context:'カッコつけ［　］もらうよ。',answers:{tr:['させて'],en:['させて']},skill:'writing',explanation:{tr:'させて + もらう: bir şeyi yapmaya izin verilmesi. Bu, dar kapsamlı yazılı tamamlama alıştırmasıdır; serbest üretim veya dinleme testi değildir.',en:'させて + もらう frames receiving permission to do something. This is constrained written completion, not a free-production or listening test.'}}}
];
export function getAnimeQuestion(id,custom=[]) {
 if(!id.startsWith('anime:'))return null;
 const quote=[...animeQuotes,...custom].find(q=>q.id===id.slice(6));if(!quote)return null;
 return {...quote.question,id,itemId:`anime-${quote.id}`,version:quote.version || ANIME_VERSION,responseType:quote.question.choices?'choice':'typed'};
}
export function safeVideoId(value) {
 try {const url=new URL(value);if(url.protocol!=='https:')return null;
  const id=url.hostname==='youtu.be'?url.pathname.slice(1):['www.youtube.com','youtube.com'].includes(url.hostname)?url.searchParams.get('v'):null;
  return /^[A-Za-z0-9_-]{11}$/.test(id || '')?id:null;
 } catch{return null;}
}
export function createCustomQuote(data,id) {
 const text=String(data.text || '').trim(),target=String(data.target || '').trim();
 if(!text || !target || !text.includes(target) || text.length>200 || target.length>60)throw new Error('INVALID_QUOTE');
 const url=String(data.source || '').trim();
 if(url && !safeVideoId(url)) throw new Error('INVALID_VIDEO');
 return {id:`custom-${id}`,series:String(data.series || '').trim().slice(0,80)||'Kişisel / Personal',speaker:'Kişisel kaynak / Personal source',level:data.level || 'intermediate',theme:'custom',text,reading:String(data.reading || '').trim().slice(0,300),translation:{tr:String(data.tr || '').trim().slice(0,500),en:String(data.en || '').trim().slice(0,500)},note:{tr:'Kullanıcının eklediği içerik. Kaynak ve cevap anahtarı bağımsız doğrulanmadı.',en:'User-added content. Source and answer key have not been independently verified.'},source:url || null,publisher:'Personal',videoId:safeVideoId(url),clipStart:0,clipEnd:null,cue:null,version:ANIME_VERSION,question:{skill:'writing',prompt:{tr:'Kendi repliğindeki boşluğu tamamla.',en:'Complete the gap in your own line.'},context:text.replace(target,'［　］'),answers:{tr:[target],en:[target]},explanation:{tr:`Kaydettiğin cevap: ${target}.`,en:`Your saved answer: ${target}.`}}};
}
