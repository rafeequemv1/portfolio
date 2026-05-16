import type { View } from '../types';
import type { Workshop } from '../types';
import type { Course, CourseChapter } from '../courses/types';
import staticRoutesJson from '../seo-static-routes.json';
import {
  PORTFOLIO_SEO,
  ROUTES,
  pathnameOnly,
  pathnameWithSearch,
  portfolioTabFromPathname,
} from './routes';

/** Site origin for canonicals and absolute OG images (must match production). */
export const SEO_SITE_ORIGIN = 'https://rafeeque.com';

/** Keep in sync with `index.html` default title and meta description (SERP length limits). */
export const SEO_HOME_TITLE = 'Rafeeque Mavoor | Scientific Illustrator & Molecular Art';

export const SEO_HOME_DESCRIPTION =
  'Scientific illustrator in Kerala for journal covers, research figures, and 3D molecular art. Workshops and SciDart minicourses for research teams.';

/** SERP title length guidance (Google typically shows ~50–60 characters). */
export const SEO_TITLE_MAX_LENGTH = 60;

export interface StaticPrerenderRoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  /** Unique crawl-shell subheading (avoids duplicate H2 across prerendered pages). */
  h2: string;
}

export function truncateSeoTitle(title: string, maxLength = SEO_TITLE_MAX_LENGTH): string {
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength - 1);
  const lastBar = slice.lastIndexOf('|');
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastBar > maxLength * 0.5 ? lastBar - 1 : lastSpace > maxLength * 0.5 ? lastSpace : maxLength - 1;
  return `${slice.slice(0, cut).trimEnd()}…`;
}

/** Build-time prerender list — keep aligned with `seo-static-routes.json`. */
export const STATIC_PRERENDER_ROUTES = staticRoutesJson as StaticPrerenderRoute[];

const STATIC_ROUTE_BY_PATH = new Map(STATIC_PRERENDER_ROUTES.map((r) => [r.path, r]));

/** Trim meta descriptions for SERP (~155 chars). */
export function truncateMetaDescription(text: string, maxLength = 155): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const slice = trimmed.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.6) return `${slice.slice(0, lastSpace).trimEnd()}…`;
  return `${slice.trimEnd()}…`;
}

function ensureCanonicalLink(): HTMLLinkElement {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  return el;
}

/** Self-referencing hreflang for the current page URL (fixes audit: missing self-reference). */
export function setHreflangLinks(canonicalUrl: string) {
  for (const lang of ['x-default', 'en'] as const) {
    const selector = `link[rel="alternate"][hreflang="${lang}"]`;
    let el = document.head.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.rel = 'alternate';
      el.hreflang = lang;
      document.head.appendChild(el);
    }
    el.href = canonicalUrl;
  }
}

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
  const description = truncateMetaDescription(opts.description);

  const title = truncateSeoTitle(opts.title);
  document.title = title;

  setOrCreateMeta('name', 'description', description);
  if (opts.keywords === '') {
    document.head.querySelector('meta[name="keywords"]')?.remove();
  } else if (opts.keywords?.trim()) {
    setOrCreateMeta('name', 'keywords', opts.keywords.trim());
  }

  ensureCanonicalLink().href = canonicalUrl;
  setHreflangLinks(canonicalUrl);
  setOrCreateMeta('name', 'title', title);

  setOrCreateMeta('property', 'og:title', title);
  setOrCreateMeta('property', 'og:description', description);
  setOrCreateMeta('property', 'og:url', canonicalUrl);
  setOrCreateMeta('property', 'og:type', opts.ogType || 'website');
  setOrCreateMeta('property', 'og:image', ogImage);
  setOrCreateMeta('property', 'og:locale', 'en_IN');
  setOrCreateMeta('property', 'og:site_name', 'Rafeeque Mavoor Studio');

  setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
  setOrCreateMeta('name', 'twitter:title', title);
  setOrCreateMeta('name', 'twitter:description', description);
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

const WORKSHOPS_INDEX_TITLE = 'Scientific Illustration Workshops | Rafeeque Mavoor';

export const WORKSHOP_INDEX_DESC =
  'Scientific illustration workshops: Blender 3D, journal figures, outreach, and online training for researchers and institutions in India and abroad.';

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

export const COURSES_INDEX_TITLE = 'Scientific Illustration Minicourses | Rafeeque Mavoor';

export const COURSES_INDEX_DESC =
  'Self-paced minicourses for scientists: graphical abstracts, journal figures, Blender 3D, and visual communication with structured chapters.';

/**
 * Central SEO registry for static views. Returns null when a child page owns SEO
 * (workshop/blog/course detail, courses index).
 */
export function resolvePageSeo(view: View, currentPath: string): PageSeoOptions | null {
  if (
    view === 'workshop-detail' ||
    view === 'blog-detail' ||
    view === 'courses' ||
    view === 'course-detail'
  ) {
    return null;
  }

  const pathname = pathnameOnly(currentPath);
  const staticRoute = STATIC_ROUTE_BY_PATH.get(pathname);

  switch (view) {
    case 'home':
      return {
        title: SEO_HOME_TITLE,
        description: SEO_HOME_DESCRIPTION,
        canonicalPath: ROUTES.home,
        keywords: '',
        ogImage: '/og-image.jpg',
        ogType: 'website',
      };
    case 'services':
      return staticRoute
        ? pageSeoFromStatic(staticRoute, ROUTES.services)
        : {
            title: 'Scientific Illustration Services | Rafeeque Mavoor',
            description:
              'Journal cover art, figures, infographics, lab websites, and on-campus workshops for scientists and research teams worldwide.',
            canonicalPath: ROUTES.services,
            ogImage: '/og-image.jpg',
          };
    case 'workshops':
      return {
        title: WORKSHOPS_INDEX_TITLE,
        description: WORKSHOP_INDEX_DESC,
        canonicalPath: ROUTES.workshops,
        keywords: WORKSHOP_INDEX_KEYWORDS,
        ogImage: '/og-image.jpg',
        ogType: 'website',
        jsonLd: workshopsIndexJsonLd(),
      };
    case 'apps': {
      const appsSeo = PORTFOLIO_SEO['websites-apps'];
      return {
        title: appsSeo.title,
        description: appsSeo.description,
        canonicalPath: ROUTES.apps,
        ogImage: '/og-image.jpg',
      };
    }
    case 'portfolio': {
      const tab = portfolioTabFromPathname(pathname);
      const seo = PORTFOLIO_SEO[tab];
      return {
        title: seo.title,
        description: seo.description,
        canonicalPath: pathnameWithSearch(currentPath),
        ogImage: '/og-image.jpg',
      };
    }
    case 'about':
      return staticRoute
        ? pageSeoFromStatic(staticRoute, ROUTES.about)
        : {
            title: 'About Rafeeque Mavoor | Experience & Education',
            description:
              'Professional journey of Rafeeque Mavoor—chemistry background, scientific illustrator, founder of SciDart Academy, and educator in visual communication.',
            canonicalPath: ROUTES.about,
            ogImage: '/og-image.jpg',
          };
    case 'blog':
      return staticRoute
        ? pageSeoFromStatic(staticRoute, ROUTES.blog)
        : {
            title: 'Science Illustration Blog | Rafeeque Mavoor',
            description:
              'Articles on scientific illustration, Blender for researchers, and open chemistry tools such as MolDraw for structures and 3D visualization.',
            canonicalPath: ROUTES.blog,
            ogImage: '/og-image.jpg',
          };
    case 'contact':
      return staticRoute
        ? pageSeoFromStatic(staticRoute, ROUTES.contact)
        : {
            title: 'Contact | Scientific Illustration | Rafeeque Mavoor',
            description:
              'Contact Rafeeque Mavoor for journal covers, figures, workshops, and collaborations in scientific illustration and visualization.',
            canonicalPath: ROUTES.contact,
            ogImage: '/og-image.jpg',
          };
    case 'privacy':
      return pageSeoFromStatic(
        STATIC_ROUTE_BY_PATH.get(ROUTES.privacyPolicy)!,
        ROUTES.privacyPolicy
      );
    case 'terms':
      return pageSeoFromStatic(
        STATIC_ROUTE_BY_PATH.get(ROUTES.termsOfService)!,
        ROUTES.termsOfService
      );
    case 'editorial':
      return pageSeoFromStatic(
        STATIC_ROUTE_BY_PATH.get(ROUTES.editorialGuidelines)!,
        ROUTES.editorialGuidelines
      );
    case 'html-sitemap':
      return pageSeoFromStatic(
        STATIC_ROUTE_BY_PATH.get(ROUTES.htmlSitemap)!,
        ROUTES.htmlSitemap
      );
    case 'faq':
      return pageSeoFromStatic(STATIC_ROUTE_BY_PATH.get(ROUTES.faq)!, ROUTES.faq);
    case 'login':
      return {
        title: 'Admin Login | Rafeeque Mavoor',
        description: 'Admin login portal.',
        canonicalPath: ROUTES.login,
        robots: 'noindex, nofollow',
      };
    case 'dashboard':
      return {
        title: 'Admin Dashboard | Rafeeque Mavoor',
        description: 'Admin dashboard for managing content.',
        canonicalPath: ROUTES.dashboard,
        robots: 'noindex, nofollow',
      };
    default:
      return null;
  }
}

function pageSeoFromStatic(route: StaticPrerenderRoute, canonicalPath: string): PageSeoOptions {
  return {
    title: route.title,
    description: route.description,
    canonicalPath,
    keywords: '',
    ogImage: '/og-image.jpg',
  };
}

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

/** FAQ copy — keep aligned with `index.html` FAQPage `mainEntity` and `/faq` page body. */
export const SITE_FAQ_ITEMS: readonly { question: string; answer: string }[] = [
  {
    question: 'What scientific illustration services do you offer?',
    answer:
      'Journal cover art, publication figures and infographics, graphical abstracts, lab websites, and on-campus or online workshops for research teams—from 3D molecular visualization to journal-ready layouts.',
  },
  {
    question: 'How do I commission a journal cover or figure?',
    answer:
      'Use the Services page request form with your timeline, target journal or venue, reference structures or sketches, and brand preferences. You will receive a direct reply to discuss scope, licensing, and delivery formats (print and web).',
  },
  {
    question: 'Do you work with international labs and publishers?',
    answer:
      'Yes. Projects are coordinated remotely with clear milestones; file delivery typically uses high-resolution TIFF, PDF, PNG, or vector formats aligned with your publisher’s author guidelines.',
  },
  {
    question: 'What is SciDart Academy?',
    answer:
      'SciDart Academy is the training arm focused on scientific illustration and visual communication for researchers—short online courses, structured chapters, and workshops on tools such as Blender and graphical abstracts.',
  },
  {
    question: 'Where can I read articles about your tools and workflow?',
    answer:
      'The blog at rafeeque.com/blog covers scientific illustration process, Blender for researchers, and open tools such as MolDraw for structures and 3D visualization.',
  },
  {
    question: 'How can I contact you for workshops or collaborations?',
    answer:
      'Use the Contact page or the workshop and services request links in the footer. Email and phone are listed in the site footer for direct outreach.',
  },
];

export function webSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rafeeque Mavoor',
    alternateName: ['Rafeeque Mavoor Studio', 'SciDart'],
    url: `${SEO_SITE_ORIGIN}/`,
    description: SEO_HOME_DESCRIPTION,
    inLanguage: 'en',
    publisher: {
      '@type': 'Person',
      name: 'Rafeeque Mavoor',
      url: SEO_SITE_ORIGIN,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.google.com/search?q={search_term_string}+site:rafeeque.com',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SITE_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
