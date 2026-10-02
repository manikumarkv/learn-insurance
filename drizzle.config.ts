import { defineConfig } from 'drizzle-kit';

// `pnpm db:generate` writes SQL migrations to drizzle/ from src/lib/db/schema.ts (no database needed).
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
});
