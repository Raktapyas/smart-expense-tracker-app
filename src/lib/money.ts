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