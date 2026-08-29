
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ArrowLeft, Shield, FileText, CreditCard, Camera, Truck } from 'lucide-react';

interface FleetReviewStepProps {
  data: any;
  onComplete: () => void;
  onBack: () => void;
}

const FleetReviewStep = ({ data, onComplete, onBack }: FleetReviewStepProps) => {
  const handleSubmit = () => {
    // Simulate submission
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const verificationSteps = [
    {
      title: 'CDL Verification',
      icon: Shield,
      status: data.aadhaar?.verified ? 'completed' : 'pending',
      details: data.aadhaar?.name || 'Not verified',
      mono: false
    },
    {
      title: 'EIN Verification',
      icon: FileText,
      status: data.pan?.verified ? 'completed' : 'pending',
      details: data.pan?.number || 'Not verified',
      mono: true
    },
    {
      title: 'Bank Verification',
      icon: CreditCard,
      status: data.bank?.verified ? 'completed' : 'pending',
      details: data.bank?.accountNumber ? `****${data.bank.accountNumber.slice(-4)}` : 'Not verified',
      mono: true
    },
    {
      title: 'Selfie Verification',
      icon: Camera,
      status: data.selfie?.verified ? 'completed' : 'pending',
      details: data.selfie?.verified ? 'Liveness verified' : 'Not verified',
      mono: false
    },
    {
      title: 'Vehicle Documents',
      icon: Truck,
      status: data.vehicle?.verified ? 'completed' : 'pending',
      details: data.vehicle?.truckNumber || 'Not verified',
      mono: true
    }
  ];

  const allCompleted = verificationSteps.every(step => step.status === 'completed');

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Fleet KYC</div>
          <h2 className="ov-display text-3xl mb-2">Final Summary & Submission</h2>
          <p className="text-[#5B6470]">You're almost done. Review your details and submit for verification</p>
        </div>

        {/* Verification Summary */}
        <div className="space-y-4 mb-8">
          <h3 className="ov-display text-lg">Verification Summary</h3>

          {verificationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 ov-card">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-[#0F7A4A]/10' : 'bg-[#F1EEE8]'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      step.status === 'completed' ? 'text-[#0F7A4A]' : 'text-[#8B857C]'
                    }`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#14161A]">{step.title}</h4>
                    <p className={`text-sm text-[#5B6470] ${step.mono ? 'ov-num' : ''}`}>{step.details}</p>
                  </div>
                </div>
                <div>
                  {step.status === 'completed' ? (
                    <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
                      <CheckCircle className="w-4 h-4 mr-1" strokeWidth={1.8} />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-[#F1EEE8] text-[#5B6470] border border-[#E7E3DC]">Pending</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Processing Information */}
        <div className="bg-[#0E32E8]/5 border border-[#0E32E8]/15 rounded-[18px] p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-[#0E32E8]" strokeWidth={1.8} />
            <h3 className="ov-display text-lg">What happens next?</h3>
          </div>
          <div className="space-y-2 text-sm text-[#3E3F46]">
            <p>• Our team will review your documents within 48 hours</p>
            <p>• You'll receive SMS & email notifications on status updates</p>
            <p>• You can continue using the platform with limited features</p>
            <p>• Once verified, you'll get access to corporate bidding and premium features</p>
          </div>
        </div>

        {/* Platform Access Note */}
        <div className="bg-[#FBFAF8] rounded-lg p-4 border-l-4 border-[#0E32E8] mb-8">
          <p className="text-sm text-[#3E3F46]">
            <strong>Note:</strong> You can continue using the platform with limited features while verification is pending.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button onClick={onBack} className="ov-btn ov-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allCompleted}
            className="ov-btn ov-btn-ink"
          >
            Submit for Verification
          </Button>
        </div>

        {!allCompleted && (
          <p className="text-center text-sm text-[#DC2626] mt-4">
            Please complete all verification steps before submitting
          </p>
        )}
      </div>
    </div>
  );
};

export default FleetReviewStep;
