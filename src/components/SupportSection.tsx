import { MessageCircle, HelpCircle, Phone, Mail, ArrowRight } from "lucide-react";

const SupportSection = () => {
  return (
    <section id="support" className="bg-white py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="ov-eyebrow"><span className="dot" />Support</span>
          <h2 className="ov-display mt-4 text-[clamp(30px,4vw,50px)]">
            Real people, whenever you need them.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Live chat */}
          <div className="ov-card ov-card--hover flex flex-col p-8">
            <div className="ov-tick h-11 w-11"><MessageCircle className="h-5 w-5" strokeWidth={1.8} /></div>
            <h3 className="ov-display mt-6 text-[22px]">Live chat</h3>
            <p className="mt-2 flex-1 font-poppins text-[15px] leading-relaxed text-[#6B6B72]">
              Talk to our ops team in seconds, right from your dashboard.
            </p>
            <button className="ov-btn ov-btn-outline mt-6 w-full">Start a chat</button>
          </div>

          {/* Help center */}
          <div className="ov-card ov-card--hover flex flex-col p-8">
            <div className="ov-tick h-11 w-11"><HelpCircle className="h-5 w-5" strokeWidth={1.8} /></div>
            <h3 className="ov-display mt-6 text-[22px]">Help center</h3>
            <p className="mt-2 flex-1 font-poppins text-[15px] leading-relaxed text-[#6B6B72]">
              Guides, FAQs, and how-tos for carriers, brokers, and shippers.
            </p>
            <button className="ov-btn ov-btn-outline mt-6 w-full">Browse articles</button>
          </div>

          {/* Contact */}
          <div className="ov-card flex flex-col justify-center gap-5 p-8">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#0E32E8]" strokeWidth={1.8} />
              <div>
                <div className="ov-num text-[15px] font-semibold text-[#111217]">(800) 555-0199</div>
                <div className="font-poppins text-[12px] text-[#8A8A93]">Mon–Sat, 8am–8pm ET</div>
              </div>
            </div>
            <div className="h-px w-full bg-[#E7E3DC]" />
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#0E32E8]" strokeWidth={1.8} />
              <div>
                <div className="ov-num text-[15px] font-semibold text-[#111217]">support@overland.com</div>
                <div className="font-poppins text-[12px] text-[#8A8A93]">Replies within 2 hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* final CTA band */}
        <div className="mt-8 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[20px] bg-[#0D0D11] p-10 md:flex-row md:items-center">
          <div>
            <h3 className="ov-display text-[28px] text-white">See Overland move your freight.</h3>
            <p className="mt-2 font-poppins text-[15px] text-[#A6A6B0]">
              Book a 20-minute walkthrough with our team and watch a live lane clear.
            </p>
          </div>
          <button className="ov-btn ov-btn-light shrink-0">
            Request a demo
            <ArrowRight className="arrow h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
