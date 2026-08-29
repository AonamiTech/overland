import React, { useEffect, useMemo, useState } from 'react';
import { buildLanes, tick, rpmFmt, type Lane } from '@/lib/market';

/**
 * Revolving lane-rate ticker.
 *
 * Duplicated track translated by 50% for a seamless loop - no JS per frame, so it
 * costs nothing. Pauses on hover so a rate can actually be read, and stops entirely
 * under prefers-reduced-motion.
 */
export default function RateTicker() {
  const [lanes, setLanes] = useState<Lane[]>(() => buildLanes());

  useEffect(() => {
    const id = setInterval(() => setLanes((p) => tick(p)), 2600);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => [...lanes, ...lanes], [lanes]);   // duplicated for the loop

  return (
    <div className="ov-ticker" aria-label="Live lane rates">
      <div className="ov-ticker-track">
        {items.map((l, i) => {
          const up = l.rpm >= l.avgRpm;
          const pct = ((l.rpm - l.avgRpm) / l.avgRpm) * 100;
          return (
            <span className="ov-ticker-item" key={`${l.id}-${i}`}>
              <span className="ov-ticker-code">{l.originCode}<span className="ov-ticker-arrow">→</span>{l.destCode}</span>
              <span className="ov-ticker-rate">{rpmFmt(l.rpm)}</span>
              <span className="ov-ticker-delta" data-up={up}>
                {up ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
