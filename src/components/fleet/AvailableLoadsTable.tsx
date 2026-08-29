
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, MapPin } from 'lucide-react';

const AvailableLoadsTable = () => {
  const availableLoads = [
    {
      id: "LD-001",
      route: "Dallas → Los Angeles",
      cargo: "Electronics – 11,000 lbs",
      budget: "$2,200 – $2,800",
      deadline: "6 hrs left",
      distance: "1,435 mi",
      truckType: "Full Truck Load",
      status: "open"
    },
    {
      id: "LD-002",
      route: "Chicago → Atlanta",
      cargo: "Furniture – 6,600 lbs",
      budget: "$1,500 – $1,900",
      deadline: "2 days left",
      distance: "715 mi",
      truckType: "LTL",
      status: "open"
    }
  ];

  return (
    <Card className="ov-card p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="ov-display text-xl text-[#14161A] flex items-center">
          <Package className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
          Available Loads for Bidding
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E7E3DC]">
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Load ID</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Route</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Cargo</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Budget Range</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Distance</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Truck Type</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Deadline</th>
                <th className="px-6 py-3 text-left ov-num text-[11px] uppercase tracking-[0.1em] text-[#8B857C]">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableLoads.map((load) => (
                <tr key={load.id} className="border-t border-[#ECE8E1] hover:bg-[#FBFAF8]">
                  <td className="px-6 py-4">
                    <button className="ov-num text-[#0E32E8] hover:underline font-medium">
                      {load.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-[#14161A] flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-[#A9A29A]" strokeWidth={1.8} />
                    {load.route}
                  </td>
                  <td className="px-6 py-4 text-[#3E3F46]">{load.cargo}</td>
                  <td className="px-6 py-4 ov-num text-[#14161A]">{load.budget}</td>
                  <td className="px-6 py-4 ov-num text-[#14161A]">{load.distance}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-[#E7E3DC] text-[#5B6470]">{load.truckType}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="ov-num text-[#B45309] font-medium">{load.deadline}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" className="ov-btn ov-btn-ink mr-2">
                      Place Bid
                    </Button>
                    <Button size="sm" className="ov-btn ov-btn-outline">
                      <Eye className="w-4 h-4 mr-1" strokeWidth={1.8} />
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableLoadsTable;
