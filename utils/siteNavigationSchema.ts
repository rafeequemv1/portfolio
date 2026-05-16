import { ROUTES } from './routes';
import { SEO_SITE_ORIGIN } from './seo';

/** Primary nav links for SiteNavigationElement JSON-LD and crawl shells. */
export const PRIMARY_NAV_LINKS: readonly { name: string; path: string }[] = [
  { name: 'Home', path: ROUTES.home },
  { name: 'Portfolio', path: ROUTES.portfolioCovers },
  { name: 'Services', path: ROUTES.services },
  { name: 'Workshops', path: ROUTES.workshops },
  { name: 'About', path: ROUTES.about },
  { name: 'Contact', path: ROUTES.contact },
  { name: 'Blog', path: ROUTES.blog },
];

export function siteNavigationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Site navigation',
    itemListElement: PRIMARY_NAV_LINKS.map((link, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 1,
      name: link.name,
      url: `${SEO_SITE_ORIGIN}${link.path === '/' ? '/' : link.path}`,
    })),
  };
}
