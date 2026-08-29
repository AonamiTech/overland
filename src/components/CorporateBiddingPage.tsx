
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const CorporateBiddingPage = () => {
  const { toast } = useToast();
  const [selectedRFQ, setSelectedRFQ] = useState(null);

  const activeRFQs = [
    {
      id: 'RFQ001',
      route: 'Dallas → Los Angeles',
      cargoType: 'Electronics',
      weight: '11,000 lbs',
      budgetRange: '$2,200 – $2,800',
      deadline: '6 hrs left',
      bidsReceived: 12
    },
    {
      id: 'RFQ002',
      route: 'Chicago → Atlanta',
      cargoType: 'Textiles',
      weight: '6,600 lbs',
      budgetRange: '$1,400 – $1,900',
      deadline: '2 days left',
      bidsReceived: 8
    }
  ];

  const myBids = [
    {
      rfqId: 'RFQ001',
      myBid: '$2,500',
      truckNo: 'TX-4821',
      status: 'Pending',
      statusColor: 'bg-yellow-500'
    },
    {
      rfqId: 'RFQ002',
      myBid: '$1,650',
      truckNo: 'TX-7635',
      status: 'Won',
      statusColor: 'bg-green-500'
    }
  ];

  const handleSubmitBid = () => {
    toast({
      title: "Success",
      description: "Bid submitted successfully",
    });
    setSelectedRFQ(null);
  };

  return (
    <DashboardLayout 
      userRole="fleet" 
      userName="Fleet Owner" 
      userId="FO123456" 
      isVerified={true}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm" style={{ color: '#5B6470' }}>
          Dashboard &gt; Corporate Bidding
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="ov-eyebrow mb-2"><span className="dot" />CORPORATE BIDDING</div>
          <h1 className="ov-display text-3xl">Corporate Bidding Dashboard</h1>
        </div>

        {/* Verification Banner */}
        <Card className="ov-card" style={{ borderColor: '#B6D8C4', background: 'rgba(15,122,74,0.05)' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold" style={{ color: '#0F7A4A' }}>Verified – You can bid on enterprise loads</h3>
                <p className="text-sm mt-1" style={{ color: '#0F7A4A' }}>Access to high-value corporate contracts available.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active RFQs */}
        <Card className="ov-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ov-display">Active RFQs</CardTitle>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    <SelectItem value="north">Northeast</SelectItem>
                    <SelectItem value="south">Southeast</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>RFQ/Load ID</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Route</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Cargo & Weight</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Budget Range</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Deadline</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Bids</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRFQs.map((rfq) => (
                  <TableRow key={rfq.id} className="hover:bg-[#FBFAF8]">
                    <TableCell>
                      <button
                        className="ov-num h-auto p-0 font-medium"
                        style={{ color: '#0E32E8' }}
                        onClick={() => setSelectedRFQ(rfq)}
                      >
                        {rfq.id}
                      </button>
                    </TableCell>
                    <TableCell>{rfq.route}</TableCell>
                    <TableCell className="ov-num">{rfq.cargoType} – {rfq.weight}</TableCell>
                    <TableCell className="ov-num">{rfq.budgetRange}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="ov-num" style={{ color: '#A8412F', borderColor: '#E0B3A9' }}>
                        {rfq.deadline}
                      </Badge>
                    </TableCell>
                    <TableCell className="ov-num">{rfq.bidsReceived}</TableCell>
                    <TableCell>
                      <button
                        className="ov-btn ov-btn-ink text-xs px-3 py-2"
                        onClick={() => setSelectedRFQ(rfq)}
                      >
                        View Bids
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Your Bids History */}
        <Card className="ov-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="ov-display">Your Past Bids</CardTitle>
              <button className="ov-btn ov-btn-outline text-sm">Download Report</button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>RFQ ID</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Your Bid</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Proposed Truck No.</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Status</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBids.map((bid) => (
                  <TableRow key={bid.rfqId} className="hover:bg-[#FBFAF8]">
                    <TableCell className="ov-num font-medium" style={{ color: '#0E32E8' }}>{bid.rfqId}</TableCell>
                    <TableCell className="ov-num">{bid.myBid}</TableCell>
                    <TableCell className="ov-num">{bid.truckNo}</TableCell>
                    <TableCell>
                      <Badge className={`${bid.statusColor} text-white`}>
                        {bid.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button className="ov-btn ov-btn-outline text-xs px-3 py-2">View RFQ</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* RFQ Detail Modal */}
        {selectedRFQ && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="ov-card w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="ov-display">RFQ Details <span className="ov-num">{selectedRFQ.id}</span></CardTitle>
                  <button className="ov-btn ov-btn-ghost px-2 py-1" onClick={() => setSelectedRFQ(null)}>×</button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* RFQ Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Route</Label>
                    <p className="font-medium" style={{ color: '#14161A' }}>{selectedRFQ.route}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Cargo Type</Label>
                    <p className="font-medium" style={{ color: '#14161A' }}>{selectedRFQ.cargoType}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Weight</Label>
                    <p className="ov-num font-medium" style={{ color: '#14161A' }}>{selectedRFQ.weight}</p>
                  </div>
                  <div>
                    <Label className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Budget Range</Label>
                    <p className="ov-num font-medium" style={{ color: '#14161A' }}>{selectedRFQ.budgetRange}</p>
                  </div>
                </div>

                {/* Bid Form */}
                <div className="pt-6" style={{ borderTop: '1px solid #E7E3DC' }}>
                  <h3 className="ov-display text-lg mb-4">Submit Your Bid</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="proposedRate">Proposed Rate ($)</Label>
                      <Input id="proposedRate" placeholder="2500" />
                    </div>
                    <div>
                      <Label htmlFor="pickupDate">Estimated Pickup Date & Time</Label>
                      <Input id="pickupDate" type="datetime-local" />
                    </div>
                    <div>
                      <Label htmlFor="vehicleAvailability">Estimated Vehicle Availability</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select truck" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TX-4821">TX-4821</SelectItem>
                          <SelectItem value="TX-7635">TX-7635</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="remarks">Remarks (Optional)</Label>
                      <Textarea id="remarks" placeholder="Any special notes..." maxLength={250} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6" style={{ borderTop: '1px solid #E7E3DC' }}>
                  <button className="ov-btn ov-btn-outline" onClick={() => setSelectedRFQ(null)}>
                    Cancel
                  </button>
                  <button className="ov-btn ov-btn-ink" onClick={handleSubmitBid}>
                    Submit Bid
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CorporateBiddingPage;
