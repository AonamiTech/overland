
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// SVG Icons
const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface CommissionData {
  loadId: string;
  dateCompleted: string;
  carrier: string;
  amountEarned: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  baseCommission: string;
  bonus: string;
  transactionId?: string;
  paymentMode?: string;
}

interface CommissionTableProps {
  data: CommissionData[];
  onRemindPayment: (loadId: string) => void;
  onViewInvoice: (loadId: string) => void;
}

const CommissionTable = ({ data, onRemindPayment, onViewInvoice }: CommissionTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [remindedPayments, setRemindedPayments] = useState<Set<string>>(new Set());

  const handleRemindPayment = (loadId: string) => {
    onRemindPayment(loadId);
    setRemindedPayments(prev => new Set([...prev, loadId]));
    
    // Re-enable after 24 hours (for demo, we'll use 5 seconds)
    setTimeout(() => {
      setRemindedPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(loadId);
        return newSet;
      });
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-[rgba(15,122,74,0.1)] text-[#0F7A4A] hover:bg-[rgba(15,122,74,0.16)] border-transparent">Paid</Badge>;
      case 'Pending':
        return <Badge className="bg-[rgba(180,83,9,0.1)] text-[#B45309] hover:bg-[rgba(180,83,9,0.16)] border-transparent">Pending</Badge>;
      case 'Overdue':
        return <Badge className="bg-[rgba(168,65,47,0.1)] text-[#A8412F] hover:bg-[rgba(168,65,47,0.16)] border-transparent">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="ov-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="ov-display text-2xl">Commission Details</span>
          <div className="text-xs font-medium uppercase tracking-wider text-[#8B857C] ov-num">
            {data.length} records
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0">
              <tr className="border-b border-[#ECE8E1]">
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider text-[#8B857C]">Load ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider text-[#8B857C]">Date Completed</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider text-[#8B857C]">Carrier</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider text-[#8B857C]">Amount Earned</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider text-[#8B857C]">Payment Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider text-[#8B857C]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((commission, index) => (
                <React.Fragment key={commission.loadId}>
                  <tr
                    className="border-b border-[#ECE8E1] hover:bg-[#FBFAF8] cursor-pointer transition-colors bg-white"
                    onClick={() => setExpandedRow(expandedRow === commission.loadId ? null : commission.loadId)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="ov-num font-medium text-[#0E32E8]">
                          {commission.loadId}
                        </span>
                        <ChevronDownIcon />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#5B6470] ov-num">{commission.dateCompleted}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F1EEE8]">
                          <span className="text-xs font-semibold text-[#5B6470]">
                            {commission.carrier.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[#14161A] font-medium">{commission.carrier}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="ov-num font-semibold text-[#14161A] text-lg">{commission.amountEarned}</span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(commission.paymentStatus)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewInvoice(commission.loadId);
                          }}
                          className="text-[#0E32E8] hover:text-[#0E32E8] hover:bg-[rgba(14,50,232,0.08)]"
                        >
                          <FileTextIcon />
                          <span>Invoice</span>
                        </Button>
                        {commission.paymentStatus === 'Pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemindPayment(commission.loadId);
                            }}
                            disabled={remindedPayments.has(commission.loadId)}
                            className={`${
                              remindedPayments.has(commission.loadId)
                                ? 'border-[#E7E3DC] text-[#A9A29A] cursor-not-allowed'
                                : 'border-[#B45309] text-[#B45309] hover:bg-[rgba(180,83,9,0.08)]'
                            }`}
                          >
                            <BellIcon />
                            <span>
                              {remindedPayments.has(commission.loadId) ? 'Reminded' : 'Remind'}
                            </span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Details */}
                  {expandedRow === commission.loadId && (
                    <tr className="bg-[#FBFAF8] border-b border-[#ECE8E1]">
                      <td colSpan={6} className="py-4 px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-[#8B857C]">Transaction ID</span>
                            <p className="text-[#14161A] ov-num">{commission.transactionId || 'TXN' + commission.loadId.slice(-6)}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-[#8B857C]">Base Commission</span>
                            <p className="text-[#14161A] ov-num">{commission.baseCommission}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-[#8B857C]">Bonus</span>
                            <p className="text-[#14161A] ov-num">{commission.bonus}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-[#8B857C]">Payment Mode</span>
                            <p className="text-[#14161A]">{commission.paymentMode || 'Bank Transfer'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-[#8B857C]">Payout Reference</span>
                            <p className="text-[#14161A] ov-num">REF{commission.loadId.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Accordion Cards */}
        <div className="md:hidden space-y-4">
          {data.map((commission) => (
            <Card key={commission.loadId} className="ov-card ov-card--hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="ov-num font-semibold text-[#0E32E8]">{commission.loadId}</span>
                    {getStatusBadge(commission.paymentStatus)}
                  </div>
                  <span className="ov-num font-semibold text-lg text-[#14161A]">{commission.amountEarned}</span>
                </div>

                <div className="space-y-2 text-sm text-[#5B6470] mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1EEE8]">
                      <span className="text-xs font-semibold text-[#5B6470]">
                        {commission.carrier.charAt(0)}
                      </span>
                    </div>
                    <span>{commission.carrier}</span>
                  </div>
                  <p>Completed: <span className="ov-num">{commission.dateCompleted}</span></p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewInvoice(commission.loadId)}
                    className="text-[#0E32E8] hover:text-[#0E32E8] hover:bg-[rgba(14,50,232,0.08)] flex-1"
                  >
                    <FileTextIcon />
                    <span>View Invoice</span>
                  </Button>
                  {commission.paymentStatus === 'Pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemindPayment(commission.loadId)}
                      disabled={remindedPayments.has(commission.loadId)}
                      className={`flex-1 ${
                        remindedPayments.has(commission.loadId)
                          ? 'border-[#E7E3DC] text-[#A9A29A]'
                          : 'border-[#B45309] text-[#B45309] hover:bg-[rgba(180,83,9,0.08)]'
                      }`}
                    >
                      <BellIcon />
                      <span>
                        {remindedPayments.has(commission.loadId) ? 'Reminded' : 'Remind Payment'}
                      </span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sticky Mobile Remind Bar */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-[#111217] text-white p-4 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Quick Payout Nudge</p>
              <p className="text-sm opacity-80">Send reminders for all pending payments</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white border border-white/40 hover:bg-white/10"
            >
              Send All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionTable;
