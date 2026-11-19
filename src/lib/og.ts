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
