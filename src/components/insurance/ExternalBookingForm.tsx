
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadIcon, FileTextIcon, Trash2Icon } from './InsuranceIcons';

interface UploadedDocument {
  name: string;
  size: string;
  type: string;
}

interface ExternalBookingFormProps {
  uploadedDocument: UploadedDocument | null;
  enableClaimSupport: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteDocument: () => void;
  onClaimSupportChange: (enabled: boolean) => void;
}

const ExternalBookingForm: React.FC<ExternalBookingFormProps> = ({
  uploadedDocument,
  enableClaimSupport,
  onFileUpload,
  onDeleteDocument,
  onClaimSupportChange
}) => {
  return (
    <div className="space-y-4 p-5 rounded-[14px]" style={{ background: '#FBFAF8', border: '1px solid #E7E3DC', borderLeft: '3px solid #0E32E8' }}>
      <span className="ov-eyebrow"><span className="dot" />External Booking Details</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#3E3F46]">
            Insurer Name
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select or type insurer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icici">Progressive Commercial</SelectItem>
              <SelectItem value="hdfc">Nationwide</SelectItem>
              <SelectItem value="bajaj">Bajaj Allianz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-[#3E3F46]">
            Policy Number (Optional)
          </label>
          <Input placeholder="Enter existing policy number" />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium mb-2 text-[#3E3F46]">
          Upload External Booking Document *
        </label>
        {!uploadedDocument ? (
          <div className="rounded-[14px] p-6 text-center transition-colors" style={{ border: '2px dashed #E7E3DC' }}>
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-[#A9A29A]" />
            <p className="text-sm mb-2 text-[#5B6470]">Drag & drop or click to upload</p>
            <input
              type="file"
              onChange={onFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" className="ov-btn ov-btn-outline cursor-pointer">
                Choose File
              </Button>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-[14px]" style={{ background: '#FFFFFF', border: '1px solid #E7E3DC' }}>
            <div className="flex items-center space-x-3">
              <FileTextIcon className="w-5 h-5 text-[#0F7A4A]" />
              <div>
                <p className="text-sm font-medium text-[#14161A]">{uploadedDocument.name}</p>
                <p className="text-xs ov-num text-[#5B6470]">{uploadedDocument.size}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteDocument}
              style={{ color: '#A8412F' }}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Claim Support Checkbox */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="claim-support"
          checked={enableClaimSupport}
          onChange={(e) => onClaimSupportChange(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="claim-support" className="text-sm text-[#3E3F46]">
          <span className="font-medium text-[#14161A]">Enable Claim Support via Overland</span>
          <p className="text-xs mt-1 text-[#5B6470]">
            We'll help process claims directly with your provider
          </p>
        </label>
      </div>

      {enableClaimSupport && (
        <div className="p-3 rounded-[14px]" style={{ background: 'rgba(14,50,232,0.08)', border: '1px solid rgba(14,50,232,0.18)' }}>
          <p className="text-sm text-[#0E32E8]">
            Smart Claim Tracking enabled - We'll monitor and assist with your claims
          </p>
        </div>
      )}
    </div>
  );
};

export default ExternalBookingForm;
