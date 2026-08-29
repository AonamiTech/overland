import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { events } from '@/lib/analytics';

/**
 * Email-only auth for the Overland board.
 *
 * The product's whole verification promise is "we check the email is real, nothing
 * else" - so there are no passwords here by design. You enter an email, you get a
 * link, you click it, you are on the board. Everything past that (authority,
 * insurance, whether the other party is who they say) is explicitly the user's job.
 *
 * TWO BACKENDS behind one interface:
 *
 *  - supabase  : real magic-link email. Used when VITE_SUPABASE_URL and
 *                VITE_SUPABASE_ANON_KEY are set. This is what ships.
 *  - local     : localStorage only, NO EMAIL IS SENT. Used when the keys are absent
 *                so the app still runs for development. The UI must say so out loud -
 *                a "check your inbox" screen that never sends is worse than no auth.
 *
 * `mode` is exported so the UI can be honest about which one is live.
 */

export type Role = 'shipper' | 'carrier';
/** Shown next to every listing - it changes who you think you are dealing with. */
export type AccountType = 'individual' | 'company';

export type User = {
  id: string;
  email: string;
  role: Role;
  accountType: AccountType;
  /** Shown to a counterparty once a bid is accepted - the introduction is the
   *  product, so these are collected up front rather than chased later. */
  name: string;
  phone: string;
  city: string;
  orgName?: string;
  /** Carriers only. Self-declared, never checked by us - shown so counterparties
   *  can look it up on the FMCSA register themselves. */
  mcNumber?: string;
  usdotNumber?: string;
  createdAt: string;
};

export type AuthMode = 'supabase' | 'local';

/* Flat rather than a discriminated union: the union does not narrow reliably
   through the useMemo-typed context, and the call site is one branch anyway. */
export type SendResult = { ok: boolean; emailed?: boolean; error?: string };

/** Profile fields collected at signup and written to user_metadata. */
export type SignUpExtra = {
  name?: string; phone?: string; city?: string;
  accountType?: AccountType; orgName?: string;
  mcNumber?: string; usdotNumber?: string;
};

type AuthValue = {
  user: User | null;
  loading: boolean;
  mode: AuthMode;
  /** Set when session restore or an OAuth callback failed. Shown to the user. */
  authError: string | null;
  /** Create an account with a password. May or may not sign you in - see the result. */
  signUpWithPassword(email: string, password: string, role: Role, extra?: SignUpExtra): Promise<SendResult>;
  signInWithPassword(email: string, password: string): Promise<SendResult>;
  /** Sends a magic link (supabase) or signs in immediately (local). */
  sendLink(email: string, role: Role, extra?: SignUpExtra): Promise<SendResult>;
  /** Patch the signed-in user's own profile. Signup metadata is only applied when the
   *  user row is first created, so anything set later must go through here. */
  updateProfile(patch: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<{ ok: boolean; error?: string }>;
  /** Google OAuth. Sends no email, so it is unaffected by the magic-link rate limit -
   *  and it is the lower-friction path for most people. */
  signInWithGoogle(): Promise<{ ok: boolean; error?: string }>;
  signOut(): Promise<void>;
  /** Opens the auth modal. `role` preselects the tab. */
  openAuth(role?: Role): void;
  closeAuth(): void;
  authOpen: boolean;
  pendingRole: Role;
};

const STORAGE_KEY = 'overland.session.v1';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const AUTH_MODE: AuthMode = SUPABASE_URL && SUPABASE_KEY ? 'supabase' : 'local';

/**
 * Clear stale PKCE code verifiers before starting a new OAuth flow.
 *
 * supabase-js writes a verifier per flow. An abandoned attempt - the user closes the
 * Google tab, or the redirect never lands - leaves its verifier behind forever, and
 * they accumulate across retries. On return the exchange then has to pick one out of a
 * pile of stale entries, fails, and the whole thing dies silently with the user simply
 * still signed out. Starting a flow means any earlier one is dead, so drop them.
 */
/** Build and persist the local-mode user. Shared by the magic-link and password paths
 *  so neither has to reach for `this`, which breaks the moment the context is
 *  destructured - which every consumer does. */
function makeLocalUser(email: string, role: Role, extra?: SignUpExtra): User {
  const u: User = {
    id: `local-${email}`,
    email,
    role,
    accountType: extra?.accountType ?? 'individual',
    name: extra?.name ?? '',
    phone: extra?.phone ?? '',
    city: extra?.city ?? '',
    orgName: extra?.orgName,
    mcNumber: extra?.mcNumber,
    usdotNumber: extra?.usdotNumber,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  return u;
}

function clearStaleVerifiers() {
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('sb-') && k.includes('code-verifier')) localStorage.removeItem(k);
    }
  } catch {
    /* storage unavailable (private mode, blocked cookies) - the flow can still work */
  }
}

const Ctx = createContext<AuthValue | null>(null);

function readStored(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role>('shipper');
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore session before anything renders a guarded route, so an authenticated
  // user never sees a flash of the signed-out state.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (AUTH_MODE === 'supabase') {
        try {
          const { getSupabase } = await import('./supabaseClient');
          const sb = await getSupabase();

          /* Email links - confirmation, magic link, recovery - come back on the
             implicit flow: the tokens arrive in the URL *fragment*, not as a ?code=.
             flowType:'pkce' is right for the Google button but makes the client look
             only for a code, so those links landed on a signed-out page with a valid
             session sitting unread in the address bar. Handle the hash ourselves. */
          const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
          const access_token = hash.get('access_token');
          const refresh_token = hash.get('refresh_token');
          if (access_token && refresh_token) {
            const { error } = await sb.auth.setSession({ access_token, refresh_token });
            if (error && !cancelled) setAuthError(`Could not finish signing you in: ${error.message}`);
            // Strip the tokens so they are not left in history or a shared URL.
            window.history.replaceState({}, '', window.location.pathname + window.location.search);
          }

          /* A failed provider hand-off comes back as ?error=...&error_description=...
             in the QUERY STRING, while an expired or reused link puts the same fields
             in the FRAGMENT. Only the fragment was being read, so the whole class of
             "Google could not be exchanged" failures landed on a silent signed-out
             page - the single worst outcome, because there is nothing to react to. */
          const search = new URLSearchParams(window.location.search);
          const oauthError = search.get('error_description') || hash.get('error_description');
          const oauthCode = search.get('error_code') || hash.get('error_code');
          if (oauthError) {
            const plain = decodeURIComponent(oauthError.replace(/\+/g, ' '));
            if (!cancelled) {
              // "Unable to exchange external code" is Supabase telling us its own
              // credentials for the provider are wrong. Nothing the visitor can do
              // about it, so say who has to fix it rather than blaming their attempt.
              const providerBroken = /unable to exchange external code|unsupported provider|provider is not enabled/i.test(plain);
              if (providerBroken) {
                /* Supabase could not trade Google's code for tokens — its provider
                   credentials are wrong. The visitor cannot fix that and should not be
                   offered the button again on this device until it works. */
                try { localStorage.setItem('overland.google_broken', '1'); } catch { /* private mode */ }
              }
              setAuthError(
                providerBroken
                  ? 'Google sign-in is temporarily unavailable. Use your email and password — it takes a moment and works the same.'
                  : plain,
              );
            }
            events.authFailed(oauthCode ?? 'oauth_error', plain);
            window.history.replaceState({}, '', window.location.pathname);
          }

          // detectSessionInUrl normally handles this, but doing it explicitly means an
          // OAuth failure produces a message rather than a shrug.
          const code = new URLSearchParams(window.location.search).get('code');
          if (code) {
            const { error } = await sb.auth.exchangeCodeForSession(code);
            if (error && !/both auth code and code verifier|already/i.test(error.message)) {
              if (!cancelled) setAuthError(`Google sign-in did not complete: ${error.message}`);
            }
            // Clear the code either way so a refresh does not retry a spent one.
            const clean = new URL(window.location.href);
            clean.searchParams.delete('code');
            window.history.replaceState({}, '', clean.pathname + clean.search + clean.hash);
          }

          const { data } = await sb.auth.getSession();
          const s = data.session;
          if (s?.user) {
            // A working round trip clears the flag, so fixing the provider needs no redeploy.
            try { localStorage.removeItem('overland.google_broken'); } catch { /* ignore */ }
          }
          if (!cancelled && s?.user) {
            const m = (s.user.user_metadata ?? {}) as Record<string, string>;
            setUser({
              id: s.user.id,
              email: s.user.email ?? '',
              role: (m.role as Role) ?? 'shipper',
              accountType: (m.accountType as AccountType) ?? 'individual',
              name: m.name ?? '', phone: m.phone ?? '', city: m.city ?? '',
              orgName: m.orgName,
              mcNumber: m.mcNumber,
              usdotNumber: m.usdotNumber,
              createdAt: s.user.created_at ?? new Date().toISOString(),
            });
          }
          sb.auth.onAuthStateChange((_e, session) => {
            if (!session?.user) return setUser(null);
            const m = (session.user.user_metadata ?? {}) as Record<string, string>;
            setUser({
              id: session.user.id,
              email: session.user.email ?? '',
              role: (m.role as Role) ?? 'shipper',
              accountType: (m.accountType as AccountType) ?? 'individual',
              name: m.name ?? '', phone: m.phone ?? '', city: m.city ?? '',
              orgName: m.orgName,
              mcNumber: m.mcNumber,
              usdotNumber: m.usdotNumber,
              createdAt: session.user.created_at ?? new Date().toISOString(),
            });
          });
        } catch (e) {
          // Never swallow this. A silent failure here looks identical to "nothing
          // happened" from the user's side, which is the worst possible outcome
          // immediately after they came back from Google.
          if (!cancelled) setAuthError(e instanceof Error ? e.message : 'Could not restore your session.');
        }
      } else if (!cancelled) {
        setUser(readStored());
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    loading,
    mode: AUTH_MODE,
    authOpen,
    pendingRole,
    authError,
    openAuth: (role) => { if (role) setPendingRole(role); setAuthOpen(true); },
    closeAuth: () => setAuthOpen(false),

    async signUpWithPassword(email, password, role, extra) {
      const clean = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) {
        return { ok: false, error: 'That does not look like an email address.' };
      }
      if (password.length < 8) return { ok: false, error: 'Use at least 8 characters.' };

      if (AUTH_MODE !== 'supabase') {
        // Local mode has no server to hash against, so the password is not persisted -
        // it would be plaintext in localStorage, which is worse than not having it.
        setUser(makeLocalUser(clean, role, extra));
        return { ok: true, emailed: false };
      }

      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        const { data, error } = await sb.auth.signUp({
          email: clean,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              role,
              accountType: extra?.accountType ?? 'individual',
              name: extra?.name, phone: extra?.phone, city: extra?.city,
              orgName: extra?.orgName,
              mcNumber: extra?.mcNumber, usdotNumber: extra?.usdotNumber,
            },
          },
        });
        if (error) {
          const exists = /already registered|already exists|user already/i.test(error.message);
          return { ok: false, error: exists ? 'That email already has an account. Sign in instead.' : error.message };
        }
        // With "Confirm email" on, signUp returns a user but no session - the account
        // exists and is unusable until the link is clicked. Distinguishing the two is
        // the difference between "you are in" and "go check your inbox".
        if (data.session) return { ok: true, emailed: false };
        return { ok: true, emailed: true };
      } catch {
        return { ok: false, error: 'Could not reach the sign-up service. Try again.' };
      }
    },

    async signInWithPassword(email, password) {
      const clean = email.trim().toLowerCase();
      if (AUTH_MODE !== 'supabase') return { ok: false, error: 'Password sign-in needs Supabase keys.' };
      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        const { data, error } = await sb.auth.signInWithPassword({ email: clean, password });
        if (error) {
          // Never say which half was wrong: that turns the form into a way to test
          // whether a given email has an account here.
          const bad = /invalid login credentials/i.test(error.message);
          const unconfirmed = /email not confirmed/i.test(error.message);
          return {
            ok: false,
            error: unconfirmed ? 'Confirm your email first - check your inbox for the link.'
                 : bad ? 'That email and password do not match.'
                 : error.message,
          };
        }
        return { ok: Boolean(data.session), error: data.session ? undefined : 'Could not start a session.' };
      } catch {
        return { ok: false, error: 'Could not reach the sign-in service. Try again.' };
      }
    },

    async sendLink(email, role, extra) {
      const clean = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) {
        return { ok: false, error: 'That does not look like an email address.' };
      }

      if (AUTH_MODE === 'supabase') {
        try {
          const { getSupabase } = await import('./supabaseClient');
          const sb = await getSupabase();
          const { error } = await sb.auth.signInWithOtp({
            email: clean,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                role,
                accountType: extra?.accountType ?? 'individual',
                name: extra?.name, phone: extra?.phone, city: extra?.city,
                orgName: extra?.orgName,
                mcNumber: extra?.mcNumber, usdotNumber: extra?.usdotNumber,
              },
            },
          });
          if (error) return { ok: false, error: error.message };
          return { ok: true, emailed: true };
        } catch {
          return { ok: false, error: 'Could not reach the mail service. Try again.' };
        }
      }

      // Local mode: no email leaves the browser. Sign in directly and let the UI say so.
      const u: User = {
        id: `local-${clean}`,
        email: clean,
        role,
        accountType: extra?.accountType ?? 'individual',
        name: extra?.name ?? '',
        phone: extra?.phone ?? '',
        city: extra?.city ?? '',
        orgName: extra?.orgName,
        mcNumber: extra?.mcNumber,
        usdotNumber: extra?.usdotNumber,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }

      setUser(next);
      return { ok: true };
    },

    async signInWithGoogle() {
      if (AUTH_MODE !== 'supabase') return { ok: false, error: 'Google sign-in needs Supabase keys.' };
      try {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        clearStaleVerifiers();
        const { error } = await sb.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/` },
        });
        if (error) {
          // "Unsupported provider: provider is not enabled" is a config message aimed at
          // us, not the person trying to sign in. Say something they can act on.
          const notConfigured = /provider is not enabled|unsupported provider/i.test(error.message);
          return {
            ok: false,
            error: notConfigured
              ? 'Google sign-in is not available yet. Use your email instead.'
              : error.message,
          };
        }
        return { ok: true };   // browser navigates away to Google
      } catch {
        return { ok: false, error: 'Could not reach Google. Try again.' };
      }
    },

    async signOut() {
      if (AUTH_MODE === 'supabase') {
        const { getSupabase } = await import('./supabaseClient');
        const sb = await getSupabase();
        await sb.auth.signOut();
      }
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    },
  }), [user, loading, authOpen, pendingRole]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
