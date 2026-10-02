/** Edit distance between two strings (Levenshtein), case-insensitive. */
export function distance(a: string, b: string): number {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  let prev = Array.from({ length: t.length + 1 }, (_, i) => i);
  for (let i = 1; i <= s.length; i++) {
    const row = [i];
    for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      row[j] = Math.min((prev[j] ?? 0) + 1, (row[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    prev = row;
  }
  return prev[t.length] ?? 0;
}

export interface Suggestable {
  id: string;
  title: string;
  abbreviation?: string;
}

/**
 * "Did you mean…" for a search with no results: names and abbreviations within a few typos.
 * Allows 1 typo for short words, 2 for medium and 3 for long ones.
 */
export function suggest(query: string, items: Suggestable[], max = 3): Suggestable[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const allowed = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;
  const scored: { item: Suggestable; score: number }[] = [];
  for (const item of items) {
    const name = item.title.replace(/\s*\(.*\)$/, '');
    const candidates = [name, item.abbreviation ?? ''].filter(Boolean);
    const score = Math.min(...candidates.map((c) => distance(q, c)));
    if (score <= allowed) scored.push({ item, score });
  }
  return scored
    .sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title))
    .slice(0, max)
    .map((s) => s.item);
}
