
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, TrendingUp, CheckCircle, Clock, FileText, Calculator, Phone, Mail, AlertTriangle, Star, Users, Zap } from "lucide-react";

const FleetInsurancePage = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const insurancePlans = [
    {
      id: 'basic',
      title: 'Fleet Basic',
      subtitle: 'Essential Coverage',
      price: '$2,000',
      period: 'per vehicle/year',
      coverage: 'Up to $150K',
      icon: Shield,
      color: 'blue',
      features: [
        'Comprehensive vehicle coverage',
        'Third-party liability',
        'Basic roadside assistance',
        'Online claim filing',
        'Email support'
      ]
    },
    {
      id: 'premium',
      title: 'Fleet Premium',
      subtitle: 'Complete Protection',
      price: '$4,500',
      period: 'per vehicle/year',
      coverage: 'Up to $500K',
      icon: Star,
      color: 'red',
      popular: true,
      features: [
        'All Basic features',
        'Zero depreciation cover',
        'Engine protection',
        '24/7 roadside assistance',
        'Dedicated fleet manager',
        'Priority claims processing'
      ]
    },
    {
      id: 'enterprise',
      title: 'Fleet Enterprise',
      subtitle: 'Maximum Security',
      price: '$8,000',
      period: 'per vehicle/year',
      coverage: 'Up to $1M',
      icon: Users,
      color: 'purple',
      features: [
        'All Premium features',
        'Fleet analytics dashboard',
        'Driver behavior monitoring',
        'Preventive maintenance alerts',
        'Custom policy terms',
        'On-site claim settlement'
      ]
    }
  ];

  const fleetMetrics = [
    {
      title: 'Active Policies',
      value: '28',
      subtitle: 'Out of 35 vehicles',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Claims This Year',
      value: '3',
      subtitle: 'All settled',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Premium Savings',
      value: '$24K',
      subtitle: 'Fleet discount',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Coverage Score',
      value: '94%',
      subtitle: 'Excellent rating',
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentClaims = [
    {
      claimId: 'FLC-2024-001',
      vehicle: 'TX-1234-AB',
      type: 'Accident',
      amount: '$6,500',
      status: 'Settled',
      date: '15 Mar 2024'
    },
    {
      claimId: 'FLC-2024-002',
      vehicle: 'TX-5678-CD',
      type: 'Theft',
      amount: '$18,000',
      status: 'Processing',
      date: '20 Mar 2024'
    },
    {
      claimId: 'FLC-2024-003',
      vehicle: 'TX-9012-EF',
      type: 'Fire',
      amount: '$12,000',
      status: 'Approved',
      date: '25 Mar 2024'
    }
  ];

  const handleGetQuote = (planId: string) => {
    setSelectedPlan(planId);
    setShowQuoteForm(true);
  };

  const handleSubmitQuote = () => {
    toast({
      title: "Quote Request Submitted",
      description: "Our insurance specialist will contact you within 2 hours with a customized quote.",
    });
    setShowQuoteForm(false);
  };

  const getStatusColor = (status: string) => {
    return '';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Settled': return { background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' };
      case 'Approved': return { background: 'rgba(14,50,232,0.08)', color: '#0E32E8' };
      case 'Processing': return { background: 'rgba(180,83,9,0.10)', color: '#B45309' };
      default: return { background: '#F1EEE8', color: '#5B6470' };
    }
  };

  return (
    <DashboardLayout 
      userRole="fleet" 
      userName="Fleet Owner" 
      userId="FO123456" 
      isVerified={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="ov-eyebrow"><span className="dot" />Fleet Insurance</span>
            <h1 className="ov-display text-4xl mt-2 mb-2">Fleet Insurance Hub</h1>
            <p className="text-lg" style={{ color: '#5B6470' }}>Comprehensive insurance solutions for your entire fleet</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#0F7A4A' }}></div>
            <span className="text-sm font-medium" style={{ color: '#0F7A4A' }}>Insurance Active</span>
          </div>
        </div>

        {/* Fleet Insurance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fleetMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="ov-card ov-card--hover" style={{ background: '#FFFFFF' }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="ov-num text-2xl mb-1" style={{ color: '#14161A' }}>{metric.value}</p>
                      <p className="text-sm font-medium mb-1" style={{ color: '#3E3F46' }}>{metric.title}</p>
                      <p className="text-xs" style={{ color: '#8B857C' }}>{metric.subtitle}</p>
                    </div>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,50,232,0.08)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#0E32E8' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 rounded-full p-1" style={{ background: '#F1EEE8' }}>
          {[
            { id: 'overview', label: 'Insurance Plans', icon: Shield },
            { id: 'claims', label: 'Claims Management', icon: FileText },
            { id: 'analytics', label: 'Fleet Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-medium transition-all duration-200"
                style={activeTab === tab.id
                  ? { background: '#111217', color: '#fff' }
                  : { color: '#5B6470', background: 'transparent' }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Insurance Plans */}
            <div>
              <h2 className="ov-display text-2xl mb-6">Choose Your Fleet Insurance Plan</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {insurancePlans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <Card key={plan.id} className="ov-card ov-card--hover relative overflow-hidden" style={plan.popular ? { background: '#0D0D11', borderColor: '#0D0D11' } : { background: '#FFFFFF' }}>
                      {plan.popular && (
                        <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide" style={{ background: '#0E32E8', color: '#fff' }}>
                          Popular
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={plan.popular ? { background: 'rgba(255,255,255,0.08)' } : { background: 'rgba(14,50,232,0.08)' }}>
                          <Icon className="w-7 h-7" style={{ color: plan.popular ? '#fff' : '#0E32E8' }} />
                        </div>
                        <CardTitle className="ov-display text-xl" style={{ color: plan.popular ? '#fff' : '#14161A' }}>{plan.title}</CardTitle>
                        <p className="text-sm" style={{ color: plan.popular ? '#A9A29A' : '#5B6470' }}>{plan.subtitle}</p>
                        <div className="mt-4">
                          <div className="ov-num text-3xl" style={{ color: plan.popular ? '#fff' : '#14161A' }}>{plan.price}</div>
                          <div className="text-xs uppercase tracking-wide mt-1" style={{ color: plan.popular ? '#A9A29A' : '#8B857C' }}>{plan.period}</div>
                          <div className="text-sm font-medium mt-2 ov-num" style={{ color: plan.popular ? '#6E8BFF' : '#0E32E8' }}>Coverage: {plan.coverage}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.popular ? '#6E8BFF' : '#0E32E8' }} />
                              <span className="text-sm" style={{ color: plan.popular ? '#D8D6D2' : '#5B6470' }}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          onClick={() => handleGetQuote(plan.id)}
                          className={`ov-btn w-full mt-6 ${plan.popular ? 'ov-btn-light' : 'ov-btn-outline'}`}
                        >
                          Get Custom Quote
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Fleet Insurance Benefits */}
            <Card className="ov-card" style={{ background: '#FFFFFF' }}>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="ov-display text-2xl mb-4">Why Choose Overland Fleet Insurance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(14,50,232,0.08)' }}>
                        <Users className="w-6 h-6" style={{ color: '#0E32E8' }} />
                      </div>
                      <h4 className="font-semibold mb-2" style={{ color: '#14161A' }}>Fleet Discounts</h4>
                      <p className="text-sm" style={{ color: '#5B6470' }}>Up to <span className="ov-num">30%</span> discount on bulk fleet policies</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(14,50,232,0.08)' }}>
                        <Zap className="w-6 h-6" style={{ color: '#0E32E8' }} />
                      </div>
                      <h4 className="font-semibold mb-2" style={{ color: '#14161A' }}>Quick Claims</h4>
                      <p className="text-sm" style={{ color: '#5B6470' }}>Average claim settlement in 3-5 days</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(14,50,232,0.08)' }}>
                        <Clock className="w-6 h-6" style={{ color: '#0E32E8' }} />
                      </div>
                      <h4 className="font-semibold mb-2" style={{ color: '#14161A' }}>24/7 Support</h4>
                      <p className="text-sm" style={{ color: '#5B6470' }}>Round-the-clock assistance for your fleet</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'claims' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="ov-display text-2xl">Claims Management</h2>
              <Button className="ov-btn ov-btn-ink">
                <FileText className="w-4 h-4 mr-2" />
                File New Claim
              </Button>
            </div>

            <Card className="ov-card" style={{ background: '#FFFFFF' }}>
              <CardHeader>
                <CardTitle className="ov-display text-lg">Recent Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Claim ID</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Vehicle</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Type</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Amount</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClaims.map((claim, index) => (
                        <tr key={index} className="ov-mkt-row">
                          <td className="py-3 px-4 ov-num font-medium" style={{ color: '#14161A' }}>{claim.claimId}</td>
                          <td className="py-3 px-4 ov-num" style={{ color: '#3E3F46' }}>{claim.vehicle}</td>
                          <td className="py-3 px-4" style={{ color: '#3E3F46' }}>{claim.type}</td>
                          <td className="py-3 px-4 ov-num" style={{ color: '#14161A' }}>{claim.amount}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(claim.status)} style={getStatusStyle(claim.status)}>
                              {claim.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 ov-num" style={{ color: '#5B6470' }}>{claim.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="ov-display text-2xl mb-6">Fleet Insurance Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="ov-card" style={{ background: '#FFFFFF' }}>
                <CardHeader>
                  <CardTitle className="ov-display text-lg">Premium Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center" style={{ color: '#8B857C' }}>
                    Premium analytics chart would go here
                  </div>
                </CardContent>
              </Card>
              <Card className="ov-card" style={{ background: '#FFFFFF' }}>
                <CardHeader>
                  <CardTitle className="ov-display text-lg">Claims Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center" style={{ color: '#8B857C' }}>
                    Claims analysis chart would go here
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="ov-card" style={{ background: '#FFFFFF' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(14,50,232,0.08)' }}>
                  <Calculator className="w-6 h-6" style={{ color: '#0E32E8' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#14161A' }}>Premium Calculator</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Calculate insurance premium for your fleet</p>
                </div>
                <Button className="ov-btn ov-btn-outline">
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="ov-card" style={{ background: '#FFFFFF' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(14,50,232,0.08)' }}>
                  <Phone className="w-6 h-6" style={{ color: '#0E32E8' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: '#14161A' }}>Expert Consultation</h3>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Speak with our insurance specialists</p>
                </div>
                <Button className="ov-btn ov-btn-outline">
                  Book Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Form Modal */}
        {showQuoteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="ov-card w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#FFFFFF' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="ov-display text-xl">Get Custom Fleet Quote</CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowQuoteForm(false)}
                    style={{ color: '#5B6470' }}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fleetSize">Fleet Size *</Label>
                    <Input id="fleetSize" placeholder="Number of vehicles" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="vehicleType">Primary Vehicle Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Commercial Trucks</SelectItem>
                        <SelectItem value="mini-truck">Mini Trucks</SelectItem>
                        <SelectItem value="tempo">Cargo Van/LCV</SelectItem>
                        <SelectItem value="trailer">Trailers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="avgValue">Average Vehicle Value *</Label>
                    <Input id="avgValue" placeholder="$ Average value per vehicle" />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years in Business *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="routes">Primary Routes/Regions *</Label>
                  <Textarea 
                    id="routes" 
                    placeholder="List your main operating routes or regions..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Additional Requirements</Label>
                  <Textarea 
                    id="additionalInfo" 
                    placeholder="Any specific coverage needs or requirements..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4" style={{ borderTop: '1px solid #ECE8E1' }}>
                  <Button variant="outline" className="ov-btn ov-btn-outline" onClick={() => setShowQuoteForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitQuote} className="ov-btn ov-btn-ink">
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FleetInsurancePage;
