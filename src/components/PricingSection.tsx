import { useState } from "react";

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$0",
      yearlyPrice: "$0",
      bestFor: "New brokers finding their first loads",
      popular: false,
      features: ["Pay-per-load pricing", "Standard bids", "3 RFQs per day", "Basic support", "Standard tracking"],
      cta: "Get started",
    },
    {
      name: "Pro",
      price: "$49",
      yearlyPrice: "$490",
      bestFor: "Growing teams bidding daily",
      popular: true,
      features: ["Unlimited bids", "Analytics dashboard", "Early RFQ access", "Priority support", "Advanced tracking", "Custom reports"],
      cta: "Start Pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      yearlyPrice: "Custom",
      bestFor: "High-volume fleets and shippers",
      popular: false,
      features: ["Dedicated support", "API access", "White-label bidding", "Custom integrations", "Advanced analytics", "Priority support"],
      cta: "Contact sales",
    },
  ];

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="ov-eyebrow"><span className="dot" />Pricing</span>
            <h2 className="ov-display mt-4 text-[clamp(30px,4vw,50px)]">
              Priced for how you move freight.
            </h2>
          </div>

          {/* toggle */}
          <div className="flex items-center gap-3">
            <span className={`font-poppins text-[14px] font-medium ${!isYearly ? 'text-[#111217]' : 'text-[#9A9AA3]'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isYearly ? 'bg-[#0E32E8]' : 'bg-[#D8D8DE]'}`}
              aria-label="Toggle yearly pricing"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`font-poppins text-[14px] font-medium ${isYearly ? 'text-[#111217]' : 'text-[#9A9AA3]'}`}>Yearly</span>
            <span className="rounded-full bg-[rgba(14,50,232,0.08)] px-2.5 py-1 font-poppins text-[11px] font-semibold text-[#0E32E8]">Save 17%</span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isPro = plan.popular;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[20px] p-8 ${isPro ? 'bg-[#0D0D11] text-white' : 'ov-card'}`}
              >
                {isPro && (
                  <span className="ov-num absolute right-6 top-8 rounded-full bg-[rgba(143,167,255,0.14)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8FA7FF]">
                    Most popular
                  </span>
                )}
                <h3 className={`ov-display text-[22px] ${isPro ? 'text-white' : ''}`}>{plan.name}</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className={`ov-num text-[44px] font-semibold leading-none ${isPro ? 'text-white' : 'text-[#0A0A0C]'}`}>
                    {isYearly ? plan.yearlyPrice : plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className={`font-poppins text-[14px] ${isPro ? 'text-[#8A8A93]' : 'text-[#9A9AA3]'}`}>
                      /{isYearly ? 'yr' : 'mo'}
                    </span>
                  )}
                </div>
                <p className={`mt-3 font-poppins text-[14px] leading-relaxed ${isPro ? 'text-[#A6A6B0]' : 'text-[#6B6B72]'}`}>{plan.bestFor}</p>

                <div className={`my-7 h-px w-full ${isPro ? 'bg-white/10' : 'bg-[#E7E3DC]'}`} />

                <ul className="flex-1 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <svg className={`h-4 w-4 shrink-0 ${isPro ? 'text-[#8FA7FF]' : 'text-[#0E32E8]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      <span className={`font-poppins text-[14px] ${isPro ? 'text-[#D6D6DC]' : 'text-[#3E3F46]'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button className={`ov-btn mt-8 w-full ${isPro ? 'ov-btn-light' : 'ov-btn-outline'}`}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
