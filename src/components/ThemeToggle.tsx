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

/** Fired on window when any picker changes, so every picker on the page shows the same choice. */
const CHANGE_EVENT = 'themechoicechange';

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
export interface ThemeToggleProps {
  /** Hide the visible label (it stays available to screen readers), e.g. in the header. */
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const id = useId();
  const [choice, setChoice] = useState<ThemeChoice>(readChoice);

  useEffect(() => {
    const sync = (e: Event) => setChoice((e as CustomEvent<ThemeChoice>).detail);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

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
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  }

  return (
    <div className="pd-field">
      <label className={compact ? 'sr-only' : 'pd-label'} htmlFor={id}>
        Theme
      </label>
      <select
        id={id}
        className={compact ? 'pd-input pd-input-sm' : 'pd-input'}
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
