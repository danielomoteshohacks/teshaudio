import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections (Content Layer API).
 *
 * Each collection pairs a loader (where the files live) with a Zod schema
 * (what the frontmatter must look like). A typo or missing field fails the
 * build with a clear error, instead of rendering a broken page in production.
 *
 * Pages must not call getCollection() directly. Use the helpers in
 * src/lib/content.ts so drafts are always filtered out of production builds.
 */

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['active', 'paused', 'shipped', 'concept']),
    role: z.string(),
    tech: z.array(z.string()),
    // z.url() rejects malformed links at build time rather than shipping a dead href.
    repoUrl: z.url().optional(),
    liveUrl: z.url().optional(),
    featured: z.boolean(),
    order: z.number(),
    // coerce turns the YAML date string into a real Date so it can be sorted and formatted.
    startDate: z.coerce.date(),
    // Defaults to false so finished entries do not need to declare it.
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    kind: z.enum(['essay', 'research', 'note']),
    tags: z.array(z.string()),
    draft: z.boolean(),
  }),
});

export const collections = { projects, writing };
