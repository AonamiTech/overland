const Testimonials = () => {
  const testimonials = [
    {
      name: "Marcus Reed",
      role: "Logistics Manager",
      company: "Reed Logistics",
      quote: "We used to spend a full day working the phones for one lane. On Overland the rate settles itself in minutes, and every carrier is already verified.",
    },
    {
      name: "Emily Carter",
      role: "Transport Coordinator",
      company: "Heartland Foods",
      quote: "Live tracking and instant booking cut our dwell time noticeably. I can see exactly where every load sits without chasing a single dispatcher.",
    },
    {
      name: "Dave Thompson",
      role: "Owner-Operator",
      company: "Thompson Trucking",
      quote: "As a carrier, this is the first board where I win loads on service, not just who called first. It has grown my monthly revenue for real.",
    },
  ];

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('');

  return (
    <section className="bg-[#FBFAF8] py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="ov-eyebrow"><span className="dot" />Operators</span>
          <h2 className="ov-display mt-4 text-[clamp(30px,4vw,50px)]">
            Trusted by carriers and shippers nationwide.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="ov-card flex flex-col p-8">
              <svg className="h-7 w-7 text-[#0E32E8]/25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 1-3.5 3-4.5L9.5 6zm9 0C15.5 7.5 14 10 14 13v5h6v-6h-3c0-2 1-3.5 3-4.5L18.5 6z" />
              </svg>
              <blockquote className="mt-5 flex-1 font-poppins text-[16px] leading-relaxed text-[#2C2D33]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-[#E7E3DC] pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111217] font-poppins text-[13px] font-semibold text-white">
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block font-poppins text-[14px] font-semibold text-[#111217]">{t.name}</span>
                  <span className="ov-num block text-[11px] text-[#8A8A93]">{t.role} · {t.company}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
