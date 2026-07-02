import type { Testimonial, TestimonialContentType } from '../types';

export function mapTestimonialRow(row: Record<string, unknown>): Testimonial {
  return {
    id: String(row.id),
    authorName: String(row.author_name || ''),
    authorRole: (row.author_role as string) || null,
    authorOrg: (row.author_org as string) || null,
    quote: (row.quote as string) || null,
    contentType: (row.content_type as TestimonialContentType) || 'quote',
    sourceUrl: (row.source_url as string) || null,
    imageUrl: (row.image_url as string) || null,
    linkUrl: (row.link_url as string) || null,
    linkLabel: (row.link_label as string) || null,
    displayOrder: typeof row.display_order === 'number' ? row.display_order : 0,
    isPublished: row.is_published !== false,
    createdAt: row.created_at as string | undefined,
  };
}

export function testimonialToPayload(form: {
  authorName: string;
  authorRole: string;
  authorOrg: string;
  quote: string;
  contentType: TestimonialContentType;
  sourceUrl: string;
  imageUrl: string;
  linkUrl: string;
  linkLabel: string;
  displayOrder: number;
  isPublished: boolean;
}) {
  return {
    author_name: form.authorName.trim(),
    author_role: form.authorRole.trim() || null,
    author_org: form.authorOrg.trim() || null,
    quote: form.quote.trim() || null,
    content_type: form.contentType,
    source_url: form.sourceUrl.trim() || null,
    image_url: form.imageUrl.trim() || null,
    link_url: form.linkUrl.trim() || null,
    link_label: form.linkLabel.trim() || null,
    display_order: Number(form.displayOrder || 0),
    is_published: form.isPublished,
  };
}
