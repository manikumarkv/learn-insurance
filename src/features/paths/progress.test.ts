// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLearnedTermIds, GUEST_LEARNED_KEY, pathProgress } from './progress';

const modules = [{ terms: ['premium', 'deductible'] }, { terms: ['claim', 'renewal', 'quote'] }];

describe('pathProgress', () => {
  it('counts learned terms per module and overall', () => {
    const p = pathProgress(modules, new Set(['premium', 'deductible', 'renewal']));
    expect(p).toEqual({
      done: 3,
      total: 5,
      percent: 60,
      nextTermId: 'claim',
      modules: [
        { done: 2, total: 2 },
        { done: 1, total: 3 },
      ],
    });
  });

  it('starts at the first term and ends with nothing next', () => {
    expect(pathProgress(modules, new Set()).nextTermId).toBe('premium');
    const all = pathProgress(
      modules,
      new Set(['premium', 'deductible', 'claim', 'renewal', 'quote']),
    );
    expect(all).toMatchObject({ percent: 100, nextTermId: null });
  });

  it('rounds down, so almost done is not 100%', () => {
    const many = [{ terms: Array.from({ length: 200 }, (_, i) => `t${i}`) }];
    const learned = new Set(many[0]?.terms.slice(0, 199));
    expect(pathProgress(many, learned).percent).toBe(99);
  });
});

describe('getLearnedTermIds', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('uses the account when signed in', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ data: { termIds: ['claim'] } }));
    expect([...(await getLearnedTermIds())]).toEqual(['claim']);
  });

  it('falls back to this device for guests', async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 401 }));
    localStorage.setItem(GUEST_LEARNED_KEY, JSON.stringify(['premium', 42]));
    expect([...(await getLearnedTermIds())]).toEqual(['premium']);
  });
});
