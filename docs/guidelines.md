# Project guidelines

My style guide for this site. Every change follows it.

## Project

My personal site. I'm Daniel Omotesho ("Tesh"): a music producer and
composer, building audio software, and studying Electrical/Electronic
Engineering at the University of Lagos. Astro (static output), TypeScript
strict, MDX, plain CSS with design tokens. Deployed to Cloudflare: build
command `npm run build`, output folder `dist`.

## Hard rules

- Never call me an engineer. No "Mix and Mastering Engineer", no "Spatial
  Audio Software Engineer", no "engineer" in titles, meta tags or the share
  images. I'm a music producer and composer, building audio software, and
  studying Electrical/Electronic Engineering at the University of Lagos.
  (My essays may mention other people's engineers; those stay as written.)
- Nothing unfinished on the site: no stand-in content, no "soon" labels and
  no empty states. If something has no content, it does not appear.
- No stock photos. Visuals come from my own photos and original SVG artwork.
- Only verifiable content about what I'm actually doing.

## Writing and content

- The site is strictly about audio. No certifications, unrelated education,
  or non-audio projects. If in doubt, leave it out.
- No emojis anywhere: code, comments, commit messages, PR text or site content.
- Never make up facts about me: biography, credits, clients, releases,
  project details, dates or links. Facts live in `src/lib/site.ts`
  (identity, contact, page copy), `src/data/about.ts` (About page) and
  `src/lib/beliefs.ts` (what I believe about sound). Gaps stay empty.
- The live site must never show the word "TODO". Missing content is simply
  not rendered; TODO markers belong in source comments.
- Every piece of content is editable in one file: `site.ts`, `about.ts`,
  `beliefs.ts`, a collection entry, or an asset. The README's "How to update
  content" section has a recipe per content type; keep it current.
- Anything unfinished uses `draft: true`, so it never reaches the site.

## Code

- Inline comments explain WHY a choice was made, not just what the code does.
- Small, targeted edits; no rewriting whole files for the sake of it.
- Pages read collections only through `src/lib/content.ts`
  (`getPublishedProjects`, `getPublishedWriting`, `getPublishedTracks`, etc.)
  so drafts and unlisted entries never leak. No `getCollection()` directly
  in pages or components.
- Navigation uses Astro's ClientRouter (view transitions between pages).
  Page scripts therefore set up on `astro:page-load` and clean up on
  `astro:before-swap`, not on DOMContentLoaded.
- Only music I made. Test audio is synthetic tones from
  `scripts/generate-test-audio.mjs`, marked `testAudio: true`.
- Styling: plain CSS, custom properties from `src/styles/tokens.css`, and
  Astro scoped styles. No Tailwind, no UI kits. Tokens, not raw values.
- Motion: vanilla JavaScript and CSS only, no animation libraries and no
  scroll hijacking. Animate transform and opacity only, with the shared
  easing and durations in `tokens.css`.
- Fonts are self-hosted through Fontsource. Never a font CDN.
- `docs/design-direction.md` governs all visual work.

## Quality bar

- Mobile-first, and every size designed on purpose: phones (360 and 390px,
  and landscape), tablets (768 to 1180px) and desktops (1280 to 1920px).
- Accessible: WCAG AA contrast, full keyboard navigation with visible focus,
  44px touch targets, semantic HTML, and `prefers-reduced-motion` respected.
- Works without JavaScript: all content visible and usable.
- Fast: Lighthouse 95+ in Performance, Accessibility, Best Practices and SEO
  on every page, no layout shift. Ship as little JavaScript as possible.

## Workflow

- One focused PR per change, with a description that explains what changed and why.
- Before opening any PR, run `npm run check` and `npm run build`. Never open
  a PR with a failing build or type check. Fix every error and warning.
