import { getCollection } from 'astro:content';
import { displayTitle, truncate } from '../terms/display';
import type { GlossaryItem } from './filter';

/** Every term as a compact list item, sorted A–Z. Runs at build time. */
export async function glossaryItems(): Promise<GlossaryItem[]> {
  const terms = await getCollection('terms');
  return terms
    .map(({ id, data: t }) => ({
      id,
      title: displayTitle(t),
      ...(t.abbreviation ? { abbreviation: t.abbreviation } : {}),
      usage: t.usageFrequency,
      difficulty: t.difficulty,
      lines: t.lines,
      summary: truncate(t.quickAnswer ?? t.definition, 120),
      full: t.contentStatus === 'full',
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'en'));
}
