
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Truck, TrendingUp, DollarSign, Package } from 'lucide-react';

const FleetMetrics = () => {
  const fleetMetrics = [
    { label: "Available Trucks", value: "18", icon: Truck, color: "text-blue-600" },
    { label: "Active Bids", value: "8", icon: Package, color: "text-green-600" },
    { label: "Potential Earnings", value: "$36,500", icon: DollarSign, color: "text-purple-600" },
    { label: "Bid Success Rate", value: "76%", icon: TrendingUp, color: "text-orange-600" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {fleetMetrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="ov-card p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-3">
                <span className="ov-tick">
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </span>
              </div>
              <p className="ov-num text-[32px] leading-none text-[#14161A] mb-2">{metric.value}</p>
              <p className="ov-num text-[11px] uppercase tracking-[0.12em] text-[#A9A29A]">{metric.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FleetMetrics;
