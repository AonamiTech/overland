import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireAuth from '../RequireAuth';
import * as AuthContextModule from '../AuthContext';

describe('RequireAuth', () => {
  it('holds render while loading and does not flash signed-out state or redirect', () => {
    const openAuthMock = vi.fn();

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      loading: true,
      mode: 'supabase',
      authError: null,
      openAuth: openAuthMock,
      closeAuth: vi.fn(),
      authOpen: false,
      pendingRole: 'shipper',
      signUpWithPassword: vi.fn(),
      signInWithPassword: vi.fn(),
      sendLink: vi.fn(),
      updateProfile: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/board']}>
        <Routes>
          <Route path="/" element={<div data-testid="home">Home Page</div>} />
          <Route
            path="/board"
            element={
              <RequireAuth>
                <div data-testid="protected-content">Protected Board Content</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Protected content should NOT be rendered
    expect(screen.queryByTestId('protected-content')).toBeNull();
    // Home page should NOT be rendered (no redirect while loading)
    expect(screen.queryByTestId('home')).toBeNull();
    // openAuth should NOT be called while loading
    expect(openAuthMock).not.toHaveBeenCalled();
    // Loading spinner/bg div rendered
    expect(container.querySelector('.min-h-screen')).not.toBeNull();
  });

  it('redirects to / and opens auth once loading resolves and user is null', () => {
    const openAuthMock = vi.fn();

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      mode: 'supabase',
      authError: null,
      openAuth: openAuthMock,
      closeAuth: vi.fn(),
      authOpen: false,
      pendingRole: 'shipper',
      signUpWithPassword: vi.fn(),
      signInWithPassword: vi.fn(),
      sendLink: vi.fn(),
      updateProfile: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/board']}>
        <Routes>
          <Route path="/" element={<div data-testid="home">Home Page</div>} />
          <Route
            path="/board"
            element={
              <RequireAuth>
                <div data-testid="protected-content">Protected Board Content</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to Home
    expect(screen.getByTestId('home')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(openAuthMock).toHaveBeenCalledTimes(1);
  });

  it('renders children when loading is resolved and user is authenticated', () => {
    const openAuthMock = vi.fn();

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'usr_123',
        email: 'marcus@example.com',
        role: 'carrier',
        accountType: 'individual',
        name: 'Marcus Boone',
        phone: '555-0100',
        city: 'Memphis, TN',
        createdAt: new Date().toISOString(),
      },
      loading: false,
      mode: 'supabase',
      authError: null,
      openAuth: openAuthMock,
      closeAuth: vi.fn(),
      authOpen: false,
      pendingRole: 'shipper',
      signUpWithPassword: vi.fn(),
      signInWithPassword: vi.fn(),
      sendLink: vi.fn(),
      updateProfile: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/board']}>
        <Routes>
          <Route path="/" element={<div data-testid="home">Home Page</div>} />
          <Route
            path="/board"
            element={
              <RequireAuth>
                <div data-testid="protected-content">Protected Board Content</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('home')).toBeNull();
    expect(openAuthMock).not.toHaveBeenCalled();
  });
});
