
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface FleetOwnerRegistrationProps {
  onSuccess: () => void;
}

const FleetOwnerRegistration = ({ onSuccess }: FleetOwnerRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    fleetSize: '',
    truckTypes: [] as string[],
    documents: null as File | null,
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const truckOptions = [
    'Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Box Truck', 'Tanker'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSuccess();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleTruckType = (truck: string) => {
    const newTypes = formData.truckTypes.includes(truck)
      ? formData.truckTypes.filter(t => t !== truck)
      : [...formData.truckTypes, truck];
    setFormData({ ...formData, truckTypes: newTypes });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.mobile.length === 10;
      case 2:
        return formData.fleetSize;
      case 3:
        return formData.truckTypes.length > 0;
      case 4:
        return true; // Documents are optional
      case 5:
        return formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && formData.agreeToTerms;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[#5B6470]">
          <span>Step <span className="ov-num">{currentStep}</span> of <span className="ov-num">{totalSteps}</span></span>
          <span className="ov-num">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Personal Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div className="flex rounded-lg border border-[#E7E3DC] bg-[#FBFAF8]">
            <div className="flex items-center px-3 border-r border-[#E7E3DC]">
              <span className="text-sm ov-num text-[#5B6470]">+1</span>
            </div>
            <Input
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="border-0 bg-transparent focus-visible:ring-0 ov-num"
              maxLength={10}
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Fleet Information</h3>
          <Select onValueChange={(value) => setFormData({ ...formData, fleetSize: value })}>
            <SelectTrigger>
              <SelectValue placeholder="How many trucks do you own?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5 trucks</SelectItem>
              <SelectItem value="6-20">6-20 trucks</SelectItem>
              <SelectItem value="21-50">21-50 trucks</SelectItem>
              <SelectItem value="50+">50+ trucks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Truck Types</h3>
          <p className="text-sm text-[#5B6470]">Select the types of trucks in your fleet</p>
          <div className="grid grid-cols-2 gap-2">
            {truckOptions.map((truck) => (
              <button
                key={truck}
                onClick={() => toggleTruckType(truck)}
                className={`p-3 text-sm border rounded-lg transition-colors ${
                  formData.truckTypes.includes(truck)
                    ? 'border-[#0E32E8] bg-[rgba(14,50,232,0.06)] text-[#0E32E8]'
                    : 'border-[#E7E3DC] text-[#3E3F46] hover:border-[#C9C3B8]'
                }`}
              >
                {truck}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.truckTypes.map((truck) => (
              <Badge key={truck} variant="secondary" className="bg-[rgba(14,50,232,0.10)] text-[#0E32E8]">
                {truck}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Documents (Optional)</h3>
          <p className="text-sm text-[#5B6470]">Upload your USDOT Number or MC Number for faster verification</p>
          <div className="border-2 border-dashed border-[#E7E3DC] rounded-lg p-6 text-center">
            <span className="ov-tick w-10 h-10 mx-auto mb-2"><Upload className="w-5 h-5" strokeWidth={1.8} /></span>
            <p className="text-sm text-[#5B6470]">Click to upload or drag and drop</p>
            <p className="text-xs text-[#A9A29A]">PDF, JPG, PNG up to 10MB</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFormData({ ...formData, documents: e.target.files?.[0] || null })}
            />
          </div>
          {formData.documents && (
            <p className="text-sm text-[#0F7A4A]">{formData.documents.name} uploaded</p>
          )}
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Secure Your Account</h3>
          <Input
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-sm text-[#DC2626]">Passwords do not match</p>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the Terms & Conditions and Privacy Policy
            </Label>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack} className="ov-btn ov-btn-outline flex-1">
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className="ov-btn ov-btn-ink flex-1"
        >
          {currentStep === totalSteps ? 'Complete Registration' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default FleetOwnerRegistration;
