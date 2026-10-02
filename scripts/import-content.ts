/**
 * Creates content files from the seed spreadsheets.
 *
 *   pnpm import:content                 terms + missing insurance types
 *   pnpm import:content --update-types  also overwrite existing insurance type files
 *
 * Safe to re-run: a term with contentStatus: full is never overwritten, and existing
 * insurance types are kept unless --update-types is passed.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';
import { parse as parseYaml, stringify } from 'yaml';
import { rowToTerm, rowToType, type CsvRow } from '../src/content/import/map';

const TERMS_DIR = 'src/content/terms';
const TYPES_DIR = 'src/content/types';
const updateTypes = process.argv.includes('--update-types');

async function readCsv(file: string): Promise<CsvRow[]> {
  return parseCsv(await readFile(file, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
  }) as CsvRow[];
}

async function isFull(file: string): Promise<boolean> {
  if (!existsSync(file)) return false;
  const data = parseYaml(await readFile(file, 'utf8')) as { contentStatus?: string } | null;
  return data?.contentStatus === 'full';
}

const toYaml = (data: unknown) => stringify(data, { lineWidth: 0 });

await mkdir(TERMS_DIR, { recursive: true });
await mkdir(TYPES_DIR, { recursive: true });

const terms = { written: 0, keptFull: 0 };
for (const row of await readCsv('data/insurance-glossary.csv')) {
  const { id, data } = rowToTerm(row);
  const file = join(TERMS_DIR, `${id}.yaml`);
  if (await isFull(file)) {
    terms.keptFull++;
    continue;
  }
  await writeFile(file, toYaml(data));
  terms.written++;
}

const types = { written: 0, kept: 0 };
for (const row of await readCsv('data/insurance-taxonomy.csv')) {
  const { id, data } = rowToType(row);
  const file = join(TYPES_DIR, `${id}.yaml`);
  if (existsSync(file) && !updateTypes) {
    types.kept++;
    continue;
  }
  await writeFile(file, toYaml(data));
  types.written++;
}

console.log(`Terms: ${terms.written} written, ${terms.keptFull} full terms kept.`);
console.log(`Insurance types: ${types.written} written, ${types.kept} existing kept.`);
console.log('Next: pnpm validate:content');
