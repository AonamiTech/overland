
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Target, Clock, Award } from 'lucide-react';

const MetricsCards = () => {
  const [metrics, setMetrics] = useState([
    {
      id: 'activeRFQs',
      icon: Activity,
      label: 'Active RFQs',
      value: '142',
      change: '+12',
      isPositive: true,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 40 + 10)
    },
    {
      id: 'liveBids',
      icon: Target,
      label: 'Live Bids',
      value: '1247',
      change: '+47',
      isPositive: true,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 60 + 20)
    },
    {
      id: 'avgResponse',
      icon: Clock,
      label: 'Avg Response Time',
      value: '4.2m',
      change: '-1.2m',
      isPositive: true,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 30 + 15)
    },
    {
      id: 'winRate',
      icon: Award,
      label: 'Win Rate',
      value: '23%',
      change: '+3%',
      isPositive: true,
      sparklineData: Array.from({ length: 10 }, () => Math.random() * 25 + 20)
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.id === 'liveBids' 
          ? String(parseInt(metric.value) + Math.floor(Math.random() * 3))
          : metric.value,
        sparklineData: [
          ...metric.sparklineData.slice(1),
          Math.random() * (metric.id === 'liveBids' ? 60 : 40) + 10
        ]
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderSparkline = (data) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end space-x-0.5 h-8">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="rounded-sm transition-all duration-300"
              style={{
                width: '3px',
                height: `${Math.max(height, 10)}%`,
                background: 'rgba(14,50,232,0.28)'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id} className="ov-card p-4">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="ov-num text-[11px] uppercase tracking-[0.12em] text-[#A9A29A] mb-2">{metric.label}</p>
                <div className="flex items-end space-x-2">
                  <p className="ov-num text-[32px] leading-none text-[#14161A]">{metric.value}</p>
                  <div className={`flex items-center text-xs ${
                    metric.isPositive ? 'text-[#0F7A4A]' : 'text-[#A8412F]'
                  }`}>
                    {metric.isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" strokeWidth={1.8} />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" strokeWidth={1.8} />
                    )}
                    <span className="ov-num">{metric.change}</span>
                  </div>
                </div>
              </div>
              <span className="ov-tick">
                <metric.icon className="w-4 h-4" strokeWidth={1.8} />
              </span>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="mt-3">
              {renderSparkline(metric.sparklineData)}
            </div>

            <p className="ov-num text-[10px] uppercase tracking-[0.1em] text-[#A9A29A] mt-2">vs Last 1hr</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
