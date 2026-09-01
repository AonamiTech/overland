import { beforeEach, describe, expect, it } from 'vitest';
import {
  AUTH_RETURN_PARAM,
  AUTH_ROLE_PARAM,
  CANONICAL_APP_ORIGIN,
  DEFAULT_AUTH_RETURN_TO,
  authCallbackUrl,
  authAppOrigin,
  clearAuthIntent,
  currentAuthReturnTo,
  normalizeAuthReturnTo,
  readAuthIntent,
  readAuthIntentRole,
  saveAuthIntent,
} from '../authIntent';

describe('auth intent', () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('accepts same-origin paths and rejects open-redirect targets', () => {
    expect(normalizeAuthReturnTo('/lane/mem-chi?tab=bids#offers')).toBe('/lane/mem-chi?tab=bids#offers');
    expect(normalizeAuthReturnTo('https://example.com/account')).toBe(DEFAULT_AUTH_RETURN_TO);
    expect(normalizeAuthReturnTo('//example.com/account')).toBe(DEFAULT_AUTH_RETURN_TO);
  });

  it('round-trips a target and includes it in the new-tab callback URL', () => {
    saveAuthIntent('/lane/mem-chi?tab=bids', 'carrier');
    expect(readAuthIntent()).toBe('/lane/mem-chi?tab=bids');
    expect(readAuthIntentRole()).toBe('carrier');

    const callback = new URL(authCallbackUrl());
    expect(callback.pathname).toBe('/');
    expect(callback.searchParams.get(AUTH_RETURN_PARAM)).toBe('/lane/mem-chi?tab=bids');
    expect(callback.searchParams.get(AUTH_ROLE_PARAM)).toBe('carrier');

    clearAuthIntent();
    expect(readAuthIntent()).toBeNull();
  });

  it('uses the board as the homepage intent', () => {
    expect(currentAuthReturnTo()).toBe(DEFAULT_AUTH_RETURN_TO);
    window.history.replaceState({}, '', '/lane/mem-chi');
    expect(currentAuthReturnTo()).toBe('/lane/mem-chi');
  });

  it('uses Cloudflare as the hosted OAuth origin while preserving local development origins', () => {
    expect(authAppOrigin('https://overland-ochre.vercel.app')).toBe(CANONICAL_APP_ORIGIN);
    expect(authAppOrigin(CANONICAL_APP_ORIGIN)).toBe(CANONICAL_APP_ORIGIN);
    expect(authAppOrigin('http://localhost:8080')).toBe('http://localhost:8080');
  });
});
