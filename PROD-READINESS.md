# Production readiness — work order 2

Repository: `~/Downloads/overland` · Live: `https://overland-5c4.pages.dev`
Written: 1 Sep 2026 · Supersedes nothing in `AUDIT-BRIEF.md`; that work is done

---

## Where we actually are

The test work landed and it is good: 85 unit tests, `tsc -b` clean, build clean.
But test coverage was the *third* most important thing on this repo, and finishing
it has not moved the product materially closer to production.

The honest summary is that **Overland is a working demo with no operational
floor underneath it**. There is no CI, so the 85 tests run only when someone
remembers. There is no error reporting, so a white screen for every user is
invisible until a human complains. Auth email goes through Supabase's built-in
sender, which is rate-limited and explicitly not for production. Nothing is rate
limited, nothing expires, and there is no way to remove a fraudulent listing.

And there is one item that is not a readiness gap but a live contradiction — see
P0.1. It should be fixed today, ahead of everything else in this document.

Ordered by what blocks a launch, not by what is interesting to build.

---

## P0 — blocks launch

### 0.1 The deployed site sells commission, escrow and insurance

**This is the highest-priority item in the repository.**

`README.md` and `PRD.md` §2 state the platform takes no commission, never handles
money, provides no insurance, and is not a broker — because under 49 CFR 371.2
and 49 U.S.C. § 14916(d) those facts are what keep unlimited personal liability
away from the officers.

The deployed site currently contradicts every one of those claims. All of the
following return **HTTP 200 to the public**, and `robots.txt` is `Allow: /`:

```
/broker-dashboard          /corporate/insurance-hub      /gps-tracking
/corporate/erp-integration /fleet-bidding-exchange       /post-loads
… ~24 legacy routes in total
```

Counted in `src/`: **95 occurrences of "commission"**, one of **"escrow"**, seven
of **"Insurance Hub"**. There is a `CommissionTrackingPage.tsx`, a
`commission/CommissionTable.tsx`, a `commission/EarningsSnapshot.tsx`, and three
insurance pages. The word "commission" appears in the HTML served for
`/broker-dashboard`, so it is crawlable, quotable and archivable.

These are Lovable scaffolding from before the product had its current shape. They
were never deleted, only orphaned from the nav.

**Do:**

1. Delete the legacy route group from `src/App.tsx` and the components behind it —
   `commission/`, `broker/`, `corporate/`, the insurance pages, the dashboards,
   the GPS and ERP pages. Anything on the `.ov-*` layer that is not `/`,
   `/board`, `/lane/:slug` or `/terms`.
2. Return **410 Gone**, not a redirect, for anything already indexed.
3. Add a CI grep that fails the build on `commission`, `escrow`, `we vet`,
   `verified carrier`, `guaranteed payment` outside `LEGAL-NOTES.md` and
   `TermsPage.tsx`. This is the only category of bug in this codebase that carries
   personal financial liability, so it deserves a mechanical guard rather than
   vigilance.
4. Re-read the remaining copy for implied vetting. "We verify an email address and
   nothing more" is the only claim the product can support.

Deleting ~24 routes also removes the `.ov-*`/`.aon-*` dual-layer problem that
`DESIGN.md` calls this repo's most common visual bug. Two liabilities, one delete.

### 0.2 No CI

85 tests that run when someone remembers are not a safety net; they are a
document. Every bug in `AUDIT-BRIEF.md` Part 1 type-checked and passed the suite
that existed at the time.

**Do:** `.github/workflows/ci.yml` on push and PR — `npm ci`, `npm run typecheck`,
`npm run test`, `npm run build`, plus the P0.1 grep. Make it a required check.
Thirty minutes of work, and without it the entire test effort decays.

### 0.3 No error or uptime monitoring

If the board white-screens for every user tomorrow, we find out when somebody
tells us.

**Do:** Sentry (free tier is sufficient), with source maps uploaded from the
Vercel build so stack traces are readable, and `tracesSampleRate` low. Add an
uptime check on `/` and on `/api/diesel` — the diesel strip fails silently by
design, which is right for users and means a dead EIA key would otherwise go
unnoticed indefinitely. Know the baseline error rate *before* there are users.

### 0.4 Auth email runs on Supabase's built-in sender

Every signup confirmation goes through Supabase's default SMTP, which is rate
limited — testing hit **429** — and documented as not for production. Freight
operators are on Gmail and Outlook, and unauthenticated mail from a young domain
lands in spam. A confirmation in spam is a dead signup, and we would not see it.

**Do:** Resend or Postmark as custom SMTP in Supabase Auth. Verify the sending
domain with SPF, DKIM and DMARC. **This has DNS lead time and reputation warm-up,
so start it first even though the code change is trivial.**

### 0.5 Nothing prevents abuse

No rate limit on posting or bidding, no listing expiry, no report path, no way for
an operator to remove a fraudulent load. One script can create ten thousand
listings.

For most products spam is noise. Here the public price record *is* the asset, so
poisoning it destroys the thing the company is built to own.

**Do, in the database rather than the client:**

- A trigger or policy capping inserts per user per hour on `listings` and `bids`.
- `expires_at` on `listings`, defaulting to ready date + 14 days, filtered out of
  the board. Stale freight is the classic load-board credibility failure.
- A `reports` table and a report control on every listing and bid.
- A minimal admin ability to hide a row — a boolean plus a policy is enough; do
  not build a console.

### 0.6 Backups have never been restored

**Do:** confirm the Supabase plan's backup retention, then restore one into a
scratch project and count the rows. A backup nobody has restored is a hypothesis.

### 0.7 No privacy policy

`/terms` exists; there is no privacy page, and the product collects names, emails
and phone numbers from US users, including California.

**Do:** add `/privacy` covering what is collected, that bids and public profile
fields are public by design, that contacts are released only on an accepted deal,
retention, and deletion requests. Link both from the footer and the signup dialog.

---

## P1 — the first weeks of real traffic

### 1.1 Notifications — decision made, build it

`AUDIT-BRIEF.md` 2.2 left this open. **Send email, not in-app.**

The primary persona is driving. He will not have a tab open. In-app notifications
serve products people live in, and nobody lives in a load board.

**Do:** a Postgres trigger on `bids` insert and on `deals` insert, calling an edge
function. Exactly two messages — *you received a bid* and *your bid was accepted*.
Both carry an unsubscribe link and a per-listing hourly cap, so a popular load does
not send forty emails. Depends on 0.4.

This is also the single biggest retention gap in the product, per PRD §5.1 step 8.

### 1.2 Anonymous reads — decision made, open them

`AUDIT-BRIEF.md` 2.3 left this open. **Open `listings` and the public columns of
`profiles` to anon. Never `profile_contacts`.**

The distribution strategy in PRD §5.1 is organic search on lane pages — Marcus
arriving from "Memphis to Chicago freight rates". **Googlebot is an anonymous
client.** It currently reads zero rows, so those pages render empty and rank for
nothing. We are auth-gating the crawler that the acquisition plan depends on.

The product already gates the right thing: bid *amounts* are public, bidder
*identity* is not. The RLS policies gate existence instead. Make the database
match the design.

This also unblocks the RLS integration tests, which currently fail with
`permission denied` because they authenticate as anon.

### 1.3 The RLS integration suite is red and unfinished

`src/lib/__tests__/db.policies.test.ts` — five tests, previously unreachable
because the vitest config hardcoded a `fake` Supabase URL. That is fixed; they now
run, and two fail with `permission denied for table listings`.

**Do:** give the harness two real signed-in sessions — sign in as two seeded test
users, use their tokens, tear down the rows afterwards. Then run it in CI against
a dedicated Supabase test project, on a schedule rather than on every push. These
five tests cover the row-level security that is the entire privacy promise; they
are the most valuable tests in the repository and today they cover nothing.

### 1.4 No funnel instrumentation

We cannot answer how many visitors hit the identity wall in PRD §5.1 step 3, or
what share converted. That number determines whether the product works.

**Do:** five events — landing, signup started, signup completed, first post or
bid, accept. Plausible or PostHog. Cookieless keeps the privacy policy short.

### 1.5 No staging

Everything deploys to production on push, including migrations.

**Do:** a second Supabase project for a `staging` branch, and hold migrations to
preview deploys first. The first bad migration is the one that teaches this
lesson, and it teaches it on live data.

---

## P2 — quality, once the above holds

- **Bundle.** `index` is 390 kB (123 kB gzip) and Recharts adds 364 kB (100 kB).
  Route-split Recharts off the homepage; the first screen does not chart.
- **Accessibility.** Run axe on the homepage, board, lane page, auth dialog and
  post dialog. Freight skews older; this is a real user population, not a checkbox.
- **`src/theme.css` is imported nowhere.** Adopt it or delete it. A second theme
  file that nothing loads is a trap for the next person. Note that adopting it
  changes the focus ring from `#0E32E8` to `#1E4D6B`.
- **Deploy or delete the `news` and `ai-search` edge functions.** Written, never
  deployed, currently just surface area.

---

## Not for Antigravity — Pratik only

- **Rotate the Google OAuth client secret.** It was pasted into a chat transcript.
  Rotating also fixes `AUDIT-BRIEF.md` 2.1, which is a Supabase console mismatch
  and not a code bug.
- **Delete the test accounts** in `~/Downloads/overland-leads/overland-test-accounts.csv`,
  especially `pratik@aonamitech.com`.
- **Delete the duplicate empty repo** at `pratikkpp24/overland`.
- **Choose a licence.** `README.md` says none yet.

---

## Rules, unchanged

1. Read `DESIGN.md` before touching UI. Two layers; mixing them is the common bug.
2. `text-red-*` renders **blue** — Tailwind's red scale is remapped. Errors use
   `#DC2626` literally.
3. Never move `email`/`phone` into `profiles`; never expose a view joining them
   without the accepted-deal condition.
4. Never add commission, payment handling, escrow or carrier selection. See P0.1
   for what happens when this rule is only written down and not enforced.
5. Verify against a rendered page, not the diff.
6. Update `PRD.md` §13 with what changed and how.

---

## Prompt to start with

> You are working in `~/Downloads/overland`. Read `PROD-READINESS.md`, then
> `DESIGN.md` and `LEGAL-NOTES.md`.
>
> Start with **P0.1** and do nothing else until it is finished. The deployed site
> serves ~24 legacy routes advertising commission tracking, escrow and an
> insurance hub, all of which the product's legal posture depends on not offering.
> Delete those routes and the components behind them, return 410 for the paths,
> and add the CI grep that keeps the language out.
>
> Then **P0.2** (CI), **P0.3** (Sentry) and **P0.5** (rate limits, expiry,
> reports) in that order. P0.4, P0.6 and P0.7 need Pratik — flag them and move on.
>
> Verify with `npm run typecheck` (this is `tsc -b`; the bare `tsc --noEmit`
> checks nothing here) and `npm run test`. For P0.1, verify against the deployed
> site with curl, not against the diff — the point is what the public receives.
>
> The P1 decisions in 1.1 and 1.2 are made; do not reopen them. Do not start P1
> until every P0 is closed.
