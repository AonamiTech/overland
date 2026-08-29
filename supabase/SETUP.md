# Database setup

One-time, ~3 minutes. Run this before the board can carry real listings.

## 1. Run the migration

Supabase dashboard → **SQL Editor** → New query → paste the whole of
`supabase/migrations/0001_init.sql` → **Run**.

It creates `profiles`, `profile_contacts`, `listings`, `bids`, `deals`, `ratings`,
turns on Row Level Security for all six, and installs a trigger that creates a profile
row automatically whenever someone signs up.

## 2. Check it took

**Table Editor** should show all six tables, each with an **RLS enabled** badge. If any
table shows RLS disabled, stop — an unprotected table is world-writable.

## 3. Backfill yourself

The signup trigger only fires for new users, so any account created before the migration
has no profile row. Run once:

```sql
insert into public.profiles (id, name, role, account_type, org_name, city, mc_number, usdot_number)
select u.id,
       coalesce(u.raw_user_meta_data->>'name', ''),
       coalesce((u.raw_user_meta_data->>'role')::user_role, 'shipper'),
       coalesce((u.raw_user_meta_data->>'accountType')::account_kind, 'individual'),
       nullif(u.raw_user_meta_data->>'orgName', ''),
       coalesce(u.raw_user_meta_data->>'city', ''),
       nullif(u.raw_user_meta_data->>'mcNumber', ''),
       nullif(u.raw_user_meta_data->>'usdotNumber', '')
from auth.users u
on conflict (id) do nothing;

insert into public.profile_contacts (id, email, phone)
select u.id, u.email, nullif(u.raw_user_meta_data->>'phone', '')
from auth.users u
on conflict (id) do nothing;
```

---

## How the privacy promise is enforced

The product says contact details are shared **only** after both sides agree. That is not
a UI rule here — it is a database policy.

`email` and `phone` live in `profile_contacts`, separate from the public `profiles`
table. Its select policy returns a row only if:

- you are the owner, **or**
- a row exists in `deals` linking you and that person.

So a user who has not accepted a bid cannot read a counterparty's contact details even
by calling the API directly. Keep it that way: never move `email` or `phone` into
`profiles`, and never expose a view that joins them without the same condition.

## What is deliberately public

- **Every listing** — the board is open.
- **Every bid, including the amount.** "Everyone sees the rate" is the product, so any
  signed-in user can read all bids. This is intentional, not a leak.
- **Public profile fields** — name, city, role, self-declared MC/USDOT.

## Ratings

`ratings` has a unique constraint on `(deal_id, rater_id)` and an insert policy
requiring a matching `deals` row. You cannot rate someone you never transacted with,
which is what keeps the reputation layer meaningful rather than a comment box.
