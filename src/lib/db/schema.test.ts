import { PGlite } from '@electric-sql/pglite';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeAll, describe, expect, it } from 'vitest';
import * as schema from './schema';

// Applies the real migrations in drizzle/ to an in-memory Postgres and checks the tables work.
const db = drizzle({ client: new PGlite(), schema });

beforeAll(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
});

describe('database schema', () => {
  it('records an answer and the term progress', async () => {
    await db.insert(schema.questionAttempts).values({
      userId: 'user_1',
      termId: 'deductible',
      questionIndex: 2,
      chosenIndex: 1,
      isCorrect: true,
    });
    await db
      .insert(schema.termProgress)
      .values({ userId: 'user_1', termId: 'deductible', attemptCount: 1, correctCount: 1 });

    const [progress] = await db
      .select()
      .from(schema.termProgress)
      .where(
        and(eq(schema.termProgress.userId, 'user_1'), eq(schema.termProgress.termId, 'deductible')),
      );
    expect(progress?.correctCount).toBe(1);
  });

  it('saves a term once per person', async () => {
    await db.insert(schema.savedTerms).values({ userId: 'user_1', termId: 'premium' });
    await expect(
      db.insert(schema.savedTerms).values({ userId: 'user_1', termId: 'premium' }),
    ).rejects.toThrow();
  });

  it('starts a term request as "requested", with or without a user', async () => {
    const [request] = await db
      .insert(schema.termRequests)
      .values({ kind: 'term-request', term: 'named peril' })
      .returning();
    expect(request?.status).toBe('requested');
    expect(request?.userId).toBeNull();
  });

  it('stores no personal data beyond the Clerk user ID', () => {
    const columns = [
      schema.questionAttempts,
      schema.termProgress,
      schema.savedTerms,
      schema.termRequests,
    ].flatMap((table) => Object.values(getTableColumns(table)).map((c) => c.name));
    expect(columns).toContain('user_id');
    expect(columns.filter((name) => /email|name|phone|address|ip_/.test(name))).toEqual([]);
  });
});
