import { useEffect, useRef, useState } from 'react';
import { getConsent, OPEN_SETTINGS_EVENT, setConsent, type Consent } from '../lib/consent';
import { Button } from './ui/Button';

/**
 * Cookie consent banner: shows until the visitor chooses, and again from "Cookie settings".
 * Reads localStorage, so render it with client:only="react".
 */
export function CookieBanner() {
  const [open, setOpen] = useState(() => getConsent() === null);
  const [current, setCurrent] = useState<Consent | null>(getConsent);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reopened = useRef(false);

  useEffect(() => {
    const show = () => {
      reopened.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, show);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, show);
  }, []);

  useEffect(() => {
    // When reopened from "Cookie settings", move focus to the banner so keyboard users land on it.
    if (open && reopened.current) headingRef.current?.focus();
  }, [open]);

  if (!open) return null;

  function choose(consent: Consent) {
    setConsent(consent);
    setCurrent(consent);
    setOpen(false);
  }

  return (
    <section
      aria-labelledby="cookie-banner-title"
      className="bg-paper border-ink fixed inset-x-0 bottom-0 z-30 border-t-3"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 id="cookie-banner-title" ref={headingRef} tabIndex={-1} className="text-title-sm m-0">
            Cookie choice
          </h2>
          <p className="text-body-sm m-0 max-w-prose">
            We use analytics cookies to see which terms help people most. They only run if you
            accept. You can change this anytime from Cookie settings in the footer.{' '}
            <a href="/privacy">Privacy policy</a>
          </p>
          {current && (
            <p className="text-body-sm text-ink-muted m-0">
              Current choice: {current === 'analytics' ? 'analytics allowed' : 'only necessary'}.
            </p>
          )}
        </div>
        <div className="flex flex-none gap-2">
          <Button onClick={() => choose('necessary')}>Only necessary</Button>
          <Button variant="primary" onClick={() => choose('analytics')}>
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
}
