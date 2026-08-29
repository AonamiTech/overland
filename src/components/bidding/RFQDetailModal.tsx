
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { X, MapPin, Package, Clock, Users, Star, FileText, Truck, Shield } from 'lucide-react';

const RFQDetailModal = ({ rfq, isVerified, onClose }) => {
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState(rfq.budgetRange.min);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [remarks, setRemarks] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  const trucks = [
    { id: 'TRK001', number: 'TX 3948 AB', capacity: '10T', type: 'Dry Van' },
    { id: 'TRK002', number: 'IL 7721 CD', capacity: '15T', type: 'Flatbed' },
    { id: 'TRK003', number: 'CA 5567 EF', capacity: '20T', type: 'Reefer' }
  ];

  const topBids = [
    { rank: 1, amount: 3700, status: 'Leading' },
    { rank: 2, amount: 3650, status: 'Close' },
    { rank: 3, amount: 3600, status: 'Competitive' },
    { rank: 4, amount: 3500, status: 'Behind' },
    { rank: 5, amount: 3400, status: 'Low' }
  ];

  const handleSubmitBid = () => {
    if (!selectedTruck) {
      toast({
        title: "Error",
        description: "Please select a truck for this bid",
        variant: "destructive"
      });
      return;
    }

    if (!pickupDate) {
      toast({
        title: "Error", 
        description: "Please select pickup date",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `Bid of $${bidAmount.toLocaleString()} submitted successfully`,
    });
    onClose();
  };

  const canBid = rfq.isPremium ? isVerified : true;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ border: '1px solid #E7E3DC' }}>
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E7E3DC' }}>
          <div className="flex items-center space-x-3">
            <div className="ov-tick" style={{ width: 36, height: 36, borderRadius: 10 }}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="ov-display text-xl">RFQ Details <span className="ov-num">{rfq.id}</span></h2>
              <p style={{ color: '#5B6470' }}>{rfq.corporateClient}</p>
            </div>
          </div>
          <button className="ov-btn ov-btn-ghost px-2 py-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* RFQ Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="ov-card">
              <CardHeader>
                <CardTitle className="ov-display flex items-center space-x-2 text-lg">
                  <MapPin className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <span>Route Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>From</span>
                  <span className="font-medium" style={{ color: '#14161A' }}>{rfq.route.from}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>To</span>
                  <span className="font-medium" style={{ color: '#14161A' }}>{rfq.route.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>Distance</span>
                  <span className="ov-num font-medium" style={{ color: '#14161A' }}>~870 mi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>Est. Transit</span>
                  <span className="ov-num font-medium" style={{ color: '#14161A' }}>2-3 days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="ov-card">
              <CardHeader>
                <CardTitle className="ov-display flex items-center space-x-2 text-lg">
                  <Package className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <span>Cargo Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>Type</span>
                  <span className="font-medium" style={{ color: '#14161A' }}>{rfq.cargoType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>Weight</span>
                  <span className="ov-num font-medium" style={{ color: '#14161A' }}>{rfq.weight}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>Special Handling</span>
                  <Badge variant="outline" style={{ borderColor: '#E7E3DC', color: '#5B6470' }}>Temperature Controlled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#5B6470' }}>Insurance</span>
                  <Badge style={{ background: 'rgba(15,122,74,0.1)', color: '#0F7A4A' }}>Included</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Corporate Client Profile */}
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display flex items-center space-x-2 text-lg">
                <Shield className="w-5 h-5" style={{ color: '#0E32E8' }} />
                <span>Corporate Client Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Company</p>
                  <p className="font-medium" style={{ color: '#14161A' }}>{rfq.corporateClient}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Trust Rating</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#B45309' }} />
                    <span className="ov-num font-medium" style={{ color: '#14161A' }}>{rfq.trustRating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Payment Terms</p>
                  <p className="ov-num font-medium" style={{ color: '#14161A' }}>Net 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Bidding Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bid Leaderboard */}
            <Card className="ov-card">
              <CardHeader>
                <CardTitle className="ov-display flex items-center justify-between text-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" style={{ color: '#0E32E8' }} />
                    <span>Live Bids</span>
                  </div>
                  <Badge variant="outline" className="ov-num" style={{ borderColor: '#E7E3DC', color: '#5B6470' }}>{rfq.bidsReceived} Total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topBids.map((bid, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #ECE8E1' }}>
                      <div className="flex items-center space-x-3">
                        <div className="ov-num w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium" style={bid.rank === 1 ? { background: '#B45309', color: '#fff' } : { background: '#F1EEE8', color: '#5B6470' }}>
                          {bid.rank}
                        </div>
                        <span className="ov-num font-medium" style={{ color: '#14161A' }}>${bid.amount.toLocaleString()}</span>
                      </div>
                      <Badge variant={bid.status === 'Leading' ? 'default' : 'outline'} className="text-xs">
                        {bid.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bid Submission */}
            <Card className="ov-card">
              <CardHeader>
                <CardTitle className="ov-display flex items-center space-x-2 text-lg">
                  <Truck className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <span>Submit Your Bid</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!canBid && (
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(180,83,9,0.06)', border: '1px solid #E8C98A' }}>
                    <p className="text-sm" style={{ color: '#B45309' }}>
                      <Shield className="w-4 h-4 inline mr-1" />
                      Verification required to bid on premium RFQs
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Bid Amount ($)</Label>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={rfq.budgetRange.min}
                      max={rfq.budgetRange.max}
                      disabled={!canBid}
                    />
                    <Slider
                      value={[bidAmount]}
                      onValueChange={(value) => setBidAmount(value[0])}
                      min={rfq.budgetRange.min}
                      max={rfq.budgetRange.max}
                      step={500}
                      disabled={!canBid}
                      className="w-full"
                    />
                    <div className="flex justify-between ov-num text-xs" style={{ color: '#5B6470' }}>
                      <span>${rfq.budgetRange.min.toLocaleString()}</span>
                      <span>${rfq.budgetRange.max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Truck</Label>
                  <select
                    value={selectedTruck}
                    onChange={(e) => setSelectedTruck(e.target.value)}
                    disabled={!canBid}
                    className="w-full p-2 rounded-md" style={{ border: '1px solid #E7E3DC' }}
                  >
                    <option value="">Choose truck...</option>
                    {trucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>
                        {truck.number} - {truck.capacity} {truck.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Pickup Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    disabled={!canBid}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Any special notes or terms..."
                    disabled={!canBid}
                    maxLength={250}
                  />
                </div>

                <Separator />

                <div className="flex space-x-3">
                  <button onClick={onClose} className="ov-btn ov-btn-outline flex-1">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitBid}
                    disabled={!canBid}
                    className="ov-btn ov-btn-ink flex-1"
                    style={!canBid ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                  >
                    Submit Bid <span className="ov-num ml-1">${bidAmount.toLocaleString()}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents & Terms */}
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display flex items-center space-x-2 text-lg">
                <FileText className="w-5 h-5" style={{ color: '#0E32E8' }} />
                <span>Documents & Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                  <FileText className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <div>
                    <p className="font-medium" style={{ color: '#14161A' }}>RFQ Document</p>
                    <p className="ov-num text-sm" style={{ color: '#5B6470' }}>PDF • 2.3 MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                  <FileText className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <div>
                    <p className="font-medium" style={{ color: '#14161A' }}>Terms & Conditions</p>
                    <p className="ov-num text-sm" style={{ color: '#5B6470' }}>PDF • 1.1 MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ border: '1px solid #E7E3DC' }}>
                  <FileText className="w-5 h-5" style={{ color: '#0E32E8' }} />
                  <div>
                    <p className="font-medium" style={{ color: '#14161A' }}>Insurance Policy</p>
                    <p className="ov-num text-sm" style={{ color: '#5B6470' }}>PDF • 0.8 MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RFQDetailModal;
