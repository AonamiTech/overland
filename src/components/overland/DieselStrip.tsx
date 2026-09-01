import React, { useEffect, useState } from 'react';

/**
 * The one real number on the page.
 *
 * Every rate in the lane index is modelled from miles and equipment. This is
 * measured: the US Energy Information Administration publishes retail on-highway
 * diesel every Monday, and it is the input a carrier's cost actually moves with.
 *
 * It is expressed per mile as well as per gallon, because freight is priced per
 * mile and $5.65 a gallon means nothing next to $2.50 a mile until you divide it
 * by fuel economy. That conversion is an assumption and is labelled as one.
 *
 * Renders nothing at all if the feed is unavailable — a broken strip would be
 * worse than no strip on a page whose argument is that its numbers are honest.
 */

type Diesel = {
  week: string;
  usdPerGallon: number;
  changeWeek: number | null;
  usdPerMile: number;
  mpgAssumed: number;
  history: Array<{ week: string; value: number }>;
  source: string;
};

const INK = '#111111';
const HAIR = 'rgba(17,17,17,.10)';
const UP = '#A8412F';    // diesel rising is bad news for a carrier, so it reads warm
const DOWN = '#0F7A4A';

/** Sparkline across the fetched weeks. Small enough that a library would cost more
 *  than it saves. */
function spark(vals: number[], w = 84, h = 22) {
  if (vals.length < 2) return '';
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - lo) / span) * h;
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

const weekLabel = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

export default function DieselStrip() {
  const [d, setD] = useState<Diesel | null>(null);

  useEffect(() => {
    let off = false;
    fetch('/api/diesel')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: Diesel) => { if (!off && typeof j?.usdPerGallon === 'number') setD(j); })
      .catch(() => { /* stay silent; the strip simply does not appear */ });
    return () => { off = true; };
  }, []);

  if (!d) return null;

  const up = (d.changeWeek ?? 0) >= 0;
  const path = spark(d.history.map((h) => h.value));

  return (
    <div
      className="flex flex-wrap items-center gap-x-7 gap-y-3 rounded-[9px] px-5 py-4"
      style={{ background: '#FFFFFF', border: `1px solid ${HAIR}` }}
    >
      <div>
        <span className="aon-eyebrow" style={{ color: '#0F7A4A' }}>Measured</span>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="aon-num text-[26px]" style={{ color: INK }}>
            ${d.usdPerGallon.toFixed(2)}
          </span>
          <span className="aon-body text-[12px]">per gallon, diesel</span>
        </div>
      </div>

      {d.changeWeek !== null && (
        <div>
          <span className="aon-eyebrow">Week on week</span>
          <div className="aon-num mt-1.5 text-[15px]" style={{ color: up ? UP : DOWN }}>
            {up ? '▲' : '▼'} ${Math.abs(d.changeWeek).toFixed(3)}
          </div>
        </div>
      )}

      <div>
        <span className="aon-eyebrow">Fuel per mile</span>
        <div className="aon-num mt-1.5 text-[15px]" style={{ color: INK }}>
          ${d.usdPerMile.toFixed(2)}
        </div>
      </div>

      {path && (
        <svg width="84" height="22" viewBox="0 0 84 22" aria-hidden className="shrink-0">
          <path d={path} fill="none" stroke={up ? UP : DOWN} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
        </svg>
      )}

      <p className="aon-body ml-auto max-w-[34ch] text-[11px] leading-[1.5]">
        US retail on-highway diesel, week of {weekLabel(d.week)} — published by the EIA.
        Per-mile assumes {d.mpgAssumed} mpg.
      </p>
    </div>
  );
}
