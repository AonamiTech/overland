
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, DollarSign, User } from 'lucide-react';

const BrokerMetrics = () => {
  const brokerMetrics = [
    { label: "Active Loads Posted", value: "15", icon: Package, color: "text-blue-600", subtext: "Currently available for bidding" },
    { label: "Total Bids Received", value: "127", icon: User, color: "text-green-600", subtext: "Total across all active loads" },
    { label: "Avg Commission", value: "$1,850", icon: DollarSign, color: "text-purple-600", subtext: "Per confirmed booking" },
    { label: "Success Rate", value: "89%", icon: TrendingUp, color: "text-orange-600", subtext: "Awarded to posted loads ratio" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {brokerMetrics.map((metric, index) => {
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
              <p className="text-xs text-[#5B6470] mt-2">{metric.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BrokerMetrics;
