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

**We verify an email address and nothing more.** No carrier vetting, no insurance
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

---

## Running it

```bash
npm install
npm run dev          # http://localhost:8080
```

With no environment variables the app runs in **local mode**: nothing is sent, no
email leaves the browser, and sign-in completes immediately against
`localStorage`. That is the fastest way to click through the product.

To run against a real backend, create `.env` from the example:

```bash
cp .env.example .env
```

| Variable | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | for live mode | Both must be set, or the app falls back to local mode |
| `VITE_SUPABASE_ANON_KEY` | for live mode | Public by design and safe in the bundle. The `service_role` key must **never** appear in this repo or in client code |
| `VITE_GOOGLE_AUTH` | no | Set to `off` to hide the Google button while its provider credentials are being fixed |

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
  migrations/            0001_init · 0002_harden · 0003_website
  functions/             news · ai-search (Deno)
```

Two design layers coexist in `src/index.css`: `.aon-*` is current and owns the
product surfaces, `.ov-*` is legacy and owns ~24 older routes. **Mixing them on
one screen is the most common visual bug in this repo.** Read
[DESIGN.md](DESIGN.md) before writing UI.

---

## Docs

| File | What it covers |
|---|---|
| [PRD.md](PRD.md) | What the product is, who it serves, and what is in and out of scope |
| [DESIGN.md](DESIGN.md) | The design system, the two layers, and the footguns that have actually bitten |
| [LEGAL-NOTES.md](LEGAL-NOTES.md) | Broker-status boundary and what must never be built |
| [supabase/SETUP.md](supabase/SETUP.md) | Database setup and migrations |
| [supabase/EMAIL-TEMPLATES.md](supabase/EMAIL-TEMPLATES.md) | Auth email copy |
| [HANDOVER.md](HANDOVER.md) | Current state and open threads |

---

## Known state

- **Email sign-up and sign-in work end to end.** Verified against production.
- **Google sign-in is not working.** The outbound leg reaches Google correctly;
  the return fails with `Unable to exchange external code`, which means the Google
  **Client Secret in the Supabase provider settings does not match** Google Cloud
  Console. A failed return now disables the button on that device and clears
  itself once a sign-in succeeds, so fixing the secret needs no redeploy.
- **Anonymous clients read nothing.** `listings`, `bids` and `profiles` all return
  zero rows without a session — RLS has no anon SELECT policy. Signed-in users see
  each other's data correctly, so the marketplace works; but any public "browse
  loads" page would render empty.
- **Posting a load from the UI can silently fail.** The dialog closes with no error
  and no row is created. Reproduced during the September audit.
- **Self-bidding is not blocked.** A listing owner can bid on their own load, which
  poisons the public bid record the product is built on. `0002_harden.sql` declares
  the constraint, so it appears never to have been applied.
- **Bids cannot be withdrawn.** `DELETE` returns 204 and removes nothing — there is
  no delete policy, so deny-by-default silently wins.
- **The board header shows simulated figures next to real ones.** "Open loads" and
  "Bids today" are computed from the seeded lane model, so the page can claim 143
  open loads directly above a board holding one.
- The `news` and `ai-search` edge functions are written but **not deployed**.

---

## Licence

None yet. All rights reserved until one is chosen.
