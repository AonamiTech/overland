-- Task 2: Gate identifying carrier profile fields at the database level for anonymous clients.
-- Revoke anon access on public.profiles and expose non-identifying fields via public_profiles view.

-- 1. Revoke direct anon select on public.profiles
revoke select on public.profiles from anon;

-- Ensure authenticated users can select from public.profiles
grant select on public.profiles to authenticated;

-- 2. Create public_profiles view for anonymous market indexing
create or replace view public.public_profiles as
  select
    id,
    role,
    account_type,
    city,
    created_at
  from public.profiles;

-- Grant select on public_profiles view to anon and authenticated
grant select on public.public_profiles to anon;
grant select on public.public_profiles to authenticated;
