import { PGlite } from '@electric-sql/pglite';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { call, fakeContext } from '../../lib/api/test-helpers';
import * as schema from '../../lib/db/schema';

const db = drizzle({ client: new PGlite(), schema });
const deleteUser = vi.fn<(userId: string) => Promise<void>>(async () => {});

vi.mock('../../lib/db/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/db/client')>()),
  getDb: () => db,
}));
vi.mock('@clerk/astro/server', () => ({ clerkClient: () => ({ users: { deleteUser } }) }));

const { DELETE } = await import('./api');

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
});

describe('DELETE /api/account', () => {
  it("removes the person's data and Clerk account, and keeps others' data", async () => {
    for (const userId of ['user_ram', 'user_other']) {
      await db.insert(schema.questionAttempts).values({
        userId,
        termId: 'deductible',
        questionIndex: 0,
        chosenIndex: 1,
        isCorrect: true,
      });
      await db.insert(schema.termProgress).values({ userId, termId: 'deductible' });
      await db.insert(schema.savedTerms).values({ userId, termId: 'premium' });
      await db.insert(schema.termRequests).values({ userId, kind: 'term-request', term: 'peril' });
    }

    const res = await call(DELETE, fakeContext('DELETE', { userId: 'user_ram' }));
    expect(res).toEqual({ status: 200, json: { data: { deleted: true } } });
    expect(deleteUser).toHaveBeenCalledWith('user_ram');

    for (const table of [schema.questionAttempts, schema.termProgress, schema.savedTerms]) {
      expect(await db.select().from(table).where(eq(table.userId, 'user_ram'))).toEqual([]);
      expect(await db.select().from(table).where(eq(table.userId, 'user_other'))).toHaveLength(1);
    }
    const requests = await db.select().from(schema.termRequests);
    expect(requests.map((r) => r.userId).sort()).toEqual(['user_other', null].sort());
  });

  it('requires sign-in', async () => {
    expect((await call(DELETE, fakeContext('DELETE'))).status).toBe(401);
  });
});
