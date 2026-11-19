/**
 * Generates the placeholder portrait at src/assets/portrait.jpg: a soft
 * gradient with a geometric "T" monogram. Never a stock photo.
 *
 * Usage: node scripts/generate-portrait-placeholder.mjs
 * To use a real photo instead, replace src/assets/portrait.jpg with any JPEG
 * (portrait orientation, at least 1200 x 1500) and keep the file name.
 *
 * The monogram is drawn as rectangles, not text, so the image renders the
 * same on every machine regardless of installed fonts. A little noise is
 * blended in because smooth gradients band visibly once compressed.
 */
import sharp from 'sharp';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 1500;
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'portrait.jpg');

// Monogram proportions: a crossbar and a stem with softly rounded corners.
const barW = 400, barH = 48, stemW = 48, stemH = 380;
const x = (W - barW) / 2;
const y = 560;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#eef0f6"/>
      <stop offset="1" stop-color="#dfe3ef"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.88" r="0.75">
      <stop offset="0" stop-color="#2f4fe0" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#2f4fe0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="light" cx="0.15" cy="0.08" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#base)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#light)"/>
  <g fill="#121316">
    <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="6"/>
    <rect x="${(W - stemW) / 2}" y="${y}" width="${stemW}" height="${stemH}" rx="6"/>
  </g>
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(out);
console.log(`Wrote ${out}`);
