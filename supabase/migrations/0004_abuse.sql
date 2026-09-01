-- Abuse controls: rate limits, listing expiry, reports, and content moderation.

-- 1. Expiry and Hidden flags
alter table public.listings add column if not exists expires_at timestamptz default (now() + interval '14 days');
alter table public.listings add column if not exists hidden boolean not null default false;

alter table public.bids add column if not exists hidden boolean not null default false;

-- Trigger to default expires_at based on ready_date if not specified
create or replace function public.set_listing_expiry()
returns trigger language plpgsql as $$
begin
  if new.expires_at is null then
    if new.ready_date is not null then
      new.expires_at := (new.ready_date::timestamptz + interval '14 days');
    else
      new.expires_at := (now() + interval '14 days');
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists tr_set_listing_expiry on public.listings;
create trigger tr_set_listing_expiry
  before insert on public.listings
  for each row execute function public.set_listing_expiry();

-- 2. Rate limiting triggers
-- 20 listings per user per hour
create or replace function public.check_listing_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
    from public.listings
   where owner_id = new.owner_id
     and created_at > (now() - interval '1 hour');

  if recent_count >= 20 then
    raise exception 'Hourly rate limit exceeded: maximum 20 listings per hour.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists tr_check_listing_rate_limit on public.listings;
create trigger tr_check_listing_rate_limit
  before insert on public.listings
  for each row execute function public.check_listing_rate_limit();

-- 60 bids per user per hour
create or replace function public.check_bid_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
    from public.bids
   where bidder_id = new.bidder_id
     and created_at > (now() - interval '1 hour');

  if recent_count >= 60 then
    raise exception 'Hourly rate limit exceeded: maximum 60 bids per hour.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists tr_check_bid_rate_limit on public.bids;
create trigger tr_check_bid_rate_limit
  before insert on public.bids
  for each row execute function public.check_bid_rate_limit();

-- 3. Reports table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  subject_type text not null check (subject_type in ('listing', 'bid', 'profile')),
  subject_id uuid not null,
  reason text not null check (char_length(reason) <= 500),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Insert policy: authenticated users can report
drop policy if exists "insert reports" on public.reports;
create policy "insert reports" on public.reports
  for insert to authenticated
  with check (auth.uid() = reporter_id);

-- Select policy: select by nobody (no select policy exists)
