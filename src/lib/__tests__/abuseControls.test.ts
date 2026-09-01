import { describe, it, expect, vi } from 'vitest';
import { fetchListings, boardCounts, fetchBids, reportContent } from '../db';
import * as supabaseClient from '@/auth/supabaseClient';

describe('Task 4 Abuse Controls & DB Filters', () => {
  it('reportContent returns ok: true when inserting into reports table', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSb = {
      from: vi.fn().mockReturnValue({
        insert: mockInsert,
      }),
    };
    vi.spyOn(supabaseClient, 'getSupabase').mockResolvedValue(mockSb as any);

    const res = await reportContent({
      reporterId: 'usr_1',
      subjectType: 'listing',
      subjectId: 'lst_123',
      reason: 'Suspicious fake load',
    });

    expect(res.ok).toBe(true);
    expect(mockSb.from).toHaveBeenCalledWith('reports');
    expect(mockInsert).toHaveBeenCalledWith({
      reporter_id: 'usr_1',
      subject_type: 'listing',
      subject_id: 'lst_123',
      reason: 'Suspicious fake load',
    });

    vi.restoreAllMocks();
  });

  it('fetchListings filters out hidden: false and expires_at in SQL query when live', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq1 = vi.fn().mockReturnThis();
    const mockEq2 = vi.fn().mockReturnThis();
    const mockGt = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });

    const mockSb = {
      from: vi.fn().mockReturnValue({
        select: mockSelect,
        eq: mockEq1,
        gt: mockGt,
        order: mockOrder,
      }),
    };

    // Chain setup
    mockSelect.mockReturnValue({ eq: mockEq1 });
    mockEq1.mockReturnValue({ eq: mockEq2 });
    mockEq2.mockReturnValue({ gt: mockGt });
    mockGt.mockReturnValue({ order: mockOrder });

    vi.spyOn(supabaseClient, 'getSupabase').mockResolvedValue(mockSb as any);

    const origUrl = import.meta.env.VITE_SUPABASE_URL;
    const origKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    (import.meta.env as any).VITE_SUPABASE_URL = 'https://fake.supabase.co';
    (import.meta.env as any).VITE_SUPABASE_ANON_KEY = 'fake-key';

    try {
      await fetchListings();
      expect(mockSb.from).toHaveBeenCalledWith('listings');
      expect(mockEq1).toHaveBeenCalledWith('status', 'open');
      expect(mockEq2).toHaveBeenCalledWith('hidden', false);
      expect(mockGt).toHaveBeenCalledWith('expires_at', expect.any(String));
    } finally {
      (import.meta.env as any).VITE_SUPABASE_URL = origUrl;
      (import.meta.env as any).VITE_SUPABASE_ANON_KEY = origKey;
      vi.restoreAllMocks();
    }
  });

  it('fetchBids filters out hidden bids when live', async () => {
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq1 = vi.fn().mockReturnThis();
    const mockEq2 = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });

    const mockSb = {
      from: vi.fn().mockReturnValue({
        select: mockSelect,
        eq: mockEq1,
        order: mockOrder,
      }),
    };

    mockSelect.mockReturnValue({ eq: mockEq1 });
    mockEq1.mockReturnValue({ eq: mockEq2 });
    mockEq2.mockReturnValue({ order: mockOrder });

    vi.spyOn(supabaseClient, 'getSupabase').mockResolvedValue(mockSb as any);

    const origUrl = import.meta.env.VITE_SUPABASE_URL;
    const origKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    (import.meta.env as any).VITE_SUPABASE_URL = 'https://fake.supabase.co';
    (import.meta.env as any).VITE_SUPABASE_ANON_KEY = 'fake-key';

    try {
      await fetchBids('lst_123');
      expect(mockSb.from).toHaveBeenCalledWith('bids');
      expect(mockEq1).toHaveBeenCalledWith('listing_id', 'lst_123');
      expect(mockEq2).toHaveBeenCalledWith('hidden', false);
    } finally {
      (import.meta.env as any).VITE_SUPABASE_URL = origUrl;
      (import.meta.env as any).VITE_SUPABASE_ANON_KEY = origKey;
      vi.restoreAllMocks();
    }
  });
});
