import React from 'react';
import { Bell } from "lucide-react";

interface NavigationActionsProps {
  onContactClick: () => void;
  onLoginClick: () => void;
  onNotificationClick: () => void;
}

const NavigationActions = ({ onContactClick, onLoginClick, onNotificationClick }: NavigationActionsProps) => {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <button
        onClick={onNotificationClick}
        aria-label="Notifications"
        className="w-9 h-9 flex items-center justify-center rounded-full text-[#46474D] hover:bg-[#EFEFF1] transition-colors focus:outline-none"
      >
        <Bell className="w-[18px] h-[18px]" />
      </button>

      <button onClick={onContactClick} className="ov-btn ov-btn-ghost">
        Contact
      </button>

      <button onClick={onLoginClick} className="ov-btn ov-btn-ink">
        Sign in
        <svg className="arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default NavigationActions;
