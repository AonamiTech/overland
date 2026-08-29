
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import EarningsSnapshot from './commission/EarningsSnapshot';
import FilterBar from './commission/FilterBar';
import CommissionTable from './commission/CommissionTable';

const CommissionTrackingPage = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');

  const commissionData = [
    {
      loadId: 'LD-20240301-001',
      dateCompleted: '2024-03-01',
      carrier: 'Rio Grande Carriers',
      amountEarned: '$1,650',
      paymentStatus: 'Paid' as const,
      baseCommission: '$1,200',
      bonus: '$450',
      transactionId: 'TXN240301001',
      paymentMode: 'Bank Transfer'
    },
    {
      loadId: 'LD-20240228-005',
      dateCompleted: '2024-02-28',
      carrier: 'Keystone Logistics',
      amountEarned: '$980',
      paymentStatus: 'Pending' as const,
      baseCommission: '$850',
      bonus: '$130'
    },
    {
      loadId: 'LD-20240225-003',
      dateCompleted: '2024-02-25',
      carrier: 'Summit Carriers',
      amountEarned: '$2,200',
      paymentStatus: 'Paid' as const,
      baseCommission: '$1,700',
      bonus: '$500',
      transactionId: 'TXN240225003',
      paymentMode: 'ACH'
    },
    {
      loadId: 'LD-20240220-007',
      dateCompleted: '2024-02-20',
      carrier: 'Sierra Freight',
      amountEarned: '$1,300',
      paymentStatus: 'Overdue' as const,
      baseCommission: '$950',
      bonus: '$350'
    }
  ];

  const totalEarned = commissionData.reduce((sum, item) => {
    return sum + parseInt(item.amountEarned.replace(/[$,]/g, ''));
  }, 0);

  const pendingAmount = commissionData
    .filter(item => item.paymentStatus === 'Pending' || item.paymentStatus === 'Overdue')
    .reduce((sum, item) => {
      return sum + parseInt(item.amountEarned.replace(/[$,]/g, ''));
    }, 0);

  const monthlyChange = 12.5; // Positive percentage change

  const handleApplyFilters = () => {
    console.log('Applying filters:', { dateRange, statusFilter });
    // Filter logic would go here
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // Export logic would go here
  };

  const handleRemindPayment = (loadId: string) => {
    console.log('Sending payment reminder for:', loadId);
    // Reminder logic would go here (WhatsApp/Email)
  };

  const handleViewInvoice = (loadId: string) => {
    console.log('Viewing invoice for:', loadId);
    // Invoice viewing logic would go here
  };

  return (
    <DashboardLayout
      userRole="broker"
      userName="John Carter"
      userId="BR123456"
      isVerified={false}
      verificationStatus="not-started"
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-[#5B6470]">
          Dashboard &gt; Commission Tracking
        </p>
      </div>

      {/* Header */}
      <div className="mb-8 space-y-3">
        <span className="ov-eyebrow"><span className="dot" />EARNINGS</span>
        <h1 className="ov-display text-4xl">Commission Dashboard</h1>
        <p className="text-[#3E3F46]">
          Track your earnings, manage payments, and analyze performance
        </p>
      </div>

      {/* Block A: Earnings Snapshot */}
      <EarningsSnapshot 
        totalEarned={totalEarned}
        pendingAmount={pendingAmount}
        monthlyChange={monthlyChange}
      />

      {/* Block B: Filter Bar */}
      <FilterBar
        dateRange={dateRange}
        statusFilter={statusFilter}
        onDateRangeChange={setDateRange}
        onStatusFilterChange={setStatusFilter}
        onApplyFilters={handleApplyFilters}
        onExportCSV={handleExportCSV}
      />

      {/* Block C: Commission Details Table */}
      <CommissionTable
        data={commissionData}
        onRemindPayment={handleRemindPayment}
        onViewInvoice={handleViewInvoice}
      />
    </DashboardLayout>
  );
};

export default CommissionTrackingPage;
