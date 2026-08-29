
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, TrendingUp, Users, Target, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import DashboardLayout from './DashboardLayout';

const ReportsAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const monthlyLoadData = [
    { month: 'Jan', loads: 32 },
    { month: 'Feb', loads: 45 },
    { month: 'Mar', loads: 38 },
    { month: 'Apr', loads: 52 },
    { month: 'May', loads: 41 },
    { month: 'Jun', loads: 47 }
  ];

  const earningsData = [
    { month: 'Jan', earnings: 180000, commissions: 25000 },
    { month: 'Feb', earnings: 220000, commissions: 32000 },
    { month: 'Mar', earnings: 195000, commissions: 28000 },
    { month: 'Apr', earnings: 245000, commissions: 38000 },
    { month: 'May', earnings: 210000, commissions: 31000 },
    { month: 'Jun', earnings: 235000, commissions: 35000 }
  ];

  const topCarriers = [
    { name: 'Summit Freight', loads: 28, onTime: 94, rating: 4.8 },
    { name: 'Johnson Logistics', loads: 24, onTime: 89, rating: 4.6 },
    { name: 'Eagle Transport', loads: 22, onTime: 92, rating: 4.7 },
    { name: 'Liberty Freight', loads: 19, onTime: 87, rating: 4.5 },
    { name: 'Pioneer Carriers', loads: 17, onTime: 91, rating: 4.6 }
  ];

  return (
    <DashboardLayout
      userRole="broker"
      userName="Mike Johnson"
      userId="BR123456"
      isVerified={false}
      verificationStatus="not-started"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm ov-num" style={{ color: '#A9A29A' }}>
          Dashboard &gt; Reports &amp; Analytics
        </p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="ov-eyebrow mb-3"><span className="dot" />ANALYTICS</div>
        <h1 className="ov-display text-3xl mb-6">
          Reports &amp; Analytics
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="ov-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 ov-tick rounded-full mx-auto mb-3" style={{ width: 48, height: 48 }}>
                <BarChart3 className="w-6 h-6" style={{ color: '#0E32E8' }} />
              </div>
              <div className="ov-num text-3xl mb-1" style={{ color: '#14161A' }}>
                45
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>Total Loads Posted</div>
              <div className="text-xs mt-1" style={{ color: '#A9A29A' }}>This Month</div>
            </CardContent>
          </Card>

          <Card className="ov-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 ov-tick rounded-full mx-auto mb-3" style={{ width: 48, height: 48 }}>
                <Target className="w-6 h-6" style={{ color: '#0E32E8' }} />
              </div>
              <div className="ov-num text-3xl mb-1" style={{ color: '#0F7A4A' }}>
                88%
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>On-Time Delivery</div>
              <div className="text-xs mt-1" style={{ color: '#A9A29A' }}>Industry Avg: 82%</div>
            </CardContent>
          </Card>

          <Card className="ov-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 ov-tick rounded-full mx-auto mb-3" style={{ width: 48, height: 48 }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#0E32E8' }} />
              </div>
              <div className="ov-num text-3xl mb-1" style={{ color: '#14161A' }}>
                $780
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>Avg Commission</div>
              <div className="text-xs mt-1" style={{ color: '#A9A29A' }}>Per Load</div>
            </CardContent>
          </Card>

          <Card className="ov-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 ov-tick rounded-full mx-auto mb-3" style={{ width: 48, height: 48 }}>
                <Users className="w-6 h-6" style={{ color: '#0E32E8' }} />
              </div>
              <div className="ov-num text-3xl mb-1" style={{ color: '#14161A' }}>
                65%
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>Repeat Carrier Rate</div>
              <div className="text-xs mt-1" style={{ color: '#A9A29A' }}>Quality Metric</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Date Range Picker */}
      <Card className="ov-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#5B6470' }}>From Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="ov-num p-2 border rounded-lg"
                  style={{ borderColor: '#E7E3DC', accentColor: '#0E32E8' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#5B6470' }}>To Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="ov-num p-2 border rounded-lg"
                  style={{ borderColor: '#E7E3DC', accentColor: '#0E32E8' }}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="ov-btn ov-btn-outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button className="ov-btn ov-btn-outline">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Load Volume */}
        <Card className="ov-card">
          <CardHeader>
            <CardTitle className="ov-display text-xl">
              Monthly Load Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E1" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="loads" stroke="#0E32E8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Earnings & Commissions Trend */}
        <Card className="ov-card">
          <CardHeader>
            <CardTitle className="ov-display text-xl">
              Earnings &amp; Commissions Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E1" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#0E32E8" />
                <Bar dataKey="commissions" fill="#0F7A4A" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Carriers Table */}
      <Card className="ov-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="ov-display text-xl">
              Top 10 Carriers This Quarter
            </CardTitle>
            <div className="flex space-x-2">
              <button className="ov-btn ov-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: 13 }}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECE8E1' }}>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>Carrier Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}># Loads Completed</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>On-Time %</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>Avg Rating</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#5B6470' }}>Performance</th>
                </tr>
              </thead>
              <tbody>
                {topCarriers.map((carrier, index) => (
                  <tr key={index} className="ov-mkt-row">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(14,50,232,0.08)' }}>
                          <span className="text-sm font-semibold" style={{ color: '#0E32E8' }}>
                            {carrier.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium" style={{ color: '#14161A' }}>{carrier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 ov-num" style={{ color: '#3E3F46' }}>{carrier.loads}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 rounded-full h-2" style={{ background: '#F1EEE8' }}>
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${carrier.onTime}%`, background: '#0F7A4A' }}
                          ></div>
                        </div>
                        <span className="text-sm ov-num" style={{ color: '#5B6470' }}>{carrier.onTime}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" style={{ color: '#B45309' }} />
                        <span className="ov-num" style={{ color: '#14161A' }}>{carrier.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold" style={
                        carrier.onTime >= 90
                          ? { background: 'rgba(15,122,74,0.10)', color: '#0F7A4A' }
                          : carrier.onTime >= 85
                          ? { background: 'rgba(180,83,9,0.10)', color: '#B45309' }
                          : { background: 'rgba(168,65,47,0.10)', color: '#A8412F' }
                      }>
                        {carrier.onTime >= 90 ? 'Excellent' : carrier.onTime >= 85 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ReportsAnalyticsPage;
