
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckIcon, CheckCircleIcon, InfoIcon } from './InsuranceIcons';

interface CoverageOption {
  id: string;
  title: string;
  limit: string;
  premium: string;
  icon: string;
  features: string[];
  recommended?: boolean;
}

interface CoverageSelectorProps {
  coverageOptions: CoverageOption[];
  selectedCoverage: string;
  onCoverageChange: (coverage: string) => void;
  onShowComparison: () => void;
}

const CoverageSelector: React.FC<CoverageSelectorProps> = ({
  coverageOptions,
  selectedCoverage,
  onCoverageChange,
  onShowComparison
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="ov-eyebrow"><span className="dot" />Coverage Options</span>
        <Button
          variant="ghost"
          size="sm"
          className="ov-btn-ghost text-[#0E32E8]"
          onClick={onShowComparison}
        >
          <InfoIcon className="w-4 h-4 mr-1" />
          Compare All Plans
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coverageOptions.map((option) => {
          const isSelected = selectedCoverage === option.id;
          const isDark = isSelected || option.recommended;
          return (
          <div
            key={option.id}
            onClick={() => onCoverageChange(option.id)}
            className="ov-card ov-card--hover relative p-5 cursor-pointer"
            style={isSelected
              ? { background: '#0D0D11', borderColor: '#0D0D11' }
              : option.recommended
                ? { background: '#0D0D11', borderColor: '#0D0D11', opacity: 0.96 }
                : {}}
          >
            {option.recommended && (
              <div className="absolute -top-2 left-4 text-[10px] tracking-wide uppercase px-2 py-1 rounded-full" style={{ background: '#0E32E8', color: '#fff' }}>
                Recommended
              </div>
            )}

            <div className="text-center mb-3">
              <h3 className="ov-display text-lg" style={isDark ? { color: '#fff' } : {}}>{option.title}</h3>
              <span className="ov-num text-xs" style={{ color: isDark ? '#A9A29A' : '#8B857C' }}>{option.limit}</span>
            </div>

            <div className="text-center mb-4">
              <p className="ov-num text-3xl" style={{ color: isDark ? '#fff' : '#14161A' }}>${option.premium}</p>
            </div>

            <div className="space-y-1.5">
              {option.features.map((feature, idx) => (
                <p key={idx} className="text-xs flex items-center gap-2" style={{ color: isDark ? '#D8D6D2' : '#5B6470' }}>
                  <CheckIcon className="w-3 h-3 text-[#0E32E8]" />
                  {feature}
                </p>
              ))}
            </div>

            {isSelected && (
              <div className="absolute top-3 right-3">
                <CheckCircleIcon className="w-6 h-6 text-[#0E32E8]" />
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoverageSelector;
