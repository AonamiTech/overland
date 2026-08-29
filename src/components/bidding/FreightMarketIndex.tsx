
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const FreightMarketIndex = () => {
  const [indexData, setIndexData] = useState({
    value: 12350.75,
    change: 152.30,
    changePercent: 1.25,
    isPositive: true,
    volume: 1247,
    timestamp: new Date()
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexData(prev => {
        const fluctuation = (Math.random() - 0.5) * 50;
        const newValue = prev.value + fluctuation;
        const change = newValue - 12350.75;
        const changePercent = (change / 12350.75) * 100;
        
        return {
          value: newValue,
          change: Math.abs(change),
          changePercent: Math.abs(changePercent),
          isPositive: change >= 0,
          volume: prev.volume + Math.floor(Math.random() * 3),
          timestamp: new Date()
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/New_York'
    });
  };

  return (
    <Card className="ov-board text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <div className="ov-eyebrow mb-2" style={{ color: '#6E7CFF' }}>
                <span className="dot" />OVERLAND FREIGHT INDEX
              </div>
              <div className="flex items-center space-x-4">
                <span className="ov-num text-3xl font-semibold">${indexData.value.toFixed(2)}</span>
                <div className={`flex items-center space-x-1 ${indexData.isPositive ? 'text-[#22C55E]' : 'text-[#F26D5B]'}`}>
                  {indexData.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="ov-num text-lg font-semibold">
                    {indexData.isPositive ? '+' : '-'}${indexData.change.toFixed(2)}
                  </span>
                  <span className="ov-num text-sm">
                    ({indexData.isPositive ? '+' : '-'}{indexData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Sparkline */}
            <div className="hidden md:block">
              <div className="w-32 h-16 rounded flex items-end justify-between p-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full"
                    style={{ height: `${20 + Math.random() * 80}%`, background: indexData.isPositive ? '#22C55E' : '#F26D5B' }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/70 text-xs uppercase tracking-wide">Updated <span className="ov-num">{formatTime(indexData.timestamp)}</span> ET</p>
            <p className="text-white/50 text-xs mt-1">Volume <span className="ov-num">{indexData.volume.toLocaleString()}</span> bids</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightMarketIndex;
