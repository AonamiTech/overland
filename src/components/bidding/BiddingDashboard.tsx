
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Target, Award, DollarSign, Clock, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react';

const BiddingDashboard = ({ isVerified }) => {
  const [selectedTab, setSelectedTab] = useState('live');

  // Mock data
  const liveBytes = [
    {
      rfqId: 'RFQ001',
      route: 'DAL→LAX',
      myBid: 2850,
      currentRank: 2,
      totalBids: 12,
      timeLeft: '2h 15m',
      status: 'competitive',
      isWinning: false
    },
    {
      rfqId: 'RFQ003',
      route: 'LAX→PHX',
      myBid: 1150,
      currentRank: 1,
      totalBids: 8,
      timeLeft: '5h 30m',
      status: 'winning',
      isWinning: true
    }
  ];

  const bidHistory = [
    {
      rfqId: 'RFQ002',
      route: 'CHI→ATL',
      bidAmount: 1900,
      finalPrice: 1850,
      status: 'won',
      profit: 450,
      date: '2024-01-05'
    },
    {
      rfqId: 'RFQ004',
      route: 'HOU→SAV',
      bidAmount: 2300,
      finalPrice: 2150,
      status: 'lost',
      profit: 0,
      date: '2024-01-03'
    }
  ];

  const stats = {
    totalBids: 47,
    winRate: 32,
    totalEarnings: 92000,
    avgProfit: 12.5
  };

  const achievements = [
    { icon: Trophy, title: 'First Win', description: 'Won your first RFQ', earned: true },
    { icon: Zap, title: 'Speed Bidder', description: '5 bids in 24 hours', earned: true },
    { icon: Target, title: 'Sharp Shooter', description: '10 successful bids', earned: false },
    { icon: Award, title: 'Top Performer', description: 'Top 10% win rate', earned: false }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'winning': return 'bg-[rgba(15,122,74,0.1)] text-[#0F7A4A]';
      case 'competitive': return 'bg-[rgba(180,83,9,0.1)] text-[#B45309]';
      case 'won': return 'bg-[rgba(15,122,74,0.1)] text-[#0F7A4A]';
      case 'lost': return 'bg-[rgba(168,65,47,0.1)] text-[#A8412F]';
      default: return 'bg-[#F1EEE8] text-[#5B6470]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="ov-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Total Bids</p>
                <p className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>{stats.totalBids}</p>
              </div>
              <Target className="w-8 h-8" style={{ color: '#0E32E8' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="ov-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Win Rate</p>
                <p className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>{stats.winRate}%</p>
              </div>
              <Award className="w-8 h-8" style={{ color: '#0F7A4A' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="ov-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Total Earnings</p>
                <p className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>${(stats.totalEarnings / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8" style={{ color: '#0E32E8' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="ov-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Avg Profit</p>
                <p className="ov-num text-2xl font-semibold" style={{ color: '#14161A' }}>{stats.avgProfit}%</p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: '#B45309' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Bids</TabsTrigger>
          <TabsTrigger value="history">Bid History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display flex items-center justify-between">
                <span>Active Bids</span>
                <Badge variant="outline" className="ov-num" style={{ borderColor: '#E7E3DC', color: '#5B6470' }}>{liveBytes.length} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {liveBytes.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto mb-4" style={{ color: '#A9A29A' }} />
                  <h3 className="ov-display text-lg">No Active Bids</h3>
                  <p style={{ color: '#5B6470' }}>Start bidding on RFQs to track them here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>RFQ ID</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Route</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>My Bid</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Rank</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Time Left</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveBytes.map((bid) => (
                      <TableRow key={bid.rfqId} className="hover:bg-[#FBFAF8]">
                        <TableCell className="ov-num font-medium" style={{ color: '#0E32E8' }}>{bid.rfqId}</TableCell>
                        <TableCell className="ov-num">{bid.route}</TableCell>
                        <TableCell className="ov-num">${bid.myBid.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="ov-num font-medium" style={{ color: bid.isWinning ? '#0F7A4A' : '#5B6470' }}>
                              #{bid.currentRank}
                            </span>
                            <span className="ov-num" style={{ color: '#A9A29A' }}>/{bid.totalBids}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" style={{ color: '#B45309' }} />
                            <span className="ov-num text-sm">{bid.timeLeft}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bid.status)}>
                            {bid.status === 'winning' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {bid.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button className="ov-btn ov-btn-outline text-xs px-3 py-2">
                            Revise Bid
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="ov-card">
            <CardHeader>
              <CardTitle className="ov-display">Bid History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>RFQ ID</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Route</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>My Bid</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Final Price</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Profit</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Status</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wide" style={{ color: '#5B6470' }}>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidHistory.map((bid) => (
                    <TableRow key={bid.rfqId} className="hover:bg-[#FBFAF8]">
                      <TableCell className="ov-num font-medium" style={{ color: '#0E32E8' }}>{bid.rfqId}</TableCell>
                      <TableCell className="ov-num">{bid.route}</TableCell>
                      <TableCell className="ov-num">${bid.bidAmount.toLocaleString()}</TableCell>
                      <TableCell className="ov-num">${bid.finalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        {bid.profit > 0 ? (
                          <span className="ov-num" style={{ color: '#0F7A4A' }}>+${bid.profit.toLocaleString()}</span>
                        ) : (
                          <span style={{ color: '#A9A29A' }}>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bid.status)}>
                          {bid.status === 'won' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {bid.status === 'lost' && <XCircle className="w-3 h-3 mr-1" />}
                          {bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="ov-num">{bid.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="ov-card" style={achievement.earned ? { borderColor: '#E8C98A', background: 'rgba(180,83,9,0.05)' } : undefined}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ background: achievement.earned ? 'rgba(180,83,9,0.1)' : '#F1EEE8' }}>
                      <achievement.icon className="w-6 h-6" style={{ color: achievement.earned ? '#B45309' : '#A9A29A' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: achievement.earned ? '#B45309' : '#3E3F46' }}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm" style={{ color: achievement.earned ? '#B45309' : '#5B6470' }}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge className="text-white ml-auto" style={{ background: '#B45309' }}>
                        Earned
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiddingDashboard;
