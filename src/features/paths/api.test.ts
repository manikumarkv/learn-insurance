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

const { GET } = await import('./api');

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await db.insert(schema.termProgress).values([
    { userId: 'user_ram', termId: 'premium', learnedAt: new Date() },
    { userId: 'user_ram', termId: 'claim' }, // tried, not learned yet
    { userId: 'user_other', termId: 'deductible', learnedAt: new Date() },
  ]);
});

describe('GET /api/progress', () => {
  it("returns only this person's learned terms", async () => {
    const res = await call(GET, fakeContext('GET', { userId: 'user_ram' }));
    expect(res).toEqual({ status: 200, json: { data: { termIds: ['premium'] } } });
  });

  it('requires sign-in', async () => {
    expect((await call(GET, fakeContext('GET'))).status).toBe(401);
  });
});
