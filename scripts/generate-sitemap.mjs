/**
 * Build-time sitemap from static routes + blog/workshop/course slugs (file + Supabase).
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadSitemapEntries, root } from './seo-build-utils.mjs';

function renderSitemap(entries) {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const entries = await loadSitemapEntries();
const xml = renderSitemap(entries);

const publicPath = path.join(root, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, xml, 'utf8');
console.log(`generate-sitemap: wrote ${entries.length} URL(s) → public/sitemap.xml`);

const llmSrc = path.join(root, 'llm.txt');
const llmDst = path.join(root, 'public', 'llm.txt');
if (fs.existsSync(llmSrc)) {
  fs.copyFileSync(llmSrc, llmDst);
  console.log('generate-sitemap: synced llm.txt → public/llm.txt');
}

const distPath = path.join(root, 'dist', 'sitemap.xml');
if (fs.existsSync(path.dirname(distPath))) {
  fs.writeFileSync(distPath, xml, 'utf8');
  console.log(`generate-sitemap: wrote dist/sitemap.xml`);
}
