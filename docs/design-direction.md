# Design direction

**Rich but restrained.** Premium means every element earns its place:
confident typography, real imagery (the portrait and original artwork), a
strong layout that changes from section to section, deliberate contrast and
calm motion. References for craft, never for assets: Apple's product and
newsroom pages, Linear's site, Teenage Engineering's site.

## Colour

- Dark-first. A near-black with a hint of blue (`#0b0c10`), layered in small
  tonal steps (`--color-bg-2`, `--color-bg-3`) with 1px hairline borders for
  depth. A warm off-white light mode (`#fafaf8`). The site follows the system
  setting, with the header toggle.
- One primary accent, cobalt, for links, focus, diagram subjects. Amber is the
  secondary highlight, used sparingly: the "in development" dot, one region of
  a diagram, the share card's kicker dot.
- At most one large, soft, static light: the key light behind the hero
  portrait. No animated gradients, no grain, no glows elsewhere, no heavy
  shadows.

## Type

- Inter for everything except article body text, with the optical-size axis
  on, so headlines get Inter's display letterforms automatically.
- Very large, tight-tracked display headings (`--step-hero`, `--step-5`);
  comfortable body sizes; small labels in sentence case, never shouted.
- Source Serif 4 (variable, opsz) is the one serif. Articles set their body in
  it (18px on phones, 20px on desktop, line height 1.65, 680px measure).
  About sets the beliefs in it: headlines at display size, text at reading
  size. Home sets Tesh's quoted lines in its italic (the "voice"): italic
  separates a person's voice from the Inter interface type. Each page loads
  only the file it uses, preloaded, with a Georgia fallback scaled to
  Source Serif's metrics (`serif-fallback.css`), so the swap moves nothing.

## Signature

A thin waveform line (`Waveform.astro`): one hairline with a short cobalt
"selected region". Used sparingly: the hero, the footer. Static, or drawn
once on load.

## Layout

- Home: split hero (type and a large portrait), a wide cover-story panel with
  the essay's own diagram as artwork, two large artwork panels for the work
  (each with one belief quoted under its summary), then one belief, "Music is
  spiritual.", set very large in a full-bleed band as a full stop. Exactly
  three belief lines on Home; none in the hero, story or footer; never
  rotated, cycled or set in quotation marks.
- About's beliefs are the emotional centre: one row each between hairlines,
  never cards. Desktop: number, headline and text on one baseline. Phones:
  stacked, with at least 56px of space around every row. The belief about
  the ear is the one emphasised row, with a faint cochlea echo (desktop
  only). No motion beyond the page's load fade.
- Never a column of identical cards. Panels are large, one tonal step above
  the page, with hairline borders and big radii.
- Articles: centred text column; figures break slightly out of it on wide
  screens; a quiet contents rail on the right from 80rem.

## Artwork and diagrams

Original SVG only: hairline strokes, the cobalt accent with amber highlights,
Inter labels, small grey captions. Every SVG colours itself through the
palette classes in `global.css` (`.s-*` strokes, `.f-*` fills, `.t*` text),
which map to tokens and follow light and dark mode. Diagrams with labels have
a wide and a narrow drawing, swapped by the figure's width, so text stays
legible at 360px. Every SVG carries `width` and `height` attributes, which
Safari needs to size inline SVG from its aspect ratio.

## Motion

Purposeful and quiet: one fade-and-rise as a page's header loads, refined
hover states (underlines that slide in, panels that lift one tonal step),
and the ClientRouter page crossfade. No scroll-triggered animation, nothing
floating or looping. Everything is off under `prefers-reduced-motion`.

## Fonts

Self-hosted through Fontsource: `@fontsource-variable/inter/opsz.css` and
`@fontsource-variable/source-serif-4/opsz.css` (articles only). The static
`@fontsource/inter` package is used only by the share-image renderer.

## Boundaries

All values live in `src/styles/tokens.css`. Every choice must meet the
quality bar in `docs/guidelines.md`: WCAG AA contrast, keyboard access, reduced
motion, Lighthouse 95+.
