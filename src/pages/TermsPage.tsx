import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Terms and the non-broker disclaimer.
 *
 * DRAFT - written to reflect how the platform actually behaves, so counsel has
 * something accurate to review rather than boilerplate. It is not legal advice and
 * has not been reviewed by a lawyer. See LEGAL-NOTES.md.
 *
 * The substantive point is section 2: Overland is not a broker under 49 CFR 371.2
 * because it takes no compensation for arranging transportation, never touches the
 * money, and does not negotiate on anyone's behalf. Every product decision has to
 * keep that true.
 */

const S = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <span className="aon-eyebrow">{n}</span>
    <h2 className="aon-display mt-2 text-[22px]">{title}</h2>
    <div className="mt-3 space-y-3 text-[14px] leading-[1.75]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.62)' }}>
      {children}
    </div>
  </section>
);

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <header className="border-b" style={{ borderColor: 'rgba(17,17,17,.10)' }}>
        <div className="mx-auto max-w-[760px] px-6 py-4">
          <Link to="/" className="aon-eyebrow" style={{ color: '#111111', letterSpacing: '.18em' }}>OVERLAND</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="aon-display text-[clamp(30px,4.5vw,44px)]">Terms of use</h1>

        <S n="01" title="What Overland is">
          <p>
            Overland is a listing and messaging service. Users post freight or available
            capacity, other users respond with offers, and when both sides agree we send
            each of them the other&rsquo;s contact details by email.
          </p>
          <p>That is the entire service. Everything after the introduction is between the two parties.</p>
        </S>

        <S n="02" title="Overland is not a freight broker">
          <p>
            A broker, under 49 CFR 371.2, is a person who for compensation arranges or
            offers to arrange the transportation of property by an authorized motor
            carrier. Overland does not do this and does not hold broker authority.
          </p>
          <p>Specifically, Overland does not:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>take any commission, margin or percentage of any agreed rate;</li>
            <li>receive, hold, escrow, forward or process payment between users;</li>
            <li>negotiate, quote, or recommend rates on behalf of any user;</li>
            <li>take custody, possession or control of any freight;</li>
            <li>dispatch, schedule or direct any carrier;</li>
            <li>issue rate confirmations, bills of lading or any transport document.</li>
          </ul>
          <p>
            Any subscription fee is for access to the listing service and is not
            contingent on, or calculated from, any transaction between users.
          </p>
        </S>

        <S n="03" title="We verify email addresses only">
          <p>
            Overland confirms that a registered email address is reachable. We do not
            verify identity, operating authority, insurance, safety record, financial
            standing, or the accuracy of anything a user posts.
          </p>
          <p>
            MC and USDOT numbers shown on the platform are self-declared by users and are
            displayed unverified so that you can check them yourself. Carrier authority,
            insurance and safety data is public at the FMCSA register.
          </p>
        </S>

        <S n="04" title="Your responsibilities">
          <p>
            Before moving freight or money you are responsible for confirming the other
            party&rsquo;s operating authority and insurance, agreeing terms in writing,
            and satisfying yourself that they are who they claim to be. Double-brokering
            and identity fraud occur across the freight industry; an open platform does
            not remove that risk.
          </p>
        </S>

        <S n="05" title="No warranty, and limits on liability">
          <p>
            The service is provided as is. Rate information is indicative and derived from
            platform activity; it is not a quote, an offer, or financial advice.
          </p>
          <p>
            Overland is not a party to any agreement between users and is not liable for
            any loss, damage, non-payment, non-performance, cargo claim or dispute arising
            from a connection made through the service.
          </p>
        </S>

        <S n="06" title="Prohibited use">
          <p>
            Do not post freight or capacity you do not control, misrepresent your
            authority or insurance, re-broker a load you were awarded, or use the service
            to solicit anyone for a purpose other than moving the freight posted.
          </p>
        </S>
      </main>
    </div>
  );
}
