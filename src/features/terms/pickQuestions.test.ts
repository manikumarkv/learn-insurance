import { describe, expect, it } from 'vitest';
import { pickRandom } from './pickQuestions';

describe('pickRandom', () => {
  it('returns the requested number of distinct items', () => {
    const picked = pickRandom([1, 2, 3, 4, 5, 6], 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
  });

  it('returns everything when the pool is smaller than the count', () => {
    expect(pickRandom([1, 2], 3).sort()).toEqual([1, 2]);
  });

  it('does not change the original list', () => {
    const items = [1, 2, 3];
    pickRandom(items, 2);
    expect(items).toEqual([1, 2, 3]);
  });
});
