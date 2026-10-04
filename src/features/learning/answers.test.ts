// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GUEST_LEARNED_KEY } from '../paths/progress';
import { recordAnswer } from './answers';

const answer = { termId: 'premium', questionIndex: 0, chosenIndex: 1, isCorrect: true };

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('recordAnswer', () => {
  it('saves to the account when signed in', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await recordAnswer(answer)).toBe('account');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/answers',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(localStorage.getItem(GUEST_LEARNED_KEY)).toBeNull();
  });

  it("keeps a guest's learned terms on the device, once each", async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 401 }));
    await recordAnswer(answer);
    await recordAnswer(answer);
    await recordAnswer({ ...answer, termId: 'claim', isCorrect: false });
    expect(JSON.parse(localStorage.getItem(GUEST_LEARNED_KEY) ?? '[]')).toEqual(['premium']);
  });
});
