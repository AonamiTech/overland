import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthDialog from '../AuthDialog';
import * as AuthContextModule from '@/auth/AuthContext';
import { clearAuthIntent, saveAuthIntent } from '@/auth/authIntent';

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}{location.search}{location.hash}</div>;
}

function setupAuth(overrides: Record<string, unknown> = {}) {
  const auth = {
    user: null,
    loading: false,
    mode: 'local' as const,
    authError: null,
    openAuth: vi.fn(),
    closeAuth: vi.fn(),
    authOpen: true,
    pendingRole: 'shipper' as const,
    pendingAuthMode: 'signin' as const,
    signUpWithPassword: vi.fn().mockResolvedValue({ ok: true, emailed: false }),
    signInWithPassword: vi.fn().mockResolvedValue({ ok: true, emailed: false }),
    sendLink: vi.fn().mockResolvedValue({ ok: true, emailed: false }),
    updateProfile: vi.fn(),
    signInWithGoogle: vi.fn().mockResolvedValue({ ok: true }),
    signOut: vi.fn(),
    ...overrides,
  };
  vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue(auth);
  return auth;
}

function renderDialog() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="*" element={<><AuthDialog /><LocationProbe /></>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AuthDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearAuthIntent();
    vi.restoreAllMocks();
  });

  it('opens directly in sign-in mode and keeps signup-only fields out of the form', () => {
    setupAuth({ pendingAuthMode: 'signin' });
    renderDialog();

    expect(screen.getByRole('heading', { name: 'Welcome back.' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Your name')).toBeNull();
    expect(screen.getByRole('button', { name: /^Sign in$/ })).toBeInTheDocument();
  });

  it('lets a visitor switch from sign-in to the complete signup form', () => {
    setupAuth({ pendingAuthMode: 'signin' });
    renderDialog();

    fireEvent.click(screen.getByRole('button', { name: /New here\? Create an account/i }));

    expect(screen.getByRole('heading', { name: 'Create your account.' })).toBeInTheDocument();
    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /I have a truck/i })).toBeInTheDocument();
  });

  it('signs in and returns to the page that opened the flow', async () => {
    const auth = setupAuth({
      pendingAuthMode: 'signin',
      mode: 'supabase',
      signInWithPassword: vi.fn().mockResolvedValue({ ok: true, emailed: false }),
    });
    saveAuthIntent('/lane/mem-chi?tab=bids');
    renderDialog();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'driver@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'a-real-password' } });
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/ }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/lane/mem-chi?tab=bids'));
    expect(auth.signInWithPassword).toHaveBeenCalledWith('driver@example.com', 'a-real-password');
    expect(auth.closeAuth).toHaveBeenCalled();
    expect(sessionStorage.getItem('overland.auth.intent.v1')).toBeNull();
  });

  it('shows a failed password sign-in without losing the form', async () => {
    setupAuth({
      signInWithPassword: vi.fn().mockResolvedValue({ ok: false, error: 'That email and password do not match.' }),
    });
    renderDialog();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'driver@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('That email and password do not match.');
    expect(screen.getByLabelText('Email')).toHaveValue('driver@example.com');
  });

  it('turns a provider failure into an actionable error and keeps Google available', async () => {
    setupAuth({
      mode: 'supabase',
      signInWithGoogle: vi.fn().mockResolvedValue({ ok: false, error: 'Google sign-in is not configured correctly yet. Check the Google OAuth client ID, secret, and Supabase callback URL, then try again.' }),
    });
    renderDialog();

    const google = screen.getByRole('button', { name: 'Continue with Google' });
    fireEvent.click(google);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Google sign-in is not configured correctly yet/i);
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
  });
});
