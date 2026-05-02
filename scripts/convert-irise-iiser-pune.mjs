/**
 * iRISE India @ IISER Pune — scientific illustration workshop PNG → WebP (small files).
 * Run: node scripts/convert-irise-iiser-pune.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const ASSETS_DIR =
  process.env.WORKSHOP_ASSETS ||
  path.join(
    'C:',
    'Users',
    'User',
    '.cursor',
    'projects',
    'd-apps-webapps-rafeeque-com',
    'assets'
  );

const OUT_DIR = path.join(process.cwd(), 'public', 'portfolio', 'irise-iiser-pune');

const SLUGS = [
  ['image-ea56bc0a-3b72-48ae-9bca-30edaca194df', '01-storytelling-illustration'],
  ['image-091e3b94-0fa2-4b22-a292-d3e233fe8b21', '02-lab-overview-cell'],
  ['image-7d1236da-a714-4acf-b5ba-385e4803ab3a', '03-anatomy-demo'],
  ['image-b17d915c-ac56-4c82-a8d8-74cfc7797f9a', '04-inkscape-podium'],
  ['image-f54ebdac-3973-4eb1-ae38-7c1e96fb1b26', '05-participant-hands-on'],
  ['image-c8f8bb9f-1cf8-4a7c-956b-4a12c021c96d', '06-presenter-slide'],
];

async function findPng(partial) {
  const entries = await fs.readdir(ASSETS_DIR);
  const hits = entries.filter((f) => f.includes(partial) && f.endsWith('.png'));
  if (hits.length === 0) throw new Error(`No PNG matching "${partial}" in ${ASSETS_DIR}`);
  const exact = hits.find((f) => f.endsWith(`${partial}.png`));
  const hit = exact ?? hits.sort((a, b) => a.length - b.length)[0];
  return path.join(ASSETS_DIR, hit);
}

async function toWebp(src, dest, { maxWidth, quality }) {
  let img = sharp(src).rotate();
  const meta = await img.metadata();
  if (meta.width && meta.width > maxWidth) {
    img = img.resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' });
  }
  await img.webp({ quality, effort: 6 }).toFile(dest);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const [partial, base] of SLUGS) {
    const src = await findPng(partial);
    const dest = path.join(OUT_DIR, `${base}.webp`);
    await toWebp(src, dest, { maxWidth: 1100, quality: 70 });
    const st = await fs.stat(dest);
    console.log(`${base}.webp\t${Math.round(st.size / 1024)} KB`);
  }
  const thumbSrc = await findPng('image-ea56bc0a-3b72-48ae-9bca-30edaca194df');
  const thumbDest = path.join(OUT_DIR, 'card-thumb.webp');
  await toWebp(thumbSrc, thumbDest, { maxWidth: 560, quality: 66 });
  const st = await fs.stat(thumbDest);
  console.log(`card-thumb.webp\t${Math.round(st.size / 1024)} KB (card)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
