
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Shield, CreditCard } from 'lucide-react';

interface DocumentUploadStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const DocumentUploadStep = ({ data, onNext, onBack }: DocumentUploadStepProps) => {
  const [uploadedDocs, setUploadedDocs] = useState({
    gstCertificate: false,
    panCard: false,
    cin: false,
    bankDetails: false,
    creditScore: false
  });

  const [verificationStatus, setVerificationStatus] = useState({
    gstCertificate: 'pending',
    panCard: 'pending',
    cin: 'pending',
    bankDetails: 'pending',
    creditScore: 'pending'
  });

  const documents = [
    {
      key: 'gstCertificate',
      title: 'Sales Tax Certificate',
      description: 'Upload your state sales tax registration certificate',
      icon: Shield,
      required: true
    },
    {
      key: 'panCard',
      title: 'EIN Document',
      description: 'Company EIN letter for verification',
      icon: CreditCard,
      required: true
    },
    {
      key: 'cin',
      title: 'State Business Registration (Optional)',
      description: 'State registration filing for LLC or corporation',
      icon: FileText,
      required: false
    },
    {
      key: 'bankDetails',
      title: 'Bank Account Details',
      description: 'Bank statement or voided check',
      icon: FileText,
      required: true
    },
    {
      key: 'creditScore',
      title: 'Credit Score (Optional)',
      description: 'Upload credit score report for faster approval',
      icon: FileText,
      required: false
    }
  ];

  const handleFileUpload = (docKey: string) => {
    // Simulate file upload and verification
    setUploadedDocs(prev => ({ ...prev, [docKey]: true }));
    setVerificationStatus(prev => ({ ...prev, [docKey]: 'verifying' }));

    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, [docKey]: 'verified' }));
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
            <CheckCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />
            Verified
          </Badge>
        );
      case 'verifying':
        return (
          <Badge className="bg-[#F1EEE8] text-[#5B6470] border border-[#E7E3DC]">
            Verifying…
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">
            <AlertCircle className="w-3 h-3 mr-1" strokeWidth={1.8} />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const requiredDocsUploaded = documents
    .filter(doc => doc.required)
    .every(doc => uploadedDocs[doc.key as keyof typeof uploadedDocs]);

  const handleNext = () => {
    onNext({ documents: uploadedDocs, verificationStatus });
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Corporate KYC</div>
          <h2 className="ov-display text-3xl mb-2">Upload Verification Documents</h2>
          <p className="text-[#5B6470]">Upload clear images or PDFs of your business documents</p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {documents.map((doc) => {
            const Icon = doc.icon;
            const isUploaded = uploadedDocs[doc.key as keyof typeof uploadedDocs];
            const status = verificationStatus[doc.key as keyof typeof verificationStatus];

            return (
              <div key={doc.key} className="ov-card ov-card--hover p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#F1EEE8] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#14161A]">{doc.title}</h3>
                      {!doc.required && <span className="text-xs text-[#8B857C]">Optional</span>}
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>

                <p className="text-sm text-[#5B6470] mb-4">{doc.description}</p>

                {!isUploaded ? (
                  <div className="border-2 border-dashed border-[#E7E3DC] rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-[#0E32E8] mx-auto mb-2" strokeWidth={1.8} />
                    <Button
                      size="sm"
                      onClick={() => handleFileUpload(doc.key)}
                      className="ov-btn ov-btn-outline"
                    >
                      Upload Document
                    </Button>
                  </div>
                ) : (
                  <div className="bg-[#0F7A4A]/5 border border-[#0F7A4A]/20 rounded-lg p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-[#0F7A4A] mx-auto mb-2" strokeWidth={1.8} />
                    <p className="text-sm text-[#0F7A4A] font-medium">Document Uploaded</p>
                    <Button size="sm" className="ov-btn ov-btn-ghost mt-2">
                      Replace
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-[18px] p-6 mb-8">
          <h3 className="ov-display text-lg mb-2">Upload Progress</h3>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-[#3E3F46]">
              Required: <span className="ov-num">{documents.filter(d => d.required && uploadedDocs[d.key as keyof typeof uploadedDocs]).length}/{documents.filter(d => d.required).length}</span>
            </div>
            <div className="text-sm text-[#3E3F46]">
              Optional: <span className="ov-num">{documents.filter(d => !d.required && uploadedDocs[d.key as keyof typeof uploadedDocs]).length}/{documents.filter(d => !d.required).length}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button onClick={onBack} className="ov-btn ov-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!requiredDocsUploaded}
            className="ov-btn ov-btn-ink"
          >
            Continue to Verification Call
            <ArrowRight className="w-4 h-4 ml-2 arrow" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
