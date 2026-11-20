import { defineCollection, reference } from 'astro:content';
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
 * src/lib/content.ts so drafts and unlisted entries are filtered consistently.
 */

const markdown = (dir: string) => glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` });

// Audio is referenced by URL so files can move to Cloudflare R2 later without
// touching any component: a site path today, an https URL tomorrow.
const audioUrl = z
  .string()
  .refine((v) => v.startsWith('/') || v.startsWith('https://'), {
    message: 'Use a site path such as /audio/track.wav or a full https:// URL',
  });

const projects = defineCollection({
  loader: markdown('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // One line for cards and the page lead; the summary is the overview.
      tagline: z.string().optional(),
      summary: z.string(),
      // A short caveat shown on the project page (e.g. "not a medical device").
      note: z.string().optional(),
      // research: an ongoing study or tool shown as research, not a product.
      status: z.enum(['active', 'paused', 'shipped', 'concept', 'research']),
      // Optional and hidden until supplied: these are facts, never guessed.
      role: z.string().optional(),
      tech: z.array(z.string()).default([]),
      repoUrl: z.url().optional(),
      liveUrl: z.url().optional(),
      featured: z.boolean().default(false),
      order: z.number(),
      startDate: z.coerce.date().optional(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
      draft: z.boolean().default(false),
    }),
});

const writing = defineCollection({
  loader: markdown('writing'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    kind: z.enum(['essay', 'research', 'note', 'finding']),
    tags: z.array(z.string()).default([]),
    // Rendered as a numbered list at the end of the article.
    references: z
      .array(
        z.object({
          title: z.string(),
          authors: z.string().optional(),
          publisher: z.string().optional(),
          year: z.number().int().optional(),
          url: z.url().optional(),
        }),
      )
      .default([]),
    relatedProject: reference('projects').optional(),
    // Unlisted: built and reachable by URL, but kept out of every list, the
    // RSS feed and the sitemap, and marked noindex.
    unlisted: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const tracks = defineCollection({
  loader: markdown('tracks'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      roles: z.array(z.enum(['producer', 'composer', 'mix', 'master'])).default([]),
      year: z.number().int(),
      genre: z.string(),
      // Stored rather than read from the file so lists can show it without
      // downloading any audio, which keeps pages fast.
      durationSeconds: z.number().positive(),
      audioUrl,
      artwork: image().optional(),
      credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      // Labels synthetic test tones on the page so they are never mistaken for music.
      testAudio: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

// One version of an A/B comparison. lufs is the file's measured integrated
// loudness; the player uses it to play both versions at equal loudness.
const version = z.object({
  label: z.string(),
  audioUrl,
  lufs: z.number().max(0),
});

const comparisons = defineCollection({
  loader: markdown('comparisons'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stage: z.enum(['mix', 'master']),
    a: version,
    b: version,
    order: z.number().default(0),
    testAudio: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const lab = defineCollection({
  loader: markdown('lab'),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['live', 'coming-soon']),
    relatedProject: reference('projects').optional(),
    // External place the demo runs (e.g. a Hugging Face Space), if any.
    demoUrl: z.url().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing, tracks, comparisons, lab };
