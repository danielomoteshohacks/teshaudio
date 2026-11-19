/**
 * Everything on the About page, as structured data in one file.
 *
 * Facts here come only from Tesh. Anything not yet supplied is an empty list
 * or neutral placeholder copy with a TODO comment; the page renders a calm
 * "coming soon" state for empty groups instead of inventing detail.
 */

export type SkillGroup = { title: string; skills: string[] };

export const about = {
  // TODO: Tesh's long bio. One string per paragraph.
  bio: [
    'Daniel, known as Tesh, makes music and builds the software that shapes how it is heard. Tesh works across music production, composition, mixing and mastering, spatial audio software and audio experience design, from Lagos, Nigeria.',
    'A longer biography is coming soon.',
  ],

  // TODO: list skills in each group. Empty groups show "Details coming soon".
  skillGroups: [
    { title: 'Music Production and Composition', skills: [] },
    { title: 'Mixing and Mastering', skills: [] },
    { title: 'DSP and Audio Software', skills: [] },
    { title: 'Machine Learning', skills: [] },
    { title: 'Software Engineering', skills: [] },
    { title: 'Security', skills: [] },
  ] as SkillGroup[],

  // Degree level and dates are not listed until Tesh supplies them.
  education: [
    { institution: 'University of Lagos', field: 'Electrical/Electronic Engineering' },
    { institution: 'University of the People', field: 'Computer Science' },
  ],

  certifications: [{ name: 'Certified in Cybersecurity (CC)', issuer: 'ISC2' }],

  // TODO: tools, instruments and gear. Empty shows "Details coming soon".
  tools: [] as string[],
} as const;
