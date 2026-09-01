import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { events } from '@/lib/analytics';
import {
  AUTH_ROLE_PARAM,
  AUTH_RETURN_PARAM,
  DEFAULT_AUTH_RETURN_TO,
  authCallbackUrl,
  readAuthIntent,
  readAuthIntentRole,
  saveAuthIntent,
  clearAuthIntent,
} from './authIntent';
import {
  clearLocalSession,
  createLocalUser,
  readLocalAccount,
  readLocalSession,
  saveLocalAccount,
  writeLocalSession,
} from './localStore';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabaseConfig';
import type { SupabaseSessionLike } from './supabaseClient';

export type Role = 'shipper' | 'carrier';
export type AccountType = 'individual' | 'company';
export type AuthMode = 'supabase' | 'local';
export type AuthView = 'signin' | 'signup';

export type AuthOpenOptions = {
  mode?: AuthView;
  role?: Role;
  /** Same-origin path/query/hash to visit after authentication. */
  returnTo?: string;
};

/** The string overload keeps older integrations working while callers migrate. */
type AuthOpenInput = AuthOpenOptions | Role;

export type User = {
  id: string;
  email: string;
  role: Role;
  accountType: AccountType;
  name: string;
  phone: string;
  city: string;
  orgName?: string;
  mcNumber?: string;
  usdotNumber?: string;
  createdAt: string;
};

export type SendResult = { ok: boolean; emailed?: boolean; error?: string };

/** Profile fields collected at signup and written to user_metadata. */
export type SignUpExtra = {
  name?: string;
  phone?: string;
  city?: string;
  accountType?: AccountType;
  orgName?: string;
  mcNumber?: string;
  usdotNumber?: string;
};

type AuthValue = {
  user: User | null;
  loading: boolean;
  mode: AuthMode;
  authError: string | null;
  signUpWithPassword(email: string, password: string, role: Role, extra?: SignUpExtra): Promise<SendResult>;
  signInWithPassword(email: string, password: string): Promise<SendResult>;
  /** Sends a magic link, or signs in immediately in local demo mode. */
  sendLink(email: string, role: Role, extra?: SignUpExtra, intent?: AuthView): Promise<SendResult>;
  updateProfile(patch: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle(role?: Role): Promise<{ ok: boolean; error?: string }>;
  signOut(): Promise<void>;
  openAuth(input?: AuthOpenInput): void;
  closeAuth(): void;
  authOpen: boolean;
  pendingRole: Role;
  /** Optional for compatibility with consumers that mock the auth context. */
  pendingAuthMode?: AuthView;
};

export const AUTH_MODE: AuthMode = SUPABASE_URL && SUPABASE_ANON_KEY ? 'supabase' : 'local';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AUTH_QUERY_PARAMS = [
  'code',
  'error',
  'error_code',
  'error_description',
  'error_reason',
  'error_uri',
  'token_hash',
  'type',
  AUTH_RETURN_PARAM,
  AUTH_ROLE_PARAM,
];

function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sessionUser(session: SupabaseSessionLike | null, fallbackRole?: Role): User | null {
  const source = session?.user;
  if (!source) return null;

  const metadata = (source.user_metadata ?? {}) as Record<string, unknown>;
  const role: Role = metadata.role === 'carrier'
    ? 'carrier'
    : metadata.role === 'shipper'
      ? 'shipper'
      : fallbackRole ?? 'shipper';
  const accountType: AccountType = metadata.accountType === 'company' ? 'company' : 'individual';
  const stringValue = (key: string): string | undefined => {
    const value = metadata[key];
    return typeof value === 'string' ? value : undefined;
  };

  return {
    id: source.id,
    email: source.email ?? '',
    role,
    accountType,
    name: stringValue('name') ?? '',
    phone: stringValue('phone') ?? '',
    city: stringValue('city') ?? '',
    orgName: stringValue('orgName'),
    mcNumber: stringValue('mcNumber'),
    usdotNumber: stringValue('usdotNumber'),
    createdAt: source.created_at ?? new Date().toISOString(),
  };
}

function removeAuthParams(clearHash: boolean): void {
  try {
    const clean = new URL(window.location.href);
    AUTH_QUERY_PARAMS.forEach((key) => clean.searchParams.delete(key));
    if (clearHash) {
      clean.hash = '';
    } else if (clean.hash) {
      const parts = clean.hash.slice(1).split('&');
      const retained = parts.filter((part) => {
        const rawKey = part.split('=', 1)[0].replace(/\+/g, ' ');
        let key = rawKey;
        try { key = decodeURIComponent(rawKey); } catch { /* keep the raw key */ }
        return !AUTH_QUERY_PARAMS.includes(key);
      });
      if (retained.length !== parts.length) clean.hash = retained.length ? `#${retained.join('&')}` : '';
    }
    window.history.replaceState({}, '', `${clean.pathname}${clean.search}${clean.hash}`);
  } catch {
    // A malformed callback should not prevent the provider from restoring a session.
  }
}

function decodeCallbackError(value: string): string {
  try { return decodeURIComponent(value.replace(/\+/g, ' ')); } catch { return value; }
}

function disposeSubscription(subscription: unknown): void {
  const candidate = subscription as {
    data?: { subscription?: { unsubscribe?: () => void } };
    unsubscribe?: () => void;
  } | null;
  candidate?.data?.subscription?.unsubscribe?.();
  candidate?.unsubscribe?.();
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role>('shipper');
  const [pendingAuthMode, setPendingAuthMode] = useState<AuthView>('signin');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: unknown;

    const restore = async () => {
      if (AUTH_MODE !== 'supabase') {
        const stored = readLocalSession();
        if (!cancelled) setUser(stored);
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();

        // Listen once for password, magic-link and OAuth sessions. The cleanup is
        // important in development StrictMode and when the app hot-reloads.
        subscription = sb.auth.onAuthStateChange((_event, session) => {
          if (cancelled) return;
          const next = sessionUser(session, readAuthIntentRole() ?? undefined);
          setUser(next);
          if (next) {
            setAuthError(null);
          }
        });
        if (cancelled) disposeSubscription(subscription);

        const url = new URL(window.location.href);
        const search = url.searchParams;
        const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        const tokenHash = search.get('token_hash') || hash.get('token_hash');
        const callbackType = search.get('type') || hash.get('type') || 'email';
        const callbackTarget = search.get(AUTH_RETURN_PARAM) || hash.get(AUTH_RETURN_PARAM);
        const callbackRoleValue = search.get(AUTH_ROLE_PARAM) || hash.get(AUTH_ROLE_PARAM);
        const callbackRole: Role | undefined = callbackRoleValue === 'carrier' || callbackRoleValue === 'shipper'
          ? callbackRoleValue
          : undefined;
        if (callbackTarget || callbackRole) saveAuthIntent(callbackTarget ?? DEFAULT_AUTH_RETURN_TO, callbackRole);

        let hadAuthHash = Boolean(accessToken || refreshToken || tokenHash || hash.get('error') || hash.get('error_description'));
        if (accessToken && refreshToken) {
          const { error } = await sb.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error && !cancelled) {
            setAuthError(`Could not finish signing you in: ${error.message}`);
            events.authFailed('implicit_session', error.message);
          }
        }

        const callbackErrorValue = search.get('error_description')
          || hash.get('error_description')
          || search.get('error')
          || hash.get('error');
        if (callbackErrorValue) {
          const plain = decodeCallbackError(callbackErrorValue);
          const providerBroken = /unable to exchange external code|unsupported provider|provider is not enabled/i.test(plain);
          if (!cancelled) {
            setAuthError(
              providerBroken
                ? 'Google sign-in is temporarily unavailable. Use your email and password — it takes a moment and works the same.'
                : plain,
            );
          }
          events.authFailed(search.get('error_code') || hash.get('error_code') || 'oauth_error', plain);
          hadAuthHash = true;
        }

        if (tokenHash && !callbackErrorValue) {
          const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type: callbackType });
          if (error && !cancelled) {
            setAuthError(`The sign-in link could not be verified: ${error.message}`);
            events.authFailed('magic_link_verification', error.message);
          }
        }

        const code = search.get('code');
        if (code) {
          const { error } = await sb.auth.exchangeCodeForSession(code);
          if (error && !cancelled) {
            setAuthError(`Google sign-in did not complete: ${error.message}`);
            events.authFailed('oauth_code_exchange', error.message);
          }
        }

        // Supabase's URL detector is disabled in supabaseClient.ts so this explicit
        // path is the only code exchange. It lets us surface failures and guarantees
        // auth tokens/codes do not remain in browser history.
        if (code || callbackTarget || callbackErrorValue || hadAuthHash) {
          removeAuthParams(hadAuthHash);
        }

        const { data, error: sessionError } = await sb.auth.getSession();
        if (sessionError && !cancelled) setAuthError(`Could not restore your session: ${sessionError.message}`);
        const restored = sessionUser(data.session, readAuthIntentRole() ?? callbackRole);
        if (restored) {
          if (!cancelled) {
            setUser(restored);
            setAuthError(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setAuthError(error instanceof Error ? error.message : 'Could not restore your session.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void restore();
    return () => {
      cancelled = true;
      disposeSubscription(subscription);
    };
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    loading,
    mode: AUTH_MODE,
    authOpen,
    pendingRole,
    pendingAuthMode,
    authError,

    openAuth: (input) => {
      const legacy = typeof input === 'string';
      const options: AuthOpenOptions = legacy ? { role: input, mode: 'signup' } : (input ?? {});
      if (options.role) setPendingRole(options.role);
      setPendingAuthMode(options.mode ?? 'signin');
      saveAuthIntent(options.returnTo ?? DEFAULT_AUTH_RETURN_TO, options.role);
      setAuthError(null);
      setAuthOpen(true);
    },
    closeAuth: () => setAuthOpen(false),

    async signUpWithPassword(email, password, role, extra) {
      const clean = cleanEmail(email);
      if (!EMAIL_RE.test(clean)) return { ok: false, error: 'That does not look like an email address.' };
      if (password.length < 8) return { ok: false, error: 'Use at least 8 characters.' };

      if (AUTH_MODE === 'local') {
        if (readLocalAccount(clean)) return { ok: false, error: 'That email already has an account. Sign in instead.' };
        const localUser = createLocalUser(clean, role, extra);
        saveLocalAccount(localUser);
        writeLocalSession(localUser);
        setUser(localUser);
        setAuthError(null);
        return { ok: true, emailed: false };
      }

      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        const { data, error } = await sb.auth.signUp({
          email: clean,
          password,
          options: {
            emailRedirectTo: authCallbackUrl(),
            data: {
              role,
              accountType: extra?.accountType ?? 'individual',
              name: extra?.name,
              phone: extra?.phone,
              city: extra?.city,
              orgName: extra?.orgName,
              mcNumber: extra?.mcNumber,
              usdotNumber: extra?.usdotNumber,
            },
          },
        });
        if (error) {
          const exists = /already registered|already exists|user already/i.test(error.message);
          return { ok: false, error: exists ? 'That email already has an account. Sign in instead.' : error.message };
        }
        const signedIn = sessionUser(data.session, role);
        if (signedIn) {
          setUser(signedIn);
          setAuthError(null);
          return { ok: true, emailed: false };
        }
        return { ok: true, emailed: true };
      } catch {
        return { ok: false, error: 'Could not reach the sign-up service. Try again.' };
      }
    },

    async signInWithPassword(email, password) {
      const clean = cleanEmail(email);
      if (!EMAIL_RE.test(clean)) return { ok: false, error: 'That does not look like an email address.' };
      if (!password) return { ok: false, error: 'Enter your password.' };

      if (AUTH_MODE === 'local') {
        const localUser = readLocalAccount(clean);
        if (!localUser) {
          return { ok: false, error: 'No local account found for that email. Create an account first.' };
        }
        // Local mode never stores passwords. The UI explains that this is a demo
        // session, while a real Supabase deployment verifies the password server-side.
        writeLocalSession(localUser);
        setUser(localUser);
        setAuthError(null);
        return { ok: true, emailed: false };
      }

      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        const { data, error } = await sb.auth.signInWithPassword({ email: clean, password });
        if (error) {
          const bad = /invalid login credentials/i.test(error.message);
          const unconfirmed = /email not confirmed/i.test(error.message);
          return {
            ok: false,
            error: unconfirmed
              ? 'Confirm your email first — check your inbox for the link.'
              : bad
                ? 'That email and password do not match.'
                : error.message,
          };
        }
        const signedIn = sessionUser(data.session);
        if (!signedIn) return { ok: false, error: 'Could not start a session.' };
        setUser(signedIn);
        setAuthError(null);
        return { ok: true, emailed: false };
      } catch {
        return { ok: false, error: 'Could not reach the sign-in service. Try again.' };
      }
    },

    async sendLink(email, role, extra, intent = 'signup') {
      const clean = cleanEmail(email);
      if (!EMAIL_RE.test(clean)) return { ok: false, error: 'That does not look like an email address.' };

      if (AUTH_MODE === 'supabase') {
        try {
          const { getSupabase } = await import('./supabaseClient');
          const sb = await getSupabase();
          const { error } = await sb.auth.signInWithOtp({
            email: clean,
            options: {
              emailRedirectTo: authCallbackUrl(),
              // A sign-in link should not silently create an account for a typo.
              shouldCreateUser: intent !== 'signin',
              ...(intent === 'signup'
                ? {
                    data: {
                      role,
                      accountType: extra?.accountType ?? 'individual',
                      name: extra?.name,
                      phone: extra?.phone,
                      city: extra?.city,
                      orgName: extra?.orgName,
                      mcNumber: extra?.mcNumber,
                      usdotNumber: extra?.usdotNumber,
                    },
                  }
                : {}),
            },
          });
          if (error) return { ok: false, error: error.message };
          return { ok: true, emailed: true };
        } catch {
          return { ok: false, error: 'Could not reach the mail service. Try again.' };
        }
      }

      if (intent === 'signin') {
        const existing = readLocalAccount(clean);
        if (!existing) return { ok: false, error: 'No local account found for that email. Create an account first.' };
        writeLocalSession(existing);
        setUser(existing);
        setAuthError(null);
        return { ok: true, emailed: false };
      }

      if (readLocalAccount(clean)) return { ok: false, error: 'That email already has an account. Sign in instead.' };
      const localUser = createLocalUser(clean, role, extra);
      saveLocalAccount(localUser);
      writeLocalSession(localUser);
      setUser(localUser);
      setAuthError(null);
      return { ok: true, emailed: false };
    },

    async updateProfile(patch) {
      if (!user) return { ok: false, error: 'Not signed in.' };
      const next: User = { ...user, ...patch };

      if (AUTH_MODE === 'supabase') {
        try {
          const { getSupabase } = await import('./supabaseClient');
          const sb = await getSupabase();
          const { error } = await sb.auth.updateUser({
            data: {
              role: next.role,
              accountType: next.accountType,
              name: next.name,
              phone: next.phone,
              city: next.city,
              orgName: next.orgName,
              mcNumber: next.mcNumber,
              usdotNumber: next.usdotNumber,
            },
          });
          if (error) return { ok: false, error: error.message };
        } catch {
          return { ok: false, error: 'Could not save. Try again.' };
        }
      } else {
        saveLocalAccount(next);
        writeLocalSession(next);
      }

      setUser(next);
      return { ok: true };
    },

    async signInWithGoogle(role) {
      if (AUTH_MODE !== 'supabase') return { ok: false, error: 'Google sign-in needs Supabase keys.' };
      // Normally openAuth has already written this. The fallback makes the method
      // safe for a custom consumer that invokes it directly.
      if (!readAuthIntent()) saveAuthIntent(DEFAULT_AUTH_RETURN_TO, role);
      else if (role) saveAuthIntent(readAuthIntent(), role);
      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        try {
          for (const key of Object.keys(localStorage)) {
            if (key.startsWith('sb-') && key.includes('code-verifier')) localStorage.removeItem(key);
          }
        } catch { /* storage unavailable */ }
        const { error } = await sb.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: authCallbackUrl() },
        });
        if (error) {
          const notConfigured = /provider is not enabled|unsupported provider/i.test(error.message);
          return {
            ok: false,
            error: notConfigured
              ? 'Google sign-in is not available yet. Use your email instead.'
              : error.message,
          };
        }
        return { ok: true };
      } catch {
        return { ok: false, error: 'Could not reach Google. Try again.' };
      }
    },

    async signOut() {
      if (AUTH_MODE === 'supabase') {
        try {
          const { getSupabase } = await import('./supabaseClient');
          const sb = await getSupabase();
          await sb.auth.signOut();
        } catch {
          // Clear the local view even if the remote sign-out request is unavailable.
        }
      }
      clearLocalSession();
      clearAuthIntent();
      setUser(null);
    },
  }), [user, loading, authOpen, pendingRole, pendingAuthMode, authError]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(Ctx);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
