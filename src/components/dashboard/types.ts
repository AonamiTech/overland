
export interface SidebarItem {
  icon: React.ComponentType<any>;
  label: string;
  id: string;
  route?: string;
  isActive?: boolean;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'broker' | 'fleet' | 'corporate';
  userName: string;
  userId: string;
  isVerified: boolean;
  verificationStatus?: 'verified' | 'pending' | 'not-started';
}
