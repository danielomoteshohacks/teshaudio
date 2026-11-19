/**
 * /og/[key].png: one Open Graph image per page, generated at build time.
 * BaseLayout derives the key from the page URL ("projects/acoustimorph"),
 * so every new page or entry gets a card automatically.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOgImage } from '../../lib/og';
import { copy, site } from '../../lib/site';
import { getPublishedLab, getPublishedProjects, getPublishedWriting } from '../../lib/content';
import { kindLabel } from '../../lib/format';

export const getStaticPaths = (async () => {
  const pages = [
    { key: 'home', eyebrow: site.roleStatement.replace(/\.$/, ''), title: site.name },
    { key: 'music', eyebrow: 'Music', title: copy.music.title },
    { key: 'about', eyebrow: 'About', title: `${site.fullName}, known as ${site.name}` },
    { key: 'projects', eyebrow: 'Work', title: copy.projects.title },
    { key: 'writing', eyebrow: 'Writing', title: copy.writing.title },
    { key: 'findings', eyebrow: 'Findings', title: copy.findings.title },
    { key: 'philosophy', eyebrow: 'Philosophy', title: copy.philosophy.title },
    { key: 'lab', eyebrow: 'Lab', title: copy.lab.title },
  ];
  const projects = (await getPublishedProjects()).map((p) => ({
    key: `projects/${p.id}`,
    eyebrow: 'Project',
    title: p.data.title,
  }));
  const writing = (await getPublishedWriting({ includeUnlisted: true })).map((w) => ({
    key: `writing/${w.id}`,
    eyebrow: kindLabel[w.data.kind],
    title: w.data.title,
  }));
  const lab = (await getPublishedLab()).map((l) => ({ key: `lab/${l.id}`, eyebrow: 'Lab', title: l.data.title }));

  return [...pages, ...projects, ...writing, ...lab].map(({ key, ...props }) => ({
    params: { key },
    props,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as { eyebrow: string; title: string });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
