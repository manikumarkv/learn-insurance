import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';
import { parse as parseYaml } from 'yaml';
import { toSlug } from '../lib/slug';

export interface RedirectTerm {
  id: string;
  abbreviation?: string;
}

export interface IdChange {
  oldId: string;
  newId: string;
}

/**
 * Permanent redirects for term and type URLs:
 * - old term IDs → new term IDs (abbreviation clean-up), old type IDs → new type IDs
 * - /terms/<abbreviation> → /terms/<id>, e.g. /terms/acv → /terms/actual-cash-value
 *
 * A redirect is skipped when its source is a real page, so a term ID always wins.
 * TODO(edge-cases): abbreviations shared by two or more terms (e.g. ART, BI, COI) get no
 * short URL for now; they need a "did you mean" page. They are returned in `sharedAbbreviations`.
 */
export function buildRedirects(input: {
  terms: RedirectTerm[];
  typeIds: string[];
  termIdChanges: IdChange[];
  typeIdChanges: IdChange[];
}): { redirects: Record<string, string>; sharedAbbreviations: string[] } {
  const termIds = new Set(input.terms.map((t) => t.id));
  const typeIds = new Set(input.typeIds);
  const redirects: Record<string, string> = {};

  for (const { oldId, newId } of input.termIdChanges) {
    if (!termIds.has(oldId) && termIds.has(newId)) redirects[`/terms/${oldId}`] = `/terms/${newId}`;
  }
  for (const { oldId, newId } of input.typeIdChanges) {
    if (!typeIds.has(oldId) && typeIds.has(newId)) redirects[`/types/${oldId}`] = `/types/${newId}`;
  }

  const byAbbreviation = new Map<string, string[]>();
  for (const t of input.terms) {
    if (!t.abbreviation) continue;
    const slug = toSlug(t.abbreviation);
    if (!slug) continue;
    byAbbreviation.set(slug, [...(byAbbreviation.get(slug) ?? []), t.id]);
  }
  const sharedAbbreviations: string[] = [];
  for (const [slug, ids] of byAbbreviation) {
    if (ids.length > 1) {
      sharedAbbreviations.push(slug);
      continue;
    }
    const from = `/terms/${slug}`;
    if (!termIds.has(slug) && !redirects[from]) redirects[from] = `/terms/${ids[0]}`;
  }
  return { redirects, sharedAbbreviations: sharedAbbreviations.sort() };
}

function readIdChanges(file: string): IdChange[] {
  const rows = parseCsv(readFileSync(file, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];
  return rows.map((r) => ({
    oldId: (r['Old ID'] ?? '').trim(),
    newId: (r['New ID'] ?? '').trim(),
  }));
}

function yamlIds(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((n) => n.endsWith('.yaml'))
      .map((n) => basename(n, '.yaml'));
  } catch {
    return [];
  }
}

/** Reads content and the ID-change CSVs from disk. Used by astro.config.mjs at build time. */
export function loadRedirects(root = '.'): Record<string, string> {
  const termsDir = join(root, 'src/content/terms');
  const terms = yamlIds(termsDir).map((id) => {
    const data = parseYaml(readFileSync(join(termsDir, `${id}.yaml`), 'utf8')) as {
      abbreviation?: string;
    } | null;
    return { id, abbreviation: data?.abbreviation };
  });
  return buildRedirects({
    terms,
    typeIds: yamlIds(join(root, 'src/content/types')),
    termIdChanges: readIdChanges(join(root, 'docs/verification/abbreviation-id-changes.csv')),
    typeIdChanges: readIdChanges(join(root, 'docs/verification/id-changes.csv')),
  }).redirects;
}
