import type { ImageMetadata } from 'astro';

/**
 * Article photos in src/assets/photos/, looked up by file name.
 *
 * import.meta.glob runs at build time and returns only the files that exist,
 * so an article can name a photo before it has been added: the lookup simply
 * returns undefined and the page renders its fallback. Photos go through
 * Astro's image pipeline (AVIF/WebP, explicit size) like every other image.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const byName = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
);

export const getPhoto = (file: string) => byName.get(file);
