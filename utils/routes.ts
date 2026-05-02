import type { View } from '../types';

/** Canonical public paths (SEO-friendly). Legacy short paths are still accepted — see `legacyPathToView`. */
export const ROUTES = {
  home: '/',
  services: '/scientific-illustration-services',
  workshops: '/scientific-illustration-workshops',
  about: '/about-scientific-illustrator-rafeeque-mavoor',
  contact: '/contact-scientific-illustration-commissions',
  blog: '/blog',
  /** Web apps & lab sites showcase (same Portfolio tab as “Web & apps”). */
  apps: '/science-web-apps-lab-websites',
  portfolioCovers: '/portfolio/journal-cover-art',
  portfolioFigures: '/portfolio/research-figures-infographics',
  portfolioAbstracts: '/portfolio/graphical-abstracts-research',
  portfolioWebApps: '/portfolio/lab-websites-science-apps',
  portfolioVideos: '/portfolio/scientific-illustration-videos',
  login: '/login',
  dashboard: '/dashboard',
} as const;

export type PortfolioTab = 'covers' | 'figures' | 'websites-apps' | 'videos';

/** Sub-filter when the active tab is `figures` (paper figures vs graphical abstracts). */
export type PortfolioFiguresGalleryFilter = 'all' | 'figures' | 'abstracts';

export const PORTFOLIO_TAB_PATH: Record<PortfolioTab, string> = {
  covers: ROUTES.portfolioCovers,
  figures: ROUTES.portfolioFigures,
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
    title: 'Journal Cover Art Portfolio | Rafeeque Mavoor | Nature, Science, Cell',
    description:
      'Published journal cover art and scientific illustration for leading journals—editorial-quality visuals for molecular biology, chemistry, and biomedicine.',
  },
  figures: {
    title: 'Research Figures, Infographics & Graphical Abstracts | Rafeeque Mavoor',
    description:
      'Peer-reviewed paper figures, multi-panel layouts, infographics, and graphical abstracts for journals and conferences—clear visuals for publications.',
  },
  'websites-apps': {
    title: 'Lab Websites & Science Web Apps | Rafeeque Mavoor',
    description:
      'Lab websites, SciDart tools, and interactive science apps—OpenScienceArt, MolDraw, and experiments in scientific software.',
  },
  videos: {
    title: 'Science Illustration & Process Videos | Rafeeque Mavoor',
    description:
      'Scientific illustration walkthroughs, process reels, and education-focused video work for research communication.',
  },
};

export function getViewFromPath(fullPath: string): View {
  const pathname = pathnameOnly(fullPath);
  if (isWorkshopDetailPath(pathname)) return 'workshop-detail';
  if (pathname.startsWith('/blog/') && pathname.length > '/blog/'.length) return 'blog-detail';

  const primary: Record<string, View> = {
    [ROUTES.home]: 'home',
    [ROUTES.services]: 'services',
    [ROUTES.workshops]: 'workshops',
    [ROUTES.about]: 'about',
    [ROUTES.contact]: 'contact',
    [ROUTES.blog]: 'blog',
    [ROUTES.apps]: 'apps',
    [ROUTES.login]: 'login',
    [ROUTES.dashboard]: 'dashboard',
  };

  const v = primary[pathname];
  if (v) return v;
  if (isPortfolioPath(pathname)) return 'portfolio';
  const legacy = LEGACY_PATH_TO_VIEW[pathname];
  if (legacy) return legacy;
  return 'home';
}

/** If URL is a legacy slug, return canonical pathname (no hash). For SPA replaceState. */
export function canonicalPathnameIfLegacy(pathname: string): string | null {
  if (pathname === '/services') return ROUTES.services;
  if (pathname === '/workshops') return ROUTES.workshops;
  if (pathname === '/about') return ROUTES.about;
  if (pathname === '/contact') return ROUTES.contact;
  if (pathname === '/apps') return ROUTES.apps;
  if (pathname === '/portfolio') return ROUTES.portfolioCovers;
  if (pathname.startsWith('/workshops/')) {
    const id = pathname.slice('/workshops/'.length);
    return id ? `${ROUTES.workshops}/${id}` : ROUTES.workshops;
  }
  return null;
}
