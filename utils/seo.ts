import type { Workshop } from '../types';
import { ROUTES } from './routes';

/** Site origin for canonicals and absolute OG images (must match production). */
export const SEO_SITE_ORIGIN = 'https://rafeeque.com';

const DEFAULT_OG_IMAGE = `${SEO_SITE_ORIGIN}/og-image.jpg`;

function setOrCreateMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function absoluteImageUrl(url: string | undefined): string {
  if (!url?.trim()) return DEFAULT_OG_IMAGE;
  const u = url.trim();
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `${SEO_SITE_ORIGIN}${u.startsWith('/') ? u : `/${u}`}`;
}

export interface PageSeoOptions {
  title: string;
  description: string;
  /** Path only, e.g. `/workshops` or `/workshops/site-isf-ar-2024` */
  canonicalPath: string;
  keywords?: string;
  /** Relative `/...` or absolute URL */
  ogImage?: string;
  ogType?: 'website' | 'article' | 'event';
  /** Extra JSON-LD object(s); injected as a separate script tag (valid alongside index.html schema). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Updates document title, meta description/keywords, canonical, Open Graph, Twitter cards,
 * and optional JSON-LD for crawlers, answer engines, and LLM-friendly page context.
 */
export function applyPageSeo(opts: PageSeoOptions) {
  const canonicalUrl = `${SEO_SITE_ORIGIN}${opts.canonicalPath.startsWith('/') ? opts.canonicalPath : `/${opts.canonicalPath}`}`;
  const ogImage = absoluteImageUrl(opts.ogImage);

  document.title = opts.title;

  setOrCreateMeta('name', 'description', opts.description);
  if (opts.keywords?.trim()) {
    setOrCreateMeta('name', 'keywords', opts.keywords.trim());
  }

  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  setOrCreateMeta('name', 'title', opts.title);

  setOrCreateMeta('property', 'og:title', opts.title);
  setOrCreateMeta('property', 'og:description', opts.description);
  setOrCreateMeta('property', 'og:url', canonicalUrl);
  setOrCreateMeta('property', 'og:type', opts.ogType || 'website');
  setOrCreateMeta('property', 'og:image', ogImage);
  setOrCreateMeta('property', 'og:locale', 'en_IN');
  setOrCreateMeta('property', 'og:site_name', 'Rafeeque Mavoor Studio');

  setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  setOrCreateMeta('name', 'twitter:title', opts.title);
  setOrCreateMeta('name', 'twitter:description', opts.description);
  setOrCreateMeta('name', 'twitter:image', ogImage);

  const id = 'seo-dynamic-jsonld';
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (opts.jsonLd) {
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    const payload = Array.isArray(opts.jsonLd) ? opts.jsonLd : [opts.jsonLd];
    script.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload);
  } else if (script) {
    script.remove();
  }
}

/** Remove dynamic JSON-LD when leaving a page that set it (optional cleanup). */
export function clearDynamicJsonLd() {
  document.getElementById('seo-dynamic-jsonld')?.remove();
}

export const WORKSHOP_INDEX_DESC =
  'Scientific illustration and science communication workshops: Blender 3D, journal figures, AR outreach, lab video, IISER Pune iRISE, India Science Festival, Andhra University, CDRI Lucknow, Kiel University, and online cohorts led by Rafeeque Mavoor.';

export const WORKSHOP_INDEX_KEYWORDS =
  'scientific illustration workshop, science communication training, Blender 3D researchers, journal cover workshop, graphical abstract training, IISER Pune workshop, India Science Festival, science outreach India, online illustration course, Rafeeque Mavoor';

export function workshopsIndexJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Workshops & Training — Scientific Illustration',
    description: WORKSHOP_INDEX_DESC,
    url: `${SEO_SITE_ORIGIN}${ROUTES.workshops}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Rafeeque Mavoor',
      url: SEO_SITE_ORIGIN,
    },
    about: {
      '@type': 'Thing',
      name: 'Scientific illustration and visual communication for researchers',
    },
  };
}

function eventAttendance(mode: Workshop['mode']): string {
  if (mode === 'Online') return 'https://schema.org/OnlineEventAttendanceMode';
  if (mode === 'Hybrid') return 'https://schema.org/MixedEventAttendanceMode';
  return 'https://schema.org/OfflineEventAttendanceMode';
}

/** JSON-LD Event + BreadcrumbList for answer engines / rich results. */
export function workshopDetailJsonLd(workshop: Workshop, canonicalPath: string): Record<string, unknown>[] {
  const pageUrl = `${SEO_SITE_ORIGIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  const cover = workshop.cover_image?.trim();
  const image = cover ? absoluteImageUrl(cover) : DEFAULT_OG_IMAGE;

  const event: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: workshop.title,
    description: workshop.description,
    startDate: workshop.date,
    endDate: workshop.date,
    eventAttendanceMode: eventAttendance(workshop.mode),
    location: {
      '@type': 'Place',
      name: workshop.location || workshop.institute || 'See workshop details',
    },
    organizer: {
      '@type': 'Person',
      name: 'Rafeeque Mavoor',
      url: SEO_SITE_ORIGIN,
      jobTitle: 'Scientific Illustrator and Educator',
    },
    performer: {
      '@type': 'Person',
      name: 'Rafeeque Mavoor',
    },
    image,
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      availability: workshop.status === 'Upcoming' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: pageUrl,
    },
  };

  const crumbs: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SEO_SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Workshops', item: `${SEO_SITE_ORIGIN}${ROUTES.workshops}` },
      { '@type': 'ListItem', position: 3, name: workshop.title, item: pageUrl },
    ],
  };

  return [event, crumbs];
}

export function workshopDetailKeywords(workshop: Workshop): string {
  const parts = [
    workshop.title,
    workshop.institute,
    workshop.location,
    workshop.mode,
    'scientific illustration',
    'science communication',
    'researcher training',
    'Rafeeque Mavoor',
    'SciDart',
    workshop.strand === 'outreach' ? 'science outreach workshop' : '',
    workshop.strand === 'illustration' ? 'scientific illustration course' : '',
    workshop.strand === 'school' ? 'STEM workshop for students' : '',
    workshop.strand === 'ai' ? 'AI for scientists' : '',
  ];
  return parts.filter(Boolean).join(', ');
}
