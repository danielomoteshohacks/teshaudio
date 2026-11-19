# CLAUDE.md

Rules for every session working in this repository. They are not optional.

## Project

Personal site for Daniel ("Tesh"): music producer, composer, mix and mastering
engineer, spatial audio software engineer and audio experience designer.
Astro (static output), TypeScript strict, MDX, plain CSS with design tokens.
Deployed to Cloudflare: build command `npm run build`, output folder `dist`.

## Writing and content

- The site is strictly about audio. No certifications, unrelated education,
  or non-audio projects. If in doubt, leave it out.
- No emojis anywhere: code, comments, commit messages, PR text or site content.
- Never invent facts about Tesh: biography, credits, clients, releases, project
  details, dates or links. If something is missing, read it from
  `src/lib/site.ts` (identity, contact, page copy) or `src/data/about.ts`
  (About page). Do not fill gaps with plausible text.
- The live site must never show the word "TODO". Missing content renders as
  neutral copy ("Details coming soon"); TODO markers belong in source comments.
- Every piece of content must be editable in one file: `site.ts`,
  `about.ts`, a collection entry, or an asset. The README's "How to update
  content" section has a recipe per content type; keep it current.
- Placeholder entries are allowed only when Tesh asks for them, and must be
  labelled: synthetic audio with `testAudio: true`, layout fixtures with
  `unlisted: true`. Anything unfinished otherwise uses `draft: true`.

## Code

- Inline comments explain WHY a choice was made, not just what the code does.
- Make surgical, targeted edits. Never rewrite a whole file unless Tesh asks.
- Pages must read collections only through `src/lib/content.ts`
  (`getPublishedProjects`, `getPublishedWriting`, `getPublishedTracks`, etc.)
  so drafts and unlisted entries never leak. Do not call `getCollection()`
  directly in pages or components.
- Navigation uses Astro's ClientRouter so the audio player persists. Page
  scripts must therefore set up on `astro:page-load` and clean up on
  `astro:before-swap`, not on DOMContentLoaded.
- Never use music Tesh did not make. Placeholder audio is synthetic test tones
  from `scripts/generate-test-audio.mjs`, marked `testAudio: true`.
- Styling: plain CSS, custom properties from `src/styles/tokens.css`, and Astro
  scoped styles. No Tailwind, no UI kits. Use tokens, not raw values.
- Fonts are self-hosted through Fontsource. Never add a font CDN.
- Follow `docs/design-direction.md` for any visual work.

## Quality bar

- Mobile-first layouts.
- Accessible: WCAG AA contrast, full keyboard navigation with visible focus,
  semantic HTML, and respect `prefers-reduced-motion`.
- Fast: target Lighthouse 95+ in Performance, Accessibility, Best Practices
  and SEO on every page. Ship as little JavaScript as possible.

## Workflow

- One focused PR per task, with a description that explains what changed and why.
- Before opening any PR, run `npm run check` and `npm run build`. Never open a
  PR with a failing build or type check. Fix every error and warning.
