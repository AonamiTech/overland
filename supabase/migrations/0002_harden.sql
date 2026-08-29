-- Security hardening. Safe to re-run.
--
-- 0001 relied on deny-by-default for DELETE: with RLS on and no DELETE policy, nothing
-- can be deleted. That is correct, but it is implicit - anyone adding a broad policy
-- later silently opens it, and an anonymous DELETE returns 204 ("deleted 0 rows"),
-- which is indistinguishable from success in a log. Make the intent explicit.

-- ---------------------------------------------------------------- deletes

-- You may remove your own listing. Cascades to its bids, which is intended: a bid on a
-- withdrawn listing is meaningless.
drop policy if exists "delete your own listings" on public.listings;
create policy "delete your own listings" on public.listings
  for delete to authenticated using (auth.uid() = owner_id);

-- You may withdraw your own bid.
drop policy if exists "delete your own bids" on public.bids;
create policy "delete your own bids" on public.bids
  for delete to authenticated using (auth.uid() = bidder_id);

-- deals and ratings have NO delete policy on purpose. They are the record of what was
-- agreed and what people said about each other; letting either side erase that would
-- make the reputation layer worthless. Deny-by-default is the correct behaviour here
-- and this comment is the reason it must stay that way.

-- ---------------------------------------------------------------- integrity

-- You cannot bid on your own listing.
alter table public.bids drop constraint if exists bids_not_own_listing;
create or replace function public.bid_is_not_own_listing(l uuid, b uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select not exists (select 1 from public.listings where id = l and owner_id = b);
$$;

drop policy if exists "place your own bids" on public.bids;
create policy "place your own bids" on public.bids
  for insert to authenticated
  with check (
    auth.uid() = bidder_id
    and public.bid_is_not_own_listing(listing_id, auth.uid())
  );

-- A rating must name a real counterparty, not yourself.
alter table public.ratings drop constraint if exists ratings_no_self;
alter table public.ratings add constraint ratings_no_self check (rater_id <> ratee_id);

-- Amounts must be sane. A bid of 100 million is a typo or an attack, not an offer.
alter table public.bids drop constraint if exists bids_amount_sane;
alter table public.bids add constraint bids_amount_sane check (amount > 0 and amount <= 1000000);

alter table public.listings drop constraint if exists listings_rate_sane;
alter table public.listings add constraint listings_rate_sane
  check (target_rate is null or (target_rate >= 0 and target_rate <= 1000000));

alter table public.listings drop constraint if exists listings_miles_sane;
alter table public.listings add constraint listings_miles_sane check (miles > 0 and miles <= 5000);

-- Free-text fields are rendered in the UI; cap them so nobody can post a megabyte of
-- text into a card and break the board for everyone.
alter table public.listings drop constraint if exists listings_notes_len;
alter table public.listings add constraint listings_notes_len check (char_length(coalesce(notes,'')) <= 500);

alter table public.bids drop constraint if exists bids_note_len;
alter table public.bids add constraint bids_note_len check (char_length(coalesce(note,'')) <= 500);

alter table public.ratings drop constraint if exists ratings_note_len;
alter table public.ratings add constraint ratings_note_len check (char_length(coalesce(note,'')) <= 1000);

alter table public.profiles drop constraint if exists profiles_name_len;
alter table public.profiles add constraint profiles_name_len check (char_length(coalesce(name,'')) <= 120);

-- ---------------------------------------------------------------- surface

-- Nothing in the app needs anon access. Revoke it so an anon key alone reaches nothing,
-- rather than reaching tables that happen to have restrictive policies.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;
