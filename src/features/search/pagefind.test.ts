import { describe, expect, it } from 'vitest';
import { rankHits, toHit, type SearchHit } from './pagefind';

const hit = (title: string): SearchHit => ({
  url: `/terms/${title}`,
  title,
  kind: 'Term',
  excerpt: '',
});

describe('rankHits', () => {
  it('puts an exact name match first and keeps the rest in order', () => {
    const titles = rankHits(
      [hit('Hurricane Deductible'), hit('Percentage Deductible'), hit('Deductible')],
      'Deductible',
    ).map((h) => h.title);
    expect(titles).toEqual(['Deductible', 'Hurricane Deductible', 'Percentage Deductible']);
  });

  it('matches an abbreviation in either position of the title', () => {
    expect(
      rankHits(
        [hit('Point of Service Plan (POS)'), hit('HMO (Health Maintenance Organization)')],
        'hmo',
      )[0]?.title,
    ).toBe('HMO (Health Maintenance Organization)');
    expect(
      rankHits([hit('Actual Cash Value Basis'), hit('Actual Cash Value (ACV)')], 'acv')[0]?.title,
    ).toBe('Actual Cash Value (ACV)');
  });
});

describe('toHit', () => {
  it('reads the title, kind and usage from Pagefind metadata', () => {
    expect(
      toHit({
        url: '/types/life/',
        excerpt: 'x',
        meta: { title: 'Life Insurance', kind: 'Insurance type' },
      }),
    ).toEqual({
      url: '/types/life',
      title: 'Life Insurance',
      kind: 'Insurance type',
      excerpt: 'x',
    });
  });
});
