/**
 * Slug generation and sanitation utility
 */
export function generateSlug(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric chars except space and hyphen
    .replace(/[\s_-]+/g, "-") // collapse whitespace and underscores into single hyphens
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
}
