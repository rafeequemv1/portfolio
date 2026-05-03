/** Build embed URL from a watch, youtu.be, or embed link. */
export function getYoutubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').slice(0, 11);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    const id = parsed.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
    const parts = parsed.pathname.split('/').filter(Boolean);
    const embedIdx = parts.indexOf('embed');
    if (embedIdx >= 0 && parts[embedIdx + 1]) {
      return `https://www.youtube.com/embed/${parts[embedIdx + 1].slice(0, 11)}`;
    }
    const last = parts[parts.length - 1];
    if (last && /^[\w-]{11}$/.test(last)) return `https://www.youtube.com/embed/${last}`;
  } catch {
    /* ignore */
  }
  return '';
}
