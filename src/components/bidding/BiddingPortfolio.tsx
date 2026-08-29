import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Award, Clock, Activity, Zap } from 'lucide-react';

const BiddingPortfolio = ({ isVerified, autoBidMode }) => {
  const [portfolio, setPortfolio] = useState({
    totalBidsPlaced: 24,
    activeBids: 8,
    wonBids: 16,
    winRate: 67,
    totalValue: 182000,
    avgBidValue: 1750,
    bestRoute: 'DAL→LAX',
    streak: 3
  });

  const [activeBids, setActiveBids] = useState([
    { id: 'RFQ001', route: 'DAL→LAX', bidAmount: 2850, position: 2, timeLeft: 3600, status: 'leading' },
    { id: 'RFQ005', route: 'CHI→ATL', bidAmount: 1900, position: 5, timeLeft: 7200, status: 'trailing' },
    { id: 'RFQ012', route: 'LAX→PHX', bidAmount: 1150, position: 1, timeLeft: 1800, status: 'winning' }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { type: 'won', route: 'HOU→SAV', amount: 2450, time: '2m ago' },
    { type: 'bid', route: 'DAL→LAX', amount: 2850, time: '5m ago' },
    { type: 'lost', route: 'ATL→CHI', amount: 1900, time: '12m ago' }
  ]);

  // Update portfolio data
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBids(prev => prev.map(bid => ({
        ...bid,
        timeLeft: Math.max(0, bid.timeLeft - 1),
        position: bid.position + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'winning': return 'bg-[rgba(15,122,74,0.1)] text-[#0F7A4A]';
      case 'leading': return 'bg-[rgba(14,50,232,0.08)] text-[#0E32E8]';
      case 'trailing': return 'bg-[rgba(180,83,9,0.1)] text-[#B45309]';
      default: return 'bg-[#F1EEE8] text-[#5B6470]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <Card className="ov-card" style={{ background: 'rgba(14,50,232,0.04)' }}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="ov-eyebrow">
              <span className="dot" />YOUR PORTFOLIO
            </div>
            {autoBidMode && (
              <Badge className="text-white" style={{ background: '#0E32E8' }}>
                <Zap className="w-3 h-3 mr-1" />
                Auto
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>${(portfolio.totalValue / 1000).toFixed(0)}K</p>
              <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Total Value</p>
            </div>
            <div className="text-center">
              <p className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>{portfolio.winRate}%</p>
              <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Win Rate</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#5B6470' }}>Active Bids</span>
              <span className="ov-num font-medium" style={{ color: '#14161A' }}>{portfolio.activeBids}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#5B6470' }}>Won Today</span>
              <span className="ov-num font-medium" style={{ color: '#14161A' }}>{portfolio.wonBids}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#5B6470' }}>Best Route</span>
              <span className="ov-num font-medium" style={{ color: '#14161A' }}>{portfolio.bestRoute}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: '#5B6470' }}>Win Rate Progress</span>
              <span className="ov-num" style={{ color: '#14161A' }}>{portfolio.winRate}%</span>
            </div>
            <Progress value={portfolio.winRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Active Bids */}
      <Card className="ov-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5" style={{ color: '#5B6470' }} />
            <h3 className="ov-display text-base">Active Bids</h3>
            <Badge variant="outline" className="ov-num" style={{ borderColor: '#E7E3DC', color: '#5B6470' }}>{activeBids.length}</Badge>
          </div>

          <div className="space-y-3">
            {activeBids.map((bid) => (
              <div key={bid.id} className="ov-card ov-card--hover p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="ov-num text-sm" style={{ color: '#0E32E8' }}>{bid.id}</span>
                    <Badge className={getStatusColor(bid.status)}>
                      #{bid.position}
                    </Badge>
                  </div>
                  <span className="ov-num text-xs" style={{ color: '#5B6470' }}>{formatTime(bid.timeLeft)} left</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="ov-num font-medium" style={{ color: '#14161A' }}>{bid.route}</p>
                    <p className="ov-num text-sm" style={{ color: '#5B6470' }}>${bid.bidAmount.toLocaleString()}</p>
                  </div>
                  <button className="ov-btn ov-btn-outline text-xs px-3 py-2">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="ov-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: '#5B6470' }} />
            <h3 className="ov-display text-base">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: activity.type === 'won' ? '#0F7A4A' : activity.type === 'bid' ? '#0E32E8' : '#A8412F' }}></div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: '#14161A' }}>
                    {activity.type === 'won' ? 'Won' : activity.type === 'bid' ? 'Bid on' : 'Lost'} <span className="ov-num">{activity.route}</span>
                  </p>
                  <p className="ov-num text-xs" style={{ color: '#5B6470' }}>${activity.amount.toLocaleString()} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="ov-card">
        <CardContent className="p-6">
          <h3 className="ov-display text-base mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="ov-btn ov-btn-ink w-full">
              <Target className="w-4 h-4 mr-2" />
              Place New Bid
            </button>
            <button className="ov-btn ov-btn-outline w-full">
              <Award className="w-4 h-4 mr-2" />
              View Analytics
            </button>
            <button className="ov-btn ov-btn-outline w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Trends
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiddingPortfolio;
