/*
 * Fills in progress on the static paths pages once we know what the person has learned.
 *  - [data-path-card][data-terms]  → status text and button label on the paths list
 *  - [data-path-detail][data-modules] → percent, counts, Continue link, per-module and per-term marks
 */
import { getLearnedTermIds, pathProgress } from './progress';

const json = <T>(value: string | undefined, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

function setText(root: ParentNode, selector: string, text: string) {
  const el = root.querySelector<HTMLElement>(selector);
  if (el) el.textContent = text;
}

export async function showPathProgress(): Promise<void> {
  const learned = await getLearnedTermIds();

  for (const card of document.querySelectorAll<HTMLElement>('[data-path-card]')) {
    const terms = json<string[]>(card.dataset.terms, []);
    const p = pathProgress([{ terms }], learned);
    if (p.done === 0) continue;
    const done = p.done === p.total;
    setText(card, '[data-status]', done ? 'Completed' : `${p.percent}% complete`);
    card.querySelector('[data-status-icon]')?.toggleAttribute('hidden', !done);
    setText(card, '[data-action]', done ? 'Review' : 'Continue');
  }

  const detail = document.querySelector<HTMLElement>('[data-path-detail]');
  if (!detail) return;
  const modules = json<{ terms: string[] }[]>(detail.dataset.modules, []);
  const p = pathProgress(modules, learned);

  setText(detail, '[data-percent]', `${p.percent}%`);
  setText(detail, '[data-count]', `${p.done} / ${p.total} answered correctly`);
  detail.querySelector<HTMLElement>('[data-bar]')?.style.setProperty('width', `${p.percent}%`);
  const next = detail.querySelector<HTMLAnchorElement>('[data-next]');
  if (next) {
    if (p.nextTermId) {
      next.href = `/terms/${p.nextTermId}`;
      next.textContent = p.done === 0 ? 'Start learning' : 'Continue learning';
    } else {
      next.textContent = 'Review the path';
    }
  }

  p.modules.forEach((m, i) => {
    const el = detail.querySelector<HTMLElement>(`[data-module="${i}"]`);
    if (!el) return;
    setText(
      el,
      '[data-module-status]',
      m.done === m.total ? `${m.total} terms · done` : `${m.done} of ${m.total} learned`,
    );
  });
  for (const item of detail.querySelectorAll<HTMLElement>('[data-term-id]')) {
    const isLearned = learned.has(item.dataset.termId ?? '');
    item.querySelector('[data-learned]')?.toggleAttribute('hidden', !isLearned);
  }
}
