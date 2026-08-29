
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Building } from 'lucide-react';

interface BankVerificationStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const BankVerificationStep = ({ data, onNext, onBack }: BankVerificationStepProps) => {
  const [verificationMethod, setVerificationMethod] = useState(data.verificationMethod || 'penny-drop');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: data.accountNumber || '',
    confirmAccountNumber: '',
    ifsc: data.ifsc || '',
    accountHolderName: data.accountHolderName || '',
    bankName: ''
  });
  // note: `ifsc` key retained for state shape; represents Routing Number
  const [pennyDropStatus, setPennyDropStatus] = useState('idle');
  const [uploadedStatement, setUploadedStatement] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));

    // Auto-fetch bank name from routing number
    if (field === 'ifsc' && value.length === 9) {
      setTimeout(() => {
        setBankDetails(prev => ({ ...prev, bankName: 'Chase - Downtown LA' }));
      }, 500);
    }
  };

  const handlePennyDrop = () => {
    if (bankDetails.accountNumber && bankDetails.ifsc && bankDetails.accountHolderName) {
      setPennyDropStatus('processing');

      setTimeout(() => {
        setPennyDropStatus('success');
      }, 3000);
    }
  };

  const handleFileUpload = () => {
    setUploadedStatement(true);
  };

  const handleNext = () => {
    onNext({
      verificationMethod,
      ...bankDetails,
      pennyDropStatus,
      uploadedStatement
    });
  };

  const canProceed = verificationMethod === 'penny-drop'
    ? pennyDropStatus === 'success'
    : uploadedStatement;

  const inputClass = "mt-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]";
  const numInputClass = `${inputClass} ov-num`;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Corporate KYC</div>
          <h2 className="ov-display text-3xl mb-2">Bank Verification</h2>
          <p className="text-[#5B6470]">Verify your business bank account for secure transactions</p>
        </div>

        {/* Verification Methods */}
        <Tabs value={verificationMethod} onValueChange={setVerificationMethod} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="penny-drop">Instant Verification</TabsTrigger>
            <TabsTrigger value="statement">Bank Statement</TabsTrigger>
          </TabsList>

          {/* Penny Drop */}
          <TabsContent value="penny-drop" className="space-y-6 mt-6">
            <div className="bg-[#0E32E8]/5 border border-[#0E32E8]/15 rounded-[18px] p-4 mb-6">
              <h3 className="font-semibold text-[#14161A] mb-2">How it works</h3>
              <p className="text-sm text-[#3E3F46]">We'll send <span className="ov-num">$0.01</span> to your account and verify it instantly. The amount will be refunded immediately.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="accountNumber" className="text-[#5B6470]">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                  className={numInputClass}
                />
              </div>

              <div>
                <Label htmlFor="confirmAccountNumber" className="text-[#5B6470]">Confirm Account Number</Label>
                <Input
                  id="confirmAccountNumber"
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value)}
                  placeholder="Re-enter account number"
                  className={numInputClass}
                />
              </div>

              <div>
                <Label htmlFor="ifsc" className="text-[#5B6470]">Routing Number</Label>
                <Input
                  id="ifsc"
                  value={bankDetails.ifsc}
                  onChange={(e) => handleInputChange('ifsc', e.target.value)}
                  placeholder="e.g., 021000021"
                  className={numInputClass}
                />
                {bankDetails.bankName && (
                  <div className="flex items-center mt-2">
                    <Building className="w-4 h-4 text-[#0F7A4A] mr-2" strokeWidth={1.8} />
                    <span className="text-sm text-[#0F7A4A]">{bankDetails.bankName}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="accountHolderName" className="text-[#5B6470]">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  placeholder="As per bank records"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Penny Drop Button */}
            {pennyDropStatus === 'idle' && (
              <Button
                onClick={handlePennyDrop}
                disabled={!bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.accountHolderName || bankDetails.accountNumber !== bankDetails.confirmAccountNumber}
                className="ov-btn ov-btn-ink w-full"
              >
                Verify Account ($0.01 Test Transaction)
              </Button>
            )}

            {/* Penny Drop Status */}
            {pennyDropStatus === 'processing' && (
              <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-[18px] p-4 text-center">
                <div className="w-8 h-8 border-2 border-[#0E32E8] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-[#14161A] font-medium">Processing <span className="ov-num">$0.01</span> test transaction…</p>
                <p className="text-sm text-[#5B6470] mt-1">This usually takes 5-10 seconds</p>
              </div>
            )}

            {pennyDropStatus === 'success' && (
              <div className="bg-[#0F7A4A]/5 border border-[#0F7A4A]/20 rounded-[18px] p-4 text-center">
                <CheckCircle className="w-8 h-8 text-[#0F7A4A] mx-auto mb-3" strokeWidth={1.8} />
                <p className="text-[#0F7A4A] font-medium"><span className="ov-num">$0.01</span> credited — Account Verified</p>
                <p className="text-sm text-[#0F7A4A]/80 mt-1">Your bank account has been successself-declared</p>
              </div>
            )}
          </TabsContent>

          {/* Bank Statement Upload */}
          <TabsContent value="statement" className="space-y-6 mt-6">
            <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-[18px] p-4 mb-6">
              <h3 className="font-semibold text-[#14161A] mb-2">Manual Verification</h3>
              <p className="text-sm text-[#5B6470]">Upload your bank statement for manual verification. This process may take 24-48 hours.</p>
            </div>

            {!uploadedStatement ? (
              <div className="border-2 border-dashed border-[#E7E3DC] rounded-[18px] p-8 text-center">
                <Upload className="w-12 h-12 text-[#0E32E8] mx-auto mb-4" strokeWidth={1.8} />
                <h3 className="font-medium text-[#14161A] mb-2">Upload Bank Statement</h3>
                <p className="text-sm text-[#5B6470] mb-4">
                  Upload last 3 months bank statement (PDF format, max 10MB)
                </p>
                <Button onClick={handleFileUpload} className="ov-btn ov-btn-outline">
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="bg-[#0F7A4A]/5 border border-[#0F7A4A]/20 rounded-[18px] p-6 text-center">
                <CheckCircle className="w-8 h-8 text-[#0F7A4A] mx-auto mb-3" strokeWidth={1.8} />
                <p className="text-[#0F7A4A] font-medium">Bank Statement Uploaded</p>
                <p className="text-sm text-[#0F7A4A]/80 mt-1">Your statement will be verified within 24-48 hours</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Security Note */}
        <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-[18px] p-4 mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-[#0F7A4A]" strokeWidth={1.8} />
            <span className="text-sm font-medium text-[#14161A]">Bank-grade Security</span>
          </div>
          <p className="text-xs text-[#5B6470]">Your banking information is encrypted with 256-bit SSL and never stored on our servers.</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button onClick={onBack} className="ov-btn ov-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="ov-btn ov-btn-ink"
          >
            Proceed to Final Review
            <ArrowRight className="w-4 h-4 ml-2 arrow" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BankVerificationStep;
