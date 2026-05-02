/**
 * 3D scientific illustration workshop @ Kiel University — Meet screenshots → WebP (small).
 * Run: node scripts/convert-kiel-3d-workshop.mjs
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

const OUT_DIR = path.join(process.cwd(), 'public', 'portfolio', 'kiel-3d-sci-illust');

const SLUGS = [
  ['image-10cc5454-016b-4598-9fcb-949a6840a536', '01-meet-grid-10'],
  ['image-d951e952-ab6e-4bba-ae71-5558f3e6d576', '02-meet-grid-9'],
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
    await toWebp(src, dest, { maxWidth: 1100, quality: 68 });
    const st = await fs.stat(dest);
    console.log(`${base}.webp\t${Math.round(st.size / 1024)} KB`);
  }
  const thumbSrc = await findPng('image-10cc5454-016b-4598-9fcb-949a6840a536');
  const thumbDest = path.join(OUT_DIR, 'card-thumb.webp');
  await toWebp(thumbSrc, thumbDest, { maxWidth: 520, quality: 64 });
  const st = await fs.stat(thumbDest);
  console.log(`card-thumb.webp\t${Math.round(st.size / 1024)} KB (card)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
