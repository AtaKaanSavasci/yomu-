# Genki study path: sources and scope

Checked 2026-11-05 against primary publisher sources:

- [The Japan Times Publishing: GENKI 3rd Edition, book structure](https://genki3.japantimes.co.jp/en/intro/index.html). Confirms Volume I lessons 1–12 and Volume II lessons 13–23 and supplies the conversation/grammar table of contents.
- [The Japan Times Publishing: 3rd Edition conversation/grammar syllabus (PDF)](https://bookclub2.japantimes.co.jp/download/files/genki3/genki-3rd_syllabus_E.pdf). Used to check the lesson numbers of the selected grammar topics, including the final passive, causative and causative-passive lessons.

`dist/src/genki-data.js` contains 23 **original Yomu** theme summaries, brief TR/EN notes, Japanese examples with kana readings, and one original gap-fill question per lesson. The labels are Yomu's summaries, not reproduced book chapter titles. No textbook dialogue, exercise, reading passage, vocabulary list, answer key, recording, illustration or page has been copied. General language forms and lesson-topic relationships are used to organise a companion study path. The notes cover selected focus points, not the complete syllabus; a matching lesson number does not assert that every prerequisite has been taught in Yomu.

The path is explicitly labelled **3rd edition**. Other editions have not been compared. This is an independent companion, not an official publisher product or an authorised replacement for the books. The original exercises are AI-assisted starter material, without a claim of human-editor approval.

Existing-content links are thematic/prerequisite review selections from Yomu; they are not book exercises or a book vocabulary mapping. Personal-word buttons search the stable tags `genki-3-l01` through `genki-3-l23` in the user's own entries. No words are added merely by opening the path.

Completion marks are user-controlled timestamps. Correct mini answers never automatically mark a book lesson complete, certify knowledge of the lesson or create a JLPT proficiency result. Submitted answers use the existing answer event/scheduling model. Opening a guide, playing audio elsewhere, selecting a tag and marking a lesson do not create answer events.

Integration: hydrate with `defaultGenki()` from `genki-data.js`; route `#genki`; use `createGenkiFeature({getState,commit,ui,toast,isBusy,navigate,onQuestionStart})`; include `genki.css`. Add `getGenkiQuestion(id)` to the global resolver so review/history can resolve IDs such as `genki:l01:mini`. Session questions are snapshots. `onQuestionStart(question, scopeKey)` receives `genki:<session.id>:0`; the mini renderer owns its kana hint and records reading exposure honestly. `completedLessons` stores numeric-string lesson keys with UTC ISO timestamps; `selectedLesson`, filters and active session are local navigation state. Imports should reset active sessions. The controller accepts legacy `{completedAt}` completion objects and normalises them to timestamps.
