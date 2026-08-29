
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Clock, Trophy, BarChart3, Download } from "lucide-react";
import DashboardLayout from '../DashboardLayout';

const CorporateAnalyticsPage = () => {
  const keyMetrics = [
    {
      title: "Total Spend This Month",
      value: "$ 145,000",
      subtext: "Budget: $ 175,000",
      icon: DollarSign
    },
    {
      title: "On-Time Delivery %",
      value: "98.2%",
      subtext: "Across all shipments",
      icon: Clock
    },
    {
      title: "Cost Savings vs Market",
      value: "22%",
      subtext: "Compared to standard rates",
      icon: TrendingUp
    },
    {
      title: "Top Carriers",
      value: "ABC Logistics",
      subtext: "$ 52,000 this month",
      icon: Trophy
    }
  ];

  const topRoutes = [
    { route: "Dallas → Los Angeles", spend: "$ 40,000", shipments: 12, onTime: "100%" },
    { route: "Chicago → Atlanta", spend: "$ 32,000", shipments: 8, onTime: "95%" },
    { route: "Los Angeles → Phoenix", spend: "$ 25,000", shipments: 15, onTime: "98%" },
    { route: "Dallas → Newark", spend: "$ 23,000", shipments: 6, onTime: "92%" },
    { route: "Atlanta → Houston", spend: "$ 19,000", shipments: 9, onTime: "96%" }
  ];

  const scheduledReports = [
    { name: "Weekly Spend Summary", frequency: "Weekly", lastSent: "Dec 18, 2024 9:00 AM" },
    { name: "On-Time Delivery Report", frequency: "Monthly", lastSent: "Dec 1, 2024 8:00 AM" },
    { name: "Vendor Performance", frequency: "Monthly", lastSent: "Dec 1, 2024 8:30 AM" }
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
        <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Dashboard &gt; Analytics & Reports</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="ov-eyebrow mb-2"><span className="dot" />ANALYTICS</p>
        <h1 className="ov-display text-3xl" style={{ color: '#14161A' }}>
          Analytics & Reports
        </h1>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="ov-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="ov-num text-xs uppercase tracking-wide mb-2" style={{ color: '#5B6470' }}>{metric.title}</p>
                <p className="ov-num text-2xl font-semibold mb-1" style={{ color: '#14161A' }}>{metric.value}</p>
                <p className="text-sm" style={{ color: '#8B857C' }}>{metric.subtext}</p>
                <button className="text-sm font-medium mt-2" style={{ color: '#0E32E8' }}>
                  View Details →
                </button>
              </div>
              <div className="ov-tick">
                <metric.icon className="w-6 h-6" style={{ color: '#0E32E8' }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Spend Over Time Chart */}
      <Card className="ov-card mb-8 p-6">
        <h3 className="ov-display text-lg mb-4" style={{ color: '#14161A' }}>Spend Over Time</h3>
        <div className="h-64 rounded-lg flex items-center justify-center" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: '#A9A29A' }} />
            <p style={{ color: '#5B6470' }}>Line chart showing daily spend for current month</p>
            <p className="text-sm" style={{ color: '#A9A29A' }}>Chart visualization would be integrated here</p>
          </div>
        </div>
      </Card>

      {/* Top Routes Table */}
      <Card className="ov-card mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Top Routes by Spend</h3>
            <Button variant="outline" className="ov-btn ov-btn-outline">
              View Full Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Route</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Total Spend ($)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}># Shipments</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Avg On-Time %</th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.map((route, index) => (
                  <tr key={index} className="hover:bg-[#FBFAF8]" style={{ borderBottom: '1px solid #ECE8E1' }}>
                    <td className="px-6 py-4 font-medium" style={{ color: '#14161A' }}>{route.route}</td>
                    <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{route.spend}</td>
                    <td className="px-6 py-4 ov-num" style={{ color: '#14161A' }}>{route.shipments}</td>
                    <td className="px-6 py-4">
                      <span className="ov-num inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={
                        parseFloat(route.onTime) >= 98 ? { background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' } :
                        parseFloat(route.onTime) >= 95 ? { background: '#F1EEE8', color: '#B45309' } :
                        { background: 'rgba(168,65,47,0.10)', color: '#A8412F' }
                      }>
                        {route.onTime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Scheduled Reports */}
      <Card className="ov-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="ov-display text-lg" style={{ color: '#14161A' }}>Scheduled Reports</h3>
            <Button className="ov-btn ov-btn-ink">
              Create New Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Report Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Frequency</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Last Sent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#5B6470' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((report, index) => (
                  <tr key={index} className="hover:bg-[#FBFAF8]" style={{ borderBottom: '1px solid #ECE8E1' }}>
                    <td className="px-6 py-4 font-medium" style={{ color: '#14161A' }}>{report.name}</td>
                    <td className="px-6 py-4" style={{ color: '#3E3F46' }}>{report.frequency}</td>
                    <td className="px-6 py-4 ov-num" style={{ color: '#5B6470' }}>{report.lastSent}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="ov-btn ov-btn-outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="ov-btn ov-btn-outline" style={{ color: '#A8412F' }}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default CorporateAnalyticsPage;
