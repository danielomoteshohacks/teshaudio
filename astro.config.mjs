// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync } from 'node:fs';
import remarkHasMath from './src/lib/remark-has-math.mjs';
import { site } from './src/lib/site.ts';

// Unlisted writing must stay out of the sitemap. The sitemap integration only
// sees URLs, so read the flag straight from each entry's frontmatter here.
const writingDir = new URL('./src/content/writing/', import.meta.url);
const unlistedPaths = readdirSync(writingDir)
  .filter((file) => /\.mdx?$/.test(file))
  .filter((file) => /^unlisted:\s*true\s*$/m.test(readFileSync(new URL(file, writingDir), 'utf8')))
  .map((file) => `/writing/${file.replace(/\.mdx?$/, '')}/`);

export default defineConfig({
  // The sitemap and canonical URLs need an absolute origin. Reading it from
  // site.ts keeps it in one place instead of two.
  site: site.url,
  // Static output: every page is pre-rendered to HTML at build time, so
  // Cloudflare only serves files from dist/ and no SSR adapter is needed.
  output: 'static',
  // Trailing slashes everywhere, matching how Cloudflare Pages serves
  // directory-style routes, so no request is redirected.
  trailingSlash: 'always',
  markdown: {
    // The unified (remark/rehype) processor rather than Astro 7's default,
    // Sätteri, because math rendering (remark-math + rehype-katex) needs the
    // remark/rehype plugin ecosystem. MDX inherits this processor.
    processor: unified({
      remarkPlugins: [remarkMath, remarkHasMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      // Two themes, emitted as CSS variables, so code blocks follow the light
      // or dark context of the section they sit in (see global.css).
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
      defaultColor: false,
    },
  },
  vite: {
    // No source maps in production: the site ships only what visitors need.
    build: { sourcemap: false },
  },
  integrations: [
    mdx(),
    sitemap({
      // Unlisted articles stay out, and so do the filter views
      // (/projects/status/..., /writing/kind/...), which repeat entries
      // already listed on their index pages.
      filter: (page) => {
        const path = new URL(page).pathname;
        return !unlistedPaths.includes(path) && !/^\/(projects\/status|writing\/kind)\//.test(path);
      },
    }),
  ],
});
