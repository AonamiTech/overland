import React from 'react';

interface NavLink {
  name: string;
  anchor: string;
}

interface NavigationLinksProps {
  navLinks: NavLink[];
  activeLink: string;
  onNavClick: (link: NavLink) => void;
}

const NavigationLinks = ({ navLinks, activeLink, onNavClick }: NavigationLinksProps) => {
  return (
    <div className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => onNavClick(link)}
          className={`font-poppins text-[14px] font-medium transition-colors duration-200 focus:outline-none ${
            activeLink === link.name
              ? 'text-[#111217]'
              : 'text-[#6B6B72] hover:text-[#111217]'
          }`}
        >
          {link.name}
        </button>
      ))}
    </div>
  );
};

export default NavigationLinks;
