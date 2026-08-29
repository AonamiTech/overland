
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CorporateRegistrationProps {
  onSuccess: () => void;
}

const CorporateRegistration = ({ onSuccess }: CorporateRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    gstNumber: '',
    freightVolume: '',
    contactRole: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    emailVerified: false
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

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

  const sendVerificationEmail = () => {
    // Simulate email verification
    setTimeout(() => {
      setFormData({ ...formData, emailVerified: true });
    }, 2000);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email.includes('@');
      case 2:
        return formData.companyName && formData.gstNumber;
      case 3:
        return formData.freightVolume && formData.contactRole;
      case 4:
        return formData.emailVerified;
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
          <h3 className="ov-display text-lg">Contact Information</h3>
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
          <Input
            type="email"
            placeholder="Official Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Company Details</h3>
          <Input
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
          <Input
            placeholder="EIN"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
            className="ov-num"
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Business Requirements</h3>
          <Select onValueChange={(value) => setFormData({ ...formData, freightVolume: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Monthly Freight Volume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 loads/month</SelectItem>
              <SelectItem value="11-50">11-50 loads/month</SelectItem>
              <SelectItem value="51-200">51-200 loads/month</SelectItem>
              <SelectItem value="200+">200+ loads/month</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setFormData({ ...formData, contactRole: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Your Role in Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="procurement-manager">Procurement Manager</SelectItem>
              <SelectItem value="logistics-head">Logistics Head</SelectItem>
              <SelectItem value="operations-manager">Operations Manager</SelectItem>
              <SelectItem value="ceo-founder">CEO/Founder</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Email Verification</h3>
          <p className="text-sm text-[#5B6470]">Verify your email to continue</p>
          <div className="p-4 bg-[#FBFAF8] border border-[#E7E3DC] rounded-lg">
            <p className="text-sm text-[#3E3F46]">We need to verify: <strong className="text-[#14161A]">{formData.email}</strong></p>
            {!formData.emailVerified ? (
              <Button
                onClick={sendVerificationEmail}
                className="mt-2 ov-btn ov-btn-ink"
                size="sm"
              >
                Send Verification Email
              </Button>
            ) : (
              <div className="mt-2 text-[#0F7A4A] text-sm font-medium">
                Email verified successfully
              </div>
            )}
          </div>
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

export default CorporateRegistration;
