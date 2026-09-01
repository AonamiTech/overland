import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const testUrl = process.env.SUPABASE_TEST_URL;
const testAnonKey = process.env.SUPABASE_TEST_ANON_KEY;
const user1Email = process.env.SUPABASE_TEST_USER1_EMAIL;
const user1Pass = process.env.SUPABASE_TEST_USER1_PASS;
const user2Email = process.env.SUPABASE_TEST_USER2_EMAIL;
const user2Pass = process.env.SUPABASE_TEST_USER2_PASS;

const isConfigured = Boolean(testUrl && testAnonKey && user1Email && user1Pass && user2Email && user2Pass);

describe('db policies (static schema validation)', () => {
  it('0002_harden.sql enforces owner bid constraint and length limits', () => {
    const hardenSql = fs.readFileSync(
      path.resolve(process.cwd(), 'supabase/migrations/0002_harden.sql'),
      'utf8'
    );

    expect(hardenSql).toMatch(/bids_not_own_listing/i);
    expect(hardenSql).toMatch(/bids_amount_sane/i);
    expect(hardenSql).toMatch(/ratings_no_self/i);
    expect(hardenSql).toMatch(/listings_notes_len/i);
  });

  it('0004_abuse.sql enforces rate limits and reports RLS', () => {
    const abuseSql = fs.readFileSync(
      path.resolve(process.cwd(), 'supabase/migrations/0004_abuse.sql'),
      'utf8'
    );

    expect(abuseSql).toMatch(/check_listing_rate_limit/i);
    expect(abuseSql).toMatch(/check_bid_rate_limit/i);
    expect(abuseSql).toMatch(/create table if not exists public\.reports/i);
    expect(abuseSql).toMatch(/create policy "insert reports"/i);
  });

  it('0006_public_profiles_view.sql gates profiles for anonymous clients', () => {
    const viewSql = fs.readFileSync(
      path.resolve(process.cwd(), 'supabase/migrations/0006_public_profiles_view.sql'),
      'utf8'
    );

    expect(viewSql).toMatch(/revoke select on public\.profiles from anon;/i);
    expect(viewSql).toMatch(/create or replace view public\.public_profiles/i);
  });
});

/**
 * Full RLS integration suite.
 * Skipped unless a dedicated Supabase test project URL, anon key, and two seeded user credentials
 * are provided in environment variables (NEEDS PRATIK).
 */
describe.skipIf(!isConfigured)('db policies (integration test project)', () => {
  async function getSessions() {
    const client1 = createClient(testUrl!, testAnonKey!);
    const client2 = createClient(testUrl!, testAnonKey!);

    const { data: s1, error: e1 } = await client1.auth.signInWithPassword({ email: user1Email!, password: user1Pass! });
    if (e1) throw new Error(`User 1 sign-in failed: ${e1.message}`);

    const { data: s2, error: e2 } = await client2.auth.signInWithPassword({ email: user2Email!, password: user2Pass! });
    if (e2) throw new Error(`User 2 sign-in failed: ${e2.message}`);

    return { client1, client2, user1: s1.user, user2: s2.user };
  }

  it('1. owner bidding on own listing rejects', async () => {
    const { client1, user1 } = await getSessions();

    const { data: listing, error: lErr } = await client1.from('listings').insert({
      owner_id: user1.id,
      kind: 'load',
      origin: 'Memphis, TN',
      origin_code: 'MEM',
      dest: 'Chicago, IL',
      dest_code: 'CHI',
      miles: 530,
      equipment: 'Dry van',
      status: 'open',
    }).select().single();

    expect(lErr).toBeNull();

    const { error: bErr } = await client1.from('bids').insert({
      listing_id: listing.id,
      bidder_id: user1.id,
      amount: 1200,
      status: 'open',
    });

    expect(bErr).not.toBeNull();
    await client1.from('listings').delete().eq('id', listing.id);
  });

  it('2. a bidder can delete their own bid; a stranger cannot', async () => {
    const { client1, client2, user1, user2 } = await getSessions();

    const { data: listing } = await client1.from('listings').insert({
      owner_id: user1.id,
      kind: 'load',
      origin: 'Dallas, TX',
      origin_code: 'DFW',
      dest: 'Atlanta, GA',
      dest_code: 'ATL',
      miles: 800,
      equipment: 'Flatbed',
      status: 'open',
    }).select().single();

    const { data: bid } = await client2.from('bids').insert({
      listing_id: listing.id,
      bidder_id: user2.id,
      amount: 1800,
      status: 'open',
    }).select().single();

    // Stranger (user1) attempts to delete bid placed by user2
    const { error: strangerErr } = await client1.from('bids').delete().eq('id', bid.id);
    expect(strangerErr).not.toBeNull();

    // Owner of bid (user2) deletes bid
    const { error: deleteErr } = await client2.from('bids').delete().eq('id', bid.id);
    expect(deleteErr).toBeNull();

    await client1.from('listings').delete().eq('id', listing.id);
  });

  it('3. amount <= 0 and > 1_000_000 rejected; notes over 500 chars rejected', async () => {
    const { client1, client2, user1, user2 } = await getSessions();

    const { data: listing } = await client1.from('listings').insert({
      owner_id: user1.id, kind: 'load', origin: 'Miami, FL', origin_code: 'MIA', dest: 'Atlanta, GA', dest_code: 'ATL', miles: 660, equipment: 'Reefer', status: 'open'
    }).select().single();

    const { error: errZero } = await client2.from('bids').insert({ listing_id: listing.id, bidder_id: user2.id, amount: 0 });
    expect(errZero).not.toBeNull();

    const { error: errTooHigh } = await client2.from('bids').insert({ listing_id: listing.id, bidder_id: user2.id, amount: 1_000_001 });
    expect(errTooHigh).not.toBeNull();

    const { error: errLongNote } = await client2.from('bids').insert({ listing_id: listing.id, bidder_id: user2.id, amount: 1500, note: 'x'.repeat(501) });
    expect(errLongNote).not.toBeNull();

    await client1.from('listings').delete().eq('id', listing.id);
  });

  it('4. a user cannot rate themselves', async () => {
    const { client1, user1 } = await getSessions();

    const { error } = await client1.from('ratings').insert({
      deal_id: '00000000-0000-0000-0000-000000000000',
      rater_id: user1.id,
      ratee_id: user1.id,
      stars: 5,
    });

    expect(error).not.toBeNull();
  });

  it('5. user cannot read another profile_contacts without an accepted deal', async () => {
    const { client1, user2 } = await getSessions();

    const { data } = await client1.from('profile_contacts').select('*').eq('id', user2.id);
    expect(data).toEqual([]);
  });

  it('6. same user CAN read profile_contacts once a deal is accepted', async () => {
    const { client1, client2, user1, user2 } = await getSessions();

    const { data: listing } = await client1.from('listings').insert({
      owner_id: user1.id, kind: 'load', origin: 'Chicago, IL', origin_code: 'CHI', dest: 'Denver, CO', dest_code: 'DEN', miles: 1000, equipment: 'Dry van', status: 'open'
    }).select().single();

    const { data: bid } = await client2.from('bids').insert({
      listing_id: listing.id, bidder_id: user2.id, amount: 2200, status: 'open'
    }).select().single();

    const { data: deal } = await client1.from('deals').insert({
      listing_id: listing.id, bid_id: bid.id, poster_id: user1.id, bidder_id: user2.id, amount: 2200
    }).select().single();

    // Now user1 can read user2's contacts
    const { data: contacts } = await client1.from('profile_contacts').select('*').eq('id', user2.id);
    expect(contacts).not.toBeNull();

    await client1.from('deals').delete().eq('id', deal.id);
    await client1.from('bids').delete().eq('id', bid.id);
    await client1.from('listings').delete().eq('id', listing.id);
  });

  it('7. rate limit triggers fire at 21st listing', async () => {
    const { client1, user1 } = await getSessions();
    const created: string[] = [];

    let hitLimit = false;
    for (let i = 0; i < 22; i++) {
      const { data, error } = await client1.from('listings').insert({
        owner_id: user1.id, kind: 'load', origin: 'Memphis, TN', origin_code: 'MEM', dest: 'Chicago, IL', dest_code: 'CHI', miles: 530, equipment: 'Dry van', status: 'open'
      }).select('id').single();

      if (error && error.message.includes('P0001')) {
        hitLimit = true;
        break;
      }
      if (data?.id) created.push(data.id);
    }

    expect(hitLimit).toBe(true);

    for (const id of created) {
      await client1.from('listings').delete().eq('id', id);
    }
  });

  it('8. rate limit triggers fire at 61st bid', async () => {
    const { client1, client2, user1, user2 } = await getSessions();

    const { data: listing } = await client1.from('listings').insert({
      owner_id: user1.id, kind: 'load', origin: 'Phoenix, AZ', origin_code: 'PHX', dest: 'Denver, CO', dest_code: 'DEN', miles: 850, equipment: 'Flatbed', status: 'open'
    }).select().single();

    const created: string[] = [];
    let hitLimit = false;

    for (let i = 0; i < 62; i++) {
      const { data, error } = await client2.from('bids').insert({
        listing_id: listing.id, bidder_id: user2.id, amount: 1500 + i, status: 'open'
      }).select('id').single();

      if (error && error.message.includes('P0001')) {
        hitLimit = true;
        break;
      }
      if (data?.id) created.push(data.id);
    }

    expect(hitLimit).toBe(true);

    for (const id of created) {
      await client2.from('bids').delete().eq('id', id);
    }
    await client1.from('listings').delete().eq('id', listing.id);
  });
});
