
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserIcon, SettingsIcon, ShieldIcon, LogOutIcon } from './InsuranceIcons';

interface ProfileDropdownProps {
  showProfile: boolean;
  onToggle: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ showProfile, onToggle }) => {
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-2"
        onClick={onToggle}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: '#111217' }}>
          R
        </div>
      </Button>

      {showProfile && (
        <div className="absolute right-0 top-12 w-64 ov-card z-50" style={{ boxShadow: '0 18px 40px -24px rgba(20,22,26,0.35)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid #ECE8E1' }}>
            <h3 className="font-semibold" style={{ color: '#14161A' }}>Mike Johnson</h3>
            <p className="text-sm" style={{ color: '#5B6470' }}>rajesh@transport.com</p>
            <p className="text-xs ov-num" style={{ color: '#8B857C' }}>Broker ID: BR123456</p>
            <Badge className="mt-2" style={{ background: 'rgba(180,83,9,0.10)', color: '#B45309' }}>Not Verified</Badge>
          </div>
          <div className="p-2">
            <Button variant="ghost" size="sm" className="w-full justify-start" style={{ color: '#3E3F46' }}>
              <UserIcon className="w-4 h-4 mr-2" />
              My Profile
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" style={{ color: '#3E3F46' }}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" style={{ color: '#3E3F46' }}>
              <ShieldIcon className="w-4 h-4 mr-2" />
              KYC Verification
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" style={{ color: '#A8412F' }}>
              <LogOutIcon className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
