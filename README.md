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

## Layout

- `src/pages` routes, `src/layouts` page shells, `src/components` UI pieces
- `src/content` Markdown/MDX entries, with schemas in `src/content.config.ts`
- `src/lib` helpers and `site.ts`, the single source for site facts
- `src/styles/tokens.css` design tokens
- `public` files served as-is
- `docs/design-direction.md` visual direction
- `CLAUDE.md` rules for AI-assisted sessions
