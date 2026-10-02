/*
 * Saved terms for the signed-in person (example of the API pattern in src/lib/api/route.ts).
 * Served at /api/saved-terms by src/pages/api/saved-terms.ts.
 *   GET    /api/saved-terms                    → { data: { termIds: string[] } }
 *   POST   /api/saved-terms   { "termId": "deductible" } → 201 { data: { termId } }
 *   DELETE /api/saved-terms   { "termId": "deductible" } → { data: { termId } }
 */
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { ok, route } from '../../lib/api/route';
import { schema } from '../../lib/db/client';

const { savedTerms } = schema;

// TODO(edge-cases): check the term exists, so unknown IDs can't be saved.
export const termIdInput = z.object({
  termId: z.string().regex(/^[a-z0-9-]{1,100}$/, 'Use a term ID like "deductible".'),
});

export const GET = route({
  access: 'user',
  handler: async ({ userId, db }) => {
    const rows = await db
      .select({ termId: savedTerms.termId })
      .from(savedTerms)
      .where(eq(savedTerms.userId, userId))
      .orderBy(desc(savedTerms.createdAt));
    return ok({ termIds: rows.map((r) => r.termId) });
  },
});

export const POST = route({
  access: 'user',
  input: termIdInput,
  handler: async ({ input, userId, db }) => {
    await db.insert(savedTerms).values({ userId, termId: input.termId }).onConflictDoNothing();
    return ok({ termId: input.termId }, 201);
  },
});

export const DELETE = route({
  access: 'user',
  input: termIdInput,
  handler: async ({ input, userId, db }) => {
    await db
      .delete(savedTerms)
      .where(and(eq(savedTerms.userId, userId), eq(savedTerms.termId, input.termId)));
    return ok({ termId: input.termId });
  },
});
