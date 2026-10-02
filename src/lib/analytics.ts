/*
 * Analytics with PostHog (story 6.6). Nothing loads, and no event is sent, until the visitor
 * accepts analytics cookies (src/lib/consent.ts) and PUBLIC_POSTHOG_KEY is set.
 * Events are anonymous: we never identify people or send their Clerk ID, name or email.
 */
import type { PostHog } from 'posthog-js';
import { hasAnalyticsConsent, onConsentChange } from './consent';

export type AnalyticsEvent = 'search' | 'search_missed' | 'term_view' | 'answer' | 'sign_up';
export type EventProps = Record<string, string | number | boolean>;

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY;
const HOST = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let client: Promise<PostHog> | null = null;

function load(): Promise<PostHog> {
  client ??= import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY ?? '', {
      api_host: HOST,
      capture_pageview: true,
      autocapture: false,
      disable_session_recording: true,
      // Anonymous only: no person profiles, since we never call identify().
      person_profiles: 'identified_only',
      persistence: 'localStorage',
    });
    return posthog;
  });
  return client;
}

export function analyticsEnabled(): boolean {
  return Boolean(KEY) && hasAnalyticsConsent();
}

/** Sends an event if the visitor has accepted analytics; otherwise does nothing. */
export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (!analyticsEnabled()) return;
  void load().then((posthog) => posthog.capture(event, props));
}

/** Call once per page: loads PostHog (and records the page view) if allowed, and follows later choices. */
export function startAnalytics(): void {
  if (!KEY) return;
  if (hasAnalyticsConsent()) void load();
  onConsentChange((consent) => {
    if (consent === 'analytics') {
      void load().then((posthog) => posthog.opt_in_capturing());
    } else if (client) {
      void client.then((posthog) => posthog.opt_out_capturing());
    }
  });
}
