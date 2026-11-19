/**
 * RSS feed of published, listed writing (drafts and unlisted entries are
 * excluded by getPublishedWriting).
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedWriting } from '../lib/content';
import { kindLabel } from '../lib/format';
import { site } from '../lib/site';

export async function GET(context: APIContext) {
  const entries = await getPublishedWriting();
  return rss({
    title: `${site.name}: Writing`,
    description: site.description,
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/writing/${entry.id}/`,
      categories: [kindLabel[entry.data.kind], ...entry.data.tags],
    })),
    customData: `<language>${site.lang}</language>`,
  });
}
