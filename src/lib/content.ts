import { getCollection } from 'astro:content';

/**
 * The only approved way to read collections from pages.
 *
 * Drafts are kept in development so they can be previewed with `npm run dev`,
 * but import.meta.env.PROD is true during `astro build`, so drafts never reach
 * the production HTML or the sitemap.
 */
const isVisible = (entry: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !entry.data.draft : true;

/** Projects sorted by their explicit `order` field (lowest first). */
export async function getPublishedProjects() {
  const entries = await getCollection('projects', isVisible);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Writing sorted newest first, which is what readers expect from a feed. */
export async function getPublishedWriting() {
  const entries = await getCollection('writing', isVisible);
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
