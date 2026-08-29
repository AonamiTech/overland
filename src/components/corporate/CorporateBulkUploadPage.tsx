
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '../DashboardLayout';
import { BarChart3, Building, FileText, Download, Upload, Eye, Send } from 'lucide-react';

const CorporateBulkUploadPage = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate validation
      setTimeout(() => {
        setValidationResults({
          totalRecords: 45,
          validRecords: 42,
          errorRecords: 3
        });
      }, 1000);
    }
  };

  const handleDownloadTemplate = (templateType: string) => {
    toast({
      title: "Template Downloaded",
      description: `${templateType} template downloaded successfully`,
    });
  };

  const handleProcessLoads = () => {
    toast({
      title: "Processing Complete",
      description: "42 loads posted for bidding.",
    });
  };

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
        <p className="text-sm ov-num" style={{ color: '#5B6470' }}>Dashboard &gt; Bulk Upload</p>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="ov-eyebrow mb-2"><span className="dot" />BULK UPLOAD</p>
        <h1 className="ov-display text-3xl" style={{ color: '#14161A' }}>
          Bulk Load Upload Center
        </h1>
      </div>

      {/* Step 1: Download Template */}
      <Card className="ov-card mb-8">
        <CardHeader>
          <CardTitle className="ov-display flex items-center gap-2" style={{ color: '#14161A' }}>
            <FileText className="w-5 h-5" style={{ color: '#0E32E8' }} />
            Choose your upload template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="ov-card ov-card--hover cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="ov-tick mx-auto mb-4"><BarChart3 className="w-6 h-6" style={{ color: '#0E32E8' }} /></div>
                <h3 className="ov-display mb-2" style={{ color: '#14161A' }}>Standard Template</h3>
                <p className="text-sm mb-4" style={{ color: '#5B6470' }}>Basic load requirements.</p>
                <Button
                  onClick={() => handleDownloadTemplate('Standard')}
                  className="ov-btn ov-btn-ink w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="ov-card ov-card--hover cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="ov-tick mx-auto mb-4"><Building className="w-6 h-6" style={{ color: '#0E32E8' }} /></div>
                <h3 className="ov-display mb-2" style={{ color: '#14161A' }}>Enterprise Template</h3>
                <p className="text-sm mb-4" style={{ color: '#5B6470' }}>Advanced fields with approvals & cost centers.</p>
                <Button
                  onClick={() => handleDownloadTemplate('Enterprise')}
                  className="ov-btn ov-btn-ink w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="ov-card ov-card--hover cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="ov-tick mx-auto mb-4"><FileText className="w-6 h-6" style={{ color: '#0E32E8' }} /></div>
                <h3 className="ov-display mb-2" style={{ color: '#14161A' }}>Custom Template</h3>
                <p className="text-sm mb-4" style={{ color: '#5B6470' }}>Add custom fields as needed.</p>
                <Button variant="outline" className="ov-btn ov-btn-outline w-full">
                  Configure
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
            <p className="text-sm" style={{ color: '#5B6470' }}>
              <strong style={{ color: '#14161A' }}>Template fields:</strong> Load_ID, Pickup_Location, Delivery_Location, Cargo_Description,
              Weight, Dimensions, Cargo_Value, Insurance_Required, Contact_Person, Department, Cost_Center.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Upload Your File */}
      <Card className="ov-card mb-8">
        <CardHeader>
          <CardTitle className="ov-display flex items-center gap-2" style={{ color: '#14161A' }}>
            <Upload className="w-5 h-5" style={{ color: '#0E32E8' }} />
            Upload Your File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 text-center transition-colors" style={{ borderColor: '#E7E3DC', background: '#FBFAF8' }}>
            <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: '#A9A29A' }} />
            <p className="text-lg mb-2" style={{ color: '#3E3F46' }}>Drag & drop your CSV/XLSX file here</p>
            <p className="text-sm mb-4" style={{ color: '#8B857C' }}>or</p>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="ov-btn ov-btn-outline mb-4">
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs ov-num" style={{ color: '#8B857C' }}>
              Supported formats: .csv, .xlsx | Max size: 10MB | Max 1000 records
            </p>
          </div>

          {uploadedFile && (
            <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(14,50,232,0.08)' }}>
              <p className="text-sm font-medium" style={{ color: '#0E32E8' }}>
                File uploaded: {uploadedFile.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Validation Results */}
      {validationResults && (
        <Card className="ov-card mb-8">
          <CardHeader>
            <CardTitle className="ov-display flex items-center gap-2" style={{ color: '#14161A' }}>
              <BarChart3 className="w-5 h-5" style={{ color: '#0E32E8' }} />
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg text-center" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#5B6470' }} />
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>File</p>
                <p className="ov-num font-semibold" style={{ color: '#14161A' }}>monthly_shipments_dec2024.csv</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <BarChart3 className="w-8 h-8 mx-auto mb-2" style={{ color: '#0E32E8' }} />
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Total Records</p>
                <p className="text-xl font-bold ov-num" style={{ color: '#0E32E8' }}>{validationResults.totalRecords}</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#0F7A4A' }} />
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Valid</p>
                <p className="text-xl font-bold ov-num" style={{ color: '#0F7A4A' }}>{validationResults.validRecords}</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#A8412F' }} />
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Errors</p>
                <p className="text-xl font-bold ov-num" style={{ color: '#A8412F' }}>{validationResults.errorRecords}</p>
              </div>
            </div>

            {validationResults.errorRecords > 0 && (
              <div className="mb-6">
                <h4 className="ov-display mb-3" style={{ color: '#14161A' }}>Error Details</h4>
                <div className="rounded-lg p-4 max-h-64 overflow-y-auto" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-4 font-medium pb-2" style={{ color: '#5B6470', borderBottom: '1px solid #ECE8E1' }}>
                      <span className="uppercase tracking-wide text-xs">Row #</span>
                      <span className="uppercase tracking-wide text-xs">Field</span>
                      <span className="uppercase tracking-wide text-xs">Error Message</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4" style={{ color: '#A8412F' }}>
                      <span className="ov-num">15</span>
                      <span className="ov-num">Pickup_Location</span>
                      <span>Invalid format</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4" style={{ color: '#A8412F' }}>
                      <span className="ov-num">23</span>
                      <span className="ov-num">Cargo_Value</span>
                      <span>Missing value</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4" style={{ color: '#A8412F' }}>
                      <span className="ov-num">31</span>
                      <span className="ov-num">Delivery_Date</span>
                      <span>Invalid date format</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button variant="outline" className="ov-btn ov-btn-outline">
                <Download className="w-4 h-4 mr-2" />
                Download Error Report
              </Button>
              <Button variant="outline" className="ov-btn ov-btn-outline">
                <Upload className="w-4 h-4 mr-2" />
                Fix & Re-upload
              </Button>
              <Button
                onClick={handleProcessLoads}
                className="ov-btn ov-btn-ink"
              >
                <Send className="w-4 h-4 mr-2" />
                Process Valid
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Submit */}
      {validationResults && (
        <Card className="ov-card">
          <CardHeader>
            <CardTitle className="ov-display flex items-center gap-2" style={{ color: '#14161A' }}>
              <Eye className="w-5 h-5" style={{ color: '#0E32E8' }} />
              Review & Submit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Ready for Processing</p>
                <p className="text-xl font-bold ov-num" style={{ color: '#0F7A4A' }}>{validationResults.validRecords} loads</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Estimated Total Value</p>
                <p className="text-xl font-bold ov-num" style={{ color: '#0E32E8' }}>$340,000</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Insurance Required</p>
                <p className="text-xl font-bold ov-num" style={{ color: '#14161A' }}>38 loads</p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC' }}>
                <p className="text-xs uppercase tracking-wide ov-num" style={{ color: '#5B6470' }}>Pickup Dates</p>
                <p className="text-sm font-bold ov-num" style={{ color: '#B45309' }}>Dec 20 – Dec 30 2024</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="ov-display mb-3" style={{ color: '#14161A' }}>Processing Options</h4>
              <div className="space-y-2" style={{ color: '#3E3F46' }}>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="processing" value="immediate" defaultChecked style={{ accentColor: '#0E32E8' }} />
                  <span>Post all loads immediately for bidding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="processing" value="scheduled" style={{ accentColor: '#0E32E8' }} />
                  <span>Schedule posting:</span>
                  <input type="datetime-local" className="ml-2 rounded px-2 py-1 text-sm ov-num" style={{ border: '1px solid #E7E3DC' }} />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="processing" value="draft" style={{ accentColor: '#0E32E8' }} />
                  <span>Save as draft for review</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" className="ov-btn ov-btn-outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview Loads
              </Button>
              <Button variant="secondary" className="ov-btn ov-btn-outline">
                Save Draft
              </Button>
              <Button
                onClick={handleProcessLoads}
                className="ov-btn ov-btn-ink"
              >
                <Send className="w-4 h-4 mr-2" />
                Post All for Bidding
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default CorporateBulkUploadPage;
