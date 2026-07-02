import type { View } from '../types';

/** Canonical public paths (SEO-friendly). Legacy short paths are still accepted — see `legacyPathToView`. */
export const ROUTES = {
  home: '/',
  services: '/scientific-illustration-services',
  workshops: '/scientific-illustration-workshops',
  about: '/about-scientific-illustrator-rafeeque-mavoor',
  contact: '/contact-scientific-illustration-commissions',
  blog: '/blog',
  /** Short self-paced courses (chapters with text, video, images). */
  courses: '/courses',
  /** Web apps & lab sites showcase (same Portfolio tab as “Web & apps”). */
  apps: '/science-web-apps-lab-websites',
  portfolioCovers: '/portfolio/journal-cover-art',
  portfolioFigures: '/portfolio/research-figures-infographics',
  portfolioIllustrations: '/portfolio/scientific-illustrations',
  portfolioAbstracts: '/portfolio/graphical-abstracts-research',
  portfolioLogos: '/portfolio/scientific-brand-logos',
  portfolioWebApps: '/portfolio/lab-websites-science-apps',
  portfolioVideos: '/portfolio/scientific-illustration-videos',
  login: '/login',
  dashboard: '/dashboard',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  clipperPrivacyPolicy: '/clipper-privacy-policy',
  editorialGuidelines: '/editorial-guidelines',
  htmlSitemap: '/html-sitemap',
  faq: '/faq',
  resources: '/resources',
} as const;

/** Public contact — footer, schema, and contact page. */
export const SITE_CONTACT = {
  email: 'rafeequemavoor@gmail.com',
  phoneDisplay: '+91 9447 267 129',
  phoneTel: '+919447267129',
} as const;

/** One-line site pitch for footer trust blocks and audits. */
export const FOOTER_SITE_TAGLINE =
  'Scientific illustration for journal covers, research figures, and 3D molecular art—workshops and SciDart Academy courses for labs worldwide.';

/** All footer internal links (deduplicated paths). */
export const FOOTER_NAV_LINKS: readonly { label: string; path: string; view: View }[] = [
  { label: 'Home', path: ROUTES.home, view: 'home' },
  { label: 'Services', path: ROUTES.services, view: 'services' },
  { label: 'Journal covers', path: ROUTES.portfolioCovers, view: 'portfolio' },
  { label: 'Research figures', path: ROUTES.portfolioFigures, view: 'portfolio' },
  { label: 'Illustrations', path: ROUTES.portfolioIllustrations, view: 'portfolio' },
  { label: 'Graphical abstracts', path: ROUTES.portfolioAbstracts, view: 'portfolio' },
  { label: 'Logos', path: ROUTES.portfolioLogos, view: 'portfolio' },
  { label: 'Videos', path: ROUTES.portfolioVideos, view: 'portfolio' },
  { label: 'Lab websites', path: ROUTES.portfolioWebApps, view: 'portfolio' },
  { label: 'Web apps', path: ROUTES.apps, view: 'apps' },
  { label: 'Workshops', path: ROUTES.workshops, view: 'workshops' },
  { label: 'Minicourses', path: ROUTES.courses, view: 'courses' },
  { label: 'Blog', path: ROUTES.blog, view: 'blog' },
  { label: 'About', path: ROUTES.about, view: 'about' },
  { label: 'Contact', path: ROUTES.contact, view: 'contact' },
  { label: 'FAQ', path: ROUTES.faq, view: 'faq' },
  { label: 'Privacy', path: ROUTES.privacyPolicy, view: 'privacy' },
  { label: 'Terms', path: ROUTES.termsOfService, view: 'terms' },
  { label: 'Clipper privacy', path: ROUTES.clipperPrivacyPolicy, view: 'clipper-privacy' },
  { label: 'Editorial', path: ROUTES.editorialGuidelines, view: 'editorial' },
  { label: 'Site map', path: ROUTES.htmlSitemap, view: 'html-sitemap' },
];

/** @deprecated Use FOOTER_NAV_LINKS */
export const FOOTER_SEO_NAV = FOOTER_NAV_LINKS;

/** @deprecated Use FOOTER_NAV_LINKS */
export const FOOTER_ESSENTIAL_TRUST = FOOTER_NAV_LINKS;

/** Featured talk recordings — shown at the bottom of the About page. */
export const ABOUT_FEATURED_TALKS: readonly { href: string; label: string }[] = [
  { href: 'https://www.youtube.com/watch?v=fneTE8nqE00', label: 'Talk' },
  { href: 'https://www.youtube.com/watch?v=kdA6DFdnaMs', label: 'Talk' },
  { href: 'https://www.youtube.com/watch?v=ljF0SY25NJg&t=1383s', label: 'Talk' },
  { href: 'https://www.youtube.com/watch?v=IyWSlexs9tw', label: 'Talk' },
];

export const ABOUT_TALKS_HASH = '#talks';

export type PortfolioTab = 'covers' | 'figures' | 'illustrations' | 'logos' | 'websites-apps' | 'videos';

/** Sub-filter when the active tab is `figures` (paper figures vs graphical abstracts). */
export type PortfolioFiguresGalleryFilter = 'all' | 'figures' | 'abstracts';

export const PORTFOLIO_TAB_PATH: Record<PortfolioTab, string> = {
  covers: ROUTES.portfolioCovers,
  figures: ROUTES.portfolioFigures,
  illustrations: ROUTES.portfolioIllustrations,
  logos: ROUTES.portfolioLogos,
  'websites-apps': ROUTES.portfolioWebApps,
  videos: ROUTES.portfolioVideos,
};

const PATH_TO_PORTFOLIO_TAB = new Map<string, PortfolioTab>(
  (Object.entries(PORTFOLIO_TAB_PATH) as [PortfolioTab, string][]).map(([tab, path]) => [path, tab])
);

/** Legacy slugs → same `View` (bookmarks / external links). */
export const LEGACY_PATH_TO_VIEW: Record<string, View> = {
  '/services': 'services',
  '/workshops': 'workshops',
  '/about': 'about',
  '/about-us': 'about',
  '/contact': 'contact',
  '/apps': 'apps',
  '/portfolio': 'portfolio',
};

export function pathnameOnly(fullPath: string): string {
  const raw = (fullPath.split('#')[0]?.split('?')[0] || '/').trim() || '/';
  if (raw.length > 1 && raw.endsWith('/')) return raw.slice(0, -1);
  return raw;
}

/** Pathname plus `?query` (no hash), for canonical URLs and gallery filters. */
export function pathnameWithSearch(fullPath: string): string {
  const noHash = fullPath.split('#')[0] || '';
  const q = noHash.indexOf('?');
  const pathClean = pathnameOnly(noHash);
  if (q === -1) return pathClean;
  return `${pathClean}${noHash.slice(q)}`;
}

/** Gallery filter from URL (figures tab includes legacy graphical-abstracts path). */
export function portfolioFiguresGalleryFromPath(fullPath: string): PortfolioFiguresGalleryFilter {
  const pathname = pathnameOnly(fullPath);
  if (pathname === ROUTES.portfolioAbstracts) return 'abstracts';
  if (pathname !== ROUTES.portfolioFigures) return 'all';
  const noHash = fullPath.split('#')[0] || '';
  const q = noHash.indexOf('?');
  if (q === -1) return 'all';
  const view = new URLSearchParams(noHash.slice(q + 1)).get('view');
  if (view === 'figures' || view === 'paper') return 'figures';
  if (view === 'abstracts') return 'abstracts';
  return 'all';
}

export function workshopDetailPrefix(): string {
  return `${ROUTES.workshops}/`;
}

/** `/scientific-illustration-workshops/:id` or legacy `/workshops/:id` */
export function isWorkshopDetailPath(pathname: string): boolean {
  const w = ROUTES.workshops + '/';
  if (pathname.startsWith(w) && pathname.length > w.length) return true;
  if (pathname.startsWith('/workshops/') && pathname.length > '/workshops/'.length) return true;
  return false;
}

export function workshopIdFromPath(fullPath: string): string | undefined {
  const pathname = pathnameOnly(fullPath);
  const w = ROUTES.workshops + '/';
  if (pathname.startsWith(w) && pathname.length > w.length) {
    return pathname.slice(w.length).split('/')[0] || undefined;
  }
  if (pathname.startsWith('/workshops/') && pathname.length > '/workshops/'.length) {
    return pathname.slice('/workshops/'.length).split('/')[0] || undefined;
  }
  return undefined;
}

export function workshopDetailHref(id: string): string {
  return `${ROUTES.workshops}/${id}`;
}

/** `/courses/:slug` (not the index `/courses`). */
export function isCourseDetailPath(pathname: string): boolean {
  const p = ROUTES.courses + '/';
  return pathname.startsWith(p) && pathname.length > p.length;
}

export function courseSlugFromPath(fullPath: string): string | undefined {
  const pathname = pathnameOnly(fullPath);
  const prefix = ROUTES.courses + '/';
  if (!pathname.startsWith(prefix) || pathname.length <= prefix.length) return undefined;
  const slug = pathname.slice(prefix.length).split('/')[0]?.trim();
  return slug || undefined;
}

export function isAppsPath(pathname: string): boolean {
  return pathname === ROUTES.apps || pathname === '/apps';
}

export function isPortfolioPath(pathname: string): boolean {
  return pathname === '/portfolio' || pathname.startsWith('/portfolio/');
}

/** Portfolio tab from URL, or `covers` for bare `/portfolio`. */
export function portfolioTabFromPathname(pathname: string): PortfolioTab {
  if (isAppsPath(pathname)) return 'websites-apps';
  if (pathname === '/portfolio') return 'covers';
  if (pathname === ROUTES.portfolioAbstracts) return 'figures';
  const tab = PATH_TO_PORTFOLIO_TAB.get(pathname);
  return tab ?? 'covers';
}

export function portfolioHrefForTab(tab: PortfolioTab): string {
  return PORTFOLIO_TAB_PATH[tab];
}

export const PORTFOLIO_SEO: Record<
  PortfolioTab,
  { title: string; description: string }
> = {
  covers: {
    title: 'Journal Cover Art Portfolio | Rafeeque Mavoor',
    description:
      'Published journal cover art and scientific illustration for leading journals—editorial-quality visuals for molecular biology, chemistry, and biomedicine.',
  },
  figures: {
    title: 'Research Figures Portfolio | Rafeeque Mavoor',
    description:
      'Peer-reviewed paper figures, multi-panel layouts, infographics, and graphical abstracts for journals and conferences—clear visuals for publications.',
  },
  illustrations: {
    title: 'Scientific Illustrations Portfolio | Rafeeque Mavoor',
    description:
      'Standalone scientific illustrations—editorial artwork, conceptual visuals, and molecular art beyond publication figures.',
  },
  logos: {
    title: 'Scientific Brand Logos | Rafeeque Mavoor',
    description:
      'Logo and visual identity projects for research labs, scientific initiatives, and academic programs, including concept development and symbol systems.',
  },
  'websites-apps': {
    title: 'Lab Websites & Science Apps | Rafeeque Mavoor',
    description:
      'Lab websites, SciDart tools, and interactive science apps—OpenScienceArt, MolDraw, and experiments in scientific software.',
  },
  videos: {
    title: 'Science Illustration Videos | Rafeeque Mavoor',
    description:
      'Scientific illustration walkthroughs, process reels, and education-focused video work for research communication.',
  },
};

/** True for paths that map to a real public page (not unknown slugs). */
export function isKnownPublicPath(pathname: string): boolean {
  if (isWorkshopDetailPath(pathname)) return true;
  if (pathname.startsWith('/blog/') && pathname.length > '/blog/'.length) return true;
  if (isCourseDetailPath(pathname)) return true;
  if (isPortfolioPath(pathname)) return true;
  if (LEGACY_PATH_TO_VIEW[pathname]) return true;

  const known = new Set<string>([
    ROUTES.home,
    ROUTES.services,
    ROUTES.workshops,
    ROUTES.about,
    ROUTES.contact,
    ROUTES.blog,
    ROUTES.courses,
    ROUTES.apps,
    ROUTES.login,
    ROUTES.dashboard,
    ROUTES.privacyPolicy,
    ROUTES.termsOfService,
    ROUTES.clipperPrivacyPolicy,
    ROUTES.editorialGuidelines,
    ROUTES.htmlSitemap,
    ROUTES.faq,
    ROUTES.resources,
  ]);
  return known.has(pathname);
}

export function getViewFromPath(fullPath: string): View {
  const pathname = pathnameOnly(fullPath);
  if (isWorkshopDetailPath(pathname)) return 'workshop-detail';
  if (pathname.startsWith('/blog/') && pathname.length > '/blog/'.length) return 'blog-detail';
  if (isCourseDetailPath(pathname)) return 'course-detail';

  const primary: Record<string, View> = {
    [ROUTES.home]: 'home',
    [ROUTES.services]: 'services',
    [ROUTES.workshops]: 'workshops',
    [ROUTES.about]: 'about',
    [ROUTES.contact]: 'contact',
    [ROUTES.blog]: 'blog',
    [ROUTES.courses]: 'courses',
    [ROUTES.apps]: 'apps',
    [ROUTES.login]: 'login',
    [ROUTES.dashboard]: 'dashboard',
    [ROUTES.privacyPolicy]: 'privacy',
    [ROUTES.termsOfService]: 'terms',
    [ROUTES.clipperPrivacyPolicy]: 'clipper-privacy',
    [ROUTES.editorialGuidelines]: 'editorial',
    [ROUTES.htmlSitemap]: 'html-sitemap',
    [ROUTES.faq]: 'faq',
    [ROUTES.resources]: 'resources',
  };

  const v = primary[pathname];
  if (v) return v;
  if (isPortfolioPath(pathname)) return 'portfolio';
  const legacy = LEGACY_PATH_TO_VIEW[pathname];
  if (legacy) return legacy;
  return 'not-found';
}

/** If URL is a legacy slug, return canonical pathname (no hash). For SPA replaceState. */
export function canonicalPathnameIfLegacy(pathname: string): string | null {
  if (pathname === '/services') return ROUTES.services;
  if (pathname === '/workshops') return ROUTES.workshops;
  if (pathname === '/academy') return ROUTES.courses;
  if (pathname === '/shop') return ROUTES.courses;
  if (pathname === '/about' || pathname === '/about-us') return ROUTES.about;
  if (pathname === '/contact') return ROUTES.contact;
  if (pathname === '/apps') return ROUTES.apps;
  if (pathname === '/copy-of-cover-arts-1' || pathname === '/copy-of-cover-arts-2') {
    return ROUTES.portfolioCovers;
  }
  if (pathname.startsWith('/workshops/')) {
    const id = pathname.slice('/workshops/'.length);
    return id ? `${ROUTES.workshops}/${id}` : ROUTES.workshops;
  }
  return null;
}
