
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '../DashboardLayout';
import { Shield, Truck, Package, History, AlertTriangle, Download, FileText, Phone } from 'lucide-react';

const CheckDot = () => (
  <span style={{ width: 5, height: 5, borderRadius: 99, background: '#0E32E8', flexShrink: 0 }} />
);

const CorporateInsuranceHubPage = () => {
  const { toast } = useToast();
  const [vehicleQuote, setVehicleQuote] = useState<string>('');
  const [cargoQuote, setCargoQuote] = useState<string>('');

  const handleGetQuote = (type: 'vehicle' | 'cargo') => {
    const quote = type === 'vehicle' ? '$ 1,500' : '$ 850';
    if (type === 'vehicle') {
      setVehicleQuote(quote);
    } else {
      setCargoQuote(quote);
    }
    toast({
      title: "Quote Generated",
      description: `Estimated Premium: ${quote}`,
    });
  };

  const handlePurchasePolicy = (type: 'vehicle' | 'cargo') => {
    const policyNo = `INS${Math.random().toString().substring(2, 8)}`;
    toast({
      title: "Policy Purchased",
      description: `Policy purchased - Policy No: ${policyNo}`,
    });
  };

  const policies = [
    {
      policyNo: 'INS123456',
      type: 'Vehicle',
      asset: 'TX-1234-AB',
      coverage: '$250,000',
      premium: '$1,500',
      status: 'Active'
    },
    {
      policyNo: 'INS789012',
      type: 'Cargo',
      asset: 'LD-TS-2024-001',
      coverage: '$100,000',
      premium: '$850',
      status: 'Active'
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
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm ov-num" style={{ color: '#8B857C' }}>Dashboard &gt; Insurance Hub</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <span className="ov-eyebrow"><span className="dot" />Enterprise Insurance</span>
        <h1 className="ov-display text-4xl mt-2">Insurance Hub</h1>
      </div>

      {/* Verification Banner */}
      <div className="mb-8 p-4 rounded-[14px]" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC', borderLeft: '3px solid #B45309' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5" style={{ color: '#B45309' }} />
            <span style={{ color: '#3E3F46' }}>
              Complete your business verification to enjoy in-transit insurance savings.
            </span>
          </div>
          <Button className="ov-btn ov-btn-ink">
            Complete Verification
          </Button>
        </div>
      </div>

      {/* Insurance Tabs */}
      <Tabs defaultValue="vehicle" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Vehicle Insurance
          </TabsTrigger>
          <TabsTrigger value="cargo" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Load (Cargo) Insurance
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History & Claims
          </TabsTrigger>
        </TabsList>

        {/* Vehicle Insurance Tab */}
        <TabsContent value="vehicle">
          <Card className="ov-card" style={{ background: '#FFFFFF' }}>
            <CardHeader>
              <CardTitle className="ov-display text-lg flex items-center gap-2">
                <Truck className="w-5 h-5" style={{ color: '#0E32E8' }} />
                Vehicle Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#3E3F46' }}>Select Vehicle</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a vehicle to insure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck1">TX-1234-AB (Large Truck)</SelectItem>
                        <SelectItem value="truck2">TX-5678-CD (Medium Truck)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#3E3F46' }}>Coverage Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2" style={{ color: '#3E3F46' }}>
                        <input type="radio" name="vehicleCoverage" value="basic" style={{ accentColor: '#0E32E8' }} />
                        <span>Basic <span className="ov-num">($100K)</span></span>
                      </div>
                      <div className="flex items-center space-x-2" style={{ color: '#3E3F46' }}>
                        <input type="radio" name="vehicleCoverage" value="standard" defaultChecked style={{ accentColor: '#0E32E8' }} />
                        <span>Standard <span className="ov-num">($250K)</span></span>
                      </div>
                      <div className="flex items-center space-x-2" style={{ color: '#3E3F46' }}>
                        <input type="radio" name="vehicleCoverage" value="premium" style={{ accentColor: '#0E32E8' }} />
                        <span>Premium <span className="ov-num">($1M)</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#3E3F46' }}>Effective Period</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" />
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="p-4 rounded-[14px]" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                    <h4 className="ov-eyebrow ov-eyebrow--muted mb-2">Coverage Includes</h4>
                    <ul className="text-sm space-y-1.5" style={{ color: '#5B6470' }}>
                      <li className="flex items-center gap-2"><CheckDot />Accident coverage</li>
                      <li className="flex items-center gap-2"><CheckDot />Third-party liability</li>
                      <li className="flex items-center gap-2"><CheckDot />Theft protection</li>
                      <li className="flex items-center gap-2"><CheckDot />Natural calamities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {vehicleQuote && (
                <div className="p-4 rounded-[14px]" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                  <p className="font-semibold" style={{ color: '#14161A' }}>
                    Estimated Premium: <span className="ov-num text-lg">{vehicleQuote}</span>
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={() => handleGetQuote('vehicle')}
                  className="ov-btn ov-btn-outline"
                >
                  Get Quote
                </Button>
                {vehicleQuote && (
                  <Button
                    onClick={() => handlePurchasePolicy('vehicle')}
                    className="ov-btn ov-btn-ink"
                  >
                    Purchase Policy
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cargo Insurance Tab */}
        <TabsContent value="cargo">
          <Card className="ov-card" style={{ background: '#FFFFFF' }}>
            <CardHeader>
              <CardTitle className="ov-display text-lg flex items-center gap-2">
                <Package className="w-5 h-5" style={{ color: '#0E32E8' }} />
                Load (Cargo) Insurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#3E3F46' }}>Select Load</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a load to insure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="load1">LD-TS-2024-001 (Electronics)</SelectItem>
                        <SelectItem value="load2">LD-TS-2024-002 (Textiles)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#3E3F46' }}>Coverage Level</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2" style={{ color: '#3E3F46' }}>
                        <input type="radio" name="cargoCoverage" value="basic" style={{ accentColor: '#0E32E8' }} />
                        <span>Basic <span className="ov-num">(Up to $25K)</span></span>
                      </div>
                      <div className="flex items-center space-x-2" style={{ color: '#3E3F46' }}>
                        <input type="radio" name="cargoCoverage" value="standard" defaultChecked style={{ accentColor: '#0E32E8' }} />
                        <span>Standard <span className="ov-num">(Up to $150K)</span></span>
                      </div>
                      <div className="flex items-center space-x-2" style={{ color: '#3E3F46' }}>
                        <input type="radio" name="cargoCoverage" value="premium" style={{ accentColor: '#0E32E8' }} />
                        <span>Premium <span className="ov-num">(Up to $500K)</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: '#3E3F46' }}>Cargo Value ($)</label>
                    <Input
                      type="number"
                      placeholder="500,000"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value) {
                          const instantQuote = `$ ${Math.floor(value * 0.001).toLocaleString()}`;
                          // Show instant quote in real-time
                        }
                      }}
                    />
                    <p className="text-xs" style={{ color: '#8B857C' }}>Real-time quote calculation</p>
                  </div>

                  <div className="p-4 rounded-[14px]" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                    <h4 className="ov-eyebrow ov-eyebrow--muted mb-2">Coverage Includes</h4>
                    <ul className="text-sm space-y-1.5" style={{ color: '#5B6470' }}>
                      <li className="flex items-center gap-2"><CheckDot />Transit damage</li>
                      <li className="flex items-center gap-2"><CheckDot />Theft protection</li>
                      <li className="flex items-center gap-2"><CheckDot />Fire coverage</li>
                      <li className="flex items-center gap-2"><CheckDot />Weather damage</li>
                    </ul>
                  </div>
                </div>
              </div>

              {cargoQuote && (
                <div className="p-4 rounded-[14px]" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                  <p className="font-semibold" style={{ color: '#14161A' }}>
                    Estimated Premium: <span className="ov-num text-lg">{cargoQuote}</span>
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={() => handleGetQuote('cargo')}
                  className="ov-btn ov-btn-outline"
                >
                  Get Quote
                </Button>
                {cargoQuote && (
                  <Button
                    onClick={() => handlePurchasePolicy('cargo')}
                    className="ov-btn ov-btn-ink"
                  >
                    Purchase Policy
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History & Claims Tab */}
        <TabsContent value="history">
          <Card className="ov-card" style={{ background: '#FFFFFF' }}>
            <CardHeader>
              <CardTitle className="ov-display text-lg flex items-center gap-2">
                <History className="w-5 h-5" style={{ color: '#0E32E8' }} />
                Insurance History & Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Policy No.</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Insured Asset</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Coverage Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Premium Paid</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#8B857C' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy, index) => (
                      <tr key={index} className="ov-mkt-row">
                        <td className="px-6 py-4 ov-num font-medium" style={{ color: '#0E32E8' }}>{policy.policyNo}</td>
                        <td className="px-6 py-4" style={{ color: '#3E3F46' }}>{policy.type}</td>
                        <td className="px-6 py-4 ov-num" style={{ color: '#3E3F46' }}>{policy.asset}</td>
                        <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{policy.coverage}</td>
                        <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{policy.premium}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' }}>
                            {policy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                              <FileText className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                              <Download className="w-4 h-4 mr-1" />
                              Certificate
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CorporateInsuranceHubPage;
