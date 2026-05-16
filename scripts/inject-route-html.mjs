/**
 * Post-build: write per-route index.html with unique title, meta, canonical, hreflang, and crawl-shell H1.
 * Vercel serves these files before the SPA rewrite to /index.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const siteOrigin = 'https://rafeeque.com';
const ogImage = `${siteOrigin}/og-image.jpg`;

const routes = JSON.parse(
  fs.readFileSync(path.join(root, 'seo-static-routes.json'), 'utf8')
);

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text) {
  return escapeHtml(text);
}

function truncateMetaDescription(text, maxLength = 155) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.6) return `${slice.slice(0, lastSpace).trimEnd()}…`;
  return `${slice.trimEnd()}…`;
}

function injectRouteHtml(shell, route) {
  const canonicalPath = route.path === '/' ? '/' : route.path;
  const canonicalUrl = `${siteOrigin}${canonicalPath === '/' ? '/' : canonicalPath}`;
  const title = route.title;
  const description = truncateMetaDescription(route.description);
  const h1 = escapeHtml(route.h1);

  let html = shell;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

  html = html.replace(
    /<meta name="title" content="[^"]*">/,
    `<meta name="title" content="${escapeAttr(title)}">`
  );

  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeAttr(description)}">`
  );

  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`
  );

  html = html.replace(
    /<link rel="alternate" hreflang="en" href="[^"]*"\s*\/?>/,
    `<link rel="alternate" hreflang="en" href="${canonicalUrl}" />`
  );

  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${canonicalUrl}">`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${escapeAttr(title)}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${escapeAttr(description)}">`
  );

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${escapeAttr(title)}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${escapeAttr(description)}">`
  );

  html = html.replace(/<h1 id="seo-crawl-h1">[^<]*<\/h1>/, `<h1 id="seo-crawl-h1">${h1}</h1>`);

  return html;
}

function outputPathForRoute(routePath) {
  if (routePath === '/') return path.join(distDir, 'index.html');
  const segments = routePath.replace(/^\//, '').split('/');
  return path.join(distDir, ...segments, 'index.html');
}

const shellPath = path.join(distDir, 'index.html');
if (!fs.existsSync(shellPath)) {
  console.error('inject-route-html: dist/index.html not found — run vite build first.');
  process.exit(1);
}

const shell = fs.readFileSync(shellPath, 'utf8');
let written = 0;

for (const route of routes) {
  const html = injectRouteHtml(shell, route);
  const out = outputPathForRoute(route.path);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  written += 1;
  console.log(`  ${route.path} → ${path.relative(root, out)}`);
}

console.log(`inject-route-html: wrote ${written} route HTML file(s). OG image: ${ogImage}`);
