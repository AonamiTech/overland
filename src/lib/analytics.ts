/**
 * Cookieless Funnel Analytics.
 *
 * Exactly five funnel events:
 * 1. landing
 * 2. signup_started
 * 3. signup_completed
 * 4. first_action (post or bid)
 * 5. deal_accepted
 *
 * Guarded by VITE_POSTHOG_KEY / VITE_ANALYTICS_KEY: if unset (local dev and preview),
 * nothing is sent over the network.
 */

type GtagArgs = [string, string, Record<string, unknown>?];
declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}

export const isAnalyticsEnabled = () =>
  Boolean(import.meta.env.VITE_POSTHOG_KEY || import.meta.env.VITE_ANALYTICS_KEY);

export function trackFunnelEvent(event: 'landing' | 'signup_started' | 'signup_completed' | 'first_action' | 'deal_accepted', params: Record<string, unknown> = {}) {
  if (!isAnalyticsEnabled()) return;

  if (window.posthog) {
    window.posthog.capture(event, params);
  } else if (window.gtag) {
    window.gtag('event', event, params);
  } else {
    // Cookieless fallback endpoint via Beacon / fetch if key is configured
    const key = import.meta.env.VITE_POSTHOG_KEY || import.meta.env.VITE_ANALYTICS_KEY;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        'https://app.posthog.com/e/',
        JSON.stringify({ api_key: key, event, properties: { ...params, timestamp: Date.now() } })
      );
    }
  }
}

export function pageView(path: string, title?: string) {
  if (!isAnalyticsEnabled()) return;
  trackFunnelEvent('landing', { path, title: title ?? document.title });
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (!isAnalyticsEnabled()) return;
  if (window.posthog) {
    window.posthog.capture(event, params);
  } else if (window.gtag) {
    window.gtag('event', event, params);
  }
}

export const events = {
  landing: (path = '/') => trackFunnelEvent('landing', { path }),
  signUpStarted: (role?: string) => trackFunnelEvent('signup_started', { role }),
  signUpCompleted: (role?: string) => trackFunnelEvent('signup_completed', { role }),
  firstAction: (action: 'post' | 'bid', lane?: string) => trackFunnelEvent('first_action', { action, lane }),
  dealAccepted: (lane?: string, amount?: number) => trackFunnelEvent('deal_accepted', { lane, amount }),

  // Existing helpers
  authFailed: (code: string, detail: string) => track('auth_failed', { code, detail: detail.slice(0, 100) }),
  signUpLinkSent: (role: string) => track('sign_up_link_sent', { role }),
  boardOpened: () => trackFunnelEvent('landing', { path: '/board' }),
  laneOpened: (lane: string) => track('lane_opened', { lane }),
};
