/** The parts of Pagefind's browser API that we use. */
export interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string; kind?: string; usage?: string };
}

interface Pagefind {
  init: () => Promise<void>;
  search: (
    query: string,
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] }>;
}

let loading: Promise<Pagefind> | undefined;

/** Loads /pagefind/pagefind.js, which `pnpm build` creates. Not available on the dev server. */
export function loadPagefind(): Promise<Pagefind> {
  loading ??= (async () => {
    const path = '/pagefind/pagefind.js';
    const pagefind = (await import(/* @vite-ignore */ path)) as Pagefind;
    await pagefind.init();
    return pagefind;
  })();
  return loading;
}

export interface SearchHit {
  url: string;
  title: string;
  kind: 'Term' | 'Insurance type';
  usage?: string;
  excerpt: string;
}

/** Turns a Pagefind result into what the results list shows. */
export function toHit(d: PagefindResultData): SearchHit {
  return {
    url: d.url.replace(/\/$/, ''),
    title: d.meta.title ?? d.url,
    kind: d.meta.kind === 'Insurance type' ? 'Insurance type' : 'Term',
    ...(d.meta.usage ? { usage: d.meta.usage } : {}),
    excerpt: d.excerpt,
  };
}

/** True when the query is the hit's name or abbreviation, e.g. "hmo" for "HMO (Health Maintenance Organization)". */
export function isExactMatch(hit: SearchHit, query: string): boolean {
  const q = query.trim().toLowerCase();
  const title = hit.title.toLowerCase();
  const inBrackets = [...title.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]);
  return [title, title.replace(/\s*\(.*\)$/, ''), ...inBrackets].includes(q);
}

/**
 * Puts exact name matches first: "deductible" → Deductible before Hurricane Deductible,
 * and "hmo" → HMO (Health Maintenance Organization). Otherwise keeps Pagefind's order.
 */
export function rankHits(hits: SearchHit[], query: string): SearchHit[] {
  const exact = (h: SearchHit) => (isExactMatch(h, query) ? 0 : 1);
  return hits
    .map((h, i) => ({ h, i }))
    .sort((a, b) => exact(a.h) - exact(b.h) || a.i - b.i)
    .map(({ h }) => h);
}
