
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface BrokerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const BrokerLoginModal = ({ isOpen, onClose, onLoginSuccess }: BrokerLoginModalProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'registration'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    city: ''
  });

  const handlePhoneSubmit = () => {
    if (phoneNumber.length === 10) {
      // Simulate OTP send
      setCountdown(120);
      setStep('otp');
      const timer = setInterval(() => {
        setCountdown((prev) => {
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
      // Check if user exists (for demo, assume new user)
      setStep('registration');
    }
  };

  const handleRegistration = () => {
    if (formData.firstName && formData.lastName && formData.companyName && formData.city) {
      onLoginSuccess();
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-[#E7E3DC] rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="ov-display text-2xl">
            {step === 'phone' && 'Broker Login'}
            {step === 'otp' && 'Verify phone number'}
            {step === 'registration' && 'Welcome to Overland, Broker'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'phone' && (
            <>
              <p className="font-poppins text-[#5B6470]">
                New to our platform? We'll register you automatically.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 ov-num text-[#5B6470]">
                    +1
                  </span>
                  <Input
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 h-12 border border-[#E7E3DC] rounded-lg font-poppins ov-num focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={handlePhoneSubmit}
                  disabled={phoneNumber.length !== 10}
                  className="ov-btn ov-btn-ink w-full h-12"
                >
                  Send OTP
                </Button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <p className="font-poppins text-[#5B6470]">
                Enter the 6-digit code sent to <span className="ov-num text-[#14161A]">+1 {phoneNumber}</span>
              </p>
              <div className="space-y-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="justify-center"
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="ov-num w-12 h-12 border border-[#E7E3DC] focus:border-[#0E32E8]"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="font-poppins text-sm text-[#5B6470]">
                      Resend OTP in <span className="ov-num">{formatTime(countdown)}</span>
                    </p>
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
                  Verify
                </Button>
              </div>
            </>
          )}

          {step === 'registration' && (
            <>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="ov-num w-8 h-8 bg-[#0E32E8] text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <span className="font-poppins text-sm text-[#14161A]">Basic Info</span>
                </div>
                <div className="w-8 h-0.5 bg-[#E7E3DC]"></div>
                <div className="flex items-center space-x-2">
                  <div className="ov-num w-8 h-8 bg-[#F1EEE8] text-[#8B857C] rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <span className="font-poppins text-sm text-[#5B6470]">Verification</span>
                </div>
                <div className="w-8 h-0.5 bg-[#E7E3DC]"></div>
                <div className="flex items-center space-x-2">
                  <div className="ov-num w-8 h-8 bg-[#F1EEE8] text-[#8B857C] rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <span className="font-poppins text-sm text-[#5B6470]">Done</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="h-12 border border-[#E7E3DC] rounded-lg font-poppins focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                  />
                  <Input
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="h-12 border border-[#E7E3DC] rounded-lg font-poppins focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                  />
                </div>
                
                <Input
                  placeholder="Company Name *"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="h-12 border border-[#E7E3DC] rounded-lg font-poppins focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                />
                
                <Input
                  placeholder="Email Address (optional)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 border border-[#E7E3DC] rounded-lg font-poppins focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                />
                
                <Input
                  placeholder="City/Location *"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="h-12 border border-[#E7E3DC] rounded-lg font-poppins focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                />
                
                <Button
                  onClick={handleRegistration}
                  disabled={!formData.firstName || !formData.lastName || !formData.companyName || !formData.city}
                  className="ov-btn ov-btn-ink w-full h-12"
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerLoginModal;
