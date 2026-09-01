
import React, { useState } from 'react';
import { scrollToEl } from '@/lib/scrollTo';
import { Menu, X } from "lucide-react";
import AuthModal from './AuthModal';
import ContactModal from './ContactModal';
import NotificationModal from './NotificationModal';
import NavigationLogo from './navigation/NavigationLogo';
import NavigationLinks from './navigation/NavigationLinks';
import NavigationActions from './navigation/NavigationActions';
import MobileMenu from './navigation/MobileMenu';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', anchor: '#hero' },
    { name: 'Features', anchor: '#how-it-works' },
    { name: 'Pricing', anchor: '#pricing' },
    { name: 'Support', anchor: '#support' }
  ];

  const handleNavClick = (link: { name: string; anchor: string }) => {
    setActiveLink(link.name);
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(link.anchor);
    if (element) {
      scrollToEl(element, { offset: 72 });
    }
  };

  const handleLogoClick = () => {
    // Redirect to homepage
    window.location.href = '/';
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleMobileContactClick = () => {
    setIsContactModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleMobileLoginClick = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = (role: 'broker' | 'fleet' | 'corporate') => {
    console.log(`Login successful for ${role}`);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FBFAF8]/85 backdrop-blur-xl border-b border-[#E7E3DC]">
        <div className="mx-auto flex items-center justify-between h-16 px-6 lg:px-8 max-w-[1240px]">
          <NavigationLogo onLogoClick={handleLogoClick} />
          
          <NavigationLinks 
            navLinks={navLinks}
            activeLink={activeLink}
            onNavClick={handleNavClick}
          />

          <NavigationActions 
            onContactClick={handleContactClick}
            onLoginClick={handleLoginClick}
            onNotificationClick={handleNotificationClick}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden transition-colors duration-200 hover:text-[#0E32E8] focus:outline-none focus:ring-2 focus:ring-[#0E32E8] focus:ring-offset-2"
            style={{ color: '#1A1A1A' }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <MobileMenu 
          isOpen={isMenuOpen}
          navLinks={navLinks}
          activeLink={activeLink}
          onNavClick={handleNavClick}
          onContactClick={handleMobileContactClick}
          onLoginClick={handleMobileLoginClick}
        />
      </nav>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
