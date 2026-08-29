
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import FreightMarketIndex from './bidding/FreightMarketIndex';
import RouteMarketTicker from './bidding/RouteMarketTicker';
import RouteBidChart from './bidding/RouteBidChart';
import RFQMarketDepth from './bidding/RFQMarketDepth';
import MetricsCards from './bidding/MetricsCards';
import VerificationBanner from './bidding/VerificationBanner';
import AdvancedFilters from './bidding/AdvancedFilters';
import BiddingPortfolio from './bidding/BiddingPortfolio';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Activity, TrendingUp, Zap, RefreshCw } from 'lucide-react';

const CorporateBiddingExchange = () => {
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [filters, setFilters] = useState({
    route: '',
    cargoType: '',
    budgetRange: [0, 100000],
    deadline: '',
    corporateOnly: false
  });
  const [autoBidMode, setAutoBidMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('DAL→LAX');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update last refresh time every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSinceUpdate = () => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    return `${seconds}s ago`;
  };

  return (
    <DashboardLayout 
      userRole="corporate" 
      userName="Corporate User" 
      userId="CU123456" 
      isVerified={isVerified}
    >
      <div className="space-y-6 min-h-screen" style={{ background: '#FBFAF8' }}>
        {/* Sticky Refresh Banner */}
        <div className="sticky top-0 z-50 text-white px-6 py-3 flex items-center justify-between text-sm" style={{ background: '#0D0D11' }}>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="ov-livedot"></div>
              <span className="font-medium uppercase tracking-wide text-xs" style={{ color: '#22C55E' }}>Real-Time Mode</span>
            </div>
            <span className="text-white/60">Last Synced: <span className="ov-num">{getTimeSinceUpdate()}</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Label htmlFor="auto-mode" className="text-sm">Auto-Bid</Label>
              <Switch
                id="auto-mode"
                checked={autoBidMode}
                onCheckedChange={setAutoBidMode}
              />
            </div>
            <button className="ov-btn text-xs px-4 py-2 text-white" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Freight Market Index Header */}
        <div className="px-6">
          <FreightMarketIndex />
        </div>

        {/* Route Market Ticker */}
        <div className="px-6">
          <RouteMarketTicker onRouteSelect={setSelectedRoute} />
        </div>

        {/* Main 3-Column Grid Layout */}
        <div className="px-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Center Column - Main Content */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Route Bid Chart Section */}
            <div className="ov-card overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E3DC' }}>
                <h2 className="ov-display text-lg flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <span>Live Bid Price Trend (Last 24 hrs)</span>
                </h2>
                <p className="text-sm mt-1" style={{ color: '#5B6470' }}>Real-time bidding activity for <span className="ov-num">{selectedRoute}</span></p>
              </div>
              <div className="p-0">
                <RouteBidChart selectedRoute={selectedRoute} />
              </div>
            </div>

            {/* Metrics Cards Section */}
            <div className="ov-card p-6">
              <div className="mb-6">
                <h3 className="ov-display text-lg flex items-center space-x-2">
                  <Activity className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <span>Market Metrics</span>
                </h3>
                <p className="text-sm mt-1" style={{ color: '#5B6470' }}>Key performance indicators</p>
              </div>
              <MetricsCards />
            </div>
            
            {/* Verification Banner */}
            <VerificationBanner isVerified={isVerified} onVerificationComplete={() => setIsVerified(true)} />
            
            {/* Advanced Filters */}
            <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
            
            {/* RFQ Market Depth Table */}
            <RFQMarketDepth 
              filters={filters}
              isVerified={isVerified}
              onRFQSelect={setSelectedRFQ}
            />
          </div>

          {/* Right Column - Portfolio & Stats */}
          <div className="xl:col-span-4">
            <div className="sticky top-32">
              <BiddingPortfolio isVerified={isVerified} autoBidMode={autoBidMode} />
            </div>
          </div>
        </div>

        {/* Auto-Bid Status Banner */}
        {autoBidMode && (
          <div className="px-6">
            <Card className="ov-card" style={{ background: 'rgba(14,50,232,0.04)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="ov-tick" style={{ width: 44, height: 44, borderRadius: 12 }}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="ov-display text-lg">Auto-Bid Mode Active</h3>
                      <p className="text-sm" style={{ color: '#5B6470' }}>System monitoring RFQs and placing bids within your limits</p>
                    </div>
                  </div>
                  <Badge className="text-white px-3 py-1" style={{ background: '#0E32E8' }}>
                    <Activity className="w-4 h-4 mr-2" />
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CorporateBiddingExchange;
