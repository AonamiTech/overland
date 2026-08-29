
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TruckFormData, TruckFormErrors, truckTypes } from '@/types/truck';
import { Upload, MapPin, Check, X, Calendar } from 'lucide-react';

interface TruckDetailsSectionProps {
  formData: TruckFormData;
  errors: TruckFormErrors;
  onUpdate: (updates: Partial<TruckFormData>) => void;
}

const TruckDetailsSection = ({ formData, errors, onUpdate }: TruckDetailsSectionProps) => {
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleValidateTruck = () => {
    setValidationStatus('validating');
    // Simulate validation
    setTimeout(() => {
      setValidationStatus(Math.random() > 0.5 ? 'valid' : 'invalid');
    }, 1500);
  };

  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onUpdate({ currentLocation: `${position.coords.latitude}, ${position.coords.longitude}` });
        },
        () => {
          alert('Location access denied');
        }
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Truck Number */}
        <div className="space-y-2">
          <Label htmlFor="truckNumber" className="text-sm font-semibold"
            style={{ color: '#14161A' }}>
            Truck Number *
          </Label>
          <div className="flex space-x-2">
            <Input
              id="truckNumber"
              placeholder="GJ-01-AB-1234"
              value={formData.truckNumber}
              onChange={(e) => onUpdate({ truckNumber: e.target.value.toUpperCase() })}
              className={`flex-1 h-11 ${errors.truckNumber ? 'border-red-500 focus:border-red-500' : 'border-[#E7E3DC]'}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleValidateTruck}
              disabled={!formData.truckNumber || validationStatus === 'validating'}
              className="px-6 h-11 border-[#E7E3DC] hover:border-blue-300 hover:bg-blue-50"
            >
              {validationStatus === 'validating' ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : validationStatus === 'valid' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : validationStatus === 'invalid' ? (
                <X className="w-4 h-4 text-red-500" />
              ) : (
                'Validate'
              )}
            </Button>
          </div>
          {errors.truckNumber && <p className="text-xs text-red-500">{errors.truckNumber}</p>}
          {validationStatus === 'valid' && (
            <p className="text-xs text-green-600 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Truck number is valid and available</span>
            </p>
          )}
        </div>

        {/* Truck Type */}
        <div className="space-y-2">
          <Label htmlFor="truckType" className="text-sm font-semibold"
            style={{ color: '#14161A' }}>
            Truck Type *
          </Label>
          <Select value={formData.truckType} onValueChange={(value) => onUpdate({ truckType: value })}>
            <SelectTrigger className={`h-11 ${errors.truckType ? 'border-red-500' : 'border-[#E7E3DC]'}`}>
              <SelectValue placeholder="Select truck type" />
            </SelectTrigger>
            <SelectContent>
              {truckTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.truckType && <p className="text-xs text-red-500">{errors.truckType}</p>}
        </div>

        {/* Load Capacity */}
        <div className="space-y-2">
          <Label htmlFor="loadCapacity" className="text-sm font-semibold"
            style={{ color: '#14161A' }}>
            Load Capacity *
          </Label>
          <div className="relative">
            <Input
              id="loadCapacity"
              type="number"
              placeholder="5.5"
              value={formData.loadCapacity}
              onChange={(e) => onUpdate({ loadCapacity: e.target.value })}
              className={`h-11 pr-12 ${errors.loadCapacity ? 'border-red-500 focus:border-red-500' : 'border-[#E7E3DC]'}`}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
              tons
            </span>
          </div>
          {errors.loadCapacity && <p className="text-xs text-red-500">{errors.loadCapacity}</p>}
        </div>

        {/* Truck Model */}
        <div className="space-y-2">
          <Label htmlFor="truckModel" className="text-sm font-semibold"
            style={{ color: '#14161A' }}>
            Truck Model
          </Label>
          <Input
            id="truckModel"
            placeholder="Tata 1618"
            value={formData.truckModel}
            onChange={(e) => onUpdate({ truckModel: e.target.value })}
            className="h-11 border-[#E7E3DC]"
          />
          <p className="text-xs text-gray-500">Auto-suggestions based on truck type</p>
        </div>

        {/* Truck Year */}
        <div className="space-y-2">
          <Label htmlFor="truckYear" className="text-sm font-semibold"
            style={{ color: '#14161A' }}>
            Manufacturing Year
          </Label>
          <div className="relative">
            <Input
              id="truckYear"
              type="number"
              placeholder="2019"
              min="1990"
              max={new Date().getFullYear()}
              value={formData.truckYear}
              onChange={(e) => onUpdate({ truckYear: e.target.value })}
              className="h-11 pr-10 border-[#E7E3DC]"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Current Location */}
        <div className="space-y-2">
          <Label htmlFor="currentLocation" className="text-sm font-semibold"
            style={{ color: '#14161A' }}>
            Current Location *
          </Label>
          <div className="flex space-x-2">
            <Input
              id="currentLocation"
              placeholder="Enter location manually"
              value={formData.currentLocation}
              onChange={(e) => onUpdate({ currentLocation: e.target.value })}
              className={`flex-1 h-11 ${errors.currentLocation ? 'border-red-500 focus:border-red-500' : 'border-[#E7E3DC]'}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGPSLocation}
              className="px-4 h-11 border-[#E7E3DC] hover:border-green-300 hover:bg-green-50"
            >
              <MapPin className="w-4 h-4 text-green-600" />
            </Button>
          </div>
          {errors.currentLocation && <p className="text-xs text-red-500">{errors.currentLocation}</p>}
          <p className="text-xs text-gray-500">Click GPS icon for auto-detection</p>
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold"
            style={{ color: '#14161A' }}>Upload Truck Photos (Optional)</Label>
        <div className="border-2 border-dashed border-[#E7E3DC] rounded-xl p-8 text-center hover:border-[#0E32E8] hover:bg-[#FBFAF8] transition-colors duration-200 cursor-pointer">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(14,50,232,0.08)' }}>
              <Upload className="w-8 h-8" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-lg font-medium" style={{ color: '#14161A' }}>Drag and drop photos here</p>
              <p className="text-sm mt-1" style={{ color: '#5B6470' }}>or click to browse files</p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs" style={{ color: '#A9A29A' }}>
              <span>• Up to 4 photos</span>
              <span>• Max 5MB each</span>
              <span>• JPG, PNG formats</span>
            </div>
          </div>
        </div>
        
        {/* Photo Preview Grid */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Truck photo ${index + 1}`} 
                  className="w-full h-24 object-cover rounded-lg border border-[#E7E3DC]"
                />
                <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability Status */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold"
            style={{ color: '#14161A' }}>Availability Status *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'available-now', label: 'Available Now', dot: '#0F7A4A', description: 'Ready for immediate booking' },
            { id: 'available-from', label: 'Available From', dot: '#0E32E8', description: 'Available from specific date' },
            { id: 'not-available', label: 'Not Available', dot: '#A8412F', description: 'Currently unavailable' }
          ].map((option) => (
            <label
              key={option.id}
              className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200"
              style={
                formData.availabilityStatus === option.id
                  ? { borderColor: '#0E32E8', background: 'rgba(14,50,232,0.06)' }
                  : { borderColor: '#E7E3DC' }
              }
            >
              <input
                type="radio"
                name="availability"
                value={option.id}
                checked={formData.availabilityStatus === option.id}
                onChange={(e) => onUpdate({ availabilityStatus: e.target.value as any })}
                className="sr-only"
              />
              <div className="flex items-start space-x-3">
                <span className="w-2.5 h-2.5 rounded-full mt-1.5" style={{ background: option.dot }}></span>
                <div>
                  <p className="font-semibold" style={{ color: '#14161A' }}>{option.label}</p>
                  <p className="text-xs" style={{ color: '#5B6470' }}>{option.description}</p>
                </div>
              </div>
              {formData.availabilityStatus === option.id && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TruckDetailsSection;
