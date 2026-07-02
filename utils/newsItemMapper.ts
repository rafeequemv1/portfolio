import type { NewsItem } from '../types';

export function mapNewsItemRow(row: Record<string, unknown>): NewsItem {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    summary: (row.summary as string) || null,
    thumbnailUrl: (row.thumbnail_url as string) || null,
    thumbnailSourceKind: (row.thumbnail_source_kind as NewsItem['thumbnailSourceKind']) || null,
    thumbnailSourceId: (row.thumbnail_source_id as string) || null,
    publishedAt: String(row.published_at || new Date().toISOString().slice(0, 10)),
    displayOrder: typeof row.display_order === 'number' ? row.display_order : 0,
    isPublished: row.is_published !== false,
    linkKind: (row.link_kind as NewsItem['linkKind']) || 'external',
    linkTarget: (row.link_target as string) || null,
    linkUrl: (row.link_url as string) || null,
    createdAt: row.created_at as string | undefined,
  };
}

export function newsItemToPayload(form: {
  title: string;
  summary: string;
  thumbnailUrl: string;
  thumbnailSourceKind: string;
  thumbnailSourceId: string;
  publishedAt: string;
  displayOrder: number;
  isPublished: boolean;
  linkKind: string;
  linkTarget: string;
  linkUrl: string;
}) {
  return {
    title: form.title.trim(),
    summary: form.summary.trim() || null,
    thumbnail_url: form.thumbnailUrl.trim() || null,
    thumbnail_source_kind: form.thumbnailSourceKind || null,
    thumbnail_source_id: form.thumbnailSourceId || null,
    published_at: form.publishedAt,
    display_order: Number(form.displayOrder || 0),
    is_published: form.isPublished,
    link_kind: form.linkKind,
    link_target: form.linkTarget.trim() || null,
    link_url: form.linkUrl.trim() || null,
  };
}
