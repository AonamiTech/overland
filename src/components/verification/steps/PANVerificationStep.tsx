
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, CreditCard, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, FileText } from 'lucide-react';

interface PANVerificationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PANVerificationStep = ({ onNext, onBack }: PANVerificationStepProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState({
    einNumber: '',
    name: '',
    dateOfBirth: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nameMatched, setNameMatched] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Simulate OCR extraction
        setTimeout(() => {
          setExtractedData({
            einNumber: '12-3456789',
            name: 'MICHAEL ANDERSON',
            dateOfBirth: '08/15/1985'
          });
          handleVerification();
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerification = () => {
    setIsVerifying(true);
    // Simulate IRS API verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setNameMatched(true);
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(14,50,232,0.10)] rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
          </div>
          <h2 className="ov-display text-2xl mb-2">EIN Verification</h2>
          <p className="text-[#5B6470]">Upload a clear image of your EIN document</p>
          <p className="text-xs text-[#8B857C] mt-2">Ensure clear photo, no glare</p>
        </div>

        {/* Upload Area */}
        {!uploadedImage ? (
          <div className="border-2 border-dashed border-[#E7E3DC] rounded-xl p-8 text-center mb-6">
            <div className="space-y-4">
              <span className="ov-tick w-12 h-12 mx-auto"><FileText className="w-6 h-6" strokeWidth={1.8} /></span>
              <div>
                <h3 className="font-semibold text-[#14161A] mb-1">Upload EIN Document</h3>
                <p className="text-sm text-[#5B6470]">Clear photo without glare or shadows</p>
              </div>
              <Button variant="outline" className="ov-btn ov-btn-outline relative">
                <Upload className="w-4 h-4 mr-2" strokeWidth={1.8} />
                Choose File
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="border border-[#E7E3DC] rounded-xl p-4 bg-[#FBFAF8]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#14161A]">EIN Document</h3>
                {isVerified && (
                  <Badge className="bg-[rgba(15,122,74,0.12)] text-[#0F7A4A]">
                    <CheckCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />
                    Verified
                  </Badge>
                )}
              </div>
              <img src={uploadedImage} alt="EIN Document" className="w-full h-48 object-cover rounded-lg" />
            </div>

            {/* Extracted Data Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#14161A]">Extracted Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="pan">EIN Number</Label>
                  <Input
                    id="pan"
                    value={extractedData.einNumber}
                    onChange={(e) => setExtractedData({...extractedData, einNumber: e.target.value})}
                    className="mt-1 ov-num"
                  />
                </div>
                <div>
                  <Label htmlFor="panName">Name (as per EIN)</Label>
                  <Input
                    id="panName"
                    value={extractedData.name}
                    onChange={(e) => setExtractedData({...extractedData, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    value={extractedData.dateOfBirth}
                    onChange={(e) => setExtractedData({...extractedData, dateOfBirth: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="space-y-3">
              <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#0E32E8] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-[#3E3F46]">Verifying with the IRS...</span>
                    </>
                  ) : isVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                      <span className="text-sm text-[#0F7A4A] font-medium">EIN Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-[#DC2626]" strokeWidth={1.8} />
                      <span className="text-sm text-[#DC2626]">Verification Failed</span>
                    </>
                  )}
                </div>
              </div>

              {/* Name Matching */}
              {isVerified && (
                <div className="bg-[rgba(15,122,74,0.08)] border border-[rgba(15,122,74,0.2)] rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                    <div>
                      <span className="text-sm text-[#0F7A4A] font-medium">Name matched with CDL</span>
                      <p className="text-xs text-[#0F7A4A] mt-1">Cross-verification successful</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button variant="outline" onClick={onBack} className="ov-btn ov-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!isVerified}
            className="ov-btn ov-btn-ink"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PANVerificationStep;
