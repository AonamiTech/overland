
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Camera, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface FleetPANStepProps {
  data: {
    number: string;
    name: string;
    dob: string;
    image: File | null;
    verified: boolean;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const FleetPANStep = ({ data, onNext, onBack }: FleetPANStepProps) => {
  const [formData, setFormData] = useState(data);
  const [isVerifying, setIsVerifying] = useState(false);
  const [nameMatch, setNameMatch] = useState<boolean | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));

      // Simulate OCR extraction
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          number: '12-3456789',
          name: 'ROBERT MILLER',
          dob: '08/15/1985'
        }));
        // Check name match with CDL
        setNameMatch(true);
      }, 1000);
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate IRS API verification
    setTimeout(() => {
      setFormData(prev => ({ ...prev, verified: true }));
      setIsVerifying(false);
    }, 2000);
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
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Fleet KYC</div>
          <h2 className="ov-display text-3xl mb-2">EIN Verification</h2>
          <p className="text-[#5B6470]">Validate your business identity via your EIN</p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4">Upload EIN Document</h3>
            <div className="border-2 border-dashed border-[#E7E3DC] rounded-lg p-8 text-center">
              {formData.image ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-[#0F7A4A] mx-auto" strokeWidth={1.8} />
                  <p className="text-sm text-[#3E3F46]">EIN document uploaded successfully</p>
                  <p className="text-xs text-[#8B857C]">{formData.image.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-[#0E32E8] mx-auto" strokeWidth={1.8} />
                  <div>
                    <p className="text-sm text-[#5B6470] mb-2">Upload your EIN document</p>
                    <p className="text-xs text-[#8B857C] mb-4">Ensure clear photo, no glare</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button className="ov-btn ov-btn-outline mr-2">
                        <Camera className="w-4 h-4 mr-2" strokeWidth={1.8} />
                        Take Photo
                      </Button>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button className="ov-btn ov-btn-outline">
                        <Upload className="w-4 h-4 mr-2" strokeWidth={1.8} />
                        Upload File
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Details */}
          {formData.image && (
            <div className="ov-card p-6">
              <h3 className="ov-display text-lg mb-4">Extracted Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="panNumber" className="text-[#5B6470]">EIN Number</Label>
                  <Input
                    id="panNumber"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    className={`${inputClass} ov-num`}
                  />
                </div>
                <div>
                  <Label htmlFor="panName" className="text-[#5B6470]">Name on EIN</Label>
                  <div className="relative">
                    <Input
                      id="panName"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={inputClass}
                    />
                    {nameMatch !== null && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {nameMatch ? (
                          <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#DC2626]" strokeWidth={1.8} />
                        )}
                      </div>
                    )}
                  </div>
                  {nameMatch !== null && (
                    <p className={`text-xs mt-1 ${nameMatch ? 'text-[#0F7A4A]' : 'text-[#DC2626]'}`}>
                      {nameMatch ? 'Name matches with CDL' : 'Name does not match with CDL'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="panDob" className="text-[#5B6470]">Date of Birth</Label>
                  <Input
                    id="panDob"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className={`${inputClass} ov-num`}
                  />
                </div>
              </div>

              {/* Verification Button */}
              <div className="mt-6">
                {formData.verified ? (
                  <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
                    <CheckCircle className="w-4 h-4 mr-2" strokeWidth={1.8} />
                    EIN Verified
                  </Badge>
                ) : (
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying || !nameMatch}
                    className="ov-btn ov-btn-ink"
                  >
                    {isVerifying ? 'Verifying…' : 'Verify with IRS API'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-8">
          <Button onClick={onBack} className="ov-btn ov-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!formData.verified}
            className="ov-btn ov-btn-ink"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2 arrow" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FleetPANStep;
