# Audit brief — for Antigravity

Repository: `~/Downloads/overland` · `github.com/pratikkp24/overland`
Live: `https://overland-ochre.vercel.app`
Written: 1 Sep 2026

This is a work order, not a report. Everything below was reproduced against
production. Items marked **FIXED** are already done and listed so you do not redo
them — but they have **no test coverage**, and writing those tests is part of the
job.

---

## How to run anything

```bash
npm install
npm run typecheck     # tsc -b — the ONLY real type check, see below
npm run test          # vitest
npm run dev           # localhost:8080
```

**`tsc --noEmit` passes without checking anything.** The root `tsconfig.json` has
`"files": []`, so only `tsc -b` walks the project references. Never verify with the
bare form.

**Client configuration.** The browser uses the production Supabase URL and anon key
from `src/auth/supabaseConfig.ts`. Local-mode branches remain available for isolated
tests, but normal builds use Supabase directly.

**The tests are persona-driven.** `src/test/personas.ts` defines five users, each
covering a path the others cannot. Add to that file rather than inventing new
fixtures — a new persona should earn its place by covering something uncovered.

---

## Part 1 — Fixed, but untested

Write regression tests for each. These are the highest-value tests in the list
because every one of them is a bug that reached production.

### 1.1 Posting could report success while writing nothing

**File:** `src/components/overland/PostListing.tsx`

The branch read `if (isLive() && user)`, so a missing session fell through to the
`localStorage` path meant for demo mode **and still showed the success screen**.
The listing existed only in that browser.

Now: while `isLive()` is true there is no fallback; no session throws.

**Test** — `src/components/overland/__tests__/PostListing.test.tsx`

- live + signed in → `createListing` called once with `owner_id === user.id`
- live + `user === null` → `createListing` **not** called, error surfaced, `localStorage` untouched
- not live → writes to `localStorage`, `createListing` not called
- `createListing` rejects → error rendered, success screen not shown

### 1.2 Smooth scrolling is dead page-wide

**Files:** `src/lib/scrollTo.ts` (new), `MobileTabBar.tsx`, `AuthDialog.tsx`,
`src/components/Navigation.tsx`

`html, body { overflow-x: clip }` in `src/index.css` is load-bearing — it stops
horizontal overflow without making body its own scroll container, which is what
`hidden` did and what broke `position: sticky`. The cost is that Chromium ignores
smooth scrolling on the document. Measured live:

```
scrollIntoView({behavior:'smooth'})   → scrollY 0      ✗
scrollIntoView()                      → scrollY 9248   ✓
window.scrollTo({behavior:'smooth'})  → scrollY 0      ✗
```

The mobile tab bar's **Lanes** tap was dead — eight samples over 5.6s, no movement.

**Test** — `src/lib/__tests__/scrollTo.test.ts`

- when smooth moves nothing, falls back to an instant `scrollTo` at the right offset
- when smooth does move, does **not** double-scroll
- `prefers-reduced-motion: reduce` → never requests smooth
- `null` element → no throw, no scroll
- **Do not** re-introduce `behavior: 'smooth'` anywhere; add a lint rule if you like

### 1.3 Self-bidding and bid withdrawal

**File:** `supabase/migrations/0002_harden.sql`

`supabase migration list --linked` showed an empty Remote column for all three
migrations — the schema had been created by hand in the SQL editor, so the history
table was empty and this migration had never run. Applied with
`supabase db push --include-all`. `0001` replays safely because every
`create policy` is preceded by `drop policy if exists`.

| | before | after |
| --- | --- | --- |
| Owner bids on own listing | `201`, row persisted | `403` |
| Withdraw own bid | `204`, removed nothing | works |

**Test** — `src/lib/__tests__/db.policies.test.ts`, integration, skipped unless
`SUPABASE_TEST_URL` and its test credentials are set:

- owner bidding on own listing rejects
- a bidder can delete their own bid; a stranger cannot
- amount `<= 0` and `> 1_000_000` rejected
- notes over 500 chars rejected
- a user cannot rate themselves

### 1.4 Header printed simulated figures beside real ones

**Files:** `src/lib/db.ts` (`boardCounts`), `src/pages/BoardPage.tsx`

The header read `Open loads 143` directly above a board holding one, because the
counts came from the seeded lane model.

**Test** — `src/lib/__tests__/boardCounts.test.ts`

- returns `null` when not live (caller must render a dash, never a modelled number)
- uses `head: true, count: 'exact'` so no rows cross the wire
- a thrown query resolves to `null` rather than rejecting

### 1.5 Ready dates accepted the past

**File:** `src/components/overland/PostListing.tsx` — `min` on `#ov-ready`.

**Test:** the input's `min` equals today in `YYYY-MM-DD`; submitting an earlier date
is rejected.

### 1.6 "Live" on modelled rates

**Files:** `HeroDirect.tsx`, `BookCards.tsx`

The first screen badged the rate card **live**. Those rates are modelled from miles
and equipment. Now reads "Indicative" with a sentence saying so.

**Test:** no rendered component labels lane/rate figures "live" while
`market.ts` is the source. A grep-style guard test is fine.

---

## Part 2 — Open, needs fixing

### 2.1 Google sign-in — CONFIG, NOT CODE

Outbound leg verified correct: valid `client_id`, `redirect_uri`, `code_challenge`,
`s256`. The **return** fails with `Unable to exchange external code`, which means
the Google **Client Secret in Supabase → Authentication → Providers → Google** does
not match Google Cloud Console.

The app reports the provider error, keeps email/password sign-in available, and leaves
the Google option visible for another attempt. The provider secret still must match
Google Cloud Console; that configuration cannot be repaired from browser code.

### 2.2 No notifications — the biggest product gap

**Files:** `src/lib/db.ts`, `LiveListings.tsx`, `supabase/functions/`

Nothing tells a poster a bid arrived, or a bidder they were accepted. The
owner-operator persona has no reason to return between visits. This is the
retention problem, not an acquisition one.

Needs a decision before code: email via an edge function, in-app only, or both.

### 2.3 Anonymous clients read nothing

**File:** `supabase/migrations/0001_init.sql`

Every policy is `to authenticated`. A signed-out client reads zero rows from
`listings`, `bids` and `profiles`. The board is auth-gated so it does not bite
today, but **any public browse view will render empty**, and the lane pages already
show gated bidder identity.

Decide deliberately: keep it closed, or add an anon SELECT policy for `listings`
and the public half of `profiles`. Do not add one for `profile_contacts` — that
table is the privacy promise.

### 2.4 No link to `/board` from the homepage

**Files:** `AonSections.tsx` (nav), `HeroDirect.tsx`

`linksToBoardPage: 0`. Every nav item and the "Open the board" CTA are in-page
anchors — `#book`, `#lanes`, `#how`. A visitor who wants the actual board can only
get there by signing up or typing the URL. For a signed-in user the nav should
point at `/board`.

### 2.5 Four Post buttons on one page

**Files:** `BoardPage.tsx`, `LiveListings.tsx`

Nav `+ Post`, Open listings `+ Post`, empty-state "Post the first one", and Lane
index `Post`. The obvious cut is the Open listings one, ~250px above the Lane index
button. Confirm with Pratik before removing — the Lane index button was requested.

### 2.6 Mobile tab bar shows to signed-out visitors

**File:** `MobileTabBar.tsx`

Tapping **Board** bounces to `/` with the auth dialog, losing the visitor's scroll
position. Consider preserving intent and returning them after sign-in.

---

## Part 3 — Test coverage gaps

Current suite: 57 tests, all passing, but **entirely pure-function**. `geo`,
`market`, `parseQuery`, `usmap`, `password`, `carrier`, personas.

**Nothing tests a component, a flow, or a policy.** Every bug in Part 1 was in
exactly that gap.

Priority order:

1. **`AuthContext`** — `src/auth/__tests__/AuthContext.test.tsx`
   - implicit-flow tokens in the URL fragment call `setSession` and clear the hash
   - `?code=` calls `exchangeCodeForSession`
   - provider failure is surfaced without suppressing later Google attempts
   - `getSupabase()` caches the **promise**, so two concurrent callers get one client
     *(this was a real bug: caching the client let each caller build its own
     GoTrueClient on one storage key, which is fatal under PKCE)*

2. **`RequireAuth`** — holds render while `loading`, redirects only once resolved.
   A flash of the signed-out state is the bug to prevent.

3. **`BidderCard`** — identity hidden when signed out; DOT/MC/SAFER shown when
   signed in; SAFER prefers USDOT over MC (MC numbers get reassigned).

4. **`LaneDetail`** — `linehaul === round(miles × rpm / 5) × 5`, so the breakdown
   can never contradict the header. Accept is gated behind auth.

5. **`PostListing`** — as 1.1.

Suggested: add `@testing-library/react` + `jsdom`, and a `vitest.config.ts` with
`environment: 'jsdom'` (there is currently no vitest config file).

---

## Part 4 — Rules

1. **Read `DESIGN.md` before touching UI.** Two design layers coexist in
   `index.css`; `.aon-*` is current, `.ov-*` is legacy and owns ~24 older routes.
   Mixing them on one screen is this repo's most common visual bug.
2. **`text-red-*` renders blue.** Tailwind's red scale is remapped to the Aonami
   blue ramp. Errors use `#DC2626` literally.
3. **Never move `email`/`phone` into `profiles`**, and never expose a view joining
   them without the accepted-deal condition. That policy *is* the privacy promise.
4. **Do not add commission, payment handling, escrow or carrier selection.** Each
   risks broker classification under 49 CFR 371.2, with uncapped personal liability
   for officers under 49 U.S.C. § 14916(d). See `LEGAL-NOTES.md`.
5. **Verify against a rendered page, not the diff.** Every bug in Part 1 type-checked
   and passed the existing suite.
6. **Update `PRD.md` §13** (implementation log) with what you changed and how.

---

## Prompt to start with

> You are working in `~/Downloads/overland`, a React + TypeScript + Vite freight
> board backed by Supabase. Read `AUDIT-BRIEF.md`, `DESIGN.md` and `PRD.md` first.
>
> Your task is Part 3 of the brief: add component and integration test coverage,
> starting with `AuthContext`, then `RequireAuth`, `BidderCard`, `LaneDetail` and
> `PostListing`. Add `@testing-library/react` and a `vitest.config.ts` using the
> jsdom environment — there is no vitest config today.
>
> Then write the regression tests listed in Part 1 for bugs that are already fixed
> but uncovered. Do not change the fixes themselves; if you believe one is wrong,
> say so rather than editing it.
>
> Verify with `npm run typecheck` (which is `tsc -b`; the bare `tsc --noEmit`
> checks nothing here) and `npm run test`. Do not open a browser preview for
> test-only work.
>
> Do not touch anything in Part 2 without asking — those need product decisions.
