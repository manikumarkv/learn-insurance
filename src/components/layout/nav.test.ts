import { describe, expect, it } from 'vitest';
import { isActive } from './nav';

describe('isActive', () => {
  it('matches the page and its sub-pages', () => {
    expect(isActive('/terms', '/terms')).toBe(true);
    expect(isActive('/terms/', '/terms')).toBe(true);
    expect(isActive('/terms/deductible', '/terms')).toBe(true);
  });

  it('does not match pages that only share a prefix', () => {
    expect(isActive('/terms-of-use', '/terms')).toBe(false);
    expect(isActive('/', '/terms')).toBe(false);
  });
});
