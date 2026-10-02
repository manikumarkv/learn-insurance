import { describe, expect, it } from 'vitest';
import { displayTitle, formatDate, shortName, truncate } from './display';

describe('displayTitle', () => {
  it('puts the abbreviation first when it is the common name', () => {
    expect(
      displayTitle({
        term: 'Health Maintenance Organization',
        abbreviation: 'HMO',
        abbreviationIsCommonName: true,
      }),
    ).toBe('HMO (Health Maintenance Organization)');
  });

  it('puts the full name first otherwise', () => {
    expect(
      displayTitle({
        term: 'Actual Cash Value',
        abbreviation: 'ACV',
        abbreviationIsCommonName: false,
      }),
    ).toBe('Actual Cash Value (ACV)');
  });

  it('shows just the term when there is no abbreviation', () => {
    expect(displayTitle({ term: 'Endorsement' })).toBe('Endorsement');
  });
});

describe('shortName', () => {
  it('uses the abbreviation only when it is the common name', () => {
    expect(
      shortName({
        term: 'Health Maintenance Organization',
        abbreviation: 'HMO',
        abbreviationIsCommonName: true,
      }),
    ).toBe('HMO');
    expect(
      shortName({
        term: 'Actual Cash Value',
        abbreviation: 'ACV',
        abbreviationIsCommonName: false,
      }),
    ).toBe('Actual Cash Value');
  });
});

describe('truncate', () => {
  it('cuts at a word and adds an ellipsis', () => {
    expect(truncate('The amount you pay before insurance pays.', 20)).toBe('The amount you pay…');
  });

  it('leaves short text alone', () => {
    expect(truncate('Short.', 20)).toBe('Short.');
  });
});

describe('formatDate', () => {
  it('formats ISO dates in US style', () => {
    expect(formatDate('2026-09-30')).toBe('Sep 30, 2026');
  });
});
