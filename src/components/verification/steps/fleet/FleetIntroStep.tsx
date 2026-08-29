
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, TrendingUp, BarChart3, MapPin, CheckCircle } from 'lucide-react';

interface FleetIntroStepProps {
  data: {
    acknowledged: boolean;
  };
  onNext: (data: any) => void;
}

const FleetIntroStep = ({ data, onNext }: FleetIntroStepProps) => {
  const handleNext = () => {
    onNext({ acknowledged: true });
  };

  const benefits = [
    {
      icon: Building2,
      title: 'Corporate Bidding Access',
      description: '$120K+/month opportunities'
    },
    {
      icon: Star,
      title: 'Verified Badge',
      description: 'Stand out in truck listings'
    },
    {
      icon: TrendingUp,
      title: 'Priority Load Allocation',
      description: 'Get loads before others'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track performance & earnings'
    },
    {
      icon: MapPin,
      title: 'GPS-Based Matching',
      description: 'Real-time load suggestions'
    }
  ];

  const steps = [
    'CDL Verification',
    'EIN Verification',
    'Bank Account',
    'Live Selfie',
    'Vehicle Documents',
    'Final Review'
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Fleet KYC</div>
          <h2 className="ov-display text-4xl mb-4">Get Your Fleet Verified</h2>
          <p className="text-xl text-[#5B6470] mb-4">Unlock corporate bidding, get premium loads, and boost your earnings</p>
          <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20 px-4 py-2 text-sm font-medium">
            Verification takes 48 hours
          </Badge>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="ov-card ov-card--hover p-6">
                <div className="w-12 h-12 rounded-xl bg-[#0E32E8]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#0E32E8]" strokeWidth={1.8} />
                </div>
                <h3 className="font-semibold text-[#14161A] mb-2">{benefit.title}</h3>
                <p className="text-[#5B6470] text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Process Overview */}
        <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-[18px] p-6 mb-8">
          <h3 className="ov-display text-lg mb-4">Verification Process (6 Steps)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-[#111217] text-white rounded-full flex items-center justify-center text-xs font-medium ov-num">{i + 1}</div>
                <span className="text-[#3E3F46]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button onClick={handleNext} className="ov-btn ov-btn-ink px-12 py-4 text-lg">
            Begin Verification
          </Button>
          <p className="text-sm text-[#8B857C] mt-4">
            You can continue using the platform with limited features while verification is pending
          </p>
        </div>
      </div>
    </div>
  );
};

export default FleetIntroStep;
