import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import * as supabaseClientModule from '../supabaseClient';
import type { SupabaseLike } from '../supabaseClient';
import { clearAuthIntent, readAuthIntent } from '../authIntent';

let latestAuth: ReturnType<typeof useAuth> | null = null;

function TestConsumer() {
  const auth = useAuth();
  latestAuth = auth;
  return (
    <div>
      <div data-testid="loading">{String(auth.loading)}</div>
      <div data-testid="user">{auth.user ? auth.user.email : 'null'}</div>
      <div data-testid="user-name">{auth.user?.name ?? 'none'}</div>
      <div data-testid="user-role">{auth.user?.role ?? 'none'}</div>
      <div data-testid="error">{auth.authError ?? 'none'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    latestAuth = null;
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getSupabase() caches the promise so two concurrent callers get one client', async () => {
    const p1 = supabaseClientModule.getSupabase();
    const p2 = supabaseClientModule.getSupabase();
    expect(p1).toBe(p2);
    await p1;
  });

  it('implicit-flow tokens in the URL fragment call setSession and clear the hash', async () => {
    const mockSetSession = vi.fn().mockResolvedValue({ error: null });
    const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } });
    const mockOnAuthStateChange = vi.fn();

    const mockSb = {
      auth: {
        setSession: mockSetSession,
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
        exchangeCodeForSession: vi.fn(),
      },
    };

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);

    window.history.replaceState({}, '', '/#access_token=test_access&refresh_token=test_refresh');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockSetSession).toHaveBeenCalledWith({
        access_token: 'test_access',
        refresh_token: 'test_refresh',
      });
    });

    expect(window.location.hash).toBe('');
  });

  it('?code= calls exchangeCodeForSession and clears the code from URL search', async () => {
    const mockExchange = vi.fn().mockResolvedValue({ error: null });
    const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } });
    const mockOnAuthStateChange = vi.fn();

    const mockSb = {
      auth: {
        setSession: vi.fn(),
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
        exchangeCodeForSession: mockExchange,
      },
    };

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);

    window.history.replaceState({}, '', '/?code=auth_code_123');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockExchange).toHaveBeenCalledWith('auth_code_123');
    });

    expect(window.location.search).not.toContain('code=auth_code_123');
  });

  it('verifies token-hash email callbacks and removes the callback parameters', async () => {
    const verifyOtp = vi.fn().mockResolvedValue({ error: null });
    const mockSb = {
      auth: {
        verifyOtp,
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn(),
        exchangeCodeForSession: vi.fn(),
      },
    };
    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);

    window.history.replaceState({}, '', '/?token_hash=magic-token&type=magiclink&overland_return_to=%2Fboard');

    render(<AuthProvider><TestConsumer /></AuthProvider>);

    await waitFor(() => {
      expect(verifyOtp).toHaveBeenCalledWith({ token_hash: 'magic-token', type: 'magiclink' });
    });
    expect(window.location.search).toBe('');
  });

  it('maps a password sign-in session immediately, without waiting for an auth event', async () => {
    const signedIn = {
      user: {
        id: 'usr_password',
        email: 'driver@example.com',
        created_at: '2026-09-01T00:00:00.000Z',
        user_metadata: {
          role: 'carrier',
          accountType: 'company',
          name: 'Driver Example',
          phone: '+12145550148',
          city: 'Dallas, TX',
          usdotNumber: '1234567',
        },
      },
    };
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { session: signedIn }, error: null });
    const mockSb = {
      auth: {
        signInWithPassword,
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
    };
    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    const result = await latestAuth!.signInWithPassword(' DRIVER@EXAMPLE.COM ', 'a-real-password');
    expect(result).toEqual({ ok: true, emailed: false });
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'driver@example.com', password: 'a-real-password' });
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('driver@example.com');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Driver Example');
    });
  });

  it('maps an immediately returned signup session and preserves callback intent', async () => {
    const signedUp = {
      user: {
        id: 'usr_signup',
        email: 'new@example.com',
        user_metadata: { role: 'shipper', name: 'New User', city: 'Memphis, TN' },
      },
    };
    const signUp = vi.fn().mockResolvedValue({ data: { session: signedUp, user: signedUp.user }, error: null });
    const mockSb = {
      auth: {
        signUp,
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
    };
    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);
    window.history.replaceState({}, '', '/?overland_return_to=%2Flane%2Fmem-chi%3Ftab%3Dbids');

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(readAuthIntent()).toBe('/lane/mem-chi?tab=bids');

    const result = await latestAuth!.signUpWithPassword('new@example.com', 'a-real-password', 'shipper', {
      name: 'New User', city: 'Memphis, TN', phone: '+19015550148',
    });
    expect(result).toEqual({ ok: true, emailed: false });
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('new@example.com'));
    expect(signUp.mock.calls[0][0].options.emailRedirectTo).toContain('overland_return_to');
    clearAuthIntent();
  });

  it('cleans callback parameters and unsubscribes the auth listener on unmount', async () => {
    const unsubscribe = vi.fn();
    const mockSb = {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe } } }),
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);
    window.history.replaceState({}, '', '/?code=one-time-code&overland_return_to=%2Fboard#keep-me');

    const rendered = render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(mockSb.auth.exchangeCodeForSession).toHaveBeenCalledWith('one-time-code'));
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#keep-me');
    rendered.unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('uses the signup role carried through a Google callback when provider metadata is empty', async () => {
    const mockSb = {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: 'google_1', email: 'carrier@example.com', user_metadata: {} },
            },
          },
        }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);
    window.history.replaceState({}, '', '/?code=google-code&overland_return_to=%2Fboard&overland_role=carrier');

    render(<AuthProvider><TestConsumer /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('carrier@example.com');
      expect(screen.getByTestId('user-role')).toHaveTextContent('carrier');
    });
    expect(window.location.search).toBe('');
  });

  it('provider failure sets overland.google_broken in localStorage; session success clears it', async () => {
    const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } });

    const mockSb = {
      auth: {
        setSession: vi.fn(),
        getSession: mockGetSession,
        onAuthStateChange: vi.fn(),
        exchangeCodeForSession: vi.fn(),
      },
    };

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as unknown as SupabaseLike);

    window.history.replaceState({}, '', '/?error_description=Unable+to+exchange+external+code');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem('overland.google_broken')).toBe('1');
    });
    expect(screen.getByTestId('error').textContent).toContain('Google sign-in is temporarily unavailable');

    // Now test success clearing the flag
    const mockUserSession = {
      user: {
        id: 'usr_1',
        email: 'user@example.com',
        user_metadata: { role: 'shipper' },
      },
    };
    mockGetSession.mockResolvedValueOnce({ data: { session: mockUserSession } });

    window.history.replaceState({}, '', '/');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem('overland.google_broken')).toBeNull();
    });
  });
});
