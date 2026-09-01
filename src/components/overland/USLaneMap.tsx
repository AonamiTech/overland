import React from 'react';
import { OUTLINE_PATH, VIEW, lanePath, cityPoint, laneMiles, CITIES } from '@/lib/usmap';

/**
 * US map with one lane drawn on it. Pure SVG - no tiles, no API key.
 * `dim` renders every other board lane faintly behind, for context.
 */
export default function USLaneMap({
  from, to, dim = [], height = 340,
}: { from: string; to: string; dim?: Array<[string, string]>; height?: number }) {
  const a = cityPoint(from);
  const b = cityPoint(to);
  const miles = laneMiles(from, to);

  return (
    <div>
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} style={{ width: '100%', height }} role="img"
           aria-label={`${CITIES[from]?.name} to ${CITIES[to]?.name}, ${miles} miles`}>
        <path d={OUTLINE_PATH} fill="#F3EFE8" stroke="rgba(17,17,17,.10)" strokeWidth="1.5" />

        {dim.map(([f, t]) => (
          <path key={`${f}${t}`} d={lanePath(f, t)} fill="none" stroke="#D9D3C8" strokeWidth="1.2" />
        ))}

        {a && b && (
          <>
            <path d={lanePath(from, to)} fill="none" stroke="#1E4D6B" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx={a[0]} cy={a[1]} r="6" fill="#1E4D6B" />
            <circle cx={b[0]} cy={b[1]} r="6" fill="#111111" />
            <text x={a[0]} y={a[1] - 14} textAnchor="middle"
                  style={{ font: "600 15px 'JetBrains Mono', monospace", fill: '#111111' }}>{from}</text>
            <text x={b[0]} y={b[1] - 14} textAnchor="middle"
                  style={{ font: "600 15px 'JetBrains Mono', monospace", fill: '#111111' }}>{to}</text>
          </>
        )}
      </svg>
      <p className="aon-num mt-1 text-[12px]" style={{ color: 'rgba(17,17,17,.65)' }}>
        {CITIES[from]?.name} → {CITIES[to]?.name} · {miles.toLocaleString()} mi
        <span style={{ color: 'rgba(17,17,17,.65)' }}> · road estimate</span>
      </p>
    </div>
  );
}
