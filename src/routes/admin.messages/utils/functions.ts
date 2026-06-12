/**
 * Formats a message timestamp into a concise, human-readable label relative to now.
 *
 * The function returns `Today`, `Yesterday`, or `"<n> days ago"` for dates within the past week;
 * for older dates it returns a locale-formatted short month and day (e.g., `Jun 5`), and includes the year
 * (e.g., `Jun 5, 2024`) only when the date's year differs from the current year.
 *
 * @param dateString - A string parseable by the `Date` constructor representing the message time
 * @returns A human-readable date label as described above
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
