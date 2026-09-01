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
| [PROD-READINESS.md](PROD-READINESS.md) | What blocks a production launch, in priority order |
| [AUDIT-BRIEF.md](AUDIT-BRIEF.md) | Open bugs, missing test coverage, and the work order for fixing them |
| [DESIGN.md](DESIGN.md) | The design system, the two layers, and the footguns that have actually bitten |
| [LEGAL-NOTES.md](LEGAL-NOTES.md) | Broker-status boundary and what must never be built |
| [supabase/SETUP.md](supabase/SETUP.md) | Database setup and migrations |
| [supabase/EMAIL-TEMPLATES.md](supabase/EMAIL-TEMPLATES.md) | Auth email copy |
| [HANDOVER.md](HANDOVER.md) | Current state and open threads |

---

## Known state

**Fixed and now covered by regression tests** (see `AUDIT-BRIEF.md` Part 1):
posting no longer reports success while writing nothing; smooth scrolling has a
working fallback; self-bidding is rejected and bids can be withdrawn, after
`0002_harden.sql` turned out never to have been applied; the board header no
longer prints modelled figures beside real ones; ready dates cannot be in the
past; modelled rates are badged "Indicative" rather than "Live".

Open, in priority order — the detail and the work order are in
[PROD-READINESS.md](PROD-READINESS.md):

- **~24 legacy routes are publicly reachable and advertise commission tracking,
  escrow and an insurance hub** — none of which this product offers, and all of
  which its legal posture depends on not offering. Highest priority in the repo.
- **No CI.** The 85 tests run only when someone remembers.
- **No error or uptime monitoring.** A white screen is invisible until reported.
- **Auth email uses Supabase's built-in sender**, which is rate-limited and not
  for production. Testing hit 429.
- **No rate limiting, listing expiry, or way to remove a fraudulent listing.**
- **Google sign-in is not working.** The outbound leg is correct; the return
  fails with `Unable to exchange external code`, meaning the Client Secret in the
  Supabase provider settings does not match Google Cloud Console. A failed return
  disables the button on that device and clears itself on success, so fixing the
  secret needs no redeploy.
- **Anonymous clients read nothing.** No anon SELECT policy, so lane pages render
  empty for Googlebot — which the acquisition plan depends on. Decision made to
  open `listings` and public `profiles` columns; not yet done.
- **No notifications.** Nothing tells a poster a bid arrived, or a bidder they
  won. The largest retention gap.
- The `news` and `ai-search` edge functions are written but **not deployed**.

---

## Licence

None yet. All rights reserved until one is chosen.
