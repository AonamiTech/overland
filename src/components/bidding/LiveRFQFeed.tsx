
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Truck, Package, MapPin, Flame, Shield, Users } from 'lucide-react';

const LiveRFQFeed = ({ filters, isVerified, onRFQSelect }) => {
  const [rfqs, setRfqs] = useState([
    {
      id: 'RFQ001',
      route: { from: 'Dallas', to: 'Los Angeles', code: 'DAL→LAX' },
      cargoType: 'Electronics',
      weight: '11,000 lbs',
      budgetRange: { min: 3000, max: 3800 },
      deadline: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
      bidsReceived: 12,
      isHighDemand: true,
      isPremium: true,
      corporateClient: 'Tech Corp Inc.',
      trustRating: 4.8
    },
    {
      id: 'RFQ002',
      route: { from: 'Chicago', to: 'Atlanta', code: 'CHI→ATL' },
      cargoType: 'FMCG',
      weight: '6,600 lbs',
      budgetRange: { min: 2000, max: 2800 },
      deadline: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      bidsReceived: 8,
      isHighDemand: false,
      isPremium: false,
      corporateClient: 'Retail Solutions',
      trustRating: 4.5
    },
    {
      id: 'RFQ003',
      route: { from: 'Los Angeles', to: 'Phoenix', code: 'LAX→PHX' },
      cargoType: 'Pharmaceuticals',
      weight: '4,400 lbs',
      budgetRange: { min: 1000, max: 1600 },
      deadline: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
      bidsReceived: 15,
      isHighDemand: true,
      isPremium: true,
      corporateClient: 'Pharma Global',
      trustRating: 4.9
    }
  ]);

  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = {};
      rfqs.forEach(rfq => {
        const now = new Date();
        const deadlineTime = new Date(rfq.deadline).getTime();
        const nowTime = now.getTime();
        const diff = deadlineTime - nowTime;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[rfq.id] = `${hours}h ${minutes}m`;
        } else {
          newTimeRemaining[rfq.id] = 'Expired';
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [rfqs]);

  const formatBudgetRange = (range) => {
    return `$${(range.min / 1000).toFixed(0)}K - $${(range.max / 1000).toFixed(0)}K`;
  };

  const canBid = (rfq) => {
    if (rfq.isPremium && !isVerified) return false;
    return timeRemaining[rfq.id] !== 'Expired';
  };

  return (
    <div className="space-y-4">
      {/* Live Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="ov-livedot"></div>
          <h2 className="ov-display text-lg">Live RFQ Feed</h2>
          <Badge variant="outline" className="ov-num text-xs" style={{ borderColor: '#E7E3DC', color: '#5B6470' }}>
            {rfqs.length} Active
          </Badge>
        </div>
        <button className="ov-btn ov-btn-outline text-xs px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          Auto-refresh: ON
        </button>
      </div>

      {/* RFQ Cards */}
      <div className="grid gap-4">
        {rfqs.map((rfq) => (
          <Card
            key={rfq.id}
            className={`ov-card ov-card--hover ${!canBid(rfq) ? 'opacity-60' : ''}`}
            style={{ borderLeft: `3px solid ${rfq.isHighDemand ? '#A8412F' : '#0E32E8'}` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="ov-tick" style={{ width: 36, height: 36, borderRadius: 10 }}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="ov-num text-sm font-medium" style={{ color: '#0E32E8' }}>
                        {rfq.id}
                      </span>
                      {rfq.isPremium && (
                        <Badge className="text-xs" style={{ background: 'rgba(180,83,9,0.1)', color: '#B45309' }}>
                          <Shield className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {rfq.isHighDemand && (
                        <Badge className="text-xs" style={{ background: 'rgba(168,65,47,0.1)', color: '#A8412F' }}>
                          <Flame className="w-3 h-3 mr-1" />
                          High Demand
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: '#5B6470' }}>{rfq.corporateClient}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="ov-num text-sm font-medium" style={{ color: timeRemaining[rfq.id] === 'Expired' ? '#A8412F' : '#B45309' }}>
                    <Clock className="w-4 h-4 inline mr-1" />
                    {timeRemaining[rfq.id]}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#5B6470' }}>
                    <Users className="w-3 h-3 inline mr-1" />
                    <span className="ov-num">{rfq.bidsReceived}</span> bids
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" style={{ color: '#8B857C' }} />
                  <div>
                    <p className="ov-num text-sm font-medium" style={{ color: '#14161A' }}>{rfq.route.code}</p>
                    <p className="text-xs" style={{ color: '#5B6470' }}>{rfq.route.from} → {rfq.route.to}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" style={{ color: '#8B857C' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#14161A' }}>{rfq.cargoType}</p>
                    <p className="ov-num text-xs" style={{ color: '#5B6470' }}>{rfq.weight}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="ov-num w-4 h-4" style={{ color: '#8B857C' }}>$</div>
                  <div>
                    <p className="ov-num text-sm font-medium" style={{ color: '#14161A' }}>{formatBudgetRange(rfq.budgetRange)}</p>
                    <p className="text-xs" style={{ color: '#5B6470' }}>Budget Range</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#0F7A4A' }}></div>
                  </div>
                  <div>
                    <p className="ov-num text-sm font-medium" style={{ color: '#14161A' }}>★ {rfq.trustRating}</p>
                    <p className="text-xs" style={{ color: '#5B6470' }}>Trust Rating</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!canBid(rfq) && rfq.isPremium && !isVerified && (
                    <Badge variant="outline" style={{ color: '#B45309', borderColor: '#E8C98A' }}>
                      Verification Required
                    </Badge>
                  )}
                  {timeRemaining[rfq.id] === 'Expired' && (
                    <Badge variant="outline" style={{ color: '#A8412F', borderColor: '#E0B3A9' }}>
                      Bidding Closed
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    className="ov-btn ov-btn-outline text-xs px-4 py-2"
                    onClick={() => onRFQSelect(rfq)}
                  >
                    View Details
                  </button>
                  <button
                    disabled={!canBid(rfq)}
                    onClick={() => onRFQSelect(rfq)}
                    className={`ov-btn text-xs px-4 py-2 ${canBid(rfq) ? 'ov-btn-ink' : 'ov-btn-outline'}`}
                    style={!canBid(rfq) ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                  >
                    {canBid(rfq) ? 'Place Bid' : 'Cannot Bid'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-4">
        <button className="ov-btn ov-btn-outline">
          Load More RFQs
        </button>
      </div>
    </div>
  );
};

export default LiveRFQFeed;
