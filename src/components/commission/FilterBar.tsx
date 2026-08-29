
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// SVG Icons
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FunnelIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m3-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface FilterBarProps {
  dateRange: { start: string; end: string };
  statusFilter: string;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onStatusFilterChange: (status: string) => void;
  onApplyFilters: () => void;
  onExportCSV: () => void;
}

const FilterBar = ({
  dateRange,
  statusFilter,
  onDateRangeChange,
  onStatusFilterChange,
  onApplyFilters,
  onExportCSV
}: FilterBarProps) => {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showSavedFilters, setShowSavedFilters] = useState(false);

  const savedFilters = [
    { name: 'Last 30 Days - Paid', count: 3 },
    { name: 'This Quarter - All', count: 5 },
    { name: 'Pending Only', count: 2 }
  ];

  React.useEffect(() => {
    let count = 0;
    if (dateRange.start || dateRange.end) count++;
    if (statusFilter && statusFilter !== 'all') count++;
    setActiveFiltersCount(count);
  }, [dateRange, statusFilter]);

  return (
    <Card className="ov-card mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-[#3E3F46] mb-2 flex items-center space-x-1">
              <CalendarIcon />
              <span>Start Date</span>
            </label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              className="bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-[#3E3F46] mb-2 flex items-center space-x-1">
              <CalendarIcon />
              <span>End Date</span>
            </label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              className="bg-white border-[#E7E3DC] focus:border-[#0E32E8]"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-[#3E3F46] mb-2">
              Payment Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full p-2.5 border border-[#E7E3DC] rounded-lg focus:border-[#0E32E8] focus:ring-1 focus:ring-[#0E32E8] appearance-none bg-white pr-8"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          {/* Saved Filters */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#3E3F46] mb-2">
              Saved Filters
            </label>
            <Button
              variant="outline"
              onClick={() => setShowSavedFilters(!showSavedFilters)}
              className="w-full justify-between border-[#E7E3DC] text-[#3E3F46] hover:bg-[#FBFAF8] bg-white"
            >
              <span>Quick Filters</span>
              <ChevronDownIcon />
            </Button>

            {showSavedFilters && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E3DC] rounded-lg shadow-lg z-10">
                {savedFilters.map((filter, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 hover:bg-[#FBFAF8] first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                  >
                    <span className="text-sm text-[#3E3F46]">{filter.name}</span>
                    <Badge variant="outline" className="text-xs border-[#E7E3DC] ov-num">
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Apply Filters */}
          <div>
            <Button
              onClick={onApplyFilters}
              className="w-full bg-[#111217] hover:bg-black text-white relative"
            >
              <FunnelIcon />
              <span>Apply Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#0E32E8] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ov-num">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Export CSV */}
          <div>
            <Button
              variant="outline"
              onClick={onExportCSV}
              className="w-full border-[#E7E3DC] text-[#3E3F46] hover:bg-[#FBFAF8] bg-white"
            >
              <DownloadIcon />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
