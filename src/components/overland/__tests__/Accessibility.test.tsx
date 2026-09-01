import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthDialog from '../AuthDialog';
import * as AuthContextModule from '@/auth/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Task 5 & 7 Accessibility Behavioral Test Suite', () => {
  it('renders AuthDialog with role="dialog", aria-modal="true", and aria-labelledby matching title ID', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      mode: 'supabase',
      authError: null,
      openAuth: vi.fn(),
      closeAuth: vi.fn(),
      authOpen: true,
      pendingRole: 'shipper',
      signUpWithPassword: vi.fn(),
      signInWithPassword: vi.fn(),
      sendLink: vi.fn(),
      updateProfile: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthDialog />
      </MemoryRouter>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBe('auth-dialog-title');
    expect(document.getElementById(titleId!)).toBeInTheDocument();
  });
});
