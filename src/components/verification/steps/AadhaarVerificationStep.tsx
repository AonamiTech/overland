
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Shield, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface AadhaarVerificationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const AadhaarVerificationStep = ({ onNext, onBack }: AadhaarVerificationStepProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState({
    name: '',
    address: '',
    cdlNumber: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Simulate OCR extraction
        setTimeout(() => {
          setExtractedData({
            name: 'Michael Anderson',
            address: '123 Main St, Phoenix, Arizona 85001',
            cdlNumber: 'D1234567'
          });
          handleVerification();
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerification = () => {
    setIsVerifying(true);
    // Simulate DMV API verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleRetry = () => {
    setShowFallback(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(14,50,232,0.10)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
          </div>
          <h2 className="ov-display text-2xl mb-2">CDL Verification</h2>
          <p className="text-[#5B6470]">Upload a clear image of the front of your CDL</p>
        </div>

        {/* Upload Area */}
        {!uploadedImage ? (
          <div className="border-2 border-dashed border-[#E7E3DC] rounded-xl p-8 text-center mb-6">
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <div className="w-12 h-12 bg-[rgba(14,50,232,0.10)] rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#0E32E8]" strokeWidth={1.8} />
                </div>
                <div className="w-12 h-12 bg-[rgba(14,50,232,0.10)] rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#0E32E8]" strokeWidth={1.8} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#14161A] mb-1">Upload CDL</h3>
                <p className="text-sm text-[#5B6470]">Drag & drop or click to upload</p>
              </div>
              <div className="flex justify-center space-x-3">
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
                <Button variant="outline" className="ov-btn ov-btn-outline">
                  <Camera className="w-4 h-4 mr-2" strokeWidth={1.8} />
                  Take Photo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="border border-[#E7E3DC] rounded-xl p-4 bg-[#FBFAF8]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#14161A]">Uploaded Document</h3>
                {isVerified && (
                  <Badge className="bg-[rgba(15,122,74,0.12)] text-[#0F7A4A]">
                    <CheckCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />
                    Verified
                  </Badge>
                )}
              </div>
              <img src={uploadedImage} alt="CDL" className="w-full h-48 object-cover rounded-lg" />
            </div>

            {/* Extracted Data Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#14161A]">Extracted Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={extractedData.name}
                    onChange={(e) => setExtractedData({...extractedData, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={extractedData.address}
                    onChange={(e) => setExtractedData({...extractedData, address: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="aadhaar">CDL Number</Label>
                  <Input
                    id="aadhaar"
                    value={extractedData.cdlNumber}
                    onChange={(e) => setExtractedData({...extractedData, cdlNumber: e.target.value})}
                    className="mt-1 ov-num"
                  />
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0E32E8] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-[#3E3F46]">Verifying with DMV...</span>
                  </>
                ) : isVerified ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                    <span className="text-sm text-[#0F7A4A] font-medium">CDL Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-[#DC2626]" strokeWidth={1.8} />
                    <span className="text-sm text-[#DC2626]">Verification Failed</span>
                  </>
                )}
              </div>
            </div>

            {/* Fallback Option */}
            {showFallback && (
              <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-[#8B857C] flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div>
                    <h4 className="font-medium text-[#14161A]">Having trouble with your CDL?</h4>
                    <p className="text-sm text-[#5B6470] mt-1">You can proceed with alternative documents</p>
                    <Button size="sm" variant="outline" className="ov-btn ov-btn-outline mt-3">
                      Try Another Document
                    </Button>
                  </div>
                </div>
              </div>
            )}
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

export default AadhaarVerificationStep;
