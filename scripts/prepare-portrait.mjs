/**
 * Prepares every size of the site portrait from the original photo.
 *
 * Input:  src/assets/source/portrait-original.jpg (the untouched photo,
 *         stored upright and without metadata)
 * Output: src/assets/portrait/hero-<width>.jpg   4:5 head and shoulders
 *         src/assets/portrait/avatar-<width>.jpg square, tight on the face
 *
 * Usage: node scripts/prepare-portrait.mjs
 *
 * Why every size is made here instead of letting the image pipeline resize
 * one master: the shirt has fine stripes. Downscaled naively, stripes that
 * fall close to the pixel grid alias into moire (wavy shimmering bands). So
 * each width is resampled once, from the full-resolution crop, with Lanczos
 * (sharp's highest-quality kernel), and the widths that showed moire when
 * checked by eye get a very slight blur first (see `preBlur`). The build
 * then only re-encodes each file to AVIF and WebP at its own width, so no
 * second resample can bring the moire back.
 *
 * The crops: the photo has a lot of empty wall above the head. The hero
 * frame puts the face in the upper third with a little air above the hair
 * and the shoulders filling the bottom edge. The avatar is a tight
 * head-and-shoulders square centred on the face, for round bylines.
 * Coordinates are fractions of the upright photo, so a larger copy of the
 * same photo still crops the same way.
 *
 * Colour: none. No grade, no skin or face changes. Only a neutral sRGB
 * conversion, and every output is written without EXIF (no device, date or
 * location), because the image pipeline copies nothing it is not given.
 */
import sharp from 'sharp';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = join(root, 'src', 'assets', 'source', 'portrait-original.jpg');
const outDir = join(root, 'src', 'assets', 'portrait');

// Measured on the upright photo, as fractions of its width and height.
const face = { x: 0.51, hairTop: 0.4, chin: 0.78 };

const crops = {
  // 4:5, bottom-aligned (the shoulders run off the bottom of the photo).
  // Height 0.665 of the photo leaves about 10% of the frame above the hair.
  hero: { aspect: 4 / 5, height: 0.665, centreY: null },
  // Square, a little below the face centre so the collar is in frame.
  avatar: { aspect: 1, height: 0.48, centreY: 0.6 },
};

// The widths each use is served at (Portrait.astro reads the same list from
// the file names). preBlur is the Gaussian sigma applied to the full-size
// crop before resampling, only where the stripes aliased without it.
const sizes = {
  hero: [
    { width: 480, preBlur: 3 },
    { width: 720, preBlur: 0 },
    { width: 960, preBlur: 0 },
    { width: 1280, preBlur: 0 },
    { width: 1600, preBlur: 0 },
  ],
  avatar: [
    { width: 96, preBlur: 0 },
    { width: 192, preBlur: 0 },
    { width: 440, preBlur: 0 },
  ],
};

const { data, info } = await sharp(input).rotate().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const raw = { raw: { width: W, height: H, channels: info.channels } };

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const [name, crop] of Object.entries(crops)) {
  const cropH = Math.round(H * crop.height);
  const cropW = Math.round(cropH * crop.aspect);
  const left = clamp(Math.round(W * face.x - cropW / 2), 0, W - cropW);
  const top = crop.centreY === null ? H - cropH : clamp(Math.round(H * crop.centreY - cropH / 2), 0, H - cropH);
  const region = await sharp(data, raw).extract({ left, top, width: cropW, height: cropH }).raw().toBuffer();

  for (const { width, preBlur } of sizes[name]) {
    const shape = { raw: { width: cropW, height: cropH, channels: info.channels } };
    // The blur runs in its own pass: in a single sharp pipeline it would be
    // applied after the resize, at the small size, and soften far too much.
    const source = preBlur > 0 ? await sharp(region, shape).blur(preBlur).raw().toBuffer() : region;
    await sharp(source, shape)
      .resize({ width, kernel: 'lanczos3' })
      // A high-quality master: the build re-encodes it to AVIF and WebP.
      .jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toFile(join(outDir, `${name}-${width}.jpg`));
  }
  console.log(`${name}: ${cropW} x ${cropH} from ${W} x ${H} (left ${left}, top ${top})`);
}

console.log((await readdir(outDir)).join('\n'));

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
