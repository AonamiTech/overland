import { describe, it, expect, vi, beforeEach } from 'vitest';
import { boardCounts, isLive } from '../db';
import * as supabaseClientModule from '@/auth/supabaseClient';

describe('boardCounts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when not live', async () => {
    vi.spyOn(supabaseClientModule, 'getSupabase').mockImplementation(() => {
      throw new Error('Should not be called when not live');
    });

    // Mock isLive to return false
    const isLiveSpy = vi.spyOn(await import('../db'), 'isLive').mockReturnValue(false);

    const counts = await boardCounts();
    expect(counts).toBeNull();
  });

  it('uses head: true, count: exact so no rows cross the wire when live', async () => {
    const selectListingsSpy = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ count: 14, error: null }),
    });
    const selectBidsSpy = vi.fn().mockResolvedValue({ count: 42, error: null });

    const fromSpy = vi.fn((table: string) => {
      if (table === 'listings') return { select: selectListingsSpy };
      if (table === 'bids') return { select: selectBidsSpy };
      return {};
    });

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue({
      from: fromSpy,
    } as any);

    vi.spyOn(await import('../db'), 'isLive').mockReturnValue(true);

    const result = await boardCounts();

    expect(result).toEqual({ loads: 14, bids: 42 });

    expect(selectListingsSpy).toHaveBeenCalledWith('id', { count: 'exact', head: true });
    expect(selectBidsSpy).toHaveBeenCalledWith('id', { count: 'exact', head: true });
  });

  it('resolves to null rather than rejecting when a query throws', async () => {
    const fromSpy = vi.fn().mockImplementation(() => {
      throw new Error('Network error connecting to Supabase');
    });

    vi.spyOn(supabaseClientModule, 'getSupabase').mockResolvedValue({
      from: fromSpy,
    } as any);

    vi.spyOn(await import('../db'), 'isLive').mockReturnValue(true);

    const result = await boardCounts();
    expect(result).toBeNull();
  });
});
