
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Shield, Bell, CreditCard, Camera, Edit, Trash2, Plus } from "lucide-react";
import DashboardLayout from './DashboardLayout';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailNewLoad: true,
    smsNewBid: false,
    whatsappPayment: true,
    emailPromotions: false
  });

  const paymentMethods = [
    {
      id: 1,
      bankName: 'Bank of America',
      accountNumber: '****1234',
      ifsc: '026009593',
      accountType: 'Checking'
    },
    {
      id: 2,
      bankName: 'Wells Fargo',
      accountNumber: '****5678',
      ifsc: '121000248',
      accountType: 'Savings'
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard }
  ];

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <DashboardLayout
      userRole="broker"
      userName="Mike Johnson"
      userId="BR123456"
      isVerified={false}
      verificationStatus="not-started"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm ov-num" style={{ color: '#A9A29A' }}>
          Dashboard &gt; Settings
        </p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="ov-eyebrow mb-3"><span className="dot" />ACCOUNT</div>
        <h1 className="ov-display text-3xl mb-6">
          Account Settings
        </h1>

        {/* Tab Navigation */}
        <div className="mb-6" style={{ borderBottom: '1px solid #E7E3DC' }}>
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2 pb-4 transition-colors duration-200"
                  style={{
                    borderBottom: isActive ? '2px solid #0E32E8' : '2px solid transparent',
                    color: isActive ? '#0E32E8' : '#5B6470',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="ov-card">
          <CardHeader>
            <CardTitle className="ov-display text-xl">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: 'rgba(14,50,232,0.08)' }}>
                  <span className="ov-display text-4xl" style={{ color: '#0E32E8' }}>M</span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors" style={{ background: '#0E32E8' }}>
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: '#14161A' }}>Mike Johnson</h3>
                <p className="mb-2 ov-num" style={{ color: '#5B6470' }}>Broker ID: BR123456</p>
                <button className="ov-btn ov-btn-outline">
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  Full Name *
                </label>
                <Input defaultValue="Mike Johnson" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  Email Address *
                </label>
                <Input type="email" defaultValue="mike.johnson@email.com" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  Phone Number *
                </label>
                <div className="flex">
                  <Input defaultValue="(214) 555-0173" />
                  <button className="ov-btn ov-btn-outline ml-2">
                    Verify
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  Date of Birth
                </label>
                <Input type="date" defaultValue="1985-06-15" />
              </div>
            </div>

            {/* Company Information */}
            <div className="pt-6" style={{ borderTop: '1px solid #ECE8E1' }}>
              <h3 className="ov-display text-lg mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                    Company Name
                  </label>
                  <Input defaultValue="Johnson Logistics LLC" disabled />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                    EIN
                  </label>
                  <Input className="ov-num" defaultValue="45-1234789" disabled />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                    Business Address
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: '#E7E3DC', background: '#FBFAF8' }}
                    rows={3}
                    defaultValue="123 Commerce Blvd, Suite 400, Dallas, TX 75201"
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="ov-btn ov-btn-ink">
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display text-xl">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  Current Password *
                </label>
                <Input type="password" placeholder="Enter current password" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  New Password *
                </label>
                <Input type="password" placeholder="Enter new password" />
                <p className="text-xs mt-1" style={{ color: '#A9A29A' }}>
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#5B6470' }}>
                  Confirm New Password *
                </label>
                <Input type="password" placeholder="Confirm new password" />
              </div>

              <div className="flex justify-end">
                <button className="ov-btn ov-btn-ink">
                  Save Password
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display text-xl">
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#14161A' }}>SMS Authentication</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>
                    Get security codes via SMS to your registered phone number
                  </p>
                  <Badge className="mt-2" style={{ background: 'rgba(168,65,47,0.10)', color: '#A8412F' }}>
                    Currently Disabled
                  </Badge>
                </div>
                <button className="ov-btn ov-btn-ink">
                  Enable 2FA
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="ov-card">
          <CardHeader>
            <CardTitle className="ov-display text-xl">
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                <div>
                  <h3 className="font-medium" style={{ color: '#14161A' }}>New Load Posted</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Get notified when loads matching your criteria are posted</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notifications.emailNewLoad}
                      onChange={() => handleNotificationToggle('emailNewLoad')}
                      className="rounded"
                      style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="text-sm" style={{ color: '#3E3F46' }}>Email</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                <div>
                  <h3 className="font-medium" style={{ color: '#14161A' }}>New Bid Received</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Get notified when carriers bid on your loads</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notifications.smsNewBid}
                      onChange={() => handleNotificationToggle('smsNewBid')}
                      className="rounded"
                      style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="text-sm" style={{ color: '#3E3F46' }}>SMS</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                <div>
                  <h3 className="font-medium" style={{ color: '#14161A' }}>Payment Status Updates</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Get notified about commission payments and invoices</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notifications.whatsappPayment}
                      onChange={() => handleNotificationToggle('whatsappPayment')}
                      className="rounded"
                      style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="text-sm" style={{ color: '#3E3F46' }}>WhatsApp</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                <div>
                  <h3 className="font-medium" style={{ color: '#14161A' }}>Promotional Offers</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Receive updates about new features and special offers</p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notifications.emailPromotions}
                      onChange={() => handleNotificationToggle('emailPromotions')}
                      className="rounded"
                      style={{ accentColor: '#0E32E8' }}
                    />
                    <span className="text-sm" style={{ color: '#3E3F46' }}>Email</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="ov-btn ov-btn-ink">
                Save Preferences
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <Card className="ov-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ov-display text-xl">
                Payment Methods
              </CardTitle>
              <button className="ov-btn ov-btn-ink">
                <Plus className="w-4 h-4 mr-2" />
                Add New Account
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-4 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(14,50,232,0.08)' }}>
                      <CreditCard className="w-6 h-6" style={{ color: '#0E32E8' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#14161A' }}>{method.bankName}</h3>
                      <p className="text-sm" style={{ color: '#5B6470' }}>
                        {method.accountType} Account: <span className="ov-num">{method.accountNumber}</span>
                      </p>
                      <p className="text-xs" style={{ color: '#A9A29A' }}>Routing: <span className="ov-num">{method.ifsc}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" style={{ color: '#5B6470' }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" style={{ color: '#A8412F' }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
