
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Settings, RefreshCw, Download, Database, Cloud, Server, Zap, Link } from "lucide-react";
import DashboardLayout from '../DashboardLayout';

const CorporateERPIntegrationPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const syncLogs = [
    { date: "Dec 19, 2024 10:30 AM", type: "SAP", status: "success", details: "15 loads synced" },
    { date: "Dec 19, 2024 9:45 AM", type: "Custom API", status: "success", details: "8 shipments updated" },
    { date: "Dec 18, 2024 6:20 PM", type: "SAP", status: "failure", details: "Connection timeout" },
    { date: "Dec 18, 2024 2:15 PM", type: "Oracle", status: "success", details: "12 loads synced" },
    { date: "Dec 18, 2024 11:00 AM", type: "SAP", status: "success", details: "20 loads synced" }
  ];

  const fieldMappings = [
    { internalField: "Load ID", erpField: "SHIPMENT_NO", dataType: "String", required: true },
    { internalField: "Pickup City", erpField: "SOURCE_LOC", dataType: "String", required: true },
    { internalField: "Delivery City", erpField: "DEST_LOC", dataType: "String", required: true },
    { internalField: "Weight", erpField: "GROSS_WEIGHT", dataType: "Number", required: false },
    { internalField: "Cargo Value", erpField: "INVOICE_VALUE", dataType: "Number", required: false }
  ];

  // ERP Platform configurations with specific icons
  const erpPlatforms = [
    {
      name: 'SAP',
      icon: Database,
      description: 'Connect with SAP ERP systems',
      features: ['Real-time sync', 'Material management', 'Financial integration'],
      color: 'blue',
      status: 'available'
    },
    {
      name: 'Oracle',
      icon: Server,
      description: 'Oracle ERP Cloud integration',
      features: ['Supply chain', 'Procurement', 'Order management'],
      color: 'red',
      status: 'available'
    },
    {
      name: 'Microsoft Dynamics',
      icon: Cloud,
      description: 'Dynamics 365 integration',
      features: ['Business Central', 'Finance & Operations', 'Power Platform'],
      color: 'blue',
      status: 'available'
    },
    {
      name: 'Custom API',
      icon: Zap,
      description: 'Your custom REST/GraphQL API',
      features: ['Flexible endpoints', 'Custom authentication', 'Webhook support'],
      color: 'purple',
      status: 'available'
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
        <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Dashboard &gt; ERP Integration</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="ov-tick">
            <Link className="w-6 h-6" style={{ color: '#0E32E8' }} />
          </div>
          <div>
            <p className="ov-eyebrow mb-1"><span className="dot" />INTEGRATION</p>
            <h1 className="ov-display text-3xl" style={{ color: '#14161A' }}>
              ERP / API Integration
            </h1>
            <p className="mt-1" style={{ color: '#5B6470' }}>Connect your enterprise systems for seamless data flow</p>
          </div>
        </div>
      </div>

      {/* Integration Status Banner */}
      <Card className="ov-card mb-8 p-6" style={!isConnected ? { background: 'rgba(168,65,47,0.06)', borderColor: 'rgba(168,65,47,0.25)' } : { background: 'rgba(15,122,74,0.06)', borderColor: 'rgba(15,122,74,0.25)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(168,65,47,0.10)' }}>
                  <AlertCircle className="w-6 h-6" style={{ color: '#A8412F' }} />
                </div>
                <div>
                  <p className="ov-display text-lg" style={{ color: '#A8412F' }}>
                    No ERP Connected
                  </p>
                  <p style={{ color: '#A8412F' }}>
                    Connect with SAP, Oracle, Dynamics, or your custom API to auto-sync loads and streamline operations.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(15,122,74,0.10)' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: '#0F7A4A' }} />
                </div>
                <div>
                  <p className="ov-display text-lg" style={{ color: '#0F7A4A' }}>
                    Connected & Syncing
                  </p>
                  <p className="ov-num" style={{ color: '#0F7A4A' }}>
                    Last sync: Dec 19, 2024 10:30 AM
                  </p>
                </div>
              </>
            )}
          </div>
          <Button
            className="ov-btn ov-btn-ink px-6 py-3"
            onClick={() => setShowSetupModal(true)}
          >
            {!isConnected ? 'Configure Integration' : 'Manage Connection'}
          </Button>
        </div>
      </Card>

      {/* ERP Platforms Grid */}
      <div className="mb-8">
        <h2 className="ov-display text-xl mb-6" style={{ color: '#14161A' }}>Choose Your ERP Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {erpPlatforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <Card key={index} className="ov-card ov-card--hover p-6 group cursor-pointer">
                <div className="text-center">
                  <div className="ov-tick mx-auto mb-4">
                    <IconComponent className="w-8 h-8" style={{ color: '#0E32E8' }} />
                  </div>

                  <h3 className="ov-display text-lg mb-2" style={{ color: '#14161A' }}>{platform.name}</h3>
                  <p className="text-sm mb-4" style={{ color: '#5B6470' }}>{platform.description}</p>

                  <div className="space-y-2 mb-6">
                    {platform.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-center text-xs" style={{ color: '#5B6470' }}>
                        <CheckCircle className="w-3 h-3 mr-1" style={{ color: '#0F7A4A' }} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    className="ov-btn ov-btn-ink w-full"
                    onClick={() => setShowSetupModal(true)}
                  >
                    Connect {platform.name}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sync Logs & History */}
      <Card className="ov-card mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="ov-tick">
                <RefreshCw className="w-5 h-5" style={{ color: '#0E32E8' }} />
              </div>
              <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Sync Logs</h3>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="ov-btn ov-btn-outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="ov-btn ov-btn-outline">
                View All Logs
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Integration Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {syncLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-[#FBFAF8]" style={{ borderBottom: '1px solid #ECE8E1' }}>
                    <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{log.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4" style={{ color: '#5B6470' }} />
                        <span style={{ color: '#14161A' }}>{log.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <Badge className="hover:bg-inherit" style={{ background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' }}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge className="hover:bg-inherit" style={{ background: 'rgba(168,65,47,0.10)', color: '#A8412F' }}>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failure
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4" style={{ color: '#5B6470' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Field Mapping */}
      <Card className="ov-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="ov-tick">
                <Settings className="w-5 h-5" style={{ color: '#0E32E8' }} />
              </div>
              <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Field Mapping Configuration</h3>
            </div>
            <Button className="ov-btn ov-btn-ink">
              Save Mapping
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Internal Field</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>ERP Field</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Data Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Required</th>
                </tr>
              </thead>
              <tbody>
                {fieldMappings.map((mapping, index) => (
                  <tr key={index} className="hover:bg-[#FBFAF8]" style={{ borderBottom: '1px solid #ECE8E1' }}>
                    <td className="px-6 py-4 font-medium" style={{ color: '#14161A' }}>{mapping.internalField}</td>
                    <td className="px-6 py-4">
                      <select className="ov-num w-full px-3 py-2 rounded-lg focus:outline-none" style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}>
                        <option value={mapping.erpField}>{mapping.erpField}</option>
                        <option value="">-- Select Field --</option>
                      </select>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#5B6470' }}>{mapping.dataType}</td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={mapping.required}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#0E32E8', borderColor: '#E7E3DC' }}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="ov-card w-full max-w-md mx-4 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="ov-tick">
                <Settings className="w-5 h-5" style={{ color: '#0E32E8' }} />
              </div>
              <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>ERP Connection Setup</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#3E3F46' }}>
                  Host URL *
                </label>
                <input
                  type="text"
                  placeholder="https://your-erp-host.com"
                  className="ov-num w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#3E3F46' }}>
                  Client ID *
                </label>
                <input
                  type="text"
                  placeholder="Enter Client ID"
                  className="ov-num w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#3E3F46' }}>
                  Client Secret *
                </label>
                <input
                  type="password"
                  placeholder="Enter Client Secret"
                  className="ov-num w-full px-3 py-2 rounded-lg focus:outline-none"
                  style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                className="ov-btn ov-btn-outline flex-1"
                onClick={() => setShowSetupModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="ov-btn ov-btn-outline flex-1"
              >
                Test Connection
              </Button>
              <Button
                className="ov-btn ov-btn-ink flex-1"
                onClick={() => {
                  setIsConnected(true);
                  setShowSetupModal(false);
                }}
              >
                Save & Connect
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CorporateERPIntegrationPage;
