-- Task 6: Open anonymous reads for listings, bids, and public profiles.
-- Contact details in profile_contacts remain strictly protected and unaccessible to anon.

-- 1. Grant SELECT to anon role
grant select on public.listings to anon;
grant select on public.bids to anon;
grant select on public.profiles to anon;

-- Explicitly revoke access from anon on profile_contacts and reports
revoke all on public.profile_contacts from anon;
revoke all on public.reports from anon;

-- 2. RLS policies for anonymous read access

-- Anonymous read policy on listings (open, non-hidden, non-expired)
drop policy if exists "anon read open listings" on public.listings;
create policy "anon read open listings" on public.listings
  for select to anon
  using (status = 'open' and hidden = false and (expires_at is null or expires_at > now()));

-- Anonymous read policy on bids (non-hidden)
drop policy if exists "anon read bids" on public.bids;
create policy "anon read bids" on public.bids
  for select to anon
  using (hidden = false);

-- Anonymous read policy on public profiles
drop policy if exists "anon read profiles" on public.profiles;
create policy "anon read profiles" on public.profiles
  for select to anon
  using (true);
