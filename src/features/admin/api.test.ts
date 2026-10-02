import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { call, fakeContext } from '../../lib/api/test-helpers';
import * as schema from '../../lib/db/schema';

const db = drizzle({ client: new PGlite(), schema });
vi.mock('../../lib/db/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/db/client')>()),
  getDb: () => db,
}));
// Only user_admin is an admin.
vi.mock('../../lib/api/admin', () => ({
  isAdmin: async (_context: unknown, userId: string | null) => userId === 'user_admin',
}));

const { GET } = await import('./api');

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await db.insert(schema.termRequests).values({ kind: 'term-request', term: 'named peril' });
});

describe('GET /api/admin/term-requests', () => {
  it('lists requests for admins', async () => {
    const res = await call(GET, fakeContext('GET', { userId: 'user_admin' }));
    expect(res.status).toBe(200);
    expect((res.json.data as { requests: { term: string }[] }).requests[0]?.term).toBe(
      'named peril',
    );
  });

  it('returns 403 for signed-in people who are not admins', async () => {
    const res = await call(GET, fakeContext('GET', { userId: 'user_ram' }));
    expect(res).toEqual({
      status: 403,
      json: { error: { code: 'forbidden', message: 'Only admins can do this.' } },
    });
  });

  it('returns 401 when signed out', async () => {
    expect((await call(GET, fakeContext('GET'))).status).toBe(401);
  });
});
