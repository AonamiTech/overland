
import React, { useState } from 'react';
import BrandLogo from '@/components/ui/BrandLogo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'broker' | 'fleet' | 'corporate') => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'broker' | 'fleet' | 'corporate'>('broker');
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  const handlePhoneSubmit = () => {
    if (phoneNumber.length === 10) {
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

  const handleEmailSubmit = () => {
    if (email.includes('@') && email.includes('.')) {
      // Simulate email verification sent
      alert('Verification link sent to your email!');
    }
  };

  const handleOtpVerify = () => {
    if (otp.length === 6) {
      onLoginSuccess(activeTab);
      onClose();
      
      // Navigate to appropriate dashboard based on role
      switch (activeTab) {
        case 'broker':
          navigate('/broker-dashboard');
          break;
        case 'fleet':
          navigate('/fleet-dashboard');
          break;
        case 'corporate':
          navigate('/corporate-dashboard');
          break;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetModal = () => {
    setStep('login');
    setPhoneNumber('');
    setEmail('');
    setOtp('');
    setCountdown(0);
    setIsEmailLogin(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md mx-auto bg-white border border-[#E7E3DC] rounded-[20px]" style={{
        borderRadius: '20px'
      }}>
        <div className="p-8">
          <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-6">
              <BrandLogo height={24} />
            </div>
            <DialogTitle className="ov-display text-2xl">
              {step === 'login' ? 'Login to Overland' : 'Verify your number'}
            </DialogTitle>
            {step === 'login' && (
              <p className="font-poppins text-sm text-[#5B6470] mt-2">
                Choose your method to continue
              </p>
            )}
          </DialogHeader>

          {step === 'login' && (
            <>
              {/* Role Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                {[
                  { key: 'broker', label: 'Broker' },
                  { key: 'fleet', label: 'Fleet Owner' },
                  { key: 'corporate', label: 'Corporate' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as 'broker' | 'fleet' | 'corporate');
                      setIsEmailLogin(tab.key === 'corporate');
                    }}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab.key
                        ? 'text-[#14161A]'
                        : 'text-[#5B6470] hover:text-[#14161A]'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E32E8]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {!isEmailLogin ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#3E3F46] mb-2">
                        Mobile Number
                      </label>
                      <div className="flex rounded-lg border border-[#E7E3DC] bg-white focus-within:border-[#0E32E8] focus-within:ring-2 focus-within:ring-[#0E32E8]/15">
                        <div className="flex items-center px-3 border-r border-[#E7E3DC]">
                          <span className="ov-num text-[#3E3F46] text-sm">+1</span>
                        </div>
                        <Input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="border-0 bg-transparent flex-1 focus-visible:ring-0 ov-num placeholder:text-[#A9A29A]"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handlePhoneSubmit}
                      disabled={phoneNumber.length !== 10}
                      className="ov-btn ov-btn-ink w-full h-12"
                    >
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#3E3F46] mb-2">
                        Corporate Email
                      </label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-white border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]"
                      />
                    </div>

                    <Button
                      onClick={handleEmailSubmit}
                      disabled={!email.includes('@') || !email.includes('.')}
                      className="ov-btn ov-btn-ink w-full h-12"
                    >
                      Send Verification Link
                    </Button>

                    <p className="text-center text-sm text-[#5B6470]">
                      Or{' '}
                      <button
                        onClick={() => setIsEmailLogin(false)}
                        className="text-[#0E32E8] hover:underline"
                      >
                        verify via phone instead
                      </button>
                    </p>
                  </>
                )}

                {!isEmailLogin && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#ECE8E1]" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-[#8B857C]">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="ov-btn ov-btn-outline h-12 rounded-lg"
                      >
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        className="ov-btn ov-btn-outline h-12 rounded-lg"
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <p className="text-center text-[#5B6470]">
                Enter the 6-digit OTP sent to <span className="ov-num text-[#14161A]">+1 {phoneNumber}</span>
              </p>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="ov-num w-10 h-10 border border-[#E7E3DC] rounded-lg text-center focus:border-[#0E32E8]"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-[#5B6470]">
                    Resend in <span className="ov-num">{formatTime(countdown)}</span>
                  </p>
                ) : (
                  <button className="text-sm text-[#0E32E8] hover:underline">
                    Resend SMS
                  </button>
                )}
              </div>

              <Button
                onClick={handleOtpVerify}
                disabled={otp.length !== 6}
                className="ov-btn ov-btn-ink w-full h-12"
              >
                Verify OTP
              </Button>

              <p className="text-center text-sm text-[#5B6470]">
                Didn't receive the code?{' '}
                <button className="text-[#0E32E8] hover:underline">Resend SMS</button>
                {' '}or{' '}
                <button className="text-[#0E32E8] hover:underline">Call Me</button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
