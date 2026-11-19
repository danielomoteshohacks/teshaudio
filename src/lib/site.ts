/**
 * Single source of truth for facts about Tesh and the site.
 *
 * Rule (see docs/guidelines.md): never invent biography, credits or project details.
 * Copy that Tesh has not written yet is neutral placeholder text marked with a
 * TODO comment here. The live site must never show the word "TODO".
 */

export type Social = { label: string; url: string; handle: string };

export const site = {
  name: 'Tesh',
  fullName: 'Daniel',
  // Production origin on Cloudflare Pages. Used by astro.config.mjs as `site`,
  // so canonical tags and the sitemap point here. Update if a custom domain
  // is added, otherwise search engines index the pages.dev address.
  url: 'https://teshaudio.pages.dev',
  title: 'Tesh: Music Producer & Spatial Audio Engineer',
  description:
    'Producer, composer, and audio software engineer building the future of how music is heard.',
  lang: 'en',
  location: 'Lagos, Nigeria',

  // TODO: Tesh to rewrite. Derived from the site title.
  roleStatement: 'Music producer and spatial audio engineer.',

  // TODO: Tesh to rewrite. Kept short because the Disciplines section below
  // the hero already lists every role.
  intro:
    'Daniel, known as Tesh, makes music and builds the software that shapes how it is heard. Based in Lagos, Nigeria.',

  // The five roles. Each line describes the craft, not credits or clients.
  // TODO: Tesh to rewrite the one-liners.
  disciplines: [
    { title: 'Music Producer', summary: 'Shaping songs from first idea to finished record.' },
    { title: 'Composer', summary: 'Writing music with a clear emotional intent.' },
    {
      title: 'Mix and Mastering Engineer',
      summary: 'Balancing, shaping and finishing records so they translate on every system.',
    },
    {
      title: 'Spatial Audio Software Engineer',
      summary: 'Building software that places sound around the listener.',
    },
    {
      title: 'Audio Experience Designer',
      summary: 'Designing how people discover, hear and feel audio.',
    },
  ],

  // Pull quote for the philosophy teaser on Home. Taken from the site
  // description, Tesh's own words. TODO: replace with a line from the essay.
  philosophyQuote: 'Building the future of how music is heard.',

  // Contact. Every item renders only if set; remove a line to hide it.
  email: 'danielomotesho.work@gmail.com',
  socials: [
    { label: 'GitHub', handle: 'danielomoteshohacks', url: 'https://github.com/danielomoteshohacks' },
    { label: 'Instagram', handle: 'tesholuwatosin', url: 'https://www.instagram.com/tesholuwatosin/' },
    // Add LinkedIn, SoundCloud or X here in the same shape when available.
  ] as Social[],
} as const;

/**
 * Page and section copy: headings, intros and search descriptions. Kept here
 * so every word on the site is editable in one place. This is neutral
 * placeholder copy describing each page, not facts about Tesh.
 * TODO: Tesh to review and rewrite in Tesh's own voice where wanted.
 */
export const copy = {
  home: {
    disciplines: { eyebrow: 'Disciplines', title: 'Five disciplines, one practice' },
    listening: {
      eyebrow: 'Listen',
      title: 'Featured listening',
      lead: 'Playback continues in the player at the bottom of the screen while you browse.',
    },
    building: { eyebrow: 'Work', title: 'Currently building' },
    writing: { eyebrow: 'Writing', title: 'Latest writing' },
    lab: { eyebrow: 'Lab', title: 'From the lab', lead: 'Interactive experiments with sound, built for the browser.' },
    contact: { eyebrow: 'Contact', title: 'Get in touch' },
  },
  music: {
    title: 'Listen',
    lead: 'Productions, compositions, mixes and masters. Playback continues in the player at the bottom of the screen while you browse.',
    description: 'Productions, compositions, mixes and masters by Tesh, plus loudness-matched before and after comparisons.',
    comparisons: {
      eyebrow: 'Mix and master',
      title: 'Before and after',
      lead: 'Both versions play in sync and at matched loudness, so the difference you hear is tone, balance and dynamics, not volume.',
    },
  },
  about: {
    skillsTitle: 'Areas of practice',
    backgroundTitle: 'Education and certification',
  },
  projects: {
    title: 'Projects',
    lead: 'Software for measuring, shaping and placing sound, and the tools behind the music.',
    description: 'Projects by Tesh: software for measuring, shaping and placing sound.',
  },
  writing: {
    title: 'Writing',
    lead: 'Essays, research and notes on music, sound, listening and spatial audio.',
    description: 'Essays, research and notes by Tesh on music, sound, listening and spatial audio.',
  },
  findings: {
    title: 'Findings',
    lead: 'Short notes on things discovered along the way: measurements, listening tests and small surprises.',
    description: 'Short-form discoveries by Tesh about sound, listening and audio software.',
  },
  philosophy: {
    title: 'On music, sound and how it is heard',
    description: 'Tesh on music, sound, the consumer audio experience and spatial audio.',
  },
  lab: {
    title: 'Lab',
    lead: 'Interactive experiments with sound, built for the browser with Web Audio and WebAssembly.',
    description: 'Interactive experiments with sound by Tesh, built for the browser.',
  },
} as const;

/** Primary navigation, in display order. */
export const nav = [
  { label: 'Music', href: '/music/' },
  { label: 'Work', href: '/projects/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'Findings', href: '/findings/' },
  { label: 'Philosophy', href: '/philosophy/' },
  { label: 'Lab', href: '/lab/' },
  { label: 'About', href: '/about/' },
] as const;
