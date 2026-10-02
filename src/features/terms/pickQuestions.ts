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
// TODO(story 7.x): avoid questions the learner has seen recently, once progress is stored.
