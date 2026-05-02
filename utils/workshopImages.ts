import type { Workshop } from '../types';

export function workshopImageList(workshop: Pick<Workshop, 'gallery_images' | 'cover_image'>): string[] {
  const raw = workshop.gallery_images;
  const fromGallery = Array.isArray(raw) ? raw.filter((u): u is string => typeof u === 'string' && u.trim() !== '') : [];
  if (fromGallery.length > 0) return fromGallery;
  if (workshop.cover_image?.trim()) return [workshop.cover_image.trim()];
  return [];
}
