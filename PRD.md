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
and from selling lane data to the broker side. See §8.

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
| **Broker** | Coverage | Loads at volume | *Ambivalent by design — see §11* |

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

## 5. Requirements

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
| Profile rows on signup | **Broken.** `auth.users` populates, `profiles` stays empty, so carrier identity cannot render for real users. Root cause unresolved |
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

## 6. What has to be true

**One lane, genuinely liquid.** Roughly 10–15 loads a day in a single origin market
and one equipment type, with competing bids on most of them.

Everything else follows from that and nothing works without it. A national board
with a few hundred loads is useless everywhere; the same volume on one city-pair is
useful. **The first milestone is not a national board — it is Dallas–Atlanta, dry
van, with real depth.**

Seed the **demand** side first. Carrier supply is already aggregated and free to
reach through the public FMCSA census; loads are the scarce side.

---

## 7. Success measures

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

## 8. Revenue

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

## 9. Architecture constraints

- **Contacts never move into `profiles`.** Separate table, RLS keyed on an accepted
  deal. Do not create a view that joins them without that condition.
- **The `service_role` key never reaches client code or this repo.** The anon key is
  public by design.
- **Rate figures are derived, never stored as opinion.** `linehaul = miles × rpm`,
  so the breakdown can never contradict the headline.
- **Bids are public by design** — that is a product decision encoded in the schema,
  not an oversight.

---

## 10. Open questions

1. Why are `profiles` rows not being created on signup? Blocks carrier identity.
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

## 11. Risks

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

## 12. Related

[README.md](README.md) · [DESIGN.md](DESIGN.md) · [LEGAL-NOTES.md](LEGAL-NOTES.md) ·
[supabase/SETUP.md](supabase/SETUP.md)

*Market figures are drawn from commissioned research and were not independently
audited for this document. Nothing here is legal advice.*
