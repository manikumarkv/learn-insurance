/**
 * Builds the Pagefind search index after `astro build` (story 4.1).
 * Indexes dist/ and writes the index to both places the site is served from:
 * dist/ (pnpm preview, browser tests) and .vercel/output/static/ (Vercel).
 */
import { existsSync } from 'node:fs';
import { close, createIndex } from 'pagefind';

const OUTPUTS = ['dist/pagefind', '.vercel/output/static/pagefind'];

const { index, errors } = await createIndex();
if (!index) throw new Error(`Pagefind failed to start: ${errors.join(', ')}`);

const added = await index.addDirectory({ path: 'dist' });
if (added.errors.length) throw new Error(added.errors.join(', '));
console.log(`Search index: ${added.page_count} pages.`);

for (const outputPath of OUTPUTS) {
  if (!existsSync(outputPath.replace(/\/pagefind$/, ''))) continue;
  const written = await index.writeFiles({ outputPath });
  if (written.errors.length) throw new Error(written.errors.join(', '));
  console.log(`Wrote ${outputPath}`);
}
await close();
