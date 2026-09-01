import { getSupabase } from '@/auth/supabaseClient';

/**
 * Data access for the board.
 *
 * Every table read/write goes through here so components never touch Supabase
 * directly. That keeps RLS reasoning in one place and makes the demo/real split
 * explicit: `isLive()` is false until the keys are set, and callers fall back to the
 * seeded fixtures rather than rendering an empty board.
 *
 * Contact details are deliberately not selectable from `profiles` - they live in
 * `profile_contacts`, which RLS only exposes to the owner or an accepted-deal
 * counterparty. `getContacts` returning null is the normal case, not an error.
 */

export const isLive = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export type ListingKind = 'load' | 'truck';

export type Listing = {
  id: string;
  owner_id: string;
  kind: ListingKind;
  origin: string; origin_code: string;
  dest: string;   dest_code: string;
  miles: number;
  equipment: string;
  ready_date: string | null;
  target_rate: number | null;
  notes: string | null;
  status: 'open' | 'awarded' | 'closed';
  created_at: string;
  expires_at?: string | null;
  hidden?: boolean;
};

export type Bid = {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  note: string | null;
  status: 'open' | 'accepted' | 'withdrawn';
  created_at: string;
  hidden?: boolean;
};

export type PublicProfile = {
  id: string;
  name: string;
  role: 'shipper' | 'carrier';
  account_type: 'individual' | 'company';
  org_name: string | null;
  city: string;
  website: string | null;
  mc_number: string | null;
  usdot_number: string | null;
  created_at: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function sb(): Promise<any> {
  return getSupabase() as unknown as Promise<any>;
}

/* --------------------------------------------------------------- listings */

export async function fetchListings(kind?: ListingKind): Promise<Listing[]> {
  if (!isLive()) return [];
  const c = await sb();
  const now = new Date().toISOString();
  let q = c
    .from('listings')
    .select('*')
    .eq('status', 'open')
    .eq('hidden', false)
    .gt('expires_at', now)
    .order('created_at', { ascending: false });
  if (kind) q = q.eq('kind', kind);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Listing[];
}

export async function createListing(
  input: Omit<Listing, 'id' | 'created_at' | 'status' | 'owner_id'> & { owner_id: string },
): Promise<Listing> {
  const c = await sb();
  const { data, error } = await c.from('listings').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Listing;
}

/* ------------------------------------------------------------------- bids */

/** Board totals for the header. Counted with head+exact so no rows cross the wire. */
export async function boardCounts(): Promise<{ loads: number; bids: number } | null> {
  if (!isLive()) return null;
  try {
    const c = await sb();
    const now = new Date().toISOString();
    const [l, b] = await Promise.all([
      c.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'open').eq('hidden', false).gt('expires_at', now),
      c.from('bids').select('id', { count: 'exact', head: true }).eq('hidden', false),
    ]);
    return { loads: l.count ?? 0, bids: b.count ?? 0 };
  } catch {
    // A failed count must not blank the header - the caller falls back to a dash.
    return null;
  }
}

export async function fetchBids(listingId: string): Promise<Bid[]> {
  if (!isLive()) return [];
  const c = await sb();
  const { data, error } = await c
    .from('bids')
    .select('*')
    .eq('listing_id', listingId)
    .eq('hidden', false)
    .order('amount', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Bid[];
}

/** Upsert, because the unique (listing_id, bidder_id) constraint means a second bid
 *  from the same person is a counter, not a new row. */
export async function placeBid(listingId: string, bidderId: string, amount: number, note?: string): Promise<Bid> {
  const c = await sb();
  const { data, error } = await c
    .from('bids')
    .upsert({ listing_id: listingId, bidder_id: bidderId, amount, note: note ?? null, status: 'open' },
            { onConflict: 'listing_id,bidder_id' })
    .select().single();
  if (error) throw new Error(error.message);
  return data as Bid;
}

/* ------------------------------------------------------------------ deals */

/** Accepting a bid is the moment contact details unlock, so it writes the deal row
 *  that the profile_contacts policy keys off. */
export async function acceptBid(args: {
  listingId: string; bidId: string; posterId: string; bidderId: string; amount: number;
}) {
  const c = await sb();
  const { data, error } = await c.from('deals').insert({
    listing_id: args.listingId, bid_id: args.bidId,
    poster_id: args.posterId, bidder_id: args.bidderId, amount: args.amount,
  }).select().single();
  if (error) throw new Error(error.message);

  await c.from('bids').update({ status: 'accepted' }).eq('id', args.bidId);
  await c.from('listings').update({ status: 'awarded' }).eq('id', args.listingId);
  return data;
}

export async function setDealStatus(dealId: string, status: 'confirmed' | 'fell_through') {
  const c = await sb();
  const { error } = await c.from('deals').update({ status }).eq('id', dealId);
  if (error) throw new Error(error.message);
}

/* --------------------------------------------------------------- profiles */

export async function getPublicProfile(id: string): Promise<PublicProfile | null> {
  if (!isLive()) return null;
  const c = await sb();
  const { data: session } = await c.auth.getSession().catch(() => ({ data: { session: null } }));
  const isAuth = Boolean(session?.session?.user);

  const table = isAuth ? 'profiles' : 'public_profiles';
  const { data } = await c.from(table).select('*').eq('id', id).maybeSingle();
  return (data as PublicProfile) ?? null;
}

/** Null unless you own the row or share an accepted deal - enforced by RLS, so a null
 *  here means "not entitled", not "missing". */
/** Batch lookup for bid lists, so N bids do not become N round trips. */
export async function getPublicProfiles(ids: string[]): Promise<Record<string, PublicProfile>> {
  if (!isLive() || ids.length === 0) return {};
  const c = await sb();
  const { data: session } = await c.auth.getSession().catch(() => ({ data: { session: null } }));
  const isAuth = Boolean(session?.session?.user);

  const table = isAuth ? 'profiles' : 'public_profiles';
  const { data } = await c.from(table).select('*').in('id', Array.from(new Set(ids)));
  const out: Record<string, PublicProfile> = {};
  for (const p of (data ?? []) as PublicProfile[]) out[p.id] = p;
  return out;
}

export async function getContacts(id: string): Promise<{ email: string | null; phone: string | null } | null> {
  if (!isLive()) return null;
  const c = await sb();
  const { data } = await c.from('profile_contacts').select('email, phone').eq('id', id).maybeSingle();
  return data ?? null;
}

/* --------------------------------------------------------------- ratings */

export async function fetchRatings(rateeId: string) {
  if (!isLive()) return [];
  const c = await sb();
  const { data } = await c
    .from('ratings').select('*').eq('ratee_id', rateeId).order('created_at', { ascending: false });
  return data ?? [];
}

export async function postRating(args: {
  dealId: string; raterId: string; rateeId: string; stars: 1|2|3|4|5; note?: string;
}) {
  const c = await sb();
  const { error } = await c.from('ratings').insert({
    deal_id: args.dealId, rater_id: args.raterId, ratee_id: args.rateeId,
    stars: args.stars, note: args.note ?? null,
  });
  if (error) throw new Error(error.message);
}

/* --------------------------------------------------------------- reports */

export async function reportContent(args: {
  reporterId: string;
  subjectType: 'listing' | 'bid' | 'profile';
  subjectId: string;
  reason: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isLive()) return { ok: true };
  try {
    const c = await sb();
    const { error } = await c.from('reports').insert({
      reporter_id: args.reporterId,
      subject_type: args.subjectType,
      subject_id: args.subjectId,
      reason: args.reason,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Could not submit report.' };
  }
}
