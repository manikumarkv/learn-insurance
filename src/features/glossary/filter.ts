import { DIFFICULTIES, LINE_IDS, USAGE_FREQUENCIES } from '../../content/schema/values';

/** One row in Terms A–Z. Kept small: the list of 1,000+ terms is sent to the browser as JSON. */
export interface GlossaryItem {
  id: string;
  title: string;
  abbreviation?: string;
  usage: (typeof USAGE_FREQUENCIES)[number];
  difficulty: (typeof DIFFICULTIES)[number];
  lines: (typeof LINE_IDS)[number][];
  summary: string;
  full: boolean;
}

export const PAGE_SIZE = 30;
export const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'] as const;
export type Letter = (typeof LETTERS)[number];

export interface GlossaryFilters {
  letter?: Letter;
  usage?: GlossaryItem['usage'];
  difficulty?: GlossaryItem['difficulty'];
  /** A line ID, e.g. "auto". Terms tagged "all" match every line. */
  type?: GlossaryItem['lines'][number];
  abbreviations?: boolean;
  sort: 'az' | 'most-used';
  page: number;
}

export const DEFAULT_FILTERS: GlossaryFilters = { sort: 'az', page: 1 };

export function letterOf(title: string): Letter {
  const first = title.trim().charAt(0).toUpperCase();
  return (LETTERS as readonly string[]).includes(first) ? (first as Letter) : '#';
}

const USAGE_RANK: Record<GlossaryItem['usage'], number> = { High: 0, Medium: 1, Low: 2 };

/** Applies everything except pagination. */
export function filterAndSort(items: GlossaryItem[], f: GlossaryFilters): GlossaryItem[] {
  const out = items.filter(
    (i) =>
      (!f.letter || letterOf(i.title) === f.letter) &&
      (!f.usage || i.usage === f.usage) &&
      (!f.difficulty || i.difficulty === f.difficulty) &&
      (!f.type || i.lines.includes(f.type) || i.lines.includes('all')) &&
      (!f.abbreviations || Boolean(i.abbreviation)),
  );
  const byTitle = (a: GlossaryItem, b: GlossaryItem) => a.title.localeCompare(b.title, 'en');
  return out.sort(
    f.sort === 'most-used'
      ? (a, b) => USAGE_RANK[a.usage] - USAGE_RANK[b.usage] || byTitle(a, b)
      : byTitle,
  );
}

export function paginate<T>(items: T[], page: number): { items: T[]; page: number; pages: number } {
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  return {
    items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    page: current,
    pages,
  };
}

function oneOf<T extends string>(values: readonly T[], value: string | null): T | undefined {
  return value !== null && (values as readonly string[]).includes(value) ? (value as T) : undefined;
}

/** Reads filters from a query string. Unknown or invalid values are ignored. */
export function filtersFromQuery(query: string): GlossaryFilters {
  const q = new URLSearchParams(query);
  const page = Number.parseInt(q.get('page') ?? '1', 10);
  return {
    letter: oneOf(LETTERS, q.get('letter')),
    usage: oneOf(USAGE_FREQUENCIES, q.get('usage')),
    difficulty: oneOf(DIFFICULTIES, q.get('difficulty')),
    type: oneOf(LINE_IDS, q.get('type')),
    abbreviations: q.get('abbr') === '1' || undefined,
    sort: q.get('sort') === 'most-used' ? 'most-used' : 'az',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Writes filters to a query string, leaving out defaults so URLs stay short. */
export function filtersToQuery(f: GlossaryFilters): string {
  const q = new URLSearchParams();
  if (f.letter) q.set('letter', f.letter);
  if (f.usage) q.set('usage', f.usage);
  if (f.difficulty) q.set('difficulty', f.difficulty);
  if (f.type) q.set('type', f.type);
  if (f.abbreviations) q.set('abbr', '1');
  if (f.sort !== 'az') q.set('sort', f.sort);
  if (f.page > 1) q.set('page', String(f.page));
  const s = q.toString();
  return s ? `?${s}` : '';
}
