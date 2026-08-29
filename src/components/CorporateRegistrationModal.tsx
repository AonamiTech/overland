
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Phone, Mail, Building, Upload, Clock, Shield } from "lucide-react";

interface CorporateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: () => void;
}

const CorporateRegistrationModal = ({ isOpen, onClose, onRegistrationSuccess }: CorporateRegistrationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationMethod, setRegistrationMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    // Operator Details
    firstName: '',
    lastName: '',
    designation: '',
    department: '',
    employeeId: '',
    // Company Details
    companyName: '',
    companyType: '',
    industrySector: '',
    companyAddress: '',
    branchLocation: '',
    gstNumber: '',
    // Financial Details
    panNumber: '',
    cinNumber: '',
    annualTurnover: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: '',
    paymentMethods: [],
    // Operational Details
    monthlyBudget: '',
    primaryRoutes: [],
    truckTypes: [],
    shipmentVolume: ''
  });

  const steps = [
    { number: 1, label: 'Select Method', completed: currentStep > 1 },
    { number: 2, label: 'Registration Form', completed: currentStep > 2 },
    { number: 3, label: 'Verification', completed: currentStep > 3 }
  ];

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleMethodSelection = (method: string) => {
    setRegistrationMethod(method);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length === 10) {
      setCountdown(60);
      setCurrentStep(1.5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleOtpVerify = () => {
    if (otp.length === 6) {
      setCurrentStep(2);
    }
  };

  const handleEmailSubmit = () => {
    if (email && email.includes('@')) {
      setCurrentStep(2);
    }
  };

  const renderMethodSelection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="ov-display text-xl">Corporate Registration</h3>
          <p className="font-poppins text-sm text-[#5B6470]">Choose a verification method to begin. You can add alternate contacts later.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`ov-card cursor-pointer transition-colors duration-200 ${
              registrationMethod === 'phone' ? 'border-[#0E32E8] ring-2 ring-[#0E32E8]/15' : 'border-[#E7E3DC]'
            }`}
            onClick={() => handleMethodSelection('phone')}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-6 h-6 rounded-full border ${
                  registrationMethod === 'phone' ? 'border-[#0E32E8] bg-[#0E32E8]' : 'border-[#E7E3DC]'
                } flex items-center justify-center`}>
                  {registrationMethod === 'phone' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
                    <h4 className="ov-display text-lg">Phone Number Registration</h4>
                  </div>
                  <p className="font-poppins text-sm text-[#5B6470]">Quick OTP. Ideal for local decision makers (USA +1).</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`ov-card cursor-pointer transition-colors duration-200 ${
              registrationMethod === 'email' ? 'border-[#0E32E8] ring-2 ring-[#0E32E8]/15' : 'border-[#E7E3DC]'
            }`}
            onClick={() => handleMethodSelection('email')}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-6 h-6 rounded-full border ${
                  registrationMethod === 'email' ? 'border-[#0E32E8] bg-[#0E32E8]' : 'border-[#E7E3DC]'
                } flex items-center justify-center`}>
                  {registrationMethod === 'email' && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-8 h-8 text-[#0E32E8]" strokeWidth={1.8} />
                    <h4 className="ov-display text-lg">Email Registration</h4>
                  </div>
                  <p className="font-poppins text-sm text-[#5B6470]">Professional email verification—preferred for corporate domains.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center font-poppins text-sm text-[#5B6470]">
          Need help? Call our Enterprise Team: 1-800-555-0123
        </p>

        <Button 
          onClick={() => setCurrentStep(registrationMethod === 'phone' ? 1.1 : 1.2)}
          disabled={!registrationMethod}
          className="ov-btn ov-btn-ink w-full h-12"
        >
          Continue
        </Button>
      </div>
    );
  };

  const renderPhoneVerification = () => {
    if (currentStep === 1.1) {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="ov-display text-xl">Enter Your Corporate Mobile Number</h3>
            <p className="font-poppins text-sm text-[#5B6470]">Enter your corporate mobile number to receive an OTP.</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center border border-[#E7E3DC] rounded-lg focus-within:border-[#0E32E8] focus-within:ring-2 focus-within:ring-[#0E32E8]/15">
                <div className="flex items-center px-3 py-3 border-r border-[#E7E3DC]">
                  <span className="ov-num text-[#3E3F46]">+1</span>
                </div>
                <Input
                  placeholder="Enter mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-0 rounded-none rounded-r-lg focus-visible:ring-0 font-poppins ov-num placeholder:text-[#A9A29A]"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Select>
                <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procurement-manager">Procurement Manager</SelectItem>
                  <SelectItem value="logistics-head">Logistics Head</SelectItem>
                  <SelectItem value="operations-manager">Operations Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-poppins text-sm font-medium text-[#3E3F46]">Are you authorized to make procurement decisions?</Label>
              <RadioGroup defaultValue="" className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="auth-yes" />
                  <Label htmlFor="auth-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="auth-no" />
                  <Label htmlFor="auth-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              onClick={handlePhoneSubmit}
              disabled={phoneNumber.length !== 10}
              className="ov-btn ov-btn-ink w-full h-12"
            >
              Send OTP
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="ov-display text-xl">Enter OTP</h3>
          <p className="font-poppins text-sm text-[#5B6470]">We have sent a 6-digit code to +1 {phoneNumber}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="gap-2"
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot 
                    key={i} 
                    index={i}
                    className="ov-num w-12 h-12 border border-[#E7E3DC] rounded-lg text-center text-lg focus:border-[#0E32E8]"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <div className="text-center">
            {countdown > 0 ? (
              <p className="font-poppins text-sm text-[#5B6470]">Resend in <span className="ov-num">{countdown}s</span></p>
            ) : (
              <button className="font-poppins text-sm text-[#0E32E8] hover:underline">
                Resend OTP
              </button>
            )}
          </div>
          
          <Button 
            onClick={handleOtpVerify}
            disabled={otp.length !== 6}
            className="ov-btn ov-btn-ink w-full h-12"
          >
            Verify & Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderEmailVerification = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="ov-display text-xl">Enter Your Corporate Email</h3>
          <p className="font-poppins text-sm text-[#5B6470]">Enter your corporate email to receive a secure verification link.</p>
        </div>
        
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
          />

          <Input
            placeholder="Procurement Manager, Logistics Head, etc."
            className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
          />

          <Select>
            <SelectTrigger className="h-12 border-gray-300 rounded-xl">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="procurement">Procurement</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleEmailSubmit}
            disabled={!email || !email.includes('@')}
            className="ov-btn ov-btn-ink w-full h-12"
          >
            Send Verification Email
          </Button>

          {email && email.includes('@') && (
            <p className="font-poppins text-sm text-[#5B6470] text-center">
              Verification email sent to {email}. Link expires in 24 hrs.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderRegistrationForm = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="ov-display text-xl">Business Registration</h3>
          <p className="font-poppins text-sm text-[#5B6470]">Complete your corporate profile to access our platform.</p>
        </div>

        <div className="space-y-6">
          {/* Operator Details */}
          <div className="space-y-4">
            <h4 className="ov-display text-lg">Operator Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
              />
              <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
              />
            </div>
            <Input
              placeholder="Designation / Role"
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
            />
            <Select onValueChange={(value) => setFormData({...formData, department: value})}>
              <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h4 className="ov-display text-lg">Company Details</h4>
            <Input
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select onValueChange={(value) => setFormData({...formData, companyType: value})}>
                <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                  <SelectValue placeholder="Company Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mnc">MNC</SelectItem>
                  <SelectItem value="sme">SME</SelectItem>
                  <SelectItem value="msme">MSME</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setFormData({...formData, industrySector: value})}>
                <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                  <SelectValue placeholder="Industry Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="pharma">Pharma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Company Address"
              value={formData.companyAddress}
              onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
              className="border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
            />
            <Input
              placeholder="EIN"
              value={formData.gstNumber}
              onChange={(e) => setFormData({...formData, gstNumber: e.target.value.toUpperCase()})}
              className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
            />
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h4 className="ov-display text-lg">Financial Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="EIN"
                value={formData.panNumber}
                onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                className="h-12 border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
              />
              <Select onValueChange={(value) => setFormData({...formData, annualTurnover: value})}>
                <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                  <SelectValue placeholder="Annual Turnover" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50l">Under $500K</SelectItem>
                  <SelectItem value="50l-5cr">$500K - $5M</SelectItem>
                  <SelectItem value="over-5cr">Over $5M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Operational Details */}
          <div className="space-y-4">
            <h4 className="ov-display text-lg">Operational Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select onValueChange={(value) => setFormData({...formData, monthlyBudget: value})}>
                <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                  <SelectValue placeholder="Monthly Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1l">Under $10K</SelectItem>
                  <SelectItem value="1l-5l">$10K - $50K</SelectItem>
                  <SelectItem value="over-5l">Over $50K</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setFormData({...formData, shipmentVolume: value})}>
                <SelectTrigger className="h-12 border-[#E7E3DC] rounded-lg">
                  <SelectValue placeholder="Volume of Shipments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5">Under 5 loads</SelectItem>
                  <SelectItem value="5-20">5 - 20 loads</SelectItem>
                  <SelectItem value="over-20">Over 20 loads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="font-poppins text-sm text-[#3E3F46]">
              I agree to the <span className="text-[#0E32E8]">Terms & Conditions</span>
            </Label>
          </div>

          <Button 
            onClick={() => setCurrentStep(3)}
            className="ov-btn ov-btn-ink w-full h-12"
          >
            Submit Registration
          </Button>
        </div>
      </div>
    );
  };

  const renderVerificationDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="ov-tick w-20 h-20 rounded-full">
            <Clock className="w-10 h-10 text-[#0E32E8]" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="ov-display text-xl">Verification in Progress</h3>
            <p className="font-poppins text-sm text-[#5B6470] mt-2">
              We are verifying your documents. Expect updates in 3 to 5 business days.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Driver's License Verification", status: 'completed' },
            { label: 'EIN Verification', status: 'completed' },
            { label: 'Sales Tax ID Verification', status: 'in-progress' },
            { label: 'Verification Call', status: 'pending' },
            { label: 'Bank Account Verification', status: 'pending' },
            { label: 'Background & Credit Check', status: 'pending' }
          ].map((step, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-[#FBFAF8] rounded-lg">
              <div className="flex-shrink-0">
                {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-[#0F7A4A]" strokeWidth={1.8} />}
                {step.status === 'in-progress' && <div className="w-5 h-5 border-2 border-[#0E32E8] border-t-transparent rounded-full animate-spin" />}
                {step.status === 'pending' && <div className="w-5 h-5 border-2 border-[#E7E3DC] rounded-full" />}
              </div>
              <span className="font-poppins text-sm text-[#3E3F46]">{step.label}</span>
            </div>
          ))}
        </div>

        <p className="text-center font-poppins text-sm text-[#5B6470]">
          Need help? Email support@overland.com or call 1-800-555-0199
        </p>

        <Button 
          onClick={onRegistrationSuccess}
          className="ov-btn ov-btn-ink w-full h-12"
        >
          Continue to Dashboard
        </Button>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderMethodSelection();
      case 1.1:
      case 1.5:
        return renderPhoneVerification();
      case 1.2:
        return renderEmailVerification();
      case 2:
        return renderRegistrationForm();
      case 3:
        return renderVerificationDashboard();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-[#E7E3DC] rounded-[20px]">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="ov-display text-2xl text-center">
              Corporate Registration
            </DialogTitle>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`ov-num w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.completed ? 'bg-[#0E32E8] text-white' :
                      currentStep === step.number ? 'border border-[#0E32E8] bg-white text-[#0E32E8]' :
                      'border border-[#E7E3DC] bg-white text-[#A9A29A]'
                    }`}>
                      {step.completed ? <CheckCircle className="w-5 h-5" strokeWidth={1.8} /> : step.number}
                    </div>
                    <span className="font-poppins text-xs text-[#5B6470] mt-1">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      step.completed ? 'bg-[#0E32E8]' : 'bg-[#E7E3DC]'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <Progress value={progressValue} className="h-1" />
          </div>

          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorporateRegistrationModal;
