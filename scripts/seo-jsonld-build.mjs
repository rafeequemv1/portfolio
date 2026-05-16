/**
 * JSON-LD builders for post-build prerender (mirrors utils/seo.ts shapes).
 */
const SITE_ORIGIN = 'https://rafeeque.com';
const DEFAULT_OG = `${SITE_ORIGIN}/og-image.jpg`;
const WORKSHOPS = '/scientific-illustration-workshops';
const COURSES = '/courses';
const BLOG = '/blog';

function absImage(url) {
  if (!url?.trim()) return DEFAULT_OG;
  const u = url.trim();
  if (u.startsWith('http')) return u;
  return `${SITE_ORIGIN}${u.startsWith('/') ? u : `/${u}`}`;
}

function eventAttendance(mode) {
  if (mode === 'Online') return 'https://schema.org/OnlineEventAttendanceMode';
  if (mode === 'Hybrid') return 'https://schema.org/MixedEventAttendanceMode';
  return 'https://schema.org/OfflineEventAttendanceMode';
}

export function buildBlogPostingJsonLd(post) {
  const pageUrl = `${SITE_ORIGIN}${post.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.date || undefined,
    author: {
      '@type': 'Person',
      name: 'Rafeeque Mavoor',
      url: SITE_ORIGIN,
      jobTitle: 'Scientific Illustrator and Educator',
    },
    publisher: {
      '@type': 'Person',
      name: 'Rafeeque Mavoor',
      url: SITE_ORIGIN,
    },
    image: absImage(post.imageUrl),
    url: pageUrl,
    mainEntityOfPage: pageUrl,
  };
}

export function buildWorkshopJsonLd(w) {
  const pageUrl = `${SITE_ORIGIN}${w.path}`;
  const plainDesc = (w.description || w.title || '').replace(/\s+/g, ' ').trim();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationEvent',
      name: w.title,
      description: plainDesc,
      startDate: w.date,
      endDate: w.date,
      eventAttendanceMode: eventAttendance(w.mode || 'Offline'),
      location: {
        '@type': 'Place',
        name: w.location || w.institute || 'See workshop details',
      },
      organizer: {
        '@type': 'Person',
        name: 'Rafeeque Mavoor',
        url: SITE_ORIGIN,
      },
      image: absImage(w.cover_image),
      url: pageUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'Workshops', item: `${SITE_ORIGIN}${WORKSHOPS}` },
        { '@type': 'ListItem', position: 3, name: w.title, item: pageUrl },
      ],
    },
  ];
}

export function buildCourseJsonLd(c) {
  const pageUrl = `${SITE_ORIGIN}${COURSES}/${c.slug}`;
  const desc = (c.description || c.title || '').trim();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: c.title,
      description: desc,
      url: pageUrl,
      provider: {
        '@type': 'Person',
        name: 'Rafeeque Mavoor',
        url: SITE_ORIGIN,
      },
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
        { '@type': 'ListItem', position: 2, name: 'Minicourses', item: `${SITE_ORIGIN}${COURSES}` },
        { '@type': 'ListItem', position: 3, name: c.title, item: pageUrl },
      ],
    },
  ];
}
