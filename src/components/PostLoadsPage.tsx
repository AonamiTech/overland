
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import LoadFormStepper from './post-loads/LoadFormStepper';
import LoadDetailsStep from './post-loads/LoadDetailsStep';
import LocationStep from './post-loads/LocationStep';
import CargoInfoStep from './post-loads/CargoInfoStep';
import VehicleRequirementsStep from './post-loads/VehicleRequirementsStep';
import ContactBudgetStep from './post-loads/ContactBudgetStep';
import AdvancedSettingsStep from './post-loads/AdvancedSettingsStep';
import FormActions from './post-loads/FormActions';
import { usePostLoadForm } from '../hooks/usePostLoadForm';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, CheckCircle } from "lucide-react";

const PostLoadsPage = () => {
  const { 
    formData, 
    errors, 
    isSubmitting, 
    currentStep, 
    setCurrentStep, 
    handleSubmit, 
    updateFormData, 
    saveAsDraft, 
    saveAsTemplate 
  } = usePostLoadForm();
  
  const steps = [
    { id: 1, title: 'Load Details', component: LoadDetailsStep },
    { id: 2, title: 'Pickup & Delivery', component: LocationStep },
    { id: 3, title: 'Cargo Info', component: CargoInfoStep },
    { id: 4, title: 'Vehicle Requirements', component: VehicleRequirementsStep },
    { id: 5, title: 'Contact & Budget', component: ContactBudgetStep },
    { id: 6, title: 'Advanced', component: AdvancedSettingsStep, optional: true }
  ];

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component;

  return (
    <DashboardLayout
      userRole="broker"
      userName="Mike Johnson"
      userId="BR123456"
      isVerified={false}
      verificationStatus="not-started"
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#5B6470] font-medium">
          <span className="cursor-pointer hover:text-[#0E32E8] transition-colors">Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-2 text-[#A9A29A]" />
          <span className="text-[#14161A]">Post New Load</span>
        </div>

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <span className="ov-eyebrow"><span className="dot" />NEW LOAD</span>
              <h1 className="ov-display text-4xl">Post a new load</h1>
              <p className="text-[#3E3F46] text-lg">Create a new load posting to receive competitive bids from verified transporters</p>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center space-x-2 px-3 py-2 border-[#E7E3DC] text-[#5B6470] bg-white">
                <Clock className="w-4 h-4 text-[#0F7A4A]" />
                <span className="text-sm">Auto-saved 30s ago</span>
              </Badge>
              {formData.loadId && (
                <Badge className="bg-[rgba(15,122,74,0.08)] text-[#0F7A4A] border-[rgba(15,122,74,0.2)] px-3 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="ov-num">ID: {formData.loadId}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="ov-card p-6">
            <LoadFormStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              errors={errors}
            />
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="ov-card overflow-hidden">
          <div className="p-8">
            {CurrentStepComponent && (
              <CurrentStepComponent
                formData={formData}
                errors={errors}
                onUpdate={updateFormData}
                onNext={() => setCurrentStep(Math.min(currentStep + 1, steps.length))}
                onPrev={() => setCurrentStep(Math.max(currentStep - 1, 1))}
              />
            )}
          </div>

          {/* Form Actions */}
          <FormActions
            currentStep={currentStep}
            totalSteps={steps.length}
            isSubmitting={isSubmitting}
            onNext={() => setCurrentStep(Math.min(currentStep + 1, steps.length))}
            onPrev={() => setCurrentStep(Math.max(currentStep - 1, 1))}
            onSaveAsDraft={saveAsDraft}
            onSaveAsTemplate={saveAsTemplate}
            onSubmit={handleSubmit}
          />
        </Card>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expected Timeline */}
          <Card className="ov-card">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(14,50,232,0.08)]">
                  <Clock className="w-6 h-6 text-[#0E32E8]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#14161A] text-lg">Expected Timeline</h3>
                  <p className="text-[#3E3F46]">You'll start receiving competitive bids within ~12 minutes of posting</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Support Card */}
          <Card className="ov-card">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(15,122,74,0.08)]">
                  <CheckCircle className="w-6 h-6 text-[#0F7A4A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#14161A] text-lg">Quality Assurance</h3>
                  <p className="text-[#3E3F46]">All transporters are verified and GPS-tracked for your peace of mind</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostLoadsPage;
