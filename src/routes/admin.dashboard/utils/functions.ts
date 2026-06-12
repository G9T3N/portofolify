/**
 * Format a numeric statistic for compact display, using a `k` suffix for thousands.
 *
 * @param value - The numeric statistic to format; values greater than or equal to 1000 are converted to `k` units.
 * @returns The formatted string: values >= 1000 are shown with one decimal place and a trailing `k` (e.g., `1200` → `1.2k`), otherwise the number as a string (e.g., `999` → `999`).
 */
export function formatStatValue(value: number): string {
  if (value >= 1000) {return `${(value / 1000).toFixed(1)}k`;}
  return String(value);
}
