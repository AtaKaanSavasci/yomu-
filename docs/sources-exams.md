# Level practice tests

The N5–N1 labels in this feature are approximate editorial study bands. These are original, AI-assisted study exercises, awaiting human editorial review. They are not official JLPT tests, a calibrated mock exam, a full syllabus, a proficiency assessment, or a pass prediction.

The official JLPT describes five levels and language knowledge, reading and listening activities. The official examination uses its own scoring sections and scaled scores. Yomu deliberately reports only local correct, incorrect and unanswered item counts, without converting them to JLPT scores or applying pass marks.

Primary guidance checked 2026-11-05:

- [JLPT N1–N5 level descriptions](https://www.jlpt.jp/e/about/levelsummary.html)
- [JLPT scoring sections and results](https://www.jlpt.jp/e/guideline/results.html)
- [JLPT FAQ, including scaled scores](https://www.jlpt.jp/e/faq/)

No official examination questions, copyrighted textbook passages or Genki exercises were copied. Vocabulary and grammar items use Yomu's existing original study corpus (`study-data.js`, version frozen into each session). Grammar alternatives are explicitly selected real Japanese forms; the supplied translation disambiguates the intended meaning. Software vocabulary is excluded from level-test selection because it is domain-specific rather than evidence of general level coverage.

The five short reading passages and their 30 comprehension questions were newly written for this feature. They require retrieving, relating or inferring information from the passage; word-meaning questions are not relabelled as reading comprehension. Six reading items in a test share the level's passage.

Optional listening uses built-in vocabulary and the browser's synthetic Japanese voice. It is a word-recognition exercise, not a recreation of the official listening section. Audio quality and availability vary by device. A natural queued → speaking → completed callback is required before saving each listening answer. Japanese spellings/readings are hidden until the test result. Audio loss excludes unanswered listening items from scored counts and labels them not taken; it does not manufacture incorrect answers.

Session question text, options, language, answer keys, explanations and deadline are persisted at the start. Closing or reloading does not extend the deadline. Results and at most 30 full snapshots are separate from spaced-repetition events and schedules.
