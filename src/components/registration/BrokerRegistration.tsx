
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BrokerRegistrationProps {
  onSuccess: () => void;
}

const BrokerRegistration = ({ onSuccess }: BrokerRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    businessName: '',
    gstNumber: '',
    city: '',
    routes: [] as string[],
    vehicleTypes: [] as string[],
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const vehicleOptions = [
    'Dry Van', 'Reefer', 'Flatbed', 'Step Deck', 'Box Truck', 'Tanker'
  ];

  const routeOptions = [
    'Los Angeles-Dallas', 'Dallas-Newark', 'Atlanta-Chicago', 'Phoenix-Los Angeles', 'Houston-Atlanta'
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

  const toggleSelection = (array: string[], item: string, field: 'routes' | 'vehicleTypes') => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    setFormData({ ...formData, [field]: newArray });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.mobile.length === 10;
      case 2:
        return formData.businessName && formData.city;
      case 3:
        return formData.routes.length > 0;
      case 4:
        return formData.vehicleTypes.length > 0;
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
          <h3 className="ov-display text-lg">Business Details</h3>
          <Input
            placeholder="Business Name"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
          <Input
            placeholder="EIN / Sales Tax ID (Optional)"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            className="ov-num"
          />
          <Input
            placeholder="City/Location"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Routes of Operation</h3>
          <p className="text-sm text-[#5B6470]">Select routes you typically operate on</p>
          <div className="space-y-2">
            {routeOptions.map((route) => (
              <button
                key={route}
                onClick={() => toggleSelection(formData.routes, route, 'routes')}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  formData.routes.includes(route)
                    ? 'border-[#0E32E8] bg-[rgba(14,50,232,0.06)] text-[#0E32E8]'
                    : 'border-[#E7E3DC] text-[#3E3F46] hover:border-[#C9C3B8]'
                }`}
              >
                {route}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.routes.map((route) => (
              <Badge key={route} variant="secondary" className="bg-[rgba(14,50,232,0.10)] text-[#0E32E8]">
                {route}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="ov-display text-lg">Vehicle Types</h3>
          <p className="text-sm text-[#5B6470]">What vehicle types are you interested in?</p>
          <div className="grid grid-cols-2 gap-2">
            {vehicleOptions.map((vehicle) => (
              <button
                key={vehicle}
                onClick={() => toggleSelection(formData.vehicleTypes, vehicle, 'vehicleTypes')}
                className={`p-3 text-sm border rounded-lg transition-colors ${
                  formData.vehicleTypes.includes(vehicle)
                    ? 'border-[#0E32E8] bg-[rgba(14,50,232,0.06)] text-[#0E32E8]'
                    : 'border-[#E7E3DC] text-[#3E3F46] hover:border-[#C9C3B8]'
                }`}
              >
                {vehicle}
              </button>
            ))}
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

export default BrokerRegistration;
