import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HeroDirect from '../HeroDirect';
import BookCards from '../BookCards';
import * as AuthContextModule from '@/auth/AuthContext';
import fs from 'fs';
import path from 'path';

describe('1.6 Market Rates Label Guard', () => {
  const mockAuth = {
    user: null,
    loading: false,
    mode: 'supabase' as const,
    authError: null,
    openAuth: vi.fn(),
    closeAuth: vi.fn(),
    authOpen: false,
    pendingRole: 'shipper' as const,
    signUpWithPassword: vi.fn(),
    signInWithPassword: vi.fn(),
    sendLink: vi.fn(),
    updateProfile: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  };

  it('HeroDirect labels national average rate as Indicative, never live', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue(mockAuth);

    render(
      <MemoryRouter>
        <HeroDirect />
      </MemoryRouter>
    );

    expect(screen.getByText(/Indicative/i)).toBeInTheDocument();
    expect(screen.getByText(/Modelled from miles and equipment, not live transactions/i)).toBeInTheDocument();
    expect(screen.queryByText(/^live$/i)).toBeNull();
  });

  it('BookCards does not badge modelled rates as live', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue(mockAuth);

    render(
      <MemoryRouter>
        <BookCards />
      </MemoryRouter>
    );

    expect(screen.queryByText(/^live$/i)).toBeNull();
    expect(screen.queryByText(/live rates/i)).toBeNull();
  });

  it('grep guard: HeroDirect.tsx and BookCards.tsx source files do not label modelled rates as live', () => {
    const heroPath = path.resolve(import.meta.dirname, '../HeroDirect.tsx');
    const bookPath = path.resolve(import.meta.dirname, '../BookCards.tsx');

    const heroSource = fs.readFileSync(heroPath, 'utf8');
    const bookSource = fs.readFileSync(bookPath, 'utf8');

    // Ensure neither file badges rate figures with "live" text
    expect(heroSource).not.toMatch(/Live rate/i);
    expect(heroSource).not.toMatch(/>\s*Live\s*</i);
    expect(bookSource).not.toMatch(/Live rate/i);
    expect(bookSource).not.toMatch(/>\s*Live\s*</i);
  });
});
