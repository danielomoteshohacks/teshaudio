/**
 * Build-time Open Graph images: a branded 1200 x 630 card per page and per
 * article, which WhatsApp, LinkedIn and X show when a link is shared.
 *
 * Satori lays out the card and turns text into vector paths (so no fonts are
 * needed on the build machine), then sharp rasterises it to PNG. Satori reads
 * WOFF but not WOFF2, which is why the static @fontsource/inter package is a
 * dev dependency alongside the variable one the site uses.
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
    { name: 'Inter', data: await font(700), weight: 700 as const, style: 'normal' as const },
  ];
}

// Plain objects in the shape Satori expects (React-like elements), so no JSX
// runtime is needed for one image template.
type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

// Token values repeated here because Satori cannot read CSS custom properties.
const color = {
  surface: '#0c0d10',
  text: '#ededea',
  muted: '#a3a6ad',
  accent: '#8ea2ff',
  border: '#2a2d33',
};

export async function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  fonts ??= await loadFonts();
  // Long titles step down in size so they always fit in three lines.
  const titleSize = title.length > 60 ? 60 : title.length > 32 ? 72 : 88;

  const card = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      // Satori defaults to content-box: without this, the padding is added
      // to the 630px height and the footer row falls off the canvas.
      boxSizing: 'border-box',
      backgroundColor: color.surface,
      backgroundImage: `radial-gradient(circle at 85% 110%, rgba(47, 79, 224, 0.45), transparent 55%)`,
      color: color.text,
      fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: '20px' }, [
        h(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            border: `1.5px solid ${color.border}`,
            fontSize: '30px',
            fontWeight: 700,
          },
          'T',
        ),
        h('div', { fontSize: '26px', fontWeight: 500, color: color.muted, letterSpacing: '0.12em' }, eyebrow.toUpperCase()),
      ]),
      h(
        'div',
        {
          display: 'flex',
          fontSize: `${titleSize}px`,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.035em',
          maxWidth: '1000px',
        },
        title,
      ),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: '26px', color: color.muted }, [
        h('div', { display: 'flex', color: color.text, fontWeight: 500 }, site.name),
        h('div', { display: 'flex' }, new URL(site.url).host),
      ]),
    ],
  );

  const svg = await satori(card as never, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Article card: the title large on the site's stage-light background (deep
 * near-black, a cobalt pool and a warm amber glow, as in the Home hero), the
 * subtitle, and a byline with Tesh's portrait. Built for the shapes WhatsApp,
 * LinkedIn and X crop to: everything important sits inside the centre, away
 * from the edges that square crops cut off.
 */
let avatar: string | undefined;
async function loadAvatar() {
  // Read from the project root: at build time this module runs from a
  // compiled chunk. Cropped to the face (top of the 4:5 portrait) and
  // inlined, because Satori cannot fetch files.
  const buffer = await sharp(join(process.cwd(), 'src', 'assets', 'portrait.jpg'))
    .resize(220, 220, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

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
  fonts ??= await loadFonts();
  avatar ??= await loadAvatar();
  const titleSize = title.length > 56 ? 58 : title.length > 36 ? 68 : 80;

  const card = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '68px 80px',
      boxSizing: 'border-box',
      backgroundColor: '#0b0a0d',
      backgroundImage:
        'radial-gradient(circle at 92% 8%, rgba(43, 77, 255, 0.62), transparent 52%), radial-gradient(circle at 4% 104%, rgba(255, 154, 61, 0.34), transparent 46%)',
      color: color.text,
      fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '24px', fontWeight: 500, letterSpacing: '0.14em', color: '#ffb070' }, [
        h('div', { display: 'flex', width: '10px', height: '10px', borderRadius: '999px', backgroundColor: '#ffb070' }),
        eyebrow.toUpperCase(),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: '26px' }, [
        h(
          'div',
          { display: 'flex', fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', maxWidth: '1000px' },
          title,
        ),
        h('div', { display: 'flex', fontSize: '30px', fontWeight: 500, lineHeight: 1.3, color: '#cfd3dc', maxWidth: '920px' }, subtitle),
      ]),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        h('div', { display: 'flex', alignItems: 'center', gap: '20px' }, [
          { type: 'img', props: { src: avatar, width: 64, height: 64, style: { borderRadius: '999px', border: '2px solid rgba(142, 162, 255, 0.7)' } } },
          h('div', { display: 'flex', flexDirection: 'column' }, [
            h('div', { display: 'flex', fontSize: '26px', fontWeight: 700 }, `${site.firstName} (${site.name})`),
            h('div', { display: 'flex', fontSize: '22px', fontWeight: 500, color: color.muted }, meta),
          ]),
        ]),
        h('div', { display: 'flex', fontSize: '24px', color: color.muted }, new URL(site.url).host),
      ]),
    ],
  );

  const svg = await satori(card as never, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
