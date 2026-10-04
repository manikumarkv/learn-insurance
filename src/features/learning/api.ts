/*
 * POST /api/answers (story 7.3): records one quiz answer for the signed-in person and updates
 * their term progress. A term is learned the first time it's answered correctly (story 7.5).
 * Served by src/pages/api/answers.ts. Guests' answers stay on their device (answers.ts).
 */
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { ok, route } from '../../lib/api/route';
import { schema } from '../../lib/db/client';

const { questionAttempts, termProgress } = schema;

export const answerInput = z.object({
  termId: z.string().regex(/^[a-z0-9-]{1,100}$/),
  questionIndex: z.number().int().min(0).max(50),
  chosenIndex: z.number().int().min(0).max(10),
  isCorrect: z.boolean(),
});

export const POST = route({
  access: 'user',
  input: answerInput,
  // TODO(edge-cases): check the answer on the server against the term's questions instead of
  // trusting isCorrect from the browser, and check the term exists.
  handler: async ({ input, userId, db }) => {
    const now = new Date();
    await db.insert(questionAttempts).values({ userId, ...input, answeredAt: now });
    await db
      .insert(termProgress)
      .values({
        userId,
        termId: input.termId,
        attemptCount: 1,
        correctCount: input.isCorrect ? 1 : 0,
        learnedAt: input.isCorrect ? now : null,
        lastAnsweredAt: now,
      })
      .onConflictDoUpdate({
        target: [termProgress.userId, termProgress.termId],
        set: {
          attemptCount: sql`${termProgress.attemptCount} + 1`,
          correctCount: sql`${termProgress.correctCount} + ${input.isCorrect ? 1 : 0}`,
          learnedAt: input.isCorrect
            ? sql`coalesce(${termProgress.learnedAt}, ${now.toISOString()}::timestamptz)`
            : sql`${termProgress.learnedAt}`,
          lastAnsweredAt: now,
        },
      });
    return ok({ recorded: true }, 201);
  },
});
