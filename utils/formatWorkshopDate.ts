/** Format workshop date for display; handles TBD, empty, and non-ISO strings from the DB. */
export function formatWorkshopDate(dateStr: string | null | undefined, withDay = false): string {
  if (dateStr == null || String(dateStr).trim() === '') return 'Date TBD';
  const s = String(dateStr).trim();
  if (/^tbd$/i.test(s)) return 'Date TBD';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    ...(withDay ? { day: 'numeric' as const } : {}),
  });
}
