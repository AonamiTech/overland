import React from 'react';

interface NavLink {
  name: string;
  anchor: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  activeLink: string;
  onNavClick: (link: NavLink) => void;
  onContactClick: () => void;
  onLoginClick: () => void;
}

const MobileMenu = ({ isOpen, navLinks, activeLink, onNavClick, onContactClick, onLoginClick }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FBFAF8]/98 backdrop-blur-xl border-t border-[#E7E3DC]">
      <div className="px-6 py-6 space-y-1">
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => onNavClick(link)}
            className={`block w-full text-left font-poppins text-[15px] font-medium py-2.5 transition-colors duration-200 focus:outline-none ${
              activeLink === link.name ? 'text-[#0E32E8]' : 'text-[#111217] hover:text-[#0E32E8]'
            }`}
          >
            {link.name}
          </button>
        ))}

        <div className="pt-4 mt-2 border-t border-[#E7E3DC] space-y-3">
          <button onClick={onContactClick} className="ov-btn ov-btn-outline w-full">
            Contact
          </button>
          <button onClick={onLoginClick} className="ov-btn ov-btn-ink w-full">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
