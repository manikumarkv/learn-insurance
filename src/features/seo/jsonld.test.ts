import { describe, expect, it } from 'vitest';
import { breadcrumbList, definedTerm, faqPage, toScript } from './jsonld';

const site = new URL('https://learninsurance.example');

describe('JSON-LD', () => {
  it('builds a DefinedTerm with absolute URLs and alternate names', () => {
    expect(
      definedTerm(site, {
        id: 'actual-cash-value',
        name: 'Actual Cash Value (ACV)',
        description: 'What it is worth today.',
        alternateNames: ['ACV'],
      }),
    ).toMatchObject({
      '@type': 'DefinedTerm',
      url: 'https://learninsurance.example/terms/actual-cash-value',
      alternateName: ['ACV'],
      inDefinedTermSet: { '@type': 'DefinedTermSet', url: 'https://learninsurance.example/terms' },
    });
  });

  it('builds a FAQPage, or nothing when there are no FAQs', () => {
    expect(faqPage([{ question: 'Q?', answer: 'A.' }])).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } },
      ],
    });
    expect(faqPage([])).toBeNull();
  });

  it('numbers breadcrumb items from 1', () => {
    const list = breadcrumbList(site, [
      { name: 'Terms', path: '/terms' },
      { name: 'Deductible', path: '/terms/deductible' },
    ]);
    expect(list.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Terms',
        item: 'https://learninsurance.example/terms',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Deductible',
        item: 'https://learninsurance.example/terms/deductible',
      },
    ]);
  });

  it('escapes < so text cannot close the script tag', () => {
    expect(toScript({ text: '</script><b>' })).not.toContain('</script>');
  });
});
