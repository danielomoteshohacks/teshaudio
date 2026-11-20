/**
 * /og/[key].png: one Open Graph image per page, generated at build time.
 * BaseLayout derives the key from the page URL ("projects/soundstage"), so
 * every new page or entry gets a card automatically.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderArticleOgImage, renderOgImage } from '../../lib/og';
import { copy, site } from '../../lib/site';
import { getPublishedProjects, getPublishedWriting } from '../../lib/content';
import { kindLabel, readingTime, statusLabel } from '../../lib/format';

const kickerLine = `${site.name} · ${site.city}`;

export const getStaticPaths = (async () => {
  const pages = [
    { key: 'home', eyebrow: kickerLine, title: site.fullName, portrait: true },
    { key: 'about', eyebrow: 'About', title: `${site.fullName}, known as ${site.name}`, portrait: true },
    { key: 'projects', eyebrow: kickerLine, title: copy.projects.title },
    { key: 'writing', eyebrow: kickerLine, title: copy.writing.title },
  ];
  const projects = (await getPublishedProjects()).map((p) => ({
    key: `projects/${p.id}`,
    eyebrow: statusLabel[p.data.status],
    title: p.data.title,
  }));
  // Writing gets the richer article card: subtitle, byline, reading time.
  const writing = (await getPublishedWriting({ includeUnlisted: true })).map((w) => ({
    key: `writing/${w.id}`,
    eyebrow: kindLabel[w.data.kind],
    title: w.data.title,
    article: { subtitle: w.data.description, meta: readingTime(w.body) },
  }));

  return [...pages, ...projects, ...writing].map(({ key, ...props }) => ({ params: { key }, props }));
}) satisfies GetStaticPaths;

type Props = { eyebrow: string; title: string; portrait?: boolean; article?: { subtitle: string; meta: string } };

export const GET: APIRoute = async ({ props }) => {
  const { eyebrow, title, portrait, article } = props as Props;
  const png = article
    ? await renderArticleOgImage({ eyebrow, title, ...article })
    : await renderOgImage({ eyebrow, title, portrait });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
