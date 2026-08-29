
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TruckFormData } from '@/types/truck';
import { X, Truck, MapPin, Phone, Fuel, Shield, Star } from 'lucide-react';

interface TruckPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: TruckFormData;
}

const TruckPreviewModal = ({ isOpen, onClose, formData }: TruckPreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="ov-display text-2xl">Truck Preview</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" strokeWidth={1.8} />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-xl p-6 text-white" style={{ background: '#111217' }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="ov-num text-2xl font-semibold">{formData.truckNumber || 'TRUCK-NUMBER'}</h3>
                <p className="mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{formData.truckType || 'Truck Type'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Truck className="w-6 h-6" strokeWidth={1.8} />
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <div className="rounded-lg px-3 py-1" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <span className="text-sm font-medium"><span className="ov-num">{formData.loadCapacity || '0'}</span> tons</span>
              </div>
              <div className="rounded-lg px-3 py-1" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <span className="text-sm font-medium">{formData.availabilityStatus?.replace('-', ' ') || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <h4 className="ov-display text-lg" style={{ color: '#14161A' }}>Basic Details</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Current Location</p>
                    <p className="font-medium" style={{ color: '#14161A' }}>{formData.currentLocation || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Model & Year</p>
                    <p className="font-medium" style={{ color: '#14161A' }}>
                      {formData.truckModel || 'Not specified'} 
                      {formData.truckYear && ` (${formData.truckYear})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Fuel className="w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Fuel Type</p>
                    <p className="font-medium" style={{ color: '#14161A' }}>{formData.fuelType || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Details */}
            <div className="space-y-4">
              <h4 className="ov-display text-lg" style={{ color: '#14161A' }}>Operational Details</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Driver Contact</p>
                    <p className="ov-num font-medium" style={{ color: '#14161A' }}>{formData.driverPhone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xl">$</span>
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Expected Advance</p>
                    <p className="ov-num font-medium" style={{ color: '#14161A' }}>
                      {formData.expectedAdvance ? `$${formData.expectedAdvance}` : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>GPS Tracking</p>
                    <p className="font-medium" style={{ color: '#14161A' }}>{formData.gpsTracker ? 'Available' : 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Preferences */}
          {formData.routePreferences && formData.routePreferences.length > 0 && (
            <div className="space-y-3">
              <h4 className="ov-display text-lg" style={{ color: '#14161A' }}>Route Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {formData.routePreferences.map((route, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg text-sm font-medium"
                    style={{ background: 'rgba(14,50,232,0.08)', color: '#0E32E8' }}
                  >
                    {route}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Features */}
          {formData.specialFeatures && formData.specialFeatures.length > 0 && (
            <div className="space-y-3">
              <h4 className="ov-display text-lg" style={{ color: '#14161A' }}>Special Features</h4>
              <div className="grid grid-cols-2 gap-2">
                {formData.specialFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                    style={{ background: '#FBFAF8', border: '1px solid #E7E3DC', color: '#14161A' }}
                  >
                    <Star className="w-4 h-4" style={{ color: '#0F7A4A' }} strokeWidth={1.8} />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t" style={{ borderColor: '#ECE8E1' }}>
            <button type="button" className="ov-btn ov-btn-outline" onClick={onClose}>
              Edit Details
            </button>
            <button type="button" className="ov-btn ov-btn-ink">
              Confirm & Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TruckPreviewModal;
