import type { Workshop } from '../types';
import type { Course, CourseChapter } from '../courses/types';
import { ROUTES } from './routes';

/** Site origin for canonicals and absolute OG images (must match production). */
export const SEO_SITE_ORIGIN = 'https://rafeeque.com';

/** Keep in sync with `index.html` default title and meta description (SERP length limits). */
export const SEO_HOME_TITLE = 'Rafeeque Mavoor | Scientific Illustrator & Molecular Art';

export const SEO_HOME_DESCRIPTION =
  'Scientific illustrator in Kerala for journal covers, research figures, and 3D molecular art. Workshops and SciDart Academy courses for research teams worldwide.';

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
  /** Pass empty string to remove the keywords meta tag (e.g. home page). */
  keywords?: string;
  /** Relative `/...` or absolute URL */
  ogImage?: string;
  ogType?: 'website' | 'article' | 'event';
  /** Extra JSON-LD object(s); injected as a separate script tag (valid alongside index.html schema). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** e.g. `index, follow` — helps crawlers and answer engines. */
  robots?: string;
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
  if (opts.keywords === '') {
    document.head.querySelector('meta[name="keywords"]')?.remove();
  } else if (opts.keywords?.trim()) {
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

  setOrCreateMeta('name', 'robots', (opts.robots || 'index, follow').trim());

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

export const COURSES_INDEX_DESC =
  'Free and premium short courses for scientists: graphical abstracts, journal figures, Blender 3D, and visual communication — structured chapters with text, video, and interactive examples by Rafeeque Mavoor.';

export const COURSES_INDEX_KEYWORDS =
  'graphical abstract course, scientific illustration training, journal graphical abstract tutorial, research paper visual summary, Cell Nature graphical abstract, science communication course, Rafeeque Mavoor, self-paced illustration lessons';

export function coursesIndexJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Short courses — scientific illustration & graphical abstracts',
    description: COURSES_INDEX_DESC,
    url: `${SEO_SITE_ORIGIN}${ROUTES.courses}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Rafeeque Mavoor',
      url: SEO_SITE_ORIGIN,
      description: 'Scientific illustration, journal art, and researcher-focused visual education.',
    },
    about: {
      '@type': 'Thing',
      name: 'Scientific illustration, graphical abstracts, and visual communication for peer-reviewed research',
    },
    inLanguage: 'en',
  };
}

/** Rich Course + breadcrumbs + chapter ItemList + FAQ for answer engines / LLM context. */
export function courseDetailJsonLd(
  course: Pick<Course, 'title' | 'slug' | 'description'>,
  chapters: Pick<CourseChapter, 'id' | 'title' | 'position'>[],
  canonicalPath: string
): Record<string, unknown>[] {
  const pageUrl = `${SEO_SITE_ORIGIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  const desc =
    course.description?.trim() ||
    `${course.title}: structured chapters on scientific illustration and research visuals — self-paced learning.`;

  const crumbs: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SEO_SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Short courses', item: `${SEO_SITE_ORIGIN}${ROUTES.courses}` },
      { '@type': 'ListItem', position: 3, name: course.title, item: pageUrl },
    ],
  };

  const courseLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: desc,
    url: pageUrl,
    inLanguage: 'en',
    educationalLevel: 'researcher, graduate student, postdoctoral scientist',
    teaches:
      'graphical abstract design, journal figure planning, visual hierarchy for scientific papers, color and typography for publication graphics',
    provider: {
      '@type': 'Person',
      name: 'Rafeeque Mavoor',
      url: SEO_SITE_ORIGIN,
      jobTitle: 'Scientific Illustrator and Educator',
    },
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
      category: 'Online course',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${Math.max(1, chapters.length * 12)}M`,
      url: pageUrl,
    },
    isAccessibleForFree: true,
  };

  const toc: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${course.title} — chapters`,
    description: 'Ordered table of contents for crawlers and answer engines.',
    numberOfItems: chapters.length,
    itemListElement: chapters.map((ch, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ch.title,
      url: `${pageUrl}#chapter-${ch.id}`,
    })),
  };

  const faq: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a graphical abstract?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A graphical abstract is a single, self-contained visual summary of your paper—usually one panel—that helps readers and editors grasp your main finding or mechanism at a glance before reading the full article.',
        },
      },
      {
        '@type': 'Question',
        name: 'How detailed should a graphical abstract be?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keep one clear visual story: avoid cramming every experiment. Prioritize the central mechanism or outcome, use readable type sizes, and follow the target journal’s file format, dimensions, and word limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which tools are common for graphical abstracts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Researchers often combine vector tools (Illustrator, Inkscape), 3D molecular visuals (Blender, PyMOL), and layout in PowerPoint or Figma—what matters is vector or high-resolution export that matches journal guidelines.',
        },
      },
    ],
  };

  return [crumbs, courseLd, toc, faq];
}

export function courseDetailKeywords(course: Pick<Course, 'title' | 'description' | 'category'>): string {
  const base =
    'graphical abstract tutorial, journal graphical abstract, research paper visual summary, scientific illustration course, publication figure design, Rafeeque Mavoor';
  return [course.title, course.category, course.description?.slice(0, 200), base].filter(Boolean).join(', ');
}
