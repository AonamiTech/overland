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
          Last updated: September 3, 2026. Overland is an AonamiTech service. This
          policy explains how Overland collects, uses, stores, protects, shares, and
          deletes personal information, including information received through Google
          Sign-In.
        </p>

        <S n="01" title="What information we collect">
          <p>
            When you use Overland, we collect only the information necessary to operate the listing board and connect shippers and carriers:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Account details:</strong> Email address, full name, phone number, company/organization name, and city.</li>
            <li><strong>Authority details:</strong> Self-declared MC and USDOT numbers provided for public carrier profiles.</li>
            <li><strong>Listing & bidding data:</strong> Origin, destination, equipment type, target rates, linehaul amounts, and notes submitted on the board.</li>
            <li><strong>Marketplace activity:</strong> Accepted deals, ratings, reports, and notification history.</li>
            <li><strong>Usage & technical data:</strong> IP address, browser and device information, access logs, and page or session telemetry used to operate, secure, and understand the service.</li>
          </ul>
        </S>

        <S n="02" title="Google Sign-In data">
          <p>
            If you choose <strong>Continue with Google</strong>, Overland requests only
            the standard OpenID Connect authentication scopes needed to sign you in:
            your Google account identifier, email address, name, and profile image. We
            do not request access to your Gmail, Google Drive, contacts, calendar, or
            other Google services.
          </p>
          <p>
            We access this Google user data only after you choose Google Sign-In. We
            use it to create or locate your Overland account, authenticate you, maintain
            your signed-in session, prefill basic profile information, and display the
            identity associated with your marketplace activity. We do not use Google
            user data for advertising, credit decisions, data brokerage, or training
            artificial-intelligence or machine-learning models.
          </p>
        </S>

        <S n="03" title="Why we collect and use information">
          <p>We use your information strictly for the following purposes:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>To authenticate account credentials and authorize access to the board;</li>
            <li>To create and maintain your account and public marketplace profile;</li>
            <li>To display open freight listings and lane index rates publicly;</li>
            <li>To share direct contact details (email and phone) between a shipper and carrier when both sides accept a bid;</li>
            <li>To send service and transaction notifications;</li>
            <li>To operate, troubleshoot, improve, and measure the service; and</li>
            <li>To enforce platform abuse controls, investigate reports, and prevent fraudulent postings.</li>
          </ul>
        </S>

        <S n="04" title="What is public and who receives information">
          <p>
            Overland is an open board for rate discovery. Your profile name, role,
            company name, city, website, self-declared authority numbers, listings,
            bids, and ratings may be visible to other users or the public. Do not put
            private information in listing notes or other public fields.
          </p>
          <p>
            Your email address and phone number are not displayed publicly. They are
            disclosed to the specific shipper or carrier who is your counterparty after
            a bid is accepted so the parties can complete the transaction directly.
          </p>
          <p>
            We use service providers, including Google for authentication and Supabase
            for authentication, database hosting, and account storage. These providers
            process information only to deliver their services to Overland. We may also
            disclose information when required by law, to protect users or the service,
            or as part of a corporate transaction with appropriate confidentiality
            protections. We do not sell personal information or Google user data, and
            we do not share it with data brokers or advertisers.
          </p>
        </S>

        <S n="05" title="Storage and security">
          <p>
            Account and marketplace information is stored using Supabase. Authentication
            sessions may also be stored in your browser so you remain signed in. Data is
            transmitted over HTTPS, and database Row Level Security and access controls
            restrict private contact and transaction records to authorized users.
          </p>
          <p>
            No system is completely secure, but we use reasonable technical and
            organizational safeguards designed to prevent unauthorized access, loss,
            misuse, or disclosure. Overland does not use Google access tokens to access
            any Google service beyond authentication.
          </p>
        </S>

        <S n="06" title="Retention and deletion">
          <p>
            We retain account and Google Sign-In information while your account is
            active and for as long as needed to provide and secure the service. Listing,
            bid, deal, report, and rating records may be retained after account closure
            when needed for marketplace integrity, fraud prevention, dispute handling,
            legal compliance, or historical rate statistics. Where practical, retained
            records are deleted or de-identified when they are no longer needed.
          </p>
          <p>
            You may request access, correction, or deletion of your account and personal
            information at any time. We process verified deletion requests within 30
            days, except where retention is required for the reasons described above.
          </p>
          <p>
            To request account deletion or data removal, email{' '}
            <a href="mailto:privacy@overland.com" className="underline underline-offset-2" style={{ color: '#1E4D6B' }}>
              privacy@overland.com
            </a>
            {' '}from the address associated with your account. You may also revoke
            Overland&rsquo;s Google access from your Google Account&rsquo;s third-party
            connections page. Revocation stops future Google authentication access but
            does not by itself delete your Overland account; contact us to request
            deletion.
          </p>
        </S>

        <S n="07" title="Cookies and analytics">
          <p>
            Overland uses browser storage that is necessary for authentication and may
            use privacy-focused analytics to understand page usage and service
            performance. We do not use Google Sign-In data to personalize advertising.
            Your browser settings can restrict cookies or local storage, although doing
            so may prevent sign-in from working correctly.
          </p>
        </S>

        <S n="08" title="Children, changes, and contact">
          <p>
            Overland is a business marketplace and is not directed to children under
            18. We may update this policy when our data practices or legal obligations
            change. Material changes will be posted here with a revised effective date.
          </p>
          <p>
            Questions about this policy or Overland&rsquo;s handling of Google user data
            can be sent to{' '}
            <a href="mailto:privacy@overland.com" className="underline underline-offset-2" style={{ color: '#1E4D6B' }}>
              privacy@overland.com
            </a>
            .
          </p>
        </S>
      </main>
    </div>
  );
}
