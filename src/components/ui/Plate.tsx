import React from 'react';

interface PlateProps {
  /** Combined plate string, e.g. "TX-1234-AB". Overrides state/number if given. */
  value?: string;
  /** Explicit US state abbreviation, e.g. "TX". */
  state?: string;
  /** Explicit plate number, e.g. "1234 AB". */
  number?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const parse = (value?: string): { state: string; number: string } => {
  if (!value) return { state: 'US', number: '' };
  const m = value.match(/^([A-Za-z]{2})[- ]?(.+)$/);
  if (m) return { state: m[1].toUpperCase(), number: m[2].replace(/-/g, ' ').trim() };
  return { state: 'US', number: value };
};

/**
 * US license plate — Overland's first-class regional component.
 * Blue state tab + JetBrains Mono plate number, mirroring the Aonami plate pattern.
 * Never render a plate as plain text; use <Plate value="TX-1234-AB" />.
 */
const Plate = ({ value, state, number, size = 'md', className = '' }: PlateProps) => {
  const p = state && number ? { state, number } : parse(value);
  const dims =
    size === 'lg'
      ? { tab: 'text-[11px] px-2', num: 'text-[17px] px-2.5 py-1' }
      : size === 'sm'
      ? { tab: 'text-[8px] px-1', num: 'text-[11px] px-1.5 py-0.5' }
      : { tab: 'text-[9px] px-1.5', num: 'text-[13px] px-2 py-0.5' };

  return (
    <span
      className={`inline-flex items-stretch overflow-hidden rounded-md border border-line align-middle ${className}`}
    >
      <span className={`flex items-center bg-truck-red font-semibold uppercase tracking-wide text-white ${dims.tab}`}>
        {p.state}
      </span>
      <span
        className={`flex items-center bg-white font-mono font-semibold uppercase tracking-wider text-truck-black ${dims.num}`}
      >
        {p.number}
      </span>
    </span>
  );
};

export default Plate;
