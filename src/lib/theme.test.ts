import { describe, expect, it } from 'vitest';
import { isTheme, resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('uses a saved choice as is', () => {
    expect(resolveTheme('dark-hc', false, false)).toBe('dark-hc');
  });

  it('follows the device light/dark setting', () => {
    expect(resolveTheme('system', false, false)).toBe('light');
    expect(resolveTheme('system', true, false)).toBe('dark');
  });

  it('picks high contrast when the device asks for more contrast', () => {
    expect(resolveTheme('system', false, true)).toBe('light-hc');
    expect(resolveTheme('system', true, true)).toBe('dark-hc');
  });
});

describe('isTheme', () => {
  it('accepts only the four themes', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('system')).toBe(false);
    expect(isTheme('blue')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});
