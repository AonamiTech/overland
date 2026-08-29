/**
 * GA4 for a single-page app.
 *
 * The stock snippet fires one page_view on load and nothing afterwards, so every
 * client-side route change would be invisible. `send_page_view: false` is set in
 * index.html and we send them from the router instead.
 *
 * All calls are no-ops when gtag is absent (ad blockers, or local dev), so nothing
 * here can throw into the app.
 */

type GtagArgs = [string, string, Record<string, unknown>?];
declare global {
  interface Window { gtag?: (...args: GtagArgs) => void; dataLayer?: unknown[] }
}

export const MEASUREMENT_ID = 'G-SBCC86WVG0';

export function pageView(path: string, title?: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}

/** Product events worth having from day one. Keep the list small and meaningful. */
export function track(event: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', event, params);
}

export const events = {
  signUpStarted: (role: string) => track('sign_up_started', { role }),
  /* A provider hand-off that failed. Worth an event because it is invisible otherwise:
     the visitor simply does not arrive, and nothing in the funnel says why. */
  authFailed: (code: string, detail: string) => track('auth_failed', { code, detail: detail.slice(0, 100) }),
  signUpLinkSent: (role: string) => track('sign_up_link_sent', { role }),
  boardOpened: () => track('board_opened'),
  laneOpened: (lane: string) => track('lane_opened', { lane }),
  bidAccepted: (lane: string, amount: number) =>
    track('bid_accepted', { lane, value: amount, currency: 'USD' }),
  counterSent: (lane: string, amount: number) => track('counter_sent', { lane, value: amount }),
  profileViewed: (id: string) => track('profile_viewed', { profile_id: id }),
  ratingPosted: (stars: number) => track('rating_posted', { stars }),
};
