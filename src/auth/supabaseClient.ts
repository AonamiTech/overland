/**
 * Lazily-created Supabase client.
 *
 * Imported dynamically from AuthContext so the SDK is only pulled into the bundle
 * when the keys actually exist. In local mode this module is never loaded.
 */
type SupabaseLike = {
  auth: {
    getSession(): Promise<{ data: { session: null | { user: { id: string; email?: string; created_at?: string; user_metadata?: Record<string, unknown> } } } }>;
    onAuthStateChange(cb: (event: string, session: null | { user: { id: string; email?: string; created_at?: string; user_metadata?: Record<string, unknown> } }) => void): unknown;
    signInWithOtp(args: { email: string; options?: Record<string, unknown> }): Promise<{ error: { message: string } | null }>;
    signUp(args: { email: string; password: string; options?: Record<string, unknown> }): Promise<{
      data: { session: unknown | null; user: unknown | null };
      error: { message: string } | null;
    }>;
    signInWithPassword(args: { email: string; password: string }): Promise<{
      data: { session: unknown | null };
      error: { message: string } | null;
    }>;
    signOut(): Promise<unknown>;
    signInWithOAuth(args: { provider: string; options?: Record<string, unknown> }): Promise<{ error: { message: string } | null }>;
    exchangeCodeForSession(code: string): Promise<{ error: { message: string } | null }>;
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
  if (!pending) pending = create();
  return pending;
}

async function create(): Promise<SupabaseLike> {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const mod = await import('@supabase/supabase-js');
  // Explicit rather than relying on defaults: detectSessionInUrl is what turns the
  // ?code= on the OAuth return into a session, and pkce is the flow Supabase issues.
  // If either is wrong the redirect lands silently signed-out.
  return mod.createClient(url, key, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
    },
  }) as SupabaseLike;
}
