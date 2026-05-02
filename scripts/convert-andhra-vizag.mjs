/**
 * Scientific illustration workshop @ Andhra University Vizag — PNG → WebP.
 * Run: node scripts/convert-andhra-vizag.mjs
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

const OUT_DIR = path.join(process.cwd(), 'public', 'portfolio', 'andhra-vizag-sci-illust');

const SLUGS = [
  ['image-9a9b7468-5faf-429a-9961-6c1df30f45a0', '01-overview'],
  ['image-6e0a8c3d-054f-41a0-b7dc-77e2c32d61cf', '02-lab-session'],
  ['image-7b192abd-3ec5-43f1-a274-933712c53db2', '03-technical-session'],
  ['image-25c59101-573c-4331-97e8-c007a5e0fa9b', '04-closing'],
  ['image-31101a19-f3ce-4c19-ae17-e2816c39c285', '05-campus-vizag'],
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
    await toWebp(src, dest, { maxWidth: 1280, quality: 78 });
    const st = await fs.stat(dest);
    console.log(`${base}.webp\t${Math.round(st.size / 1024)} KB`);
  }

  const thumbSrc = await findPng('image-9a9b7468-5faf-429a-9961-6c1df30f45a0');
  const thumbDest = path.join(OUT_DIR, 'card-thumb.webp');
  await toWebp(thumbSrc, thumbDest, { maxWidth: 640, quality: 72 });
  const st = await fs.stat(thumbDest);
  console.log(`card-thumb.webp\t${Math.round(st.size / 1024)} KB (card)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
