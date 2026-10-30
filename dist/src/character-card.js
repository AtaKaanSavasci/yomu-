export function characterNotice(session,{T,L,esc}) {
 const result=session?.lastResult;if(!result)return '';
 return `<div class="character-result ${result.kind}" role="status"><strong>${result.kind==='revealed'?T('Cevap gösterildi','Answer revealed'):T('Doğru','Correct')}</strong><span><span lang="ja">${esc(result.context)}</span> → ${esc(L(result.answers).join(' / '))}</span>${result.kind==='revealed'?`<small>${T('Doğru cevap sayılmaz; tekrar için kaydedildi.','Not counted as correct; saved for review.')}</small>`:''}</div>`;
}
export function characterAnswerCard(question,{T,L,esc,icon},{draft='',wrongForCurrent=false,sessionId=''}={}) {
 const choices=question.choices;
 return `<section class="exercise-card lab-question live-character-card">
 <div class="section-top"><span class="level-pill">${question.skill==='reading'?T('Okunuş','Reading'):T('Yazılı cevap','Written answer')}</span><button class="report-link" data-action="report" data-question-id="${esc(question.id)}">${icon('flag')}${T('Sorun bildir','Report an issue')}</button></div>
 <h2 id="lab-answer-prompt">${esc(L(question.prompt))}</h2>
 <div class="lab-glyph ${question.character?.script==='kanji'?'kanji-word':''}" lang="ja">${esc(question.context)}</div>
 ${question.character?.script==='kanji' && question.responseType!=='writing'?`<p class="glyph-context">${T('Odak kanji','Focus kanji')}: <span lang="ja">${question.character.glyph}</span> · ${esc(L(question.character.meaning))}</p>`:''}
 <form data-form="lab-answer" data-question-id="${esc(question.id)}" data-session-id="${esc(sessionId)}" aria-labelledby="lab-answer-prompt" novalidate>
 ${choices?`<fieldset class="choices lab-choices"><legend class="sr-only">${T('Cevabın','Your answer')}</legend>${L(choices).map(v=>`<label class="choice"><input type="radio" name="answer" value="${esc(v)}"><span>${esc(v)}</span></label>`).join('')}</fieldset>`:`<label class="answer-label" for="lab-answer-input">${T('Cevabın','Your answer')}</label><input id="lab-answer-input" class="answer-input" name="answer" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" maxlength="200" aria-describedby="lab-live-status lab-flow-help" aria-invalid="${wrongForCurrent}" value="${esc(draft)}" placeholder="${question.normalization==='romaji'?T('Okunuşu yaz…','Type the reading…'):T('Japonca yaz…','Type in Japanese…')}">`}
 <p id="lab-live-status" class="character-live-status ${wrongForCurrent?'incorrect':''}" role="status" aria-live="polite">${wrongForCurrent?T('Yanlış. Aynı harfte tekrar dene.','Incorrect. Try this character again.'):''}</p>
 <p id="lab-flow-help" class="small muted character-flow-help">${T('Doğru cevapta otomatik geçer. Yanlışta aynı harfte kalır. Boş Enter: cevabı göster ve geç.','Correct answers advance automatically. Mistakes stay on this character. Empty Enter: reveal and move on.')}</p>
 <button class="btn secondary full-width" type="submit">${T('Boşken cevabı göster →','Reveal when empty →')}</button>
 </form></section>`;
}
