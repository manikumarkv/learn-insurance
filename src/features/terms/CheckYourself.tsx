import { useId, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { pickRandom } from './pickQuestions';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface Props {
  questions: QuizQuestion[];
  /** How many questions to show from the pool. */
  count?: number;
}

/**
 * "Check yourself": shows `count` random questions from the term's pool, one at a time.
 * Picks at random in the browser, so render it with client:only="react".
 */
export function CheckYourself({ questions, count = 3 }: Props) {
  const [picked] = useState(() => pickRandom(questions, count));
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const name = useId();

  const q = picked[index];
  if (!q) {
    return (
      <p className="text-body m-0" role="status">
        You got {correct} of {picked.length} right.{' '}
        <button
          type="button"
          className="pd-btn pd-btn-ghost pd-btn-sm"
          onClick={() => window.location.reload()}
        >
          Try other questions
        </button>
      </p>
    );
  }

  const isRight = choice === q.answer;

  function check() {
    if (choice === null) return;
    setChecked(true);
    if (choice === q?.answer) setCorrect((c) => c + 1);
  }

  function next() {
    setIndex((i) => i + 1);
    setChoice(null);
    setChecked(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-label-sm text-ink-muted m-0">
        Question {index + 1} of {picked.length} · from a pool of {questions.length}
      </p>
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="text-title-sm mb-3 p-0">{q.question}</legend>
        {q.options.map((option, i) => {
          const selected = choice === i;
          const showRight = checked && i === q.answer;
          return (
            <label
              key={option}
              className={[
                'border-ink flex cursor-pointer items-center gap-3 rounded-md px-4 py-3',
                selected || showRight ? 'border-3' : 'border-2',
                checked ? 'cursor-default' : 'hover:bg-paper-sunken',
              ].join(' ')}
            >
              <input
                type="radio"
                name={name}
                value={i}
                checked={selected}
                disabled={checked}
                onChange={() => setChoice(i)}
                className="size-5 accent-current"
              />
              <span className="flex-1">{option}</span>
              {showRight && (
                <span className="pd-badge pd-badge-solid">
                  <Icon name="check" size={16} strokeWidth={2.5} /> Correct answer
                </span>
              )}
            </label>
          );
        })}
      </fieldset>
      {checked && (
        <div className="pd-card" role="status">
          <p className="text-label m-0 flex items-center gap-2">
            <Icon name={isRight ? 'check' : 'x'} size={20} />
            {isRight ? 'Correct.' : 'Not quite.'}
          </p>
          <p className="text-body mt-1 mb-0">{q.explanation}</p>
        </div>
      )}
      <div>
        {checked ? (
          <Button variant="primary" iconRight="arrow-right" onClick={next}>
            {index + 1 < picked.length ? 'Next question' : 'See result'}
          </Button>
        ) : (
          <Button variant="primary" onClick={check} disabled={choice === null}>
            Check answer
          </Button>
        )}
      </div>
    </div>
  );
}
