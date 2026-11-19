# teshaudio

Personal site of Tesh: music producer, composer, mix and mastering engineer,
spatial audio software engineer and audio experience designer. It holds a bio,
projects, writing on music, sound and spatial audio, and research notes that
will later include interactive Web Audio and WASM demos.

Built with Astro (static output), TypeScript, MDX and plain CSS.

## Requirements

Node 22.23.4 or newer. Cloudflare builds with the version in `.node-version`.

## Commands

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm install`     | Install dependencies                                  |
| `npm run dev`     | Start the dev server at http://localhost:4321         |
| `npm run check`   | Type-check `.astro`, `.ts` and content schemas        |
| `npm run build`   | Run the type check, then build the site into `dist/`  |
| `npm run preview` | Serve the production build locally                    |
| `npm run generate:audio` | Regenerate the synthetic test tones and print their LUFS |
| `npm run generate:portrait` | Regenerate the placeholder portrait            |

## Layout

- `src/pages` routes, `src/layouts` page shells, `src/components` UI pieces
- `src/content` Markdown/MDX entries, with schemas in `src/content.config.ts`
- `src/lib/site.ts` identity, contact, home and page copy (one file for site facts)
- `src/data/about.ts` everything on the About page
- `src/data/ideas.ts` the "Ideas I'm exploring" notes
- `src/lib/content.ts` the only way pages read collections (filters drafts)
- `src/styles/tokens.css` design tokens, `global.css` base styles, `prose.css` long-form text
- `src/assets/portrait.jpg` the portrait
- `public/audio/` audio files served as-is (later: Cloudflare R2 URLs instead)
- `scripts/` generators for the placeholder portrait and test audio
- `docs/design-direction.md` visual direction
- `docs/guidelines.md` project rules

## How to update content

Every piece of content lives in exactly one file. Facts about Tesh are never
invented: anything not supplied stays as neutral "coming soon" copy, with a
`TODO` comment in the source (never on the live site). After any change, run
`npm run build` to check it.

Entries in every collection accept `draft: true`, which keeps them visible in
`npm run dev` and out of the production build.

### Track

Create `src/content/tracks/<slug>.md`:

```md
---
title: Track title
roles: ['producer', 'mix']      # any of: producer, composer, mix, master
year: 2026
genre: Afrobeats
durationSeconds: 214            # used for display; no audio is downloaded until play
audioUrl: /audio/track.mp3      # file in public/audio/, or a full https:// URL (e.g. R2)
artwork: ../../assets/art/track.jpg   # optional, square, at least 512 x 512
credits:                        # optional
  - { role: Vocals, name: Name }
featured: true                  # shows on Home (up to three)
order: 1                        # position in lists, lowest first
---
```

Start from `src/content/tracks/track-template.md` (a draft). Featured tracks appear
on Home; the Home listening section stays hidden until
at least one published track exists.

### Comparison (mix or master A/B)

1. Export both versions as the same format and length (an excerpt of 90
   seconds or less: both are decoded into memory, which phones limit).
2. Measure each file's integrated loudness in LUFS with your DAW's loudness
   meter or `ffmpeg -i file.wav -af ebur128 -f null -` (read the `I:` value).
3. Create `src/content/comparisons/<slug>.md`:

```md
---
title: Song title, master
description: One or two sentences on what changed.
stage: master                   # mix or master
a: { label: Mix, audioUrl: /audio/song-mix.wav, lufs: -18.2 }
b: { label: Master, audioUrl: /audio/song-master.wav, lufs: -9.6 }
order: 1
---
```

The player turns the louder version down to match the quieter one, so the
LUFS values must be measured, not estimated. Files on another domain (R2)
need CORS enabled for the site's origin. Delete
`src/content/comparisons/test-pink-noise-shelf.md` once a real one exists.

### Project

Audio projects only. Edit or create `src/content/projects/<slug>.md`.
Required: `title`, `summary` (the overview paragraph), `status` and `order`.
Statuses display as: `shipped` "Live", `active` "In development",
`concept` "In design", `paused` "Paused". Optional and hidden until set:
`tagline` (one line for cards and the page lead), `note` (a short caveat),
`role`, `tech`, `repoUrl`, `liveUrl`, `startDate`, `gallery`, `featured`
(shows under "What I'm building" on Home). A longer write-up can go in the
Markdown body; nothing is shown while it is empty. Gallery images:

```md
gallery:
  - { src: ../../assets/projects/acoustimorph-1.png, alt: Describe the image, caption: Optional }
```

### Writing (essay, research, note)

Create `src/content/writing/<slug>.mdx`:

```md
---
title: Title
description: One sentence, used in lists, search results and share cards.
pubDate: 2026-12-01
kind: essay                     # essay, research, note or finding
tags: ['spatial-audio']
references:                     # optional, shown as a numbered list at the end
  - { title: Source title, authors: Name, publisher: Publisher, year: 2024, url: https://... }
relatedProject: acoustimorph    # optional, a project slug
---
```

Inside the body, without imports: `<Sidenote>...</Sidenote>` (inside a
paragraph), `<Figure caption="...">...</Figure>`, `<TrackPlayer track="slug" />`,
`<ABPlayer comparison="slug" />`, `$inline$` and `$$display$$` math, and fenced
code blocks. A table of contents appears automatically with three or more `##`
headings.

### Finding

Same as writing, with `kind: finding`. Keep it short. It appears on
`/findings/` and in the writing list.

### Lab entry

Create `src/content/lab/<slug>.md` (or `.mdx`) with `title`, `summary`,
`status` (`live` or `coming-soon`), `order`, and optionally
`relatedProject` (a project slug) and `demoUrl` (where the demo runs, for
example a Hugging Face Space). Live entries show their body, which can embed
`<ABPlayer comparison="slug" />`. Coming-soon entries show the demo mount
area, documented at the top of `src/pages/lab/[slug].astro`.

### Philosophy

Edit the four files in `src/content/philosophy/` (`music.mdx`, `sound.mdx`,
`consumer-audio-experience.mdx`, `spatial-audio.mdx`). `thesis` is the large
one-line position; the body is the text. `order` sets the sequence. The pull
quote on Home is `philosophyQuote` in `src/lib/site.ts`.

### Bio, education, skills

Edit `src/data/about.ts`: `bio` (one string per paragraph), `education`
(one line) and `skills` (title and a short note each). Audio only.

### Now and Ideas

"What I'm doing now" on Home is `now` in `src/lib/site.ts` (each item can
link with `href`). Ideas are in `src/data/ideas.ts` (title and note, no
status).

### Identity, contact and page copy

Edit `src/lib/site.ts`: name, role statement, intro, discipline one-liners,
email, socials (each renders only if present), and `copy` for every page
heading, intro and search description.

### Portrait

Replace `src/assets/portrait.jpg` with a JPEG of the same name (portrait
orientation, at least 1200 x 1500). Astro generates the AVIF and WebP sizes
automatically. `npm run generate:portrait` restores the placeholder.

