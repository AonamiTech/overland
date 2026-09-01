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

---

## 4. Email Notifications (Edge Function)

Transactional emails on deal acceptance are driven by the `send-deal-email` edge function.

### Environment Secrets required:
Set the following secrets in Supabase Dashboard → **Project Settings** → **Edge Functions**:

```bash
# Option A: Resend API Key (Recommended)
supabase secrets set RESEND_API_KEY=re_123456789

# Option B: Standard SMTP Credentials
supabase secrets set SMTP_HOST=smtp.sendgrid.net
supabase secrets set SMTP_USER=apikey
supabase secrets set SMTP_PASS=your_smtp_password
supabase secrets set SMTP_FROM="Overland <notifications@overland.com>"
```

### Deploying the Edge Function:
```bash
supabase functions deploy send-deal-email
```

### Webhook / Database Trigger:
In Supabase Dashboard → **Database** → **Webhooks**, create a Webhook:
- **Table:** `public.deals`
- **Events:** `INSERT`
- **Target:** HTTP Request to `https://<your-project-ref>.supabase.co/functions/v1/send-deal-email`

If credentials are absent, the edge function logs `[WARN]` and returns `{ status: "skipped" }` without interrupting the transaction.

---

## 5. Transactional Auth Email (Custom SMTP & Domain)

By default, Supabase Auth uses a shared built-in email provider with strict hourly rate limits (3 emails/hour).

To use production magic links from `auth@overland.com`:

### 1. Configure Custom SMTP in Supabase Dashboard
Go to **Project Settings** → **Authentication** → **SMTP Settings**:
- **Enable Custom SMTP:** On
- **Sender email:** `auth@overland.com`
- **Sender name:** `Overland`
- **Host:** `smtp.resend.com` (or SendGrid `smtp.sendgrid.net`)
- **Port:** `587` (TLS)
- **Username:** `resend` (or `apikey`)
- **Password:** `<YOUR_SMTP_API_KEY>`

### 2. DNS Verification (overland.com)
In your DNS provider for `overland.com`, add:
- **SPF Record:** `v=spf1 include:amazonses.com ~all` (or provider specific)
- **DKIM TXT Record:** Provided by your email provider
- **DMARC TXT Record:** `v=DMARC1; p=none; rua=mailto:dmarc@overland.com`

### 3. Local Mode Fallback
When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are blank in `.env.local`, Overland runs in local mode: authentication is immediate via `localStorage` and no emails are sent.

---

## 6. RLS Integration Test Suite (Dedicated Test Project)

The static SQL tests run automatically during `npm test`. To execute the full 8-scenario RLS integration test harness, configure environment variables for a dedicated Supabase test project:

```bash
export SUPABASE_TEST_URL="https://your-test-project.supabase.co"
export SUPABASE_TEST_ANON_KEY="your-test-anon-key"
export SUPABASE_TEST_USER1_EMAIL="user1@test.com"
export SUPABASE_TEST_USER1_PASS="password123"
export SUPABASE_TEST_USER2_EMAIL="user2@test.com"
export SUPABASE_TEST_USER2_PASS="password123"
```
When these variables are absent, the 8 integration tests skip gracefully to avoid modifying production data or failing without credentials.


