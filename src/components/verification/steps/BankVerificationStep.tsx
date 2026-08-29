
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, CheckCircle, Clock, Shield, ArrowRight, ArrowLeft, DollarSign } from 'lucide-react';

interface BankVerificationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const BankVerificationStep = ({ onNext, onBack }: BankVerificationStepProps) => {
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    routingNumber: '',
    accountType: ''
  });
  const [branchDetails, setBranchDetails] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pennyDropStatus, setPennyDropStatus] = useState<'idle' | 'processing' | 'sent' | 'verified'>('idle');

  const bankList = [
    'Chase',
    'Bank of America',
    'Wells Fargo',
    'Citibank',
    'U.S. Bank',
    'PNC Bank',
    'Truist Bank',
    'Capital One'
  ];

  const handleRoutingChange = (value: string) => {
    setBankDetails({...bankDetails, routingNumber: value});
    if (value.length === 9) {
      // Simulate branch fetching
      setTimeout(() => {
        setBranchDetails('Downtown Branch, Phoenix 85001');
      }, 500);
    }
  };

  const handlePennyDrop = () => {
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }

    setIsVerifying(true);
    setPennyDropStatus('processing');

    // Simulate penny drop process
    setTimeout(() => {
      setPennyDropStatus('sent');
      setTimeout(() => {
        setPennyDropStatus('verified');
        setIsVerified(true);
        setIsVerifying(false);
      }, 3000);
    }, 2000);
  };

  const renderPennyDropAnimation = () => {
    return (
      <div className="bg-[rgba(14,50,232,0.06)] border border-[#E7E3DC] rounded-lg p-6 text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-[rgba(14,50,232,0.10)] rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
          </div>
          {pennyDropStatus === 'processing' && (
            <div className="absolute -top-2 -right-2">
              <div className="w-6 h-6 border-2 border-[#0E32E8] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {pennyDropStatus === 'processing' && (
            <p className="text-sm text-[#3E3F46]">Initiating verification transfer...</p>
          )}
          {pennyDropStatus === 'sent' && (
            <p className="text-sm text-[#3E3F46]"><span className="ov-num">$0.01</span> sent to your bank – verifying...</p>
          )}
          {pennyDropStatus === 'verified' && (
            <div>
              <p className="text-sm text-[#0F7A4A] font-medium"><span className="ov-num">$0.01</span> credited – Account Verified!</p>
              <p className="text-xs text-[#0F7A4A] mt-1">Your account is now verified</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[rgba(14,50,232,0.10)] rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
          </div>
          <h2 className="ov-display text-2xl mb-2">Bank Account Verification</h2>
          <p className="text-[#5B6470]">We'll send <span className="ov-num">$0.01</span> to verify your account (refunded instantly)</p>
        </div>

        {/* Bank Details Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="bank">Bank Name</Label>
              <Select onValueChange={(value) => setBankDetails({...bankDetails, bankName: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankList.map((bank) => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account">Account Number</Label>
              <Input
                id="account"
                type="number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                className="mt-1 ov-num"
                placeholder="Enter account number"
              />
            </div>

            <div>
              <Label htmlFor="confirmAccount">Confirm Account Number</Label>
              <Input
                id="confirmAccount"
                type="number"
                value={bankDetails.confirmAccountNumber}
                onChange={(e) => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
                className="mt-1 ov-num"
                placeholder="Re-enter account number"
              />
            </div>

            <div>
              <Label htmlFor="ifsc">Routing Number</Label>
              <Input
                id="ifsc"
                value={bankDetails.routingNumber}
                onChange={(e) => handleRoutingChange(e.target.value)}
                className="mt-1 ov-num"
                placeholder="e.g. 021000021"
                maxLength={9}
              />
              {branchDetails && (
                <p className="text-xs text-[#0F7A4A] mt-1">{branchDetails}</p>
              )}
            </div>

            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select onValueChange={(value) => setBankDetails({...bankDetails, accountType: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-[#FBFAF8] border border-[#E7E3DC] rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-medium text-[#14161A]">SSL Encrypted</p>
                <p className="text-xs text-[#5B6470]">Your banking details are protected with bank-grade security</p>
              </div>
            </div>
          </div>

          {/* Penny Drop Section */}
          {pennyDropStatus !== 'idle' && renderPennyDropAnimation()}

          {/* Verify Button */}
          {pennyDropStatus === 'idle' && (
            <Button
              onClick={handlePennyDrop}
              disabled={!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.routingNumber || !bankDetails.accountType}
              className="ov-btn ov-btn-ink w-full h-12"
            >
              <DollarSign className="w-4 h-4 mr-2" strokeWidth={1.8} />
              Verify with $0.01 Transfer
            </Button>
          )}
        </div>

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

export default BankVerificationStep;
