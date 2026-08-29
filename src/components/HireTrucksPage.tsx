
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ChevronRight, 
  Search, 
  MapPin, 
  Phone, 
  Truck, 
  Star, 
  Shield, 
  Navigation, 
  Calendar,
  Clock,
  Weight,
  Snowflake,
  TrendingUp,
  Filter,
  Map
} from "lucide-react";
import DashboardLayout from './DashboardLayout';

const HireTrucksPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    truckType: '',
    availability: '',
    location: '',
    capacity: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);

  const trucks = [
    {
      id: 1,
      number: 'TX-1234-AB',
      owner: 'Summit Freight',
      verified: true,
      location: 'Dallas, TX',
      availableFrom: '2024-01-15 10:00',
      capacity: '10 tons',
      features: ['gps', 'refrigerated'],
      rate: '$2.80/mi',
      marketAverage: '$3.00/mi',
      trend: 'down',
      rating: 4.8,
      onTimePercentage: 95,
      totalTrips: 234,
      photo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
      isTopRated: true,
      isCheapest: false
    },
    {
      id: 2,
      number: 'CA-5678-CD',
      owner: 'Pacific Logistics',
      verified: true,
      location: 'Los Angeles, CA',
      availableFrom: '2024-01-15 14:30',
      capacity: '15 tons',
      features: ['gps'],
      rate: '$3.20/mi',
      marketAverage: '$3.40/mi',
      trend: 'up',
      rating: 4.6,
      onTimePercentage: 88,
      totalTrips: 156,
      photo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400',
      isTopRated: false,
      isCheapest: true
    }
  ];

  const filteredTrucks = trucks.filter(truck => 
    truck.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHire = (truck: any) => {
    setSelectedTruck(truck);
    setShowHireModal(true);
  };

  const confirmHire = () => {
    console.log('Hiring truck:', selectedTruck);
    setShowHireModal(false);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗️' : '↘️';
  };

  return (
    <DashboardLayout
      userRole="broker"
      userName="Mike Johnson"
      userId="BR123456"
      isVerified={false}
      verificationStatus="not-started"
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm font-medium" style={{ color: '#5B6470' }}>
          <span className="cursor-pointer transition-colors hover:text-[#0E32E8]">Dashboard</span>
          <ChevronRight className="w-4 h-4 mx-2" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
          <span style={{ color: '#14161A' }}>Hire Verified Trucks</span>
        </div>

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="ov-eyebrow"><span className="dot" />Marketplace</span>
              <h1 className="ov-display text-4xl mt-2">Hire Verified Trucks</h1>
              <p className="text-lg" style={{ color: '#5B6470' }}>Premium logistics marketplace • Real-time availability • Verified drivers</p>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center space-x-2 px-3 py-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#0F7A4A' }}></div>
                <span className="text-sm"><span className="ov-num">{filteredTrucks.length}</span> trucks available</span>
              </Badge>
            </div>
          </div>

          {/* Enhanced Filter Panel */}
          <Card className="ov-card">
            <CardContent className="p-6">
              {/* Primary Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <Input
                    placeholder="Search by truck number, owner name, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg rounded-xl"
                    style={{ background: '#FBFAF8', borderColor: '#E7E3DC' }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 rounded-lg"
                  >
                    <Search className="w-4 h-4" strokeWidth={1.8} />
                  </Button>
                </div>
              </div>

              {/* Smart Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <Select value={filters.truckType} onValueChange={(value) => setFilters(prev => ({ ...prev, truckType: value }))}>
                      <SelectTrigger className="w-40 rounded-lg border-gray-300">
                        <SelectValue placeholder="Truck Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mini">Mini (up to 2T)</SelectItem>
                        <SelectItem value="small">Small (2-5T)</SelectItem>
                        <SelectItem value="medium">Medium (5-10T)</SelectItem>
                        <SelectItem value="large">Large (10T+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
                      <SelectTrigger className="w-40 rounded-lg border-gray-300">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Available Now</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger className="w-40 rounded-lg border-gray-300">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">Dallas</SelectItem>
                        <SelectItem value="mumbai">Los Angeles</SelectItem>
                        <SelectItem value="bangalore">Chicago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-gray-500" />
                    <Select value={filters.capacity} onValueChange={(value) => setFilters(prev => ({ ...prev, capacity: value }))}>
                      <SelectTrigger className="w-40 rounded-lg border-gray-300">
                        <SelectValue placeholder="Capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Up to 5 tons</SelectItem>
                        <SelectItem value="10">Up to 10 tons</SelectItem>
                        <SelectItem value="15">Up to 15 tons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-3">
                  <div className="flex rounded-xl p-1" style={{ background: '#F1EEE8' }}>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Filter className="w-4 h-4 mr-2" strokeWidth={1.8} />
                      List View
                    </Button>
                    <Button
                      variant={viewMode === 'map' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('map')}
                      className={`rounded-lg ${viewMode === 'map' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Map className="w-4 h-4 mr-2" strokeWidth={1.8} />
                      Map View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {Object.values(filters).some(v => v) && (
                <div className="flex items-center space-x-2 mt-4">
                  <span className="text-sm" style={{ color: '#5B6470' }}>Active filters:</span>
                  {Object.entries(filters).map(([key, value]) =>
                    value && (
                      <Badge key={key} variant="outline" className="rounded-full">
                        {value}
                        <button className="ml-1" style={{ color: '#A9A29A' }}>×</button>
                      </Badge>
                    )
                  )}
                  <Button variant="ghost" size="sm" style={{ color: '#0E32E8' }}>
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Premium Truck Cards */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {filteredTrucks.map((truck) => (
              <Card key={truck.id} className="ov-card ov-card--hover">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                    {/* Main Truck Info */}
                    <div className="flex items-start space-x-6 flex-1">
                      <div className="relative">
                        <img
                          src={truck.photo}
                          alt={`Truck ${truck.number}`}
                          className="w-24 h-24 rounded-xl object-cover"
                          style={{ border: '1px solid #E7E3DC' }}
                        />
                        {truck.verified && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0F7A4A' }}>
                            <Shield className="w-3 h-3 text-white" strokeWidth={1.8} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        {/* Truck Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="ov-num text-xl font-semibold" style={{ color: '#14161A' }}>{truck.number}</h3>
                          {truck.verified && (
                            <Badge variant="outline" className="rounded-full" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>
                              <Shield className="w-3 h-3 mr-1" strokeWidth={1.8} />
                              Verified
                            </Badge>
                          )}
                          {truck.isTopRated && (
                            <Badge variant="outline" className="rounded-full" style={{ color: '#B45309', borderColor: '#E7E3DC' }}>
                              Top Rated
                            </Badge>
                          )}
                          {truck.isCheapest && (
                            <Badge variant="outline" className="rounded-full" style={{ color: '#0E32E8', borderColor: '#E7E3DC', background: 'rgba(14,50,232,0.08)' }}>
                              Best Rate
                            </Badge>
                          )}
                        </div>

                        <p className="mb-3 font-medium" style={{ color: '#5B6470' }}>Owner: {truck.owner}</p>

                        {/* Truck Details Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                            <span style={{ color: '#3E3F46' }}>Current: <strong style={{ color: '#14161A' }}>{truck.location}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                            <span style={{ color: '#3E3F46' }}>Available: <strong className="ov-num" style={{ color: '#14161A' }}>{truck.availableFrom}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Weight className="w-4 h-4" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                            <span style={{ color: '#3E3F46' }}>Capacity: <strong className="ov-num" style={{ color: '#14161A' }}>{truck.capacity}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4" style={{ color: '#B45309' }} strokeWidth={1.8} />
                            <span style={{ color: '#3E3F46' }}><strong className="ov-num" style={{ color: '#14161A' }}>{truck.rating}</strong> (<span className="ov-num">{truck.totalTrips}</span> trips)</span>
                          </div>
                        </div>

                        {/* Features & Badges */}
                        <div className="flex items-center space-x-2 mt-3">
                          {truck.features.includes('gps') && (
                            <Badge variant="outline" className="rounded-full" style={{ color: '#0E32E8', borderColor: '#E7E3DC', background: 'rgba(14,50,232,0.08)' }}>
                              <Navigation className="w-3 h-3 mr-1" strokeWidth={1.8} />
                              GPS Tracking
                            </Badge>
                          )}
                          {truck.features.includes('refrigerated') && (
                            <Badge variant="outline" className="rounded-full" style={{ color: '#0E32E8', borderColor: '#E7E3DC', background: 'rgba(14,50,232,0.08)' }}>
                              <Snowflake className="w-3 h-3 mr-1" strokeWidth={1.8} />
                              Refrigerated
                            </Badge>
                          )}
                          <Badge variant="outline" className="rounded-full" style={{ color: '#0F7A4A', borderColor: '#E7E3DC' }}>
                            <span className="ov-num">{truck.onTimePercentage}%</span> On-Time
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="flex flex-col lg:items-end space-y-4 lg:min-w-[200px]">
                      {/* Premium Pricing Display */}
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="ov-num text-3xl font-semibold" style={{ color: '#14161A' }}>{truck.rate}</div>
                          <span className="text-sm">{getTrendIcon(truck.trend)}</span>
                        </div>
                        <div className="text-sm" style={{ color: '#5B6470' }}>
                          Market avg: <span className="ov-num line-through">{truck.marketAverage}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Star className="w-4 h-4" style={{ fill: '#B45309', color: '#B45309' }} />
                          <span className="ov-num font-semibold" style={{ color: '#14161A' }}>{truck.rating}</span>
                          <span style={{ color: '#A9A29A' }}>•</span>
                          <span className="text-sm" style={{ color: '#5B6470' }}><span className="ov-num">{truck.onTimePercentage}%</span> On-Time</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 w-full lg:w-auto">
                        <button type="button" className="ov-btn ov-btn-outline">
                          <Phone className="w-4 h-4" strokeWidth={1.8} />
                          Contact Driver
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHire(truck)}
                          className="ov-btn ov-btn-ink"
                        >
                          Hire Now
                          <ChevronRight className="w-4 h-4 arrow" strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="ov-card overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 rounded-[18px] flex items-center justify-center relative overflow-hidden" style={{ background: '#FBFAF8' }}>
                <div className="text-center z-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(14,50,232,0.08)' }}>
                    <Map className="w-8 h-8" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                  </div>
                  <h3 className="ov-display text-lg mb-2" style={{ color: '#14161A' }}>Interactive Map View</h3>
                  <p className="mb-1" style={{ color: '#5B6470' }}>Real-time truck locations and availability</p>
                  <p className="text-sm" style={{ color: '#A9A29A' }}>Showing <span className="ov-num">{filteredTrucks.length}</span> verified trucks in selected area</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Pagination */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm" style={{ color: '#5B6470' }}>Sort by:</span>
            <Select>
              <SelectTrigger className="w-48 rounded-lg">
                <SelectValue placeholder="Rate (Low → High)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rate-low">Rate (Low → High)</SelectItem>
                <SelectItem value="rate-high">Rate (High → Low)</SelectItem>
                <SelectItem value="rating">Rating (High → Low)</SelectItem>
                <SelectItem value="ontime">On-Time % (High → Low)</SelectItem>
                <SelectItem value="availability">Earliest Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-lg">Previous</Button>
            <span className="text-sm px-3" style={{ color: '#5B6470' }}>Page <span className="ov-num">1</span> of <span className="ov-num">5</span></span>
            <Button variant="outline" size="sm" className="rounded-lg">Next</Button>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expected Timeline */}
          <Card className="ov-card">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <span className="ov-tick" style={{ width: 44, height: 44, borderRadius: 14 }}>
                  <Clock className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Quick Response</h3>
                  <p style={{ color: '#5B6470' }}>Get confirmed bookings within ~5 minutes of inquiry</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quality Assurance */}
          <Card className="ov-card">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <span className="ov-tick" style={{ width: 44, height: 44, borderRadius: 14 }}>
                  <Shield className="w-6 h-6" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Quality Assurance</h3>
                  <p style={{ color: '#5B6470' }}>All trucks are verified and GPS-tracked for your peace of mind</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced Hire Modal */}
      <Dialog open={showHireModal} onOpenChange={setShowHireModal}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Truck className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
              <span className="ov-display">Hire Truck: <span className="ov-num">{selectedTruck?.number}</span></span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="p-4 rounded-xl" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: '#14161A' }}>Owner: {selectedTruck?.owner}</span>
                <Badge variant="outline" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>
                  <Shield className="w-3 h-3 mr-1" strokeWidth={1.8} />
                  Verified
                </Badge>
              </div>
              <div className="text-sm" style={{ color: '#5B6470' }}>
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="w-3 h-3" strokeWidth={1.8} />
                  <span>Current: {selectedTruck?.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-3 h-3" style={{ color: '#B45309' }} />
                  <span><span className="ov-num">{selectedTruck?.rating}</span> rating • <span className="ov-num">{selectedTruck?.onTimePercentage}%</span> on-time</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                  <span>Pickup Date & Time</span>
                </label>
                <Input type="datetime-local" className="rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rate Confirmation</label>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(14,50,232,0.06)', border: '1px solid #E7E3DC' }}>
                  <div className="flex items-center justify-between">
                    <span className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>{selectedTruck?.rate}</span>
                    <Badge variant="outline" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>
                      <TrendingUp className="w-3 h-3 mr-1" strokeWidth={1.8} />
                      Below Market
                    </Badge>
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#5B6470' }}>Market average: <span className="ov-num">{selectedTruck?.marketAverage}</span></p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Terms</label>
                <Select>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advance">95% Advance / 5% On Delivery</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="credit">30-day Credit Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={() => setShowHireModal(false)} className="ov-btn ov-btn-outline flex-1">
                Cancel
              </button>
              <button type="button" onClick={confirmHire} className="ov-btn ov-btn-ink flex-1">
                Confirm Hire
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HireTrucksPage;
