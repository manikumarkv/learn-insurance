/*
 * Database tables (Neon Postgres, story 6.2). The only personal data is the Clerk user ID:
 * no names, emails or anything else about the person. Term IDs are content file names.
 * Change this file, then run `pnpm db:generate` to write a migration in drizzle/.
 */
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

/** One row per answer to a quiz question. */
export const questionAttempts = pgTable(
  'question_attempts',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    termId: text('term_id').notNull(),
    /** Position of the question in the term's pool. */
    questionIndex: smallint('question_index').notNull(),
    /** The option the person picked, counted from 0. */
    chosenIndex: smallint('chosen_index').notNull(),
    isCorrect: boolean('is_correct').notNull(),
    answeredAt: timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('question_attempts_user_term_idx').on(t.userId, t.termId)],
);

/** One row per person and term. A term is learned once it is answered correctly (story 7.5). */
export const termProgress = pgTable(
  'term_progress',
  {
    userId: text('user_id').notNull(),
    termId: text('term_id').notNull(),
    attemptCount: integer('attempt_count').notNull().default(0),
    correctCount: integer('correct_count').notNull().default(0),
    learnedAt: timestamp('learned_at', { withTimezone: true }),
    lastAnsweredAt: timestamp('last_answered_at', { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.termId] })],
);

/** Terms a person saved to come back to. */
export const savedTerms = pgTable(
  'saved_terms',
  {
    userId: text('user_id').notNull(),
    termId: text('term_id').notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.termId] })],
);

export const requestKind = pgEnum('request_kind', ['term-request', 'term-fix']);

/** Pipeline status shown to the requester and on the admin screen. */
export const requestStatus = pgEnum('request_status', [
  'requested',
  'writing',
  'in-review',
  'published',
  'rejected',
  'needs-attention',
]);

/** Term requests and issue reports, each linked to its GitHub issue. */
export const termRequests = pgTable(
  'term_requests',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    /** Null for guests. */
    userId: text('user_id'),
    kind: requestKind('kind').notNull(),
    /** The term as typed, e.g. "named peril". */
    term: text('term').notNull(),
    /** For term-fix: the existing term's ID. */
    termId: text('term_id'),
    /** What the person said is missing or wrong. */
    details: text('details'),
    status: requestStatus('status').notNull().default('requested'),
    githubIssue: integer('github_issue'),
    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('term_requests_user_idx').on(t.userId),
    index('term_requests_status_idx').on(t.status),
  ],
);
