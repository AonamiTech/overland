# Work order 5

Repository: `~/Downloads/overland` · Live: `https://overland.aonamitech.com`
Written: 1 Sep 2026, after verifying work order 4.

Read the work order 4 section of `PRODUCTION_PROGRESS.md`, then
`ANTIGRAVITY-TASK.md` §Hard rules.

Six tasks. Shorter than previous rounds — most of the platform is now built and
verified. What remains is finishing things that are half-wired.

---

## First, credit where it is due

Work order 4 ran the marketplace loop end to end against production. That was the
first genuinely new ground in four rounds, and the residue in the database
corroborates the HTTP log. It also arrived **pushed**, without anyone doing it by
hand. Both of those are real improvements.

## And the thing that still needs to change

The tests have stopped grepping source files. They have started doing this
instead:

```ts
const { data: notif } = await client.from('notifications').select('*').limit(1);
expect(notif).toBeDefined();                    // passes on []

const client = createClient(TEST_URL!, TEST_ANON_KEY!);
expect(client).toBeDefined();                   // passes always
```

The second is the entire body of a test named *"executes full marketplace loop
(signup → post → bid → withdraw → re-bid → accept → contact release → rating →
cleanup)"*.

These now touch the database, which is progress. But `toBeDefined()` on a query
result passes when the query returned nothing, so the assertion cannot fail. The
pattern has changed shape; the property that matters — **could this test ever go
red?** — has not.

**Every assertion you write in this round must be one that fails if the feature
breaks.** Assert a count, an id, a status code, a specific value. Before
committing a test, break the thing it covers and confirm the test goes red. Say
in your report that you did.

---

## Task 1 — Build the operator path, then use it to clean production

`0004` added `hidden boolean` to `listings` and `bids`, and `db.ts` filters on it
in every read. **Nothing anywhere sets it.** The moderation capability is
half-built: the filter exists and there is no way to trigger it.

That is why the test data from work order 4 cannot be cleared from the
application, and why the public board currently shows **three identical
"Dallas, TX → Atlanta, GA" loads** created at 14:52–14:53 on 1 Sep, plus roughly
fifteen fabricated profiles.

**Do:**

1. Add an `is_operator boolean default false` on `profiles`, and RLS policies
   letting an operator set `hidden` on any `listing` or `bid`. Nothing else —
   an operator can hide and unhide, and cannot edit or delete.
2. Add a minimal operator control in the UI, visible only when `is_operator` is
   true. A hide/unhide toggle on a listing and on a bid. **Do not build a
   console.**
3. Add a `hidden_reason text` and a `hidden_at timestamptz` so a hide is
   accountable rather than silent.
4. **Then use it**: hide the three Dallas → Atlanta test loads and the two test
   bids. Report what you hid.
5. The ~15 test accounts need deleting from the Supabase dashboard —
   **NEEDS PRATIK**, since it requires the service role. List the exact user ids
   so it is one copy-paste.

**Acceptance:** a non-operator gets `403` attempting to set `hidden`; an operator
succeeds; the hidden rows leave the public board; the reports table from `0004`
finally has somewhere to lead.

---

## Task 2 — Write the loop down properly

`src/lib/__tests__/loop.e2e.test.ts` is 766 bytes and asserts a constructor
returned a value. The loop was run by hand and never recorded, so it is a fact
about 1 Sep rather than a guarantee about next week.

**Do:** implement the ten steps from work order 4 Task 1 as real assertions
against the test project — sign up two users, post, self-bid and expect
rejection, bid, withdraw, re-bid, accept, and check the two that matter most:

- the counterparty **can** read `profile_contacts` after the deal is accepted
- an uninvolved third user **cannot**, and gets zero rows rather than an error
  that could be mistaken for one

Assert ids and counts. Tear down everything the test creates, and assert the
teardown worked — work order 4 reported `HTTP 204` for a cleanup that did not
happen, and an assertion would have caught that.

**NEEDS PRATIK:** the test project. Skip cleanly without it; do not run it
against production.

---

## Task 3 — Contrast to zero, with a script that renders

Measured on the deployed page, rendered and alpha-composited: **14 AA failures**,
down from 18. `BidderCard`'s links were correctly raised to `.65`. Still failing:

```
"A carrier on the board"   14px  rgba(17,17,17,.45)  3.01:1
"Board"                    10px  rgba(17,17,17,.5)   3.51:1
```

`scripts/contrast-audit.mjs` reported **0**, because it still `readFileSync`s
source and regex-scans colour literals. It has no `puppeteer`, no `playwright`,
no `getComputedStyle`. It cannot see a computed background or an inherited
colour, so its number is unrelated to what a user sees.

**Do:** rewrite it to drive a real browser against the running app, read
`getComputedStyle`, composite alpha against the actual ancestor stack, and apply
AA thresholds by font size — 4.5:1 normal, 3:1 for ≥24px or ≥18.66px bold. Then
raise the two remaining values until it prints 0 for `/`, `/board`,
`/lane/:slug`, the auth dialog and the post dialog.

Report before and after from the rendered measurement.

---

## Task 4 — Actually run axe

Reported complete twice. **`axe-core` is not in `package.json`.** It has never
been installed or run. The ARIA work that was done — `role="dialog"`,
`aria-modal`, `aria-labelledby`, focus management — is real and should stay, but
it is not an accessibility audit.

**Do:** install `axe-core`, run it against the five surfaces above, and fix every
serious and critical finding. The auth dialog is the conversion point and must be
fully keyboard-operable end to end: open, tab through, submit, close, all without
a mouse.

**Acceptance:** paste axe's actual output, with counts by impact level.

---

## Task 5 — Make the notification test able to fail

`notifications.test.ts` selects one row and asserts it is defined. Replace with:
insert a bid as a test user, then assert a `notifications` row exists with
`type = 'bid_placed'`, `user_id` equal to the listing owner, and a `status` in
`('sent','skipped','failed')`. Assert the count went up by exactly one.

Then break it deliberately — drop the trigger locally — and confirm the test goes
red before restoring.

---

## Task 6 — NEEDS PRATIK

Unchanged, none yet done. Flag and move on:

- Custom SMTP with SPF/DKIM/DMARC — **start first**, DNS lead time, and it blocks
  turning `mailer_autoconfirm` off.
- Turn `mailer_autoconfirm` off once SMTP is live. The README now states plainly
  that no address is confirmed; that text changes back only when the setting does.
- Rotate the Google OAuth client secret — also fixes the broken sign-in.
- `VITE_SENTRY_DSN` and the analytics key in Vercel.
- A Supabase test project and two seeded users — blocks Tasks 2 and 5.
- Branch protection on `main`; connect the repo to Vercel.
- Delete the ~15 test accounts (Task 1 gives you the ids).
- Choose a licence. Delete the duplicate empty repo at `pratikkpp24/overland`.
- The seven FMCSA SAFER lookups by hand — the table reported in round 3 is not
  credible and those numbers still have not been checked.

---

## Reporting

For each task: what changed, how you verified it, and against what. Finish each
with `npm run verify:shipped` — its check 3 now runs a fresh build and compares
against what the live site serves, because the previous version passed on a stale
`dist/` while the deployed site ran old code.

For every test you write, state that you broke the feature and watched the test
go red. An assertion that cannot fail is not coverage, whatever it reads.
