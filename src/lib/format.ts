/**
 * Small formatting helpers shared by pages and components, so dates, times
 * and durations read identically everywhere on the site.
 */

// en-GB gives "19 Nov 2026": day first, unambiguous for an international audience.
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date) => dateFormat.format(date);

/** Machine-readable form for <time datetime="...">. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/**
 * 125 -> "2:05". Used for track durations and player time readouts.
 * Positions floor (a clock never shows a second before it has passed);
 * totals round, because decoded audio is often a hair short of its nominal
 * length and an 8 s clip would otherwise read "0:07".
 */
export function formatDuration(totalSeconds: number, { total = false } = {}) {
  const s = Math.max(0, total ? Math.round(totalSeconds) : Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Spoken form for screen readers: 125 -> "2 minutes 5 seconds". */
export function spokenDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const parts = [];
  if (m) parts.push(`${m} minute${m === 1 ? '' : 's'}`);
  if (s % 60 || !m) parts.push(`${s % 60} second${s % 60 === 1 ? '' : 's'}`);
  return parts.join(' ');
}

/**
 * Reading time at about 230 words per minute, a common average for adult
 * readers of non-fiction. MDX tags and code fences are stripped first so
 * markup does not inflate the count.
 */
export function readingTime(body = '') {
  const text = body
    // MDX import lines are code, not prose.
    .replace(/^import .*$/gm, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 230))} min read`;
}

export const kindLabel = {
  essay: 'Essay',
  research: 'Research',
  note: 'Note',
  finding: 'Finding',
} as const;

// Plain-language labels: "Live" reads better than "shipped" to a listener.
export const statusLabel = {
  active: 'In development',
  paused: 'Paused',
  shipped: 'Live',
  concept: 'In design',
  live: 'Live',
  'coming-soon': 'Coming soon',
} as const;

export const roleLabel = {
  producer: 'Producer',
  composer: 'Composer',
  mix: 'Mix',
  master: 'Master',
} as const;
