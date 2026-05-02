/**
 * Blog images for Blender workshop post — PNG → WebP.
 * Run: node scripts/convert-blender-blog-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const ASSETS_DIR =
  process.env.BLOG_ASSETS ||
  path.join(
    'C:',
    'Users',
    'User',
    '.cursor',
    'projects',
    'd-apps-webapps-rafeeque-com',
    'assets'
  );

const OUT_DIR = path.join(process.cwd(), 'public', 'blog', 'blender-scidart');

const SLUGS = [
  ['image-ace318b7-cc3a-448d-b11d-4b79d5e07df5', '01-workshop-banner'],
  ['image-5c9ed863-5622-4dbd-8d85-6a75e3e00084', '02-curriculum-what-you-learn'],
  ['image-6782fd16-327a-4f41-bfd7-eb63577740d9', '03-students-work'],
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
    await toWebp(src, dest, { maxWidth: 1200, quality: 72 });
    const st = await fs.stat(dest);
    console.log(`${base}.webp\t${Math.round(st.size / 1024)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
