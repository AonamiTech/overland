import React, { useState } from 'react';
import Plate from '@/components/ui/Plate';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { FileArchive, Upload, Pencil, Satellite, Medal, Route, TrendingUp, TrendingDown, MapPin } from 'lucide-react';

const FleetManagementPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTrucks, setSelectedTrucks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isGpsSetupOpen, setIsGpsSetupOpen] = useState(false);

  const fleetData = [
    {
      truckNo: 'TX-1234-AB',
      location: 'Los Angeles',
      status: 'Active',
      statusColor: 'bg-green-500',
      driver: 'Mike Johnson',
      driverPhone: '(213) 555-0198',
      lastUpdated: '2 min ago',
      avatar: 'MJ'
    },
    {
      truckNo: 'TX-5678-CD',
      location: 'Dallas',
      status: 'Available',
      statusColor: 'bg-orange-500',
      driver: 'Carlos Rivera',
      driverPhone: '(214) 555-0142',
      lastUpdated: '5 min ago',
      avatar: 'CR'
    },
    {
      truckNo: 'AZ-9012-EF',
      location: 'Phoenix',
      status: 'Maintenance',
      statusColor: 'bg-red-500',
      driver: 'David Miller',
      driverPhone: '(602) 555-0176',
      lastUpdated: '1 hr ago',
      avatar: 'DM'
    }
  ];

  const bulkOperationSteps = [
    {
      step: 1,
      title: 'Download Template',
      description: 'Pre-fill your fleet data using a structured CSV',
      icon: FileArchive,
      action: () => toast({ title: "Template Downloaded", description: "Fleet data template downloaded successfully" })
    },
    {
      step: 2,
      title: 'Upload Fleet Data',
      description: 'Upload your entire fleet with real-time validation',
      icon: Upload,
      action: () => toast({ title: "Upload Started", description: "Fleet data upload in progress" })
    },
    {
      step: 3,
      title: 'Bulk Edit Selected',
      description: 'Modify details for selected vehicles quickly',
      icon: Pencil,
      action: () => toast({ title: "Bulk Edit", description: `Editing ${selectedTrucks.length} selected trucks` })
    },
    {
      step: 4,
      title: 'Sync GPS Data',
      description: 'Pull GPS updates across all listed trucks',
      icon: Satellite,
      action: () => toast({ title: "GPS Sync Complete", description: "All GPS data synchronized" })
    }
  ];

  const performanceMetrics = [
    {
      title: 'Top Performer',
      details: 'TX-1234-AB - 98% On-Time',
      icon: Medal,
      action: 'View Report',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Best Route',
      details: 'Denver → Los Angeles - 85% Util.',
      icon: Route,
      action: 'Route Analysis',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Top Earner',
      details: 'TX-5678-CD - $32,000/month',
      icon: TrendingUp,
      action: 'Breakdown',
      gradient: 'from-green-400 to-emerald-500'
    }
  ];

  const handleTruckSelection = (truckNo: string) => {
    setSelectedTrucks(prev => 
      prev.includes(truckNo) 
        ? prev.filter(t => t !== truckNo)
        : [...prev, truckNo]
    );
  };

  return (
    <DashboardLayout 
      userRole="fleet" 
      userName="Fleet Owner" 
      userId="FO123456" 
      isVerified={true}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm mb-4" style={{ color: '#5B6470' }}>
            Dashboard &gt; Fleet Management
          </nav>
          <span className="ov-eyebrow mb-3"><span className="dot" />Fleet Management</span>
          <h1 className="ov-display text-4xl mb-2 mt-3">Comprehensive Fleet Dashboard</h1>
          <p className="text-lg" style={{ color: '#5B6470' }}>Manage your entire fleet with advanced operations and real-time insights</p>
        </div>

        {/* Split Layout: Operations (Left) + Live Metrics (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Section: Bulk Operations */}
          <div className="xl:col-span-2">
            <Card className="ov-card overflow-hidden">
              <CardHeader className="border-b" style={{ borderColor: '#ECE8E1' }}>
                <CardTitle className="ov-display text-2xl flex items-center space-x-3">
                  <span className="ov-tick" style={{ width: 36, height: 36, borderRadius: 12 }}>
                    <Satellite className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <span>Bulk Operations</span>
                </CardTitle>
                <p style={{ color: '#5B6470' }}>Streamlined fleet management workflow</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bulkOperationSteps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.step}
                        className="ov-card ov-card--hover group relative p-6 cursor-pointer"
                        onClick={step.action}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(14,50,232,0.08)' }}>
                            <Icon className="w-8 h-8" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="ov-num w-6 h-6 text-white rounded-full text-xs flex items-center justify-center" style={{ background: '#111217' }}>
                                {step.step}
                              </span>
                              <h3 className="font-bold text-sm" style={{ color: '#14161A' }}>{step.title}</h3>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: '#5B6470' }}>{step.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section: Fleet Overview */}
          <div className="space-y-6">
            <Card className="ov-card overflow-hidden">
              <CardHeader className="border-b" style={{ borderColor: '#ECE8E1' }}>
                <CardTitle className="ov-display text-xl">Fleet Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="ov-num text-4xl font-semibold mb-2" style={{ color: '#14161A' }}>35</div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Total Trucks</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0F7A4A' }}></div>
                      <span className="ov-num text-lg font-semibold" style={{ color: '#0F7A4A' }}>28</span>
                    </div>
                    <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Active</div>
                  </div>

                  <div className="text-center p-4 rounded-xl" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#A9A29A' }}></div>
                      <span className="ov-num text-lg font-semibold" style={{ color: '#5B6470' }}>7</span>
                    </div>
                    <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Idle</div>
                  </div>

                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(14,50,232,0.06)', border: '1px solid #E7E3DC' }}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0E32E8' }}></div>
                      <span className="ov-num text-lg font-semibold" style={{ color: '#0E32E8' }}>14</span>
                    </div>
                    <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>In Transit</div>
                  </div>

                  <div className="text-center p-4 rounded-xl" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#B45309' }}></div>
                      <span className="ov-num text-lg font-semibold" style={{ color: '#B45309' }}>18</span>
                    </div>
                    <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Available</div>
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(14,50,232,0.06)', border: '1px solid #E7E3DC' }}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5" style={{ color: '#0E32E8' }} strokeWidth={1.8} />
                    <span className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>$28,000</span>
                  </div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: '#5B6470' }}>Revenue Today</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Location API Setup */}
        <Collapsible open={isGpsSetupOpen} onOpenChange={setIsGpsSetupOpen}>
          <Card className="ov-card overflow-hidden">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-[#FBFAF8] transition-colors duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="ov-tick" style={{ width: 44, height: 44, borderRadius: 14 }}>
                      <MapPin className="w-6 h-6" strokeWidth={1.8} />
                    </span>
                    <div className="text-left">
                      <CardTitle className="ov-display text-2xl">Live Location API Setup</CardTitle>
                      <p className="text-sm" style={{ color: '#5B6470' }}>GPS tracking and fleet monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#0F7A4A' }}></div>
                      <span className="font-medium" style={{ color: '#0F7A4A' }}>Connected</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Select defaultValue="jiomotive">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="GPS Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jiomotive">Samsara</SelectItem>
                          <SelectItem value="mapmyindia">Motive</SelectItem>
                          <SelectItem value="custom">Custom API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                      <p className="text-sm" style={{ color: '#3E3F46' }}>
                        <span className="font-semibold">GPS Enabled:</span> <span className="ov-num">32/35</span> trucks
                      </p>
                      <Button variant="link" className="h-auto p-0 mt-2" style={{ color: '#0E32E8' }}>
                        Enable remaining trucks →
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <button type="button" className="ov-btn ov-btn-outline w-full">
                      Test Connection
                    </button>
                    <button type="button" className="ov-btn ov-btn-outline w-full">
                      View Benefits
                    </button>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Fleet Listing */}
        <Card className="ov-card overflow-hidden">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="ov-display text-2xl">Fleet Listing</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    Cards
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <Input
                placeholder="Search truck number or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lg:w-64"
              />
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {selectedTrucks.length > 0 && (
                  <Button variant="default" size="sm">
                    Bulk Edit ({selectedTrucks.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: '#ECE8E1' }}>
                  <TableHead className="w-12 text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTrucks(fleetData.map(truck => truck.truckNo));
                        } else {
                          setSelectedTrucks([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>Truck Details</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>Location</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>Driver</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>Last Updated</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5B6470' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleetData.map((truck) => (
                  <TableRow key={truck.truckNo} className="hover:bg-[#FBFAF8]" style={{ borderColor: '#ECE8E1' }}>
                    <TableCell>
                      <input 
                        type="checkbox"
                        className="rounded"
                        checked={selectedTrucks.includes(truck.truckNo)}
                        onChange={() => handleTruckSelection(truck.truckNo)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 ${truck.statusColor} rounded-full`}></div>
                        <div>
                          <Plate value={truck.truckNo} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" style={{ color: '#A9A29A' }} strokeWidth={1.8} />
                        <span style={{ color: '#3E3F46' }}>{truck.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${truck.statusColor} text-white border-0`}>
                        {truck.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="ov-num w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#F1EEE8', color: '#14161A' }}>
                          {truck.avatar}
                        </div>
                        <div>
                          <div className="font-medium" style={{ color: '#14161A' }}>{truck.driver}</div>
                          <div className="ov-num text-sm" style={{ color: '#5B6470' }}>{truck.driverPhone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full animate-ping" style={{ background: '#0F7A4A' }}></div>
                        <span className="ov-num text-sm" style={{ color: '#5B6470' }}>{truck.lastUpdated}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" title="Edit">
                          <Pencil className="w-4 h-4" strokeWidth={1.8} />
                        </Button>
                        <Button variant="ghost" size="sm" title="GPS Trace">
                          <MapPin className="w-4 h-4" strokeWidth={1.8} />
                        </Button>
                        <Button variant="ghost" size="sm" title="More options">
                          ⋯
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Tiles */}
        <Card className="ov-card overflow-hidden">
          <CardHeader>
            <CardTitle className="ov-display text-2xl">Performance Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {performanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={index}
                    className="ov-card ov-card--hover relative p-6"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="ov-tick" style={{ width: 44, height: 44, borderRadius: 14 }}>
                        <Icon className="w-6 h-6" strokeWidth={1.8} />
                      </span>
                      <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>{metric.title}</h3>
                    </div>
                    <p className="text-sm mb-4" style={{ color: '#5B6470' }}>{metric.details}</p>
                    <button type="button" className="ov-btn ov-btn-outline w-full">
                      {metric.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FleetManagementPage;
