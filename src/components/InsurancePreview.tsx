import { Package, Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InsurancePreview = () => {
  const navigate = useNavigate();
  const go = () => navigate('/insurance');

  const insuranceCards = [
    {
      icon: Package,
      title: "Cargo in transit",
      benefits: [
        "Damage and theft cover, auto-activated on dispatch",
        "Coverage up to $250K per load",
        "Claims initiated in under 48 hours",
      ],
    },
    {
      icon: Truck,
      title: "Truck & driver",
      benefits: [
        "Full vehicle and third-party liability",
        "Driver accident protection",
        "Roadside and repair add-ons",
      ],
    },
  ];

  return (
    <section className="bg-[#FBFAF8] py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="ov-eyebrow"><span className="dot" />Coverage</span>
            <h2 className="ov-display mt-4 text-[clamp(30px,4vw,50px)]">
              Insurance that moves with the load.
            </h2>
            <p className="mt-4 max-w-xl font-poppins text-[16px] leading-relaxed text-[#6B6B72]">
              Bind cover for goods and vehicles right inside the booking flow. No brokers, no paperwork chase.
            </p>
          </div>
          <button onClick={go} className="ov-btn ov-btn-ink shrink-0">
            Explore coverage
            <ArrowRight className="arrow h-4 w-4" />
          </button>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {insuranceCards.map((card) => (
            <button
              key={card.title}
              onClick={go}
              className="ov-card ov-card--hover group p-8 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="ov-tick h-11 w-11">
                  <card.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="ov-display text-[22px]">{card.title}</h3>
              </div>
              <ul className="mt-6 space-y-3">
                {card.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <svg className="mt-1 h-4 w-4 shrink-0 text-[#0E32E8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    <span className="font-poppins text-[15px] text-[#3E3F46]">{b}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-7 inline-flex items-center gap-1.5 font-poppins text-[14px] font-semibold text-[#0E32E8]">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>

        {/* slim auto-cover note */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#E7E3DC] bg-white px-7 py-5 sm:flex-row sm:items-center">
          <p className="font-poppins text-[15px] text-[#3E3F46]">
            Want auto-coverage on every load you book?
          </p>
          <button onClick={go} className="inline-flex items-center gap-1.5 font-poppins text-[14px] font-semibold text-[#111217] hover:text-[#0E32E8] transition-colors">
            Enable insurance defaults
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InsurancePreview;
