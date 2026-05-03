/**
 * Supabase image transforms (`/storage/v1/render/image/...`) serve WebP (or AVIF) at bounded widths — required for acceptable LCP on large PNGs in Storage.
 * - Production builds: transforms **on** unless `VITE_SUPABASE_FIGURE_IMAGE_TRANSFORM=false` (or `VITE_USE_ORIGINAL_FIGURE_URLS=1`).
 * - Development: transforms **off** unless `VITE_SUPABASE_FIGURE_IMAGE_TRANSFORM=true`.
 * Storage must allow the Image Transformation API (paid tier / compatible project).
 */
const MAX_TRANSFORM_WIDTH = 2500;

function supabaseImageTransformEnabled(): boolean {
  if (import.meta.env.VITE_USE_ORIGINAL_FIGURE_URLS === '1') return false;
  const flag = import.meta.env.VITE_SUPABASE_FIGURE_IMAGE_TRANSFORM;
  if (flag === 'false' || flag === '0') return false;
  if (flag === 'true' || flag === '1') return true;
  return Boolean(import.meta.env.PROD);
}

export function figureImageDisplayUrl(url: string, options?: { width?: number; quality?: number }): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return trimmed;
  if (!supabaseImageTransformEnabled()) return trimmed;
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
