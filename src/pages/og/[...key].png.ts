/**
 * /og/[key].png: one Open Graph image per page, generated at build time.
 * BaseLayout derives the key from the page URL ("projects/acoustimorph"),
 * so every new page or entry gets a card automatically.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderArticleOgImage, renderOgImage } from '../../lib/og';
import { copy, site } from '../../lib/site';
import { getPublishedLab, getPublishedProjects, getPublishedWriting } from '../../lib/content';
import { kindLabel, readingTime } from '../../lib/format';

export const getStaticPaths = (async () => {
  const pages = [
    { key: 'home', eyebrow: site.roleStatement.replace(/\.$/, ''), title: site.name },
    { key: 'music', eyebrow: 'Music', title: copy.music.title },
    { key: 'about', eyebrow: 'About', title: `${site.fullName}, known as ${site.name}` },
    { key: 'projects', eyebrow: 'Work', title: copy.projects.title },
    { key: 'writing', eyebrow: 'Writing', title: copy.writing.title },
    { key: 'findings', eyebrow: 'Findings', title: copy.findings.title },
    { key: 'ideas', eyebrow: 'Ideas', title: copy.ideas.title },
    { key: 'philosophy', eyebrow: 'Philosophy', title: copy.philosophy.title },
    { key: 'lab', eyebrow: 'Lab', title: copy.lab.title },
  ];
  const projects = (await getPublishedProjects()).map((p) => ({
    key: `projects/${p.id}`,
    eyebrow: 'Project',
    title: p.data.title,
  }));
  // Writing gets the richer article card: subtitle, byline, reading time.
  const writing = (await getPublishedWriting({ includeUnlisted: true })).map((w) => ({
    key: `writing/${w.id}`,
    eyebrow: kindLabel[w.data.kind],
    title: w.data.title,
    article: { subtitle: w.data.description, meta: readingTime(w.body) },
  }));
  const lab = (await getPublishedLab()).map((l) => ({ key: `lab/${l.id}`, eyebrow: 'Lab', title: l.data.title }));

  return [...pages, ...projects, ...writing, ...lab].map(({ key, ...props }) => ({
    params: { key },
    props,
  }));
}) satisfies GetStaticPaths;

type Props = { eyebrow: string; title: string; article?: { subtitle: string; meta: string } };

export const GET: APIRoute = async ({ props }) => {
  const { eyebrow, title, article } = props as Props;
  const png = article
    ? await renderArticleOgImage({ eyebrow, title, ...article })
    : await renderOgImage({ eyebrow, title });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
