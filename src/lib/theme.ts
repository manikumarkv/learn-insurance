export const THEMES = ['light', 'dark', 'light-hc', 'dark-hc'] as const;
export type Theme = (typeof THEMES)[number];
export type ThemeChoice = Theme | 'system';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_LABELS: Record<ThemeChoice, string> = {
  system: 'Match my device',
  light: 'Light',
  dark: 'Dark',
  'light-hc': 'High contrast light',
  'dark-hc': 'High contrast dark',
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

/** The theme to show: the saved choice, or the device's light/dark and contrast settings. */
export function resolveTheme(
  choice: ThemeChoice,
  prefersDark: boolean,
  prefersMoreContrast: boolean,
): Theme {
  if (choice !== 'system') return choice;
  const base = prefersDark ? 'dark' : 'light';
  return prefersMoreContrast ? `${base}-hc` : base;
}

/**
 * Sets data-theme on <html> before the first paint. It runs inline in <head> via toString(),
 * so it must not use anything defined outside its own body.
 */
export function applyInitialTheme(): void {
  const themes = ['light', 'dark', 'light-hc', 'dark-hc'];
  let choice: string | null = null;
  try {
    choice = localStorage.getItem('theme');
  } catch {
    // Storage blocked: fall back to the device setting.
  }
  let theme = choice && themes.includes(choice) ? choice : '';
  if (!theme) {
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    const more = matchMedia('(prefers-contrast: more)').matches;
    theme = (dark ? 'dark' : 'light') + (more ? '-hc' : '');
  }
  document.documentElement.dataset.theme = theme;
}
