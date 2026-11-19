/**
 * Single source of truth for facts about Tesh and the site.
 *
 * Rules (see CLAUDE.md): never invent biography, credits or project details,
 * and never describe Tesh as an engineer. Tesh is a music producer and
 * composer, building audio software, and studying Electrical/Electronic
 * Engineering at the University of Lagos.
 */

export type Social = { label: string; url: string; handle: string };

export const site = {
  name: 'Tesh',
  fullName: 'Daniel Omotesho',
  firstName: 'Daniel',
  // Production origin on Cloudflare Pages. Used by astro.config.mjs as `site`,
  // so canonical tags and the sitemap point here. Update if a custom domain
  // is added, otherwise search engines index the pages.dev address.
  url: 'https://teshaudio.pages.dev',
  title: 'Daniel Omotesho (Tesh): music producer and composer',
  description:
    'Music producer and composer from Lagos, building SoundStage, a spatial audio engine for any song on any phone.',
  lang: 'en',
  city: 'Lagos',
  location: 'Lagos, Nigeria',

  // The Home hero intro, in Tesh's words.
  intro:
    'I’m a music producer and composer, building SoundStage, a spatial audio engine for any song on any phone, while studying Electrical/Electronic Engineering at the University of Lagos.',

  // The one line in the "What I believe" band on Home.
  belief: 'Your ears are the one piece of gear you can’t replace.',

  // Author note at the end of every article.
  authorNote: 'Daniel Omotesho is a music producer and composer from Lagos, building SoundStage.',

  // Contact. Every item renders only if set; remove a line to hide it.
  email: 'danielomotesho.work@gmail.com',
  // Only GitHub is shown, as Tesh asked. Add others here in the same shape.
  socials: [
    { label: 'GitHub', handle: 'danielomoteshohacks', url: 'https://github.com/danielomoteshohacks' },
  ] as Social[],
} as const;

/** Page copy: headings and search descriptions, editable in one place. */
export const copy = {
  home: {
    storyCta: 'Read the story',
    workCta: 'See the work',
    workTitle: 'Work',
    storyLabel: 'Featured story',
    beliefLink: 'More about how I think',
  },
  projects: {
    title: 'Work',
    lead: 'What I’m building now.',
    description: 'Projects by Daniel Omotesho (Tesh): SoundStage and Beyond the Decibel.',
  },
  writing: {
    title: 'Writing',
    lead: 'Essays on sound, listening and the tools I’m building.',
    description: 'Writing by Daniel Omotesho (Tesh) on sound, listening and spatial audio.',
  },
  about: {
    description: 'About Daniel Omotesho (Tesh), a music producer and composer from Lagos.',
    doTitle: 'What I do',
    believeTitle: 'What I believe about sound',
    educationTitle: 'Education',
  },
} as const;

/** Primary navigation, in display order. */
export const nav = [
  { label: 'Work', href: '/projects/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
] as { label: string; href: string }[];
