/**
 * Single source of truth for facts about Tesh and the site.
 *
 * Rule (see CLAUDE.md): never invent biography, credits or project details.
 * Any value not yet supplied by Tesh stays as a visible "TODO:" string here,
 * so missing content is obvious on the page instead of quietly made up.
 */
export const site = {
  name: 'Tesh',
  // TODO: replace with the real Cloudflare Pages URL after the first deploy.
  // example.com is reserved for documentation (RFC 2606), so it can never
  // collide with a real site if this placeholder ships by accident.
  url: 'https://example.com',
  title: 'TODO: site title',
  description: 'TODO: one-sentence site description supplied by Tesh.',
  lang: 'en',
} as const;
