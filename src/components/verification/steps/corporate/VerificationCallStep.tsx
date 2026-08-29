
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar as CalendarIcon, Clock, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface VerificationCallStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const VerificationCallStep = ({ data, onNext, onBack }: VerificationCallStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [contactPerson, setContactPerson] = useState(data.contactPerson || 'Robert Miller');
  const [alternateContact, setAlternateContact] = useState(data.alternateContact || '');
  const [isScheduled, setIsScheduled] = useState(false);

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleScheduleCall = () => {
    if (selectedDate && selectedTime && contactPerson) {
      setIsScheduled(true);
      setTimeout(() => {
        onNext({
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          contactPerson,
          alternateContact
        });
      }, 1500);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const inputClass = "mt-1 bg-white border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-2 focus:ring-[#0E32E8]/15 placeholder:text-[#A9A29A]";

  if (isScheduled) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-[#0F7A4A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-7 h-7 text-[#0F7A4A]" strokeWidth={1.8} />
          </div>
          <h2 className="ov-display text-3xl mb-4">Verification Call Scheduled</h2>
          <div className="bg-[#0F7A4A]/5 border border-[#0F7A4A]/20 rounded-[18px] p-6 mb-6 text-left">
            <h3 className="font-semibold text-[#14161A] mb-3">Call Details</h3>
            <div className="space-y-2 text-sm text-[#3E3F46]">
              <p><span className="text-[#5B6470]">Date:</span> <span className="ov-num">{selectedDate && formatDate(selectedDate)}</span></p>
              <p><span className="text-[#5B6470]">Time:</span> <span className="ov-num">{selectedTime}</span></p>
              <p><span className="text-[#5B6470]">Contact Person:</span> {contactPerson}</p>
            </div>
          </div>
          <p className="text-[#5B6470]">Our verification team will call you at the scheduled time. Please keep your documents ready.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="ov-eyebrow justify-center mb-3"><span className="dot" />Corporate KYC</div>
          <h2 className="ov-display text-3xl mb-2">Schedule Verification Call</h2>
          <p className="text-[#5B6470]">Our team will verify your business over a 15-min call. Choose a time that works for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="space-y-6">
            <div>
              <h3 className="ov-display text-lg mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                Select Date
              </h3>
              <div className="ov-card p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Time Slots & Contact Info */}
          <div className="space-y-6">
            {/* Time Slots */}
            <div>
              <h3 className="ov-display text-lg mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                Available Time Slots
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className={selectedTime === time ? "ov-btn ov-btn-ink ov-num" : "ov-btn ov-btn-outline ov-num"}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="ov-display text-lg mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-[#0E32E8]" strokeWidth={1.8} />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactPerson" className="text-[#5B6470]">Representative Name</Label>
                  <Input
                    id="contactPerson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className={inputClass}
                    placeholder="Who will attend the call?"
                  />
                </div>
                <div>
                  <Label htmlFor="alternateContact" className="text-[#5B6470]">Alternate Contact (Optional)</Label>
                  <Input
                    id="alternateContact"
                    value={alternateContact}
                    onChange={(e) => setAlternateContact(e.target.value)}
                    className={`${inputClass} ov-num`}
                    placeholder="(555) 012-XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Selected Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-[#0E32E8]/5 border border-[#0E32E8]/15 rounded-[18px] p-4">
                <h4 className="font-medium text-[#14161A] mb-2">Selected Slot</h4>
                <div className="space-y-1 text-sm text-[#3E3F46]">
                  <p><span className="text-[#5B6470]">Date:</span> <span className="ov-num">{formatDate(selectedDate)}</span></p>
                  <p><span className="text-[#5B6470]">Time:</span> <span className="ov-num">{selectedTime}</span></p>
                  <p><span className="text-[#5B6470]">Duration:</span> <span className="ov-num">15 minutes</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button onClick={onBack} className="ov-btn ov-btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Back
          </Button>
          <Button
            onClick={handleScheduleCall}
            disabled={!selectedDate || !selectedTime || !contactPerson}
            className="ov-btn ov-btn-ink"
          >
            Book Verification Slot
            <ArrowRight className="w-4 h-4 ml-2 arrow" strokeWidth={1.8} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCallStep;
