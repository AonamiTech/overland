# Overland

An open freight board for US trucking. Shippers post loads, carriers post trucks,
and either side bids on the other. Every bid is public.

**Live:** [overland-ochre.vercel.app](https://overland-ochre.vercel.app)

---

## What this is, and what it deliberately is not

Overland is a **listing board, not a broker**. The platform never takes custody of
freight, never handles money, and is not a party to any deal. It has no commission
and no membership fee.

Contact details stay hidden until one side accepts a bid. At that moment both
parties are introduced by email and the platform steps out — rate confirmation,
insurance and payment are between them.

This boundary is not a stylistic choice. Under [49 CFR 371.2](https://www.law.cornell.edu/cfr/text/49/371.2)
a broker is a person who, *for compensation*, arranges transportation, and
[49 U.S.C. § 14916](https://www.law.cornell.edu/uscode/text/49/14916) attaches
liability for unlicensed brokerage to officers and directors **personally, jointly
and severally, with no cap**. Anything that moves the platform toward arranging,
negotiating or handling payment changes its legal character. See
[LEGAL-NOTES.md](LEGAL-NOTES.md).

**We verify nothing about anyone.** Sign-up currently runs with Supabase's
`mailer_autoconfirm` enabled, so an address is accepted without being confirmed:
the account is real, the email behind it is unproven. No carrier vetting, no insurance
checks. Users are told this plainly and pointed at the FMCSA SAFER register to
check each other, with a one-click lookup built from each carrier's own MC/USDOT.

---

## The privacy promise is enforced by Postgres

Bids are public — that is the product. Contact details are not, and the boundary
is a database policy rather than a hidden component.

`profiles` holds the public record: name, role, city, self-declared MC/USDOT.
Email and phone live in a **separate `profile_contacts` table** whose row-level
security policy exposes a row only to its owner or to an accepted-deal
counterparty. A client that asks for someone else's contacts gets nothing back,
because the database refuses — not because the UI hid a `<div>`.

Never move `email` or `phone` into `profiles`, and never expose a view that joins
them without the accepted-deal condition.

---

## Stack

| | |
|---|---|
| Build | Vite 5 · React 18 · TypeScript 5.5 |
| Styling | Tailwind 3.4 · shadcn/ui · a bespoke token layer ([DESIGN.md](DESIGN.md)) |
| Routing | React Router 6 |
| Backend | Supabase — Postgres, row-level security, auth, edge functions |
| Charts | Recharts |
| Tests | Vitest |
| Hosting | Vercel |

### Deployed Edge Functions
- `news` (`supabase/functions/news/index.ts`): Active on Supabase; fetches and caches RSS market headlines for the homepage.
- `send-deal-email` (`supabase/functions/send-deal-email/index.ts`): Active on Supabase; handles transactional deal notifications.
- *(Note: Unused prototype `ai-search` was deleted from the repository as it was never deployed nor referenced).*

---

## Running it

```bash
npm install
npm run dev          # http://localhost:8080
```

With no environment variables the app runs in **local mode**: nothing is sent, no
email leaves the browser, and sign-up/sign-in completes immediately against a
device-local account registry. Local mode never stores a password; it is a demo
fallback, not account security. That is the fastest way to click through the product.

To run against a real backend, create `.env` from the example:

```bash
cp .env.example .env
```

| Variable | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | for live mode | Both must be set, or the app falls back to local mode |
| `VITE_SUPABASE_ANON_KEY` | for live mode | Public by design and safe in the bundle. The `service_role` key must **never** appear in this repo or in client code |
| `VITE_GOOGLE_AUTH` | no | Set to `off` to hide the Google button while its provider credentials are being fixed |

The header **Sign in** action opens the sign-in form directly. Posting actions open
sign-up, and every auth entry point remembers the page that requested access. Password
and magic-link sessions return there after authentication; a Google or email callback
also carries the return target through the full-page redirect. The callback target is
restricted to an app-local path.

Google is optional and requires the provider to be enabled in Supabase Authentication
with a matching Google Cloud OAuth client secret. If the provider returns a credential
exchange error, the app explains that the owner must fix the Supabase/Google Cloud
configuration and keeps email sign-in available. `VITE_GOOGLE_AUTH=off` hides the
button during that setup.

Then apply the migrations in `supabase/migrations/` in order. See
[supabase/SETUP.md](supabase/SETUP.md).

### Scripts

```bash
npm run typecheck    # tsc -b  — see the note below
npm run test         # vitest
npm run build        # tsc -b && vite build
npm run lint
```

**Use `npm run typecheck`, not `tsc --noEmit`.** The root `tsconfig.json` has
`"files": []`, so a bare `--noEmit` type-checks nothing and passes silently. Only
`tsc -b` walks the project references.

### Operator Moderation & Reports
User reports filed via `ReportModal` land in `public.reports`. To preserve reporter privacy, client `SELECT` is denied via RLS (insert-only for authenticated users).

Operators read and audit reports using the Supabase SQL Editor or `service_role` connection:
```sql
-- View all submitted reports with reporter name
select r.id, r.created_at, r.subject_type, r.subject_id, r.reason, p.name as reporter_name
from public.reports r
left join public.profiles p on r.reporter_id = p.id
order by r.created_at desc;
```
To hide a reported listing or bid, set `hidden = true` on the target row in `public.listings` or `public.bids`.

---

## Layout

```
src/
  auth/                  AuthContext, Supabase client, route guard
  components/overland/   The current product — board, bidding, profiles, auth
  lib/                   db · market · usmap · parseQuery · seo · carrier · password
  pages/                 Index · BoardPage
  test/                  Persona-driven tests
supabase/
npm run dev
```

---

## Verification

```bash
npm run typecheck       # tsc -b — the ONLY real type check
npm run test            # vitest run
npm run build           # vite build
npm run verify:shipped  # local pre-report shipping gate
```

---

## Licence & Housekeeping

- **Licence (NEEDS PRATIK):** None yet. All rights reserved until an open source or proprietary licence is chosen by Pratik.
- **Duplicate Repository (NEEDS PRATIK):** The empty duplicate repository at `pratikkpp24/overland` should be deleted on GitHub.
