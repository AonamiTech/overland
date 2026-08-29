import React from 'react';

const ACCENT = '#1E4D6B';

/** Read-only star row, or an input when onPick is supplied. */
export default function Stars({
  value, size = 14, onPick,
}: { value: number; size?: number; onPick?: (n: 1|2|3|4|5) => void }) {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= Math.round(value);
        const star = (
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden
               fill={on ? ACCENT : 'none'} stroke={on ? ACCENT : 'rgba(17,17,17,.25)'} strokeWidth="1.6">
            <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.4l1.2-6.5L2.5 9.3l6.6-.9z" />
          </svg>
        );
        return onPick ? (
          <button key={n} type="button" onClick={() => onPick(n as 1|2|3|4|5)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`} className="p-0.5">
            {star}
          </button>
        ) : <span key={n}>{star}</span>;
      })}
    </span>
  );
}
