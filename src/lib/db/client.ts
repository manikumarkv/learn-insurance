import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import * as schema from './schema';

/** Any Drizzle Postgres database with our schema: Neon in production, PGlite in tests. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/**
 * Database client for server code (endpoints and pages with `prerender = false`).
 * Uses Neon's HTTP driver: one request per query, no connection pool to manage.
 */
export function getDb(url = process.env.DATABASE_URL): Db {
  if (!url) throw new Error('DATABASE_URL is not set. See .env.example.');
  return drizzle({ client: neon(url), schema });
}

export { schema };
