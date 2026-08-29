
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Package, Scale, Ruler, DollarSign } from 'lucide-react';

interface CargoInfoStepProps {
  formData: any;
  errors: Record<string, string>;
  onUpdate: (updates: any) => void;
  onNext: () => void;
}

const CargoInfoStep = ({ formData, errors, onUpdate, onNext }: CargoInfoStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Package className="w-12 h-12 text-[#0E32E8] mx-auto" />
        <h2 className="ov-display text-2xl">Cargo Information</h2>
        <p className="text-[#5B6470]">Provide details about your cargo for accurate matching</p>
      </div>

      <div className="space-y-6">
        {/* Cargo Description */}
        <div className="space-y-3">
          <Label className="text-[#14161A] font-semibold">Cargo Description *</Label>
          <Textarea
            placeholder="e.g., FMCG boxes, electronics, raw materials..."
            value={formData.cargoDescription || ''}
            onChange={(e) => onUpdate({ cargoDescription: e.target.value })}
            className="h-24 resize-none bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
          />
          {errors.cargoDescription && <p className="text-sm text-[#A8412F]">{errors.cargoDescription}</p>}
        </div>

        {/* Weight and Dimensions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-[#14161A] font-semibold flex items-center space-x-2">
              <Scale className="w-4 h-4" />
              <span>Weight (lbs) *</span>
            </Label>
            <Input
              type="number"
              placeholder="Enter weight"
              value={formData.weight || ''}
              onChange={(e) => onUpdate({ weight: e.target.value })}
              className="h-12 bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
            />
            {errors.weight && <p className="text-sm text-[#A8412F]">{errors.weight}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-[#14161A] font-semibold flex items-center space-x-2">
              <Ruler className="w-4 h-4" />
              <span>Dimensions (L × W × H in feet)</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="L"
                value={formData.dimensions?.length || ''}
                onChange={(e) => onUpdate({
                  dimensions: { ...formData.dimensions, length: e.target.value }
                })}
                className="h-12 bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
              />
              <Input
                type="number"
                placeholder="W"
                value={formData.dimensions?.width || ''}
                onChange={(e) => onUpdate({
                  dimensions: { ...formData.dimensions, width: e.target.value }
                })}
                className="h-12 bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
              />
              <Input
                type="number"
                placeholder="H"
                value={formData.dimensions?.height || ''}
                onChange={(e) => onUpdate({
                  dimensions: { ...formData.dimensions, height: e.target.value }
                })}
                className="h-12 bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
              />
            </div>
          </div>
        </div>

        {/* Cargo Value */}
        <div className="space-y-3">
          <Label className="text-[#14161A] font-semibold flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Cargo Value ($)</span>
          </Label>
          <Input
            type="number"
            placeholder="Enter cargo value for insurance"
            value={formData.cargoValue || ''}
            onChange={(e) => onUpdate({ cargoValue: e.target.value })}
            className="h-12 bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
          />
          <p className="text-xs text-[#8B857C]">This helps us calculate insurance premium if needed</p>
          {errors.cargoValue && <p className="text-sm text-[#A8412F]">{errors.cargoValue}</p>}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!formData.cargoDescription || !formData.weight}
          className="bg-[#111217] hover:bg-black text-white px-8"
        >
          Continue to Vehicle Requirements
        </Button>
      </div>
    </div>
  );
};

export default CargoInfoStep;
