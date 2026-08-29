
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, DownloadIcon } from './InsuranceIcons';

interface PolicyHistory {
  policyNo: string;
  loadId: string;
  coverage: string;
  premium: string;
  status: string;
  type: string;
}

interface InsuranceHistoryProps {
  insuranceHistory: PolicyHistory[];
  onPolicyDetails: (policy: PolicyHistory) => void;
}

const InsuranceHistory: React.FC<InsuranceHistoryProps> = ({
  insuranceHistory,
  onPolicyDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500 text-white';
      case 'Expired': return 'bg-gray-500 text-white';
      case 'Claimed': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm mt-8">
      <CardHeader>
        <CardTitle className="text-xl" style={{ fontFamily: 'SF Pro Rounded, sans-serif' }}>
          Insurance History & Claims
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Policy No</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Load ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Coverage</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Premium</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {insuranceHistory.map((policy, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-200">
                  <td className="py-3 px-4 font-medium text-blue-600">{policy.policyNo}</td>
                  <td className="py-3 px-4 text-gray-600">{policy.loadId}</td>
                  <td className="py-3 px-4 text-gray-600">{policy.coverage}</td>
                  <td className="py-3 px-4 text-gray-600">{policy.premium}</td>
                  <td className="py-3 px-4 text-gray-600">{policy.type}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => onPolicyDetails(policy)}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Download
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
  );
};

export default InsuranceHistory;
