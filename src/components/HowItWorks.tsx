import { FileText, Gavel, ShieldCheck, Clock, MapPin, BadgeCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Post your lane",
      description: "Share route, equipment, and pickup window. It hits the exchange in seconds.",
    },
    {
      number: "02",
      icon: Gavel,
      title: "Carriers bid live",
      description: "Carriers compete in real time. You watch the rate settle to market.",
    },
    {
      number: "03",
      icon: ShieldCheck,
      title: "Book & track",
      description: "Award the load, then follow it with live GPS and instant delivery proof.",
    },
  ];

  const features = [
    { icon: Clock, title: "Instant booking", description: "Award a carrier in a few clicks, not a few days." },
    { icon: MapPin, title: "Live tracking", description: "Real-time location and ETA on every active load." },
    { icon: BadgeCheck, title: "Verified end to end", description: "Carriers, authority, and equipment checked before they bid." },
  ];

  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        {/* header */}
        <div className="max-w-2xl">
          <span className="ov-eyebrow"><span className="dot" />How it works</span>
          <h2 className="ov-display mt-4 text-[clamp(30px,4vw,50px)]">
            Three steps between a load and a truck.
          </h2>
        </div>

        {/* 3 steps */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[#E7E3DC] bg-[#E7E3DC] md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="group bg-white p-8 transition-colors hover:bg-[#FCFCFB]">
              <div className="flex items-center justify-between">
                <span className="ov-num text-[13px] font-semibold text-[#0E32E8]">{step.number}</span>
                <step.icon className="h-5 w-5 text-[#B4B4BC] transition-colors group-hover:text-[#0E32E8]" strokeWidth={1.7} />
              </div>
              <h3 className="ov-display mt-8 text-[24px]">{step.title}</h3>
              <p className="mt-2 font-poppins text-[15px] leading-relaxed text-[#6B6B72]">{step.description}</p>
            </div>
          ))}
        </div>

        {/* feature trio */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4 border-t border-[#E7E3DC] pt-6">
              <div className="ov-tick mt-0.5 h-9 w-9">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="font-poppins text-[15px] font-semibold text-[#111217]">{f.title}</h4>
                <p className="mt-1 font-poppins text-[14px] leading-relaxed text-[#6B6B72]">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
