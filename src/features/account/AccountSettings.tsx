import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { hasAnalyticsConsent, setConsent } from '../../lib/consent';

type DeleteState = 'idle' | 'confirming' | 'deleting' | 'deleted' | 'failed';

/**
 * Analytics choice and account deletion (story 6.4). The profile itself (name, email, sign-in
 * methods) is Clerk's form on the same page. Reads localStorage, so use client:only="react".
 */
export function AccountSettings() {
  const [analytics, setAnalytics] = useState(hasAnalyticsConsent);
  const [state, setState] = useState<DeleteState>('idle');

  async function deleteAccount() {
    setState('deleting');
    const res = await fetch('/api/account', { method: 'DELETE' }).catch(() => null);
    setState(res?.ok ? 'deleted' : 'failed');
  }

  if (state === 'deleted') {
    return (
      <section className="ui-callout flex flex-col gap-2" role="status">
        <h2 className="text-title-md m-0">Your account is deleted</h2>
        <p className="text-body m-0">
          Your progress, answers and saved terms are gone. Thanks for learning with us.
        </p>
        <a href="/" className="ui-btn ui-btn-primary self-start">
          Go to the home page
        </a>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="privacy-heading" className="ui-card flex flex-col gap-3">
        <h2 id="privacy-heading" className="text-title-md m-0">
          Privacy
        </h2>
        <Switch
          label="Help improve LearnInsurance with anonymous analytics"
          checked={analytics}
          onChange={(e) => {
            setAnalytics(e.target.checked);
            setConsent(e.target.checked ? 'analytics' : 'necessary');
          }}
        />
        <p className="text-body-sm text-ink-muted m-0">
          Saved on this device, same as the cookie choice. <a href="/privacy">Privacy policy</a>
        </p>
      </section>

      <section aria-labelledby="delete-heading" className="ui-card flex flex-col gap-3">
        <h2 id="delete-heading" className="text-title-md m-0">
          Delete account
        </h2>
        <p className="text-body m-0">
          Deletes your account, progress, answers and saved terms. Term requests you made stay open
          for others, without your name. This can't be undone.
        </p>
        {state === 'idle' && (
          <Button className="self-start" onClick={() => setState('confirming')}>
            Delete my account
          </Button>
        )}
        {(state === 'confirming' || state === 'deleting' || state === 'failed') && (
          <div className="flex flex-col gap-3" role="group" aria-label="Confirm deletion">
            <p className="text-label m-0">Are you sure? Everything above is deleted for good.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={deleteAccount} disabled={state === 'deleting'}>
                {state === 'deleting' ? 'Deleting…' : 'Yes, delete everything'}
              </Button>
              <Button onClick={() => setState('idle')} disabled={state === 'deleting'}>
                Keep my account
              </Button>
            </div>
            {state === 'failed' && (
              <p className="text-body-sm m-0" role="alert">
                <strong>Not deleted.</strong> Something went wrong. Please try again.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
