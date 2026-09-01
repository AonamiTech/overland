import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LaneDetail from '../LaneDetail';
import * as AuthContextModule from '@/auth/AuthContext';
import { Lane } from '@/lib/market';

describe('LaneDetail', () => {
  const sampleLane: Lane = {
    id: 'l_mem_chi',
    origin: 'Memphis, TN',
    originCode: 'MEM',
    dest: 'Chicago, IL',
    destCode: 'CHI',
    miles: 530,
    equipment: 'Dry van',
    tension: 1.0,
    history: [2.35, 2.38, 2.47],
    rpm: 2.47,
    prevRpm: 2.38,
    avgRpm: 2.35,
    linehaul: Math.round((530 * 2.47) / 5) * 5, // 1310
    loads: 5,
    bids: 12,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('linehaul arithmetic matches round(miles * rpm / 5) * 5 so breakdown does not contradict header', () => {
    // Verify pure invariant calculation
    const calculatedLinehaul = Math.round((sampleLane.miles * sampleLane.rpm) / 5) * 5;
    expect(sampleLane.linehaul).toBe(calculatedLinehaul);

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      mode: 'supabase',
      authError: null,
      openAuth: vi.fn(),
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

    render(<LaneDetail lane={sampleLane} onClose={vi.fn()} />);

    // Board rate in header should display $1,310
    const boardRateElements = screen.getAllByText('$1,310');
    expect(boardRateElements.length).toBeGreaterThan(0);
  });

  it('gates Accept behind authentication', () => {
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

    render(<LaneDetail lane={sampleLane} onClose={vi.fn()} />);

    // When signed out, accept buttons say "Sign in to accept →"
    const signInAcceptBtns = screen.getAllByRole('button', { name: /Sign in to accept →/i });
    expect(signInAcceptBtns.length).toBeGreaterThan(0);

    // Clicking it opens auth modal and does NOT show contact details
    fireEvent.click(signInAcceptBtns[0]);
    expect(openAuthMock).toHaveBeenCalledWith({
      mode: 'signin',
      role: 'shipper',
      returnTo: '/lane/mem-chi',
    });
    expect(screen.queryByText(/Introduced/i)).toBeNull();
    expect(screen.queryByText(/dispatch@/i)).toBeNull();
  });

  it('allows accepting bids and reveals contact details when signed in', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'usr_dana',
        email: 'dana@example.com',
        role: 'shipper',
        accountType: 'company',
        name: 'Dana Whitfield',
        phone: '555-0199',
        city: 'Memphis, TN',
        createdAt: new Date().toISOString(),
      },
      loading: false,
      mode: 'supabase',
      authError: null,
      openAuth: vi.fn(),
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

    render(<LaneDetail lane={sampleLane} onClose={vi.fn()} />);

    // When signed in, accept buttons say "Accept and connect →"
    const acceptBtns = screen.getAllByRole('button', { name: /Accept and connect →/i });
    expect(acceptBtns.length).toBeGreaterThan(0);

    // Clicking accept reveals connection details
    fireEvent.click(acceptBtns[0]);

    expect(screen.getByText(/Introduced/i)).toBeInTheDocument();
    expect(screen.getByText(/You and .* have each other’s details/i)).toBeInTheDocument();
    expect(screen.getByText(/dispatch@/i)).toBeInTheDocument();
  });
});
