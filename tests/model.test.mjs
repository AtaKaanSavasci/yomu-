import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, lexemes, questions, getQuestion, wordById, grammarPoints } from '../dist/src/content.js';
import { freshState, dayKey, recentDayKeys, normalizeAnswer, gradeAnswer, recordAnswer, schedule, addWord, dueStates, suspendItem, skillSummary } from '../dist/src/model.js';
const now = new Date('2026-10-30T20:59:00Z');
test('content references, accepted variants, identities and both languages are complete', () => {
  assert.equal(lessons.length, 3); assert.equal(questions.length, 9); assert.equal(lexemes.length, 15);
  assert.equal(new Set(questions.map(q => q.id)).size, 9);
  for (const lesson of lessons) {
    assert.ok(grammarPoints.some(g => g.id === lesson.grammarId));
    for (const word of lesson.words) assert.ok(wordById[word]);
    assert.equal(questions.filter(q => q.lessonId === lesson.id).length, 3);
    for (const sentence of lesson.sentences) for (const token of sentence.tokens) {
      // Latin identifiers are vocabulary refs; Japanese strings are literal text.
      if (/^[a-z-]+$/.test(token)) assert.ok(wordById[token]);
    }
  }
  for (const question of questions) for (const lang of ['tr','en']) {
    assert.ok(question.prompt[lang]); assert.ok(question.explanation[lang]);
    assert.ok(question.answers[lang].every(a => gradeAnswer(question, a, lang)));
    if (question.choices) assert.equal(question.choices[lang].filter(a => gradeAnswer(question, a, lang)).length, 1);
  }
});
test('normalization preserves kana and applies Turkish casing, width and punctuation', () => {
  assert.equal(normalizeAnswer('  KAHVE！ ', 'tr'), 'kahve');
  assert.equal(normalizeAnswer('JAPONCA', 'tr'), 'japonca');
  assert.equal(normalizeAnswer('ｺｰﾋｰ。', 'en'), 'コーヒー');
  assert.ok(gradeAnswer(getQuestion('lex-meaning-japanese'), 'JAPONCA', 'tr'));
  assert.equal(gradeAnswer(getQuestion('c-reading'), 'hon', 'tr'), false);
});
test('direction question accepts both に and へ but not an action-location particle', () => {
  const q = getQuestion('p-writing');
  assert.ok(gradeAnswer(q, 'に', 'tr')); assert.ok(gradeAnswer(q, 'へ', 'en'));
  assert.equal(gradeAnswer(q, 'で', 'tr'), false);
});
test('language-specific word synonyms are accepted', () => {
  assert.ok(gradeAnswer(getQuestion('lex-meaning-cafe'), 'coffee shop', 'en'));
  assert.ok(gradeAnswer(getQuestion('lex-meaning-cafe'), 'kahve dükkânı', 'tr'));
  assert.ok(gradeAnswer(getQuestion('lex-reading-coffee'), 'こーひー', 'tr'));
  assert.equal(gradeAnswer(getQuestion('lex-meaning-cafe'), 'book', 'en'), false);
});
test('fixed schedule intervals and lapse reset are explicit', () => {
  let previous;
  for (const days of [1,3,7,14,30,30]) {
    const result = schedule(previous, true, now);
    assert.equal(new Date(result.dueAt)-now, days*86400000); previous = result;
  }
  const lapse = schedule(previous, false, now);
  assert.equal(new Date(lapse.dueAt)-now, 600000); assert.equal(lapse.step, -1);
  assert.equal(new Date(schedule(lapse, true, now).dueAt)-now, 86400000);
});
test('answer event has durable identity, content/algorithm version and an unaltered input', () => {
  const state = freshState(); state.settings.timezone = 'Europe/Istanbul';
  const next = recordAnswer(state, getQuestion('c-meaning'), 'KAHVE', now, 'event-1', 1220);
  assert.equal(state.events.length, 0); assert.equal(next.events.length, 1);
  assert.equal(next.events[0].answer, 'KAHVE'); assert.ok(next.events[0].correct);
  assert.equal(next.events[0].day, '2026-10-30'); assert.equal(next.events[0].elapsedMs, 1220);
  assert.ok(next.events[0].algorithmVersion); assert.ok(next.events[0].contentVersion);
  assert.equal(recordAnswer(next, getQuestion('c-meaning'), 'Çay', now, 'event-1'), next);
});
test('meaning, reading and written completion stay independent; listening remains unassessed', () => {
  const state = recordAnswer(freshState(), getQuestion('c-reading'), 'ほん', now, 'read');
  assert.ok(state.skillStates['book:reading']); assert.equal(state.skillStates['book:meaning'], undefined);
  assert.deepEqual(skillSummary(state, 'reading'), { attempts: 1, correct: 1 });
  assert.deepEqual(skillSummary(state, 'listening'), { attempts: 0, correct: 0 });
  assert.deepEqual(skillSummary(state, 'writing'), { attempts: 0, correct: 0 });
});
test('saved words create two due cards with no fabricated answer or mastery', () => {
  const state = addWord(freshState(), 'book', now);
  assert.equal(state.events.length, 0); assert.equal(dueStates(state, now).length, 2);
  assert.equal(state.skillStates['book:reading'].attempts, 0);
  assert.deepEqual(addWord(state, 'book', new Date(now.getTime()+5000)), state);
});
test('due queue includes exact boundary, excludes future and suspended cards', () => {
  const state = addWord(freshState(), 'book', now);
  assert.equal(dueStates(state, new Date(now.getTime()-1)).length, 0);
  const suspended = suspendItem(state, 'book', 'meaning');
  assert.equal(dueStates(suspended, now).length, 1); assert.equal(dueStates(state, now).length, 2);
  assert.equal(suspended.events.length, 0);
});
test('incorrect answer is persisted and returns after ten minutes, not immediately', () => {
  const state = recordAnswer(freshState(), getQuestion('c-reading'), 'もと', now, 'wrong');
  assert.equal(state.events[0].correct, false); assert.equal(dueStates(state, now).length, 0);
  assert.equal(dueStates(state, new Date(now.getTime()+600000)).length, 1);
});
test('day boundary follows selected zone and survives subsequent preference changes', () => {
  assert.equal(dayKey('2026-10-30T21:00:00Z', 'Europe/Istanbul'), '2026-10-31');
  assert.equal(dayKey('2026-10-30T21:00:00Z', 'America/Los_Angeles'), '2026-10-30');
  assert.equal(dayKey('2026-03-08T09:59:00Z', 'America/Los_Angeles'), '2026-03-08');
  assert.equal(dayKey('2026-03-08T10:01:00Z', 'America/Los_Angeles'), '2026-03-08');
  const initial = freshState(); initial.settings.timezone = 'Asia/Tokyo';
  const state = recordAnswer(initial, getQuestion('c-reading'), 'ほん', now, 'tz');
  state.settings.timezone = 'America/Los_Angeles';
  assert.equal(state.events[0].day, '2026-10-31'); assert.equal(state.events[0].timezone, 'Asia/Tokyo');
});
test('all stored-word questions resolve with language-specific meanings and kana readings', () => {
  for (const word of lexemes) for (const skill of ['meaning','reading']) {
    const q = getQuestion(`lex-${skill}-${word.id}`); assert.ok(q);
    for (const lang of ['tr','en']) assert.ok(q.answers[lang].length);
  }
  assert.equal(getQuestion('lex-reading-not-a-word'), null);
});
test('seven-day chart has unique consecutive calendar days around DST transitions', () => {
  const dates = recentDayKeys('2026-11-02T07:30:00Z', 'America/Los_Angeles');
  assert.equal(new Set(dates).size, 7);
  assert.deepEqual(dates.slice(-3), ['2026-10-30','2026-10-31','2026-11-01']);
});
