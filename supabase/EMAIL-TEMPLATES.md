# Supabase email templates

Paste these into **Authentication → Emails → Templates** in the Supabase dashboard.
They cannot be set from code with the anon key, so this is a manual step.

Set both **Confirm signup** and **Magic Link** — a first-time address hits the former,
a returning one hits the latter, and if you only change one the experience is
inconsistent.

Also set **Authentication → Emails → "Sender name"** to `Overland` so the inbox does
not say "Supabase Auth".

---

## Subject lines

| Template | Subject |
|---|---|
| Confirm signup | `Confirm your email to join the Overland board` |
| Magic Link | `Your Overland sign-in link` |

---

## Body — Confirm signup

```html
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F7;padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#ffffff;border:1px solid rgba(17,17,17,.08);border-radius:9px;padding:40px;">
      <tr><td>
        <p style="margin:0 0 28px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#111111;font-weight:600;">OVERLAND</p>

        <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;font-weight:300;color:#111111;letter-spacing:-.02em;">
          Confirm your email.
        </h1>

        <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:rgba(17,17,17,.62);">
          You are one click from the board. Confirm this address and you can post freight,
          post a truck, and bid on anything listed.
        </p>

        <a href="{{ .ConfirmationURL }}"
           style="display:inline-block;background:#111111;color:#FAF9F7;text-decoration:none;font-size:13px;font-weight:500;padding:13px 26px;border-radius:999px;">
          Confirm email address
        </a>

        <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:rgba(17,17,17,.42);">
          This link is single use and expires in 60 minutes. If you did not ask for it,
          ignore this email and nothing happens.
        </p>

        <hr style="border:none;border-top:1px solid rgba(17,17,17,.08);margin:32px 0 20px;">

        <p style="margin:0;font-size:12px;line-height:1.7;color:rgba(17,17,17,.42);">
          Overland is a listing board, not a freight broker. We take no cut, never handle
          payment, and verify email addresses only. Checking who you deal with is yours
          to do &mdash; carrier authority and insurance are public on the
          <a href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx" style="color:#1E4D6B;">FMCSA register</a>.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
```

---

## Body — Magic Link

Identical, with these two changes:

- Heading → `Your sign-in link.`
- Body copy → `Click below and you are back on the board. No password needed.`
- Button label → `Sign in to Overland`
- Button href → `{{ .ConfirmationURL }}` (same variable)

---

## Why the footer disclaimer is in the email

Every outbound message from the platform repeats the non-broker position and points at
the FMCSA register. It costs nothing and it is the cheapest possible evidence that the
service consistently held itself out as a listing board rather than a brokerage.
See LEGAL-NOTES.md.

---

## Before launch: custom SMTP

Supabase's built-in sender is capped at a few messages per hour on the free tier, and
sends from `noreply@mail.app.supabase.io` rather than your domain.

**Authentication → Emails → SMTP Settings.** [Resend](https://resend.com) is the usual
pick: free tier around 3,000/month, roughly ten minutes including domain verification.
Until that is done, signups will silently stop working under any real traffic.

---

# Every email the platform sends

Two are Supabase auth templates (dashboard). The rest are transactional and need the
`notify` edge function plus Resend.

| # | Email | Trigger | Who gets it | Where it lives |
|---|---|---|---|---|
| 1 | Confirm signup | first-ever signup | the new user | Supabase template |
| 2 | Sign-in link | returning user | that user | Supabase template |
| 3 | **Welcome** | ~2 min after first confirmed login | the new user | `notify` fn |
| 4 | **New bid received** | someone bids on your listing | listing owner | `notify` fn |
| 5 | **You were outbid** | a lower bid lands on a listing you bid on | previous best bidder | `notify` fn |
| 6 | **Bid accepted — introduction** | owner accepts a bid | **both parties** | `notify` fn |
| 7 | **Bid not accepted** | listing awarded to someone else | other bidders | `notify` fn |
| 8 | **Rate this deal** | 3 days after an introduction | both parties | `notify` fn (cron) |

## 3 · Welcome

Subject: `You are on the board`

> Your email is confirmed, so you can post and bid.
>
> Two things worth knowing before you deal with anyone:
> we verify email addresses and nothing else, and we never take a cut or handle payment.
> Check any carrier's authority and insurance on the FMCSA register before freight or
> money moves.
>
> **[Open the board]**

## 4 · New bid received — to the listing owner

Subject: `New bid on {ORIGIN} → {DEST}: {AMOUNT}`

> {BIDDER_NAME} bid **{AMOUNT}** on your {EQUIPMENT} load, {ORIGIN} → {DEST}.
> That is {N} bids so far, best {BEST_AMOUNT}.
>
> Contact details are exchanged only if you accept.
>
> **[See the bids]**

## 5 · Outbid — to the previous best bidder

Subject: `You have been outbid on {ORIGIN} → {DEST}`

> A lower bid of **{AMOUNT}** landed on {ORIGIN} → {DEST}. Yours was {YOUR_AMOUNT}.
> The listing is still open, so you can counter.
>
> **[Counter your bid]**

*Do not name the competing bidder. The amount is public on the board; identity in a
push notification is not.*

## 6 · Bid accepted — the introduction (the important one)

Subject: `You are connected: {ORIGIN} → {DEST} at {AMOUNT}`

Sent to **both sides, with the other party's details in each**:

> **{OTHER_NAME}** — {COMPANY_OR_INDIVIDUAL}, {CITY}
> Email {OTHER_EMAIL} · Phone {OTHER_PHONE}
> MC {MC} · USDOT {USDOT} — entered by them, not verified by us
>
> Lane {ORIGIN} → {DEST} · {EQUIPMENT} · {MILES} mi
> Agreed **{AMOUNT}** ({RPM}/mi)
>
> Overland's cut: **$0**
>
> From here it is your deal. Rate confirmation, insurance, paperwork and payment are
> between the two of you. Check each other on the FMCSA register before anything moves.
>
> **[Look up {OTHER_NAME} on FMCSA]**

## 7 · Not accepted — to other bidders

Subject: `{ORIGIN} → {DEST} has been awarded`

> The load you bid on went to another carrier. Nothing further to do.
> {N} similar lanes are open now.
>
> **[See open lanes]**

*Send this. Silence after a bid is the single most common complaint about load boards.*

## 8 · Rate this deal — 3 days after an introduction

Subject: `Did {ORIGIN} → {DEST} go through?`

> You connected with {OTHER_NAME} three days ago on {ORIGIN} → {DEST} at {AMOUNT}.
>
> Did the load actually move? One tap, and it tells the next person what to expect.
>
> **[It moved]**   **[It fell through]**

*Ask whether the deal happened before asking how it went — a rating with no completed
deal behind it is worth nothing, and the schema enforces the same rule.*

## Rules for all of them

- Always repeat: not a broker, no cut, emails verified not businesses.
- Never put contact details in any email except #6.
- One-click unsubscribe on 5, 7 and 8. Never on 1, 2, 3, 6 — those are transactional.
- Send from `notifications@yourdomain.com` once SMTP is on a domain you control.
