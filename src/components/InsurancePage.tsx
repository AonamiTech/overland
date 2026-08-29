import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

// Import components
import NotificationPanel from './insurance/NotificationPanel';
import ProfileDropdown from './insurance/ProfileDropdown';
import CoverageSelector from './insurance/CoverageSelector';
import ExternalBookingForm from './insurance/ExternalBookingForm';
import InsuranceHistory from './insurance/InsuranceHistory';
import WhyChoosePanel from './insurance/WhyChoosePanel';

// Import icons
import { 
  ShieldIcon, 
  InfoIcon, 
  CalendarIcon, 
  HelpCircleIcon,
  XIcon,
  FileTextIcon
} from './insurance/InsuranceIcons';

const InsurancePage = () => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Determine user role based on navigation state or URL context
  const getUserRole = () => {
    console.log('Location state:', location.state); // Debug log
    console.log('Current pathname:', location.pathname); // Debug log
    console.log('Document referrer:', document.referrer); // Debug log
    
    // Check if userRole was passed in navigation state
    if (location.state?.userRole === 'fleet') {
      return 'fleet';
    }
    
    // Check if coming from fleet dashboard via referrer
    if (document.referrer.includes('/fleet-dashboard')) {
      return 'fleet';
    }
    
    // Check URL parameters or other context indicators
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'fleet') {
      return 'fleet';
    }
    
    return 'broker'; // default to broker for backward compatibility
  };

  const userRole = getUserRole();
  console.log('Determined user role:', userRole); // Debug log
  
  const [activeTab, setActiveTab] = useState('platform');
  const [selectedCoverage, setSelectedCoverage] = useState('');
  const [estimatedPremium, setEstimatedPremium] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [enableClaimSupport, setEnableClaimSupport] = useState(false);

  const coverageOptions = [
    { 
      id: 'basic', 
      title: 'Basic',
      limit: 'up to $100K',
      premium: '250',
      icon: '',
      features: ['Theft protection', 'Damage coverage', 'Basic support']
    },
    { 
      id: 'standard', 
      title: 'Standard',
      limit: 'up to $250K',
      premium: '600',
      icon: '',
      features: ['All Basic features', 'Transit delays', '24/7 support', 'GPS tracking'],
      recommended: true
    },
    { 
      id: 'premium', 
      title: 'Premium',
      limit: 'up to $1M',
      premium: '1,800',
      icon: '',
      features: ['All Standard features', 'Priority claims', 'Dedicated manager', 'Weather coverage']
    }
  ];

  const insuranceHistory = [
    { 
      policyNo: 'INS123456', 
      loadId: 'LD-20240301-001',
      coverage: '$250K',
      premium: '$600',
      status: 'Active',
      type: 'Platform'
    },
    { 
      policyNo: 'INS123455', 
      loadId: 'LD-20240228-005',
      coverage: '$100K',
      premium: '$250',
      status: 'Expired',
      type: 'External'
    },
    { 
      policyNo: 'INS123454', 
      loadId: 'LD-20240225-003',
      coverage: '$1M',
      premium: '$1,800',
      status: 'Claimed',
      type: 'Platform'
    }
  ];

  const notifications = [
    { id: 1, type: 'policy', message: 'Policy #INS123456 activated', time: '2h ago', read: false },
    { id: 2, type: 'payment', message: 'Premium Paid: $600', time: '1d ago', read: false },
    { id: 3, type: 'warning', message: 'Policy expiring in 2 days', time: '2d ago', read: false, urgent: true }
  ];

  const handleCoverageChange = (coverage) => {
    setSelectedCoverage(coverage);
    const option = coverageOptions.find(opt => opt.id === coverage);
    setEstimatedPremium(option ? option.premium : '');
  };

  const handlePurchasePolicy = () => {
    if (!selectedCoverage) {
      toast({
        title: "Please select coverage",
        description: "Choose a coverage plan to proceed",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'external' && !uploadedDocument) {
      toast({
        title: "Document Required",
        description: "Please upload your external booking document",
        variant: "destructive"
      });
      return;
    }

    const action = activeTab === 'platform' ? 'Policy Purchased Successfully!' : 'Submitted for Review';
    const description = activeTab === 'platform' 
      ? `Your policy has been activated! Coverage: ${selectedCoverage}`
      : 'Our team will verify details within 24h';

    toast({
      title: action,
      description: description,
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedDocument({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSelectedCoverage('');
    setEstimatedPremium('');
    setUploadedDocument(null);
    setEnableClaimSupport(false);
  };

  const handlePolicyDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-white';
      case 'Expired': return 'text-white';
      case 'Claimed': return 'text-white';
      default: return 'text-white';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return { background: '#0F7A4A' };
      case 'Expired': return { background: '#8B857C' };
      case 'Claimed': return { background: '#B45309' };
      default: return { background: '#8B857C' };
    }
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userRole === 'fleet' ? "Fleet Owner" : "Mike Sullivan"}
      userId={userRole === 'fleet' ? "FO123456" : "BR123456"}
      isVerified={userRole === 'fleet' ? true : false}
      verificationStatus={userRole === 'fleet' ? "verified" : "not-started"}
    >
      {/* Custom Header with Notifications and Profile */}
      <div className="fixed top-4 right-6 z-50 flex items-center space-x-4">
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          showNotifications={showNotifications}
          onToggle={() => setShowNotifications(!showNotifications)}
        />
        <ProfileDropdown
          showProfile={showProfile}
          onToggle={() => setShowProfile(!showProfile)}
        />
      </div>

      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm ov-num text-[#8B857C]">
          Dashboard &gt; Insurance Hub
        </p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <span className="ov-eyebrow"><span className="dot" />Overland Insurance</span>
        <h1 className="ov-display text-4xl mt-2">Insurance Hub</h1>
      </div>

      {/* Insurance Overview Banner */}
      <Card className="ov-card mb-8" style={{ background: '#FFFFFF' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#111217' }}>
                <ShieldIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="ov-display text-xl mb-1">
                  Full-stack in-transit and vehicle protection
                </h3>
                <p className="text-sm text-[#5B6470]">
                  Get instant quotes and comprehensive coverage for all your cargo shipments
                </p>
              </div>
            </div>
            <Button variant="outline" className="ov-btn ov-btn-outline">
              <InfoIcon className="w-4 h-4 mr-2" />
              Get Instant Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform vs External Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-full p-1 flex" style={{ background: '#F1EEE8' }}>
            <button
              onClick={() => handleTabSwitch('platform')}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
              style={activeTab === 'platform'
                ? { background: '#111217', color: '#fff' }
                : { color: '#5B6470', background: 'transparent' }}
            >
              Platform Booking Insurance
            </button>
            <button
              onClick={() => handleTabSwitch('external')}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
              style={activeTab === 'external'
                ? { background: '#111217', color: '#fff' }
                : { color: '#5B6470', background: 'transparent' }}
            >
              External Booking Insurance
            </button>
          </div>
        </div>

        {/* 70-30 Split Layout */}
        <div className="grid lg:grid-cols-10 gap-8">
          {/* Form Section - 70% */}
          <div className="lg:col-span-7">
            <Card className="ov-card" style={{ background: '#FFFFFF' }}>
              <CardHeader>
                <CardTitle className="ov-display text-xl flex items-center justify-between">
                  {activeTab === 'platform' ? 'Platform Booking' : 'External Booking'} Insurance
                  <Button variant="ghost" size="sm" className="ov-btn-ghost text-[#5B6470]">
                    <HelpCircleIcon className="w-4 h-4 mr-1" />
                    Need help?
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Smart Recommendation */}
                {activeTab === 'platform' && (
                  <div className="rounded-[14px] p-4" style={{ background: 'rgba(14,50,232,0.08)', border: '1px solid rgba(14,50,232,0.18)' }}>
                    <div className="flex items-center space-x-2">
                      <InfoIcon className="w-5 h-5 text-[#0E32E8]" />
                      <span className="text-sm font-medium text-[#0E32E8]">
                        Smart Recommendation: Most users with <span className="ov-num">$250K</span> cargo choose Standard
                      </span>
                    </div>
                  </div>
                )}

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#3E3F46]">
                      Select Load *
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose from your active loads" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LD-20240301-001">LD-20240301-001 (Dallas → Los Angeles)</SelectItem>
                        <SelectItem value="LD-20240301-002">LD-20240301-002 (Chicago → Atlanta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#3E3F46]">
                      Effective Dates
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Input type="date" />
                        <CalendarIcon className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-[#A9A29A]" />
                      </div>
                      <div className="relative">
                        <Input type="date" />
                        <CalendarIcon className="absolute right-3 top-3 w-4 h-4 pointer-events-none text-[#A9A29A]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Booking Specific Fields */}
                {activeTab === 'external' && (
                  <ExternalBookingForm
                    uploadedDocument={uploadedDocument}
                    enableClaimSupport={enableClaimSupport}
                    onFileUpload={handleFileUpload}
                    onDeleteDocument={() => setUploadedDocument(null)}
                    onClaimSupportChange={setEnableClaimSupport}
                  />
                )}

                {/* Coverage Plans */}
                <CoverageSelector
                  coverageOptions={coverageOptions}
                  selectedCoverage={selectedCoverage}
                  onCoverageChange={handleCoverageChange}
                  onShowComparison={() => setShowComparison(true)}
                />

                {/* Coverage Confidence */}
                {selectedCoverage && (
                  <div className="rounded-[14px] p-4" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="ov-tick" style={{ width: 32, height: 32, background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' }}>
                          <ShieldIcon className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="font-semibold text-[#14161A]">
                            Coverage Confidence: <span className="ov-num">86%</span>
                          </span>
                          <p className="text-sm text-[#5B6470]">
                            Based on your cargo value & route risk
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="ov-num text-2xl text-[#14161A]">${estimatedPremium}</p>
                        <p className="text-xs uppercase tracking-wide text-[#8B857C]">Estimated Premium</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="ov-btn ov-btn-ink w-full py-3"
                  onClick={handlePurchasePolicy}
                >
                  {activeTab === 'platform' ? (
                    <>
                      <ShieldIcon className="w-5 h-5 mr-2" />
                      Purchase Policy
                    </>
                  ) : (
                    <>
                      <FileTextIcon className="w-5 h-5 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Our Insurance - 30% */}
          <div className="lg:col-span-3">
            <WhyChoosePanel />
          </div>
        </div>
      </div>

      {/* Insurance History */}
      <InsuranceHistory
        insuranceHistory={insuranceHistory}
        onPolicyDetails={handlePolicyDetails}
      />

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="ov-card max-w-4xl w-full max-h-[80vh] overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid #ECE8E1' }}>
              <h3 className="ov-display text-lg">Insurance Plan Comparison</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowComparison(false)}>
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="ov-eyebrow ov-eyebrow--muted">Features</div>
                {coverageOptions.map((option) => (
                  <div key={option.id} className="text-center">
                    <div className="ov-display text-lg">{option.title}</div>
                    <div className="ov-num text-xs text-[#8B857C]">{option.limit}</div>
                    <div className="ov-num text-xl mt-1 text-[#14161A]">${option.premium}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Details Slide Panel */}
      {showPolicyDetails && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 h-full transform transition-transform duration-300 ease-in-out overflow-y-auto" style={{ background: '#FFFFFF', borderLeft: '1px solid #E7E3DC' }}>
            <div className="p-6" style={{ borderBottom: '1px solid #ECE8E1' }}>
              <div className="flex items-center justify-between">
                <h3 className="ov-display text-lg">Policy Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPolicyDetails(false)}>
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-[#8B857C]">Policy Number</label>
                <p className="ov-num text-lg text-[#14161A]">{selectedPolicy.policyNo}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-[#8B857C]">Load ID</label>
                <p className="ov-num text-[#3E3F46]">{selectedPolicy.loadId}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-[#8B857C]">Coverage Amount</label>
                <p className="ov-num text-[#3E3F46]">{selectedPolicy.coverage}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-[#8B857C]">Premium Paid</label>
                <p className="ov-num text-[#3E3F46]">{selectedPolicy.premium}</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide block mb-1 text-[#8B857C]">Status</label>
                <Badge className={getStatusColor(selectedPolicy.status)} style={getStatusStyle(selectedPolicy.status)}>
                  {selectedPolicy.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        ></div>
      )}
    </DashboardLayout>
  );
};

export default InsurancePage;
