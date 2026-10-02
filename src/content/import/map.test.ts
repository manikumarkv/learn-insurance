import { describe, expect, it } from 'vitest';
import { rowToTerm, rowToType } from './map';

const row = {
  ID: 'actual-cash-value',
  Term: 'Actual Cash Value',
  'Also Known As': 'Depreciated value; Cash value',
  Category: 'Claims',
  'Applies To Lines': 'Property, Motor',
  'Plain-English Definition': 'What the item is worth today.',
  Example: 'A 5-year-old TV is worth less than a new one.',
  "Where You'll See It": 'Policy document, Claim documents',
  'Most Relevant For': 'Individuals',
  Difficulty: 'Beginner',
  'Usage Frequency': 'High',
  'Related Terms': 'replacement-cost, depreciation',
  'US Notes': '',
  Abbreviation: 'ACV',
  'Abbreviation Is Common Name': 'No',
};

describe('rowToTerm', () => {
  it('maps a glossary row to a basic term', () => {
    expect(rowToTerm(row)).toEqual({
      id: 'actual-cash-value',
      data: {
        term: 'Actual Cash Value',
        contentStatus: 'basic',
        abbreviation: 'ACV',
        abbreviationIsCommonName: false,
        alsoKnownAs: ['Depreciated value', 'Cash value'],
        category: 'Claims',
        lines: ['property', 'auto'],
        usageFrequency: 'High',
        difficulty: 'Beginner',
        definition: 'What the item is worth today.',
        example: 'A 5-year-old TV is worth less than a new one.',
        whereYoullSeeIt: ['Policy document', 'Claim documents'],
        relatedTerms: ['replacement-cost', 'depreciation'],
        meta: { source: 'editorial' },
      },
    });
  });

  it('leaves out abbreviation fields when there is no abbreviation', () => {
    const { data } = rowToTerm({ ...row, Abbreviation: '', 'Abbreviation Is Common Name': '' });
    expect(data).not.toHaveProperty('abbreviation');
    expect(data).not.toHaveProperty('abbreviationIsCommonName');
  });

  it('does not import "Most Relevant For"', () => {
    expect(JSON.stringify(rowToTerm(row))).not.toContain('Individuals');
  });

  it('rejects an unknown line name', () => {
    expect(() => rowToTerm({ ...row, 'Applies To Lines': 'Pets' })).toThrow('unknown line "Pets"');
  });
});

describe('rowToType', () => {
  it('maps a taxonomy row and leaves out empty fields', () => {
    expect(
      rowToType({
        ID: 'life.term',
        'Parent ID': 'life',
        Level: '2',
        Name: 'Term Life',
        'Also Known As': '',
        'Plain-English Description': 'Covers a fixed period.',
        Example: '',
        'Personal/Commercial/Both': 'Personal',
        'US Notes': '',
        'Full Path': 'Life Insurance > Term Life',
      }),
    ).toEqual({
      id: 'life.term',
      data: {
        name: 'Term Life',
        parent: 'life',
        description: 'Covers a fixed period.',
        segment: 'Personal',
      },
    });
  });
});
