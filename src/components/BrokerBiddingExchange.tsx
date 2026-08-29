import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Package, TrendingUp, Zap, RefreshCw, Clock, DollarSign, User, Eye, Award, Flame } from 'lucide-react';
import FreightMarketIndex from './bidding/FreightMarketIndex';
import RouteMarketTicker from './bidding/RouteMarketTicker';
import RouteBidChart from './bidding/RouteBidChart';
import BrokerHeader from './broker/BrokerHeader';
import BrokerMetrics from './broker/BrokerMetrics';

const BrokerBiddingExchange = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [autoAwardMode, setAutoAwardMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [expandedLoad, setExpandedLoad] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState('DAL→LAX');

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

  const activeLoads = [
    {
      id: "LD-001",
      route: "Dallas → Los Angeles",
      cargo: "Electronics – 11,000 lbs",
      budget: "$2,200 – $2,800",
      deadline: "6 hrs left",
      bidsReceived: 12,
      lowestBid: "$2,450",
      status: "hot",
      bidHealth: 85,
      topBidders: [
        { name: "Rio Grande Carriers", bid: "$2,450", rating: 4.8, verified: true },
        { name: "Keystone Logistics", bid: "$2,510", rating: 4.6, verified: true },
        { name: "Summit Freight", bid: "$2,600", rating: 4.4, verified: false }
      ]
    },
    {
      id: "LD-002",
      route: "Chicago → Atlanta",
      cargo: "Furniture – 6,600 lbs",
      budget: "$1,500 – $1,900",
      deadline: "2 days left",
      bidsReceived: 8,
      lowestBid: "$1,620",
      status: "active",
      bidHealth: 62,
      topBidders: [
        { name: "Atlanta Express", bid: "$1,620", rating: 4.5, verified: true },
        { name: "Southern Logistics", bid: "$1,700", rating: 4.3, verified: true },
        { name: "Rapid Carriers", bid: "$1,790", rating: 4.1, verified: false }
      ]
    },
    {
      id: "LD-003",
      route: "Los Angeles → Phoenix",
      cargo: "Textiles – 4,400 lbs",
      budget: "$900 – $1,250",
      deadline: "12 hrs left",
      bidsReceived: 15,
      lowestBid: "$980",
      status: "hot",
      bidHealth: 92,
      topBidders: [
        { name: "Phoenix Express", bid: "$980", rating: 4.9, verified: true },
        { name: "Western Logistics", bid: "$1,020", rating: 4.7, verified: true },
        { name: "Fast Track", bid: "$1,080", rating: 4.5, verified: true }
      ]
    }
  ];

  const getBidHealthColor = (health: number) => {
    if (health >= 80) return "bg-[#0F7A4A]";
    if (health >= 60) return "bg-[#B45309]";
    return "bg-[#A8412F]";
  };

  const getDeadlineColor = (deadline: string) => {
    if (deadline.includes("hrs") && parseInt(deadline) <= 6) return "text-[#A8412F]";
    if (deadline.includes("hrs") && parseInt(deadline) <= 24) return "text-[#B45309]";
    return "text-[#5B6470]";
  };

  return (
    <DashboardLayout 
      userRole="broker" 
      userName="Freight Broker" 
      userId="BR123456" 
      isVerified={isVerified}
    >
      <div className="space-y-6 min-h-screen" style={{ background: '#FBFAF8' }}>
        {/* Header */}
        <BrokerHeader
          autoAwardMode={autoAwardMode}
          setAutoAwardMode={setAutoAwardMode}
          getTimeSinceUpdate={getTimeSinceUpdate}
        />

        <div className="px-6 space-y-6">
          {/* Freight Market Index */}
          <FreightMarketIndex />

          {/* Broker Metrics */}
          <BrokerMetrics />

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

          {/* Verification Banner */}
          {!isVerified && (
            <Card className="ov-card" style={{ borderColor: '#E0B3A9', background: 'rgba(168,65,47,0.05)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(168,65,47,0.1)' }}>
                      <Package className="w-6 h-6" style={{ color: '#A8412F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: '#A8412F' }}>Verification Required</h3>
                      <p className="text-sm" style={{ color: '#A8412F' }}>Complete verification to auto-award bids and access premium bidders</p>
                      <div className="mt-2 text-xs" style={{ color: '#A8412F' }}>
                        <span>Limit: 3 RFQs/day • Auto-award disabled • No access to high-rated vendors • Basic support only</span>
                      </div>
                    </div>
                  </div>
                  <button className="ov-btn ov-btn-ink">
                    Start Verification
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Loads - Bidding Status Table */}
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display text-xl flex items-center">
                <Package className="w-5 h-5 mr-2" style={{ color: '#0E32E8' }} />
                Your Active Loads - Live Bidding Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeLoads.map((load) => (
                  <div key={load.id} className="rounded-lg overflow-hidden" style={{ border: '1px solid #E7E3DC' }}>
                    {/* Main Row */}
                    <div className="bg-white p-4 hover:bg-[#FBFAF8] cursor-pointer">
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-1 h-12 rounded ${getBidHealthColor(load.bidHealth)}`}></div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <button className="ov-num font-medium" style={{ color: '#0E32E8' }}>
                                {load.id}
                              </button>
                              {load.status === 'hot' && <Flame className="w-4 h-4" style={{ color: '#A8412F' }} />}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium" style={{ color: '#14161A' }}>{load.route}</div>
                        <div style={{ color: '#3E3F46' }}>{load.cargo}</div>
                        <div className="ov-num" style={{ color: '#3E3F46' }}>{load.budget}</div>
                        <div className={`ov-num font-medium ${getDeadlineColor(load.deadline)}`}>
                          <Clock className="w-4 h-4 inline mr-1" />
                          {load.deadline}
                        </div>
                        <div>
                          <Badge variant="secondary" className="ov-num" style={{ background: 'rgba(14,50,232,0.08)', color: '#0E32E8' }}>
                            {load.bidsReceived} bids
                          </Badge>
                        </div>
                        <div className="ov-num font-semibold text-lg" style={{ color: '#0F7A4A' }}>{load.lowestBid}</div>
                        <div className="flex space-x-2">
                          <button
                            className="ov-btn ov-btn-ink text-xs px-3 py-2"
                            onClick={() => setExpandedLoad(expandedLoad === load.id ? null : load.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Bids
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded View */}
                    {expandedLoad === load.id && (
                      <div className="p-4" style={{ background: '#FBFAF8', borderTop: '1px solid #E7E3DC' }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Bid Trend Graph Placeholder */}
                          <div className="ov-card p-4">
                            <h4 className="ov-display text-base mb-3 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#0E32E8' }} />
                              Bid Trend (Last 2 Hours)
                            </h4>
                            <div className="h-32 rounded flex items-center justify-center" style={{ background: '#FBFAF8', border: '1px solid #ECE8E1' }}>
                              <span style={{ color: '#8B857C' }}>Live bid chart coming soon</span>
                            </div>
                          </div>

                          {/* Top 3 Bidders Leaderboard */}
                          <div className="ov-card p-4">
                            <h4 className="ov-display text-base mb-3 flex items-center">
                              <Award className="w-4 h-4 mr-2" style={{ color: '#B45309' }} />
                              Top 3 Bidders
                            </h4>
                            <div className="space-y-3">
                              {load.topBidders.map((bidder, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded" style={{ background: '#FBFAF8', border: '1px solid #ECE8E1' }}>
                                  <div className="flex items-center space-x-3">
                                    <div className="ov-num w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: index === 0 ? '#B45309' : index === 1 ? '#8B857C' : '#A9A29A' }}>
                                      {index + 1}
                                    </div>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium" style={{ color: '#14161A' }}>{bidder.name}</span>
                                        {bidder.verified && <Badge variant="outline" className="text-xs" style={{ borderColor: '#E7E3DC', color: '#5B6470' }}>Verified</Badge>}
                                      </div>
                                      <div className="ov-num text-sm" style={{ color: '#5B6470' }}>★ {bidder.rating}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="ov-num font-bold" style={{ color: '#0F7A4A' }}>{bidder.bid}</div>
                                    <button className="ov-btn ov-btn-outline mt-1 text-xs px-3 py-1">
                                      Shortlist
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-3">
                          <button className="ov-btn ov-btn-ink" style={{ background: '#0F7A4A' }}>
                            <Award className="w-4 h-4 mr-2" />
                            Award Now
                          </button>
                          <button className="ov-btn ov-btn-outline">
                            Negotiate
                          </button>
                          <button className="ov-btn ov-btn-outline">
                            Extend Deadline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auto-Award Banner */}
          {autoAwardMode && (
            <Card className="ov-card" style={{ background: 'rgba(14,50,232,0.04)' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="ov-tick" style={{ width: 44, height: 44, borderRadius: 12 }}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="ov-display text-lg">Auto-Award Mode Active</h3>
                      <p className="text-sm" style={{ color: '#5B6470' }}>System will automatically award loads to the best bids based on your criteria</p>
                    </div>
                  </div>
                  <Badge className="text-white px-3 py-1" style={{ background: '#0E32E8' }}>
                    <Clock className="w-4 h-4 mr-2" />
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrokerBiddingExchange;
