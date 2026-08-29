
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Eye, EyeOff, Shield, Bell, CreditCard, Building, Key } from "lucide-react";
import DashboardLayout from '../DashboardLayout';

const CorporateSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'payment' | 'company' | 'api'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Camera },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'company', label: 'Company Details', icon: Building },
    { id: 'api', label: 'API Credentials', icon: Key },
  ];

  const notificationSettings = [
    { id: 'newLoadMatch', label: 'New Load Match Alerts', email: true, sms: true, whatsapp: false },
    { id: 'insuranceExpiry', label: 'Insurance Expiry Alerts', email: true, sms: false, whatsapp: false },
    { id: 'paymentStatus', label: 'Payment Status Updates', email: true, sms: true, whatsapp: false },
    { id: 'weeklySpend', label: 'Weekly Spend Summary', email: true, sms: false, whatsapp: false },
    { id: 'systemAnnouncements', label: 'System Announcements', email: true, sms: false, whatsapp: false },
    { id: 'securityAlerts', label: 'Security Alerts', email: true, sms: false, whatsapp: false },
  ];

  return (
    <DashboardLayout
      userRole="corporate"
      userName="Sarah Mitchell"
      userId="CC12345678"
      isVerified={false}
      verificationStatus="pending"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Dashboard &gt; Settings</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="ov-eyebrow"><span className="dot" />Settings</div>
        <h1 className="ov-display text-3xl mb-2" style={{ color: '#14161A' }}>
          Account Settings
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
            className={activeTab === tab.id ? 'ov-btn ov-btn-ink' : 'ov-btn ov-btn-outline'}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <Card className="ov-card p-6">
          <h3 className="ov-display text-lg mb-6" style={{ color: '#14161A' }}>Profile Information</h3>
          
          {/* Avatar Section */}
          <div className="flex items-center mb-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold" style={{ background: 'rgba(14,50,232,0.08)', color: '#0E32E8' }}>
              S
            </div>
            <div className="ml-6">
              <Button variant="outline" className="ov-btn ov-btn-outline">
                <Camera className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm mt-1" style={{ color: '#A9A29A' }}>JPEG or PNG, max 2MB</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Full Name *
              </label>
              <input
                type="text"
                defaultValue="Sarah Mitchell"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Email *
              </label>
              <input
                type="email"
                defaultValue="sarah.mitchell@techsolutions.com"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Phone *
              </label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  defaultValue="(312) 555-0110"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ov-num" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
                />
                <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                  Verify
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Customer ID
              </label>
              <input
                type="text"
                value="CC12345678"
                disabled
                className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
              />
            </div>
          </div>

          {/* Company Information (Read-only) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="ov-display text-base mb-4" style={{ color: '#14161A' }}>Company Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value="Tech Solutions USA Inc"
                  disabled
                  className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                  EIN
                </label>
                <input
                  type="text"
                  value="82-1234567"
                  disabled
                  className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button className="ov-btn ov-btn-ink">
              Save Changes
            </Button>
            <Button variant="outline" className="ov-btn ov-btn-outline">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <Card className="ov-card p-6">
            <h3 className="ov-display text-lg mb-6" style={{ color: '#14161A' }}>Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                  New Password *
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
                />
                <div className="mt-1 text-sm" style={{ color: '#0F7A4A' }}>Strong</div>
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
                />
              </div>
            </div>

            <Button className="mt-4 ov-btn ov-btn-ink">
              Save Password
            </Button>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="ov-card p-6">
            <h3 className="ov-display text-lg mb-6" style={{ color: '#14161A' }}>Two-Factor Authentication (2FA)</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: '#14161A' }}>2FA Status:</p>
                <p className="text-sm" style={{ color: '#5B6470' }}>
                  {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={twoFactorEnabled ? 'text-white' : ''} style={twoFactorEnabled ? { background: '#0F7A4A' } : { background: '#F1EEE8', color: '#5B6470' }}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Button
                  variant={twoFactorEnabled ? 'outline' : 'default'}
                  className={twoFactorEnabled ? 'ov-btn ov-btn-outline' : 'ov-btn ov-btn-ink'}
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card className="ov-card p-6">
          <h3 className="ov-display text-lg mb-6" style={{ color: '#14161A' }}>Notification Preferences</h3>
          
          <div className="space-y-6">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: '#ECE8E1' }}>
                <div>
                  <p className="font-medium" style={{ color: '#14161A' }}>{setting.label}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={setting.email}
                      className="w-4 h-4 border-gray-300 rounded" style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="ml-2 text-sm" style={{ color: '#5B6470' }}>Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={setting.sms}
                      className="w-4 h-4 border-gray-300 rounded" style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="ml-2 text-sm" style={{ color: '#5B6470' }}>SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={setting.whatsapp}
                      className="w-4 h-4 border-gray-300 rounded" style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="ml-2 text-sm" style={{ color: '#5B6470' }}>WhatsApp</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-6 ov-btn ov-btn-ink">
            Save Preferences
          </Button>
        </Card>
      )}

      {activeTab === 'payment' && (
        <Card className="ov-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Payment Methods</h3>
            <Button className="ov-btn ov-btn-ink">
              Add New Payment Method
            </Button>
          </div>

          <div className="space-y-4">
            <Card className="ov-card p-4" style={{ background: '#FBFAF8' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: '#14161A' }}>Chase Bank</p>
                  <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Account: ****1234 | Routing: 021000021</p>
                  <p className="text-sm" style={{ color: '#A9A29A' }}>Business Checking</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" style={{ color: '#A8412F', borderColor: '#A8412F' }}>
                    Remove
                  </Button>
                </div>
              </div>
            </Card>

            <div className="text-center py-8" style={{ color: '#A9A29A' }}>
              <p>No additional payment methods added yet.</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'company' && (
        <Card className="ov-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Company Details</h3>
            <Badge className="text-white" style={{ background: '#0F7A4A' }}>
              Verified
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Company Name *
              </label>
              <input
                type="text"
                value="Tech Solutions USA Inc"
                disabled
                className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                EIN *
              </label>
              <input
                type="text"
                value="82-1234567"
                disabled
                className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Registered Address *
              </label>
              <textarea
                value="Cicero, Chicago, Illinois - 60804"
                disabled
                rows={3}
                className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Business Type *
              </label>
              <select 
                disabled
                className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
              >
                <option>MNC</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>
                Industry Sector *
              </label>
              <select 
                disabled
                className="w-full px-3 py-2 border rounded-lg ov-num" style={{ borderColor: '#E7E3DC', background: '#FBFAF8', color: '#5B6470' }}
              >
                <option>IT</option>
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm" style={{ color: '#A9A29A' }}>
            Company details are verified and cannot be modified. Contact support if changes are needed.
          </p>
        </Card>
      )}

      {activeTab === 'api' && (
        <Card className="ov-card p-6">
          <h3 className="ov-display text-lg mb-6" style={{ color: '#14161A' }}>API Credentials</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-[#ECE8E1]">
                <tr>
                  <td className="py-4 pr-6 text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>API Key</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 rounded text-sm ov-num" style={{ background: '#F1EEE8', color: '#14161A' }}>tk_**********************</code>
                      <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                        Show
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Secret Key</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 rounded text-sm ov-num" style={{ background: '#F1EEE8', color: '#14161A' }}>**********************</code>
                      <Button size="sm" className="ov-btn ov-btn-ink">
                        Regenerate
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Webhook URL</td>
                  <td className="py-4">
                    <input
                      type="text"
                      placeholder="https://your-domain.com/webhook"
                      className="w-full max-w-md px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#E7E3DC', '--tw-ring-color': '#0E32E8' } as React.CSSProperties}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h4 className="ov-display text-base mb-3" style={{ color: '#14161A' }}>API Permissions</h4>
            <div className="space-y-2">
              {['Read Loads', 'Read Trucks', 'Place Orders', 'Update Status'].map((permission) => (
                <label key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 border-gray-300 rounded" style={{ accentColor: '#0E32E8' }}
                  />
                  <span className="ml-2 text-sm" style={{ color: '#3E3F46' }}>{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <Button className="mt-6 ov-btn ov-btn-ink">
            Save Permissions
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default CorporateSettingsPage;
