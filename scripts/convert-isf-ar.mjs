/**
 * One-off: convert ISF AR workshop PNGs from Cursor assets → public WebP.
 * Run: node scripts/convert-isf-ar.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const ASSETS_DIR =
  process.env.ISF_AR_ASSETS ||
  path.join(
    'C:',
    'Users',
    'User',
    '.cursor',
    'projects',
    'd-apps-webapps-rafeeque-com',
    'assets'
  );

const OUT_DIR = path.join(process.cwd(), 'public', 'portfolio', 'isf-ar');

/** Gallery order + output basename (without .webp) */
const SLUGS = [
  ['image-d4fcb188-0f77-43ad-ae5f-5c8119594def', '01-title-slide'],
  ['image-5cc3a0cf-05cc-4823-8642-8d804dd2b90d', '02-classroom'],
  ['image-ac40cec9-b2e8-4d5e-9ea8-a3f0e263777e', '03-mentoring'],
  ['image-ae8901dc-f221-4244-829d-d14c14ae9d7d', '04-ar-applications'],
  ['image-92ef09d0-34de-4e4a-8b21-f4051fc3fd07', '05-outdoor-ar'],
  ['image-c271e85d-185c-46d3-a2a7-3b9374699377', '06-molecule-ar'],
  ['image-e3691fd8-4af9-435d-ac93-52972f33ce63', '07-einstein-ar'],
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

  const thumbSrc = await findPng('image-d4fcb188-0f77-43ad-ae5f-5c8119594def');
  const thumbDest = path.join(OUT_DIR, 'card-thumb.webp');
  await toWebp(thumbSrc, thumbDest, { maxWidth: 640, quality: 72 });
  const st = await fs.stat(thumbDest);
  console.log(`card-thumb.webp\t${Math.round(st.size / 1024)} KB (card)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
