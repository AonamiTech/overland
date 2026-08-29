
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Shield, Package, Truck, Check, Download, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface InsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'cargo' | 'vehicle' | null;
}

const InsuranceModal = ({ isOpen, onClose, initialType }: InsuranceModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'cargo' | 'vehicle' | null>(initialType);
  const [formData, setFormData] = useState({
    cargoValue: '',
    origin: '',
    destination: '',
    pickupDate: '',
    vehicleMake: '',
    vehicleYear: '',
    regNo: '',
    selectedPlan: ''
  });
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { number: 1, label: 'Type' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Cover' },
    { number: 4, label: 'Review' }
  ];

  const calculatePremium = () => {
    if (selectedType === 'cargo') {
      const value = parseInt(formData.cargoValue) || 0;
      return Math.floor(value * 0.02);
    } else {
      const year = parseInt(formData.vehicleYear) || 2020;
      const age = new Date().getFullYear() - year;
      return Math.floor(3500 + (age * 150));
    }
  };

  const handleTypeSelect = (type: 'cargo' | 'vehicle') => {
    setSelectedType(type);
    setCurrentStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  if (!isOpen) return null;

  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="max-w-md mx-auto p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold font-sf-pro text-truck-black mb-4">
            Your Policy Is Active!
          </h2>
          <p className="text-gray-600 font-poppins mb-8">
            Your insurance coverage is now in effect. You can access your policy documents anytime.
          </p>
          <div className="space-y-4">
            <Button variant="outline" className="w-full border-truck-red text-truck-red hover:bg-truck-red hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Download Policy
            </Button>
            <Button className="w-full bg-truck-red hover:bg-red-600 text-white" onClick={onClose}>
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold font-sf-pro text-truck-black">
                Protect Your Cargo & Fleet
              </h2>
              <p className="text-lg text-gray-600 font-poppins">
                Comprehensive insurance solutions for worry-free transportation
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between max-w-md">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.number < currentStep ? 'bg-truck-red text-white' :
                  step.number === currentStep ? 'border-2 border-truck-red text-truck-red bg-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <span className="ml-2 text-sm font-poppins text-gray-600">{step.label}</span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step.number < currentStep ? 'bg-truck-red' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedType === 'cargo' ? 'border-truck-red bg-truck-red/5' : ''
              }`} onClick={() => handleTypeSelect('cargo')}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-truck-red/10 rounded-full flex items-center justify-center mr-4">
                    <Package className="w-8 h-8 text-truck-red" />
                  </div>
                  <h3 className="text-xl font-semibold font-sf-pro text-truck-black">
                    In-Transit Goods
                  </h3>
                </div>
                <p className="text-gray-600 font-poppins mb-4">
                  Protect your shipment's value from pickup to delivery coast to coast.
                </p>
                <Button className="w-full bg-truck-red hover:bg-red-600 text-white">
                  Get a Quote →
                </Button>
              </Card>

              <Card className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedType === 'vehicle' ? 'border-truck-red bg-truck-red/5' : ''
              }`} onClick={() => handleTypeSelect('vehicle')}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-truck-red/10 rounded-full flex items-center justify-center mr-4">
                    <Truck className="w-8 h-8 text-truck-red" />
                  </div>
                  <h3 className="text-xl font-semibold font-sf-pro text-truck-black">
                    Fleet & Vehicle Cover
                  </h3>
                </div>
                <p className="text-gray-600 font-poppins mb-4">
                  Safeguard your trucks against damage, theft & natural hazards.
                </p>
                <Button className="w-full bg-truck-red hover:bg-red-600 text-white">
                  Get a Quote →
                </Button>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold font-sf-pro text-truck-black mb-6">
                  {selectedType === 'cargo' ? 'Cargo Details' : 'Vehicle Details'}
                </h3>
                <div className="space-y-4">
                  {selectedType === 'cargo' ? (
                    <>
                      <div>
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          value={formData.origin}
                          onChange={(e) => handleInputChange('origin', e.target.value)}
                          placeholder="Enter pickup location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          value={formData.destination}
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          placeholder="Enter delivery location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickupDate">Pickup Date</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cargoValue">Cargo Value ($)</Label>
                        <Input
                          id="cargoValue"
                          type="number"
                          value={formData.cargoValue}
                          onChange={(e) => handleInputChange('cargoValue', e.target.value)}
                          placeholder="Enter value of goods"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="vehicleMake">Make/Model</Label>
                        <Input
                          id="vehicleMake"
                          value={formData.vehicleMake}
                          onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                          placeholder="e.g., Freightliner Cascadia"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleYear">Year of Manufacture</Label>
                        <Input
                          id="vehicleYear"
                          type="number"
                          value={formData.vehicleYear}
                          onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                          placeholder="e.g., 2020"
                        />
                      </div>
                      <div>
                        <Label htmlFor="regNo">Plate / USDOT Number</Label>
                        <Input
                          id="regNo"
                          value={formData.regNo}
                          onChange={(e) => handleInputChange('regNo', e.target.value)}
                          placeholder="e.g., TX 48291 / USDOT 1234567"
                        />
                      </div>
                    </>
                  )}
                </div>
                <Button 
                  className="w-full bg-truck-red hover:bg-red-600 text-white mt-6"
                  onClick={() => setCurrentStep(3)}
                >
                  Next: Select Cover →
                </Button>
              </Card>

              <Card className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold font-sf-pro text-truck-black mb-4">
                  Quote Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-poppins text-gray-600">Coverage Type:</span>
                    <span className="font-poppins font-medium">
                      {selectedType === 'cargo' ? 'In-Transit Goods' : 'Vehicle Insurance'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-poppins text-gray-600">Base Premium:</span>
                    <span className="font-poppins font-medium">${calculatePremium().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-poppins text-gray-600">Sales Tax (8%):</span>
                    <span className="font-poppins font-medium">${Math.floor(calculatePremium() * 0.08).toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-sf-pro font-semibold text-truck-black">Total:</span>
                    <span className="font-sf-pro font-semibold text-truck-red">
                      ${Math.floor(calculatePremium() * 1.08).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-semibold font-sf-pro text-truck-black mb-6">
                Choose Your Coverage Plan
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {['Basic', 'Standard', 'Premium'].map((plan) => (
                  <Card key={plan} className={`p-6 cursor-pointer transition-all duration-300 ${
                    formData.selectedPlan === plan ? 'border-truck-red bg-truck-red/5' : 'hover:shadow-lg'
                  }`} onClick={() => handleInputChange('selectedPlan', plan)}>
                    <h4 className="text-xl font-semibold font-sf-pro text-truck-black mb-2">{plan}</h4>
                    <div className="text-2xl font-bold font-sf-pro text-truck-red mb-4">
                      ${Math.floor(calculatePremium() * (plan === 'Basic' ? 0.8 : plan === 'Standard' ? 1 : 1.3) * 1.08).toLocaleString()}
                    </div>
                    <ul className="space-y-2 text-sm font-poppins text-gray-600">
                      <li>• Theft and damage protection</li>
                      <li>• 24/7 claim support</li>
                      {plan !== 'Basic' && <li>• Emergency roadside assistance</li>}
                      {plan === 'Premium' && <li>• Priority claim processing</li>}
                    </ul>
                  </Card>
                ))}
              </div>
              <Button 
                className="w-full bg-truck-red hover:bg-red-600 text-white mt-8"
                onClick={() => setCurrentStep(4)}
                disabled={!formData.selectedPlan}
              >
                Review Details
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold font-sf-pro text-truck-black">
                Review & Payment
              </h3>
              
              <Card className="p-6">
                <h4 className="text-lg font-semibold font-sf-pro text-truck-black mb-4">Policy Summary</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm font-poppins">
                  <div>
                    <span className="text-gray-600">Coverage Type:</span>
                    <span className="ml-2 font-medium">
                      {selectedType === 'cargo' ? 'In-Transit Goods' : 'Vehicle Insurance'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Plan:</span>
                    <span className="ml-2 font-medium">{formData.selectedPlan}</span>
                  </div>
                  {selectedType === 'cargo' && (
                    <>
                      <div>
                        <span className="text-gray-600">Route:</span>
                        <span className="ml-2 font-medium">{formData.origin} → {formData.destination}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Cargo Value:</span>
                        <span className="ml-2 font-medium">${parseInt(formData.cargoValue || '0').toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {selectedType === 'vehicle' && (
                    <>
                      <div>
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="ml-2 font-medium">{formData.vehicleMake}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Plate / USDOT:</span>
                        <span className="ml-2 font-medium">{formData.regNo}</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold font-sf-pro text-truck-black mb-4">Payment</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-sf-pro font-semibold text-truck-black">Total Due:</span>
                  <span className="text-2xl font-sf-pro font-bold text-truck-red">
                    ${Math.floor(calculatePremium() * (formData.selectedPlan === 'Basic' ? 0.8 : formData.selectedPlan === 'Standard' ? 1 : 1.3) * 1.08).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="font-poppins text-sm">I agree to the terms and conditions and sign digitally</span>
                  </label>
                  <Button 
                    className="w-full bg-truck-red hover:bg-red-600 text-white h-12"
                    onClick={handleComplete}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay & Activate Coverage
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsuranceModal;
