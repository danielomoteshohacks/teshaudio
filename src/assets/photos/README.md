# Article photos

Royalty-free photos used in writing (Unsplash or Pexels licence only, never
AI-generated, no visible brand logos). Reference a file by name:

- as an article cover, in frontmatter: `cover: { file: name.jpg, alt, credit, creditUrl }`
- inside an article: `<Photo file="name.jpg" alt="..." credit="Name / Unsplash" />`

Until a named file exists here, the cover shows the site's own cover art and
an inline `<Photo>` a gradient placeholder marked "Photo coming soon", so the
build never breaks and the layout is already final. When adding a file,
update its alt text to describe the real photo and add `credit` and
`creditUrl`.
Large originals are fine: Astro resizes and converts them to AVIF/WebP.
