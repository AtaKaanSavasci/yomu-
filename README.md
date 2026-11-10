# Yomu

A Japanese learning app for short, regular practice on your phone or desktop. Available in Turkish and English.

## Main features

- **Kana and kanji practice** — Choose the characters you want to study and practice their readings or Japanese spelling.
- **Vocabulary, sentences and grammar** — Explore 300 words, 120 everyday sentences and 50 grammar topics, organized into N5–N1 study levels.
- **Reading and listening** — Read short texts with furigana, reveal readings when needed and practice with your device's Japanese voice.
- **Anime practice** — Learn with short quotes from Naruto, Bleach, Vinland Saga and Jujutsu Kaisen, with source clips and words you can save to decks.
- **Personal decks** — Add your own vocabulary, organize it into decks and import or export CSV files.
- **Reviews and progress** — Revisit saved words, practice mistakes and track your answers over time.
- **Study paths and quizzes** — Follow original Genki I & II study guides or try timed level quizzes.
- **Translation** — Open the floating translation button from any screen to translate between Japanese, Turkish and English.
- **Backups and sync** — Export or restore JSON backups and optionally sync your study data across devices on the hosted app.

Levels are approximate study guides, not official JLPT certification. Listening needs a Japanese voice on your device; translation, clips and cloud sync need internet access.

## Run locally

Requires **Node.js 22 or later**.

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Development

```sh
npm test               # Run tests
npm run check         # Check JavaScript syntax
npm run build:hosted  # Build the hosted app
```

See [architecture](docs/architecture.md), [validation notes](docs/qa.md) and [content sources](docs/) for details.
