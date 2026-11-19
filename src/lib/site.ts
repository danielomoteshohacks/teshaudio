/**
 * Single source of truth for facts about Tesh and the site.
 *
 * Rule (see CLAUDE.md): never invent biography, credits or project details.
 * Any value not yet supplied by Tesh stays as a visible "TODO:" string here,
 * so missing content is obvious on the page instead of quietly made up.
 */
export const site = {
  name: 'Tesh',
  // Production origin on Cloudflare Pages. Used by astro.config.mjs as `site`,
  // so canonical tags and the sitemap point here. Update if a custom domain
  // is added, otherwise search engines index the pages.dev address.
  url: 'https://teshaudio.pages.dev',
  title: 'TODO: site title',
  description: 'TODO: one-sentence site description supplied by Tesh.',
  lang: 'en',
} as const;
