import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { buildLanes, rpmFmt, nationalIndex } from '@/lib/market';

/**
 * Straight-to-business hero.
 *
 * A first-time visitor has three questions: what is this, what does a lane pay, and
 * how do I start. This answers all three above the fold, with no scrolling required.
 * The diorama film still exists further down as the narrative version.
 */

const INK = '#111111';
const ACCENT = '#1E4D6B';
const HAIR = 'rgba(17,17,17,.10)';

export default function HeroDirect() {
  const { user, openAuth } = useAuth();
  const nav = useNavigate();
  const lanes = React.useMemo(() => buildLanes(), []);
  const idx = nationalIndex(lanes);

  return (
    <section className="bg-[#FAF9F7] pt-14 pb-16 md:pt-20 md:pb-20">
      <div className="mx-auto max-w-[1126px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          <div>
            <span className="aon-eyebrow">Open freight board</span>

            <h1 className="aon-display mt-6 max-w-[14ch] text-[clamp(38px,6vw,68px)]">
              Freight and trucks, <span style={{ color: ACCENT }}>priced in the open.</span>
            </h1>

            <p className="aon-body mt-6 max-w-[34ch] text-[17px] leading-[1.55]">
              Post it. Take bids. Deal direct.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => (user ? nav('/board') : openAuth({ mode: 'signup', role: 'shipper', returnTo: '/board' }))}
                className="aon-cta aon-cta--dark"
              >
                {user ? 'Go to the board' : 'Sign up free'}
              </button>
              <a href="#book" className="aon-cta aon-cta--ghost">Open the board</a>
            </div>

            <p className="aon-eyebrow mt-7" style={{ lineHeight: 1.9 }}>
              Free · No platform fees
            </p>
          </div>

          {/* what a lane pays, before you sign up for anything */}
          <div className="rounded-[9px] bg-white p-6" style={{ border: `1px solid ${HAIR}` }}>
            <div className="flex items-baseline justify-between">
              <span className="aon-eyebrow">National average</span>
              {/* These rates are modelled from miles and equipment, not observed
                  trades. Badging them "live" told a first-time visitor they were
                  looking at real market data - the single most misleading thing on
                  the page, and on the first screen. */}
              <span className="aon-eyebrow" style={{ color: 'rgba(17,17,17,.65)' }}>Indicative</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="aon-num text-[38px]" style={{ color: INK }}>{rpmFmt(idx.now)}</span>
              <span className="aon-body text-[13px]">per mile</span>
            </div>

            <ul className="mt-5 space-y-0">
              {lanes.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2.5"
                    style={{ borderTop: `1px solid ${HAIR}` }}>
                  <span className="text-[14px]" style={{ fontFamily: 'Poppins, sans-serif', color: INK }}>
                    {l.originCode} → {l.destCode}
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="aon-eyebrow" style={{ fontSize: 9 }}>{l.equipment}</span>
                    <span className="aon-num text-[15px]" style={{ color: ACCENT }}>{rpmFmt(l.rpm)}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="aon-body mt-4 text-[11.5px] leading-[1.5]">
              Modelled from miles and equipment, not live transactions — a sanity
              check, not a quote.
            </p>
            <a href="#lanes" className="aon-eyebrow mt-3 inline-block" style={{ color: ACCENT }}>
              See every lane →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
