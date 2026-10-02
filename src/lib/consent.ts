/**
 * Cookie consent (story 5.4). Analytics must call hasAnalyticsConsent() / onConsentChange()
 * and load nothing until the visitor chooses "Accept".
 */
export type Consent = 'necessary' | 'analytics';

export const CONSENT_STORAGE_KEY = 'cookie-consent';
const CHANGE_EVENT = 'consentchange';

export function isConsent(value: unknown): value is Consent {
  return value === 'necessary' || value === 'analytics';
}

/** The saved choice, or null when the visitor hasn't chosen yet. */
export function getConsent(): Consent | null {
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    return isConsent(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function setConsent(consent: Consent): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CHANGE_EVENT, { detail: consent }));
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === 'analytics';
}

/** Calls `listener` whenever the visitor changes their choice. Returns an unsubscribe function. */
export function onConsentChange(listener: (consent: Consent) => void): () => void {
  const handler = (e: Event) => listener((e as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

/** Fired by "Cookie settings" links to reopen the banner. */
export const OPEN_SETTINGS_EVENT = 'opencookiesettings';
