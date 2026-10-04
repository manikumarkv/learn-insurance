// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { pickFresh, pickRandom, recentQuestions, rememberShown } from './pickQuestions';

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

describe('pickFresh', () => {
  it('skips questions seen recently', () => {
    for (let run = 0; run < 20; run++) {
      const picked = pickFresh(6, 3, new Set([0, 1, 2]));
      expect(picked.sort()).toEqual([3, 4, 5]);
    }
  });

  it('tops up with recent ones only when there are too few fresh ones', () => {
    const picked = pickFresh(4, 3, new Set([0, 1, 2]));
    expect(picked).toHaveLength(3);
    expect(picked[0]).toBe(3);
    expect(new Set(picked).size).toBe(3);
  });
});

describe('recent questions on this device', () => {
  beforeEach(() => localStorage.clear());

  it('remembers what was shown, keeping enough fresh questions for next time', () => {
    rememberShown('premium', [0, 1, 2], 6, 3);
    expect([...recentQuestions('premium')].sort()).toEqual([0, 1, 2]);
    rememberShown('premium', [3, 4, 5], 6, 3);
    // Only the newest 3 are kept, so 0–2 are fresh again.
    expect([...recentQuestions('premium')].sort()).toEqual([3, 4, 5]);
    expect(recentQuestions('claim').size).toBe(0);
  });
});
