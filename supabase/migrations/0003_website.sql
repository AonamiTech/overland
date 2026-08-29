-- Self-declared website / Google page for a carrier or shipper.
--
-- Lives on `profiles`, not `profile_contacts`, deliberately: a public website is not a
-- contact detail. It is a claim anyone on the board should be able to see *before*
-- deciding whether to accept, which is the whole point of showing it next to a bid.
-- Email and phone stay behind the accepted-deal wall in profile_contacts.

alter table public.profiles add column if not exists website text;

-- Keep it a plausible URL so the UI never renders a link to nonsense, and cap the
-- length so the column cannot be used as free storage.
alter table public.profiles drop constraint if exists profiles_website_ck;
alter table public.profiles add constraint profiles_website_ck
  check (website is null or (length(website) <= 200 and website ~* '^(https?://)?[a-z0-9-]+(\.[a-z0-9-]+)+'));
