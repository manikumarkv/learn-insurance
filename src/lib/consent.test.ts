// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getConsent, hasAnalyticsConsent, onConsentChange, setConsent } from './consent';

describe('consent', () => {
  beforeEach(() => localStorage.clear());

  it('is unset until the visitor chooses', () => {
    expect(getConsent()).toBeNull();
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('remembers the choice and tells listeners', () => {
    const listener = vi.fn();
    const stop = onConsentChange(listener);
    setConsent('analytics');
    expect(getConsent()).toBe('analytics');
    expect(hasAnalyticsConsent()).toBe(true);
    expect(listener).toHaveBeenCalledWith('analytics');
    stop();
    setConsent('necessary');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it('ignores unknown saved values', () => {
    localStorage.setItem('cookie-consent', 'everything');
    expect(getConsent()).toBeNull();
  });
});
