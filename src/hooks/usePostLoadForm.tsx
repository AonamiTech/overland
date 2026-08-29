
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const usePostLoadForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    loadId: `LD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    loadType: '',
    pickupLocation: '',
    deliveryLocation: '',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    cargoDescription: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    cargoValue: '',
    insuranceRequired: true,
    truckType: '',
    specialRequirements: [] as string[],
    budgetMin: '',
    budgetMax: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    department: '',
    costCenter: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.loadId) newErrors.loadId = 'Load ID is required';
        if (!formData.loadType) newErrors.loadType = 'Load type is required';
        break;
      case 2:
        if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
        if (!formData.deliveryLocation) newErrors.deliveryLocation = 'Delivery location is required';
        if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
        if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
        break;
      case 3:
        if (!formData.cargoDescription) newErrors.cargoDescription = 'Cargo description is required';
        if (!formData.weight) newErrors.weight = 'Weight is required';
        if (!formData.cargoValue) newErrors.cargoValue = 'Cargo value is required';
        break;
      case 4:
        if (!formData.truckType) newErrors.truckType = 'Truck type is required';
        break;
      case 5:
        if (!formData.contactName) newErrors.contactName = 'Contact name is required';
        if (!formData.contactPhone) newErrors.contactPhone = 'Contact phone is required';
        if (!formData.budgetMin) newErrors.budgetMin = 'Minimum budget is required';
        if (!formData.budgetMax) newErrors.budgetMax = 'Maximum budget is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      if (newErrors[key]) delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const saveAsDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your load has been saved as a draft",
    });
  };

  const saveAsTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Load template saved for future use",
    });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: `✅ Load ${formData.loadId} posted successfully! You'll start receiving bids within 12 minutes.`,
      });
      
      navigate('/broker-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post load. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    currentStep,
    setCurrentStep,
    handleSubmit,
    updateFormData,
    saveAsDraft,
    saveAsTemplate,
    validateCurrentStep
  };
};
