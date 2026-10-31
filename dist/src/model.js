import { CONTENT_VERSION } from './content.js';
import { defaultPractice } from './characters.js';
import { defaultLearning } from './study-data.js';
import {defaultReminder} from './reminders.js';
export const SCHEMA_VERSION = 3;
export const ALGORITHM_VERSION = 'fixed-interval-v1';
export const SKILLS = ['meaning', 'reading', 'listening', 'writing'];
export function freshState() {
  return { schemaVersion: SCHEMA_VERSION, contentVersion: CONTENT_VERSION, revision: 0,
    settings: { language: 'tr', goal: 'reading', level: 'kana', dailyMinutes: 10, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, largeText: false, questionReadings:false, furigana: true, explanations: true, translation: false, onboarded: false },
    events: [], skillStates: {}, lessons: {}, issues: [], session: null,
    reminder:defaultReminder(), learning:defaultLearning(), practice: defaultPractice(), anime: {level:'all',series:'all',activeId:'vinland-enemies',practice:null,customQuotes:[]} };
}
export function hydrateState(saved) {
  if (!saved) return freshState();
  if (saved.schemaVersion > SCHEMA_VERSION) throw new Error('Newer schema is not supported');
  const defaults=freshState();
  const learning={...defaults.learning,...saved.learning};
  for(const kind of ['vocabulary','sentences','grammar'])learning[kind]={...defaults.learning[kind],...saved.learning?.[kind]};
  return {...defaults,...saved,schemaVersion:SCHEMA_VERSION,settings:{...defaults.settings,...saved.settings},practice:{...defaults.practice,...saved.practice},anime:{...defaults.anime,...saved.anime},reminder:{...defaults.reminder,...saved.reminder},learning};
}
export function dayKey(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(date));
  const get = type => parts.find(p => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function recentDayKeys(now, timeZone, count = 7) {
  const today = dayKey(now, timeZone);
  const calendarNoon = new Date(`${today}T12:00:00Z`).getTime();
  return Array.from({ length: count }, (_, i) => new Date(calendarNoon - (count - 1 - i) * 86400000).toISOString().slice(0, 10));
}
export function normalizeAnswer(value, language) {
  // Kana/kanji are never romanized; only width, case, whitespace and terminal punctuation normalize.
  return String(value).normalize('NFKC').trim().replace(/[。.!！?？]+$/u, '').trim().replace(/\s+/gu, ' ').toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US');
}
export function normalizeQuestionAnswer(question, value, language) {
  const locale=question.normalization==='romaji'?'en':language;
  return normalizeAnswer(question.normalization==='romaji'?String(value).toLowerCase().replace(/[ōūāīē]/g,c=>({ō:'ou',ū:'uu',ā:'aa',ī:'ii',ē:'ee'}[c])):value,locale);
}
export function gradeAnswer(question, value, language) {
  const normalized = normalizeQuestionAnswer(question,value,language);
  return question.answers[language].some(answer => normalizeQuestionAnswer(question,answer,language) === normalized);
}
export const stateKey = (itemId, skill) => `${itemId}:${skill}`;
export function schedule(previous, correct, now) {
  const step = correct ? Math.min((previous?.step ?? -1) + 1, 4) : -1;
  const minutes = correct ? [1440, 4320, 10080, 20160, 43200][step] : 10;
  return { step, dueAt: new Date(new Date(now).getTime() + minutes * 60000).toISOString() };
}
export function recordAnswer(state, question, answer, now = new Date(), id = crypto.randomUUID(), elapsedMs = 0, mode = 'lesson') {
  if (state.events.some(e => e.id === id)) return state;
  const next = structuredClone(state), key = stateKey(question.itemId, question.skill), prev = state.skillStates[key];
  const correct = gradeAnswer(question, answer, state.settings.language);
  const result = schedule(prev, correct, now);
  next.events.push({ id, questionId: question.id, itemId: question.itemId, skill: question.skill, answer, correct, language: state.settings.language,
    answeredAt: new Date(now).toISOString(), day: dayKey(now, state.settings.timezone), timezone: state.settings.timezone,
    contentVersion: question.version, algorithmVersion: ALGORITHM_VERSION, elapsedMs, mode, responseType:question.responseType || (question.choices?'choice':'typed') });
  next.skillStates[key] = { ...prev, ...result, itemId: question.itemId, skill: question.skill, questionId: question.id, attempts: (prev?.attempts || 0) + 1,
    correct: (prev?.correct || 0) + Number(correct), lastAnsweredAt: new Date(now).toISOString(), suspended: false, source: 'answer' };
  return next;
}
export function dueStates(state, now = new Date()) {
  return Object.values(state.skillStates).filter(s => !s.suspended && new Date(s.dueAt) <= now).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}
export function addWord(state, wordId, now = new Date()) {
  const next = structuredClone(state);
  for (const skill of ['meaning', 'reading']) {
    const key = stateKey(wordId, skill);
    if (!next.skillStates[key]) next.skillStates[key] = { itemId: wordId, skill, questionId: `lex-${skill}-${wordId}`, dueAt: now.toISOString(), step: -1, attempts: 0, correct: 0, suspended: false, source: 'saved-word' };
  }
  return next;
}
export function suspendItem(state, itemId, skill) {
  const next = structuredClone(state), key = stateKey(itemId, skill);
  if (next.skillStates[key]) next.skillStates[key].suspended = true;
  return next;
}
export function skillSummary(state, skill) {
  const events = state.events.filter(e => e.skill === skill);
  return { attempts: events.length, correct: events.filter(e => e.correct).length };
}
