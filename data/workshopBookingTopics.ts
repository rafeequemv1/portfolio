export const WORKSHOP_BOOKING_TOPIC_OPTIONS = [
  { id: 'scientific_illustration', label: 'Scientific illustration' },
  { id: 'ai_tools_research', label: 'AI tools for research' },
] as const;

export type WorkshopBookingTopicId = (typeof WORKSHOP_BOOKING_TOPIC_OPTIONS)[number]['id'];

export function formatBookingTopicIds(ids: string[] | null | undefined): string {
  if (!ids?.length) return '—';
  const labels = ids
    .map((id) => WORKSHOP_BOOKING_TOPIC_OPTIONS.find((o) => o.id === id)?.label || id)
    .filter(Boolean);
  return labels.join(', ');
}
