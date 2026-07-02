import type { NewsItem, NewsLinkKind, View } from '../types';
import { ROUTES, workshopDetailHref } from './routes';

export const NEWS_LINK_KIND_OPTIONS: { value: NewsLinkKind; label: string; needsTarget?: boolean }[] = [
  { value: 'external', label: 'External URL' },
  { value: 'workshop', label: 'Workshop', needsTarget: true },
  { value: 'course', label: 'Course', needsTarget: true },
  { value: 'blog', label: 'Blog post', needsTarget: true },
  { value: 'portfolio_covers', label: 'Portfolio — Journal covers' },
  { value: 'portfolio_figures', label: 'Portfolio — Research figures' },
  { value: 'portfolio_abstracts', label: 'Portfolio — Graphical abstracts' },
  { value: 'portfolio_logos', label: 'Portfolio — Logos' },
  { value: 'portfolio_videos', label: 'Portfolio — Videos' },
  { value: 'portfolio_webapps', label: 'Portfolio — Lab websites & apps' },
  { value: 'services', label: 'Services' },
  { value: 'workshops', label: 'Workshops list' },
  { value: 'courses', label: 'Courses list' },
];

export function resolveNewsLink(item: Pick<NewsItem, 'linkKind' | 'linkTarget' | 'linkUrl'>): {
  path: string;
  view: View;
  external: boolean;
} {
  switch (item.linkKind) {
    case 'workshop':
      return {
        path: workshopDetailHref(item.linkTarget || ''),
        view: 'workshop-detail',
        external: false,
      };
    case 'course':
      return {
        path: `${ROUTES.courses}/${item.linkTarget || ''}`,
        view: 'course-detail',
        external: false,
      };
    case 'blog':
      return {
        path: `${ROUTES.blog}/${item.linkTarget || ''}`,
        view: 'blog-detail',
        external: false,
      };
    case 'portfolio_covers':
      return { path: ROUTES.portfolioCovers, view: 'portfolio', external: false };
    case 'portfolio_figures':
      return { path: ROUTES.portfolioFigures, view: 'portfolio', external: false };
    case 'portfolio_abstracts':
      return { path: ROUTES.portfolioAbstracts, view: 'portfolio', external: false };
    case 'portfolio_logos':
      return { path: ROUTES.portfolioLogos, view: 'portfolio', external: false };
    case 'portfolio_videos':
      return { path: ROUTES.portfolioVideos, view: 'portfolio', external: false };
    case 'portfolio_webapps':
      return { path: ROUTES.portfolioWebApps, view: 'portfolio', external: false };
    case 'services':
      return { path: ROUTES.services, view: 'services', external: false };
    case 'workshops':
      return { path: ROUTES.workshops, view: 'workshops', external: false };
    case 'courses':
      return { path: ROUTES.courses, view: 'courses', external: false };
    case 'external':
    default:
      return {
        path: item.linkUrl || ROUTES.home,
        view: 'home',
        external: true,
      };
  }
}

export function formatNewsDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
