import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse } from 'yaml';

/**
 * Last-updated dates for term pages, by URL path (e.g. "/terms/endorsement" → "2026-10-02").
 * Used by the sitemap in astro.config.mjs. Terms without a date are left out.
 */
export function termLastModified(root = '.'): Map<string, string> {
  const dir = join(root, 'src/content/terms');
  const out = new Map<string, string>();
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.yaml'))) {
    const data = parse(readFileSync(join(dir, name), 'utf8')) as {
      meta?: { updatedAt?: string | Date };
    } | null;
    const date = data?.meta?.updatedAt;
    if (!date) continue;
    out.set(
      `/terms/${basename(name, '.yaml')}`,
      typeof date === 'string' ? date : date.toISOString().slice(0, 10),
    );
  }
  return out;
}
