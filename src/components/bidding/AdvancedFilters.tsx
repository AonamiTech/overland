
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X, MapPin, Package, Clock, DollarSign, Building } from 'lucide-react';

const AdvancedFilters = ({ filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const routes = [
    'Dallas → Los Angeles',
    'Los Angeles → Chicago',
    'Chicago → Atlanta',
    'Atlanta → Houston',
    'Houston → Phoenix',
    'Phoenix → Dallas'
  ];

  const cargoTypes = [
    'Electronics',
    'FMCG',
    'Pharmaceuticals',
    'Automotive Parts',
    'Textiles',
    'Raw Materials',
    'Food Products'
  ];

  const deadlines = [
    'Next 2 hours',
    'Next 6 hours',
    'Next 24 hours',
    'Next 3 days',
    'Next week'
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleBudgetChange = (value) => {
    const updatedFilters = { ...localFilters, budgetRange: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      route: '',
      cargoType: '',
      budgetRange: [0, 100000],
      deadline: '',
      corporate: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.route) count++;
    if (localFilters.cargoType) count++;
    if (localFilters.deadline) count++;
    if (localFilters.corporate) count++;
    if (localFilters.budgetRange[0] > 0 || localFilters.budgetRange[1] < 100000) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ov-btn ov-btn-outline"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ov-num ml-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </button>

        {getActiveFilterCount() > 0 && (
          <button className="ov-btn ov-btn-ghost text-sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {localFilters.route && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{localFilters.route}</span>
              <button onClick={() => handleFilterChange('route', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.cargoType && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Package className="w-3 h-3" />
              <span>{localFilters.cargoType}</span>
              <button onClick={() => handleFilterChange('cargoType', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.deadline && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{localFilters.deadline}</span>
              <button onClick={() => handleFilterChange('deadline', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.corporate && (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Building className="w-3 h-3" />
              <span>{localFilters.corporate}</span>
              <button onClick={() => handleFilterChange('corporate', '')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="ov-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Route Filter */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Route</span>
                </Label>
                <Select
                  value={localFilters.route}
                  onValueChange={(value) => handleFilterChange('route', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Routes</SelectItem>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cargo Type Filter */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Cargo Type</span>
                </Label>
                <Select
                  value={localFilters.cargoType}
                  onValueChange={(value) => handleFilterChange('cargoType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {cargoTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deadline Filter */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Deadline</span>
                </Label>
                <Select
                  value={localFilters.deadline}
                  onValueChange={(value) => handleFilterChange('deadline', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Time</SelectItem>
                    {deadlines.map((deadline) => (
                      <SelectItem key={deadline} value={deadline}>
                        {deadline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Corporate Filter */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Corporate</span>
                </Label>
                <Input
                  placeholder="Search companies..."
                  value={localFilters.corporate || ''}
                  onChange={(e) => handleFilterChange('corporate', e.target.value)}
                />
              </div>
            </div>

            {/* Budget Range Slider */}
            <div className="mt-6 space-y-3">
              <Label className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Budget Range</span>
              </Label>
              <div className="px-3">
                <Slider
                  value={localFilters.budgetRange}
                  onValueChange={handleBudgetChange}
                  min={0}
                  max={100000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between ov-num text-sm mt-2" style={{ color: '#5B6470' }}>
                  <span>${localFilters.budgetRange[0].toLocaleString()}</span>
                  <span>${localFilters.budgetRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-6">
              <Label className="text-[11px] uppercase tracking-wide mb-3 block" style={{ color: '#5B6470' }}>Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'High Demand', filter: { isHighDemand: true } },
                  { label: 'Premium RFQs', filter: { isPremium: true } },
                  { label: 'Closing Soon', filter: { deadline: 'Next 2 hours' } },
                  { label: 'Large Orders', filter: { budgetRange: [50000, 100000] } }
                ].map((quickFilter, index) => (
                  <button
                    key={index}
                    className="ov-btn ov-btn-outline text-xs px-3 py-2"
                  >
                    {quickFilter.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilters;
