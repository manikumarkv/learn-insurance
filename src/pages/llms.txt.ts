import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { displayTitle, truncate } from '../features/terms/display';

/**
 * llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants.
 * Lists every term with a one-line answer, and the top-level insurance types.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).toString();
  const terms = (await getCollection('terms')).sort((a, b) =>
    a.data.term.localeCompare(b.data.term, 'en'),
  );
  const types = (await getCollection('types'))
    .filter((t) => !t.data.parent)
    .sort((a, b) => a.data.name.localeCompare(b.data.name, 'en'));
  const line = (s: string) => s.replace(/\s+/g, ' ').trim();

  const body = [
    '# LearnInsurance',
    '',
    `> Plain-English explanations of ${terms.length.toLocaleString('en-US')} US insurance terms and ${
      (await getCollection('types')).length
    } insurance types, for people reading their policy and anyone new to working in insurance. Educational only: not insurance, legal or financial advice.`,
    '',
    'Each term page has a quick answer, a definition, an example and US notes. Fully written terms also have a diagram, a short story, FAQs and practice questions.',
    '',
    '## Main pages',
    '',
    `- [Insurance terms A–Z](${url('/terms')}): every term, filterable by usage, difficulty and insurance type`,
    `- [Insurance types](${url('/types')}): how US insurance types fit together`,
    '',
    '## Insurance types',
    '',
    ...types.map(
      (t) =>
        `- [${t.data.name}](${url(`/types/${t.id}`)}): ${line(truncate(t.data.description, 160))}`,
    ),
    '',
    '## Terms',
    '',
    ...terms.map(
      (t) =>
        `- [${displayTitle(t.data)}](${url(`/terms/${t.id}`)}): ${line(truncate(t.data.quickAnswer ?? t.data.definition, 160))}`,
    ),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
