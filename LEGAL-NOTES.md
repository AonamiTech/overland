# Overland — legal exposure notes

Not legal advice. Written by an engineer from public sources so a lawyer has an
accurate starting point. **Get counsel before launch.**

---

## 1. The core question: are you a freight broker?

A broker is *"a person who, for compensation, arranges, or offers to arrange, the
transportation of property by an authorized motor carrier"* — [49 CFR 371.2](https://www.law.cornell.edu/cfr/text/49/371.2).
Brokers need FMCSA authority and a **$75,000 BMC-84 surety bond**.

Load boards (DAT, Truckstop, Direct Freight) operate **without** broker authority
because they list and connect rather than arrange. Overland is designed to sit with
them, and currently does.

### The four things that must stay true

| Rule | Why |
|---|---|
| **Never take a cut of a rate** | Compensation for arranging is the statutory trigger |
| **Never touch the money** | FMCSA guidance: handling funds between shipper and carrier *strongly* suggests broker authority is required |
| **Never negotiate or recommend a rate on a user's behalf** | That is "arranging" |
| **Never take custody or dispatch** | Carrier-side control |

### The pricing trap

A **subscription** for access is fine — that is what DAT and Truckstop charge, and it
is payment for a listing service. A **fee per successful connection** is compensation
calculated from arranging transportation, which is close to the definition of
brokerage. Do not introduce success fees, "finder's fees" or per-match pricing without
counsel.

### Why the penalty matters personally

[49 U.S.C. § 14916](https://www.federalregister.gov/documents/2023/06/16/2023-13080/definitions-of-broker-and-bona-fide-agents)
carries roughly **$10,000 per violation**, a **private right of action** for anyone
injured, and **personal liability reaching officers, directors and principals**. It
pierces the company. This is the single largest risk in the business.

### Watch item: counter-offers

The lane detail lets users exchange counter-offers in-app. Passive relay of user
messages should be fine, but if the platform ever *suggests*, *optimises* or
*auto-accepts* a rate, that starts to look like arranging. Flag this feature
specifically to counsel. It is also a reason the "AI-enabled" positioning was dropped —
an algorithm recommending rates is a worse fact pattern than a bulletin board.

---

## 2. What was removed, and why

All of the following was inherited from the "Truck Hai" template this project was
forked from. It was **live on the deployed site**.

| Removed | Risk |
|---|---|
| `/insurance`, `/insurance-legacy`, `/broker-insurance`, `/fleet-insurance`, `/corporate-insurance` | Pages used "Purchase" and "Premium". Selling or soliciting insurance requires a **producer licence in every state** it is offered in |
| `/commission-tracking` | A "Commission Dashboard" directly contradicts *"we take no cut"* and evidences brokerage compensation |
| KYC funnel (`VerificationModal`) | Collected **SSN (934 refs), EIN, bank account + routing numbers, selfies**, and **Aadhaar / PAN — Indian national ID documents** |
| "Verified carriers", "fully verified", "We verify", "SLA guarantee" | Claims not backed by any actual verification |

Route components remain on disk — they are unreachable, not deleted. The old KYC modal
is at `src/components/verification/_legacy_VerificationModal.tsx.bak`.

### The KYC funnel was the worst of it

Holding SSNs and bank credentials with **no backend, no encryption at rest, and no
compliance programme** is an unmanaged breach liability under state data-breach statutes
and potentially GLBA. It also flatly contradicted the product promise. It now shows a
notice explaining that only email is verified, and links to the FMCSA register.

**Before launch, confirm nothing was ever collected in production.** If the deployed
site captured real SSNs or bank details, that is a disclosure question, not a code
question.

---

## 3. Fraud exposure

Double-brokering and identity fraud are endemic in US freight, and both DAT and
Truckstop invest heavily in identity verification specifically because of it. Overland
is open with email-only verification, which is a deliberate product decision — but
§ 14916's private right of action means defrauded users have a route to sue.

**Mitigations in place:** MC/USDOT shown as self-declared; terms state plainly that
checking counterparties is the user's job; FMCSA lookup linked from the footer,
the verification notice and the connection screen.

**Recommended next:** auto-check entered MC/USDOT against the free FMCSA QCMobile /
SAFER data. It surfaces public facts rather than vouching for anyone, so it does not
compromise neutrality, and it materially reduces fraud.

---

## 4. Still open — for counsel, not for code

1. **Terms of use** (`/terms`) is a draft describing actual behaviour. Needs review.
2. **No privacy policy yet.** Required once any personal data is stored — you now store
   email, role and self-declared MC/USDOT. CCPA/CPRA applies at California thresholds.
3. **Entity and insurance.** Tech E&O / cyber cover; confirm the operating entity.
4. **Marketing claims.** Anything on the site that could be read as promising an outcome
   is an FTC exposure. Current copy is deliberately limited to what the platform does.
5. **Testimonials** on the homepage are demo fixtures with invented names. **Remove or
   replace with real, permissioned quotes before launch** — fabricated endorsements are
   an FTC problem in their own right.
6. **Rate data.** Presented as simulated and labelled as such on the board. If it ever
   derives from real transactions, revisit how it is described.

---

## 5. Competitive context

- **DAT** — largest, ~150k transactions/min, paid
- **Truckstop** — second, $35–$369/user/month
- **123Loadboard** — freemium, genuine free tier, ~$39/mo paid
- **Direct Freight / NextLOAD / FreeFreightSearch** — free tiers already exist
- **Flock Freight** — largest US shared-truckload player, $60M Series E (May 2025), but
  operates **as a brokerage taking margin**

"Free and open" is not differentiation — free boards exist. The defensible wedge is
**open rate history**: DAT sells rate data as a premium product, and nobody gives it
away. That is what the rate board does.
