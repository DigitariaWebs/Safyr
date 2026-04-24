/**
 * Format a date string or Date object to a human-readable format (French locale by default).
 * E.g. "2026-04-23" -> "23/04/2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR");
}

/**
 * Format a date string or Date object for HTML date inputs (YYYY-MM-DD).
 */
export function formatDateForInput(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

/**
 * Format a date string or Date object to a long human-readable format.
 * E.g. "2026-04-23" -> "23 avril 2026"
 */
export function formatLongDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
