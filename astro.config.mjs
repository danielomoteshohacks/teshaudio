// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/lib/site.ts';

export default defineConfig({
  // The sitemap and canonical URLs need an absolute origin. Reading it from
  // site.ts keeps the TODO placeholder in one place instead of two.
  site: site.url,
  // Static output: every page is pre-rendered to HTML at build time, so
  // Cloudflare only serves files from dist/ and no SSR adapter is needed.
  output: 'static',
  integrations: [mdx(), sitemap()],
});
