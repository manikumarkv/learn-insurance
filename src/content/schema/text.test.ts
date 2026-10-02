import { describe, expect, it } from 'vitest';
import { linkTargets, sentences, wordCount } from './text';

describe('wordCount', () => {
  it('counts words separated by any whitespace', () => {
    expect(wordCount('  An endorsement\nchanges a policy. ')).toBe(5);
  });
});

describe('sentences', () => {
  it('splits on sentence ends but not on e.g.', () => {
    expect(sentences('It changes a policy, e.g. an address. It is written.')).toHaveLength(2);
  });
});

describe('linkTargets', () => {
  it('finds [[id]] and [[id|text]] but not [[!word]]', () => {
    expect(linkTargets('Pay the [[premium]] on [[policy|policies]], not the [[!policy]].')).toEqual(
      ['premium', 'policy'],
    );
  });
});
