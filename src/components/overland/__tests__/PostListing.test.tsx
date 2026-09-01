import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostListing from '../PostListing';
import * as AuthContextModule from '@/auth/AuthContext';
import * as dbModule from '@/lib/db';

vi.mock('@/lib/db', async (importOriginal) => {
  const actual = await importOriginal<typeof dbModule>();
  return {
    ...actual,
    isLive: vi.fn(() => false),
    createListing: vi.fn(),
  };
});

describe('PostListing', () => {
  const LOCAL_KEY = 'overland.mylistings.v1';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const setupUser = (user: any = null) => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user,
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
  };

  const fillAndSubmitForm = () => {
    const fromSelect = screen.getByLabelText(/From/i);
    const toSelect = screen.getByLabelText(/To/i);

    fireEvent.change(fromSelect, { target: { value: 'MEM' } });
    fireEvent.change(toSelect, { target: { value: 'CHI' } });

    const submitBtn = screen.getByRole('button', { name: /Post this load/i });
    fireEvent.click(submitBtn);
  };

  it('1.1 live + signed in -> createListing called once with owner_id === user.id', async () => {
    vi.mocked(dbModule.isLive).mockReturnValue(true);
    vi.mocked(dbModule.createListing).mockResolvedValue({
      id: 'list_123',
      owner_id: 'usr_dana',
      kind: 'load',
      origin: 'Memphis, TN',
      origin_code: 'MEM',
      dest: 'Chicago, IL',
      dest_code: 'CHI',
      miles: 530,
      equipment: 'Dry van',
      ready_date: null,
      target_rate: null,
      notes: null,
      status: 'open',
      created_at: new Date().toISOString(),
    });

    setupUser({
      id: 'usr_dana',
      email: 'dana@example.com',
      role: 'shipper',
      accountType: 'company',
      name: 'Dana Whitfield',
      phone: '555-0199',
      city: 'Memphis, TN',
      createdAt: new Date().toISOString(),
    });

    render(<PostListing onClose={vi.fn()} />);

    fillAndSubmitForm();

    await waitFor(() => {
      expect(dbModule.createListing).toHaveBeenCalledTimes(1);
      expect(dbModule.createListing).toHaveBeenCalledWith(
        expect.objectContaining({
          owner_id: 'usr_dana',
          origin_code: 'MEM',
          dest_code: 'CHI',
        })
      );
    });

    expect(screen.getByText(/It is on the board/i)).toBeInTheDocument();
  });

  it('1.1 live + user === null -> createListing not called, error surfaced, localStorage untouched', async () => {
    vi.mocked(dbModule.isLive).mockReturnValue(true);

    setupUser(null);

    render(<PostListing onClose={vi.fn()} />);

    fillAndSubmitForm();

    await waitFor(() => {
      expect(dbModule.createListing).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(/Your session expired/i);
    });

    expect(localStorage.getItem(LOCAL_KEY)).toBeNull();
    expect(screen.queryByText(/It is on the board/i)).toBeNull();
  });

  it('1.1 not live -> writes to localStorage, createListing not called', async () => {
    vi.mocked(dbModule.isLive).mockReturnValue(false);

    setupUser(null);

    render(<PostListing onClose={vi.fn()} />);

    fillAndSubmitForm();

    await waitFor(() => {
      expect(dbModule.createListing).not.toHaveBeenCalled();
      expect(screen.getByText(/Saved on this device only/i)).toBeInTheDocument();
    });

    const localItems = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    expect(localItems.length).toBe(1);
    expect(localItems[0].origin_code).toBe('MEM');
    expect(localItems[0].dest_code).toBe('CHI');
  });

  it('1.1 createListing rejects -> error rendered, success screen not shown', async () => {
    vi.mocked(dbModule.isLive).mockReturnValue(true);
    vi.mocked(dbModule.createListing).mockRejectedValue(new Error('Database error: rate lock failed'));

    setupUser({
      id: 'usr_dana',
      email: 'dana@example.com',
      role: 'shipper',
      accountType: 'company',
      name: 'Dana Whitfield',
      phone: '555-0199',
      city: 'Memphis, TN',
      createdAt: new Date().toISOString(),
    });

    render(<PostListing onClose={vi.fn()} />);

    fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Database error: rate lock failed/i);
    });

    expect(screen.queryByText(/It is on the board/i)).toBeNull();
  });

  it('1.5 ready date input min equals today in YYYY-MM-DD format', () => {
    setupUser(null);
    render(<PostListing onClose={vi.fn()} />);

    const readyInput = screen.getByLabelText(/Ready/i) as HTMLInputElement;
    const todayStr = new Date().toISOString().slice(0, 10);

    expect(readyInput.min).toBe(todayStr);
  });
});
