
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from './dashboard/NavigationBar';
import Sidebar from './dashboard/Sidebar';
import { getSidebarItems } from './dashboard/sidebarConfig';
import { DashboardLayoutProps } from './dashboard/types';

const DashboardLayout = ({ 
  children, 
  userRole, 
  userName, 
  userId, 
  isVerified,
  verificationStatus = 'not-started'
}: DashboardLayoutProps) => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const sidebarItems = getSidebarItems(userRole, location.pathname);

  return (
    <div className="min-h-screen bg-[#FBFAF8] flex">
      <NavigationBar
        userRole={userRole}
        userName={userName}
        userId={userId}
        verificationStatus={verificationStatus}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        unreadNotifications={unreadNotifications}
      />

      <Sidebar
        sidebarItems={sidebarItems}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content with native scroll and improved spacing */}
      <main className={`flex-1 transition-all duration-300 pt-16 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-2 min-h-full">
            <div className="max-w-7xl mx-auto space-y-4">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Click outside to close dropdowns */}
      {(showProfileDropdown || showNotifications) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowProfileDropdown(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
