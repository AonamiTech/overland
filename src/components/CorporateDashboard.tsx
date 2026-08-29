
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, MapPin, Shield, Target, Settings, Upload, TrendingUp, Clock, Users, DollarSign, Truck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const CorporateDashboard = () => {
  const [isVerified, setIsVerified] = React.useState(false);
  const navigate = useNavigate();

  const enterpriseFeatures = [
    {
      icon: FileText,
      title: "Post Individual Load",
      description: "Full load posting & bidding.",
      buttonText: "Post Now →",
      buttonVariant: "default" as const,
      route: "/corporate/post-load"
    },
    {
      icon: Upload,
      title: "Bulk Upload Loads",
      description: "Upload 100+ loads via CSV.",
      buttonText: "Upload Now →",
      buttonVariant: "default" as const,
      route: "/corporate/bulk-upload"
    },
    {
      icon: MapPin,
      title: "View Live Tracking",
      description: "Monitor all active shipments.",
      buttonText: "View Map →",
      buttonVariant: "outline" as const,
      route: "/corporate/live-tracking"
    },
    {
      icon: Shield,
      title: "In-Transit Insurance",
      description: "Protect platform & external loads.",
      buttonText: "Get Quote →",
      buttonVariant: "outline" as const,
      route: "/corporate/insurance-hub"
    },
    {
      icon: Target,
      title: "Bidding Exchange",
      description: "View, compare & award bids.",
      buttonText: "View Exchange →",
      buttonVariant: "default" as const,
      route: "/corporate-bidding-exchange"
    },
    {
      icon: Settings,
      title: "ERP Integration",
      description: "Connect with SAP, Oracle, custom APIs.",
      buttonText: "Configure →",
      buttonVariant: "outline" as const,
      route: "/corporate/erp-integration"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "View cost savings & performance.",
      buttonText: "View Reports →",
      buttonVariant: "outline" as const,
      route: "/corporate/analytics"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Manage account preferences.",
      buttonText: "Configure →",
      buttonVariant: "outline" as const,
      route: "/corporate/settings"
    }
  ];

  const metrics = [
    { label: "Active Loads", value: "15", subtext: "8 Bids Pending", color: "text-red-500", icon: FileText },
    { label: "In-Transit", value: "7", subtext: "6 On-Time / 1 Delayed", color: "text-green-500", icon: TrendingUp },
    { label: "Monthly Spend", value: "$312,000", subtext: "22% Saved vs Market", color: "text-red-500", icon: BarChart3 },
    { label: "Vendor Performance", value: "98%", subtext: "Avg. On-Time", color: "text-green-500", icon: Target }
  ];

  const recentActivity = [
    { icon: Target, text: "Load DAL→LAX awarded to ABC Logistics – $2,400", time: "1 hr ago" },
    { icon: DollarSign, text: "Advance payment of $2,280 processed to XYZ Carriers", time: "2 hrs ago" },
    { icon: Truck, text: "Truck TX-4821 delivered in Atlanta", time: "4 hrs ago" },
    { icon: FileText, text: "New vendor application approved", time: "Yesterday" },
    { icon: BarChart3, text: "Monthly spend report generated", time: "2 days ago" }
  ];

  const handleFeatureClick = (route: string) => {
    navigate(route);
  };

  return (
    <DashboardLayout
      userRole="corporate"
      userName="Sarah Mitchell"
      userId="CC12345678"
      isVerified={isVerified}
      verificationStatus={isVerified ? 'verified' : 'pending'}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div>
          <span className="ov-eyebrow"><span className="dot" />Enterprise</span>
          <h1 className="ov-display text-[28px] text-[#14161A] mt-1 mb-1">Corporate Dashboard</h1>
          <p className="text-[#5B6470] text-lg">
            Manage your enterprise logistics operations efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Enterprise Metrics */}
            <div>
              <h2 className="ov-display text-[22px] text-[#14161A] mb-6">
                Key Enterprise Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card key={index} className="ov-card p-6">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between mb-4">
                          <span className="ov-tick">
                            <IconComponent className="w-4 h-4" strokeWidth={1.8} />
                          </span>
                        </div>
                        <div className="ov-num text-[32px] leading-none text-[#14161A] mb-2">
                          {metric.value}
                        </div>
                        <div className="ov-num text-[11px] uppercase tracking-[0.12em] text-[#A9A29A] mb-1">
                          {metric.label}
                        </div>
                        <div className="text-xs text-[#5B6470]">
                          {metric.subtext}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Enterprise Features Grid */}
            <div>
              <h2 className="ov-display text-[22px] text-[#14161A] mb-6">
                Enterprise Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {enterpriseFeatures.map((feature, index) => (
                  <Card key={index} className="ov-card ov-card--hover p-6 group cursor-pointer"
                        onClick={() => handleFeatureClick(feature.route)}>
                    <CardHeader className="p-0 pb-3">
                      <span className="ov-tick mb-3">
                        <feature.icon className="w-4 h-4" strokeWidth={1.8} />
                      </span>
                      <CardTitle className="ov-display text-sm text-[#14161A] leading-tight">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-[#5B6470] mb-4 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                      <Button
                        variant={feature.buttonVariant}
                        size="sm"
                        className={`w-full ov-btn ${
                          feature.buttonVariant === 'default'
                            ? 'ov-btn-ink'
                            : 'ov-btn-outline'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeatureClick(feature.route);
                        }}
                      >
                        {feature.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Corporate Bidding Panel */}
            {isVerified && (
              <Card className="ov-card p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="ov-display text-xl text-[#14161A] flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                    Current RFQs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#3E3F46]"><span className="ov-num">DAL→LAX-001</span> – <span className="ov-num">12</span> bids (lowest <span className="ov-num">$2.1K</span>)</span>
                      <Badge variant="secondary" className="bg-[#F1EEE8] text-[#5B6470]">
                        <Clock className="w-3 h-3 mr-1" strokeWidth={1.8} />
                        <span className="ov-num">Closes in 4h</span>
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#3E3F46]"><span className="ov-num">CHI→ATL-002</span> – <span className="ov-num">8</span> bids (lowest <span className="ov-num">$1.8K</span>)</span>
                      <Badge variant="secondary" className="bg-[#F1EEE8] text-[#5B6470]">
                        <Clock className="w-3 h-3 mr-1" strokeWidth={1.8} />
                        <span className="ov-num">Closes in 6h</span>
                      </Badge>
                    </div>
                    <Button
                      className="w-full ov-btn ov-btn-ink mt-4"
                      onClick={() => navigate('/corporate-bidding-exchange')}
                    >
                      View Bidding Exchange →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Recent Activity & Quick Stats */}
          <div className="space-y-6">
            <Card className="ov-card p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="ov-display text-xl text-[#14161A] flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#FBFAF8] transition-colors cursor-pointer">
                      <span className="ov-tick h-8 w-8 shrink-0"><activity.icon className="h-4 w-4" strokeWidth={1.8} /></span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#14161A]">
                          {activity.text}
                        </p>
                        <p className="ov-num text-xs text-[#A9A29A]">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Manager */}
            {isVerified && (
              <Card className="ov-card p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="ov-display text-lg text-[#14161A] flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                    Your Account Manager
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#111217] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      SM
                    </div>
                    <h3 className="ov-display text-[#14161A]">Sarah Mitchell</h3>
                    <p className="text-sm text-[#5B6470] mb-3">Senior Account Manager</p>
                    <Button className="w-full ov-btn ov-btn-outline">
                      Contact Sarah
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Savings Summary */}
            <Card className="ov-card p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="ov-display text-lg text-[#14161A] flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                  This Month's Savings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5B6470]">Market Rate</span>
                    <span className="ov-num text-sm font-semibold text-[#14161A]">$400,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5B6470]">Overland Rate</span>
                    <span className="ov-num text-sm font-semibold text-[#0F7A4A]">$312,000</span>
                  </div>
                  <hr className="border-[#ECE8E1]" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#14161A]">Total Savings</span>
                    <span className="ov-num text-lg font-bold text-[#0F7A4A]">$88,000</span>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-[#0F7A4A] text-white"><span className="ov-num">22% Saved</span></Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateDashboard;
