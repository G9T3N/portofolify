/**
 * Formats a numeric stat for compact display, using a "k" suffix for thousands.
 *
 * Values 1000 or greater are converted to thousands with one decimal place and a trailing "k" (e.g., 1200 -> "1.2k"); smaller values are returned as their plain decimal string.
 *
 * @param value - The numeric stat value to format
 * @returns The formatted stat string
 */
export function formatStatValue(value: number): string {
  if (value >= 1000) {return `${(value / 1000).toFixed(1)}k`;}
  return String(value);
}

/**
 * Format a message timestamp into a human-friendly relative or calendar date.
 *
 * @param dateString - A string accepted by the JavaScript `Date` constructor representing the timestamp to format
 * @returns `'Today'` if the timestamp is on the current day, `'Yesterday'` if it was the previous day, `'<n> days ago'` for 2–6 days in the past, or a locale-formatted date (e.g., `Jan 5` or `Jan 5, 2024`) for older dates
 */
export function formatMessageDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {return "Today";}
  if (diffDays === 1) {return "Yesterday";}
  if (diffDays < 7) {return `${diffDays} days ago`;}

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
