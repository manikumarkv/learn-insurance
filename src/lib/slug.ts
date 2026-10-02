/**
 * Turns a term or type name into a URL slug, e.g. "Actual Cash Value (ACV)" -> "actual-cash-value-acv".
 */
export function toSlug(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
