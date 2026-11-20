# Design direction

**Rich but restrained.** Premium means every element earns its place:
confident typography, real imagery (the portrait and original artwork), a
strong layout that changes from section to section, deliberate contrast and
calm motion. References for craft, never for assets: Apple's product and
newsroom pages, Linear's site, Teenage Engineering's site.

## Colour

- Dark-first, like a studio at night rather than flat black: `#0a0c12`
  shifting very slightly to `#0d1018` further down the page (static),
  surfaces at `#11141c` and `#171b26`, hairlines as translucent white
  (8% and 14%). Text `#eceef3`, muted `#9aa1b2`, captions `#8b92a3`; every
  pair passes AA. A warm off-white light mode (`#faf9f6`) that sits with the
  cream wall in the portrait. The site follows the system setting, with the
  header toggle.
- One primary accent, cobalt (`#5b8cff` in dark mode, `#2f4fe0` in light),
  for links, focus, numbers and diagram subjects. Amber (`#f2b45a`) is the
  secondary highlight, used sparingly: the "in development" dot, one region
  of a diagram, a hint in the background lights.
- Light: the static key light behind the hero portrait, plus two or three
  very large, soft, low-opacity radial lights behind the hero and the work
  (`Lights.astro`), cobalt with a hint of amber in dark mode, warmer and
  fainter in light mode. They drift a few percent with scroll only. No
  grain, no noise, nothing that loops or pulses, no heavy shadows.

## Type

- Inter for everything except serif text, with the optical-size axis on, so
  headlines get Inter's display letterforms automatically.
- Very large, tight-tracked display headings (`--step-hero`, `--step-5`);
  comfortable body sizes; small labels in sentence case, except the few
  section labels set in tracked uppercase ("What I believe about sound",
  "Work with me"). Every size is fluid (`clamp()`), so type scales smoothly
  between breakpoints instead of jumping.
- Source Serif 4 (variable, opsz) is the one serif. Articles set their body in
  it (18px on phones, 20px on desktop, line height 1.65, 680px measure).
  About sets the beliefs in it: headlines at display size, text at reading
  size. Home sets my quoted lines in its italic (the "voice"): italic
  separates a person's voice from the Inter interface type. Each page loads
  only the file it uses, preloaded, with a Georgia fallback scaled to
  Source Serif's metrics (`serif-fallback.css`), so the swap moves nothing.

## Signature

A thin waveform line (`Waveform.astro`): one hairline with a short cobalt
"selected region". Used sparingly: the hero, the footer. Static, or drawn
once on load.

## Layout

- Containers: 1200px for pages, 680px for article text, centred, with side
  padding from 20px on phones to 48px on large screens. On very wide screens
  the content stays centred and the full-bleed bands and lights run to the
  edges.
- Phones, tablets and desktops are separate layouts, not one layout
  stretched. Tablets get their own arrangements: on Home and About the
  name runs full width with the portrait beside the text; project panels
  sit side by side; the beliefs go two-column from 834px.
- Home: split hero (type and a large portrait), a wide cover-story panel with
  the essay's own diagram as artwork, two large artwork panels for the work
  (each with one belief quoted under its summary), "Work with me", then one
  belief, "Music is spiritual.", set very large in a full-bleed band as a
  full stop. Exactly three belief lines on Home; none in the hero, story or
  footer; never rotated, cycled or set in quotation marks.
- About's beliefs are the emotional centre: one row each between hairlines,
  never cards. From 834px: the number and headline on the left, the text on
  the right on the headline's first baseline. Phones: stacked, with at
  least 56px of space around every row. The belief about the ear is the one
  emphasised row, with a faint cochlea echo (desktop only).
- "Work with me" is an invitation, not a sales page: a panel in its own
  faintly cobalt surface tone, the four areas in a 2x2 grid divided by
  hairlines (from 768px), a single list on phones. Never "engineer".
- Never a column of identical cards. Panels are large, one tonal step above
  the page, with hairline borders and big radii.
- Articles: centred text column; figures break slightly out of it on wide
  screens; a quiet contents rail on the right from 1180px, and below that no
  rail and no empty gutter.

## Artwork and diagrams

Original SVG only: hairline strokes, the cobalt accent with amber highlights,
Inter labels, small grey captions. Every SVG colours itself through the
palette classes in `global.css` (`.s-*` strokes, `.f-*` fills, `.t*` text),
which map to tokens and follow light and dark mode. Diagrams with labels have
a wide and a narrow drawing, swapped by the figure's width, so text stays
legible at 360px. Every SVG carries `width` and `height` attributes, which
Safari needs to size inline SVG from its aspect ratio.

## Motion

Smooth and calm, never gimmicky. One easing curve (`--ease-out`,
`cubic-bezier(0.22, 1, 0.36, 1)`) and one duration scale (`--duration-*`)
for everything; vanilla CSS and JavaScript (`src/scripts/motion.ts`), no
libraries, no scroll hijacking, transform and opacity only.

- Page changes: the portrait morphs between Home and About as a shared
  element; the page content crossfades with a slight upward settle.
- Hero: kicker, name, portrait and intro fade and rise in a short stagger,
  under 900ms in all; the waveform draws itself once, left to right.
- Scroll: sections and panels fade and rise about 16px once as they enter,
  with a small stagger inside a group. Never out, never replayed. The
  portrait drifts a few pixels inside its frame; the background lights
  drift a few percent.
- Hover and press: panels lift 2px with a soft border highlight, links get a
  sliding underline, buttons press to 0.98. Touch screens get the same on
  `:active`.
- Theme toggle: a circular reveal from the button (View Transitions), a
  colour crossfade where that is missing.
- `prefers-reduced-motion` turns all of it off and shows everything at once.
  Without JavaScript nothing is ever hidden.

## Fonts

Self-hosted through Fontsource: `@fontsource-variable/inter/opsz.css` and
`@fontsource-variable/source-serif-4` (the upright on About and articles, the
italic on Home). The static `@fontsource/inter` package is used only by the
share-image renderer.

## Boundaries

All values live in `src/styles/tokens.css`. Every choice must meet the
quality bar in `docs/guidelines.md`: WCAG AA contrast, keyboard access, reduced
motion, Lighthouse 95+.
