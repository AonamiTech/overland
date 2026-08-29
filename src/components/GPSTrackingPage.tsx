
import React, { useState } from 'react';
import Plate from '@/components/ui/Plate';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Truck, Phone, FileText, Share2, AlertTriangle, Download, Filter, Bell, Clock, Shield, User, Navigation, TrendingUp, Settings } from 'lucide-react';

const GPSTrackingPage = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('list'); // 'map' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const trackingData = [
    {
      truckNo: 'TX-8841-AB',
      currentLocation: 'Los Angeles, California',
      lastUpdated: '2 min ago',
      route: 'Dallas → Los Angeles',
      progress: 65,
      eta: 'Tomorrow 2:30 PM',
      status: 'On-time',
      statusColor: 'bg-green-500',
      speed: '65 mph',
      driver: 'Mike Johnson',
      driverPhone: '(213) 555-0198',
      broker: 'ABC Logistics',
      brokerRating: 4.8,
      loadDescription: 'Electronics',
      loadValue: '$85,000',
      insured: true,
      gpsSignal: 'strong'
    },
    {
      truckNo: 'CA-5678-CD',
      currentLocation: 'Phoenix, Arizona',
      lastUpdated: '5 min ago',
      route: 'Chicago → Dallas',
      progress: 45,
      eta: 'Day After Tomorrow 6:00 PM',
      status: 'Delayed',
      statusColor: 'bg-yellow-500',
      speed: '55 mph',
      driver: 'Carlos Rivera',
      driverPhone: '(602) 555-0142',
      broker: 'XYZ Transport',
      brokerRating: 4.6,
      loadDescription: 'Textiles',
      loadValue: '$42,000',
      insured: true,
      gpsSignal: 'weak'
    }
  ];

  const globalStats = {
    onTime: 3,
    delayed: 1,
    critical: 0
  };

  const handleCallDriver = (phone: string) => {
    toast({ title: "Calling Driver", description: `Initiating call to ${phone}` });
  };

  const handleShareLocation = (truckNo: string) => {
    toast({ title: "Location Shared", description: `Live location for ${truckNo} has been shared` });
  };

  const handleReportIssue = (truckNo: string) => {
    toast({ title: "Issue Reported", description: `Issue reported for truck ${truckNo}`, variant: "destructive" });
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
          Dashboard &gt; Live Tracking
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className="ov-eyebrow mb-3"><span className="dot" />Live Tracking</span>
          <h1 className="ov-display text-4xl mb-2 mt-3">Live Truck Tracking Dashboard</h1>
          <p className="text-lg" style={{ color: '#5B6470' }}>Real-time visibility into your active trucks, powered by verified GPS integrations</p>
        </div>

        {/* Global Overview Top Bar */}
        <Card className="ov-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Status Overview */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0F7A4A' }}></div>
                  <span className="font-semibold" style={{ color: '#0F7A4A' }}>On-Time: <span className="ov-num">{globalStats.onTime}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#B45309' }}></div>
                  <span className="font-semibold" style={{ color: '#B45309' }}>Delayed: <span className="ov-num">{globalStats.delayed}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#A8412F' }}></div>
                  <span className="font-semibold" style={{ color: '#A8412F' }}>Critical: <span className="ov-num">{globalStats.critical}</span></span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex space-x-1 rounded-lg p-1" style={{ background: '#F1EEE8' }}>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className={viewMode === 'map' ? 'bg-[#111217] hover:bg-black text-white' : ''}
                  >
                    <MapPin className="w-4 h-4 mr-2" strokeWidth={1.8} />
                    Map View
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-[#111217] hover:bg-black text-white' : ''}
                  >
                    <FileText className="w-4 h-4 mr-2" strokeWidth={1.8} />
                    List View
                  </Button>
                </div>

                {/* Search */}
                <Input
                  placeholder="Search truck number, driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />

                {/* Filter */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                {/* Alerts */}
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Alerts
                </Button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: '#ECE8E1' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="on-time">On-Time</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Routes</SelectItem>
                      <SelectItem value="delhi-mumbai">Dallas → Los Angeles</SelectItem>
                      <SelectItem value="bangalore-delhi">Chicago → Dallas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Broker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brokers</SelectItem>
                      <SelectItem value="abc-logistics">ABC Logistics</SelectItem>
                      <SelectItem value="xyz-transport">XYZ Transport</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Speed Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Speeds</SelectItem>
                      <SelectItem value="0-40">0-40 mph</SelectItem>
                      <SelectItem value="40-80">40-80 mph</SelectItem>
                      <SelectItem value="80+">80+ mph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map View */}
        {viewMode === 'map' && (
          <Card className="ov-card overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 rounded-[18px] flex items-center justify-center" style={{ background: '#FBFAF8' }}>
                <div className="text-center">
                  <MapPin className="w-24 h-24 mx-auto mb-4" style={{ color: '#A9A29A' }} strokeWidth={1.5} />
                  <p className="ov-display text-lg mb-2" style={{ color: '#14161A' }}>Interactive Live Tracking Map</p>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Real-time truck positions with route overlays</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View - Live Summary Cards */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {trackingData.map((truck) => (
              <Card key={truck.truckNo} className="ov-card ov-card--hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 ${truck.statusColor} rounded-full ${truck.gpsSignal === 'strong' ? 'animate-pulse' : ''}`}></div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-3">
                          <Truck className="w-6 h-6" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                          <Plate value={truck.truckNo} size="lg" />
                          <span className="text-base font-normal" style={{ color: '#A9A29A' }}>|</span>
                          <MapPin className="w-5 h-5" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                          <span className="text-base font-normal" style={{ color: '#3E3F46' }}>{truck.route}</span>
                        </CardTitle>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Progress</span>
                            <span className="ov-num text-sm font-semibold" style={{ color: '#0E32E8' }}>{truck.progress}% complete</span>
                          </div>
                          <div className="w-full rounded-full h-2" style={{ background: '#ECE8E1' }}>
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ width: `${truck.progress}%`, background: '#0E32E8' }}
                            ></div>
                          </div>
                        </div>

                        {/* GPS Ping Status */}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className={`w-2 h-2 rounded-full ${truck.gpsSignal === 'strong' ? 'animate-ping' : ''}`} style={{ background: truck.gpsSignal === 'strong' ? '#0F7A4A' : '#B45309' }}></div>
                          <span className="text-sm" style={{ color: '#5B6470' }}>GPS: Last updated <span className="ov-num">{truck.lastUpdated}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="ov-btn ov-btn-outline"
                        onClick={() => handleCallDriver(truck.driverPhone)}
                      >
                        <Phone className="w-4 h-4" strokeWidth={1.8} />
                        Call Driver
                      </button>
                      <button type="button" className="ov-btn ov-btn-outline">
                        <FileText className="w-4 h-4" strokeWidth={1.8} />
                        Trip Timeline
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>ETA</p>
                          <p className="ov-num font-semibold" style={{ color: '#14161A' }}>{truck.eta}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Speed</p>
                          <p className="ov-num font-semibold" style={{ color: '#14161A' }}>{truck.speed}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Load</p>
                          <p className="font-semibold" style={{ color: '#14161A' }}>{truck.loadDescription} – <span className="ov-num">{truck.loadValue}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Insurance</p>
                          <Badge variant="outline" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>
                            {truck.insured ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Navigation className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Status</p>
                          <Badge
                            variant="outline"
                            className={`${truck.statusColor} text-white border-0 ${truck.status === 'On-time' ? 'animate-pulse' : ''}`}
                          >
                            {truck.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5" style={{ color: '#5B6470' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Driver</p>
                          <p className="font-semibold" style={{ color: '#14161A' }}>{truck.driver} (<span className="ov-num">{truck.driverPhone}</span>)</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5" style={{ color: '#5B6470' }} strokeWidth={1.8} />
                        <div>
                          <p className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Broker</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold" style={{ color: '#14161A' }}>{truck.broker}</span>
                            <Badge variant="outline" className="ov-num">{truck.brokerRating}/5</Badge>
                            <Badge variant="outline" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>Verified</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4">
                        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: '#5B6470' }}>Actions</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleShareLocation(truck.truckNo)}
                            className="ov-btn ov-btn-outline w-full"
                          >
                            <Share2 className="w-4 h-4" strokeWidth={1.8} />
                            Share Location
                          </button>
                          <button type="button" className="ov-btn ov-btn-outline w-full">
                            <MapPin className="w-4 h-4" strokeWidth={1.8} />
                            View Route
                          </button>
                          <button
                            type="button"
                            className="ov-btn ov-btn-outline w-full"
                            style={{ color: '#A8412F', borderColor: '#A8412F' }}
                            onClick={() => handleReportIssue(truck.truckNo)}
                          >
                            <AlertTriangle className="w-4 h-4" strokeWidth={1.8} />
                            Report Issue
                          </button>
                          <button type="button" className="ov-btn ov-btn-outline w-full">
                            <Settings className="w-4 h-4" strokeWidth={1.8} />
                            Full Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bulk Tracking Controls */}
        <Card className="ov-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <button type="button" className="ov-btn ov-btn-ink">
                  <Download className="w-4 h-4" strokeWidth={1.8} />
                  Export Tracking Report
                </button>
                <button type="button" className="ov-btn ov-btn-outline">
                  <FileText className="w-4 h-4" strokeWidth={1.8} />
                  Download All Trip Logs
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-delayed">Most Delayed</SelectItem>
                    <SelectItem value="highest-load">Highest Load</SelectItem>
                    <SelectItem value="top-speed">Top Speed</SelectItem>
                    <SelectItem value="nearest-eta">Nearest ETA</SelectItem>
                  </SelectContent>
                </Select>

                <span className="text-sm" style={{ color: '#5B6470' }}>
                  Showing <span className="ov-num">{trackingData.length}</span> active trucks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GPSTrackingPage;
