import { useEffect, useId, useState } from 'react';
import {
  isTheme,
  resolveTheme,
  THEME_LABELS,
  THEME_STORAGE_KEY,
  THEMES,
  type ThemeChoice,
} from '../lib/theme';

const CHOICES: ThemeChoice[] = ['system', ...THEMES];

function readChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

function saveChoice(choice: ThemeChoice): void {
  try {
    if (choice === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}

function applyChoice(choice: ThemeChoice): void {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const more = window.matchMedia('(prefers-contrast: more)').matches;
  document.documentElement.dataset.theme = resolveTheme(choice, dark, more);
}

/**
 * Theme picker. The choice is remembered on this device; "Match my device" follows system settings.
 * Reads localStorage, so render it with client:only="react".
 */
export function ThemeToggle() {
  const id = useId();
  const [choice, setChoice] = useState<ThemeChoice>(readChoice);

  useEffect(() => {
    if (choice !== 'system') return;
    const queries = ['(prefers-color-scheme: dark)', '(prefers-contrast: more)'].map((q) =>
      window.matchMedia(q),
    );
    const update = () => applyChoice('system');
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, [choice]);

  function onChange(next: ThemeChoice) {
    setChoice(next);
    saveChoice(next);
    applyChoice(next);
  }

  return (
    <div className="pd-field">
      <label className="pd-label" htmlFor={id}>
        Theme
      </label>
      <select
        id={id}
        className="pd-input"
        value={choice}
        onChange={(e) => onChange(e.target.value as ThemeChoice)}
      >
        {CHOICES.map((c) => (
          <option key={c} value={c}>
            {THEME_LABELS[c]}
          </option>
        ))}
      </select>
    </div>
  );
}
