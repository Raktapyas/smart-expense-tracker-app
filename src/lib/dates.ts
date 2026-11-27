const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-11-10" -> "10 Nov" (or "10 Nov 2026"), without any timezone conversion. */
export function formatDay(iso: string, withYear = false): string {
  const [year, month, day] = iso.split('-').map(Number);

  return `${day} ${MONTHS[month - 1]}${withYear ? ` ${year}` : ''}`;
}