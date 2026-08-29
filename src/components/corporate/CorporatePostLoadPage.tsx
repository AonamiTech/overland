
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '../DashboardLayout';
import { ClipboardList, MapPin, Calendar, Truck, Shield, Save, Eye, Send } from 'lucide-react';

const CorporatePostLoadPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Load Posted Successfully",
        description: "Load posted. RFQ LD-TS-2024-001",
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <DashboardLayout
      userRole="corporate"
      userName="Sarah Mitchell"
      userId="CC12345678"
      isVerified={false}
      verificationStatus="pending"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Dashboard &gt; Post Load</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="ov-eyebrow"><span className="dot" />Post Load</div>
        <h1 className="ov-display text-3xl mb-2 flex items-center gap-3" style={{ color: '#14161A' }}>
          <ClipboardList className="w-7 h-7" style={{ color: '#0E32E8' }} />
          Post Your Load
        </h1>
      </div>

      {/* Load Posting Form */}
      <Card className="ov-card">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Load Details */}
            <div className="space-y-6">
              <h3 className="ov-display text-lg pb-2 border-b" style={{ color: '#14161A', borderColor: '#ECE8E1' }}>Load Details</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Load Reference ID</label>
                  <div className="flex space-x-2">
                    <Input placeholder="LD-TS-2024-001" className="flex-1" />
                    <Button type="button" variant="outline" size="sm">
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Custom
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      Auto-generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Load Type*</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="loadType" value="full" defaultChecked style={{ accentColor: '#0E32E8' }} />
                      <span className="flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        FULL Load (Complete truck booking)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="loadType" value="part" style={{ accentColor: '#0E32E8' }} />
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        LTL (Shared truck space)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Pickup Location*</label>
                  <div className="flex space-x-2">
                    <Input placeholder="Cicero, Chicago" className="flex-1" />
                    <Button type="button" variant="outline" size="sm">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Delivery Location*</label>
                  <div className="flex space-x-2">
                    <Input placeholder="Delivery location" className="flex-1" />
                    <Button type="button" variant="outline" size="sm">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button type="button" variant="link" className="text-sm p-0" style={{ color: '#0E32E8' }}>
                    + Add multiple stops
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Pickup Date & Time*</label>
                  <div className="flex space-x-2">
                    <Input type="datetime-local" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="flexible" />
                    <label htmlFor="flexible" className="text-sm" style={{ color: '#3E3F46' }}>Flexible timing</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Delivery Date & Time*</label>
                  <div className="flex space-x-2">
                    <Input type="datetime-local" className="flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="deadline" />
                    <label htmlFor="deadline" className="text-sm" style={{ color: '#3E3F46' }}>Fixed deadline</label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Cargo Description*</label>
                <Textarea 
                  placeholder="IT Equipment – Servers, networking hardware" 
                  className="resize-none"
                  maxLength={200}
                />
                <p className="text-xs ov-num" style={{ color: '#A9A29A' }}>Character limit: 200</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Weight & Dimensions</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <Input placeholder="Weight (kg)" />
                    <Input placeholder="Length (m)" />
                    <Input placeholder="Width (m)" />
                    <Input placeholder="Height (m)" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide flex items-center" style={{ color: '#5B6470' }}>
                    Cargo Value (for insurance)
                    <Shield className="w-4 h-4 ml-2" style={{ color: '#A9A29A' }} />
                  </label>
                  <Input placeholder="$500,000" />
                  <p className="text-xs" style={{ color: '#A9A29A' }}>Affects insurance premium</p>
                </div>
              </div>
            </div>

            {/* Section 2: Requirements & Commercial */}
            <div className="space-y-6">
              <h3 className="ov-display text-lg pb-2 border-b" style={{ color: '#14161A', borderColor: '#ECE8E1' }}>Requirements & Commercial</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Vehicle Requirements*</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="large">
                        <span className="flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Large Covered Truck (16+ tons)
                        </span>
                      </SelectItem>
                      <SelectItem value="medium">Medium (7.5–16T)</SelectItem>
                      <SelectItem value="small">Small (3–7.5T)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Special Requirements</label>
                  <div className="space-y-2">
                    {[
                      { id: 'gps', label: 'GPS tracking mandatory', checked: true },
                      { id: 'verified', label: 'Verified driver only', checked: true },
                      { id: 'loading', label: 'Loading assistance', checked: false },
                      { id: 'temp', label: 'Temperature controlled', checked: false },
                      { id: 'security', label: '24/7 security escort', checked: false },
                      { id: 'multiple', label: 'Multiple pickup points', checked: false }
                    ].map((req) => (
                      <div key={req.id} className="flex items-center space-x-2">
                        <Checkbox id={req.id} defaultChecked={req.checked} />
                        <label htmlFor={req.id} className="text-sm" style={{ color: '#3E3F46' }}>{req.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Budget Range (Guide for bidders)</label>
                  <div className="flex space-x-2">
                    <Input placeholder="$2,800" />
                    <span className="flex items-center" style={{ color: '#5B6470' }}>to</span>
                    <Input placeholder="$3,400" />
                  </div>
                  <p className="text-xs ov-num" style={{ color: '#A9A29A' }}>Market rate: $2,900–3,200</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Department & Cost Center</label>
                  <div className="space-y-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT Operations</SelectItem>
                        <SelectItem value="supply">Supply Chain</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cost center" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cc1">CC-IT-001</SelectItem>
                        <SelectItem value="cc2">CC-SCM-002</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Contact Person for Coordination*</label>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Input placeholder="Tom Harris" />
                  <Input placeholder="(312) 555-0163" />
                  <Input placeholder="tom.harris@techsolutions.com" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t" style={{ borderColor: '#ECE8E1' }}>
              <div className="flex space-x-4">
                <Button type="button" variant="outline" className="ov-btn ov-btn-outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
                <Button type="button" variant="secondary" className="ov-btn ov-btn-ghost">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button type="button" variant="outline" className="ov-btn ov-btn-outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="ov-btn ov-btn-ink min-w-32"
              >
                {isSubmitting ? (
                  'Posting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post for Bidding
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CorporatePostLoadPage;
