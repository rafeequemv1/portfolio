import type { Workshop, WorkshopStrand } from '../types';

export const WORKSHOP_STRAND_FILTERS: { id: 'all' | WorkshopStrand; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'illustration', label: 'Scientific illustration' },
  { id: 'outreach', label: 'Science activity & outreach' },
  { id: 'school', label: 'School students & kids' },
  { id: 'ai', label: 'AI training' },
];

function dedupeUrls(urls: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    const t = typeof u === 'string' ? u.trim() : '';
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

export function inferWorkshopStrand(title: string, explicit?: WorkshopStrand): WorkshopStrand {
  if (explicit) return explicit;
  const t = title.toLowerCase();
  if (/\b(ai|gpt|llm|generative|machine learning|prompt engineering)\b/i.test(t)) return 'ai';
  if (/(school|kids|k-12|k12|children|secondary school|high school|middle school|student camp|young learner)/i.test(t)) {
    return 'school';
  }
  if (
    /(festival|outreach|science festival|cdri|science activity|video production workshop|india science|augmented reality workshop|public engagement|community)/i.test(
      t
    )
  ) {
    return 'outreach';
  }
  return 'illustration';
}

/** Single image for list cards: dedicated cover, else first gallery image. */
export function workshopCardCoverUrl(workshop: Pick<Workshop, 'cover_image' | 'gallery_images'>): string | null {
  const c = typeof workshop.cover_image === 'string' ? workshop.cover_image.trim() : '';
  if (c) return c;
  const g = dedupeUrls(Array.isArray(workshop.gallery_images) ? workshop.gallery_images : []);
  return g[0] ?? null;
}

/**
 * Images for the detail carousel only — never repeats the list-card cover when
 * the same URL also appears in `gallery_images`. If there are no extra shots, returns a single image.
 */
export function workshopDetailGalleryUrls(workshop: Pick<Workshop, 'cover_image' | 'gallery_images'>): string[] {
  const cover = typeof workshop.cover_image === 'string' ? workshop.cover_image.trim() : '';
  const gallery = dedupeUrls(Array.isArray(workshop.gallery_images) ? workshop.gallery_images : []);
  const extras = cover ? gallery.filter((u) => u !== cover) : gallery;
  if (extras.length > 0) return extras;
  if (cover) return [cover];
  return gallery;
}
