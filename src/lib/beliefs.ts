/**
 * What Tesh believes about sound: the one source for every belief on the
 * site. About sets all seven in full; Home quotes three of them by id. Both
 * read from here, so a line on Home can never drift from the text on About.
 *
 * The wording is Tesh's own and must not be edited, trimmed or reordered
 * without Tesh asking. Apostrophes are curly (U+2019), like the rest of the
 * site's copy.
 */

export type Belief = {
  /** Stable key. The anchor on About is derived from it (see beliefAnchor). */
  id: string;
  /** Shown as "01" to "07", in tabular figures. */
  number: string;
  headline: string;
  body: string;
};

export const beliefs = [
  {
    id: 'spiritual',
    number: '01',
    headline: 'Music is spiritual.',
    body: 'It’s one of the few things that connects people all over the world. A song can move someone in Lagos and someone in Tokyo, even when they don’t share a single word.',
  },
  {
    id: 'tickles',
    number: '02',
    headline: 'Music tickles me.',
    body: 'That’s the simplest way I can put it. It makes me feel alive, and I’ve never needed a better reason to chase it.',
  },
  {
    id: 'ears',
    number: '03',
    headline: 'Our ears were made with intention.',
    body: 'The more I study the ear, the less I believe any of it is an accident. The outer ear shapes every sound before it reaches you. The cochlea sorts sound by frequency. Tiny differences between your two ears tell you exactly where a sound is coming from. God didn’t put all that detail there for nothing. I believe part of the reason is so we can feel music, film and everyday life with real depth.',
  },
  {
    id: 'deafness',
    number: '04',
    headline: 'We underrate deafness.',
    body: 'Everyone agrees that losing your sight is one of the hardest things that can happen to a person. We rarely say the same about losing your hearing. Wear good noise-cancelling headphones for a few hours with nothing playing, and the quiet starts to feel heavy. Now imagine that silence never lifting. That’s why I take hearing seriously.',
  },
  {
    id: 'real',
    number: '05',
    headline: 'Sound should feel real.',
    body: 'Music and movies deserve to be experienced as close to reality as possible, with space, depth and detail you can almost touch.',
  },
  {
    id: 'budget',
    number: '06',
    headline: 'Great sound shouldn’t depend on your budget.',
    body: 'Whatever phone or headphones you own, you deserve a great experience with music, movies, games and anything else made with sound.',
  },
  {
    id: 'felt',
    number: '07',
    headline: 'Content should be felt, not just played.',
    body: 'Music, movies and podcasts are everywhere now, but they can feel flat when all you do is hear them. I want to build experiences that let everyone feel them.',
  },
] as const satisfies readonly Belief[];

export type BeliefId = (typeof beliefs)[number]['id'];

/** One belief by id. Throws on an unknown id, so a typo fails the build. */
export function getBelief(id: BeliefId): Belief {
  const belief = beliefs.find((b) => b.id === id);
  if (!belief) throw new Error(`Unknown belief: ${id}`);
  return belief;
}

/** The element id of a belief's row on About: "belief-spiritual". */
export const beliefId = (id: BeliefId) => `belief-${id}`;

/**
 * Where a link to a belief lands: its row on About. The trailing slash
 * matches the site's trailingSlash setting, so Cloudflare never redirects
 * and drops the hash.
 */
export const beliefHref = (id: BeliefId) => `/about/#${beliefId(id)}`;

/** The first sentence of a belief's body, cut from the body itself so it can never drift. */
export function firstSentence(belief: Belief): string {
  const match = belief.body.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : belief.body;
}
