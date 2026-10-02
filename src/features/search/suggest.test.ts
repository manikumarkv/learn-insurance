import { describe, expect, it } from 'vitest';
import { distance, suggest } from './suggest';

const items = [
  { id: 'deductible', title: 'Deductible' },
  { id: 'subrogation', title: 'Subrogation' },
  { id: 'endorsement', title: 'Endorsement' },
  {
    id: 'health-maintenance-organization',
    title: 'HMO (Health Maintenance Organization)',
    abbreviation: 'HMO',
  },
];

describe('distance', () => {
  it('counts single-letter changes', () => {
    expect(distance('deductable', 'Deductible')).toBe(1);
    expect(distance('cat', 'cat')).toBe(0);
  });
});

describe('suggest', () => {
  it('suggests close spellings', () => {
    expect(suggest('deductable', items).map((i) => i.id)).toEqual(['deductible']);
    expect(suggest('subrigation', items).map((i) => i.id)).toEqual(['subrogation']);
    expect(suggest('endorsment', items).map((i) => i.id)).toEqual(['endorsement']);
  });

  it('matches abbreviations and the name inside "HMO (…)" titles', () => {
    expect(suggest('hmp', items).map((i) => i.id)).toEqual(['health-maintenance-organization']);
  });

  it('suggests nothing for unrelated or very short queries', () => {
    expect(suggest('zebra crossing', items)).toEqual([]);
    expect(suggest('de', items)).toEqual([]);
  });
});
