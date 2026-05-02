/**
 * Prefer WebP via Supabase Storage image render API when the URL is a public object URL.
 * Falls back to the original URL for non-Supabase assets or if the pattern does not match.
 * Set `VITE_USE_ORIGINAL_FIGURE_URLS=1` if transforms are unavailable and images fail to load.
 */
export function figureImageDisplayUrl(url: string, options?: { width?: number; quality?: number }): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return trimmed;
  if (import.meta.env.VITE_USE_ORIGINAL_FIGURE_URLS === '1') return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('data:')) return trimmed;
  if (trimmed.includes('/storage/v1/render/image/')) return trimmed;

  const m = trimmed.match(/^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!m) return trimmed;

  const [, origin, bucket, objectPath] = m;
  const width = options?.width ?? 2400;
  const quality = options?.quality ?? 85;
  const safePath = objectPath.split('/').map((seg) => encodeURIComponent(seg)).join('/');
  return `${origin}/storage/v1/render/image/public/${bucket}/${safePath}?width=${width}&format=webp&quality=${quality}`;
}
