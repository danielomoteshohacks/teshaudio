# Design direction

Recorded in the foundation PR. The design PR and later PRs implement it.

## Theme

**Precision engineering, soft touch.**

Feel words: **precise**, **soft**, **futuristic**.

The site pairs two layers. The engineering layer reflects the technical side of
the work (spatial audio software, DSP, measurement). The soft layer reflects the
listening side (music, mixing, how sound feels to a person).

## Engineering layer

Inspired by mlh.com.

- Monospace type for technical labels and metadata (dates, tags, status, tech
  stacks, section indices).
- A subtle grid-paper background texture.
- Bold stat counters.
- Later: isometric-style diagrams (signal flow, speaker layouts, system
  architecture).

## Soft layer

Inspired by apple.com and cloud.google.com.

- Large, centred headlines.
- Generous whitespace.
- Alternating light and dark sections.
- Large rounded cards.
- Pill-shaped buttons.
- A calm sans-serif for body and headings.

## Boundaries

- These sites are inspiration only. Never copy their assets, logos, imagery,
  icons, copy or branding.
- All values (colour, type, space, radius, motion) live in
  `src/styles/tokens.css`.
- Every choice must still meet the quality bar in `CLAUDE.md`: WCAG AA
  contrast, keyboard access, reduced motion, Lighthouse 95+.

## Fonts

Kept after the design-system PR review; no alternative made a strong enough case.

- Sans: Inter (variable, with the optical-size axis), via
  `@fontsource-variable/inter/opsz.css`.
- Mono: JetBrains Mono (variable), via `@fontsource-variable/jetbrains-mono`.
- Serif (article body only): Source Serif 4 (variable, with the optical-size
  axis), via `@fontsource-variable/source-serif-4/opsz.css`, imported only by
  the article template.

## Implemented tokens

The design-system work turned this direction into tokens and base components;
"Personal site v1" built every page on them.

- Tokens: `src/styles/tokens.css` (values, with contrast ratios in comments).
- Base element rules, grid paper and the reduced-motion safety net:
  `src/styles/global.css`.
- Components: `src/components/` (Container, Section, Eyebrow, Button, Card,
  Stat).
- Contexts: set `data-theme="light"` or `data-theme="dark"` on any element.
  The site default is light.
- Accent: Signal (cobalt), chosen from three candidates. A deeper shade in
  light contexts (`#2f4fe0`) and a brighter one in dark contexts (`#8ea2ff`).
- Second iteration, "warm, comfy, intimate": slightly warm neutrals, full
  dark mode (follows the OS, with a remembered header toggle and no flash on
  load), a very fine film-grain overlay, and soft accent glows behind heroes
  and headings, like light in a dim studio. Grid paper has been removed.
- Accents: Signal (cobalt) stays primary; VU (amber) is a secondary warm
  accent for small highlights only (status dots, the Now section, hover
  underlines).
- Motion: Astro view transitions between pages and a CSS scroll-driven
  fade-up as sections enter. Both are off under `prefers-reduced-motion`.
- Mono type only for small labels and metadata (dates, tags, status,
  durations).

## Third iteration: cinematic, editorial

- **Hero.** Dark-first stage: deep near-black with two slow pools of light
  (cobalt matched to the portrait's outfit, warm amber) drifting over about
  40 s, a faint beam and film grain. CSS only, transform-only animation,
  off under reduced motion. Light mode is the same scene in warm daylight.
  The name is set at `--step-hero`, the site's one oversized moment.
- **Portrait.** The real photo, cropped and gently graded by
  `scripts/prepare-portrait.mjs`; shown in a `--radius-xl` frame with a
  cobalt glow behind and a whisper of grain. Never retouched.
- **Home rhythm.** Movements, not a stack of cards: hero, one large lead
  story, a full-width "Now" statement, disciplines as a typographic list,
  then the dark band for work and philosophy.
- **Reading.** Article body in Source Serif 4 (self-hosted, loaded only on
  articles) at 68ch with generous leading; Inter for headings and UI.
  Numbered sections, a drop cap on essays, pull quotes, a CSS scroll-driven
  progress bar and a sticky contents rail on desktop.
- **Diagrams.** Hand-built SVG components in `src/components/diagrams/`,
  coloured only through token-mapped classes, so they follow light and dark
  mode. Each has a `<title>`, `<desc>` and a numbered caption.
- **Covers.** Article photos are royalty-free and credited. Until a photo is
  added, `CoverArt.astro` (an original illustration of a listener in a sound
  field) stands in; never a stock or generated image.
