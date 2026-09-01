import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import AuthReturnRedirect from '../AuthReturnRedirect';
import * as AuthContextModule from '../AuthContext';
import { clearAuthIntent, saveAuthIntent } from '../authIntent';

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}{location.search}{location.hash}</div>;
}

describe('AuthReturnRedirect', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('consumes a callback intent after the restored user is available', async () => {
    saveAuthIntent('/lane/mem-chi?tab=bids');
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'usr_1', email: 'driver@example.com', role: 'carrier', accountType: 'individual',
        name: 'Driver', phone: '', city: '', createdAt: new Date().toISOString(),
      },
      loading: false,
      mode: 'supabase',
      authError: null,
      openAuth: vi.fn(),
      closeAuth: vi.fn(),
      authOpen: false,
      pendingRole: 'carrier',
      signUpWithPassword: vi.fn(),
      signInWithPassword: vi.fn(),
      sendLink: vi.fn(),
      updateProfile: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes><Route path="*" element={<><AuthReturnRedirect /><LocationProbe /></>} /></Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/lane/mem-chi?tab=bids'));
    expect(sessionStorage.getItem('overland.auth.intent.v1')).toBeNull();
    clearAuthIntent();
  });
});
