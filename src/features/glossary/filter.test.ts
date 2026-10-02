import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTERS,
  filterAndSort,
  filtersFromQuery,
  filtersToQuery,
  letterOf,
  paginate,
  PAGE_SIZE,
  type GlossaryItem,
} from './filter';

const item = (title: string, extra: Partial<GlossaryItem> = {}): GlossaryItem => ({
  id: title.toLowerCase().replace(/\W+/g, '-'),
  title,
  usage: 'Medium',
  difficulty: 'Beginner',
  lines: ['auto'],
  summary: '',
  full: false,
  ...extra,
});

const items = [
  item('Premium', { usage: 'High', lines: ['all'] }),
  item('Deductible', { usage: 'High' }),
  item('Actual Cash Value (ACV)', { abbreviation: 'ACV', usage: 'Low', lines: ['property'] }),
  item('1035 Exchange', { lines: ['life'], difficulty: 'Advanced' }),
];

describe('letterOf', () => {
  it('puts titles starting with a digit under #', () => {
    expect(letterOf('1035 Exchange')).toBe('#');
    expect(letterOf('premium')).toBe('P');
  });
});

describe('filterAndSort', () => {
  const titles = (f: Partial<typeof DEFAULT_FILTERS>) =>
    filterAndSort(items, { ...DEFAULT_FILTERS, ...f }).map((i) => i.title);

  it('sorts A–Z by default', () => {
    expect(titles({})).toEqual([
      '1035 Exchange',
      'Actual Cash Value (ACV)',
      'Deductible',
      'Premium',
    ]);
  });

  it('sorts most used first, then A–Z', () => {
    expect(titles({ sort: 'most-used' })).toEqual([
      'Deductible',
      'Premium',
      '1035 Exchange',
      'Actual Cash Value (ACV)',
    ]);
  });

  it('filters by letter, usage, difficulty and abbreviations', () => {
    expect(titles({ letter: 'D' })).toEqual(['Deductible']);
    expect(titles({ usage: 'Low' })).toEqual(['Actual Cash Value (ACV)']);
    expect(titles({ difficulty: 'Advanced' })).toEqual(['1035 Exchange']);
    expect(titles({ abbreviations: true })).toEqual(['Actual Cash Value (ACV)']);
  });

  it('treats terms for "all" lines as matching every insurance type', () => {
    expect(titles({ type: 'auto' })).toEqual(['Deductible', 'Premium']);
  });
});

describe('paginate', () => {
  it('splits into pages and clamps the page number', () => {
    const many = Array.from({ length: PAGE_SIZE + 5 }, (_, i) => i);
    expect(paginate(many, 2)).toMatchObject({ page: 2, pages: 2 });
    expect(paginate(many, 2).items).toHaveLength(5);
    expect(paginate(many, 99).page).toBe(2);
  });
});

describe('query string', () => {
  it('round-trips filters', () => {
    const f = {
      ...DEFAULT_FILTERS,
      letter: 'P' as const,
      usage: 'High' as const,
      abbreviations: true,
      sort: 'most-used' as const,
      page: 2,
    };
    expect(filtersFromQuery(filtersToQuery(f))).toEqual(f);
  });

  it('leaves out defaults and ignores invalid values', () => {
    expect(filtersToQuery(DEFAULT_FILTERS)).toBe('');
    expect(filtersFromQuery('?usage=Huge&letter=AA&page=-3')).toEqual({
      ...DEFAULT_FILTERS,
      abbreviations: undefined,
      difficulty: undefined,
      letter: undefined,
      type: undefined,
      usage: undefined,
    });
  });
});
