
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw } from 'lucide-react';

interface FleetHeaderProps {
  autoBidMode: boolean;
  setAutoBidMode: (value: boolean) => void;
  getTimeSinceUpdate: () => string;
}

const FleetHeader = ({ autoBidMode, setAutoBidMode, getTimeSinceUpdate }: FleetHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-[#0D0D11] text-white px-6 py-3 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="ov-livedot"></span>
          <span className="ov-num text-[11px] uppercase tracking-[0.12em] text-white/90">Fleet Bidding Mode</span>
        </div>
        <span className="text-white/60">Last Synced: <span className="ov-num">{getTimeSinceUpdate()}</span></span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <Label htmlFor="auto-mode" className="text-sm text-white/80">Auto-Bid</Label>
          <Switch
            id="auto-mode"
            checked={autoBidMode}
            onCheckedChange={setAutoBidMode}
          />
        </div>
        <Button size="sm" className="ov-btn ov-btn-light">
          <RefreshCw className="w-4 h-4 mr-2" strokeWidth={1.8} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default FleetHeader;
