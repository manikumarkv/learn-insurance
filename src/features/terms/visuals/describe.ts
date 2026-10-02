import type { Diagram } from '../../../content/schema/term';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatMoney(amount: number): string {
  return money.format(amount);
}

export const PAID_BY_LABEL = {
  you: 'You pay',
  insurer: 'Insurer pays',
  none: 'Nobody pays',
} as const;

/** Plain-text version of a diagram for screen readers. */
export function describeDiagram(d: Diagram): string {
  switch (d.discriminant) {
    case 'who-pays':
      return [
        `Total ${formatMoney(d.value.total)}.`,
        ...d.value.parts.map(
          (p) => `${PAID_BY_LABEL[p.paidBy]} ${formatMoney(p.amount)} (${p.label}).`,
        ),
      ].join(' ');
    case 'timeline':
      return [
        `From ${d.value.start} to ${d.value.end}.`,
        ...d.value.segments.map(
          (s) => `${s.label}: ${s.share}% of the time, ${PAID_BY_LABEL[s.paidBy].toLowerCase()}.`,
        ),
      ].join(' ');
    case 'before-after':
      return `Before, ${d.value.before.label}: ${d.value.before.lines.join(', ')}. Change: ${d.value.change}. After, ${d.value.after.label}: ${d.value.after.lines.join(', ')}.`;
    case 'split':
      return `${d.value.left.label}: ${d.value.left.lines.join(', ')}. ${d.value.right.label}: ${d.value.right.lines.join(', ')}.`;
    case 'flow':
      return d.value.highlight.length
        ? `In the policy flow, this happens at: ${d.value.highlight.join(', ')}.`
        : 'Shown in the policy flow.';
  }
}
