/**
 * Shared data for sitemap generation and post-build HTML injection.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildBlogPostingJsonLd,
  buildCourseJsonLd,
  buildWorkshopJsonLd,
} from './seo-jsonld-build.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, '..');
export const SITE_ORIGIN = 'https://rafeeque.com';

const WORKSHOPS_PREFIX = '/scientific-illustration-workshops/';

function readText(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function loadEnvFile() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

function parseBlogPostsFromTs() {
  const text = readText('data/blog.ts');
  const slugs = [...text.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  const titles = [...text.matchAll(/^\s*title:\s*'([^']+)'/gm)].map((m) => m[1]);
  const dates = [...text.matchAll(/date:\s*'([^']+)'/g)].map((m) => m[1]);
  const excerpts = [...text.matchAll(/excerpt:\s*\n\s*'([^']+)'/g)].map((m) => m[1]);
  const imageUrls = [...text.matchAll(/imageUrl:\s*'([^']+)'/g)].map((m) => m[1]);
  return slugs.map((slug, i) => ({
    slug,
    title: titles[i] || slug,
    excerpt: excerpts[i] || '',
    date: dates[i] || '',
    imageUrl: imageUrls[i] || '',
    path: `/blog/${slug}`,
  }));
}

function parseSiteWorkshopsFromTs() {
  const text = readText('data/siteWorkshops.ts');
  const workshops = [];
  const blockRe = /\{\s*\n\s*id:\s*'site-[^']+'[\s\S]*?\n\s*\}(?=\s*,|\s*\])/g;
  for (const block of text.matchAll(blockRe)) {
    const chunk = block[0];
    const id = chunk.match(/id:\s*'(site-[^']+)'/)?.[1];
    const title = chunk.match(/title:\s*'([^']+)'/)?.[1];
    const date = chunk.match(/date:\s*'([^']+)'/)?.[1] || '';
    const description =
      chunk.match(/description:\s*\n\s*'([\s\S]*?)',/m)?.[1]?.replace(/\s+/g, ' ').trim() ||
      chunk.match(/description:\s*'([^']*)'/)?.[1] ||
      '';
    const mode = chunk.match(/mode:\s*'([^']+)'/)?.[1] || 'Offline';
    const status = chunk.match(/status:\s*'([^']+)'/)?.[1] || 'Past';
    const location = chunk.match(/location:\s*'([^']+)'/)?.[1] || '';
    const institute = chunk.match(/institute:\s*'([^']+)'/)?.[1] || '';
    const cover_image = chunk.match(/cover_image:\s*'([^']+)'/)?.[1] || '';
    if (!id || !title) continue;
    workshops.push({
      id,
      title,
      date,
      description,
      mode,
      status,
      location,
      institute,
      cover_image,
      path: `${WORKSHOPS_PREFIX}${id}`,
    });
  }
  return workshops;
}

/** Fallback course slugs when Supabase is unavailable at build time. */
const FALLBACK_COURSE_SLUGS = [
  {
    slug: 'color-theory-scientific-images',
    title: 'Color theory for scientific images',
    description:
      'Self-paced chapters on color harmony, contrast, and accessibility for journal figures and graphical abstracts.',
    updated_at: '2026-05-02',
  },
];

function truncateMeta(text, max = 155) {
  const t = (text || '').trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const sp = slice.lastIndexOf(' ');
  return `${(sp > max * 0.6 ? slice.slice(0, sp) : slice).trimEnd()}…`;
}

function truncateTitle(title, max = 60) {
  const base = `${title} | Rafeeque Mavoor`;
  if (base.length <= max) return base;
  const slice = base.slice(0, max - 1);
  const sp = slice.lastIndexOf(' ');
  return `${slice.slice(0, sp > max * 0.5 ? sp : max - 1).trimEnd()}…`;
}

export function loadStaticRoutes() {
  return JSON.parse(readText('seo-static-routes.json'));
}

export function blogToPrerenderRoute(post) {
  return {
    path: post.path,
    title: truncateTitle(post.title),
    description: truncateMeta(post.excerpt || post.title),
    h1: post.title,
    h2: 'Science illustration blog',
    ogType: 'article',
    jsonLd: buildBlogPostingJsonLd(post),
    crawlParagraphs: [post.excerpt || post.title].filter(Boolean),
  };
}

export function workshopToPrerenderRoute(w) {
  const desc = truncateMeta(w.description || w.title);
  return {
    path: w.path,
    title: truncateTitle(`${w.title} | Workshop`),
    description: desc,
    h1: w.title,
    h2: 'Scientific illustration workshop',
    ogType: 'event',
    jsonLd: buildWorkshopJsonLd(w),
    crawlParagraphs: [w.description || w.title].filter(Boolean),
  };
}

export function courseToPrerenderRoute(c) {
  const desc = truncateMeta(c.description || c.title);
  return {
    path: `/courses/${c.slug}`,
    title: truncateTitle(`${c.title} | Short course`),
    description: desc,
    h1: c.title,
    h2: 'Self-paced minicourse',
    ogType: 'article',
    jsonLd: buildCourseJsonLd(c),
    crawlParagraphs: [c.description || c.title].filter(Boolean),
  };
}

async function fetchSupabaseRows(table, select, filterPublished = false) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const params = new URLSearchParams({ select });
  if (filterPublished) params.set('published', 'eq.true');

  const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!res.ok) {
    console.warn(`seo-build: Supabase ${table} fetch failed (${res.status})`);
    return null;
  }
  return res.json();
}

export async function loadDynamicSources() {
  loadEnvFile();
  const blogs = parseBlogPostsFromTs();
  const siteWorkshops = parseSiteWorkshopsFromTs();

  let supabaseBlogs = null;
  let supabaseWorkshops = null;
  let supabaseCourses = null;

  try {
    [supabaseBlogs, supabaseWorkshops, supabaseCourses] = await Promise.all([
      fetchSupabaseRows('posts', 'slug,title,excerpt,date,updated_at,image_url'),
      fetchSupabaseRows('workshops', 'id,title,description,date,updated_at,mode,location,institute,cover_image,status'),
      fetchSupabaseRows('courses', 'slug,title,description,updated_at', true),
    ]);
  } catch (err) {
    console.warn('seo-build: Supabase fetch error', err?.message || err);
  }

  const blogBySlug = new Map(blogs.map((b) => [b.slug, b]));
  if (Array.isArray(supabaseBlogs)) {
    for (const row of supabaseBlogs) {
      if (!row.slug) continue;
      blogBySlug.set(row.slug, {
        slug: row.slug,
        title: row.title || row.slug,
        excerpt: row.excerpt || '',
        date: row.date || row.updated_at || '',
        imageUrl: row.image_url || '',
        path: `/blog/${row.slug}`,
      });
    }
  }

  const workshopById = new Map(siteWorkshops.map((w) => [w.id, w]));
  if (Array.isArray(supabaseWorkshops)) {
    for (const row of supabaseWorkshops) {
      if (!row.id || String(row.id).startsWith('demo-')) continue;
      const plain = (row.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      workshopById.set(row.id, {
        id: row.id,
        title: row.title || row.id,
        date: row.date || row.updated_at || '',
        description: plain,
        mode: row.mode || 'Offline',
        status: row.status || 'Past',
        location: row.location || '',
        institute: row.institute || '',
        cover_image: row.cover_image || '',
        path: `${WORKSHOPS_PREFIX}${row.id}`,
      });
    }
  }

  const courseBySlug = new Map(FALLBACK_COURSE_SLUGS.map((c) => [c.slug, c]));
  if (Array.isArray(supabaseCourses)) {
    for (const row of supabaseCourses) {
      if (!row.slug) continue;
      courseBySlug.set(row.slug, {
        slug: row.slug,
        title: row.title || row.slug,
        description: row.description || '',
        updated_at: row.updated_at || '',
      });
    }
  }

  return {
    blogs: [...blogBySlug.values()],
    workshops: [...workshopById.values()],
    courses: [...courseBySlug.values()],
  };
}

export async function loadAllPrerenderRoutes() {
  const staticRoutes = loadStaticRoutes();
  const { blogs, workshops, courses } = await loadDynamicSources();

  const staticPaths = new Set(staticRoutes.map((r) => r.path));
  const dynamic = [
    ...blogs.map(blogToPrerenderRoute),
    ...workshops.map(workshopToPrerenderRoute),
    ...courses.map(courseToPrerenderRoute),
  ].filter((r) => !staticPaths.has(r.path));

  return [...staticRoutes, ...dynamic];
}

/** Sitemap URL entries: { loc, lastmod, changefreq, priority } */
export async function loadSitemapEntries() {
  const staticRoutes = loadStaticRoutes();
  const { blogs, workshops, courses } = await loadDynamicSources();
  const today = new Date().toISOString().slice(0, 10);

  const priorityForPath = (p) => {
    if (p === '/') return '1.0';
    if (p.startsWith('/portfolio/')) return '0.85';
    if (p.startsWith('/scientific-illustration-services')) return '0.9';
    if (p === '/scientific-illustration-workshops') return '0.85';
    if (p.startsWith('/scientific-illustration-workshops/')) return '0.65';
    if (p === '/courses') return '0.8';
    if (p.startsWith('/courses/')) return '0.7';
    if (p === '/blog') return '0.8';
    if (p.startsWith('/blog/')) return '0.7';
    if (p.includes('contact')) return '0.6';
    if (p.includes('privacy') || p.includes('terms') || p.includes('editorial') || p.includes('html-sitemap'))
      return '0.3';
    return '0.75';
  };

  const changefreqForPath = (p) => {
    if (p === '/' || p === '/blog' || p.startsWith('/portfolio/')) return 'weekly';
    if (p.startsWith('/blog/') || p.startsWith('/courses/')) return 'monthly';
    if (p.startsWith('/scientific-illustration-workshops/')) return 'yearly';
    return 'monthly';
  };

  const entries = new Map();

  const add = (pathname, lastmod) => {
    const loc = `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`;
    entries.set(pathname, {
      loc,
      lastmod: (lastmod || today).slice(0, 10),
      changefreq: changefreqForPath(pathname),
      priority: priorityForPath(pathname),
    });
  };

  for (const r of staticRoutes) add(r.path, today);

  for (const b of blogs) add(b.path, b.date || today);
  for (const w of workshops) add(w.path, w.date || today);
  for (const c of courses) add(`/courses/${c.slug}`, c.updated_at || today);

  return [...entries.values()].sort((a, b) => a.loc.localeCompare(b.loc));
}
