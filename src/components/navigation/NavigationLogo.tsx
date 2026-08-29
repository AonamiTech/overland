
import React from 'react';
import BrandLogo from '@/components/ui/BrandLogo';

interface NavigationLogoProps {
  onLogoClick: () => void;
}

const NavigationLogo = ({ onLogoClick }: NavigationLogoProps) => {
  return (
    <div className="flex items-center">
      <BrandLogo
        height={30}
        onClick={onLogoClick}
        className="transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default NavigationLogo;
