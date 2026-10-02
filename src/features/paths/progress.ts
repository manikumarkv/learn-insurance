/*
 * Learning progress (stories 7.2 and 7.5): a term counts as learned once it's answered correctly.
 * Signed-in people's learned terms come from /api/progress (Neon); guests' from this device.
 */

export const GUEST_LEARNED_KEY = 'learned-terms';

export interface ModuleProgress {
  done: number;
  total: number;
}

export interface PathProgress {
  done: number;
  total: number;
  /** Whole percent, rounded down so 99.6% never shows as 100%. */
  percent: number;
  /** The first term not learned yet, in path order; null when everything is learned. */
  nextTermId: string | null;
  modules: ModuleProgress[];
}

export function pathProgress(modules: { terms: string[] }[], learned: Set<string>): PathProgress {
  const perModule = modules.map((m) => ({
    done: m.terms.filter((id) => learned.has(id)).length,
    total: m.terms.length,
  }));
  const done = perModule.reduce((n, m) => n + m.done, 0);
  const total = perModule.reduce((n, m) => n + m.total, 0);
  const nextTermId = modules.flatMap((m) => m.terms).find((id) => !learned.has(id)) ?? null;
  return {
    done,
    total,
    percent: total ? Math.floor((done / total) * 100) : 0,
    nextTermId,
    modules: perModule,
  };
}

function guestLearned(): Set<string> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(GUEST_LEARNED_KEY) ?? '[]');
    return new Set(Array.isArray(saved) ? saved.filter((x) => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

/** Learned term IDs: from the account when signed in, otherwise from this device. */
export async function getLearnedTermIds(): Promise<Set<string>> {
  try {
    const res = await fetch('/api/progress');
    if (res.ok) {
      const body = (await res.json()) as { data: { termIds: string[] } };
      return new Set(body.data.termIds);
    }
  } catch {
    // Offline or no server (e.g. the static preview): fall back to the device.
  }
  return guestLearned();
}
