import { describe, expect, it } from 'vitest';
import { buildLinkIndex, linkify, type Segment } from './links';

const index = buildLinkIndex([
  { id: 'premium', term: 'Premium' },
  { id: 'deductible', term: 'Deductible' },
  { id: 'cash-value', term: 'Cash Value' },
  { id: 'actual-cash-value', term: 'Actual Cash Value', abbreviation: 'ACV' },
  { id: 'alternative-risk-transfer', term: 'Alternative Risk Transfer', abbreviation: 'ART' },
  { id: 'insurance-policy', term: 'Insurance Policy', alsoKnownAs: ['Policy'] },
  { id: 'bodily-injury', term: 'Bodily Injury', abbreviation: 'BI' },
  { id: 'business-interruption', term: 'Business Interruption', abbreviation: 'BI' },
  { id: 'endorsement', term: 'Endorsement' },
]);

/** Shows links as [text→id] to keep expectations readable. */
const show = (segments: Segment[]) =>
  segments.map((s) => ('termId' in s ? `[${s.text}→${s.termId}]` : s.text)).join('');

describe('linkify', () => {
  it('links names case-insensitively as whole words', () => {
    expect(show(linkify('Your premium and deductibles.', index, 'endorsement'))).toBe(
      'Your [premium→premium] and deductibles.',
    );
  });

  it('prefers the longest match', () => {
    expect(show(linkify('It pays actual cash value.', index, 'endorsement'))).toBe(
      'It pays [actual cash value→actual-cash-value].',
    );
  });

  it('links only the first mention and never the page itself', () => {
    expect(show(linkify('Premium, premium. An endorsement.', index, 'endorsement'))).toBe(
      '[Premium→premium], premium. An endorsement.',
    );
  });

  it('matches abbreviations case-sensitively', () => {
    expect(show(linkify('ACV for the art collection, not ART.', index, 'endorsement'))).toBe(
      '[ACV→actual-cash-value] for the art collection, not [ART→alternative-risk-transfer].',
    );
  });

  it('matches "also known as" names', () => {
    expect(show(linkify('Read your policy.', index, 'endorsement'))).toBe(
      'Read your [policy→insurance-policy].',
    );
  });

  it('skips abbreviations shared by two terms', () => {
    expect(show(linkify('BI claims.', index, 'endorsement'))).toBe('BI claims.');
  });

  it('stops after 5 links in a section', () => {
    const text = 'premium deductible cash value policy ACV endorsement ART';
    const links = linkify(text, index, 'x').filter((s) => 'termId' in s);
    expect(links).toHaveLength(5);
  });

  it('supports [[id]], [[id|text]] and [[!word]] overrides', () => {
    expect(
      show(
        linkify(
          'Pay [[premium|premiums]] on the [[!policy]] date, see [[deductible]].',
          index,
          'x',
        ),
      ),
    ).toBe('Pay [premiums→premium] on the policy date, see [deductible→deductible].');
  });

  it('leaves an override to an unknown term as plain text', () => {
    expect(show(linkify('See [[no-such-term|this]].', index, 'x'))).toBe('See this.');
  });
});
