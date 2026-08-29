
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock } from 'lucide-react';

interface AutoBidBannerProps {
  autoBidMode: boolean;
}

const AutoBidBanner = ({ autoBidMode }: AutoBidBannerProps) => {
  if (!autoBidMode) return null;

  return (
    <Card className="ov-card p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(15,122,74,0.10)' }}>
              <Zap className="w-6 h-6 text-[#0F7A4A]" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="ov-display text-lg text-[#14161A]">Auto-Bid Mode Active</h3>
              <p className="text-[#5B6470] text-sm">System placing competitive bids on suitable loads automatically</p>
            </div>
          </div>
          <Badge className="bg-[#0F7A4A] text-white px-3 py-1">
            <Clock className="w-4 h-4 mr-2" strokeWidth={1.8} />
            <span className="ov-num uppercase tracking-[0.1em]">Live</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoBidBanner;
