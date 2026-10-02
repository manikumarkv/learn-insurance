// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setConsent } from './consent';

const posthog = {
  init: vi.fn(),
  capture: vi.fn(),
  opt_in_capturing: vi.fn(),
  opt_out_capturing: vi.fn(),
};
const loaded = vi.fn();
vi.mock('posthog-js', () => {
  loaded();
  return { default: posthog };
});

async function freshAnalytics(key: string | undefined = 'phc_test') {
  vi.resetModules();
  vi.stubEnv('PUBLIC_POSTHOG_KEY', key ?? '');
  return import('./analytics');
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads nothing and sends nothing without consent', async () => {
    const { startAnalytics, track } = await freshAnalytics();
    startAnalytics();
    track('search', { query: 'deductible', results: 3 });
    await flush();
    expect(loaded).not.toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('sends events once analytics is accepted, without identifying anyone', async () => {
    setConsent('analytics');
    const { startAnalytics, track } = await freshAnalytics();
    startAnalytics();
    track('term_view', { term_id: 'deductible' });
    await flush();
    expect(posthog.init).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({ autocapture: false, disable_session_recording: true }),
    );
    expect(posthog.capture).toHaveBeenCalledWith('term_view', { term_id: 'deductible' });
  });

  it('stops capturing when the visitor switches analytics off', async () => {
    setConsent('analytics');
    const { startAnalytics } = await freshAnalytics();
    startAnalytics();
    await flush();
    setConsent('necessary');
    await flush();
    expect(posthog.opt_out_capturing).toHaveBeenCalled();
  });

  it('stays off without a PostHog key, even with consent', async () => {
    setConsent('analytics');
    const { startAnalytics, track } = await freshAnalytics('');
    startAnalytics();
    track('answer', { term_id: 'deductible', correct: true });
    await flush();
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
