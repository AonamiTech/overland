
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Truck, Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Calendar, Shield, FileText } from 'lucide-react';

interface FleetVehicleStepProps {
  data: {
    truckNumber: string;
    rcImage: File | null;
    insuranceImage: File | null;
    fitnessImage: File | null;
    pucImage: File | null;
    verified: boolean;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const FleetVehicleStep = ({ data, onNext, onBack }: FleetVehicleStepProps) => {
  const [formData, setFormData] = useState(data);
  const [validationStatus, setValidationStatus] = useState({
    rc: false,
    insurance: false,
    fitness: false,
    puc: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));

      // Simulate document validation
      setTimeout(() => {
        const fieldName = field.replace('Image', '') as keyof typeof validationStatus;
        setValidationStatus(prev => ({ ...prev, [fieldName]: true }));

        // Check if all documents are validated
        const allValid = Object.values({ ...validationStatus, [fieldName]: true }).every(Boolean);
        if (allValid) {
          setFormData(prev => ({ ...prev, verified: true }));
        }
      }, 1000);
    }
  };

  const handleNext = () => {
    onNext(formData);
  };

  const documents = [
    {
      key: 'rc',
      title: 'Vehicle Registration + USDOT Number',
      icon: FileText,
      required: true,
      field: 'rcImage',
      status: validationStatus.rc,
      description: 'Upload clear photo of registration and USDOT'
    },
    {
      key: 'insurance',
      title: 'Vehicle Insurance Policy',
      icon: Shield,
      required: true,
      field: 'insuranceImage',
      status: validationStatus.insurance,
      description: 'Current insurance policy document'
    },
    {
      key: 'fitness',
      title: 'DOT Annual Inspection',
      icon: CheckCircle,
      required: true,
      field: 'fitnessImage',
      status: validationStatus.fitness,
      description: 'Valid DOT annual inspection report'
    },
    {
      key: 'puc',
      title: 'MC Number (Operating Authority)',
      icon: Shield,
      required: true,
      field: 'pucImage',
      status: validationStatus.puc,
      description: 'FMCSA operating authority permit'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Fleet KYC</div>
          <h2 className="ov-display text-3xl mb-2">Sample Vehicle Verification</h2>
          <p className="text-[#5B6470]">Upload registration and insurance for 1 truck — we'll use this as fleet benchmark</p>
        </div>

        <div className="space-y-6">
          {/* Truck Number */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4">Vehicle Details</h3>
            <div>
              <Label htmlFor="truckNumber" className="text-[#5B6470]">License Plate Number</Label>
              <Input
                id="truckNumber"
                value={formData.truckNumber}
                onChange={(e) => handleInputChange('truckNumber', e.target.value)}
                placeholder="e.g., CA 8UVW123"
                className="mt-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A] ov-num"
              />
              <p className="text-xs text-[#8B857C] mt-1">Auto-detected location: California</p>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="ov-display text-lg">Upload Vehicle Documents</h3>

            {documents.map((doc) => {
              const Icon = doc.icon;
              const file = formData[doc.field as keyof typeof formData] as File | null;

              return (
                <div key={doc.key} className="ov-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
                      <div>
                        <h4 className="font-medium text-[#14161A]">{doc.title}</h4>
                        <p className="text-sm text-[#5B6470]">{doc.description}</p>
                      </div>
                    </div>
                    {doc.status && (
                      <Badge className="bg-[#0F7A4A]/10 text-[#0F7A4A] border border-[#0F7A4A]/20">
                        <CheckCircle className="w-4 h-4 mr-1" strokeWidth={1.8} />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-[#E7E3DC] rounded-lg p-4">
                    {file ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-8 h-8 text-[#0F7A4A]" strokeWidth={1.8} />
                          <div>
                            <p className="text-sm font-medium text-[#14161A]">{file.name}</p>
                            <p className="text-xs text-[#8B857C]">Uploaded successfully</p>
                          </div>
                        </div>
                        {doc.status && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#0F7A4A]">Document Valid</p>
                            <p className="text-xs text-[#0F7A4A]/80">Expiry: <span className="ov-num">Valid till 2027</span></p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[#0E32E8] mx-auto mb-2" strokeWidth={1.8} />
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(doc.field, e)}
                            className="hidden"
                          />
                          <Button size="sm" className="ov-btn ov-btn-outline">
                            <Upload className="w-4 h-4 mr-2" strokeWidth={1.8} />
                            Upload {doc.title}
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation Summary */}
          {formData.verified && (
            <div className="bg-[#0F7A4A]/5 rounded-[18px] p-6 border border-[#0F7A4A]/20">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-[#0F7A4A]" strokeWidth={1.8} />
                <h3 className="font-semibold text-[#0F7A4A]">All Documents Validated</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-[#3E3F46]">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0F7A4A]" strokeWidth={1.8} />Owner name matches with EIN</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0F7A4A]" strokeWidth={1.8} />All documents within validity</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0F7A4A]" strokeWidth={1.8} />Vehicle class: Commercial</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#0F7A4A]" strokeWidth={1.8} />Operating authority: Active (MC)</div>
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
            Submit & Review
            <ArrowRight className="w-4 h-4 ml-2 arrow" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FleetVehicleStep;
