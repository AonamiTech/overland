
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { X, Building2, FileText, Phone, CreditCard, CheckCircle } from 'lucide-react';
import BasicDetailsStep from './steps/corporate/BasicDetailsStep';
import DocumentUploadStep from './steps/corporate/DocumentUploadStep';
import VerificationCallStep from './steps/corporate/VerificationCallStep';
import BankVerificationStep from './steps/corporate/BankVerificationStep';
import FinalReviewStep from './steps/corporate/FinalReviewStep';

interface CorporateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

const CorporateVerificationModal = ({ isOpen, onClose, onVerificationComplete }: CorporateVerificationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    basicDetails: {
      companyName: 'TechCorp Solutions LLC',
      gstin: '12-3456789',
      primaryContact: '(555) 012-3456',
      branchLocation: 'Los Angeles, California',
      authorizedPerson: 'Robert Miller',
      designation: 'Managing Director'
    },
    documents: {
      gstCertificate: null,
      panCard: null,
      cin: null,
      bankDetails: null,
      creditScore: null
    },
    callDetails: {
      scheduledDate: null,
      scheduledTime: null,
      contactPerson: '',
      alternateContact: ''
    },
    bankVerification: {
      accountNumber: '',
      ifsc: '',
      accountHolderName: '',
      verificationMethod: 'penny-drop'
    }
  });

  const steps = [
    { number: 1, title: 'Basic Details', icon: Building2 },
    { number: 2, title: 'Documents', icon: FileText },
    { number: 3, title: 'Verification Call', icon: Phone },
    { number: 4, title: 'Bank Verification', icon: CreditCard },
    { number: 5, title: 'Final Review', icon: CheckCircle }
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleStepComplete = (stepNumber: number, data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => [...prev, stepNumber]);
    if (stepNumber < steps.length) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsStep
            data={formData.basicDetails}
            onNext={(data) => handleStepComplete(1, { basicDetails: data })}
          />
        );
      case 2:
        return (
          <DocumentUploadStep
            data={formData.documents}
            onNext={(data) => handleStepComplete(2, { documents: data })}
            onBack={handleGoBack}
          />
        );
      case 3:
        return (
          <VerificationCallStep
            data={formData.callDetails}
            onNext={(data) => handleStepComplete(3, { callDetails: data })}
            onBack={handleGoBack}
          />
        );
      case 4:
        return (
          <BankVerificationStep
            data={formData.bankVerification}
            onNext={(data) => handleStepComplete(4, { bankVerification: data })}
            onBack={handleGoBack}
          />
        );
      case 5:
        return (
          <FinalReviewStep
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
                <h1 className="ov-display text-2xl">Let's get you verified</h1>
                <p className="text-[#5B6470] mt-1">Complete your corporate verification in 3–5 days for full platform access</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-[#5B6470]">
                <X className="w-5 h-5" strokeWidth={1.8} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#3E3F46]">Step <span className="ov-num">{currentStep}</span> of <span className="ov-num">{steps.length}</span></span>
                <span className="text-sm text-[#8B857C] ov-num">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />

              {/* Step Indicators */}
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(step.number);
                  const isCurrent = currentStep === step.number;

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

export default CorporateVerificationModal;
