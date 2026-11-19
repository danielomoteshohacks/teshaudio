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

## Current font choices (may change in the design PR)

- Sans: Inter (variable), via `@fontsource-variable/inter`.
- Mono: JetBrains Mono (variable), via `@fontsource-variable/jetbrains-mono`.
