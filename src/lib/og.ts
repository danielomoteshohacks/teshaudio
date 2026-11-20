/**
 * Build-time Open Graph images (1200 x 630): what WhatsApp, LinkedIn and X
 * show when a link is shared. Same visual language as the site: a deep
 * blue-black ground, large tight type, one cobalt hairline waveform, the
 * amber used once. No gradients or effects.
 *
 * Satori lays out the card and turns text into vector paths, then sharp
 * rasterises it. Satori reads WOFF but not WOFF2, which is why the static
 * @fontsource/inter package is a dev dependency alongside the variable one.
 */
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { site } from './site';

const require = createRequire(import.meta.url);
const font = (weight: number) =>
  readFile(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));

let fonts: Awaited<ReturnType<typeof loadFonts>> | undefined;
async function loadFonts() {
  return [
    { name: 'Inter', data: await font(500), weight: 500 as const, style: 'normal' as const },
    { name: 'Inter', data: await font(600), weight: 600 as const, style: 'normal' as const },
  ];
}

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

// Token values repeated here because Satori cannot read CSS custom properties
// (dark mode values from tokens.css).
const color = {
  bg: '#0a0c12',
  text: '#eceef3',
  text2: '#9aa1b2',
  text3: '#8b92a3',
  line: '#2a2e38',
  accent: '#5b8cff',
  warm: '#f2b45a',
};

/** The signature waveform as an SVG data URL (Satori renders it as an image). */
function waveform(width: number, height: number) {
  const mid = height / 2;
  let d = '';
  for (let x = 0; x <= width; x += 3) {
    const t = x / width;
    const env = 0.08 + 0.9 * Math.exp(-(((t - 0.3) / 0.09) ** 2)) + 0.55 * Math.exp(-(((t - 0.72) / 0.07) ** 2));
    const wave = Math.sin(x * 0.21) * 0.7 + Math.sin(x * 0.067) * 0.3;
    d += `${x ? 'L' : 'M'}${x} ${(mid - Math.min(1, env) * (mid - 2) * wave).toFixed(1)}`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${d}" fill="none" stroke="${color.line}" stroke-width="1.5"/><clipPath id="c"><rect x="${width * 0.2}" width="${width * 0.2}" height="${height}"/></clipPath><path d="${d}" fill="none" stroke="${color.accent}" stroke-width="2" clip-path="url(#c)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

let avatar: string | undefined;
let portrait: string | undefined;
// Read from the project root: at build time this module runs from a
// compiled chunk. The files are the prepared portrait crops (see
// scripts/prepare-portrait.mjs), inlined because Satori cannot fetch files.
const portraitFile = (name: string) => join(process.cwd(), 'src', 'assets', 'portrait', name);
async function loadAvatar() {
  const buffer = await sharp(portraitFile('avatar-192.jpg')).resize(104, 104).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}
async function loadPortrait() {
  // The 480px hero crop is already resampled for the stripes; shown at
  // 400 x 500 on the card, the small step down does not alias.
  const buffer = await sharp(portraitFile('hero-480.jpg')).resize(400, 500).jpeg({ quality: 88 }).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function toPng(card: Node) {
  fonts ??= await loadFonts();
  const svg = await satori(card as never, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

const frame = (children: Node[]) =>
  h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 80px 56px',
      boxSizing: 'border-box',
      backgroundColor: color.bg,
      color: color.text,
      fontFamily: 'Inter',
    },
    children,
  );

const kicker = (text: string) =>
  h('div', { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '26px', fontWeight: 500, color: color.text3 }, [
    h('div', { display: 'flex', width: '9px', height: '9px', borderRadius: '999px', backgroundColor: color.warm }),
    text,
  ]);

const footer = (left: Node, width = 1040) =>
  h('div', { display: 'flex', flexDirection: 'column', gap: '28px', width: `${width}px` }, [
    { type: 'img', props: { src: waveform(width, 44), width, height: 44 } },
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      left,
      h('div', { display: 'flex', fontSize: '24px', color: color.text3 }, new URL(site.url).host),
    ]),
  ]);

/**
 * A page card: a kicker and a large title. With `portrait` (Home, About),
 * the portrait stands on the right in a rounded frame, lit from behind like
 * the hero on the site.
 */
export async function renderOgImage({ eyebrow, title, portrait: withPortrait = false }: { eyebrow: string; title: string; portrait?: boolean }) {
  const size = title.length > 40 ? (withPortrait ? 64 : 76) : withPortrait ? 84 : 96;
  const card = frame([
    kicker(eyebrow),
    h('div', { display: 'flex', fontSize: `${size}px`, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.045em', maxWidth: withPortrait ? '600px' : '1000px' }, title),
    footer(h('div', { display: 'flex', fontSize: '26px', fontWeight: 600 }, site.fullName), withPortrait ? 620 : 1040),
  ]);
  if (!withPortrait) return toPng(card);
  portrait ??= await loadPortrait();
  return toPng(
    h('div', { width: '100%', height: '100%', display: 'flex', position: 'relative', backgroundColor: color.bg }, [
      card,
      h('div', {
        position: 'absolute',
        top: '40px',
        right: '40px',
        width: '440px',
        height: '550px',
        display: 'flex',
        borderRadius: '28px',
        border: `1px solid ${color.line}`,
        overflow: 'hidden',
        backgroundImage: `url(${portrait})`,
        backgroundSize: '440px 550px',
      }),
    ]),
  );
}

/** An article card: kicker, title, subtitle and a byline with the portrait. */
export async function renderArticleOgImage({
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string;
}) {
  avatar ??= await loadAvatar();
  const size = title.length > 56 ? 56 : title.length > 36 ? 66 : 80;
  return toPng(
    frame([
      kicker(eyebrow),
      h('div', { display: 'flex', flexDirection: 'column', gap: '22px' }, [
        h('div', { display: 'flex', fontSize: `${size}px`, fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.04em', maxWidth: '1020px' }, title),
        h('div', { display: 'flex', fontSize: '30px', fontWeight: 500, lineHeight: 1.3, color: color.text2, maxWidth: '940px' }, subtitle),
      ]),
      footer(
        h('div', { display: 'flex', alignItems: 'center', gap: '18px' }, [
          { type: 'img', props: { src: avatar, width: 52, height: 52, style: { borderRadius: '999px', border: `1px solid ${color.line}` } } },
          h('div', { display: 'flex', fontSize: '24px', fontWeight: 600 }, site.fullName),
          h('div', { display: 'flex', fontSize: '24px', color: color.text3 }, meta),
        ]),
      ),
    ]),
  );
}
