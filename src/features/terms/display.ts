import type { Term } from '../../content/schema/term';

/**
 * Page title by the abbreviation rules in docs/content/term-schema.md:
 * "HMO (Health Maintenance Organization)" when people mostly use the abbreviation,
 * otherwise "Actual Cash Value (ACV)".
 */
export function displayTitle(
  t: Pick<Term, 'term' | 'abbreviation' | 'abbreviationIsCommonName'>,
): string {
  if (!t.abbreviation) return t.term;
  return t.abbreviationIsCommonName
    ? `${t.abbreviation} (${t.term})`
    : `${t.term} (${t.abbreviation})`;
}

/** Shortest name to show in lists and links: the abbreviation when that's the common name. */
export function shortName(
  t: Pick<Term, 'term' | 'abbreviation' | 'abbreviationIsCommonName'>,
): string {
  return t.abbreviation && t.abbreviationIsCommonName ? t.abbreviation : t.term;
}

/** Cuts text at a word boundary so it fits `max` characters, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`;
}

/** SEO title and description. Full terms use their own; basic terms get generated ones. */
export function seoFor(t: Term): { title: string; description: string } {
  const name = shortName(t);
  const title = t.seo?.metaTitle ?? truncate(`What Is ${name}? Insurance Definition & Example`, 60);
  const description = t.seo?.metaDescription ?? truncate(t.quickAnswer ?? t.definition, 160);
  return { title, description };
}

export function formatDate(value: string | Date | undefined): string | undefined {
  if (!value) return undefined;
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00Z`) : value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
