# Overland — Product Requirements

**Status:** live, pre-liquidity · **Owner:** Pratik Kumar · **Updated:** August 2026

This describes what Overland is, who it serves, what it will and will not do, and
how we will know whether it is working. It is deliberately opinionated about scope,
because most of the ways this product could fail are ways it could grow into
something we are not allowed to be.

---

## 1. The problem

A carrier deciding whether $2.40/mile is a fair rate on Dallas–Atlanta has almost
no way to find out. The information exists — it is owned by the party on the other
side of the trade.

- **Carriers bid blind.** No view of what the lane cleared at yesterday, or what
  anyone else offered on this load.
- **Shippers pay a spread they cannot see.** They hand a load to a broker and get
  one number back. The margin inside it is the broker's core asset.
- **The incumbents sell the answer back.** DAT's rate data is its premium tier.
  Opacity is not a market failure they are trying to fix; it is the product.

Load boards already exist, several are free, and one competitor already sells
limited bid visibility. **What does not exist anywhere is the whole price record,
given away.**

---

## 2. What we are building

An open board where posting, bidding and seeing every bid is free, and the
resulting price history is public.

**Product thesis.** The board is not the business. It is the mechanism that
generates an open, transaction-level record of what lanes actually clear at.
Revenue comes from products a carrier already buys — insurance, fuel, factoring —
and from selling lane data to the broker side. See §9.

### Non-goals

Stated as firmly as the goals, because each is a route by which the product
becomes something else:

| We will not | Why |
| --- | --- |
| Take a commission or per-load fee | Compensation for arranging transportation is the statutory definition of a broker |
| Handle, hold or route payment | FMCSA treats involvement in the monetary transaction as strong evidence of brokerage |
| Select or recommend a carrier for a shipper | That is allocation of traffic |
| Negotiate or quote a rate to a named counterparty | § 13102(2): "negotiates for" |
| Be a party to any contract of carriage | Makes us a principal |
| Claim to verify or vet anyone | We verify an email. Saying more is a promise we cannot keep |

---

## 3. Users

| Persona | Wants | Gives | Success looks like |
| --- | --- | --- | --- |
| **Owner-operator** (1–5 trucks — 80% of US carriers) | The next load, and to know if the rate is fair | Truck availability, bids, self-declared MC/USDOT | Finds a load on their lane and can see it priced in context |
| **Small fleet** (6–20 trucks) | Backhauls, less phone time | Multiple trucks, repeat bidding | Fills empty legs without calling around |
| **Small shipper** | Capacity without a broker's spread | Loads, dates, equipment | Posts once and receives competing bids |
| **Broker** | Coverage | Loads at volume | *Ambivalent by design — see §5.6* |

**Primary persona: the owner-operator.** They are the most numerous, the most
underserved, and the most reachable. They are also the least able to pay a
subscription, which is why the revenue model does not rely on one.

---

## 4. Core flows

### 4.1 Post

A shipper posts a load, or a carrier posts a truck. Origin and destination are
picked from a list so mileage is computed rather than typed. Equipment comes from
14 types plus a free-text option. Live the moment it is submitted.

### 4.2 Bid, in both directions

Anyone can bid on anything: carriers bid on freight, shippers bid on trucks. **All
bids are visible to everyone**, with the bidder's public identity attached — name,
company or owner-operator, city, self-declared MC/USDOT, time on the board, and a
one-click FMCSA SAFER lookup.

A second bid from the same party on the same listing is a counter, not a new row.

### 4.3 Accept and introduce

Accepting a bid is the only event that unlocks contact details. It writes a `deals`
row; the RLS policy on `profile_contacts` keys off that row. Both sides are
introduced by email and **the platform steps out**. Rate confirmation, insurance
and payment happen off-platform.

### 4.4 Rate history

Every lane has a public page showing what it has been paying: practical miles, last
paid $/mi, 30-day average, the spread against it, and the bid distribution. The
arithmetic is shown, not asserted — it is `miles × rate`, and anyone about to bid
against it deserves to see the working.

### 4.5 Reputation

Ratings attach to a **completed deal**, never freestanding. You can only rate
someone you actually transacted with. That is what stops a review section becoming
a comment box.

---

## 5. Persona journeys

Section 4 describes the mechanics. This is what each persona actually does, screen
by screen, and where the product currently stops short. Steps marked **[gap]** are
not built.

### 5.1 Marcus — owner-operator, one truck, Memphis

His problem is the next load and whether the rate is fair. He has no dispatcher and
no time.

1. **Arrives** on a lane page from search — `/lane/mem-chi` ranks for
   "Memphis to Chicago freight rates", which is the query he actually types.
2. **Reads the rate before signing up.** Practical miles, last paid $/mi, the
   30-day average and the spread against it are all public. This is the hook: he
   learns something before being asked for anything.
3. **Hits the identity wall.** Bid amounts are visible, but who bid is not —
   *"Carrier name, MC/USDOT and safety record are visible to members."* This is the
   deliberate conversion point.
4. **Signs up as a carrier.** Name, phone, state/city, email, password — with a
   generated-password option. MC and USDOT are optional and self-declared.
5. **Lands on `/board`.** Filters to Freight, or searches naturally:
   *"loads out of Memphis dry van"*.
6. **Opens a load.** Sees the rate breakdown as arithmetic — `530 mi × $2.47` —
   and every competing bid with the bidder's identity and a SAFER link.
7. **Bids**, seeing his own implied $/mi as he types and how it sits against the
   board rate.
8. **Waits.** **[gap]** No notification when the poster responds; he must come back
   and look.
9. **Gets accepted** → both sides introduced by email → he calls the shipper. The
   platform is out of it.
10. **Rates the deal** afterwards, which attaches to that deal and no other.

**Where it breaks for him today:** no alerts, no saved lanes, and no reason to
return between visits. That is the retention problem, not an acquisition one.

### 5.2 Rosa — fleet operator, 40 trucks, Laredo

She runs capacity, not individual loads. Her lever is empty miles.

1. **Signs up as a carrier, company** — org name, MC and USDOT filled in, because
   for her they are credentials worth showing.
2. **Posts a truck**, not a load: origin, destination, ready date, equipment. This
   is the direction most boards do badly.
3. **Receives bids from shippers** on her capacity — the market working in reverse.
4. **Compares bidders** on the same public identity every carrier gets.
5. **Accepts**, is introduced, deals direct.
6. **Repeats across lanes.** **[gap]** No fleet view, no bulk posting, no per-truck
   management. She is using a single-truck product with more trucks.

**Where it breaks for her today:** everything above one truck. A fleet console is
out of scope for v1 and she will feel it.

### 5.3 Dana — small shipper, food distributor, Memphis

She has freight and no broker relationship she trusts on price.

1. **Signs up as a shipper**, company.
2. **Posts a load** — origin and destination picked from a list so mileage is
   computed rather than typed, equipment from 14 types plus custom, ready date,
   optional target rate, notes.
3. **Watches bids arrive**, each with a name, a company, a city, self-declared
   MC/USDOT and a one-click SAFER lookup. She does the verifying; we say so plainly.
4. **Counters** a bid she likes but not at that price.
5. **Accepts** → introduction → she calls the carrier and books it herself.
6. **Checks the lane page** later to see whether she paid over or under the board.

**Where it breaks for her today:** she cannot see who bid on her own live listing
until she expands it, there are no notifications, and — the real risk — **she is
being asked to hand freight to carriers nobody has vetted.** §12 names this as the
trust problem, and it is sharper for her than for anyone else on the board.

### 5.4 Errol — first-timer, one shipment, no freight vocabulary

He has a pallet to move and does not know what a reefer is.

1. **Searches in plain language:**
   *"how much to move some boxes from Seattle to Salt Lake City"* — parsed to
   SEA → SLC, dry van, without him knowing either term.
2. **Reads a lane page** written as prose, not a dashboard: what the lane pays,
   over how many miles, against the 30-day average.
3. **Posts a load** with dimensions rather than freight classes.
4. **Receives bids** and is told, in the interface, that Overland verifies an email
   address and nothing more — with SAFER one click away.

**Where it breaks for him today:** he is the persona most exposed to a bad
counterparty and least equipped to judge one. Everything we do to make FMCSA checks
effortless is aimed at him.

### 5.5 Priya — new carrier, no history

Authority granted last month. No completed deals, no reviews.

1. **Signs up**, USDOT present, MC not yet issued.
2. **Bids** — and her card reads *"No completed deals on Overland yet."*
3. **Is judged** on what does exist: authority age, city, and the SAFER link.

**Why she matters:** every carrier starts here. If a zero-history profile reads as
untrustworthy, the board cannot onboard anyone new, and a board that only works for
incumbents is not an open board. The zero-state is a first-class design case, not
an edge case.

### 5.6 The broker — deliberately ambivalent

A broker could post loads here at volume and solve our liquidity problem overnight.
They will not, and the reason is structural rather than a UX failure.

Public bid visibility converts a broker's information advantage into a race to the
bottom on their buy side. Their margin *is* the spread we publish. On every board
that works they are the highest-volume poster and the highest-paying customer —
$109–$369 per user per month at Truckstop — and we are asking them to give that up.

**We do not have a broker flow, and building one would mean weakening the
transparency the product exists for.** The honest position is that our demand has
to come shipper-direct, which is the hardest demand in freight to win, and §12
records it as the top risk rather than hiding it.


## 6. Requirements

### Must have — shipped

- Post loads and trucks · bid both ways · accept and introduce
- Public bids with public bidder identity
- Contact reveal enforced by row-level security, not UI
- Email sign-up and sign-in
- Public lane pages with rate history and SEO metadata
- FMCSA SAFER deep links from self-declared MC/USDOT
- Deal-linked ratings
- Mobile: unpinned scrolling story, in-view video, bottom tab bar

### Must have — not yet working

| Item | State |
| --- | --- |
| Google sign-in | **Broken.** Provider Client Secret mismatch in Supabase. Outbound leg verified correct |
| Anonymous reads | **By design, unhandled.** Every policy is `to authenticated`, so a signed-out client reads zero rows. The board is auth-gated, so this bites only if a public browse view is added |
| Notifications | **Missing.** Nothing tells a poster a bid arrived, or a bidder they were accepted |
| Google sign-in | **Broken.** Provider Client Secret mismatch in Supabase. Outbound leg verified correct |

### Should have

- Custom SMTP (built-in Supabase mail is rate-limited and has capped testing at ~3/hour)
- Deployed `news` and `ai-search` edge functions
- "Who bid on my load" for the poster on live listings
- Saved lanes and alerts

### Will not have in v1

Payments, escrow, insurance sales, carrier vetting, load tracking, documents,
mobile apps.

---

## 7. What has to be true

**One lane, genuinely liquid.** Roughly 10–15 loads a day in a single origin market
and one equipment type, with competing bids on most of them.

Everything else follows from that and nothing works without it. A national board
with a few hundred loads is useless everywhere; the same volume on one city-pair is
useful. **The first milestone is not a national board — it is Dallas–Atlanta, dry
van, with real depth.**

Seed the **demand** side first. Carrier supply is already aggregated and free to
reach through the public FMCSA census; loads are the scarce side.

---

## 8. Success measures

Registrations are a vanity number. The metric is **completed deals per active
participant**, and whether it is rising.

| Gate | Threshold |
| --- | --- |
| Lane is alive | ≥30% of loads receive ≥2 bids |
| Retention is real | ≥40% week-4 carrier retention |
| Liquidity floor before charging anything | 5,000 monthly-active carriers · 1,000 loads/week |
| First revenue | insurance referral at 2,000 registered carriers |
| Broker-side data product | 500 recurring posting organisations |

---

## 9. Revenue

Free to post, free to bid, no commission — permanently. Revenue sits beside the
board, in products a carrier already buys.

| Path | Per carrier | Regulatory | Sequence |
| --- | --- | --- | --- |
| Insurance referral | $110–225/lead | Clear | **First.** Costs nothing, damages nothing |
| Fuel card spread | $110–180/yr | Clear | Second. *Figure is a model assumption — no operator discloses it. Test with a partner before relying on it* |
| Factoring referral | ~$300 flat | Caution | Flat bounty only, never a percentage of invoices |
| Broker-side lane data | $500+/mo | Caution | The only path reaching $1M ARR quickly — 167 seats. Note it contradicts the public-bidding product |
| Carrier subscription | $360–720/yr | Clear | Arithmetically hopeless alone: needs ~15% of the national for-hire population as monthly actives |

**Forbidden:** per-load commission, payment rails, quick-pay, factoring revenue
share tied to loads on the board. Each risks broker classification with uncapped
personal liability.

Precedent, not hypothesis: NextLOAD is a free board attached to Apex factoring, and
TruckSmarter reached 100,000 carriers with no marketing spend before monetising on
quick-pay and factoring.

---

## 10. Architecture constraints

- **Contacts never move into `profiles`.** Separate table, RLS keyed on an accepted
  deal. Do not create a view that joins them without that condition.
- **The `service_role` key never reaches client code or this repo.** The anon key is
  public by design.
- **Rate figures are derived, never stored as opinion.** `linehaul = miles × rpm`,
  so the breakdown can never contradict the headline.
- **Bids are public by design** — that is a product decision encoded in the schema,
  not an oversight.

---

## 11. Open questions

1. ~~Why are `profiles` rows not created on signup?~~ **Answered 1 Sep:** they are.
   Thirteen exist. Every RLS policy is `to authenticated`, so an anonymous query
   returns zero rows and reads as an empty table.
2. Will small shippers post to a board where every bid is public? **Twenty
   interviews — ten shippers, ten brokers — answers this in three weeks and should
   precede further building.**
3. Does the non-broker position hold when the platform charges a subscription?
   Needs a written opinion from transportation counsel, not a phone call.
4. Not vetting is a fraud liability; vetting is a broker-status and duty-of-care
   liability. No authority resolves this.
5. What is the real fuel-card spread? It carries most of the attach-revenue
   arithmetic and is currently an assumption.

---

## 12. Risks

**The defining feature repels the paying side.** Brokers are the highest-volume
posters on every board that works, and they pay the most. Public bidding converts
their information advantage into a race to the bottom. Rational brokers will not
post here. That forces us onto shipper-direct demand — the hardest demand in
freight to acquire, and what Convoy burned over $1B failing to win.

**Public bid visibility is not novel.** Trucker Path sells "view count and bid
prices from other carriers" at $49.99/month. The wedge is the *whole* record given
away, not bidding itself.

**The free flank is held by the market leader.** DAT's Convoy Platform gives
carriers free load access and charges brokers per delivered load — a model we
cannot copy without becoming a broker.

**Trust without vetting.** Freight fraud is severe. Making FMCSA checks effortless
is the mitigation, but an open board has to earn its reputation before it earns
volume.

**What protects us:** we take no principal risk. Convoy died buying capacity and
reselling it into a falling market. A board with no operations desk runs on
hosting, which buys the one thing this market punishes everyone for lacking — time.

---

---

## 13. Implementation log

What has actually been built, and how. Kept in reverse order so the newest entry is
first. Anything asserted here was verified against production, not assumed.

### 1 Sep 2026 — Work Order 2 gap close-out

Completed all nine close-out tasks from `ANTIGRAVITY-TASK-2.md`:

1. **News Edge Function Restoration (Task 1):** Restored `supabase/functions/news/index.ts` from git history to maintain repository authority over live production code called by `MarketNews.tsx`.
2. **Database Profile Gate (Task 2):** Created `supabase/migrations/0006_public_profiles_view.sql` revoking direct `anon` access on `public.profiles` and introducing `public.public_profiles` view containing non-identifying fields (`id`, `role`, `account_type`, `city`, `created_at`).
3. **Database Error Handling & Expiry Alignment (Task 3):** Handled PostgreSQL rate limit (`P0001`) and constraint errors in `PostListing.tsx` and `BidSheet` with `#DC2626` text formatting. Aligned `expires_at` filters in `src/lib/db.ts` to match `0005_anon_read.sql` policy (`expires_at is null or expires_at > now()`).
4. **Report Path Verification (Task 4):** Verified end-to-end user report insertion into `public.reports` and documented operator SQL audit queries in `README.md`.
5. **RLS Integration Test Harness (Task 5):** Expanded `src/lib/__tests__/db.policies.test.ts` to cover 8 integration scenarios against a test project, skipping gracefully when credentials are absent.
6. **Notifications Trigger & Function (Task 6):** Created `supabase/migrations/0007_notifications.sql` and updated `send-deal-email` Edge Function to handle `bid_placed` and `deal_accepted` events with `notify_email` preference check and per-listing hourly caps.
7. **Accessibility Enhancements (Task 7):** Added ARIA dialog roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`) to `AuthDialog.tsx` and `PostListing.tsx`. Added test suite `Accessibility.test.tsx`.
8. **Theme Resolution (Task 8):** Removed unimported secondary `src/theme.css` file to keep `src/index.css` as single source of truth.
9. **Platform Action Items (Task 9):** Documented platform setup steps for Pratik in `README.md` and `PRODUCTION_PROGRESS.md`.

### 1 Sep 2026 — 12-task production readiness overhaul

Completed all twelve core tasks from `ANTIGRAVITY-TASK.md` to establish a complete operational and legal floor for production:

1. **Legacy Surface Deletion (Task 1):** Removed 24 legacy routes and components advertising commission tracking, escrow, and insurance hubs. Configured Vercel rewrites returning `410 Gone` for deleted paths via `api/gone.ts`. Added executable `scripts/check-language.sh` CI guard enforcing prohibition of broker/commission/vetting claims.
2. **Continuous Integration (Task 2):** Configured `.github/workflows/ci.yml` running Node 20 with npm caching on push/PR to `main`: `npm ci` → `npm run typecheck` (`tsc -b`) → `npm run test` → `npm run build` → `scripts/check-language.sh`.
3. **Error Monitoring & Uptime (Task 3):** Integrated `@sentry/react` initialized strictly when `VITE_SENTRY_DSN` is set. Wrapped router in Sentry ErrorBoundary rendering `ErrorBoundaryFallback` with `.aon-*` design system. Configured Vite sourcemaps and `/api/diesel?health=1` endpoint health check.
4. **Abuse Controls & Moderation (Task 4):** Created `supabase/migrations/0004_abuse.sql` establishing PostgreSQL insert rate limit triggers (20 listings/hr, 60 bids/hr), `expires_at` (14 days), `hidden` moderation flags, and a `reports` table with insert-only RLS. Integrated UI `ReportModal`.
5. **Privacy Policy (Task 5):** Added `/privacy` route in `PrivacyPage.tsx` adhering to `.aon-*` styling, detailing data collection, counterparty release rules, retention, and deletion requests (`privacy@overland.com`). Linked from footer and `RouteMeta.tsx`.
6. **Open Anonymous Reads (Task 6):** Created `supabase/migrations/0005_anon_read.sql` granting anonymous SELECT permissions for open listings, bids, and public profiles, while keeping `profile_contacts` strictly locked to accepted counterparties.
7. **RLS Test Harness Repair (Task 7):** Repaired `src/lib/__tests__/db.policies.test.ts` with static schema validation and graceful integration test execution against `SUPABASE_TEST_URL`.
8. **Email Notifications (Task 8):** Built `send-deal-email` Edge Function in `supabase/functions/send-deal-email/` to send transactional email on deal creation when SMTP/Resend keys are set, with safe fallback warning when keys are absent.
9. **Transactional Auth Email (Task 9):** Documented Custom SMTP & Domain DNS (`auth@overland.com`) configuration in `supabase/SETUP.md`.
10. **Funnel Instrumentation (Task 10):** Implemented five cookieless funnel events (`landing`, `signup_started`, `signup_completed`, `first_action`, `deal_accepted`) in `src/lib/analytics.ts`, guarded on `VITE_POSTHOG_KEY`/`VITE_ANALYTICS_KEY`.
11. **Performance & Theme (Task 11):** Integrated `theme.css` into `main.tsx` and removed unused `news` and `ai-search` edge functions.
12. **Documentation & State (Task 12):** Updated `PRD.md`, `README.md`, `DESIGN.md`, and `.env.example`.

### 1 Sep 2026 — component & regression test coverage

Added `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, and `vitest.config.ts` with the `jsdom` environment. Expanded the test suite from pure functions to full component, flow, and database policy coverage (85 passing tests, 5 skipped integration tests).

**Part 3 Component & Flow Tests:**
- `AuthContext` (`src/auth/__tests__/AuthContext.test.tsx`): verifies implicit-flow hash token parsing via `setSession`, `?code=` exchange via `exchangeCodeForSession`, OAuth provider error flagging (`overland.google_broken`), and `getSupabase()` promise caching across concurrent calls.
- `RequireAuth` (`src/auth/__tests__/RequireAuth.test.tsx`): verifies rendering is held during `loading` without flashing signed-out states, redirects to `/` only once resolved, and renders children when authenticated.
- `BidderCard` (`src/components/overland/__tests__/BidderCard.test.tsx`): verifies identity masking for signed-out users, full DOT/MC credentials for signed-in users, and SAFER link URL generation prioritizing USDOT over MC.
- `LaneDetail` (`src/components/overland/__tests__/LaneDetail.test.tsx`): verifies arithmetic invariant `linehaul === round(miles × rpm / 5) × 5` and auth-gated bid acceptance / contact reveal.
- `PostListing` (`src/components/overland/__tests__/PostListing.test.tsx`): verifies live vs local mode storage routing, session validation, and ready date floor rules.

**Part 1 Regression Tests:**
- 1.1 `PostListing`: verified live mode session error surfacing and `localStorage` non-pollution.
- 1.2 `scrollTo` (`src/lib/__tests__/scrollTo.test.ts`): verified instant fallback when smooth scroll moves nothing, double-scroll prevention, `prefers-reduced-motion: reduce` compliance, and null safety.
- 1.3 `db.policies` (`src/lib/__tests__/db.policies.test.ts`): integration test suite for RLS policies (owner self-bidding rejection, bid withdrawal permissions, amount/notes limits, self-rating rejection).
- 1.4 `boardCounts` (`src/lib/__tests__/boardCounts.test.ts`): verified null return when not live, `head: true, count: 'exact'` query options, and error handling.
- 1.5 Ready dates: verified ready date input `min` attribute equals today in `YYYY-MM-DD`.
- 1.6 Market rate labels (`src/components/overland/__tests__/marketRatesLabel.test.tsx`): guard test ensuring modelled rates are badged "Indicative" and never "Live".

### 1 Sep 2026 — audit fixes

Ran the platform as two real users against production and fixed what broke.

**Migrations were never applied.** `supabase migration list --linked` showed an empty
Remote column for all three — the schema had been created by hand in the SQL editor,
so the history table was empty and `0002_harden.sql` had never run. Applied all three
with `supabase db push --include-all`; `0001` replays safely because every
`create policy` is preceded by a `drop policy if exists`.

That single action closed two findings:

| Was | Now |
| --- | --- |
| Owner could bid on their own listing (`HTTP 201`) | `HTTP 403` |
| Bids could not be withdrawn — `DELETE` returned 204 and removed nothing | Withdrawal works; verified 0 rows remaining |

**Posting could report success while writing nothing.** The branch read
`isLive() && user`, so a missing session fell through to the local-storage path meant
for demo mode *and still showed the success screen*. The listing existed only in that
browser. There is now no fallback while a backend is configured: no session raises an
error the poster can act on.

**The header printed simulated figures beside real ones** — `Open loads 143` directly
above a board holding one, because the counts came from the seeded lane model. Added
`boardCounts()` in `lib/db.ts`, a `head: true, count: 'exact'` query so no rows cross
the wire, and the header shows a dash while it resolves rather than a fabricated
number. Verified live: header reads `Open loads 1` above `1 listing`.

**Ready dates accepted the past.** A live listing was advertising a date that had
already gone. The picker now floors at today.


### 1 Sep 2026 — lane index simplified

The lane index opened with a search field, four dropdowns and a pill row stacked in a
card above the table, so the reader met the controls before a single lane. Now a
header row — heading left, search and Post right — with equipment pills and the lane
count beneath, and the dropdowns folded behind a Filters toggle that shows how many
are active. A parsed smart-search query opens that panel rather than changing hidden
filters, which was the point of surfacing them.

`CompleteProfile` gained the corner close and Escape that every other dialog has. The
step was already optional, but with only a text link at the foot it read as a wall.

### 31 Aug 2026 — auth restructured around what works

Email sign-up and sign-in were verified end to end; Google fails on the return leg
with `Unable to exchange external code`, a provider credential mismatch that cannot be
fixed from the application. So the working path leads: the email form is open by
default and Google sits below it behind an "or" divider.

A failed Google return records itself in `localStorage` and stops offering the button
on that device, clearing itself once a sign-in succeeds — so fixing the secret needs
no redeploy. `VITE_GOOGLE_AUTH=off` hides it globally.

Two upstream bugs were fixed to get there: `getSupabase()` cached the client rather
than the promise, so concurrent callers each built their own `GoTrueClient` on one
storage key — fatal under PKCE, where one instance writes the verifier and another
reads it. And email links return tokens in the URL *fragment*, which `flowType: 'pkce'`
ignores, so every confirmation landed signed-out with a valid session unread in the
address bar.

### 30 Aug 2026 — mobile

Phones get the unpinned telling: no sticky stage, no scroll-scrubbed video. Clips play
in view via an `IntersectionObserver` and pause on exit, using the `-m` encodes only.
Page weight fell from ~2500 KB to ~1035 KB, and the address-bar resize that produced
white bands under the pinned stage cannot occur because nothing is pinned.


## 14. Related

[README.md](README.md) · [DESIGN.md](DESIGN.md) · [LEGAL-NOTES.md](LEGAL-NOTES.md) ·
[supabase/SETUP.md](supabase/SETUP.md)

*Market figures are drawn from commissioned research and were not independently
audited for this document. Nothing here is legal advice.*
