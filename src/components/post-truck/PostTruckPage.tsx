
import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import TruckDetailsSection from './TruckDetailsSection';
import OperationalDetailsSection from './OperationalDetailsSection';
import PostTruckActions from './PostTruckActions';
import TruckPreviewModal from './TruckPreviewModal';
import { usePostTruckForm } from '@/hooks/usePostTruckForm';
import { ChevronDown, ChevronUp, Truck, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const PostTruckPage = () => {
  const { formData, errors, isSubmitting, handleSubmit, updateFormData } = usePostTruckForm();
  const [showPreview, setShowPreview] = useState(false);
  const [truckDetailsOpen, setTruckDetailsOpen] = useState(true);
  const [operationalDetailsOpen, setOperationalDetailsOpen] = useState(true);

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <DashboardLayout 
      userRole="fleet" 
      userName="Fleet Owner" 
      userId="FO123456" 
      isVerified={true}
    >
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <span className="ov-eyebrow"><span className="dot" />Post a Truck</span>
            <h1 className="ov-display text-4xl">Post Your Truck</h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5B6470' }}>
            List your truck for immediate bookings and connect with verified load providers nationwide
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Truck Details Section */}
          <Collapsible open={truckDetailsOpen} onOpenChange={setTruckDetailsOpen}>
            <Card className="ov-card overflow-hidden">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-[#FBFAF8] transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="ov-tick" style={{ width: 40, height: 40, borderRadius: 12 }}>
                        <Truck className="w-5 h-5" strokeWidth={1.8} />
                      </span>
                      <div className="text-left">
                        <CardTitle className="ov-display text-xl">Truck Details</CardTitle>
                        <p className="text-sm mt-1" style={{ color: '#5B6470' }}>Basic information about your truck</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F1EEE8' }}>
                      {truckDetailsOpen ? (
                        <ChevronUp className="w-4 h-4" style={{ color: '#5B6470' }} strokeWidth={1.8} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: '#5B6470' }} strokeWidth={1.8} />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <TruckDetailsSection 
                    formData={formData}
                    errors={errors}
                    onUpdate={updateFormData}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Operational Details Section */}
          <Collapsible open={operationalDetailsOpen} onOpenChange={setOperationalDetailsOpen}>
            <Card className="ov-card overflow-hidden">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-[#FBFAF8] transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="ov-tick" style={{ width: 40, height: 40, borderRadius: 12 }}>
                        <Settings className="w-5 h-5" strokeWidth={1.8} />
                      </span>
                      <div className="text-left">
                        <CardTitle className="ov-display text-xl">Operational Details</CardTitle>
                        <p className="text-sm mt-1" style={{ color: '#5B6470' }}>Driver info, routes, and special features</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F1EEE8' }}>
                      {operationalDetailsOpen ? (
                        <ChevronUp className="w-4 h-4" style={{ color: '#5B6470' }} strokeWidth={1.8} />
                      ) : (
                        <ChevronDown className="w-4 h-4" style={{ color: '#5B6470' }} strokeWidth={1.8} />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <OperationalDetailsSection 
                    formData={formData}
                    onUpdate={updateFormData}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Action Buttons */}
          <Card className="ov-card sticky bottom-6 z-10">
            <CardContent className="p-6">
              <PostTruckActions 
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onPreview={handlePreview}
              />
            </CardContent>
          </Card>
        </form>

        {/* Preview Modal */}
        <TruckPreviewModal 
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          formData={formData}
        />
      </div>
    </DashboardLayout>
  );
};

export default PostTruckPage;
