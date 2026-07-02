/** Extract Twitter/X status id from a post URL. */
export function getTwitterStatusId(url: string): string {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, '');
    if (!host.includes('twitter.com') && !host.includes('x.com')) return '';
    const parts = parsed.pathname.split('/').filter(Boolean);
    const statusIdx = parts.indexOf('status');
    if (statusIdx >= 0 && parts[statusIdx + 1]) {
      return parts[statusIdx + 1].split('?')[0] || '';
    }
  } catch {
    /* ignore */
  }
  return '';
}

export function getTwitterEmbedSrc(url: string): string {
  const id = getTwitterStatusId(url);
  return id ? `https://platform.twitter.com/embed/Tweet.html?dnt=true&id=${id}` : '';
}

export function isLinkedInPostUrl(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname.replace(/^www\./, '');
    return host === 'linkedin.com' || host.endsWith('.linkedin.com');
  } catch {
    return false;
  }
}

export function getLinkedInEmbedSrc(url: string): string {
  const trimmed = url.trim();
  if (!isLinkedInPostUrl(trimmed)) return '';
  if (trimmed.includes('/embed/')) return trimmed;
  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.replace(/\/$/, '');
    if (path.includes('/posts/') || path.includes('/feed/update/')) {
      return `https://www.linkedin.com/embed${path.startsWith('/embed') ? path.slice(6) : path}`;
    }
  } catch {
    /* ignore */
  }
  return '';
}
