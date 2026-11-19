# teshaudio

Personal site of Daniel Omotesho (Tesh): music producer and composer from
Lagos, building SoundStage, a spatial audio engine for any song on any phone,
while studying Electrical/Electronic Engineering at the University of Lagos.

Built with Astro (static output), TypeScript, MDX and plain CSS.

## Requirements

Node 22.23.4 or newer. Cloudflare builds with the version in `.node-version`.

## Commands

| Command                    | What it does                                          |
| -------------------------- | ----------------------------------------------------- |
| `npm install`              | Install dependencies                                  |
| `npm run dev`              | Start the dev server at http://localhost:4321         |
| `npm run check`            | Type-check `.astro`, `.ts` and content schemas        |
| `npm run build`            | Run the type check, then build the site into `dist/`  |
| `npm run preview`          | Serve the production build locally                    |
| `npm run prepare:portrait` | Re-crop and grade the portrait from the original photo |

## Layout

- Routes: `/` (Home), `/projects/` and `/projects/<slug>/` (Work), `/writing/`
  and `/writing/<slug>/`, `/about/`, plus `/rss.xml`, `/og/*.png` and the 404.
- `src/lib/site.ts` identity, contact, Home lines and page copy (one file for site facts)
- `src/data/about.ts` bio, "What I do" and education on About
- `src/content` Markdown/MDX entries, with schemas in `src/content.config.ts`
- `src/lib/content.ts` the only way pages read collections (filters drafts)
- `src/components/art/` original project artwork (SVG)
- `src/components/diagrams/` article diagrams (SVG on design tokens)
- `src/styles/tokens.css` design tokens, `global.css` base styles and the
  SVG palette classes, `prose.css` long-form text
- `src/assets/portrait.jpg` the portrait (made from `src/assets/source/portrait-original.jpg`)
- `docs/design-direction.md` visual direction; `CLAUDE.md` rules for AI-assisted sessions

## How to update content

Every piece of content lives in exactly one file. Facts about Tesh are never
invented, and nothing unfinished is shown: an entry with `draft: true` stays
visible in `npm run dev` and out of the production build. After any change,
run `npm run build` to check it.

### Project

Edit or create `src/content/projects/<slug>.md`. Required: `title`,
`summary` (the lead paragraph on the project page), `status` and `order`.
Statuses display as: `active` "In development", `research` "Research",
`shipped` "Live", `concept` "In design", `paused` "Paused". Optional: `tagline`
(the one line on panels and under the title), `note` (a short caveat), `tech`,
`repoUrl`, `liveUrl`, `featured` (shown on Home). A longer write-up can go in
the Markdown body. Artwork comes from `src/components/art/ProjectArt.astro`,
mapped by slug; a project without artwork simply shows none.

### Writing

Create `src/content/writing/<slug>.mdx`:

```md
---
title: Title
description: The subtitle, also used in lists, search results and share cards.
pubDate: 2026-12-01
kind: essay                     # essay, research, note or finding
relatedProject: soundstage      # optional, a project slug
references:                     # optional, a numbered list at the end
  - { title: Source title, authors: Name, publisher: Publisher, year: 2024, url: https://... }
---
```

The newest essay becomes the featured story on Home automatically, and every
article gets a share card (`/og/writing/<slug>.png`) and the author note.
Inside the body, without imports: `<PullQuote>A line from the text</PullQuote>`
(use it in place of that paragraph, once per article), `<ClosingLine>The last
line</ClosingLine>`, `<Sidenote>...</Sidenote>`, `<Figure caption="...">...</Figure>`,
and `$math$`. Diagrams in `src/components/diagrams/` are imported at the top of
the article that uses them; a figure placed first in the body becomes the
wide opening figure under the header. The contents rail lists the `##`
headings when there are three or more.

### About

`src/data/about.ts`: `bio` (one string per paragraph), `skills` ("What I do":
title and a short note each) and `education`. "What I believe about sound" is
the four files in `src/content/philosophy/` (`title`, `thesis` and the body),
in `order`.

### Identity, contact and Home lines

`src/lib/site.ts`: name, `intro` (the Home hero), `belief` (the Home band),
`authorNote` (end of every article), `email` and `socials` (each renders only
if present), and `copy` for page headings and search descriptions.

### Portrait

The original photo is `src/assets/source/portrait-original.jpg`, never edited.
`npm run prepare:portrait` crops it to a 4:5 head-and-shoulders frame with a
gentle contrast and warmth grade and writes `src/assets/portrait.jpg`; the
crop and grade are numbers at the top of `scripts/prepare-portrait.mjs`. For a
new photo, replace the original (same name) and run the script, or replace
`portrait.jpg` directly with any 4:5 JPEG at least 1600 px wide.

### Collections kept for later

`tracks`, `comparisons` and `lab` are still defined in `src/content.config.ts`
(with draft entries), but have no pages while there is nothing to publish.
The audio player and lab pages they used are in the git history.
