
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarItem } from './types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  sidebarItems: SidebarItem[];
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ sidebarItems, isSidebarCollapsed, setIsSidebarCollapsed }: SidebarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (item: SidebarItem) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#FCFBF9] border-r border-[#E7E3DC] transition-all duration-300 z-40 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-[#E7E3DC] rounded-full flex items-center justify-center transition-colors duration-200 hover:border-[#14161A] z-50"
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-[#14161A]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#14161A]" />
        )}
      </button>

      <ScrollArea className="h-full">
        <div className="p-3 pt-8 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors duration-200 group relative ${
                  item.isActive
                    ? 'bg-[#111217] text-white'
                    : 'text-[#5B6470] hover:bg-[#F1EEE8] hover:text-[#14161A]'
                }`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <div className="flex-shrink-0">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </div>
                {!isSidebarCollapsed && (
                  <span className="font-poppins font-medium text-[13.5px] truncate">
                    {item.label}
                  </span>
                )}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-[#111217] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-xl font-poppins">
                    {item.label}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#111217] rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
