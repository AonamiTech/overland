# Work order 3

Repository: `~/Downloads/overland` · Live: `https://overland-ochre.vercel.app`
Written: 1 Sep 2026, after verifying work order 2.

Read `PRODUCTION_PROGRESS.md` first — the verification sections record what was
reported complete and was not, twice. Then `ANTIGRAVITY-TASK.md` §Hard rules,
which still apply.

Seven tasks, in order, one commit each.

---

## The thing to fix about how you work

Across two work orders, twenty-one tasks were reported complete. Each time, the
same three things were false:

| Round 1 | Round 2 |
|---|---|
| Nothing pushed to `origin` | Nothing pushed to `origin` |
| `0004`, `0005` unapplied | `0006`, `0007` unapplied |
| Nothing deployed | Nothing deployed |

Each time I pushed, ran `supabase db push` and `vercel --prod` by hand. **The
work was mostly good. The reporting was not.** A task is not done because the
code exists — it is done when a user could encounter it.

The second pattern: three separate tests now read a source file and assert its
text contains an expected string — the SQL policy tests, `notifications.test.ts`,
and the original `theme.css` test that asserted a regression was present.
**A test that greps source is not coverage of behaviour.** It passes when the
feature is entirely unwired, which is exactly what happened to notifications.

Task 1 makes both of these mechanical rather than a matter of memory.

---

## Task 1 — Make "shipped" verifiable

**Do:** write `scripts/verify-shipped.sh`, exiting non-zero with a clear message
on any of:

1. `git rev-parse HEAD` ≠ `git rev-parse origin/main` → "committed but not pushed"
2. `supabase migration list --linked` has any row with a populated Local column
   and an empty Remote column → "migration written but not applied"
3. The `assets/index-*.js` referenced by `curl https://overland-ochre.vercel.app/`
   ≠ the one in `dist/` after a fresh `npm run build` → "built but not deployed"
4. Any file under `supabase/functions/` that `supabase functions list` does not
   show as ACTIVE → "function written but not deployed"

Add `npm run verify:shipped`. **Running this and pasting its output is now the
definition of done for every remaining task**, including in this work order.

Do not wire it into CI — CI has no deploy credentials and check 3 would fail on
every pull request. It is a local pre-report gate.

**Acceptance:** run it now, before doing anything else, and paste the output. It
should pass, because I pushed, applied and deployed everything from work order 2.

---

## Task 2 — Fabricated carriers carry real-format federal identifiers

**Highest priority. This is the only item here with third-party risk.**

`src/lib/profiles.ts` seeds demo bidders that render on public lane pages:

```
Rio Grande Carriers   MC 412885    USDOT 1885402
Keystone Logistics    MC 778110    USDOT 2331097
Summit Freight        MC 904221
Dave Thompson         MC 1188402   USDOT 3902118
```

`src/lib/carrier.ts:26` turns each into a live FMCSA deep link:
`safer.fmcsa.dot.gov/query.asp?...&query_param=USDOT&query_string=1885402`.

Every one of these is a **plausible, in-range identifier**. USDOT numbers past
4 million have been issued, so 1885402 and 2331097 sit squarely inside the
assigned range. Nobody has checked whether they belong to real companies. SAFER
blocks automated lookups, so this has to be done by hand.

If those numbers are assigned, the site shows an invented company name attached
to a real carrier's federal identifier, with a one-click link to that carrier's
real safety record, presented as a genuine bid — on a product whose entire
argument is that its numbers are honest.

**Do, in this order:**

1. **Look each of the seven identifiers up by hand** on
   `https://safer.fmcsa.dot.gov/CompanySnapshot.aspx` and record what comes back
   in `PRODUCTION_PROGRESS.md`. Do this first; it decides how urgent the rest is.
2. Replace them regardless of the answer. Use identifiers that **cannot** collide:
   a documented reserved range, or a clearly synthetic format such as
   `DEMO-0001`. Anything that still looks like a real USDOT number is wrong.
3. `saferUrl()` must return `null` for a demo profile, so no SAFER link renders.
   Gate on the profile being seeded, not on the string shape.
4. Label demo bidders as demonstration data in the UI wherever they appear to a
   signed-out visitor.
5. **Consider removing them from public lane pages entirely.** Work order 2's
   Task 2 put the identity gate back in the database — but a signed-out visitor
   still sees carrier names and DOT numbers, they are simply fake ones. The
   "visible to members" gate that `BidderCard.tsx:64` is written to show is not
   what appears. Decide which behaviour you want and make the code and the copy
   agree.

**Acceptance:** no page shows an identifier that could match a real carrier; no
SAFER link is generated from demo data; the lookup results for all seven are
recorded.

---

## Task 3 — Wire notifications for real

Reported complete in work order 2. `0007_notifications.sql` adds a column, a
table and two policies and **contains no triggers**. Nothing calls
`send-deal-email`: no trigger, no client call, and `supabase functions list`
shows only `news`.

`notifications.test.ts` reads the function's source and asserts it contains the
strings `bid_placed` and `deal_accepted`. It passes with the feature entirely
unwired, which is how this reached "complete".

**Do:**

1. Deploy the function: `supabase functions deploy send-deal-email`.
2. Add the triggers — `after insert on bids` and `after insert on deals` — in a
   new migration. Use `pg_net` for the call. **The call must not be able to abort
   the insert**: wrap it so a failure logs to `notifications` with
   `status = 'failed'` and returns, rather than raising. A bid must still be
   placeable when the mail provider is down.
3. Enforce `notify_email` and the per-listing hourly cap inside the function.
4. Two messages only. The acceptance email introduces two people and steps out —
   it must not imply the platform is party to the deal.
5. **Replace the source-grep test** with one that inserts a bid against the test
   project and asserts a `notifications` row appears with the right `type` and
   `user_id`.

**NEEDS PRATIK:** custom SMTP. Until it exists, the function should log
`status = 'skipped'` rather than fail — and say so when you report.

**Acceptance:** inserting a bid produces a `notifications` row; with SMTP down, a
bid still inserts and the row reads `failed`.

---

## Task 4 — Fix contrast at the token, not the element

Work order 2's Task 7 added `role="dialog"`, `aria-modal` and `aria-labelledby`.
Those are real and should stay. It did not touch contrast, which was the measured
part of the task.

Measured on the deployed lane page, compositing alpha, WCAG AA thresholds
(4.5:1 normal, 3:1 large): **166 failures, worst 2.2:1.** They are not scattered
mistakes — they are the design's own muted ink, `rgba(17,17,17,.45)`, used at
12–13px for lane codes, counts, equipment labels and eyebrows.

**Do:**

1. Darken the muted and body ink until 12px text clears 4.5:1 on both `#FAF9F7`
   and `#FFFFFF`. `rgba(17,17,17,.45)` gives about 2.2:1 on cream; roughly `.62`
   is where 4.5:1 starts. Change the token, not the call sites.
2. Re-measure and report the before and after count.
3. Write the measurement as a script — `scripts/contrast-audit.mjs` — so the
   number is reproducible rather than a claim. **It must composite alpha:** a 9%
   tint of a colour behind text of that same colour reads as ratio 1.00 if you
   do not, which produces false positives and hides real ones. My own first pass
   made exactly this mistake.
4. Then run axe on `/`, `/board`, `/lane/:slug`, the auth dialog and the post
   dialog for everything contrast does not cover.

**Acceptance:** zero AA failures on those five surfaces, proved by the script's
output; axe reports no serious or critical issues.

---

## Task 5 — Make the deployed `news` function match the repository

Work order 2 Task 1 restored `supabase/functions/news/index.ts` from history —
correct. But the deployed function is still version 1 from 28 Aug and was never
redeployed, so nobody has confirmed the restored source is what is running.

**Do:** diff the restored source against the deployed version, redeploy so the
repository is authoritative, and confirm the homepage news strip still renders.
Decide about `ai-search` — restore it or record in `README.md` that it was
deliberately dropped.

**Acceptance:** `verify-shipped.sh` check 4 passes.

---

## Task 6 — The RLS integration suite

Still eight tests skipping for want of credentials. This is honest and is not
counted against you, but it means the row-level security that carries the privacy
promise is covered by nothing that runs.

**NEEDS PRATIK:** a dedicated Supabase test project and two seeded users.

When it exists, finish the harness as specified in work order 2 Task 5, including
the two cases that matter most: a user cannot read another's `profile_contacts`
without an accepted deal, and can with one.

**Do not run it against production and report it complete.**

---

## Task 7 — NEEDS PRATIK

Flag and move on. Unchanged from last round, none yet done:

- **Connect the repository to Vercel** so pushes deploy. Two rounds of work have
  now sat unshipped because of this.
- Make the CI `verify` job a required check on `main`.
- **Custom SMTP** — Resend or Postmark, SPF, DKIM, DMARC. Has DNS lead time and
  blocks Task 3.
- `VITE_SENTRY_DSN` and the analytics key in Vercel.
- A Supabase test project and two seeded users, for Task 6.
- **Rotate the Google OAuth client secret** — exposed in a chat transcript, and
  rotating also fixes the broken sign-in, which is a console mismatch.

---

## Reporting

For each task: what changed, how you verified it, and **against what** — a
rendered page, a live HTTP response, the linked database, or a test that
exercises behaviour.

Finish every task by running `npm run verify:shipped` and pasting the output.
A task with unpushed commits, an unapplied migration, an undeployed build or an
undeployed function is not complete, however good the code is.

Then update `PRD.md` §13 and the `README.md` known-state section.
