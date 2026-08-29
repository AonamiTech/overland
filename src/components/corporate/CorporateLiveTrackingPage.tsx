
import React, { useState } from 'react';
import Plate from '@/components/ui/Plate';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from '../DashboardLayout';
import { MapPin, List, Settings, RefreshCw, Phone, FileText, Share2, AlertTriangle, BarChart3, Target, Download } from 'lucide-react';

const CorporateLiveTrackingPage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'map' or 'list'

  const trackingData = [
    {
      truckNo: 'TX-1234-AB',
      currentLocation: 'Los Angeles, California',
      lastUpdated: '2 min ago',
      route: 'Dallas → Los Angeles',
      progress: 65,
      eta: 'Tomorrow 2:30 PM',
      status: 'On-time',
      speed: '65 mph',
      driver: 'Mike Sullivan',
      driverPhone: '(214) 555-0142',
      broker: 'ABC Logistics',
      brokerRating: 4.8,
      loadDescription: 'Electronics',
      loadValue: '$100,000',
      insured: true
    },
    {
      truckNo: 'TX-5678-CD',
      currentLocation: 'Kansas City, Missouri',
      lastUpdated: '5 min ago',
      route: 'Chicago → Dallas',
      progress: 45,
      eta: 'Day After Tomorrow 6:00 PM',
      status: 'Delayed',
      speed: '55 mph',
      driver: 'Carlos Ramirez',
      driverPhone: '(312) 555-0178',
      broker: 'XYZ Freight',
      brokerRating: 4.6,
      loadDescription: 'Textiles',
      loadValue: '$70,000',
      insured: true
    }
  ];

  return (
    <DashboardLayout
      userRole="corporate"
      userName="Sarah Mitchell"
      userId="CC12345678"
      isVerified={false}
      verificationStatus="pending"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm ov-num" style={{ color: '#5B6470' }}>
          Dashboard &gt; Live Tracking
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="ov-eyebrow"><span className="dot" />Live Tracking</div>
          <h1 className="ov-display text-3xl mb-2 flex items-center gap-3" style={{ color: '#14161A' }}>
            <MapPin className="w-7 h-7" style={{ color: '#0E32E8' }} />
            Live Truck Tracking
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <span style={{ color: '#3E3F46' }}>Total Active Trucks: <span className="ov-num font-semibold" style={{ color: '#14161A' }}>2</span></span>
            <Badge variant="outline" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>
              <div className="w-2 h-2 rounded-full mr-2" style={{ background: '#0F7A4A' }}></div>
              On-time: 1
            </Badge>
            <Badge variant="outline" style={{ color: '#B45309', borderColor: '#B45309' }}>
              <div className="w-2 h-2 rounded-full mr-2" style={{ background: '#B45309' }}></div>
              Delayed: 1
            </Badge>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? 'ov-btn ov-btn-ink' : 'ov-btn ov-btn-outline'}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'ov-btn ov-btn-ink' : 'ov-btn ov-btn-outline'}
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Set Alerts
            </Button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <Card className="ov-card">
            <CardContent className="p-0">
              <div className="h-96 rounded-[18px] flex items-center justify-center" style={{ background: '#FBFAF8' }}>
                <div className="text-center">
                  <MapPin className="w-20 h-20 mx-auto mb-4" style={{ color: '#A9A29A' }} />
                  <p className="text-lg mb-2" style={{ color: '#3E3F46' }}>Interactive map with truck locations</p>
                  <p className="text-sm" style={{ color: '#5B6470' }}>Click on truck pins to view details</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {trackingData.map((truck) => (
              <Card key={truck.truckNo} className="ov-card ov-card--hover">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="ov-display text-lg flex items-center gap-2" style={{ color: '#14161A' }}>
                      <Target className="w-5 h-5" style={{ color: '#0E32E8' }} />
                      <Plate value={truck.truckNo} />
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Driver
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Full Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wide flex items-center gap-2" style={{ color: '#5B6470' }}>
                          <MapPin className="w-4 h-4" />
                          Current Location
                        </p>
                        <p className="font-medium" style={{ color: '#14161A' }}>{truck.currentLocation} <span className="ov-num" style={{ color: '#5B6470' }}>(last updated {truck.lastUpdated})</span></p>
                      </div>

                      <div>
                        <p className="text-xs font-mono uppercase tracking-wide flex items-center gap-2" style={{ color: '#5B6470' }}>
                          <Target className="w-4 h-4" />
                          Route Progress
                        </p>
                        <p className="font-medium" style={{ color: '#14161A' }}>{truck.route}</p>
                        <div className="w-full rounded-full h-2 mt-1" style={{ background: '#ECE8E1' }}>
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${truck.progress}%`, background: '#0E32E8' }}
                          ></div>
                        </div>
                        <p className="text-xs ov-num mt-1" style={{ color: '#5B6470' }}>Progress: {truck.progress}%</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>ETA</p>
                          <p className="font-medium ov-num" style={{ color: '#14161A' }}>{truck.eta}</p>
                          <Badge variant={truck.status === 'On-time' ? 'default' : 'destructive'} className="mt-1">
                            {truck.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Speed</p>
                          <p className="font-medium ov-num" style={{ color: '#14161A' }}>{truck.speed}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wide flex items-center gap-2" style={{ color: '#5B6470' }}>
                          <Phone className="w-4 h-4" />
                          Driver
                        </p>
                        <p className="font-medium" style={{ color: '#14161A' }}>{truck.driver} <span className="ov-num">({truck.driverPhone})</span></p>
                      </div>

                      <div>
                        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Broker</p>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium" style={{ color: '#14161A' }}>{truck.broker}</span>
                          <Badge variant="outline" className="ov-num">{truck.brokerRating}/5</Badge>
                          <Badge variant="outline" style={{ color: '#0F7A4A', borderColor: '#0F7A4A' }}>Verified</Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono uppercase tracking-wide" style={{ color: '#5B6470' }}>Load</p>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-medium" style={{ color: '#14161A' }}>{truck.loadDescription} – <span className="ov-num">{truck.loadValue}</span></span>
                          {truck.insured && (
                            <Badge variant="outline" style={{ color: '#0E32E8', borderColor: '#0E32E8' }}>
                              <Target className="w-3 h-3 mr-1" />
                              Insured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#ECE8E1' }}>
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Location
                      </Button>
                      <Button variant="outline" size="sm" style={{ color: '#A8412F', borderColor: '#A8412F' }}>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Report Issue
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Trip Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Export & Actions */}
        <div className="flex justify-between items-center pt-6">
          <Button className="ov-btn ov-btn-ink">
            View All 2 Trucks
          </Button>
          <Button variant="outline" className="ov-btn ov-btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export Tracking Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CorporateLiveTrackingPage;
