
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit, Building2, FileText, Phone, CreditCard, ArrowLeft, Sparkles, Calendar } from 'lucide-react';

interface FinalReviewStepProps {
  data: any;
  onComplete: () => void;
  onBack: () => void;
}

const FinalReviewStep = ({ data, onComplete, onBack }: FinalReviewStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const verificationSections = [
    {
      id: 'basic',
      title: 'Company Details',
      icon: Building2,
      status: 'verified',
      data: {
        company: data.basicDetails.companyName,
        ein: data.basicDetails.gstin,
        contact: data.basicDetails.primaryContact,
        location: data.basicDetails.branchLocation
      }
    },
    {
      id: 'documents',
      title: 'Document Verification',
      icon: FileText,
      status: 'verified',
      data: {
        permit: 'Certificate Verified',
        ein: 'Verified',
        bank: 'Details Uploaded'
      }
    },
    {
      id: 'call',
      title: 'Verification Call',
      icon: Phone,
      status: 'scheduled',
      data: {
        date: data.callDetails.scheduledDate?.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }),
        time: data.callDetails.scheduledTime,
        contact: data.callDetails.contactPerson
      }
    },
    {
      id: 'bank',
      title: 'Bank Verification',
      icon: CreditCard,
      status: 'verified',
      data: {
        method: data.bankVerification.verificationMethod === 'penny-drop' ? 'Penny Drop' : 'Bank Statement',
        bank: data.bankVerification.bankName || 'Chase',
        account: `****${data.bankVerification.accountNumber?.slice(-4)}`
      }
    }
  ];

  // Fields rendered as monospace data values
  const numericKeys = ['ein', 'account', 'date', 'time'];

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
          <div className="w-14 h-14 bg-[#0F7A4A]/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <CheckCircle className="w-7 h-7 text-[#0F7A4A]" strokeWidth={1.8} />
            {showConfetti && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#0E32E8] animate-ping" strokeWidth={1.8} />
              </div>
            )}
          </div>
          <h2 className="ov-display text-3xl mb-2">Final Review & Submit</h2>
          <p className="text-[#5B6470]">Review your verification details before submitting</p>
        </div>

        {/* Verification Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {verificationSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="ov-card ov-card--hover p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      section.status === 'verified' ? 'bg-[#0F7A4A]/10' : section.status === 'scheduled' ? 'bg-[#0E32E8]/10' : 'bg-[#F1EEE8]'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        section.status === 'verified' ? 'text-[#0F7A4A]' : section.status === 'scheduled' ? 'text-[#0E32E8]' : 'text-[#5B6470]'
                      }`} strokeWidth={1.8} />
                    </div>
                    <h3 className="font-semibold text-[#14161A]">{section.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={
                      section.status === 'verified'
                        ? "bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20"
                        : section.status === 'scheduled'
                          ? "bg-[#0E32E8]/10 text-[#0E32E8] border border-[#0E32E8]/20"
                          : "bg-[#F1EEE8] text-[#5B6470] border border-[#E7E3DC]"
                    }>
                      {section.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />}
                      {section.status === 'scheduled' && <Calendar className="w-3 h-3 mr-1" strokeWidth={1.8} />}
                      {section.status === 'verified' ? 'Verified' : section.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                    </Badge>
                    <Button size="sm" className="ov-btn ov-btn-ghost px-2">
                      <Edit className="w-3 h-3" strokeWidth={1.8} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-[#ECE8E1] last:border-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B857C]">{key}</span>
                      <span className={`text-[#14161A] font-medium ${numericKeys.includes(key) ? 'ov-num' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="bg-[#0F7A4A]/5 border border-[#0F7A4A]/20 rounded-[18px] p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-[#0F7A4A]" strokeWidth={1.8} />
            <h3 className="font-semibold text-[#0F7A4A]">Ready for Submission</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {verificationSections.map((section) => (
              <div key={section.id} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  section.status === 'verified' ? 'bg-[#0F7A4A]' : section.status === 'scheduled' ? 'bg-[#0E32E8]' : 'bg-[#8B857C]'
                }`}>
                  <CheckCircle className="w-4 h-4 text-white" strokeWidth={1.8} />
                </div>
                <p className="text-xs text-[#3E3F46] font-medium">{section.title.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Info */}
        <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-[18px] p-6 mb-8">
          <h3 className="ov-display text-lg mb-3">What happens next?</h3>
          <ul className="text-sm text-[#3E3F46] space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-[#0E32E8] rounded-full"></div>
              <span>Corporate verification typically takes 3–5 business days</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-[#0E32E8] rounded-full"></div>
              <span>Verification call as scheduled</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-[#0E32E8] rounded-full"></div>
              <span>You'll be notified via SMS & email at each step</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-[#0E32E8] rounded-full"></div>
              <span>Dashboard will update with live tracking</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        {!isSubmitting && !showConfetti && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              className="ov-btn ov-btn-ink px-12 h-12 text-base"
            >
              Submit for Review
            </Button>
          </div>
        )}

        {/* Submitting State */}
        {isSubmitting && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0E32E8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#5B6470]">Submitting your verification for review…</p>
          </div>
        )}

        {/* Success State */}
        {showConfetti && (
          <div className="text-center">
            <div className="w-14 h-14 bg-[#0F7A4A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-[#0F7A4A]" strokeWidth={1.8} />
            </div>
            <h3 className="ov-display text-xl text-[#0F7A4A] mb-2">Corporate Verification Submitted</h3>
            <p className="text-[#5B6470]">You'll hear from us soon…</p>
          </div>
        )}

        {/* Navigation */}
        {!isSubmitting && !showConfetti && (
          <div className="flex justify-between pt-8">
            <Button onClick={onBack} className="ov-btn ov-btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalReviewStep;
