/**
 * Everything on the About page, as structured data in one file.
 * Facts here come only from Tesh. The site is strictly about audio, and Tesh
 * is never described as an engineer (see CLAUDE.md).
 */

export type Skill = { title: string; note: string };

export const about = {
  // One string per paragraph, in Tesh's words.
  bio: [
    'I’m Daniel Omotesho, and most people call me Tesh. I’m a music producer and composer, and I make records in FL Studio and Cubase.',
    'Making records pulled me into the science underneath them. I wanted to understand why a mix sounds right in one room and falls apart in a car, why some records tire your ears and others don’t, and why spatial audio still depends on which phone you bought. So I’m building tools to answer those questions.',
  ],

  education: 'Electrical/Electronic Engineering student, University of Lagos.',

  // "What I do". Notes reuse Tesh's earlier wording for each area.
  skills: [
    { title: 'Music production', note: 'Full records from first idea to final arrangement, in FL Studio and Cubase.' },
    { title: 'Composition', note: 'Writing the melodies, chords and arrangements a record stands on.' },
    { title: 'Mixing and mastering', note: 'Balance, depth and translation across real playback systems.' },
    { title: 'Sound design', note: 'Shaping sounds and textures that give a record its identity.' },
    { title: 'Spatial audio', note: 'Placing sound in space with depth, not gimmicks.' },
    { title: 'Building audio software', note: 'Tools for hearing, measuring and placing sound, in Python and Web Audio.' },
  ] as Skill[],
} as const;
