import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import * as schema from '../../lib/db/schema';
import { call, fakeContext } from '../../lib/api/test-helpers';

const db = drizzle({ client: new PGlite(), schema });
vi.mock('../../lib/db/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/db/client')>()),
  getDb: () => db,
}));

const { GET, POST, DELETE } = await import('./api');

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
});

describe('/api/saved-terms', () => {
  it('saves, lists and removes terms for the signed-in person only', async () => {
    const ram = { userId: 'user_ram' };
    expect(
      (await call(POST, fakeContext('POST', { ...ram, body: { termId: 'deductible' } }))).status,
    ).toBe(201);
    await call(POST, fakeContext('POST', { ...ram, body: { termId: 'premium' } }));
    // Saving twice is fine.
    expect(
      (await call(POST, fakeContext('POST', { ...ram, body: { termId: 'premium' } }))).status,
    ).toBe(201);
    await call(POST, fakeContext('POST', { userId: 'user_other', body: { termId: 'claim' } }));

    const list = await call(GET, fakeContext('GET', ram));
    expect((list.json.data as { termIds: string[] }).termIds.sort()).toEqual([
      'deductible',
      'premium',
    ]);

    await call(DELETE, fakeContext('DELETE', { ...ram, body: { termId: 'premium' } }));
    const after = await call(GET, fakeContext('GET', ram));
    expect(after.json).toEqual({ data: { termIds: ['deductible'] } });
  });

  it('rejects a malformed term ID', async () => {
    const res = await call(
      POST,
      fakeContext('POST', { userId: 'user_ram', body: { termId: '../etc' } }),
    );
    expect(res.status).toBe(400);
  });

  it('requires sign-in', async () => {
    expect((await call(GET, fakeContext('GET'))).status).toBe(401);
  });
});
