# Work order: make Overland production-functional

Repository: `~/Downloads/overland` · Live: `https://overland.aonamitech.com`
Read `PROD-READINESS.md`, `DESIGN.md` and `LEGAL-NOTES.md` before starting.

Twelve tasks, in dependency order. **Do them in order and do not batch them.**
Commit after each one with the task number in the message, so any single task can
be reverted without unpicking the others.

Some tasks need a credential only Pratik can supply. Those are marked
**NEEDS PRATIK**. For each, write the code, guard it so its absence is harmless,
document the variable in `.env.example`, and carry on — do not block.

---

## How to verify anything

```bash
npm install
npm run typecheck     # tsc -b — the ONLY real type check
npm run test          # vitest
npm run build
npm run dev           # localhost:8080
```

**`tsc --noEmit` passes without checking anything.** The root `tsconfig.json` has
`"files": []`, so only `tsc -b` walks the project references. Never verify with
the bare form.

**Verify user-visible work against a rendered page, not the diff.** Every bug in
the last audit type-checked and passed the suite that existed at the time.

---

## Hard rules

1. **Never add commission, payment handling, escrow, carrier selection, or any
   claim to vet or verify anyone.** Each risks broker classification under
   49 CFR 371.2, which attaches uncapped personal liability to officers under
   49 U.S.C. § 14916(d). The only claim the product can support is: *we verify an
   email address and nothing more.* See `LEGAL-NOTES.md`.
2. **Never move `email` or `phone` into `profiles`**, and never expose a view
   joining them without the accepted-deal condition. That policy *is* the privacy
   promise.
3. **`text-red-*` renders blue.** Tailwind's red scale is remapped to the Aonami
   blue ramp in this project. Errors use `#DC2626` literally.
4. **Read `DESIGN.md` before touching UI.** Two layers coexist in `index.css`;
   `.aon-*` is current, `.ov-*` is legacy. Mixing them is this repo's most common
   visual bug.
5. **Never commit a secret.** The Supabase anon key is public by design and safe
   in the bundle. The `service_role` key must never appear in the repo, in client
   code, or in a `VITE_`-prefixed variable. Anything `VITE_`-prefixed is inlined
   into the public bundle and **this repository is public**.
6. **`overflow-x: clip` in `index.css` is load-bearing.** `hidden` forces
   `overflow-y: auto`, which makes body its own scroll container and breaks
   `position: sticky` everywhere. Do not change it. Its cost is that Chromium
   ignores smooth scrolling on the document, which is why `src/lib/scrollTo.ts`
   exists — do not reintroduce `behavior: 'smooth'` anywhere.
7. If you think one of these rules is wrong, **say so and stop**. Do not edit
   around it.

---

## Task 1 — Delete the legacy surface

**This is the highest-priority item in the repository. Finish it before touching
anything else.**

`README.md` and `PRD.md` §2 state the platform takes no commission, never handles
money, provides no insurance, and is not a broker. The deployed site currently
contradicts all of that. These routes return **HTTP 200 to the public** and
`robots.txt` is `Allow: /`:

```
/broker-dashboard              /fleet-dashboard             /corporate-dashboard
/post-loads                    /hire-trucks                 /post-truck
/fleet-management              /gps-tracking                /fleet-support
/reports-analytics             /settings                    /fleet-settings
/corporate-bidding-exchange    /broker-bidding-exchange     /fleet-bidding-exchange
/corporate-bidding             /corporate/post-load         /corporate/bulk-upload
/corporate/erp-integration     /corporate/live-tracking     /corporate/insurance-hub
/corporate/bidding-dashboard   /corporate/analytics         /corporate/settings
```

In `src/`: **95 occurrences of "commission"**, one **"escrow"**, seven
**"Insurance Hub"**. There is a `CommissionTrackingPage.tsx`, a
`commission/CommissionTable.tsx`, an `EarningsSnapshot.tsx`, and three insurance
pages. The word "commission" appears in the HTML served for `/broker-dashboard`,
so it is crawlable and archivable.

These are Lovable scaffolding from before the product had its current shape. They
were orphaned from the nav but never deleted.

**Do:**

1. In `src/App.tsx`, keep exactly five routes: `/`, `/terms`, `/lane/:slug`,
   `/board`, and `*`. Delete the other 24.
2. Delete the components behind them. `src/components/commission/`,
   `broker/`, `corporate/`, `dashboard/`, `fleet/`, plus the insurance, GPS, ERP,
   settings and bidding-exchange pages. **The live routes import only from
   `@/components/overland/*` and `@/components/ScrollStory`, so this is a clean
   cut** — verified, nothing shared.
3. Return **410 Gone** for the deleted paths, not a redirect — they may be
   indexed, and 410 removes them faster than 404. Vercel rejects a `routes` block
   alongside `rewrites`, so add `api/gone.ts` returning status 410 with a short
   plain-text body, and put a rewrite **above** the SPA catch-all in
   `vercel.json`:

   ```json
   "rewrites": [
     { "source": "/(broker-dashboard|fleet-dashboard|…)", "destination": "/api/gone" },
     { "source": "/((?!api/|assets/).*)", "destination": "/index.html" }
   ]
   ```

   First match wins, so order matters. Keep the existing `api/|assets/` exclusion
   on the catch-all — without it `/api/diesel` returns the HTML shell.
4. Add `scripts/check-language.sh`, failing on `commission`, `escrow`, `we vet`,
   `verified carrier`, `guaranteed payment`, `we arrange`, `payment protection`
   anywhere in `src/` except `TermsPage.tsx` and `LEGAL-NOTES.md`. Wire it into
   Task 2. This is the only defect class here that carries personal financial
   liability, so it gets a mechanical guard rather than vigilance.
5. Re-read the surviving copy for implied vetting and remove any.

**Acceptance:** `npm run build` clean; `scripts/check-language.sh` exits 0; after
deploy, `curl -o /dev/null -w '%{http_code}' https://overland.aonamitech.com/broker-dashboard`
returns **410**; `/`, `/board`, `/lane/mem-chi` and `/api/diesel` all still work.

**Bonus:** this also removes most of the `.ov-*` layer, which `DESIGN.md` calls
the repo's most common visual bug. Update `DESIGN.md` to reflect what survives.

---

## Task 2 — Continuous integration

85 tests that run only when someone remembers are a document, not a safety net.
Every bug in the last audit passed the suite that existed at the time.

**Do:** `.github/workflows/ci.yml`, on push and pull request to `main`:
`npm ci` → `npm run typecheck` → `npm run test` → `npm run build` →
`scripts/check-language.sh`. Node 20, npm cache enabled. Then make it a required
status check on `main` (**NEEDS PRATIK** — repo setting, not code; leave a note).

**Acceptance:** a deliberate type error fails the workflow; reverting it passes.

---

## Task 3 — Error and uptime monitoring

If the board white-screens for every user tomorrow, we find out when somebody
tells us.

**Do:**

- Add `@sentry/react`. Initialise **only when `VITE_SENTRY_DSN` is set**, so
  local and preview builds stay silent. `tracesSampleRate: 0.1`,
  `replaysSessionSampleRate: 0`.
- Upload source maps from the Vercel build, otherwise stack traces are minified
  noise. Do not commit the auth token.
- Wrap the router in an error boundary that renders a real page — an apology, a
  link back to `/board`, and the event ID — not a blank screen.
- `/api/diesel` fails silently by design, which is right for users and means a
  dead EIA key would go unnoticed forever. Add an uptime check on `/` and
  `/api/diesel`. (**NEEDS PRATIK** for the monitor account; ship the endpoint
  health logic and document it.)

**NEEDS PRATIK:** `VITE_SENTRY_DSN`. Document it in `.env.example` as safe to
expose — a DSN is a write-only ingest key.

**Acceptance:** with no DSN set, no network call to Sentry. With one, a thrown
test error appears in the dashboard with a readable stack.

---

## Task 4 — Abuse controls

Nothing prevents one script creating ten thousand listings. There is no listing
expiry, no report path, and no way for an operator to remove a fraudulent load.

For most products spam is noise. Here **the public price record is the asset**, so
poisoning it destroys the thing the company exists to own.

**Do — in the database, in `supabase/migrations/0004_abuse.sql`.** Client-side
limits are decoration; Postgres is the enforcement point, exactly as with
`profile_contacts`.

- A trigger capping inserts per user per hour on `listings` and `bids`. Start
  generous — 20 listings, 60 bids — and raise `40x` with a clear message.
- `expires_at timestamptz` on `listings`, defaulting to ready date + 14 days,
  filtered out of every board query in `src/lib/db.ts`. Stale freight is the
  classic load-board credibility failure.
- A `reports` table (`reporter_id`, `subject_type`, `subject_id`, `reason`,
  `created_at`) with RLS: insert by any authenticated user, select by nobody.
- `hidden boolean default false` on `listings` and `bids`, excluded from every
  read. A boolean and a policy is enough — **do not build an admin console.**
- A report control on each listing and bid in the UI.

**Migrations have gone wrong here before.** `0002_harden.sql` was declared but
never applied, because the schema was hand-built in the SQL editor and the history
table was empty. Verify with `supabase migration list --linked` and confirm the
Remote column is populated before you call this done.

**Acceptance:** a script inserting 25 listings in a minute gets `40x` on the 21st;
an expired listing does not appear on the board; a hidden listing is invisible to
everyone including its owner's counterparties.

---

## Task 5 — Privacy policy

`/terms` exists. There is no privacy page, and the product collects names, emails
and phone numbers from US users including California.

**Do:** `/privacy`, on the `.aon-*` layer, matching `TermsPage.tsx` in structure.
Cover: what is collected; that **bids and public profile fields are public by
design**; that email and phone are released only on an accepted deal and enforced
by row-level security rather than UI; retention; how to request deletion; the EIA
and Supabase sub-processors. Link it from the footer and from `AuthDialog.tsx`
above the submit button.

Write it in the plain register of `README.md` — short sentences, no boilerplate,
no defined terms in capitals.

**Acceptance:** reachable, linked from both places, readable on a 375px viewport.

---

## Task 6 — Open anonymous reads

`supabase/migrations/0001_init.sql` makes every policy `to authenticated`. A
signed-out client reads zero rows from `listings`, `bids` and `profiles`.

**The acquisition plan is organic search on lane pages** — PRD §5.1 has Marcus
arriving from "Memphis to Chicago freight rates". **Googlebot is an anonymous
client.** Those pages render empty today, so they rank for nothing. We are
auth-gating the crawler the plan depends on.

The product already gates the right thing: bid *amounts* are public, bidder
*identity* is not. The policies gate *existence* instead. Make the database match
the design.

**Do:** `supabase/migrations/0005_anon_read.sql` — anon `SELECT` on `listings`
(not hidden, not expired), on `bids` (amount, created_at, listing_id), and on the
public columns of `profiles`. **Never on `profile_contacts`.** Then confirm
`BidderCard.tsx` still masks identity for signed-out visitors — the gate moves
from the database to the component for this one field, so it must be tested.

**Acceptance:** `curl` with only the anon key returns listing rows and bid amounts
and **zero** rows from `profile_contacts`; a signed-out browser sees bid amounts
on a lane page with identity masked; `RequireAuth` still gates `/board`.

---

## Task 7 — Repair the RLS test harness

`src/lib/__tests__/db.policies.test.ts` holds five tests covering the row-level
security that is the entire privacy promise. They were unreachable — the vitest
config hardcoded a `fake` Supabase URL and the suite skips on `fake`. That is
fixed; they now run, and **two fail** with `permission denied for table listings`
because the harness authenticates as anon.

**Do:** sign in as two seeded test users, use their sessions, and tear down every
row afterwards. Add a sixth test asserting a user cannot read another's
`profile_contacts` without an accepted deal, and a seventh asserting they *can*
with one. Run this suite in CI against a **dedicated Supabase test project**, on a
schedule rather than on every push.

**NEEDS PRATIK:** the test project URL and anon key, plus two seeded users.

**Acceptance:** all seven pass against the test project; the unit suite still
passes with no credentials set.

---

## Task 8 — Notifications

Nothing tells a poster a bid arrived, or a bidder they won. PRD §5.1 step 8 marks
this a gap; it is the largest retention problem in the product.

**The decision is made: email, not in-app.** The primary persona is driving. He
will not have a tab open. In-app notifications serve products people live in, and
nobody lives in a load board. **Do not reopen this.**

**Do:**

- A Postgres trigger on `bids` insert and `deals` insert calling an edge function
  in `supabase/functions/notify/`.
- **Exactly two messages:** *you received a bid* and *your bid was accepted*.
  Nothing else, no digest, no marketing.
- Every message carries a one-click unsubscribe honoured by a `notify_email`
  boolean on `profiles`, and a **per-listing hourly cap** so a popular load does
  not send forty emails.
- Copy in the register of `supabase/EMAIL-TEMPLATES.md`. The acceptance email must
  not imply the platform is party to the deal — it introduces two people and steps
  out. Re-read rule 1 before writing it.
- Log sends to a `notifications` table so a failure is diagnosable.

**Depends on Task 9** (Supabase's built-in sender is rate-limited and hit 429 in
testing). Build it, keep it dark behind a flag until SMTP is live.

**Acceptance:** placing a bid sends one email to the listing owner and none to the
bidder; accepting sends one to the bidder; unsubscribing stops both; twenty bids
in an hour on one listing produce at most the cap.

---

## Task 9 — Transactional email — NEEDS PRATIK

Auth email runs on Supabase's built-in sender, which is rate-limited (testing hit
**429**) and documented as not for production. Freight operators are on Gmail and
Outlook, and unauthenticated mail from a young domain lands in spam. **A signup
confirmation in spam is a dead user and we would not see it.**

**Pratik does:** create a Resend or Postmark account, verify the sending domain,
add SPF, DKIM and DMARC records, and set it as custom SMTP in Supabase Auth.

**This has DNS propagation and reputation warm-up lead time, so start it first
even though the code change is nil.**

**You do:** document the records in `supabase/SETUP.md`, and add a test sending
through the configured sender once it exists.

---

## Task 10 — Funnel instrumentation

We cannot answer how many visitors hit the identity wall at PRD §5.1 step 3, nor
what share converted. That ratio determines whether the product works, and we are
guessing at it.

**Do:** exactly five events — `landing`, `signup_started`, `signup_completed`,
`first_action` (post or bid), `deal_accepted`. Plausible or PostHog, cookieless,
which also keeps the privacy policy short. No per-user profiles, no session
recording. Guard on an env var so local and preview send nothing.

**NEEDS PRATIK:** the project key.

**Acceptance:** the five events fire in the right order in a live signup, and
nothing fires locally.

---

## Task 11 — Performance and accessibility

- **Bundle.** `index` is 390 kB (123 kB gzip) and Recharts adds 364 kB (100 kB).
  Route-split Recharts off the homepage — the first screen does not chart. Target
  a first-load JS under 200 kB gzip.
- **Accessibility.** Run axe on the homepage, board, lane page, auth dialog and
  post dialog. Fix contrast, labels, focus order and dialog focus traps. Freight
  skews older; this is a real user population, not a checkbox. Verify the auth
  dialog is fully keyboard-operable, since it is the conversion point.
- **`src/theme.css` is imported nowhere.** Adopt it or delete it — a second theme
  file nothing loads is a trap for the next person. Adopting changes the focus
  ring from `#0E32E8` to `#1E4D6B`; that is the intended value.
- **Deploy or delete `supabase/functions/news` and `ai-search`.** Written, never
  deployed, currently just surface area.

**Acceptance:** Lighthouse performance and accessibility both ≥ 90 on mobile for
`/` and `/board`; axe reports no serious or critical issues.

---

## Task 12 — Documentation

- **`PRD.md` §13** — an entry per task: what changed and how, in the register of
  the existing entries.
- **`README.md`** — rewrite "Known state" to what is actually true when you finish.
- **`DESIGN.md`** — if Task 1 removed most of the `.ov-*` layer, say so; the
  two-layer warning is the document's centrepiece and will be stale.
- **`.env.example`** — every new variable, with a note on which are safe to
  expose. Re-state that `VITE_`-prefixed values are inlined into a public bundle.

---

## Do not do

- Do not touch `src/auth/supabaseClient.ts`'s promise caching. It caches the
  **promise**, not the client, deliberately — caching the client let concurrent
  callers each build a `GoTrueClient` on one storage key, which is fatal under
  PKCE.
- Google provider failures are external configuration issues: the outbound leg can be
  correct while the return fails with `Unable to exchange external code` if the
  Supabase Client Secret does not match Google Cloud Console. The app reports that
  failure, keeps email sign-in available, and leaves the Google option visible.
- Do not remove any of the four Post buttons without asking. The Lane index one
  was specifically requested.
- Do not add a feature that is not in this document.

---

## Definition of done

`npm run typecheck`, `npm run test` and `npm run build` clean; CI green on `main`;
`scripts/check-language.sh` exits 0; every deleted route returns 410 in
production; a signed-out browser sees a populated lane page with bidder identity
masked; a bid sends exactly one email; Lighthouse ≥ 90; and `PRD.md` §13 explains
each change.

Where a task was blocked on Pratik, say which, what you shipped behind the flag,
and what remains — do not report a blocked task as complete.
