# Work order 4

Repository: `~/Downloads/overland` · Live: `https://overland-5c4.pages.dev`
Written: 1 Sep 2026, after verifying work order 3.

Read the verification sections of `PRODUCTION_PROGRESS.md` first, then
`ANTIGRAVITY-TASK.md` §Hard rules, which still apply.

Seven tasks. Do them in order — Task 1 must run before Task 2 changes the auth
configuration it depends on.

---

## Before anything: the gate now works

`scripts/verify-shipped.sh` was rewritten. The version delivered last round
printed "ALL SHIPPING CHECKS PASSED" while its own output showed HEAD ahead of
`origin` and the live bundle differing from `dist` — checks 1 and 3 warned and
passed anyway, check 2's regex never matched Supabase's output, and check 4 was a
bare `echo`.

It now fails properly. On its first real run it caught `send-deal-email` written
but not deployed, from a task reported complete.

**Run `npm run verify:shipped` and paste the output at the end of every task.**
It is the only part of your report that is not self-assessment.

One more standing rule, because it has now happened four times: **a test that
reads a source file and asserts its text contains an expected string is not a
test.** `db.policies.test.ts`, `notifications.test.ts`, `contrast-audit.mjs` and
the original theme guard all do this. Each passes when the feature is entirely
unwired — which is exactly how notifications reached "complete" with no trigger
and no deployed function. Task 4 removes them.

---

## Task 1 — Run the marketplace loop, end to end, on production

**This is the most valuable task in this document and nothing on any previous
list covers it.**

Production holds **1 listing, 0 bids, 13 profiles.** The core loop —
post → bid → accept → contact release → notification → rating — has never
completed once. Every part is built and individually verified. The chain has
never run.

`mailer_autoconfirm` is currently **on**, so you can create accounts without
inbox access. Do this task before Task 2, which turns that off.

**Do, against the live site, recording the HTTP status of every step:**

1. Create two accounts — one shipper, one carrier — with clearly disposable
   addresses under a domain you control. Record them; Task 7 deletes them.
2. As the shipper, **post a load**. Confirm a `listings` row exists with
   `owner_id` equal to that user and a populated `expires_at`.
3. As the shipper, **bid on your own load**. It must be rejected — `0002_harden`
   declares this and it reached production once already.
4. As the carrier, **bid**. Confirm the row, then **withdraw it** — deletion was
   silently broken before — then bid again.
5. Confirm a `notifications` row appears with `type = 'bid_placed'` for the
   listing owner. With no SMTP configured it should read `skipped` or `failed`,
   never abort the insert.
6. As the shipper, **accept the bid**. Confirm a `deals` row.
7. **The one that matters:** confirm the carrier can now read the shipper's
   `profile_contacts`, and that a third signed-in user still cannot. This is the
   privacy promise, and it has never been exercised with real rows.
8. Confirm a `notifications` row with `type = 'deal_accepted'`.
9. **Rate the deal** from both sides. Confirm each rating attaches to that deal,
   that neither party can rate twice, and that nobody can rate themselves.
10. Delete every row and both accounts. Leave production as you found it.

**Then write it as an automated test** in `src/lib/__tests__/loop.e2e.test.ts`,
skipping without test-project credentials, so this is repeatable rather than a
one-off.

**Report the status code of every step, including the ones that behaved
correctly.** If any step fails, stop and report — do not fix and continue, because
what breaks here tells us more than the fix does.

---

## Task 2 — The email verification claim is currently false

`GET /auth/v1/settings` returns `mailer_autoconfirm: true`. New accounts are
confirmed immediately and no confirmation email is sent.

`README.md` and the product copy say: **"We verify an email address and nothing
more."** With autoconfirm on, we verify nothing. Anyone can sign up as
`dispatch@anycarrier.com` and appear on the board with that identity. On a
platform whose only stated check is the email address, that one claim is the
entire trust model — and it is not true.

**Do:**

1. Turn autoconfirm **off** so signup requires a confirmed address. (**NEEDS
   PRATIK** — Supabase dashboard. Depends on Task 6's SMTP, because the built-in
   sender is rate-limited and hit 429 in testing.)
2. Until it is off, **change the copy** so it does not claim a verification that
   is not happening. It must not say or imply that an address was verified.
3. Once on, confirm an unconfirmed account cannot post or bid — check the policy,
   not just the UI.
4. Update `README.md`, `PRD.md` §2 and `/privacy` to match whichever state ships.

The copy fix is not optional while the setting is unchanged. Shipping a false
trust claim is worse than shipping no claim.

---

## Task 3 — Finish contrast

Work order 3 took the deployed lane page from **166 AA failures to 18** — real
work, and the right shape: the token changed, not the call sites.

The remaining 18 are `rgba(17,17,17,.5)` at 11px on website and "Look up on
Google" links, giving **3.51:1** against a 4.5 requirement. About `.62` clears it.

**Do:**

1. Raise that value and re-measure until the rendered count is 0.
2. **Rewrite `scripts/contrast-audit.mjs` so it renders the page.** The current
   version `readFileSync`s source files and regex-scans colour literals against
   assumed backgrounds — it cannot see a computed background or an inherited
   colour, which is why it reported 0 while 18 were live. Drive a real browser,
   read `getComputedStyle`, and composite alpha against the actual ancestor
   stack. A 9% tint of a colour behind text of that same colour reads as 1.00 if
   you skip compositing; my own first pass made that mistake and produced four
   false positives while missing 166 real ones.
3. Report before and after from the rendered measurement.

**Acceptance:** the script renders, and prints 0 for `/`, `/board`,
`/lane/:slug`, the auth dialog and the post dialog.

---

## Task 4 — Replace the source-grep tests

Four tests assert on file text rather than behaviour:

| File | Replace with |
|---|---|
| `db.policies.test.ts` (2 static cases) | the real RLS cases — Task 6 |
| `notifications.test.ts` | insert a bid, assert a `notifications` row appears with the right `type` and `user_id` |
| `contrast-audit.mjs` | the rendered measurement — Task 3 |
| the `theme.css` guard | keep it; asserting a file's absence is a legitimate use |

Keep the static SQL checks as a cheap tripwire for a deleted policy — but they do
not count as coverage of the policy.

---

## Task 5 — Accessibility beyond contrast

axe has still never been run. Only contrast was ever measured.

**Do:** run axe on `/`, `/board`, `/lane/:slug`, the auth dialog and the post
dialog. Fix labels, focus order, dialog focus traps and keyboard operability. The
auth dialog is the conversion point and must be fully keyboard-operable. The
`role="dialog"` / `aria-modal` / `aria-labelledby` work from last round is good
and should stay.

**Acceptance:** no serious or critical axe issues on those five surfaces.

---

## Task 6 — The RLS harness

Eight tests still skipping. **NEEDS PRATIK:** a Supabase test project and two
seeded users.

When it exists, finish the harness per work order 2 Task 5 — including the two
cases Task 1 will have proved by hand: a user cannot read another's
`profile_contacts` without an accepted deal, and can with one.

**Do not run it against production and report it complete.**

---

## Task 7 — Housekeeping

- **Choose a licence.** `README.md` says "None yet. All rights reserved" on a
  public repository. Ask Pratik which; do not pick one yourself.
- **Delete the test accounts** in `~/Downloads/overland-leads/overland-test-accounts.csv`,
  especially `pratik@aonamitech.com`, plus the two accounts Task 1 created.
- Note in `README.md` that the duplicate empty repo at `pratikkpp24/overland`
  should be deleted (Pratik).

**NEEDS PRATIK, unchanged and none yet done:** custom SMTP with SPF/DKIM/DMARC
(start first — DNS lead time, and it blocks Tasks 2 and 4); rotate the Google
OAuth client secret, which also fixes the broken sign-in; `VITE_SENTRY_DSN` and
the analytics key; the Supabase test project; branch protection on `main`; and
the seven FMCSA SAFER lookups by hand, since the table reported last round is not
credible.

---

## Reporting

For each task: what changed, how you verified it, and against what — a rendered
page, a live HTTP response, the linked database, or a test that exercises
behaviour. Finish each with `npm run verify:shipped`.

For Task 1, report every step's status code, including the ones that passed.
