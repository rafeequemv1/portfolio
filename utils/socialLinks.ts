import type { View } from '../types';
import { ROUTES } from './routes';

export type SocialLinkId =
  | 'blog'
  | 'medium'
  | 'x'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'bluesky'
  | 'threads'
  | 'youtube';

export type SocialLinkEntry = {
  id: SocialLinkId;
  label: string;
  handle: string;
  href: string;
  external?: boolean;
  view?: View;
};

/** Public social profiles — shared by footer, About, and Contact. */
export const SOCIAL_LINKS: readonly SocialLinkEntry[] = [
  { id: 'blog', label: 'Blog', handle: 'Articles & tools', href: ROUTES.blog, view: 'blog' },
  {
    id: 'medium',
    label: 'Medium',
    handle: '@rafeequemavoor',
    href: 'https://medium.com/@rafeequemavoor',
    external: true,
  },
  { id: 'x', label: 'X', handle: '@rafeequemavoor', href: 'https://twitter.com/rafeequemavoor', external: true },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@rafeequemavoor',
    href: 'https://instagram.com/rafeequemavoor',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: '/in/rafeequemavoor',
    href: 'https://linkedin.com/in/rafeequemavoor',
    external: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'rafeequemvr',
    href: 'https://www.facebook.com/rafeequemvr/',
    external: true,
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    handle: '@rafeequemavoor',
    href: 'https://bsky.app/profile/rafeequemavoor',
    external: true,
  },
  {
    id: 'threads',
    label: 'Threads',
    handle: '@rafeequemavoor',
    href: 'https://www.threads.net/@rafeequemavoor',
    external: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@rafeeque-mavoor',
    href: 'https://www.youtube.com/@rafeeque-mavoor',
    external: true,
  },
] as const;
