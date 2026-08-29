
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Send, User, Building } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#E7E3DC] rounded-[20px]">
        <DialogHeader className="text-center pb-6 border-b border-[#ECE8E1]">
          <DialogTitle
            className="ov-display text-3xl mb-2"
          >
            Get in Touch
          </DialogTitle>
          <p
            className="text-[#5B6470] text-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Ready to revolutionize your freight operations? Let's talk.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3
              className="ov-display text-xl mb-4"
            >
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="ov-tick w-10 h-10 rounded-full">
                  <Phone className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-medium text-[#14161A]">Phone</p>
                  <p className="ov-num text-[#5B6470]">(213) 555-0142</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="ov-tick w-10 h-10 rounded-full">
                  <Mail className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-medium text-[#14161A]">Email</p>
                  <p className="text-[#5B6470]">contact@overland.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="ov-tick w-10 h-10 rounded-full">
                  <MapPin className="w-5 h-5 text-[#0E32E8]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-medium text-[#14161A]">Address</p>
                  <p className="text-[#5B6470]">Los Angeles, California, USA</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-[#F1EEE8] rounded-2xl">
              <h4 className="font-semibold text-[#14161A] mb-2">Why Choose Overland?</h4>
              <ul className="text-sm text-[#5B6470] space-y-1">
                <li>• 24/7 Customer Support</li>
                <li>• Verified Fleet Network</li>
                <li>• Real-time Tracking</li>
                <li>• Competitive Pricing</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#3E3F46] font-medium">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#8B857C]" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 rounded-lg placeholder:text-[#A9A29A]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#3E3F46] font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#8B857C]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 rounded-lg placeholder:text-[#A9A29A]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#3E3F46] font-medium">
                  Company Name
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-[#8B857C]" />
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="pl-10 border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 rounded-lg placeholder:text-[#A9A29A]"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#3E3F46] font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-[#8B857C]" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 rounded-lg placeholder:text-[#A9A29A]"
                    placeholder="(213) 555-0142"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-[#3E3F46] font-medium">
                Subject *
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 rounded-lg placeholder:text-[#A9A29A]"
                placeholder="What can we help you with?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[#3E3F46] font-medium">
                Message *
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="border-[#E7E3DC] focus:border-[#0E32E8] focus:ring-[#0E32E8]/15 rounded-lg resize-none placeholder:text-[#A9A29A]"
                placeholder="Tell us more about your freight requirements..."
              />
            </div>

            <Button
              type="submit"
              className="ov-btn ov-btn-ink w-full py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" strokeWidth={1.8} />
              <span>Send Message</span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
