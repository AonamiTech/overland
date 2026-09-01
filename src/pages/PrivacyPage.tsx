import React from 'react';
import { Link } from 'react-router-dom';

const S = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <section className="mt-10">
    <span className="aon-eyebrow">{n}</span>
    <h2 className="aon-display mt-2 text-[22px]">{title}</h2>
    <div className="mt-3 space-y-3 text-[14px] leading-[1.75]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.62)' }}>
      {children}
    </div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <header className="border-b" style={{ borderColor: 'rgba(17,17,17,.10)' }}>
        <div className="mx-auto max-w-[760px] px-6 py-4 flex items-center justify-between">
          <Link to="/" className="aon-eyebrow" style={{ color: '#111111', letterSpacing: '.18em' }}>OVERLAND</Link>
          <Link to="/terms" className="aon-eyebrow" style={{ color: 'rgba(17,17,17,.65)' }}>Terms</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="aon-display text-[clamp(30px,4.5vw,44px)]">Privacy Policy</h1>
        <p className="aon-body mt-3 text-[15px] leading-[1.6]" style={{ color: 'rgba(17,17,17,.65)' }}>
          Last updated: September 2026. Overland is committed to straightforward, transparent handling of your data.
        </p>

        <S n="01" title="What information we collect">
          <p>
            When you use Overland, we collect only the information necessary to operate the listing board and connect shippers and carriers:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Account details:</strong> Email address, full name, phone number, company/organization name, and city.</li>
            <li><strong>Authority details:</strong> Self-declared MC and USDOT numbers provided for public carrier profiles.</li>
            <li><strong>Listing & bidding data:</strong> Origin, destination, equipment type, target rates, linehaul amounts, and notes submitted on the board.</li>
            <li><strong>Usage & technical data:</strong> Basic access logs and cookieless session telemetry to protect against platform abuse.</li>
          </ul>
        </S>

        <S n="02" title="Why we collect it">
          <p>We use your information strictly for the following purposes:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>To authenticate account credentials and authorize access to the board;</li>
            <li>To display open freight listings and lane index rates publicly;</li>
            <li>To share direct contact details (email and phone) between a shipper and carrier when both sides accept a bid;</li>
            <li>To enforce platform abuse controls and prevent fraudulent postings.</li>
          </ul>
        </S>

        <S n="03" title="Who sees your information">
          <p>
            Overland is an open board for rate discovery, but user contact details are strictly protected:
          </p>
          <p>
            Public rate data and lane listings are visible to anyone. However, carrier contact information (phone number, email address) is never exposed publicly or sold to third parties. Contact details are disclosed ONLY to the specific counterparty on an accepted transaction.
          </p>
        </S>

        <S n="04" title="Data retention and security">
          <p>
            We retain account data for as long as your account remains active. Listing records and bid amounts persist on the market index to maintain accurate historical rate statistics.
          </p>
          <p>
            We implement strict database Row Level Security (RLS) policies ensuring contact details are accessible exclusively by authorized account holders and matched counterparties.
          </p>
        </S>

        <S n="05" title="Your rights and deletion requests">
          <p>
            You have the right to inspect, update, or request the deletion of your personal data at any time.
          </p>
          <p>
            To request account deletion or data removal, email us directly at{' '}
            <a href="mailto:privacy@overland.com" className="underline underline-offset-2" style={{ color: '#1E4D6B' }}>
              privacy@overland.com
            </a>
            . We process deletion requests within 30 days.
          </p>
        </S>
      </main>
    </div>
  );
}
