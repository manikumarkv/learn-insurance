/*
 * Applies the SQL migrations in drizzle/ to the database in DATABASE_URL.
 * Runs in `pnpm build` on Vercel production deploys, so the schema is updated before the new
 * code goes live. Run it by hand with `pnpm db:migrate` (DATABASE_URL in .env).
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const manual = process.argv.includes('--manual');
const isProduction = process.env.VERCEL_ENV === 'production';

// TODO(edge-cases): preview deploys skip migrations. If previews get their own Neon branch,
// run them there too, so a PR that changes the schema can be tested on its preview.
if (!manual && !isProduction) {
  console.log('Migrations: skipped (only on production deploys or with pnpm db:migrate).');
  process.exit(0);
}

try {
  process.loadEnvFile();
} catch {
  // No .env file; Vercel sets DATABASE_URL directly.
}
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Migrations: DATABASE_URL is not set.');
  process.exit(1);
}

await migrate(drizzle({ client: neon(url) }), { migrationsFolder: 'drizzle' });
console.log('Migrations: database is up to date.');
