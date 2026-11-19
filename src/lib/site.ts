/**
 * Single source of truth for facts about Tesh and the site.
 *
 * Rule (see CLAUDE.md): never invent biography, credits or project details.
 * Copy that Tesh has not written yet is neutral placeholder text marked with a
 * TODO comment here. The live site must never show the word "TODO".
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
  title: 'Tesh: Music Producer & Spatial Audio Engineer',
  description:
    'Producer, composer, and audio software engineer building the future of how music is heard.',
  lang: 'en',
  location: 'Lagos, Nigeria',

  // Tesh's own words.
  roleStatement: 'I make music, and I build the software that shapes how it’s heard.',
  intro:
    'I’m Daniel. I produce, write and mix records, and I study the physics underneath them: acoustics, signal processing, and how the ear actually takes sound in. This is where I keep the work, the research, and what I’m learning along the way.',

  disciplines: [
    { title: 'Music Producer', summary: 'Building records from the first idea to the final bounce.' },
    { title: 'Composer', summary: 'Writing the melodies, chords and arrangements a record stands on.' },
    {
      title: 'Mix and Mastering Engineer',
      summary:
        'Balancing and finishing records so they hold up everywhere, from studio monitors to a phone speaker.',
    },
    {
      title: 'Spatial Audio Software Engineer',
      summary: 'Building engines that place sound around the listener, without depending on special hardware.',
    },
    {
      title: 'Audio Experience Designer',
      summary: 'Thinking about how audio feels to the person on the other end: the earbuds, the car, the app.',
    },
  ],

  // "What I'm doing now" on Home. Each item is HTML-free text; `href`
  // optionally links the item. Update as things change.
  now: [
    {
      text: 'Building Stage, a spatial audio engine for any song on any phone.',
      href: '/projects/stage/',
    },
    {
      text: 'Working through Kinsler’s Fundamentals of Acoustics and Li and Cox’s Digital Signal Processing in Audio and Acoustical Engineering.',
    },
  ] as { text: string; href?: string }[],

  // Pull quote for the philosophy teaser on Home.
  philosophyQuote: 'Your ears are the one piece of gear you can’t replace.',

  // Contact. Every item renders only if set; remove a line to hide it.
  email: 'danielomotesho.work@gmail.com',
  socials: [
    { label: 'GitHub', handle: 'danielomoteshohacks', url: 'https://github.com/danielomoteshohacks' },
    { label: 'Instagram', handle: 'tesholuwatosin', url: 'https://www.instagram.com/tesholuwatosin/' },
    // Add LinkedIn, SoundCloud or X here in the same shape when available.
  ] as Social[],
} as const;

/**
 * Page and section copy: headings, intros and search descriptions, kept here
 * so every word on the site is editable in one place. Short and plain on
 * purpose: these frame Tesh's own words rather than speak for Tesh.
 */
export const copy = {
  home: {
    now: { eyebrow: 'Now', title: 'What I’m doing now' },
    disciplines: { eyebrow: 'Disciplines', title: 'Five disciplines, one practice' },
    listening: {
      eyebrow: 'Listen',
      title: 'Featured listening',
      lead: 'Playback continues in the player at the bottom of the screen while you browse.',
    },
    building: { eyebrow: 'Work', title: 'What I’m building' },
    writing: { eyebrow: 'Writing', title: 'Latest writing' },
    ideas: { eyebrow: 'Ideas', title: 'Ideas I’m exploring' },
    lab: { eyebrow: 'Lab', title: 'From the lab', lead: 'Small tools and demos you can try in the browser.' },
    contact: { eyebrow: 'Contact', title: 'Get in touch' },
  },
  music: {
    title: 'Listen',
    lead: 'Records I’ve produced, written, mixed and mastered. Playback continues in the player at the bottom of the screen while you browse.',
    empty: 'My first releases on this site are coming soon.',
    description: 'Music by Tesh: productions, compositions, mixes and masters.',
    comparisons: {
      eyebrow: 'Mix and master',
      title: 'Before and after',
      lead: 'Both versions play in sync and at matched loudness, so the difference you hear is tone, balance and dynamics, not volume.',
    },
  },
  about: {
    skillsTitle: 'What I work on',
  },
  projects: {
    title: 'Projects',
    lead: 'Tools for hearing, measuring and placing sound.',
    description: 'Audio projects by Tesh: hearing health, spatial audio and acoustic measurement.',
  },
  ideas: {
    title: 'Ideas I’m exploring',
    lead: 'Things I want to build or understand next. Notes, not promises.',
    description: 'Audio ideas Tesh is exploring.',
  },
  writing: {
    title: 'Writing',
    lead: 'Research, essays and notes on music, sound, listening and spatial audio.',
    description: 'Research, essays and notes by Tesh on music, sound, listening and spatial audio.',
  },
  findings: {
    title: 'Findings',
    lead: 'Short notes on things I’ve noticed along the way.',
    description: 'Short-form discoveries by Tesh about sound, listening and audio software.',
  },
  philosophy: {
    title: 'How I think about sound',
    description: 'Tesh on music, sound, the consumer audio experience and spatial audio.',
  },
  lab: {
    title: 'Lab',
    lead: 'Small tools and demos you can try in the browser.',
    description: 'Audio tools and demos by Tesh that run in the browser.',
  },
} as const;

/** Primary navigation, in display order. */
export const nav = [
  { label: 'Music', href: '/music/' },
  { label: 'Work', href: '/projects/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'Findings', href: '/findings/' },
  { label: 'Ideas', href: '/ideas/' },
  { label: 'Philosophy', href: '/philosophy/' },
  { label: 'Lab', href: '/lab/' },
  { label: 'About', href: '/about/' },
] as const;
