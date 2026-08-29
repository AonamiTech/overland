
import { SidebarItem } from './types';
import { 
  Home, 
  Package, 
  Truck, 
  Shield, 
  Briefcase, 
  BarChart3, 
  Settings,
  Upload,
  MapPin,
  HeadphonesIcon,
  DollarSign,
  FileText,
  Building2,
  Zap,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

export const getSidebarItems = (userRole: 'broker' | 'fleet' | 'corporate', currentPath: string): SidebarItem[] => {
  switch (userRole) {
    case 'broker':
      return [
        { icon: Home, label: 'Dashboard', id: 'dashboard', route: '/broker-dashboard', isActive: currentPath === '/broker-dashboard' },
        { icon: Package, label: 'Post Loads', id: 'post-loads', route: '/post-loads', isActive: currentPath === '/post-loads' },
        { icon: Truck, label: 'Hire Trucks', id: 'hire-trucks', route: '/hire-trucks', isActive: currentPath === '/hire-trucks' },
        { icon: Shield, label: 'Insurance', id: 'insurance', route: '/broker-insurance', isActive: currentPath === '/broker-insurance' },
        { icon: Target, label: 'Bidding Exchange', id: 'bidding-exchange', route: '/broker-bidding-exchange', isActive: currentPath === '/broker-bidding-exchange' },
        { icon: DollarSign, label: 'Commission Tracking', id: 'commission', route: '/commission-tracking', isActive: currentPath === '/commission-tracking' },
        { icon: BarChart3, label: 'Reports & Analytics', id: 'reports', route: '/reports-analytics', isActive: currentPath === '/reports-analytics' },
        { icon: Settings, label: 'Settings', id: 'settings', route: '/settings', isActive: currentPath === '/settings' },
      ];
    case 'fleet':
      return [
        { icon: Home, label: 'Dashboard', id: 'dashboard', route: '/fleet-dashboard', isActive: currentPath === '/fleet-dashboard' },
        { icon: Truck, label: 'Post Truck', id: 'post-truck', route: '/post-truck', isActive: currentPath === '/post-truck' },
        { icon: TrendingUp, label: 'Fleet Management', id: 'fleet-management', route: '/fleet-management', isActive: currentPath === '/fleet-management' },
        { icon: Shield, label: 'Insurance', id: 'insurance', route: '/fleet-insurance', isActive: currentPath === '/fleet-insurance' },
        { icon: Target, label: 'Bidding Exchange', id: 'bidding-exchange', route: '/fleet-bidding-exchange', isActive: currentPath === '/fleet-bidding-exchange' },
        { icon: MapPin, label: 'GPS Tracking', id: 'gps-tracking', route: '/gps-tracking', isActive: currentPath === '/gps-tracking' },
        { icon: HeadphonesIcon, label: 'Support', id: 'support', route: '/fleet-support', isActive: currentPath === '/fleet-support' },
        { icon: Settings, label: 'Settings', id: 'settings', route: '/fleet-settings', isActive: currentPath === '/fleet-settings' },
      ];
    case 'corporate':
      return [
        { icon: Home, label: 'Dashboard', id: 'dashboard', route: '/corporate-dashboard', isActive: currentPath === '/corporate-dashboard' },
        { icon: FileText, label: 'Post Load', id: 'post-load', route: '/corporate/post-load', isActive: currentPath === '/corporate/post-load' },
        { icon: Upload, label: 'Bulk Upload', id: 'bulk-upload', route: '/corporate/bulk-upload', isActive: currentPath === '/corporate/bulk-upload' },
        { icon: Shield, label: 'Insurance Hub', id: 'insurance-hub', route: '/corporate/insurance-hub', isActive: currentPath === '/corporate/insurance-hub' },
        { icon: Target, label: 'Bidding Exchange', id: 'bidding-exchange', route: '/corporate-bidding-exchange', isActive: currentPath === '/corporate-bidding-exchange' },
        { icon: MapPin, label: 'Live Tracking', id: 'live-tracking', route: '/corporate/live-tracking', isActive: currentPath === '/corporate/live-tracking' },
        { icon: BarChart3, label: 'Analytics', id: 'analytics', route: '/corporate/analytics', isActive: currentPath === '/corporate/analytics' },
        { icon: Zap, label: 'ERP Integration', id: 'erp-integration', route: '/corporate/erp-integration', isActive: currentPath === '/corporate/erp-integration' },
        { icon: Settings, label: 'Settings', id: 'settings', route: '/corporate/settings', isActive: currentPath === '/corporate/settings' },
      ];
    default:
      return [];
  }
};
