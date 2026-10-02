import { describe, expect, it } from 'vitest';
import { toSlug } from './slug';

describe('toSlug', () => {
  it('lowercases and joins words with hyphens', () => {
    expect(toSlug('Actual Cash Value (ACV)')).toBe('actual-cash-value-acv');
  });

  it('spells out ampersands', () => {
    expect(toSlug('Errors & Omissions')).toBe('errors-and-omissions');
  });

  it('removes accents and trims stray hyphens', () => {
    expect(toSlug('  Café policy!  ')).toBe('cafe-policy');
  });
});
