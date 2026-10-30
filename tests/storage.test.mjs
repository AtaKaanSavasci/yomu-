import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { openStore, saveState, ConflictError } from '../dist/src/storage.js';
import { recordAnswer } from '../dist/src/model.js';
import { getQuestion } from '../dist/src/content.js';

test('IndexedDB saves a complete answer and session atomically and survives reopening', async () => {
  const initial = await openStore();
  const next = recordAnswer(initial, getQuestion('c-reading'), 'ほん', new Date(), 'storage-event');
  next.session = { mode: 'lesson', lessonId: 'cafe-morning', phase: 'exercise', index: 1, feedback: 'storage-event', eventIds: ['storage-event'] };
  const saved = await saveState(next);
  assert.equal(saved.revision, 1);
  const loaded = await openStore();
  assert.deepEqual(loaded, saved);
  assert.equal(loaded.events[0].id, loaded.session.feedback);
  assert.equal(loaded.skillStates['book:reading'].attempts, 1);
});
test('a stale tab cannot overwrite an answer saved by another tab', async () => {
  const stale = await openStore();
  const changed = structuredClone(stale); changed.settings.language = 'en';
  const saved = await saveState(changed);
  const attempted = structuredClone(stale); attempted.events = [];
  await assert.rejects(saveState(attempted), ConflictError);
  const loaded = await openStore();
  assert.deepEqual(loaded, saved); assert.equal(loaded.events.length, 1);
});
test('simultaneous writes from the same revision have exactly one winner', async () => {
  const initial = await openStore();
  const a = structuredClone(initial), b = structuredClone(initial);
  a.settings.dailyMinutes = 5; b.settings.dailyMinutes = 15;
  const results = await Promise.allSettled([saveState(a), saveState(b)]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter(r => r.status === 'rejected' && r.reason instanceof ConflictError).length, 1);
  assert.equal((await openStore()).revision, initial.revision+1);
});
