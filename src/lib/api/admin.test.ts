import type { APIContext } from 'astro';
import { describe, expect, it, vi } from 'vitest';

const users: Record<string, { publicMetadata: Record<string, unknown> }> = {
  user_admin: { publicMetadata: { role: 'admin' } },
  user_ram: { publicMetadata: {} },
};
vi.mock('@clerk/astro/server', () => ({
  clerkClient: () => ({ users: { getUser: async (id: string) => users[id] } }),
}));

const { isAdmin } = await import('./admin');
const context = {} as APIContext;

describe('isAdmin', () => {
  it('is true only for users with role "admin" in public metadata', async () => {
    expect(await isAdmin(context, 'user_admin')).toBe(true);
    expect(await isAdmin(context, 'user_ram')).toBe(false);
    expect(await isAdmin(context, null)).toBe(false);
  });
});
