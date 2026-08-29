
import React from 'react';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  optional?: boolean;
}

interface LoadFormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  errors: Record<string, string>;
}

const LoadFormStepper = ({ steps, currentStep, onStepClick, errors }: LoadFormStepperProps) => {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const hasStepErrors = (stepId: number) => {
    // Check if any errors belong to this step
    const stepErrorKeys = {
      1: ['loadId', 'loadType'],
      2: ['pickupLocation', 'deliveryLocation', 'pickupDate', 'deliveryDate'],
      3: ['cargoDescription', 'weight', 'cargoValue'],
      4: ['truckType'],
      5: ['contactName', 'contactPhone', 'budgetMin', 'budgetMax'],
      6: []
    };
    
    return stepErrorKeys[stepId as keyof typeof stepErrorKeys]?.some(key => errors[key]);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const hasErrors = hasStepErrors(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  status === 'current'
                    ? 'bg-[rgba(14,50,232,0.06)] border border-[#0E32E8]'
                    : status === 'completed'
                    ? 'bg-white border border-[#E7E3DC] hover:bg-[#FBFAF8]'
                    : 'bg-white border border-[#E7E3DC] hover:bg-[#FBFAF8]'
                }`}
                onClick={() => onStepClick(step.id)}
              >
                <div className="flex-shrink-0">
                  {hasErrors ? (
                    <AlertCircle className="w-5 h-5 text-[#A8412F]" />
                  ) : status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-[#0F7A4A]" />
                  ) : status === 'current' ? (
                    <div className="w-5 h-5 bg-[#0E32E8] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold ov-num">{step.id}</span>
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-[#A9A29A]" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className={`text-sm font-medium ${
                    status === 'current'
                      ? 'text-[#0E32E8]'
                      : status === 'completed'
                      ? 'text-[#14161A]'
                      : 'text-[#5B6470]'
                  }`}>
                    {step.title}
                    {step.optional && (
                      <span className="text-xs text-[#A9A29A] ml-1">(Optional)</span>
                    )}
                  </p>
                  {hasErrors && (
                    <p className="text-xs text-[#A8412F]">Has errors</p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-[#E7E3DC]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LoadFormStepper;
