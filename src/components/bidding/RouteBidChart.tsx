
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Clock } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const RouteBidChart = ({ selectedRoute }) => {
  const [timeRange, setTimeRange] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [routeStats, setRouteStats] = useState({
    openingBid: 3000,
    highestBid: 3400,
    lowestBid: 2800,
    currentBid: 3200,
    bidVolume: 47,
    change: 120,
    changePercent: 3.7
  });

  // Generate sample chart data
  useEffect(() => {
    const generateData = () => {
      const hours = timeRange === '1D' ? 24 : timeRange === '1W' ? 168 : 720;
      const interval = timeRange === '1D' ? 1 : timeRange === '1W' ? 4 : 24;
      
      const data = [];
      let basePrice = 3000;

      for (let i = 0; i < hours; i += interval) {
        const fluctuation = (Math.random() - 0.5) * 300;
        basePrice += fluctuation * 0.1;
        basePrice = Math.max(2600, Math.min(3600, basePrice)); // Keep within reasonable bounds

        const time = new Date();
        time.setHours(time.getHours() - (hours - i));

        data.push({
          time: timeRange === '1D'
            ? time.getHours().toString().padStart(2, '0') + ':00'
            : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Math.round(basePrice),
          volume: Math.floor(Math.random() * 20) + 5,
          high: Math.round(basePrice + Math.random() * 150),
          low: Math.round(basePrice - Math.random() * 150)
        });
      }
      
      return data;
    };

    setChartData(generateData());
  }, [timeRange, selectedRoute]);

  // Update current stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRouteStats(prev => ({
        ...prev,
        currentBid: Math.round(Math.max(2600, Math.min(3600, prev.currentBid + (Math.random() - 0.5) * 60))),
        bidVolume: prev.bidVolume + Math.floor(Math.random() * 3),
        change: prev.change + (Math.random() - 0.5) * 20
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    price: {
      label: "Bid Price",
      color: "hsl(217, 91%, 60%)",
    },
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="ov-card p-3 shadow-lg">
          <p className="ov-num text-sm font-medium" style={{ color: '#14161A' }}>{`Time: ${label}`}</p>
          <p className="ov-num text-sm" style={{ color: '#0E32E8' }}>{`Price: $${payload[0].value?.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="ov-display ov-num text-xl">{selectedRoute}</h3>
          <Badge className="px-3 py-1" style={{ background: 'rgba(15,122,74,0.1)', color: '#0F7A4A' }}>
            <div className="ov-livedot mr-2"></div>
            Live
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {['1D', '1W', '1M'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`ov-btn ov-num text-xs px-3 py-1 ${timeRange === range ? 'ov-btn-ink' : 'ov-btn-outline'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Route Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: '#5B6470' }}>Current Bid</p>
          <p className="ov-num text-lg font-semibold" style={{ color: '#14161A' }}>${Math.round(routeStats.currentBid).toLocaleString()}</p>
          <div className={`flex items-center justify-center text-xs mt-1`} style={{ color: routeStats.change >= 0 ? '#0F7A4A' : '#A8412F' }}>
            {routeStats.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span className="ov-num">{routeStats.change >= 0 ? '+' : ''}${Math.abs(Math.round(routeStats.change))}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: '#5B6470' }}>Opening</p>
          <p className="ov-num text-sm font-semibold" style={{ color: '#3E3F46' }}>${routeStats.openingBid.toLocaleString()}</p>
        </div>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: '#5B6470' }}>High</p>
          <p className="ov-num text-sm font-semibold" style={{ color: '#0F7A4A' }}>${routeStats.highestBid.toLocaleString()}</p>
        </div>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: '#5B6470' }}>Low</p>
          <p className="ov-num text-sm font-semibold" style={{ color: '#A8412F' }}>${routeStats.lowestBid.toLocaleString()}</p>
        </div>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: '#5B6470' }}>Volume</p>
          <p className="ov-num text-sm font-semibold" style={{ color: '#0E32E8' }}>{Math.round(routeStats.bidVolume)} bids</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0E32E8" stopOpacity={0.22}/>
                <stop offset="95%" stopColor="#0E32E8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#5B6470' }}
            />
            <YAxis 
              domain={['dataMin - 200', 'dataMax + 200']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#5B6470' }}
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#0E32E8"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
            <ReferenceLine
              y={Math.round(routeStats.currentBid)}
              stroke="#A8412F"
              strokeDasharray="3 3"
              label={{ value: "Current", position: "insideTopRight" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="flex items-center justify-between text-xs pt-4" style={{ color: '#5B6470', borderTop: '1px solid #ECE8E1' }}>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Last updated: <span className="ov-num">{new Date().toLocaleTimeString()}</span></span>
        </div>
        <div className="flex items-center space-x-1">
          <BarChart3 className="w-3 h-3" />
          <span>Real-time bid tracking</span>
        </div>
      </div>
    </div>
  );
};

export default RouteBidChart;
