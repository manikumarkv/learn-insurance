/**
 * Checks every content file against docs/content/term-schema.md.
 * Usage: pnpm validate:content   (exits 1 when anything is wrong)
 */
import { readFolder, validateContent, type ContentError } from '../src/content/schema/validate';

const errors: ContentError[] = [];
const [terms, types, paths] = await Promise.all([
  readFolder('src/content/terms', errors),
  readFolder('src/content/types', errors),
  readFolder('src/content/paths', errors),
]);
errors.push(...validateContent({ terms, types, paths }));

const checked = `${terms.length} terms, ${types.length} insurance types, ${paths.length} learning paths`;
if (errors.length === 0) {
  console.log(`Content OK: ${checked}.`);
} else {
  for (const e of errors) console.error(`${e.file} › ${e.field}: ${e.message}`);
  const files = new Set(errors.map((e) => e.file)).size;
  console.error(`\n${errors.length} problems in ${files} files (checked ${checked}).`);
  process.exitCode = 1;
}
