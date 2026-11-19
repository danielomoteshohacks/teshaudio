# Article photos

Royalty-free photos used in writing (Unsplash or Pexels licence only, never
AI-generated, no visible brand logos). Reference a file by name:

- as an article cover, in frontmatter: `cover: { file: name.jpg, alt, credit }`
- inside an article: `<Photo file="name.jpg" alt="..." credit="Name / Unsplash" />`

Until a named file exists here, the cover falls back to the site's own cover
art and an inline `<Photo>` renders nothing, so the build never breaks.
Large originals are fine: Astro resizes and converts them to AVIF/WebP.
