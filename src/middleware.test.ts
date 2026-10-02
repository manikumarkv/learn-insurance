import { describe, expect, it } from 'vitest';
import { isAdminPath, isProtectedPath } from './middleware';

describe('isProtectedPath', () => {
  it('protects the account and admin pages', () => {
    expect(isProtectedPath('/account')).toBe(true);
    expect(isProtectedPath('/account/security')).toBe(true);
    expect(isProtectedPath('/admin')).toBe(true);
  });

  it('leaves everything else public', () => {
    expect(isProtectedPath('/')).toBe(false);
    expect(isProtectedPath('/terms/deductible')).toBe(false);
    expect(isProtectedPath('/accounting')).toBe(false);
  });
});

describe('isAdminPath', () => {
  it('covers /admin and everything under it', () => {
    expect(isAdminPath('/admin')).toBe(true);
    expect(isAdminPath('/admin/requests')).toBe(true);
    expect(isAdminPath('/account')).toBe(false);
    expect(isAdminPath('/administration-fee')).toBe(false);
  });
});
