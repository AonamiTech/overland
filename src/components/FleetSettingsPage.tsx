
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Truck, Bell, Shield, CreditCard, MapPin, Settings, Save } from 'lucide-react';

const FleetSettingsPage = () => {
  const [notifications, setNotifications] = useState({
    loadAlerts: true,
    paymentReminders: true,
    maintenanceAlerts: true,
    bidUpdates: false
  });

  const [autoBidSettings, setAutoBidSettings] = useState({
    enabled: false,
    maxBidAmount: 3000,
    preferredRoutes: ['DAL-LAX', 'CHI-ATL'],
    autoAcceptThreshold: 80
  });

  const settingSections = [
    {
      id: 'profile',
      title: 'Fleet Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="ABC Logistics LLC" />
            </div>
            <div>
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input id="contact-person" defaultValue="Mike Johnson" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="(213) 555-0198" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue="mike@abclogistics.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" defaultValue="123 Freight Way, Dallas, TX 75201" />
          </div>
        </div>
      )
    },
    {
      id: 'fleet',
      title: 'Fleet Configuration',
      icon: Truck,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
            <div>
              <h4 className="font-medium" style={{ color: '#14161A' }}>Total Fleet Size</h4>
              <p className="text-sm" style={{ color: '#5B6470' }}><span className="ov-num">35</span> vehicles registered</p>
            </div>
            <Badge style={{ background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' }}>Active</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default-rate">Default Rate per Mile ($)</Label>
              <Input id="default-rate" defaultValue="2.80" type="number" />
            </div>
            <div>
              <Label htmlFor="fuel-surcharge">Fuel Surcharge (%)</Label>
              <Input id="fuel-surcharge" defaultValue="8" type="number" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch className="data-[state=checked]:bg-[#0E32E8]" id="maintenance-mode" />
            <Label htmlFor="maintenance-mode">Enable predictive maintenance alerts</Label>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="load-alerts">New Load Alerts</Label>
              <Switch className="data-[state=checked]:bg-[#0E32E8]"
                id="load-alerts" 
                checked={notifications.loadAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, loadAlerts: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payment-reminders">Payment Reminders</Label>
              <Switch className="data-[state=checked]:bg-[#0E32E8]"
                id="payment-reminders" 
                checked={notifications.paymentReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, paymentReminders: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
              <Switch className="data-[state=checked]:bg-[#0E32E8]"
                id="maintenance-alerts" 
                checked={notifications.maintenanceAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, maintenanceAlerts: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="bid-updates">Bid Updates</Label>
              <Switch className="data-[state=checked]:bg-[#0E32E8]"
                id="bid-updates" 
                checked={notifications.bidUpdates}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, bidUpdates: checked }))}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'auto-bid',
      title: 'Auto-Bid Settings',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(14,50,232,0.06)', border: '1px solid #E7E3DC' }}>
            <div>
              <h4 className="font-medium" style={{ color: '#14161A' }}>Auto-Bid Status</h4>
              <p className="text-sm" style={{ color: '#5B6470' }}>Automatically bid on suitable loads</p>
            </div>
            <Switch className="data-[state=checked]:bg-[#0E32E8]"
              checked={autoBidSettings.enabled}
              onCheckedChange={(checked) => setAutoBidSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          {autoBidSettings.enabled && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="max-bid">Maximum Bid Amount ($)</Label>
                <Input 
                  id="max-bid" 
                  type="number" 
                  value={autoBidSettings.maxBidAmount}
                  onChange={(e) => setAutoBidSettings(prev => ({ ...prev, maxBidAmount: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="auto-accept">Auto-Accept Threshold (%)</Label>
                <Input 
                  id="auto-accept" 
                  type="number" 
                  value={autoBidSettings.autoAcceptThreshold}
                  onChange={(e) => setAutoBidSettings(prev => ({ ...prev, autoAcceptThreshold: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-gray-500 mt-1">Automatically accept loads above this profit margin</p>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input id="bank-name" defaultValue="Bank of America" />
            </div>
            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input id="account-number" defaultValue="••••••••••5678" type="password" />
            </div>
            <div>
              <Label htmlFor="ifsc">Routing Number</Label>
              <Input id="ifsc" defaultValue="026009593" />
            </div>
            <div>
              <Label htmlFor="gst">EIN</Label>
              <Input id="gst" defaultValue="45-1234789" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch className="data-[state=checked]:bg-[#0E32E8]" id="auto-payment" />
            <Label htmlFor="auto-payment">Enable automatic payment processing</Label>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start" style={{ color: '#A8412F', borderColor: 'rgba(168,65,47,0.4)' }}>
              Delete Account
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout 
      userRole="fleet" 
      userName="Fleet Owner" 
      userId="FO123456" 
      isVerified={true}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="ov-eyebrow mb-2"><span className="dot" />FLEET</div>
            <h1 className="ov-display text-3xl">Fleet Settings</h1>
            <p className="mt-1" style={{ color: '#5B6470' }}>Manage your fleet preferences and configuration</p>
          </div>
          <button className="ov-btn ov-btn-ink">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </button>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} className="ov-card">
                <CardHeader>
                  <CardTitle className="ov-display flex items-center space-x-2">
                    <span className="ov-tick" style={{ width: 28, height: 28 }}>
                      <Icon className="w-4 h-4" style={{ color: '#0E32E8' }} />
                    </span>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.content}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FleetSettingsPage;
