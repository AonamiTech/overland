
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldCheck, ShieldX, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const VerificationBanner = ({ isVerified, onVerificationComplete }) => {
  const [verificationStatus, setVerificationStatus] = useState('not-started'); // not-started, in-progress, completed
  const [completedSteps, setCompletedSteps] = useState(2);
  const totalSteps = 5;

  const verificationSteps = [
    { id: 1, title: 'Basic Information', completed: true, icon: CheckCircle },
    { id: 2, title: 'Document Upload', completed: true, icon: CheckCircle },
    { id: 3, title: 'Vehicle Registration', completed: false, icon: Clock },
    { id: 4, title: 'Insurance Verification', completed: false, icon: Clock },
    { id: 5, title: 'Background Check', completed: false, icon: Clock }
  ];

  if (isVerified) {
    return (
      <Card className="ov-card p-4">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(15,122,74,0.10)' }}>
                <ShieldCheck className="w-6 h-6 text-[#0F7A4A]" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="ov-display text-[#14161A]">Verified Fleet Owner</h3>
                <p className="text-[#5B6470] text-sm">
                  Access to premium RFQs and corporate contracts unlocked
                </p>
              </div>
            </div>
            <Badge className="bg-[#0F7A4A] text-white">
              <Shield className="w-3 h-3 mr-1" strokeWidth={1.8} />
              <span className="ov-num uppercase tracking-[0.1em]">Verified</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === 'in-progress') {
    return (
      <Card className="ov-card p-4">
        <CardContent className="p-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(180,83,9,0.10)' }}>
                  <Clock className="w-6 h-6 text-[#B45309]" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="ov-display text-[#14161A]">Verification In Progress</h3>
                  <p className="text-[#5B6470] text-sm">
                    Complete all steps to unlock premium bidding
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="ov-num text-[#B45309] border-[#B45309]/40">
                {completedSteps}/{totalSteps} Steps
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5B6470]">Progress</span>
                <span className="ov-num text-[#14161A]">{Math.round((completedSteps / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(completedSteps / totalSteps) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {verificationSteps.map((step) => (
                <div key={step.id} className="flex items-center space-x-2 text-xs">
                  <step.icon className={`w-4 h-4 ${
                    step.completed ? 'text-[#0F7A4A]' : 'text-[#A9A29A]'
                  }`} strokeWidth={1.8} />
                  <span className={step.completed ? 'text-[#0F7A4A]' : 'text-[#5B6470]'}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="ov-btn ov-btn-outline">
                Continue Verification
              </Button>
              <Button size="sm" className="ov-btn ov-btn-ghost">
                View Requirements
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ov-card p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(168,65,47,0.10)' }}>
              <ShieldX className="w-6 h-6 text-[#A8412F]" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="ov-display text-[#14161A]">Verification Required</h3>
              <p className="text-[#5B6470] text-sm">
                Complete verification to bid on premium corporate RFQs
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => setVerificationStatus('in-progress')}
              className="ov-btn ov-btn-ink"
            >
              <Shield className="w-4 h-4 mr-2" strokeWidth={1.8} />
              Start Verification
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#A8412F]" strokeWidth={1.8} />
            <span className="text-[#5B6470]">Limited to 3 RFQs/day</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#A8412F]" strokeWidth={1.8} />
            <span className="text-[#5B6470]">No premium RFQ access</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#A8412F]" strokeWidth={1.8} />
            <span className="text-[#5B6470]">Basic support only</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationBanner;
