-- Overland core schema
--
-- SAFE TO RE-RUN. Every statement is guarded, so if an earlier attempt failed partway
-- you can simply run the whole file again. Postgres aborts the entire script on the
-- first error, which is why a half-applied migration leaves no tables at all.
--
-- Design notes worth reading before changing anything:
--
-- 1. Bids are PUBLIC. "Everyone sees the rate" is the product, so RLS lets any signed-in
--    user read every bid. This is deliberate, not an oversight.
--
-- 2. Contact details are NOT public. Email and phone live in a separate table
--    (profile_contacts) whose policy only exposes a row to its owner, or to someone who
--    shares an accepted deal with them. The promise "nothing is shared until you both
--    agree" is therefore enforced by Postgres, not by remembering to hide a <div>.
--
-- 3. Ratings require a deal. You cannot rate someone you never transacted with, which is
--    what stops the reputation layer becoming a comment box.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- profiles

do $$ begin create type user_role as enum ('shipper', 'carrier'); exception when duplicate_object then null; end $$;
do $$ begin create type account_kind as enum ('individual', 'company'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  name         text not null default '',
  role         user_role not null default 'shipper',
  account_type account_kind not null default 'individual',
  org_name     text,
  city         text not null default '',
  -- Self-declared, never verified by us. Shown so counterparties can check FMCSA.
  mc_number    text,
  usdot_number text,
  created_at   timestamptz not null default now()
);

create table if not exists public.profile_contacts (
  id    uuid primary key references public.profiles on delete cascade,
  email text,
  phone text
);

-- ---------------------------------------------------------------- listings

do $$ begin create type listing_kind as enum ('load', 'truck'); exception when duplicate_object then null; end $$;
do $$ begin create type listing_status as enum ('open', 'awarded', 'closed'); exception when duplicate_object then null; end $$;

create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles on delete cascade,
  kind        listing_kind not null,
  origin      text not null,
  origin_code text not null,
  dest        text not null,
  dest_code   text not null,
  miles       int  not null check (miles > 0),
  equipment   text not null,
  ready_date  date,
  target_rate int  check (target_rate >= 0),
  notes       text,
  status      listing_status not null default 'open',
  created_at  timestamptz not null default now()
);
create index if not exists idx_listings_status_created_at_desc on public.listings (status, created_at desc);
create index if not exists idx_listings_origin_code_dest_code on public.listings (origin_code, dest_code);

-- -------------------------------------------------------------------- bids

do $$ begin create type bid_status as enum ('open', 'accepted', 'withdrawn'); exception when duplicate_object then null; end $$;

create table if not exists public.bids (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings on delete cascade,
  bidder_id  uuid not null references public.profiles on delete cascade,
  amount     int  not null check (amount > 0),
  note       text,
  status     bid_status not null default 'open',
  created_at timestamptz not null default now(),
  -- one live bid per person per listing; counters update the row
  unique (listing_id, bidder_id)
);
create index if not exists idx_bids_listing_id_amount on public.bids (listing_id, amount);

-- ------------------------------------------------------------------- deals

do $$ begin create type deal_status as enum ('awaiting', 'confirmed', 'fell_through'); exception when duplicate_object then null; end $$;

create table if not exists public.deals (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings on delete cascade,
  bid_id     uuid not null references public.bids on delete cascade,
  poster_id  uuid not null references public.profiles on delete cascade,
  bidder_id  uuid not null references public.profiles on delete cascade,
  amount     int  not null,
  status     deal_status not null default 'awaiting',
  created_at timestamptz not null default now(),
  unique (bid_id)
);
create index if not exists idx_deals_poster_id on public.deals (poster_id);
create index if not exists idx_deals_bidder_id on public.deals (bidder_id);

-- ----------------------------------------------------------------- ratings

create table if not exists public.ratings (
  id         uuid primary key default gen_random_uuid(),
  deal_id    uuid not null references public.deals on delete cascade,
  rater_id   uuid not null references public.profiles on delete cascade,
  ratee_id   uuid not null references public.profiles on delete cascade,
  stars      int  not null check (stars between 1 and 5),
  note       text,
  created_at timestamptz not null default now(),
  -- one rating per person per deal
  unique (deal_id, rater_id)
);
create index if not exists idx_ratings_ratee_id on public.ratings (ratee_id);

-- ------------------------------------------------- profile row on signup

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, account_type, org_name, city, mc_number, usdot_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'shipper'),
    coalesce((new.raw_user_meta_data->>'accountType')::account_kind, 'individual'),
    nullif(new.raw_user_meta_data->>'orgName', ''),
    coalesce(new.raw_user_meta_data->>'city', ''),
    nullif(new.raw_user_meta_data->>'mcNumber', ''),
    nullif(new.raw_user_meta_data->>'usdotNumber', '')
  );

  insert into public.profile_contacts (id, email, phone)
  values (new.id, new.email, nullif(new.raw_user_meta_data->>'phone', ''));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------- RLS

alter table public.profiles         enable row level security;
alter table public.profile_contacts enable row level security;
alter table public.listings         enable row level security;
alter table public.bids             enable row level security;
alter table public.deals            enable row level security;
alter table public.ratings          enable row level security;

-- profiles: the public half of a person is visible to everyone signed in
drop policy if exists "profiles are readable" on public.profiles;
create policy "profiles are readable" on public.profiles
  for select to authenticated using (true);
drop policy if exists "own profile is writable" on public.profiles;
create policy "own profile is writable" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- contacts: yourself, or someone you have an accepted deal with. This is the
-- "nothing is shared until you both agree" promise, in the database.
drop policy if exists "contacts visible to self or deal counterparty" on public.profile_contacts;
create policy "contacts visible to self or deal counterparty" on public.profile_contacts
  for select to authenticated using (
    auth.uid() = id
    or exists (
      select 1 from public.deals d
      where (d.poster_id = auth.uid() and d.bidder_id = profile_contacts.id)
         or (d.bidder_id = auth.uid() and d.poster_id = profile_contacts.id)
    )
  );
drop policy if exists "own contacts writable" on public.profile_contacts;
create policy "own contacts writable" on public.profile_contacts
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- listings: the board is open
drop policy if exists "listings are readable" on public.listings;
create policy "listings are readable" on public.listings
  for select to authenticated using (true);
drop policy if exists "post your own listings" on public.listings;
create policy "post your own listings" on public.listings
  for insert to authenticated with check (auth.uid() = owner_id);
drop policy if exists "edit your own listings" on public.listings;
create policy "edit your own listings" on public.listings
  for update to authenticated using (auth.uid() = owner_id);

-- bids: every bid is public. That is the product.
drop policy if exists "bids are readable" on public.bids;
create policy "bids are readable" on public.bids
  for select to authenticated using (true);
drop policy if exists "place your own bids" on public.bids;
create policy "place your own bids" on public.bids
  for insert to authenticated with check (auth.uid() = bidder_id);
drop policy if exists "edit your own bids" on public.bids;
create policy "edit your own bids" on public.bids
  for update to authenticated using (auth.uid() = bidder_id);

-- deals: participants only
drop policy if exists "deals visible to participants" on public.deals;
create policy "deals visible to participants" on public.deals
  for select to authenticated using (auth.uid() in (poster_id, bidder_id));
drop policy if exists "listing owner accepts a bid" on public.deals;
create policy "listing owner accepts a bid" on public.deals
  for insert to authenticated with check (
    auth.uid() = poster_id
    and exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );
drop policy if exists "participants update a deal" on public.deals;
create policy "participants update a deal" on public.deals
  for update to authenticated using (auth.uid() in (poster_id, bidder_id));

-- ratings: readable by all, but only writable by someone who was in the deal
drop policy if exists "ratings are readable" on public.ratings;
create policy "ratings are readable" on public.ratings
  for select to authenticated using (true);
drop policy if exists "rate only your own completed deals" on public.ratings;
create policy "rate only your own completed deals" on public.ratings
  for insert to authenticated with check (
    auth.uid() = rater_id
    and exists (
      select 1 from public.deals d
      where d.id = deal_id
        and auth.uid() in (d.poster_id, d.bidder_id)
    )
  );
