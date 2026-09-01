import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabaseConfig';

/**
 * Lazily-created Supabase client. The public production configuration lives in
 * supabaseConfig.ts so browser deployments do not depend on build-time env vars.
 */
export type SupabaseUserLike = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSessionLike = {
  user: SupabaseUserLike;
};

type AuthSubscription = {
  data?: { subscription?: { unsubscribe(): void } };
  unsubscribe?: () => void;
};

export type SupabaseLike = {
  auth: {
    getSession(): Promise<{ data: { session: SupabaseSessionLike | null }; error?: { message: string } | null }>;
    onAuthStateChange(cb: (event: string, session: SupabaseSessionLike | null) => void): AuthSubscription;
    signInWithOtp(args: { email: string; options?: Record<string, unknown> }): Promise<{ error: { message: string } | null }>;
    signUp(args: { email: string; password: string; options?: Record<string, unknown> }): Promise<{
      data: { session: SupabaseSessionLike | null; user: SupabaseUserLike | null };
      error: { message: string } | null;
    }>;
    signInWithPassword(args: { email: string; password: string }): Promise<{
      data: { session: SupabaseSessionLike | null };
      error: { message: string } | null;
    }>;
    signOut(): Promise<unknown>;
    signInWithOAuth(args: { provider: string; options?: Record<string, unknown> }): Promise<{ error: { message: string } | null }>;
    exchangeCodeForSession(code: string): Promise<{ error: { message: string } | null }>;
    verifyOtp(args: { token_hash: string; type: string }): Promise<{ error: { message: string } | null }>;
    setSession(args: { access_token: string; refresh_token: string }): Promise<{ error: { message: string } | null }>;
    updateUser(args: { data: Record<string, unknown> }): Promise<{ error: { message: string } | null }>;
  };
};

/* Cache the promise, not the resolved client. Caching the client still lets two
   concurrent callers both get past the null check while the first is awaiting the
   dynamic import, and each then builds its own GoTrueClient on the same storage key -
   which the SDK warns about and which makes session handling non-deterministic. */
let pending: Promise<SupabaseLike> | null = null;

export function getSupabase(): Promise<SupabaseLike> {
  if (!pending) {
    // A transient import/network failure should not poison the client for the rest
    // of the tab. A later auth attempt can retry the lazy initialization.
    pending = create().catch((error) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

async function create(): Promise<SupabaseLike> {
  const mod = await import('@supabase/supabase-js');
  // AuthContext owns callback parsing so it can report provider failures and clean
  // every auth parameter. Leaving automatic URL detection on would make Supabase
  // race the explicit PKCE exchange and turn a useful error into a silent redirect.
  return mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: false,
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
    },
  }) as SupabaseLike;
}
