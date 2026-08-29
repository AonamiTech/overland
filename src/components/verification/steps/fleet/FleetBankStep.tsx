
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, CheckCircle, Clock, Shield, ArrowLeft, ArrowRight } from 'lucide-react';

interface FleetBankStepProps {
  data: {
    accountNumber: string;
    ifsc: string;
    accountType: string;
    accountHolderName: string;
    verified: boolean;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const FleetBankStep = ({ data, onNext, onBack }: FleetBankStepProps) => {
  const [formData, setFormData] = useState(data);
  const [confirmAccount, setConfirmAccount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pennyDropStatus, setPennyDropStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePennyDrop = () => {
    if (formData.accountNumber !== confirmAccount) {
      alert('Account numbers do not match');
      return;
    }

    setPennyDropStatus('sending');
    setIsVerifying(true);

    // Simulate penny drop process
    setTimeout(() => {
      setPennyDropStatus('success');
      setFormData(prev => ({ ...prev, verified: true }));
      setIsVerifying(false);
    }, 3000);
  };

  const handleNext = () => {
    onNext(formData);
  };

  const inputClass = "mt-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]";
  const numInputClass = `${inputClass} ov-num`;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Fleet KYC</div>
          <h2 className="ov-display text-3xl mb-2">Bank Verification</h2>
          <p className="text-[#5B6470]">Add a bank account for payouts and verification</p>
        </div>

        <div className="space-y-6">
          {/* Bank Details Form */}
          <div className="ov-card p-6">
            <h3 className="ov-display text-lg mb-4">Bank Account Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accountNumber" className="text-[#5B6470]">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                  className={numInputClass}
                />
              </div>

              <div>
                <Label htmlFor="confirmAccount" className="text-[#5B6470]">Confirm Account Number</Label>
                <Input
                  id="confirmAccount"
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  placeholder="Re-enter account number"
                  className={numInputClass}
                />
              </div>

              <div>
                <Label htmlFor="ifsc" className="text-[#5B6470]">Routing Number</Label>
                <Input
                  id="ifsc"
                  value={formData.ifsc}
                  onChange={(e) => handleInputChange('ifsc', e.target.value)}
                  placeholder="e.g., 021000021"
                  className={numInputClass}
                />
                {formData.ifsc && formData.ifsc.length >= 9 && (
                  <p className="text-sm text-[#0F7A4A] mt-1">Chase, Los Angeles Branch</p>
                )}
              </div>

              <div>
                <Label htmlFor="accountType" className="text-[#5B6470]">Account Type</Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                  <SelectTrigger className="mt-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountHolderName" className="text-[#5B6470]">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  placeholder="Name as per bank records"
                  className={inputClass}
                />
                <p className="text-xs text-[#8B857C] mt-1">Must match the name on your EIN</p>
              </div>
            </div>
          </div>

          {/* Penny Drop Section */}
          <div className="bg-[#0E32E8]/5 border border-[#0E32E8]/15 rounded-[18px] p-6">
            <h3 className="ov-display text-lg mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
              Penny Drop Verification
            </h3>

            {pennyDropStatus === 'idle' && (
              <div>
                <p className="text-sm text-[#3E3F46] mb-4">
                  We'll send <span className="ov-num">$0.01</span> to your account to verify it's active and belongs to you.
                  This amount will be credited instantly.
                </p>
                <Button
                  onClick={handlePennyDrop}
                  disabled={!formData.accountNumber || !confirmAccount || !formData.ifsc || !formData.accountHolderName}
                  className="ov-btn ov-btn-ink"
                >
                  Verify Account with $0.01
                </Button>
              </div>
            )}

            {pennyDropStatus === 'sending' && (
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#0E32E8] animate-spin" strokeWidth={1.8} />
                <div>
                  <p className="font-medium text-[#14161A]">Sending <span className="ov-num">$0.01</span> to your account…</p>
                  <p className="text-sm text-[#5B6470]">This usually takes a few seconds</p>
                </div>
              </div>
            )}

            {pennyDropStatus === 'success' && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
                <div>
                  <p className="font-medium text-[#0F7A4A]"><span className="ov-num">$0.01</span> credited — Account Verified</p>
                  <p className="text-sm text-[#0F7A4A]/80">Your bank account is now verified</p>
                </div>
              </div>
            )}

            {pennyDropStatus === 'failed' && (
              <div className="text-[#DC2626]">
                <p className="font-medium">Verification failed</p>
                <p className="text-sm">Please check your account details and try again</p>
                <Button
                  onClick={() => setPennyDropStatus('idle')}
                  className="ov-btn ov-btn-outline mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="bg-[#FBFAF8] rounded-lg p-4 border-l-4 border-[#0F7A4A]">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-[#0F7A4A] mr-2" strokeWidth={1.8} />
              <p className="text-sm text-[#3E3F46]">
                <strong>SSL Encrypted:</strong> Your bank details are secured with bank-grade encryption
              </p>
            </div>
          </div>
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

export default FleetBankStep;
