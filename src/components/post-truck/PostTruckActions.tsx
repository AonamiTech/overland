
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, FileText, Eye, Send } from 'lucide-react';

interface PostTruckActionsProps {
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPreview: () => void;
}

const PostTruckActions = ({ isSubmitting, onSubmit, onPreview }: PostTruckActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="px-6 h-11"
          style={{ borderColor: '#E7E3DC' }}
        >
          <Save className="w-4 h-4 mr-2" strokeWidth={1.8} />
          Save as Template
        </Button>
        <Button
          type="button"
          variant="outline"
          className="px-6 h-11"
          style={{ borderColor: '#E7E3DC' }}
        >
          <FileText className="w-4 h-4 mr-2" strokeWidth={1.8} />
          Save Draft
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onPreview}
          className="px-6 h-11"
          style={{ borderColor: '#E7E3DC' }}
        >
          <Eye className="w-4 h-4 mr-2" strokeWidth={1.8} />
          Preview
        </Button>
      </div>

      {/* Primary Action */}
      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="px-8 h-12 text-white font-semibold text-base transition-all duration-200"
        style={{ background: '#111217' }}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Posting...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5" strokeWidth={1.8} />
            <span>Post Truck</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default PostTruckActions;
