
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Truck, Package, Shield, Flame, Users, TrendingUp, TrendingDown } from 'lucide-react';

const RFQMarketDepth = ({ filters, isVerified, onRFQSelect }) => {
  const [rfqs, setRfqs] = useState([
    {
      id: 'RFQ001',
      route: 'DAL→LAX',
      currentBid: 3200,
      bidders: 14,
      timeLeft: 4920, // seconds
      type: 'Premium',
      cargoType: 'Electronics',
      weight: '11,000 lbs',
      trend: 'up',
      change: 2.1,
      isHot: true
    },
    {
      id: 'RFQ002',
      route: 'CHI→ATL',
      currentBid: 2400,
      bidders: 8,
      timeLeft: 3300,
      type: 'Standard',
      cargoType: 'FMCG',
      weight: '6,600 lbs',
      trend: 'up',
      change: 1.8,
      isHot: false
    },
    {
      id: 'RFQ003',
      route: 'LAX→PHX',
      currentBid: 1200,
      bidders: 20,
      timeLeft: 7800,
      type: 'Corporate',
      cargoType: 'Pharmaceuticals',
      weight: '4,400 lbs',
      trend: 'down',
      change: -0.5,
      isHot: true
    }
  ]);

  // Update RFQ data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRfqs(prev => prev.map(rfq => ({
        ...rfq,
        currentBid: Math.round(rfq.currentBid + (Math.random() - 0.5) * 200),
        timeLeft: Math.max(0, rfq.timeLeft - 1),
        bidders: rfq.bidders + (Math.random() > 0.8 ? 1 : 0),
        change: rfq.change + (Math.random() - 0.5) * 0.5
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const canBid = (rfq) => {
    if (rfq.type === 'Premium' && !isVerified) return false;
    return rfq.timeLeft > 0;
  };

  return (
    <Card className="ov-card">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="ov-display text-xl">RFQ Market Depth</h2>
            <Badge style={{ background: 'rgba(15,122,74,0.1)', color: '#0F7A4A' }}>
              <div className="ov-livedot mr-1"></div>
              Live
            </Badge>
          </div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>
            <span className="ov-num">{rfqs.length}</span> Active RFQs
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 text-[11px] font-semibold uppercase tracking-wide mb-2 pb-2" style={{ color: '#5B6470', borderBottom: '1px solid #ECE8E1' }}>
          <div>RFQ ID</div>
          <div>Route</div>
          <div>Current Bid</div>
          <div>Change</div>
          <div>Bidders</div>
          <div>Time Left</div>
          <div>Type</div>
          <div>Action</div>
        </div>

        {/* RFQ Rows */}
        <div>
          {rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="ov-mkt-row grid grid-cols-8 gap-4 p-3 items-center"
            >
              {/* RFQ ID */}
              <div className="flex items-center space-x-2">
                <span className="ov-num text-sm font-medium" style={{ color: '#0E32E8' }}>{rfq.id}</span>
                {rfq.isHot && <Flame className="w-3 h-3" style={{ color: '#A8412F' }} />}
              </div>

              {/* Route */}
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" style={{ color: '#8B857C' }} />
                <span className="ov-num font-medium" style={{ color: '#14161A' }}>{rfq.route}</span>
              </div>

              {/* Current Bid */}
              <div className="ov-num font-semibold" style={{ color: '#14161A' }}>
                ${rfq.currentBid.toLocaleString()}
              </div>

              {/* Change */}
              <div className="flex items-center space-x-1" style={{ color: rfq.trend === 'up' ? '#0F7A4A' : '#A8412F' }}>
                {rfq.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="ov-num text-sm font-medium">
                  {rfq.change >= 0 ? '+' : ''}{rfq.change.toFixed(1)}%
                </span>
              </div>

              {/* Bidders */}
              <div className="flex items-center space-x-1" style={{ color: '#5B6470' }}>
                <Users className="w-3 h-3" />
                <span className="ov-num text-sm">{rfq.bidders}</span>
              </div>

              {/* Time Left */}
              <div className="flex items-center space-x-1" style={{ color: rfq.timeLeft < 3600 ? '#A8412F' : '#B45309' }}>
                <Clock className="w-3 h-3" />
                <span className="ov-num text-sm font-medium">{formatTime(rfq.timeLeft)}</span>
              </div>

              {/* Type */}
              <div>
                <Badge
                  className="text-xs"
                  style={
                    rfq.type === 'Premium' ? { background: 'rgba(180,83,9,0.1)', color: '#B45309' } :
                    rfq.type === 'Corporate' ? { background: 'rgba(14,50,232,0.08)', color: '#0E32E8' } :
                    { background: '#F1EEE8', color: '#5B6470' }
                  }
                >
                  {rfq.type === 'Premium' && <Shield className="w-3 h-3 mr-1" />}
                  {rfq.type}
                </Badge>
              </div>

              {/* Action */}
              <div>
                <button
                  disabled={!canBid(rfq)}
                  onClick={() => onRFQSelect(rfq)}
                  className={`ov-btn text-xs px-3 py-2 ${canBid(rfq) ? 'ov-btn-ink' : 'ov-btn-outline'}`}
                  style={!canBid(rfq) ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                >
                  {canBid(rfq) ? 'Bid Now' : 'Locked'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 text-sm" style={{ color: '#5B6470', borderTop: '1px solid #ECE8E1' }}>
          <span>Showing <span className="ov-num">{rfqs.length}</span> of <span className="ov-num">{rfqs.length}</span> RFQs</span>
          <div className="flex items-center space-x-2">
            <div className="ov-livedot"></div>
            <span>Real-time updates every 2s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RFQMarketDepth;
