/**
 * Everything on the About page, as structured data in one file.
 * Facts here come only from Tesh. The site is strictly about audio, so only
 * audio-related background belongs here.
 */

export type Skill = { title: string; note: string };

export const about = {
  // One string per paragraph.
  bio: [
    'I’m Daniel Omotesho, and most people call me Tesh. I’m a music producer and engineer, and I work professionally in FL Studio and Cubase.',
    'Making records pulled me into the engineering underneath them. I wanted to understand why a mix sounds right in one room and falls apart in a car, why some records tire your ears and others don’t, and why spatial audio still depends on which phone you bought. So I build tools to answer those questions.',
  ],

  education: 'Electrical/Electronic Engineering student, University of Lagos.',

  skills: [
    { title: 'Production (FL Studio, Cubase)', note: 'Full records from first idea to final arrangement.' },
    { title: 'Mixing and Mastering', note: 'Balance, depth and translation across real playback systems.' },
    { title: 'Sound Design', note: 'Shaping sounds and textures that give a record its identity.' },
    { title: 'Spatial Audio', note: 'Placing sound in space with depth, not gimmicks.' },
    { title: 'Audio DSP and Software', note: 'Building audio tools with Python, Web Audio, and Rust/WebAssembly.' },
    { title: 'Audio Experience Design', note: 'Designing how audio feels in products, from earbuds to apps.' },
  ] as Skill[],
} as const;
