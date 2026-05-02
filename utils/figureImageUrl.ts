/**
 * Supabase image transforms (`/render/image/...`) need a plan that supports them and width ≤ 2500.
 * By default we return the original public URL so figures always load on the free tier.
 * Set `VITE_SUPABASE_FIGURE_IMAGE_TRANSFORM=true` to use WebP render URLs (Pro / eligible projects).
 */
const MAX_TRANSFORM_WIDTH = 2500;

export function figureImageDisplayUrl(url: string, options?: { width?: number; quality?: number }): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return trimmed;
  if (import.meta.env.VITE_SUPABASE_FIGURE_IMAGE_TRANSFORM !== 'true') return trimmed;
  if (import.meta.env.VITE_USE_ORIGINAL_FIGURE_URLS === '1') return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('data:')) return trimmed;
  if (trimmed.includes('/storage/v1/render/image/')) return trimmed;

  const m = trimmed.match(/^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!m) return trimmed;

  const [, origin, bucket, objectPath] = m;
  const requested = options?.width ?? 2000;
  const width = Math.min(Math.max(1, requested), MAX_TRANSFORM_WIDTH);
  const quality = Math.min(100, Math.max(20, options?.quality ?? 85));
  const safePath = objectPath.split('/').map((seg) => encodeURIComponent(seg)).join('/');
  return `${origin}/storage/v1/render/image/public/${bucket}/${safePath}?width=${width}&format=webp&quality=${quality}`;
}
