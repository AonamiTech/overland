import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BidderCard, { BidderInfo } from '../BidderCard';
import * as AuthContextModule from '@/auth/AuthContext';

describe('BidderCard', () => {
  const sampleBidder: BidderInfo = {
    name: 'Marcus Boone',
    accountType: 'individual',
    city: 'Memphis, TN',
    mcNumber: '1188402',
    usdotNumber: '3902118',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    rating: { avg: 4.8, count: 5, confirmed: 4, completion: 100 },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('hides bidder identity when user is signed out', () => {
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

    render(<BidderCard info={sampleBidder} />);

    expect(screen.getByText(/Carrier name, MC\/USDOT and safety record are visible to members/i)).toBeInTheDocument();
    const signInBtn = screen.getByRole('button', { name: /Sign in to see who bid/i });
    expect(signInBtn).toBeInTheDocument();

    fireEvent.click(signInBtn);
    expect(openAuthMock).toHaveBeenCalledWith('shipper');

    expect(screen.queryByText(/DOT 3902118/i)).toBeNull();
    expect(screen.queryByText(/FMCSA SAFER/i)).toBeNull();
  });

  it('shows DOT, MC, and SAFER link when user is signed in', () => {
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

    render(<BidderCard info={sampleBidder} />);

    expect(screen.queryByText(/Carrier name, MC\/USDOT and safety record are visible to members/i)).toBeNull();

    expect(screen.getByText(/DOT 3902118/i)).toBeInTheDocument();
    expect(screen.getByText(/MC 1188402/i)).toBeInTheDocument();

    const saferLink = screen.getByRole('link', { name: /FMCSA SAFER/i });
    expect(saferLink).toBeInTheDocument();
  });

  it('SAFER link prefers USDOT over MC', () => {
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

    const { rerender } = render(<BidderCard info={sampleBidder} />);

    const saferLinkBoth = screen.getByRole('link', { name: /FMCSA SAFER/i });
    expect(saferLinkBoth.getAttribute('href')).toContain('query_param=USDOT');
    expect(saferLinkBoth.getAttribute('href')).toContain('query_string=3902118');

    // Test with only MC number (no USDOT)
    const mcOnlyBidder: BidderInfo = {
      ...sampleBidder,
      usdotNumber: undefined,
    };

    rerender(<BidderCard info={mcOnlyBidder} />);
    const saferLinkMcOnly = screen.getByRole('link', { name: /FMCSA SAFER/i });
    expect(saferLinkMcOnly.getAttribute('href')).toContain('query_param=MC_MX');
    expect(saferLinkMcOnly.getAttribute('href')).toContain('query_string=1188402');
  });
});
