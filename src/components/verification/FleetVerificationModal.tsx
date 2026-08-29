
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, Shield, CreditCard, User, Truck, FileText, CheckCircle, Camera } from 'lucide-react';
import FleetIntroStep from './steps/fleet/FleetIntroStep';
import FleetAadhaarStep from './steps/fleet/FleetAadhaarStep';
import FleetPANStep from './steps/fleet/FleetPANStep';
import FleetBankStep from './steps/fleet/FleetBankStep';
import FleetSelfieStep from './steps/fleet/FleetSelfieStep';
import FleetVehicleStep from './steps/fleet/FleetVehicleStep';
import FleetReviewStep from './steps/fleet/FleetReviewStep';

interface FleetVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

const FleetVerificationModal = ({ isOpen, onClose, onVerificationComplete }: FleetVerificationModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    intro: { acknowledged: false },
    aadhaar: {
      number: '',
      name: '',
      dob: '',
      address: '',
      image: null,
      verified: false
    },
    pan: {
      number: '',
      name: '',
      dob: '',
      image: null,
      verified: false
    },
    bank: {
      accountNumber: '',
      ifsc: '',
      accountType: 'savings',
      accountHolderName: '',
      verified: false
    },
    selfie: {
      image: null,
      verified: false,
      liveness: false
    },
    vehicle: {
      truckNumber: '',
      rcImage: null,
      insuranceImage: null,
      fitnessImage: null,
      pucImage: null,
      verified: false
    }
  });

  const steps = [
    { number: 0, title: 'Introduction', icon: Shield },
    { number: 1, title: 'CDL', icon: Shield },
    { number: 2, title: 'EIN', icon: FileText },
    { number: 3, title: 'Bank', icon: CreditCard },
    { number: 4, title: 'Selfie', icon: Camera },
    { number: 5, title: 'Vehicle', icon: Truck },
    { number: 6, title: 'Review', icon: CheckCircle }
  ];

  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  const handleStepComplete = (stepNumber: number, data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => [...prev, stepNumber]);
    if (stepNumber < steps.length - 1) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FleetIntroStep
            data={formData.intro}
            onNext={(data) => handleStepComplete(0, { intro: data })}
          />
        );
      case 1:
        return (
          <FleetAadhaarStep
            data={formData.aadhaar}
            onNext={(data) => handleStepComplete(1, { aadhaar: data })}
            onBack={handleGoBack}
          />
        );
      case 2:
        return (
          <FleetPANStep
            data={formData.pan}
            onNext={(data) => handleStepComplete(2, { pan: data })}
            onBack={handleGoBack}
          />
        );
      case 3:
        return (
          <FleetBankStep
            data={formData.bank}
            onNext={(data) => handleStepComplete(3, { bank: data })}
            onBack={handleGoBack}
          />
        );
      case 4:
        return (
          <FleetSelfieStep
            data={formData.selfie}
            onNext={(data) => handleStepComplete(4, { selfie: data })}
            onBack={handleGoBack}
          />
        );
      case 5:
        return (
          <FleetVehicleStep
            data={formData.vehicle}
            onNext={(data) => handleStepComplete(5, { vehicle: data })}
            onBack={handleGoBack}
          />
        );
      case 6:
        return (
          <FleetReviewStep
            data={formData}
            onComplete={onVerificationComplete}
            onBack={handleGoBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 rounded-[20px] border border-[#E7E3DC]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-[#E7E3DC] p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="ov-display text-2xl">Get your fleet verified</h1>
                <p className="text-[#5B6470] mt-1">Unlock corporate bidding, premium loads, and boost your earnings</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-[#5B6470]">
                <X className="w-5 h-5" strokeWidth={1.8} />
              </Button>
            </div>

            {/* Progress Bar */}
            {currentStep > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#3E3F46]">Step <span className="ov-num">{currentStep}</span> of <span className="ov-num">{steps.length - 1}</span></span>
                  <span className="text-sm text-[#8B857C] ov-num">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />

                {/* Step Indicators */}
                <div className="flex items-center justify-between">
                  {steps.slice(1).map((step, index) => {
                    const stepNumber = index + 1;
                    const Icon = step.icon;
                    const isCompleted = completedSteps.includes(stepNumber);
                    const isCurrent = currentStep === stepNumber;

                    return (
                      <div key={step.number} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted
                            ? 'bg-[#0F7A4A] text-white'
                            : isCurrent
                              ? 'bg-[#0E32E8] text-white'
                              : 'bg-[#F1EEE8] text-[#A9A29A]'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" strokeWidth={1.8} />
                          ) : (
                            <Icon className="w-5 h-5" strokeWidth={1.8} />
                          )}
                        </div>
                        <span className={`text-xs font-medium ${
                          isCompleted || isCurrent ? 'text-[#14161A]' : 'text-[#8B857C]'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {renderStepContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FleetVerificationModal;
