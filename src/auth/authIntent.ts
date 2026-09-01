/**
 * The page a visitor was trying to reach before an auth redirect.
 *
 * This is deliberately limited to same-origin path/query/hash values. Auth
 * redirects are an easy place to introduce an open redirect if an arbitrary URL
 * is carried through the flow.
 */
export const DEFAULT_AUTH_RETURN_TO = '/board';
export const AUTH_RETURN_PARAM = 'overland_return_to';
export const AUTH_ROLE_PARAM = 'overland_role';

const STORAGE_KEY = 'overland.auth.intent.v1';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const URL_BASE = 'https://overland.local';

type AuthIntent = {
  returnTo: string;
  createdAt: number;
  role?: AuthIntentRole;
};

export type AuthIntentRole = 'shipper' | 'carrier';

export function normalizeAuthReturnTo(value?: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_AUTH_RETURN_TO;
  }

  try {
    const parsed = new URL(value, URL_BASE);
    if (parsed.origin !== URL_BASE) return DEFAULT_AUTH_RETURN_TO;
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || DEFAULT_AUTH_RETURN_TO;
  } catch {
    return DEFAULT_AUTH_RETURN_TO;
  }
}

export function saveAuthIntent(returnTo?: string | null, role?: AuthIntentRole | null): string {
  const target = normalizeAuthReturnTo(returnTo);
  try {
    const intent: AuthIntent = {
      returnTo: target,
      createdAt: Date.now(),
      ...(role === 'shipper' || role === 'carrier' ? { role } : {}),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch {
    // Private browsing or blocked storage should not prevent signing in.
  }
  return target;
}

export function readAuthIntent(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const intent = JSON.parse(raw) as Partial<AuthIntent>;
    if (typeof intent.returnTo !== 'string' || typeof intent.createdAt !== 'number') {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (Date.now() - intent.createdAt > MAX_AGE_MS || Date.now() - intent.createdAt < 0) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return normalizeAuthReturnTo(intent.returnTo);
  } catch {
    return null;
  }
}

export function readAuthIntentRole(): AuthIntentRole | null {
  if (!readAuthIntent()) return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const intent = JSON.parse(raw) as Partial<AuthIntent>;
    return intent.role === 'shipper' || intent.role === 'carrier' ? intent.role : null;
  } catch {
    return null;
  }
}

export function clearAuthIntent(): void {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
}

/** The current app location, with the homepage treated as the board default. */
export function currentAuthReturnTo(): string {
  if (typeof window === 'undefined') return DEFAULT_AUTH_RETURN_TO;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  return current === '/' || current === '' ? DEFAULT_AUTH_RETURN_TO : normalizeAuthReturnTo(current);
}

/**
 * Include the intent in the callback URL as well as sessionStorage. That keeps the
 * redirect working when a magic-link email opens a new tab, where sessionStorage is
 * not shared with the tab that started the flow.
 */
export function authCallbackUrl(): string {
  if (typeof window === 'undefined') return '';
  const target = readAuthIntent() ?? DEFAULT_AUTH_RETURN_TO;
  const callback = new URL('/', window.location.origin);
  callback.searchParams.set(AUTH_RETURN_PARAM, target);
  const role = readAuthIntentRole();
  if (role) callback.searchParams.set(AUTH_ROLE_PARAM, role);
  return callback.toString();
}
