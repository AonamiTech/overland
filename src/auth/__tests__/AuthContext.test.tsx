import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import * as supabaseClientModule from '../supabaseClient';

function TestConsumer() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(auth.loading)}</div>
      <div data-testid="user">{auth.user ? auth.user.email : 'null'}</div>
      <div data-testid="error">{auth.authError ?? 'none'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
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

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as any);

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

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as any);

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

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue(mockSb as any);

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
