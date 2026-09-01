# Work order 2 — close out the gaps

Repository: `~/Downloads/overland` · Live: `https://overland-ochre.vercel.app`
Written: 1 Sep 2026, after independent verification of work order 1.

Read `PRODUCTION_PROGRESS.md` first — it records what was verified and what was
reported complete but was not. Then `ANTIGRAVITY-TASK.md` §Hard rules, which
still apply in full.

Nine tasks. **Do them in order.** Commit after each with the task number.

---

## Before you start: three things that were true last round

1. **Committing is not shipping.** The repository has no Vercel Git integration —
   every deploy in its history is a manual `vercel --prod`. Twelve tasks sat
   committed and undeployed because of this. Until Task 9 is done, nothing you
   write reaches users until someone runs the CLI.
2. **Writing a migration is not applying one.** `0004` and `0005` were committed
   and reported complete with empty Remote columns. Always finish with
   `supabase migration list --linked` and read the Remote column.
3. **A green suite is not a working feature.** `performance.test.ts` asserted that
   `theme.css` was imported — so the suite actively enforced a regression that
   made 147 elements invisible in dark mode. Assert the behaviour you want, and
   verify UI against a rendered page.

---

## Task 1 — Restore the deleted `news` function source

**This is live production code with no source in the repository.**

Commit `ec9964a` deleted `supabase/functions/news/index.ts` and
`supabase/functions/ai-search/index.ts` as "cleanup". But `news` is **deployed and
ACTIVE** on Supabase (version 1, since 28 Aug), and the homepage still calls it —
`src/components/overland/MarketNews.tsx:36` does
`fetch(\`${base}/functions/v1/news\`)`.

So a function is serving live traffic that nobody can read, audit or change, and
the next `supabase functions deploy` could remove or overwrite it blindly.

**Do:**

1. `git show ec9964a^:supabase/functions/news/index.ts` and restore it.
2. Confirm the restored source matches what is deployed — redeploy it so the
   repository is authoritative.
3. `ai-search` is **not** deployed and nothing calls it. Restoring that one is
   optional; if you leave it deleted, say so in the README rather than leaving a
   silent hole.
4. Add a line to `README.md` listing which edge functions are deployed. The old
   README claimed `news` was written but not deployed, which was wrong.

**Acceptance:** `supabase functions list` matches `supabase/functions/` exactly;
the homepage news strip still renders.

---

## Task 2 — Bidder identity is now gated in the client only

Migration `0005` granted `select on public.profiles to anon` with `using (true)`.
That was the right call for lane-page indexing, but it has a consequence nobody
has closed: **`BidderCard` masks carrier identity for signed-out visitors in the
component, and that is now the only thing masking it.** Anyone can read every
profile — name, company, city, MC, USDOT — straight from the REST endpoint with
the public anon key.

Verified: `GET /rest/v1/profiles` with the anon key returns **13 rows**.

The product's stated bargain is that bid *amounts* are public and bidder
*identity* is what you sign up to see. Right now that bargain is decoration.

**Pick one and implement it. Do not leave it as is.**

- **(a) Restore the gate in the database.** Revoke anon on `profiles`; create a
  `public_profiles` view exposing only what a signed-out visitor may see — enough
  for a lane page to render without naming anyone — and point anon at the view.
  Keep the full table for `authenticated`.
- **(b) Accept it and tell the truth.** If open identity is fine, then
  `BidderCard`'s masking is a dark pattern rather than a protection: remove the
  "visible to members" copy, stop implying a gate, and update `PRD.md` §4.2 and
  the privacy page to say carrier identity is public.

**(a) is the recommendation** — it keeps the conversion mechanic the PRD is built
on. But either is honest; the current state is not.

**Acceptance:** either anon gets no identifying profile fields, or no screen and
no document claims it does.

---

## Task 3 — Surface the new database errors in the UI

`0004` is live: 20 listings and 60 bids per user per hour, raised as `P0001`.
`PostListing.tsx` has no handling for it, so a rate-limited user gets whatever
generic failure the client renders.

This is the same class of bug as the original silent-post failure: the database
does the right thing and the person sees nothing useful.

**Do:** catch the constraint violations and render the reason —
rate limit, amount out of range, notes over 500 characters, self-bidding — in
`PostListing.tsx` and the bid form. Errors use `#DC2626` literally; `text-red-*`
renders blue in this project.

**Also fix a latent inconsistency:** `src/lib/db.ts:78` filters
`.gt('expires_at', now)`, which drops rows where `expires_at` is null, while the
anon policy in `0005` allows `(expires_at is null or expires_at > now())`. No row
is null today and `0004` has no backfill, so nothing is broken — but the two
disagree, and the client is the stricter one. Make them match.

**Acceptance:** posting a 21st listing within an hour shows a readable message
naming the limit; a listing with a null `expires_at` behaves identically in both
the API and the board.

---

## Task 4 — Verify the report path end to end

`ReportModal` was added and `reports` exists with insert-only RLS. Nobody has
confirmed a report can actually be filed, and `select` is denied to everyone —
including you — so a silent failure here is invisible by design.

**Do:** file a report as a signed-in user and confirm the row lands. Since no
policy grants `select`, verify via a `service_role` query **in the Supabase SQL
editor, never from the app or the repo**. Then add a count-only path an operator
can use, or document how to read reports, otherwise the feature is write-only in
the useless sense.

**Acceptance:** a report filed from the UI is visible in the SQL editor, and
`README.md` says how an operator reads them.

---

## Task 5 — Finish the RLS integration harness

This was Task 7 last round and was reported complete. It was not. The five tests
in `src/lib/__tests__/db.policies.test.ts` still fail with
`permission denied for table listings` — they authenticate as anon, which cannot
insert. What was added were two tests that read the `.sql` files and grep for
expected strings; **a policy is not tested by confirming its text exists.**

**Do:** sign in as two seeded test users, use their real sessions, and tear down
every row afterwards. Cover:

- owner bidding on own listing rejects
- a bidder can delete their own bid; a stranger cannot
- amount `<= 0` and `> 1_000_000` rejected; notes over 500 chars rejected
- a user cannot rate themselves
- **a user cannot read another's `profile_contacts` without an accepted deal**
- **the same user can once a deal is accepted**
- the rate-limit triggers fire at 21 and 61

The last three are the ones that matter most: they are the privacy promise and
the abuse controls, and neither is covered by anything today.

Keep the static SQL tests — they are cheap and catch a deleted policy — but they
are not a substitute.

**NEEDS PRATIK:** a dedicated Supabase test project and two seeded users. Until
then, keep the suite skipping on absent credentials and say so in the README —
**do not report this task complete against the production database.**

**Acceptance:** all eight pass against the test project; the unit suite still
passes with no credentials set.

---

## Task 6 — Ship notifications

`supabase/functions/send-deal-email/` exists and is **not deployed**
(`supabase functions list` shows only `news`). No trigger calls it.

**Do:** deploy it; add the Postgres triggers on `bids` insert and `deals` insert;
enforce the `notify_email` unsubscribe flag and the per-listing hourly cap; log
sends to a `notifications` table so failures are diagnosable.

Two messages only — *you received a bid*, *your bid was accepted*. The acceptance
email must not imply the platform is party to the deal: it introduces two people
and steps out.

**NEEDS PRATIK:** custom SMTP (Task 9). Keep it behind a flag until that exists —
Supabase's built-in sender is rate-limited and hit 429 in testing.

**Acceptance:** with SMTP configured, one bid sends exactly one email to the
owner and none to the bidder; unsubscribing stops both; twenty bids in an hour on
one listing produce at most the cap.

---

## Task 7 — Accessibility

Measured on the deployed lane page with the OS set to dark: **4 elements below
3:1 contrast.** This is the pre-existing baseline, not the reverted `theme.css`
regression.

**Do:** run axe on `/`, `/board`, `/lane/:slug`, the auth dialog and the post
dialog. Fix contrast, labels, focus order and dialog focus traps. The auth dialog
is the conversion point — it must be fully keyboard-operable. Freight skews older;
this is a real population.

**Acceptance:** axe reports no serious or critical issues; zero elements below
3:1 on those five surfaces in both colour schemes.

---

## Task 8 — Resolve `theme.css`, properly this time

It is currently **not** imported, deliberately, and carries a header explaining
why. Importing it again without the prerequisite work will reproduce the 147
invisible elements.

**Either:**

- **Adopt it:** convert `index.css` and the hardcoded component colours to its
  tokens **first** — `#FAF9F7`, `#FFFFFF` and `#111111` appear 17 times in
  `index.css` and 30 times across `components/overland` — *then* import it, then
  re-measure contrast in both schemes. Note this also changes the focus ring from
  `#0E32E8` to `#1E4D6B`, which is intended.
- **Or delete it** and stop carrying a second theme nothing loads.

Do not import it as a one-liner. `performance.test.ts` now asserts it is absent;
that assertion changes only when the conversion is genuinely done.

**Acceptance:** either the file is gone, or it is imported with 0 contrast
failures in both schemes on all five surfaces.

---

## Task 9 — NEEDS PRATIK

Not code. Flag these and move on; do not block.

- **Connect the repository to Vercel** so pushes deploy. This is why work order 1
  sat unshipped.
- **Make the CI `verify` job a required status check** on `main`.
- **Custom SMTP** — Resend or Postmark, domain verified with SPF, DKIM and DMARC.
  Has DNS lead time; blocks Task 6.
- **`VITE_SENTRY_DSN`** in Vercel, and the analytics key for Task 10 of the last
  order.
- **A Supabase test project** and two seeded users, for Task 5.
- **Rotate the Google OAuth client secret** — it was pasted into a chat
  transcript, and rotating also fixes the broken sign-in, which is a console
  mismatch and not a code bug.

---

## Reporting

For each task say what you changed, how you verified it, and against what — a
rendered page, a live HTTP response, the linked database, or a test. If a task is
blocked, say which part shipped and which did not.

**Do not report a task complete because the code exists.** Last round four of
twelve were reported complete when they were not, and one of those was actively
breaking the homepage.

Finish by updating `PRD.md` §13 and the `README.md` known-state section.
