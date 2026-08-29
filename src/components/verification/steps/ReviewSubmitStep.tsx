
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Shield, CreditCard, DollarSign, Eye, ArrowLeft, Sparkles } from 'lucide-react';

interface ReviewSubmitStepProps {
  onComplete: () => void;
  onBack: () => void;
}

const ReviewSubmitStep = ({ onComplete, onBack }: ReviewSubmitStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const verificationSections = [
    {
      id: 'aadhaar',
      title: 'CDL Verification',
      icon: Shield,
      status: 'verified',
      data: {
        name: 'Michael Anderson',
        number: 'D1234567',
        address: '123 Main St, Phoenix'
      }
    },
    {
      id: 'pan',
      title: 'EIN Verification',
      icon: CreditCard,
      status: 'verified',
      data: {
        number: '12-3456789',
        name: 'MICHAEL ANDERSON',
        dob: '08/15/1985'
      }
    },
    {
      id: 'bank',
      title: 'Bank Verification',
      icon: DollarSign,
      status: 'verified',
      data: {
        bank: 'Chase',
        account: '****1234',
        routing: '021000021'
      }
    },
    {
      id: 'selfie',
      title: 'Selfie Verification',
      icon: Eye,
      status: 'verified',
      data: {
        liveness: 'Verified',
        faceMatch: 'Matched with CDL'
      }
    }
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(15,122,74,0.12)] rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <CheckCircle className="w-8 h-8 text-[#0F7A4A]" strokeWidth={1.8} />
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#0E32E8] animate-ping" strokeWidth={1.8} />
              </div>
            )}
          </div>
          <h2 className="ov-display text-2xl mb-2">Review & Submit</h2>
          <p className="text-[#5B6470]">Please review your verification details before submitting</p>
        </div>

        {/* Verification Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {verificationSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="ov-card ov-card--hover p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[rgba(15,122,74,0.12)] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-semibold text-[#14161A]">{section.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-[rgba(15,122,74,0.12)] text-[#0F7A4A]">
                      <CheckCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />
                      Verified
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-[#5B6470]">
                      <Edit className="w-3 h-3" strokeWidth={1.8} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#5B6470] capitalize">{key}:</span>
                      <span className="text-[#14161A] font-medium ov-num">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="bg-[rgba(15,122,74,0.08)] border border-[rgba(15,122,74,0.2)] rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-[#0F7A4A]" strokeWidth={1.8} />
            <h3 className="font-semibold text-[#0F7A4A]">All Verifications Complete!</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {verificationSections.map((section) => (
              <div key={section.id} className="text-center">
                <div className="w-8 h-8 bg-[#0F7A4A] rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-4 h-4 text-white" strokeWidth={1.8} />
                </div>
                <p className="text-xs text-[#0F7A4A] font-medium">{section.title.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Info */}
        <div className="bg-[rgba(14,50,232,0.06)] border border-[#E7E3DC] rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-[#14161A] mb-2">What happens next?</h3>
          <ul className="text-sm text-[#3E3F46] space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#0E32E8] rounded-full"></div>
              <span>Verification typically takes <span className="ov-num">24–48</span> hours</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#0E32E8] rounded-full"></div>
              <span>You'll be notified via SMS & email</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#0E32E8] rounded-full"></div>
              <span>Your dashboard will update automatically</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        {!isSubmitting && !showConfetti && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              className="ov-btn ov-btn-ink px-12 h-12"
            >
              Submit for Verification
            </Button>
          </div>
        )}

        {/* Submitting State */}
        {isSubmitting && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0E32E8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#5B6470]">Submitting your verification...</p>
          </div>
        )}

        {/* Success State */}
        {showConfetti && (
          <div className="text-center">
            <div className="ov-tick w-14 h-14 mx-auto mb-4"><CheckCircle className="w-7 h-7" strokeWidth={1.8} /></div>
            <h3 className="ov-display text-xl text-[#0F7A4A] mb-2">Verification Submitted Successfully!</h3>
            <p className="text-[#5B6470]">You'll hear from us soon...</p>
          </div>
        )}

        {/* Navigation */}
        {!isSubmitting && !showConfetti && (
          <div className="flex justify-between pt-8">
            <Button variant="outline" onClick={onBack} className="ov-btn ov-btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
