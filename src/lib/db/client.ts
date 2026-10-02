import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Database client for server code (endpoints and pages with `prerender = false`).
 * Uses Neon's HTTP driver: one request per query, no connection pool to manage.
 */
export function getDb(url = process.env.DATABASE_URL) {
  if (!url) throw new Error('DATABASE_URL is not set. See .env.example.');
  return drizzle({ client: neon(url), schema });
}

export type Db = ReturnType<typeof getDb>;
export { schema };
