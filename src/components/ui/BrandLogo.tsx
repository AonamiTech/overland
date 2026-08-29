import React from 'react';

interface BrandLogoProps {
  /** Rendered height of the lockup in px (mark + wordmark scale to this). */
  height?: number;
  className?: string;
  onClick?: () => void;
  /** 'dark' = ink wordmark for light backgrounds (default); 'light' = white wordmark for dark backgrounds. */
  tone?: 'dark' | 'light';
}

/**
 * Overland brand lockup — a blue wave/road mark + Khand wordmark.
 * Pure SVG + font, so it stays crisp at any size and follows the theme.
 */
const BrandLogo = ({ height = 32, className = '', onClick, tone = 'dark' }: BrandLogoProps) => {
  const mark = Math.round(height * 0.86);
  const font = Math.round(height * 0.74);
  const wordColor = tone === 'light' ? '#FFFFFF' : '#090A0F';
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ gap: Math.round(height * 0.22) }}
    >
      <svg width={mark} height={mark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10.4" stroke="#0E32E8" strokeWidth="1.7" />
        <path
          d="M3.8 13.6c2.3-3.4 5.4-3.4 8.2 0 2.8 3.4 5.9 3.4 8.2 0"
          stroke="#0E32E8"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="font-display font-semibold leading-none"
        style={{ fontSize: font, letterSpacing: '-0.01em', color: wordColor }}
      >
        Overland
      </span>
    </span>
  );
};

export default BrandLogo;
