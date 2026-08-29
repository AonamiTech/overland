
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon, CheckCircleIcon, PhoneIcon, InfoIcon } from './InsuranceIcons';

const WhyChoosePanel: React.FC = () => {
  return (
    <div className="sticky top-24">
      <Card className="ov-card" style={{ background: '#FFFFFF' }}>
        <CardHeader>
          <span className="ov-eyebrow"><span className="dot" />Why Overland</span>
          <CardTitle className="ov-display text-xl mt-2 text-[#14161A]">Coverage you can trust</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-3 animate-fade-in">
              <span className="ov-tick" style={{ width: 32, height: 32 }}>
                <ShieldIcon className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-medium text-[#14161A]">Comprehensive Coverage</h4>
                <p className="text-sm text-[#5B6470]">Protection against theft, damage, and delays</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="ov-tick" style={{ width: 32, height: 32 }}>
                <CheckCircleIcon className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-medium text-[#14161A]">Quick Claims</h4>
                <p className="text-sm text-[#5B6470]">Average claim settlement in 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="ov-tick" style={{ width: 32, height: 32 }}>
                <PhoneIcon className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-medium text-[#14161A]">24/7 Support</h4>
                <p className="text-sm text-[#5B6470]">Round-the-clock assistance when you need it</p>
              </div>
            </div>

            <div className="p-4 rounded-[14px] mt-6" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
              <div className="flex items-center space-x-2 mb-3">
                <InfoIcon className="w-4 h-4 text-[#0E32E8]" />
                <span className="ov-eyebrow ov-eyebrow--muted" style={{ letterSpacing: '0.14em' }}>Quick Stats</span>
              </div>
              <div className="space-y-2 text-sm text-[#3E3F46]">
                <p><span className="ov-num text-[#14161A]">98%</span> claim approval rate</p>
                <p><span className="ov-num text-[#14161A]">$600M+</span> claims processed</p>
                <p><span className="ov-num text-[#14161A]">50,000+</span> satisfied customers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhyChoosePanel;
