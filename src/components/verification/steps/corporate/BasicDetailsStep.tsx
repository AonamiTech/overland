
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, User, MapPin, Phone, CheckCircle, ArrowRight } from 'lucide-react';

interface BasicDetailsStepProps {
  data: {
    companyName: string;
    gstin: string;
    primaryContact: string;
    branchLocation: string;
    authorizedPerson: string;
    designation: string;
  };
  onNext: (data: any) => void;
}

const BasicDetailsStep = ({ data, onNext }: BasicDetailsStepProps) => {
  const [formData, setFormData] = useState(data);
  const [isVerified, setIsVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerifyGST = () => {
    // Simulate EIN verification
    setTimeout(() => {
      setIsVerified(true);
    }, 1500);
  };

  const handleNext = () => {
    onNext(formData);
  };

  const inputClass = "mt-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]";

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Corporate KYC</div>
          <h2 className="ov-display text-3xl mb-2">Confirm Basic Details</h2>
          <p className="text-[#5B6470]">Verify and update your company information</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Company Details */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-[#5B6470]">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="gstin" className="text-[#5B6470]">EIN</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    className="flex-1 ov-num bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                  />
                  <Button
                    size="sm"
                    onClick={handleVerifyGST}
                    disabled={isVerified}
                    className="ov-btn ov-btn-outline"
                  >
                    {isVerified ? <CheckCircle className="w-4 h-4 text-[#0F7A4A]" strokeWidth={1.8} /> : 'Verify'}
                  </Button>
                </div>
                {isVerified && (
                  <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20 mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />
                    EIN Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryContact" className="text-[#5B6470]">Primary Contact</Label>
                <Input
                  id="primaryContact"
                  value={formData.primaryContact}
                  onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                  className={`${inputClass} ov-num`}
                />
              </div>
              <div>
                <Label htmlFor="branchLocation" className="text-[#5B6470]">Branch Location</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-[#8B857C]" strokeWidth={1.8} />
                  <Input
                    id="branchLocation"
                    value={formData.branchLocation}
                    onChange={(e) => handleInputChange('branchLocation', e.target.value)}
                    className="flex-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Authorized Person */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
              Authorized Representative
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorizedPerson" className="text-[#5B6470]">Full Name</Label>
                <Input
                  id="authorizedPerson"
                  value={formData.authorizedPerson}
                  onChange={(e) => handleInputChange('authorizedPerson', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <Label htmlFor="designation" className="text-[#5B6470]">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-8">
          <Button onClick={handleNext} className="ov-btn ov-btn-ink">
            Confirm & Proceed
            <ArrowRight className="w-4 h-4 ml-2 arrow" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsStep;
