import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

/**
 * Auto-playing hero reel.
 *
 * Cycles the diorama clips on their own rather than binding to scroll: this is the
 * top of the page, so it has to move before anyone has scrolled at all. Each slide
 * carries its own line; the clip advances when it ends, or after a fallback timeout
 * if the asset is missing so the reel never stalls on a 404.
 */

const ACCENT = '#1E4D6B';

type Slide = { id: string; line: string; tail?: string };

const SLIDES: Slide[] = [
  { id: '05-corridor',     line: 'Every lane has', tail: 'a public price.' },
  { id: '02-warehouse',    line: 'Post what you have.', tail: 'Freight or a truck.' },
  { id: '10-lastmile',     line: 'Anyone can bid.', tail: 'Everyone can see it.' },
  { id: '12-exception',    line: 'Agree, and we', tail: 'introduce you.' },
  { id: '13-orchestrator', line: 'Then we', tail: 'step out.' },
];

const HOLD_MS = 5200;

export default function HeroReel() {
  const [i, setI] = useState(0);
  const { openAuth, user } = useAuth();
  const navigate = useNavigate();
  const timer = useRef<number>();

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setI((n) => (n + 1) % SLIDES.length), HOLD_MS);
    return () => window.clearTimeout(timer.current);
  }, [i]);

  const s = SLIDES[i];

  return (
    <section className="relative isolate overflow-hidden" style={{ background: '#E3E0DE' }}>
      {/* clips */}
      {SLIDES.map((sl, n) => (
        <video
          key={sl.id}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms]"
          style={{ opacity: n === i ? 1 : 0 }}
          src={`/film/${sl.id}.mp4`}
          poster={`/film/${sl.id}.jpg`}
          autoPlay={n === i}
          muted
          loop
          playsInline
          preload={Math.abs(n - i) <= 1 ? 'auto' : 'none'}
          aria-hidden
        />
      ))}

      {/* legibility wash */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(250,249,247,.94) 0%, rgba(250,249,247,.72) 34%, rgba(250,249,247,0) 72%)' }}
      />

      <div className="relative mx-auto flex min-h-[74svh] max-w-[1126px] flex-col justify-center px-6 py-24">
        <span className="aon-eyebrow">
          <span className="dot" /> Open freight board · FTL &amp; PTL · United States
        </span>

        <h1 className="aon-display mt-6 max-w-[16ch] text-[clamp(38px,6.4vw,74px)]">
          {s.line}{' '}
          <span style={{ color: ACCENT }}>{s.tail}</span>
        </h1>

        <p className="mt-7 max-w-[46ch] text-[16px] leading-[1.65]" style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(17,17,17,.62)' }}>
          A listing board, not a brokerage. Post freight or capacity, take open bids, and
          when you agree we hand over each other&rsquo;s contact details. No cut, no
          middleman.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => (user ? navigate('/board') : openAuth({ mode: 'signup', role: 'shipper', returnTo: '/board' }))}
            className="aon-cta aon-cta--dark"
          >
            Open the board
          </button>
          <a href="#book" className="aon-cta aon-cta--ghost">Get trucking now</a>
        </div>

        {/* slide pips */}
        <div className="mt-12 flex items-center gap-2" role="tablist" aria-label="Hero slides">
          {SLIDES.map((sl, n) => (
            <button
              key={sl.id}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={sl.line}
              onClick={() => setI(n)}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{ width: n === i ? 34 : 14, background: n === i ? '#1E4D6B' : '#C9C3B8' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
