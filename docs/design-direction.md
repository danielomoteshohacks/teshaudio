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
- Every choice must still meet the quality bar in `docs/guidelines.md`: WCAG AA
  contrast, keyboard access, reduced motion, Lighthouse 95+.

## Fonts

Kept after the design-system PR review; no alternative made a strong enough case.

- Sans: Inter (variable, with the optical-size axis), via
  `@fontsource-variable/inter/opsz.css`.
- Mono: JetBrains Mono (variable), via `@fontsource-variable/jetbrains-mono`.

## Implemented tokens

The design-system PR turned this direction into tokens and base components.

- Tokens: `src/styles/tokens.css` (values, with contrast ratios in comments).
- Base element rules, grid paper and the reduced-motion safety net:
  `src/styles/global.css`.
- Components: `src/components/` (Container, Section, Eyebrow, Button, Card,
  Stat).
- Living style guide: `/design` (noindex, not in the sitemap).
- Contexts: set `data-theme="light"` or `data-theme="dark"` on any element.
  The site default is light.
- Accent: three candidates (cobalt "Signal", violet "Ultraviolet", amber "VU")
  switched by `data-accent` on `<html>`. Cobalt is the default until one is
  chosen; the other two are then removed.
