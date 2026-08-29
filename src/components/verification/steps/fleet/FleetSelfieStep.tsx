
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, Upload, AlertCircle, ArrowLeft, ArrowRight, Eye } from 'lucide-react';

interface FleetSelfieStepProps {
  data: {
    image: File | null;
    verified: boolean;
    liveness: boolean;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const FleetSelfieStep = ({ data, onNext, onBack }: FleetSelfieStepProps) => {
  const [formData, setFormData] = useState(data);
  const [isCapturing, setIsCapturing] = useState(false);
  const [livenessStatus, setLivenessStatus] = useState<'idle' | 'detecting' | 'success' | 'failed'>('idle');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      startLivenessDetection();
    }
  };

  const handleCameraCapture = () => {
    setIsCapturing(true);
    // Simulate camera capture
    setTimeout(() => {
      const mockFile = new File([''], 'selfie.jpg', { type: 'image/jpeg' });
      setFormData(prev => ({ ...prev, image: mockFile }));
      setIsCapturing(false);
      startLivenessDetection();
    }, 2000);
  };

  const startLivenessDetection = () => {
    setLivenessStatus('detecting');
    // Simulate liveness detection
    setTimeout(() => {
      setLivenessStatus('success');
      setFormData(prev => ({ ...prev, liveness: true }));

      // Then verify face match
      setTimeout(() => {
        setFormData(prev => ({ ...prev, verified: true }));
      }, 1000);
    }, 3000);
  };

  const handleRetry = () => {
    setFormData(prev => ({ ...prev, image: null, verified: false, liveness: false }));
    setLivenessStatus('idle');
  };

  const handleNext = () => {
    onNext(formData);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Fleet KYC</div>
          <h2 className="ov-display text-3xl mb-2">Live Selfie Verification</h2>
          <p className="text-[#5B6470]">Take a live selfie for identity confirmation</p>
        </div>

        <div className="space-y-6">
          {/* Camera/Upload Section */}
          {!formData.image ? (
            <div className="ov-card p-6">
              <h3 className="ov-display text-lg mb-4">Capture Your Selfie</h3>

              {/* Guidelines */}
              <div className="bg-[#0E32E8]/5 border border-[#0E32E8]/15 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-[#14161A] mb-2">Guidelines for best results</h4>
                <ul className="text-sm text-[#3E3F46] space-y-1">
                  <li>• Ensure good lighting on your face</li>
                  <li>• Look directly at the camera</li>
                  <li>• Remove sunglasses or hat</li>
                  <li>• Keep your face centered in the frame</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-[#E7E3DC] rounded-lg p-8 text-center">
                {isCapturing ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 bg-[#F1EEE8] rounded-full mx-auto flex items-center justify-center">
                      <Camera className="w-12 h-12 text-[#8B857C] animate-pulse" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm text-[#5B6470]">Capturing your selfie…</p>
                    <div className="w-full bg-[#F1EEE8] rounded-full h-2">
                      <div className="bg-[#0E32E8] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-24 h-24 bg-[#F1EEE8] rounded-full mx-auto flex items-center justify-center">
                      <Camera className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm text-[#5B6470] mb-4">Take a live selfie for verification</p>
                      <div className="space-x-4">
                        <Button onClick={handleCameraCapture} className="ov-btn ov-btn-ink">
                          <Camera className="w-4 h-4 mr-2" strokeWidth={1.8} />
                          Use Camera
                        </Button>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button className="ov-btn ov-btn-outline">
                            <Upload className="w-4 h-4 mr-2" strokeWidth={1.8} />
                            Upload Photo
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Verification Process */}
              <div className="ov-card p-6">
                <h3 className="ov-display text-lg mb-4">Verification in Progress</h3>

                {/* Liveness Detection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E7E3DC]">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
                      <span className="font-medium text-[#14161A]">Liveness Detection</span>
                    </div>
                    <div>
                      {livenessStatus === 'idle' && (
                        <Badge className="bg-[#F1EEE8] text-[#5B6470] border border-[#E7E3DC]">Pending</Badge>
                      )}
                      {livenessStatus === 'detecting' && (
                        <Badge className="bg-[#0E32E8]/10 text-[#0E32E8] border border-[#0E32E8]/20 animate-pulse">Detecting…</Badge>
                      )}
                      {livenessStatus === 'success' && (
                        <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
                          <CheckCircle className="w-4 h-4 mr-1" strokeWidth={1.8} />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Face Match */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E7E3DC]">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                      <span className="font-medium text-[#14161A]">Face Match with CDL</span>
                    </div>
                    <div>
                      {!formData.liveness && (
                        <Badge className="bg-[#F1EEE8] text-[#5B6470] border border-[#E7E3DC]">Waiting</Badge>
                      )}
                      {formData.liveness && !formData.verified && (
                        <Badge className="bg-[#0E32E8]/10 text-[#0E32E8] border border-[#0E32E8]/20 animate-pulse">Matching…</Badge>
                      )}
                      {formData.verified && (
                        <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
                          <CheckCircle className="w-4 h-4 mr-1" strokeWidth={1.8} />
                          Matched
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {formData.verified && (
                  <div className="mt-6 p-4 bg-[#0F7A4A]/5 rounded-lg border border-[#0F7A4A]/20">
                    <div className="flex items-center space-x-2 text-[#0F7A4A]">
                      <CheckCircle className="w-5 h-5" strokeWidth={1.8} />
                      <span className="font-medium">Liveness Verified</span>
                    </div>
                    <p className="text-sm text-[#0F7A4A]/80 mt-1">
                      Your identity has been successself-declared
                    </p>
                  </div>
                )}

                {/* Retry Option */}
                {formData.image && !formData.verified && (
                  <div className="mt-4">
                    <Button onClick={handleRetry} size="sm" className="ov-btn ov-btn-outline">
                      Take Another Photo
                    </Button>
                  </div>
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

export default FleetSelfieStep;
