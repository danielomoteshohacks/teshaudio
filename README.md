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
| `npm run prepare:portrait` | Re-crop and grade the portrait from the original photo |

## Layout

- `src/pages` routes, `src/layouts` page shells, `src/components` UI pieces
- `src/content` Markdown/MDX entries, with schemas in `src/content.config.ts`
- `src/lib/site.ts` identity, contact, home and page copy (one file for site facts)
- `src/data/about.ts` everything on the About page
- `src/data/ideas.ts` the "Ideas I'm exploring" notes
- `src/lib/content.ts` the only way pages read collections (filters drafts)
- `src/styles/tokens.css` design tokens, `global.css` base styles, `prose.css` long-form text
- `src/assets/portrait.jpg` the portrait (made from `src/assets/source/portrait-original.jpg`)
- `src/assets/photos/` royalty-free article photos, looked up by file name
- `src/components/diagrams/` hand-built article diagrams (SVG on design tokens)
- `public/audio/` audio files served as-is (later: Cloudflare R2 URLs instead)
- `scripts/` the portrait preparation script and the test-audio generator
- `docs/design-direction.md` visual direction
- `CLAUDE.md` rules for AI-assisted sessions

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
cover:                          # optional cover photo (see "Article photos")
  file: listener-headphones.jpg
  alt: What the photo shows
  credit: Name / Unsplash
  creditUrl: https://unsplash.com/photos/...
---
```

The `description` doubles as the subtitle under the title. Essays get a drop
cap; every article gets a reading progress bar, reading time, byline and a
share card with the title (`/og/writing/<slug>.png`). The newest essay is
the lead story on Home automatically.

Inside the body, without imports: `<Sidenote>...</Sidenote>` (inside a
paragraph), `<Figure caption="...">...</Figure>`, `<PullQuote>A line from
the text</PullQuote>` (use it in place of that paragraph, not as a repeat),
`<Photo file="name.jpg" alt="..." credit="Name / Unsplash" wide />`,
`<TrackPlayer track="slug" />`, `<ABPlayer comparison="slug" />`, `$inline$`
and `$$display$$` math, and fenced code blocks. Diagrams in
`src/components/diagrams/` are imported at the top of the article that uses
them. A table of contents of the `##` headings appears automatically with
three or more of them.

### Article photos

Royalty-free only (Unsplash or Pexels licence), no visible brand logos, never
AI-generated. Put the file in `src/assets/photos/` and reference it by name
as a `cover` or a `<Photo>`. A name with no file yet renders nothing (or the
site's own cover art, for covers), so an article can be published before its
photos arrive. Always fill in `credit`; it prints as "Photo: Name / Unsplash".

### Finding

Same as writing, with `kind: finding`. Keep it short. It appears on
`/findings/` and in the writing list.

### Hidden sections (Music, Findings, Lab)

Music, Findings and Lab are out of the navigation while they have little or
nothing published; their pages and collections still work. To bring one
back, publish entries and add its line to `nav` in `src/lib/site.ts` (the
lines are in the comment above it). On Home, Featured listening and the Lab
teaser appear by themselves once a track is `featured` or a lab entry is
published.

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

The original photo is `src/assets/source/portrait-original.jpg`, never edited.
`npm run prepare:portrait` crops it to a 4:5 head-and-shoulders frame with a
gentle contrast and warmth grade and writes `src/assets/portrait.jpg`; the
crop and grade are numbers at the top of `scripts/prepare-portrait.mjs`. For a
new photo, replace the original (same name) and run the script, or replace
`portrait.jpg` directly with any 4:5 JPEG at least 1600 px wide. Astro
generates the AVIF and WebP sizes automatically.

