interface ImportMetaEnv {
  /** Set from KEYSTATIC_STORAGE in astro.config.mjs: 'local' (default) or 'github'. */
  readonly KEYSTATIC_STORAGE: 'local' | 'github';
  /** PostHog project token (phc_…). Analytics stays off without it. */
  readonly PUBLIC_POSTHOG_KEY?: string;
  /** PostHog host, e.g. https://us.i.posthog.com. */
  readonly PUBLIC_POSTHOG_HOST?: string;
}
