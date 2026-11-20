import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * The only approved way to read collections from pages.
 *
 * Drafts are kept in development so they can be previewed with `npm run dev`,
 * but import.meta.env.PROD is true during `astro build`, so drafts never reach
 * the production HTML, the RSS feed or the sitemap.
 */
const notDraft = (entry: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !entry.data.draft : true;

async function published<K extends CollectionKey>(key: K) {
  // The cast keeps the filter generic: every collection schema has `draft`.
  return (await getCollection(key, notDraft as never)) as CollectionEntry<K>[];
}

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

/** Projects sorted by their explicit `order` field (lowest first). */
export async function getPublishedProjects() {
  return (await published('projects')).sort(byOrder);
}

/**
 * Writing sorted newest first. Unlisted entries are excluded from every list
 * by default; only the article route asks for them, so they still get a page.
 */
export async function getPublishedWriting({ includeUnlisted = false } = {}) {
  const entries = await published('writing');
  return entries
    .filter((entry) => includeUnlisted || !entry.data.unlisted)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getPublishedTracks() {
  return (await published('tracks')).sort(byOrder);
}

export async function getPublishedComparisons() {
  return (await published('comparisons')).sort(byOrder);
}

export async function getPublishedLab() {
  return (await published('lab')).sort(byOrder);
}

/** Single entries, for MDX embeds such as <TrackPlayer track="..." />. */
export const getTrack = (id: string) => getEntry('tracks', id);
export const getComparison = (id: string) => getEntry('comparisons', id);
export const getProject = (id: string) => getEntry('projects', id);

/** True when a Markdown entry has no body yet, so pages can show a placeholder. */
export const isEmptyBody = (entry: { body?: string }) => !entry.body?.trim();
