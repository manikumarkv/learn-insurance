import { describe, expect, it } from 'vitest';
import { describeDiagram, formatMoney } from './describe';

describe('describeDiagram', () => {
  it('describes a money split', () => {
    expect(
      describeDiagram({
        discriminant: 'who-pays',
        value: {
          total: 5000,
          parts: [
            { label: 'Your deductible', amount: 1000, paidBy: 'you' },
            { label: 'Insurer pays', amount: 4000, paidBy: 'insurer' },
          ],
        },
      }),
    ).toBe('Total $5,000. You pay $1,000 (Your deductible). Insurer pays $4,000 (Insurer pays).');
  });

  it('describes a before/after change', () => {
    expect(
      describeDiagram({
        discriminant: 'before-after',
        value: {
          before: { label: 'Jan 1', lines: ['$100/month'] },
          change: 'Endorsement',
          after: { label: 'Jan 20', lines: ['$120/month'] },
        },
      }),
    ).toBe('Before, Jan 1: $100/month. Change: Endorsement. After, Jan 20: $120/month.');
  });

  it('describes the highlighted flow stages', () => {
    expect(describeDiagram({ discriminant: 'flow', value: { highlight: ['Changes'] } })).toBe(
      'In the policy flow, this happens at: Changes.',
    );
  });
});

describe('formatMoney', () => {
  it('uses US dollars with no cents', () => {
    expect(formatMoney(50000)).toBe('$50,000');
  });
});
