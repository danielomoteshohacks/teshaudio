/**
 * Prepares the site portrait from Tesh's original photo.
 *
 * Input:  src/assets/source/portrait-original.jpg (the untouched upload)
 * Output: src/assets/portrait.jpg (what the site imports)
 *
 * Usage: node scripts/prepare-portrait.mjs
 *
 * Why a script instead of a hand-edited export: the crop and grade are
 * recorded as numbers, so they can be reviewed, tweaked and re-run from the
 * original at any time, and the original is never overwritten.
 *
 * The crop: the original has a lot of empty wall above the head, so this
 * takes a tight 4:5 head-and-shoulders frame with about 12% headroom, centred
 * on the face. Coordinates are fractions of the upright image, so the script
 * still works if a larger copy of the same photo replaces the original.
 *
 * The grade is deliberately global and gentle (a touch of contrast and
 * warmth) so the photo sits naturally on both the warm light theme and the
 * dark one. Nothing is retouched: no smoothing, no local edits, no face or
 * skin changes.
 */
import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = join(root, 'src', 'assets', 'source', 'portrait-original.jpg');
const output = join(root, 'src', 'assets', 'portrait.jpg');

// .rotate() with no argument applies the camera's EXIF orientation, so the
// maths below works on the image as it is meant to be seen.
const upright = await sharp(input).rotate().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = upright.info;

// Frame: 4:5, bottom of the photo, horizontally centred on the face.
const cropH = Math.round(H * 0.7065);
const cropW = Math.round(cropH * 0.8);
const faceX = W * 0.479;
const left = Math.max(0, Math.min(W - cropW, Math.round(faceX - cropW / 2)));
const top = H - cropH;

await sharp(upright.data)
  .extract({ left, top, width: cropW, height: cropH })
  // Contrast +6% around mid-grey, so blacks do not crush.
  .linear(1.06, -128 * 0.06)
  // Warmth: a slight lift in red and a slight cut in blue. The grey wall
  // otherwise reads cold against the warm neutrals of the site.
  .recomb([
    [1.025, 0, 0],
    [0, 1, 0],
    [0, 0, 0.965],
  ])
  // sRGB with the profile kept, and a high quality JPEG, because this is a
  // master: Astro re-encodes it into AVIF and WebP at every served width.
  .withMetadata({ orientation: undefined })
  .jpeg({ quality: 93, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile(output);

console.log(`portrait.jpg: ${cropW} x ${cropH} from ${W} x ${H} (left ${left}, top ${top})`);
