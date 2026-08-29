
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { TruckFormData, TruckFormErrors } from '@/types/truck';

export const usePostTruckForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<TruckFormData>({
    truckNumber: '',
    truckType: '',
    loadCapacity: '',
    truckModel: '',
    truckYear: '',
    currentLocation: '',
    availabilityStatus: 'available-now',
    driverPhone: '',
    expectedAdvance: '',
    routePreferences: [] as string[],
    fuelType: '',
    gpsTracker: false,
    specialFeatures: [] as string[]
  });

  const [errors, setErrors] = useState<TruckFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: TruckFormErrors = {};
    if (!formData.truckNumber) newErrors.truckNumber = 'Truck number is required';
    if (!formData.truckType) newErrors.truckType = 'Truck type is required';
    if (!formData.loadCapacity) newErrors.loadCapacity = 'Load capacity is required';
    if (!formData.currentLocation) newErrors.currentLocation = 'Current location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "✅ Truck posted successfully—Truck ID: TRK123456",
      });
      
      navigate('/fleet-dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post truck. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<TruckFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    updateFormData
  };
};
