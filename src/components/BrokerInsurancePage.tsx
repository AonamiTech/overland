
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

const BrokerInsurancePage = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const insurancePlans = [
    {
      id: 'basic',
      title: 'Broker Basic',
      subtitle: 'Essential Coverage',
      price: '$1,200',
      period: 'per year',
      coverage: 'Up to $100K',
      icon: Shield,
      color: 'blue',
      features: [
        'Professional liability coverage',
        'Client transaction protection',
        'Basic legal support',
        'Online claim filing',
        'Email support'
      ]
    },
    {
      id: 'premium',
      title: 'Broker Premium',
      subtitle: 'Complete Protection',
      price: '$3,000',
      period: 'per year',
      coverage: 'Up to $500K',
      icon: Star,
      color: 'red',
      popular: true,
      features: [
        'All Basic features',
        'Errors & omissions coverage',
        'Cyber liability protection',
        '24/7 legal helpline',
        'Dedicated broker support',
        'Priority claims processing'
      ]
    },
    {
      id: 'enterprise',
      title: 'Broker Enterprise',
      subtitle: 'Maximum Security',
      price: '$7,500',
      period: 'per year',
      coverage: 'Up to $2M',
      icon: Users,
      color: 'purple',
      features: [
        'All Premium features',
        'Business interruption coverage',
        'International transaction protection',
        'Compliance assistance',
        'Custom policy terms',
        'On-site risk assessment'
      ]
    }
  ];

  const brokerMetrics = [
    {
      title: 'Active Policies',
      value: '5',
      subtitle: 'Professional coverage',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Claims Filed',
      value: '0',
      subtitle: 'This year',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Coverage Value',
      value: '$500K',
      subtitle: 'Total protection',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Risk Score',
      value: 'Low',
      subtitle: 'Excellent rating',
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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

  return (
    <DashboardLayout 
      userRole="broker" 
      userName="Broker" 
      userId="BR123456" 
      isVerified={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="ov-eyebrow"><span className="dot" />Broker Insurance</span>
            <h1 className="ov-display text-4xl mt-2 mb-2">Broker Insurance Hub</h1>
            <p className="text-lg" style={{ color: '#5B6470' }}>Professional liability and business protection insurance</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#0F7A4A' }}></div>
            <span className="text-sm font-medium" style={{ color: '#0F7A4A' }}>Protected</span>
          </div>
        </div>

        {/* Broker Insurance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brokerMetrics.map((metric, index) => {
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

        {/* Insurance Plans */}
        <div>
          <h2 className="ov-display text-2xl mb-6">Choose Your Broker Insurance Plan</h2>
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
                      Get Quote
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="ov-card" style={{ background: '#FFFFFF' }}>
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="ov-display text-2xl mb-4">Why Brokers Choose Overland</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(14,50,232,0.08)' }}>
                    <Shield className="w-6 h-6" style={{ color: '#0E32E8' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: '#14161A' }}>Professional Coverage</h4>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Comprehensive liability protection for brokers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(14,50,232,0.08)' }}>
                    <Zap className="w-6 h-6" style={{ color: '#0E32E8' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: '#14161A' }}>Quick Processing</h4>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Fast approval and claim settlement</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(14,50,232,0.08)' }}>
                    <Phone className="w-6 h-6" style={{ color: '#0E32E8' }} />
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: '#14161A' }}>Expert Support</h4>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Dedicated broker insurance specialists</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Form Modal */}
        {showQuoteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="ov-card w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#FFFFFF' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="ov-display text-xl">Get Broker Insurance Quote</CardTitle>
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
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Broker</SelectItem>
                        <SelectItem value="firm">Brokerage Firm</SelectItem>
                        <SelectItem value="agency">Carrier Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualRevenue">Annual Revenue *</Label>
                    <Input id="annualRevenue" placeholder="$ Annual business revenue" />
                  </div>
                  <div>
                    <Label htmlFor="clientBase">Client Base Size *</Label>
                    <Input id="clientBase" placeholder="Number of regular clients" type="number" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="services">Services Offered *</Label>
                  <Textarea 
                    id="services" 
                    placeholder="Describe your brokerage services..."
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

export default BrokerInsurancePage;
