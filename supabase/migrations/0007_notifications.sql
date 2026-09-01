-- Task 6: Notifications table and notify_email preference flag.

-- 1. Add notify_email preference flag to profiles table
alter table public.profiles
  add column if not exists notify_email boolean not null default true;

-- 2. Create notifications log table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  type text not null check (type in ('bid_placed', 'deal_accepted')),
  status text not null check (status in ('sent', 'skipped', 'failed')),
  created_at timestamptz not null default now()
);

-- Turn on RLS on notifications table
alter table public.notifications enable row level security;

-- Drop existing policies if re-running
drop policy if exists "users can view own notifications" on public.notifications;
drop policy if exists "system insert notifications" on public.notifications;

-- Account owner can view own notification logs
create policy "users can view own notifications" on public.notifications
  for select to authenticated
  using (auth.uid() = user_id);

-- System / authenticated users can insert notification logs
create policy "system insert notifications" on public.notifications
  for insert to authenticated
  with check (auth.uid() = user_id);
