import { describe, expect, it } from 'vitest';
import { isProtectedPath } from './middleware';

describe('isProtectedPath', () => {
  it('protects the account pages', () => {
    expect(isProtectedPath('/account')).toBe(true);
    expect(isProtectedPath('/account/security')).toBe(true);
  });

  it('leaves everything else public', () => {
    expect(isProtectedPath('/')).toBe(false);
    expect(isProtectedPath('/terms/deductible')).toBe(false);
    expect(isProtectedPath('/accounting')).toBe(false);
  });
});
