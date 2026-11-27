/** Formats an amount as NPR with lakh/crore grouping, e.g. "Rs 1,25,000.00". Mirrors the web app. */
export function formatMoney(value: string | number | null | undefined, symbol = 'Rs'): string {
  const number = Number(value ?? 0);
  const [integer, decimals] = Math.abs(number).toFixed(2).split('.');

  let grouped = integer;

  if (integer.length > 3) {
    const lastThree = integer.slice(-3);
    const rest = integer.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    grouped = `${rest},${lastThree}`;
  }

  return `${number < 0 ? '-' : ''}${symbol} ${grouped}.${decimals}`;
}

/** Converts a money string such as "1250.50" to whole paisa (125050) without floating-point maths. */
export function toCents(value: string): number {
  const trimmed = value.trim();
  const negative = trimmed.startsWith('-');
  const [integer, decimals = ''] = trimmed.replace('-', '').split('.');
  const cents = Number(integer || '0') * 100 + Number((decimals + '00').slice(0, 2));

  return negative ? -cents : cents;
}

/** Converts whole paisa back to a money string, e.g. 125050 -> "1250.50". */
export function fromCents(cents: number): string {
  const absolute = Math.abs(cents);

  return `${cents < 0 ? '-' : ''}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, '0')}`;
}