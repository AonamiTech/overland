
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Award, Clock, TrendingUp } from "lucide-react";
import DashboardLayout from '../DashboardLayout';

const CorporateBiddingDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Mock data for active RFQs
  const activeRFQs = [
    {
      id: "DAL-LAX-001",
      route: "Dallas → Los Angeles",
      cargo: "Electronics – 11,000 lbs",
      budget: "$2,800 – $3,400",
      deadline: "6 hrs left",
      bidsReceived: 12,
      status: "open"
    },
    {
      id: "CHI-ATL-002",
      route: "Chicago → Atlanta",
      cargo: "Furniture – 6,600 lbs",
      budget: "$2,400 – $3,000",
      deadline: "2 days left",
      bidsReceived: 8,
      status: "open"
    }
  ];

  const bidHistory = [
    {
      rfqId: "DAL-CHI-003",
      yourBid: "$3,200",
      truckNo: "TX-1234-AB",
      status: "won",
      statusText: "Won"
    },
    {
      rfqId: "LAX-PHX-004",
      yourBid: "$1,400",
      truckNo: "CA-5678-CD",
      status: "pending",
      statusText: "Pending"
    },
    {
      rfqId: "ATL-HOU-005",
      yourBid: "$2,900",
      truckNo: "GA-9012-EF",
      status: "lost",
      statusText: "Lost"
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
        <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Dashboard &gt; Corporate Bidding</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="ov-eyebrow mb-2"><span className="dot" />BIDDING</p>
        <h1 className="ov-display text-3xl" style={{ color: '#14161A' }}>
          Corporate Bidding Dashboard
        </h1>
      </div>

      {/* Verification Banner */}
      <Card className="ov-card mb-6 p-4" style={{ background: 'rgba(168,65,47,0.06)', borderColor: 'rgba(168,65,47,0.25)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: '#A8412F' }}>
              Not Verified – Unlock Corporate Contracts
            </p>
            <p className="text-sm" style={{ color: '#A8412F' }}>
              Complete verification to bid on high-value enterprise loads.
            </p>
          </div>
          <Button className="ov-btn ov-btn-ink">
            Complete Verification
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'active' ? 'default' : 'outline'}
          onClick={() => setActiveTab('active')}
          className={activeTab === 'active' ? 'ov-btn ov-btn-ink' : 'ov-btn ov-btn-outline'}
        >
          Active RFQs
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'ov-btn ov-btn-ink' : 'ov-btn ov-btn-outline'}
        >
          Your Bids History
        </Button>
      </div>

      {activeTab === 'active' ? (
        // Active RFQs Tab
        <div>
          {/* Filters */}
          <Card className="ov-card mb-6 p-4" style={{ background: '#FBFAF8' }}>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#A9A29A' }} />
                  <input
                    type="text"
                    placeholder="Search RFQs..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                    style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}
                  />
                </div>
              </div>
              <select className="px-4 py-2 rounded-lg focus:outline-none" style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}>
                <option>All Routes</option>
                <option>Dallas → Los Angeles</option>
                <option>Los Angeles → Chicago</option>
              </select>
              <select className="px-4 py-2 rounded-lg focus:outline-none" style={{ border: '1px solid #E7E3DC', background: '#FFFFFF' }}>
                <option>All Cargo Types</option>
                <option>Electronics</option>
                <option>Furniture</option>
              </select>
              <Button variant="outline" className="ov-btn ov-btn-outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Active RFQs Table */}
          <Card className="ov-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>RFQ/Load ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Route</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Cargo Type & Weight</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Budget Range</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Deadline</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Bids Received</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRFQs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-[#FBFAF8]" style={{ borderBottom: '1px solid #ECE8E1' }}>
                      <td className="px-6 py-4">
                        <button className="ov-num font-medium" style={{ color: '#0E32E8' }}>
                          {rfq.id}
                        </button>
                      </td>
                      <td className="px-6 py-4" style={{ color: '#14161A' }}>{rfq.route}</td>
                      <td className="px-6 py-4" style={{ color: '#3E3F46' }}>{rfq.cargo}</td>
                      <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{rfq.budget}</td>
                      <td className="px-6 py-4">
                        <span className="ov-num font-medium" style={{ color: '#B45309' }}>{rfq.deadline}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="ov-num">{rfq.bidsReceived}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" className="ov-btn ov-btn-ink">
                          <Eye className="w-4 h-4 mr-1" />
                          View Bids
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        // Your Bids History Tab
        <div>
          <Card className="ov-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Your Past Bids</h3>
                <Button variant="outline" className="ov-btn ov-btn-outline">
                  Download Report
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>RFQ ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Your Bid ($)</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Proposed Truck No.</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>View RFQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidHistory.map((bid, index) => (
                      <tr key={index} className="hover:bg-[#FBFAF8]" style={{ borderBottom: '1px solid #ECE8E1' }}>
                        <td className="px-6 py-4">
                          <button className="ov-num font-medium" style={{ color: '#0E32E8' }}>
                            {bid.rfqId}
                          </button>
                        </td>
                        <td className="px-6 py-4 ov-num font-medium" style={{ color: '#14161A' }}>{bid.yourBid}</td>
                        <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{bid.truckNo}</td>
                        <td className="px-6 py-4">
                          {bid.status === 'won' && (
                            <Badge className="hover:bg-inherit" style={{ background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' }}>
                              <Award className="w-3 h-3 mr-1" />
                              Won
                            </Badge>
                          )}
                          {bid.status === 'pending' && (
                            <Badge className="hover:bg-inherit" style={{ background: '#F1EEE8', color: '#B45309' }}>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {bid.status === 'lost' && (
                            <Badge className="hover:bg-inherit" style={{ background: 'rgba(168,65,47,0.10)', color: '#A8412F' }}>
                              Lost
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                            View RFQ
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CorporateBiddingDashboardPage;
