
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const notifications = [
    {
      id: 1,
      title: "New Bid Alert",
      message: "Your bid for Los Angeles → Dallas route has been outbid",
      time: "2 mins ago",
      unread: true
    },
    {
      id: 2,
      title: "Route Update",
      message: "Chicago → Atlanta route now accepting bids",
      time: "15 mins ago",
      unread: true
    },
    {
      id: 3,
      title: "Market Alert",
      message: "Dallas → Newark prices dropped by 5%",
      time: "1 hour ago",
      unread: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white border border-[#E7E3DC] rounded-[20px]">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
            <DialogTitle className="ov-display text-xl">
              Notifications
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto text-[#5B6470]"
          >
            <X className="w-4 h-4" strokeWidth={1.8} />
          </Button>
        </DialogHeader>

        <div className="px-6 pb-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-[#A9A29A] mx-auto mb-3" strokeWidth={1.8} />
              <p className="text-[#8B857C] font-poppins">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.unread
                      ? 'bg-[rgba(14,50,232,0.05)] border-[rgba(14,50,232,0.15)]'
                      : 'bg-[#FBFAF8] border-[#ECE8E1]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[#14161A] text-sm">
                      {notification.title}
                    </h4>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-[#0E32E8] rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-[#5B6470] mb-2">
                    {notification.message}
                  </p>
                  <p className="ov-num text-xs text-[#8B857C]">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-[#ECE8E1]">
            <Button
              variant="outline"
              className="ov-btn ov-btn-outline w-full rounded-lg"
            >
              Mark All as Read
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
