import { describe, expect, it } from 'vitest';
import { buildRedirects, loadRedirects } from './redirects';

describe('buildRedirects', () => {
  const base = {
    terms: [
      { id: 'actual-cash-value', abbreviation: 'ACV' },
      { id: 'business-interruption', abbreviation: 'BI' },
      { id: 'bodily-injury', abbreviation: 'BI' },
      { id: 'cobra', abbreviation: 'COBRA' },
      { id: 'american-association-of-insurance-services', abbreviation: 'AAIS' },
    ],
    typeIds: ['health.supplemental.add'],
    termIdChanges: [{ oldId: 'aais', newId: 'american-association-of-insurance-services' }],
    typeIdChanges: [{ oldId: 'health.disability.add', newId: 'health.supplemental.add' }],
  };

  it('redirects old IDs and short abbreviation URLs', () => {
    const { redirects } = buildRedirects(base);
    expect(redirects).toMatchObject({
      '/terms/aais': '/terms/american-association-of-insurance-services',
      '/types/health.disability.add': '/types/health.supplemental.add',
      '/terms/acv': '/terms/actual-cash-value',
    });
  });

  it('never redirects away from a real term page', () => {
    expect(buildRedirects(base).redirects).not.toHaveProperty('/terms/cobra');
  });

  it('skips abbreviations shared by two terms and reports them', () => {
    const { redirects, sharedAbbreviations } = buildRedirects(base);
    expect(redirects).not.toHaveProperty('/terms/bi');
    expect(sharedAbbreviations).toEqual(['bi']);
  });
});

describe('loadRedirects', () => {
  it('builds redirects from the real content', () => {
    const redirects = loadRedirects();
    expect(redirects['/terms/acv']).toBe('/terms/actual-cash-value');
    expect(redirects['/terms/aais']).toBe('/terms/american-association-of-insurance-services');
    expect(redirects['/types/health.disability.add']).toBe('/types/health.supplemental.add');
  });
});
