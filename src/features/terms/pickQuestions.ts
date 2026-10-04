/** Picks `count` items at random without repeats (Fisher–Yates on a copy). */
export function pickRandom<T>(
  items: readonly T[],
  count: number,
  random: () => number = Math.random,
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy.slice(0, count);
}

/**
 * Picks `count` question positions from a pool of `poolSize`, preferring ones not in `recent`
 * (story 7.3). Only tops up with recent questions when there aren't enough fresh ones.
 */
export function pickFresh(
  poolSize: number,
  count: number,
  recent: ReadonlySet<number>,
  random: () => number = Math.random,
): number[] {
  const all = Array.from({ length: poolSize }, (_, i) => i);
  const fresh = pickRandom(
    all.filter((i) => !recent.has(i)),
    count,
    random,
  );
  const topUp = pickRandom(
    all.filter((i) => recent.has(i)),
    count - fresh.length,
    random,
  );
  return [...fresh, ...topUp];
}

const RECENT_KEY = 'recent-questions';

function readRecent(): Record<string, number[]> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '{}');
    return saved && typeof saved === 'object' ? (saved as Record<string, number[]>) : {};
  } catch {
    return {};
  }
}

/** Questions of a term shown recently on this device. */
export function recentQuestions(termId: string): Set<number> {
  const list = readRecent()[termId];
  return new Set(Array.isArray(list) ? list.filter((n) => Number.isInteger(n)) : []);
}

/**
 * Remembers the questions just shown. Keeps only the newest ones that still leave enough
 * fresh questions for next time (pool size minus how many are shown at once).
 */
export function rememberShown(termId: string, shown: number[], poolSize: number, count: number) {
  const keep = Math.max(poolSize - count, 0);
  const all = readRecent();
  const merged = [...shown, ...(all[termId] ?? []).filter((n) => !shown.includes(n))];
  all[termId] = merged.slice(0, keep);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(all));
  } catch {
    // Storage blocked: questions may repeat sooner.
  }
}
