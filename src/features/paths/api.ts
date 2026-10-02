/*
 * GET /api/progress: the signed-in person's learned term IDs (answered correctly at least once).
 * Served by src/pages/api/progress.ts.
 */
import { and, eq, isNotNull } from 'drizzle-orm';
import { ok, route } from '../../lib/api/route';
import { schema } from '../../lib/db/client';

const { termProgress } = schema;

export const GET = route({
  access: 'user',
  handler: async ({ userId, db }) => {
    const rows = await db
      .select({ termId: termProgress.termId })
      .from(termProgress)
      .where(and(eq(termProgress.userId, userId), isNotNull(termProgress.learnedAt)));
    return ok({ termIds: rows.map((r) => r.termId) });
  },
});
