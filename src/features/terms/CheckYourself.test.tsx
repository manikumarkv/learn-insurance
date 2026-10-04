// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckYourself, type QuizQuestion } from './CheckYourself';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const question: QuizQuestion = {
  question: 'Who pays the deductible?',
  options: ['You', 'The insurer'],
  answer: 0,
  explanation: 'You pay the deductible first.',
};

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(null, { status: 404 }))),
  );
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

function answerFirstOption() {
  const radio = container.querySelector<HTMLInputElement>('input[type="radio"]');
  if (!radio) throw new Error('No options');
  act(() => radio.click());
  const check = [...container.querySelectorAll('button')].find(
    (b) => b.textContent === 'Check answer',
  );
  if (!check) throw new Error('No Check answer button');
  act(() => check.click());
}

describe('CheckYourself', () => {
  it('shows the result after the last question', () => {
    act(() => root.render(<CheckYourself questions={[question]} count={1} />));
    answerFirstOption();
    expect(container.textContent).toContain('Correct.');
    expect(container.textContent).toContain('See result');
  });

  it('on a learn card, links to the next term after the answer is checked', () => {
    act(() =>
      root.render(
        <CheckYourself
          questions={[question]}
          count={1}
          termId="deductible"
          next={{ href: '/paths/p/learn/premium', label: 'Next term' }}
        />,
      ),
    );
    expect(container.querySelector('a')).toBeNull();
    answerFirstOption();
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/paths/p/learn/premium');
    expect(link?.textContent).toContain('Next term');
  });
});
