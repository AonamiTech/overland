
import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FreightMarketIndex from './bidding/FreightMarketIndex';
import RouteMarketTicker from './bidding/RouteMarketTicker';
import RouteBidChart from './bidding/RouteBidChart';
import FleetHeader from './fleet/FleetHeader';
import FleetMetrics from './fleet/FleetMetrics';
import AvailableLoadsTable from './fleet/AvailableLoadsTable';
import AutoBidBanner from './fleet/AutoBidBanner';

const FleetBiddingExchange = () => {
  const [isVerified, setIsVerified] = useState(true);
  const [autoBidMode, setAutoBidMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('DAL→LAX');
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
      userRole="fleet" 
      userName="Fleet Owner" 
      userId="FO123456" 
      isVerified={isVerified}
    >
      <div className="space-y-6 min-h-screen" style={{ background: '#FBFAF8' }}>
        {/* Header */}
        <FleetHeader
          autoBidMode={autoBidMode}
          setAutoBidMode={setAutoBidMode}
          getTimeSinceUpdate={getTimeSinceUpdate}
        />

        <div className="px-6 space-y-6">
          {/* Freight Market Index */}
          <FreightMarketIndex />

          {/* Fleet Metrics */}
          <FleetMetrics />

          {/* Live Route Market */}
          <RouteMarketTicker onRouteSelect={setSelectedRoute} />

          {/* Route Bid Chart */}
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display text-xl">Live Bid Price Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RouteBidChart selectedRoute={selectedRoute} />
            </CardContent>
          </Card>

          {/* Available Loads for Bidding */}
          <AvailableLoadsTable />

          {/* Auto-Bid Banner */}
          <AutoBidBanner autoBidMode={autoBidMode} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FleetBiddingExchange;
