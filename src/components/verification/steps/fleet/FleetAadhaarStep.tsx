
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Upload, Camera, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface FleetAadhaarStepProps {
  data: {
    number: string;
    name: string;
    dob: string;
    address: string;
    image: File | null;
    verified: boolean;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const FleetAadhaarStep = ({ data, onNext, onBack }: FleetAadhaarStepProps) => {
  const [formData, setFormData] = useState(data);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size should be less than 5MB');
        return;
      }
      setUploadError('');
      setFormData(prev => ({ ...prev, image: file }));

      // Simulate OCR extraction
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          number: 'D1234567',
          name: 'Robert Miller',
          dob: '08/15/1985',
          address: 'Los Angeles, California 90001'
        }));
      }, 1000);
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate DMV API verification
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
          <h2 className="ov-display text-3xl mb-2">CDL Verification</h2>
          <p className="text-[#5B6470]">Verify your identity securely via your CDL</p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4">Upload CDL</h3>
            <div className="border-2 border-dashed border-[#E7E3DC] rounded-lg p-8 text-center">
              {formData.image ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-[#0F7A4A] mx-auto" strokeWidth={1.8} />
                  <p className="text-sm text-[#3E3F46]">CDL uploaded successfully</p>
                  <p className="text-xs text-[#8B857C]">{formData.image.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-[#0E32E8] mx-auto" strokeWidth={1.8} />
                  <div>
                    <p className="text-sm text-[#5B6470] mb-2">Upload the front of your CDL</p>
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
            {uploadError && (
              <div className="flex items-center space-x-2 mt-2 text-[#DC2626]">
                <AlertCircle className="w-4 h-4" strokeWidth={1.8} />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
          </div>

          {/* Extracted Details */}
          {formData.image && (
            <div className="ov-card p-6">
              <h3 className="ov-display text-lg mb-4">Extracted Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aadhaarNumber" className="text-[#5B6470]">CDL Number</Label>
                  <Input
                    id="aadhaarNumber"
                    value={formData.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    className={`${inputClass} ov-num`}
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="text-[#5B6470]">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <Label htmlFor="dob" className="text-[#5B6470]">Date of Birth</Label>
                  <Input
                    id="dob"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className={`${inputClass} ov-num`}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-[#5B6470]">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Verification Button */}
              <div className="mt-6">
                {formData.verified ? (
                  <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
                    <CheckCircle className="w-4 h-4 mr-2" strokeWidth={1.8} />
                    CDL Verified
                  </Badge>
                ) : (
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="ov-btn ov-btn-ink"
                  >
                    {isVerifying ? 'Verifying…' : 'Verify with DMV'}
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

export default FleetAadhaarStep;
