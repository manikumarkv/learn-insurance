/*
 * DELETE /api/account (story 6.4): deletes the signed-in person's data and their Clerk account.
 * Served by src/pages/api/account.ts.
 */
import { clerkClient } from '@clerk/astro/server';
import { eq } from 'drizzle-orm';
import { ok, route } from '../../lib/api/route';
import { schema } from '../../lib/db/client';

const { questionAttempts, savedTerms, termProgress, termRequests } = schema;

export const DELETE = route({
  access: 'user',
  handler: async ({ userId, db, context }) => {
    // Their own learning data goes.
    await db.delete(questionAttempts).where(eq(questionAttempts.userId, userId));
    await db.delete(termProgress).where(eq(termProgress.userId, userId));
    await db.delete(savedTerms).where(eq(savedTerms.userId, userId));
    // Term requests stay (they are open GitHub issues others benefit from) but no longer point to the person.
    await db
      .update(termRequests)
      .set({ userId: null, updatedAt: new Date() })
      .where(eq(termRequests.userId, userId));

    // Last, so a failure here leaves the account in place and the person can try again.
    await clerkClient(context).users.deleteUser(userId);
    return ok({ deleted: true });
  },
});
