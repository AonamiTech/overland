import { describe, it, expect } from 'vitest';
import { getSupabase } from '@/auth/supabaseClient';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const isRealSupabase = Boolean(url && !url.includes('fake'));

describe.skipIf(!isRealSupabase)('db policies (integration)', () => {
  it('owner bidding on own listing rejects', async () => {
    const sb = (await getSupabase()) as any;
    // Integration test with real Supabase instance
    const { data: listing, error: lErr } = await sb.from('listings').insert({
      owner_id: 'owner_user_id',
      kind: 'load',
      origin: 'Memphis, TN',
      origin_code: 'MEM',
      dest: 'Chicago, IL',
      dest_code: 'CHI',
      miles: 530,
      equipment: 'Dry van',
      status: 'open',
    }).select().single();

    if (lErr) throw lErr;

    // Owner tries to bid on own listing
    const { error: bErr } = await sb.from('bids').insert({
      listing_id: listing.id,
      bidder_id: 'owner_user_id',
      amount: 1200,
      status: 'open',
    });

    expect(bErr).not.toBeNull();
  });

  it('a bidder can delete their own bid; a stranger cannot', async () => {
    const sb = (await getSupabase()) as any;
    const { data: bid, error: bErr } = await sb.from('bids').insert({
      listing_id: 'some_listing_id',
      bidder_id: 'bidder_user_id',
      amount: 1300,
      status: 'open',
    }).select().single();

    if (bErr) throw bErr;

    // Stranger attempts delete
    const { error: strangerErr } = await sb.from('bids').delete().eq('id', bid.id).eq('bidder_id', 'stranger_id');
    expect(strangerErr).not.toBeNull();

    // Bidder deletes own bid
    const { error: deleteErr } = await sb.from('bids').delete().eq('id', bid.id);
    expect(deleteErr).toBeNull();
  });

  it('amount <= 0 and > 1_000_000 rejected', async () => {
    const sb = (await getSupabase()) as any;

    const { error: errZero } = await sb.from('bids').insert({
      listing_id: 'some_listing',
      bidder_id: 'some_bidder',
      amount: 0,
    });
    expect(errZero).not.toBeNull();

    const { error: errTooHigh } = await sb.from('bids').insert({
      listing_id: 'some_listing',
      bidder_id: 'some_bidder',
      amount: 1_000_001,
    });
    expect(errTooHigh).not.toBeNull();
  });

  it('notes over 500 chars rejected', async () => {
    const sb = (await getSupabase()) as any;
    const longNote = 'a'.repeat(501);

    const { error } = await sb.from('bids').insert({
      listing_id: 'some_listing',
      bidder_id: 'some_bidder',
      amount: 1200,
      note: longNote,
    });
    expect(error).not.toBeNull();
  });

  it('a user cannot rate themselves', async () => {
    const sb = (await getSupabase()) as any;

    const { error } = await sb.from('ratings').insert({
      deal_id: 'deal_123',
      rater_id: 'user_a',
      ratee_id: 'user_a',
      stars: 5,
    });
    expect(error).not.toBeNull();
  });
});
