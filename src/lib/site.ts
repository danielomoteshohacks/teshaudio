/**
 * Single source of truth for facts about Tesh and the site.
 *
 * Rules (see docs/guidelines.md): never invent biography, credits or project details,
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

  // Author note at the end of every article.
  authorNote: 'Daniel Omotesho is a music producer and composer from Lagos, building SoundStage.',

  // Contact. Every item renders only if set; remove a line to hide it.
  email: 'danielomotesho.work@gmail.com',
  // Only GitHub is shown for now. Add others here in the same shape.
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
    // The beliefs quoted on Home (a headline and a few lines) live in
    // src/lib/beliefs.ts, with About's full text.
    beliefLink: 'What I believe',
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

/**
 * "Work with me": the full section on Home (between the work and the closing
 * band) and its short version at the end of About (label, heading, intro and
 * the buttons). In Tesh's words; the email and GitHub buttons use `email`
 * and `socials` above, so the address lives in one place.
 */
export const workWithMe = {
  label: 'Work with me',
  heading: 'Let’s make something together.',
  intro:
    'I’m open to collaborations and projects with artists, producers, teams and researchers who care about how things sound. If sound is part of what you’re making, I’d love to hear about it. I’m based in Lagos and happy to work with people anywhere.',
  areas: [
    {
      title: 'Music production',
      body: 'From the first idea to a finished record. I produce and compose in FL Studio and Cubase, and I care about arrangement, feel and the small details that make a song stay with people.',
    },
    {
      title: 'Mixing and mastering',
      body: 'Giving your record clarity, depth and weight, and making sure it holds up wherever it’s played: earbuds, car speakers, club systems and everything in between.',
    },
    {
      title: 'Audio experience and software',
      body: 'Designing and building products where sound is the experience: spatial audio, listening features, and interactive audio for the web and mobile.',
    },
    {
      title: 'Research on sound',
      body: 'Hearing, loudness, perception, and how people actually experience audio. I enjoy reading the science carefully, testing ideas, and explaining what I find in plain language.',
    },
  ],
  closing: 'Tell me what you’re working on, where it’s at and what you need. I’ll get back to you.',
  emailLabel: 'Email me',
  githubLabel: 'GitHub',
} as const;

/** Primary navigation, in display order. */
export const nav = [
  { label: 'Work', href: '/projects/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
] as { label: string; href: string }[];
