import { PGlite } from '@electric-sql/pglite';
import { and, eq } from 'drizzle-orm';
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

const { POST } = await import('./api');

const answer = (isCorrect: boolean) =>
  fakeContext('POST', {
    userId: 'user_ram',
    body: { termId: 'premium', questionIndex: 2, chosenIndex: 1, isCorrect },
  });

const progress = async () =>
  (
    await db
      .select()
      .from(schema.termProgress)
      .where(
        and(eq(schema.termProgress.userId, 'user_ram'), eq(schema.termProgress.termId, 'premium')),
      )
  )[0];

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
});

describe('POST /api/answers', () => {
  it('records attempts and marks the term learned on the first right answer', async () => {
    expect((await call(POST, answer(false))).status).toBe(201);
    expect(await progress()).toMatchObject({ attemptCount: 1, correctCount: 0, learnedAt: null });

    await call(POST, answer(true));
    const learned = await progress();
    expect(learned).toMatchObject({ attemptCount: 2, correctCount: 1 });
    expect(learned?.learnedAt).toBeInstanceOf(Date);

    // A later wrong answer doesn't un-learn it, and the first learned time stays.
    await call(POST, answer(false));
    const after = await progress();
    expect(after).toMatchObject({ attemptCount: 3, correctCount: 1 });
    expect(after?.learnedAt?.getTime()).toBe(learned?.learnedAt?.getTime());

    expect(await db.select().from(schema.questionAttempts)).toHaveLength(3);
  });

  it('rejects bad input and requires sign-in', async () => {
    const bad = fakeContext('POST', { userId: 'user_ram', body: { termId: 'premium' } });
    expect((await call(POST, bad)).status).toBe(400);
    const guest = fakeContext('POST', {
      body: { termId: 'premium', questionIndex: 0, chosenIndex: 0, isCorrect: true },
    });
    expect((await call(POST, guest)).status).toBe(401);
  });
});
