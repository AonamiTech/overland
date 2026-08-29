import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import BrokerLoginModal from './BrokerLoginModal';
import FleetOwnerModal from './FleetOwnerModal';
import CorporateRegistrationModal from './CorporateRegistrationModal';
import ContactModal from './ContactModal';

const Hero = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBrokerOnboardingOpen, setIsBrokerOnboardingOpen] = useState(false);
  const [isFleetOnboardingOpen, setIsFleetOnboardingOpen] = useState(false);
  const [isCorporateOnboardingOpen, setIsCorporateOnboardingOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [perMile, setPerMile] = useState(2.42);
  const [bidsPlaced, setBidsPlaced] = useState(1863);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    const tick = setInterval(() => {
      setPerMile((p) => Math.max(2.3, Math.min(2.55, +(p + (Math.random() - 0.45) * 0.02).toFixed(2))));
      setBidsPlaced((b) => b + Math.floor(Math.random() * 3));
    }, 3000);
    return () => { clearInterval(timeInterval); clearInterval(tick); };
  }, []);

  const handleLoginSuccess = (role: 'broker' | 'fleet' | 'corporate') => console.log(`Login successful for ${role}`);
  const handleOnboardingSuccess = () => {
    setIsBrokerOnboardingOpen(false);
    setIsFleetOnboardingOpen(false);
    setIsCorporateOnboardingOpen(false);
  };

  const kpis = [
    { label: 'Open auctions', value: '247', delta: '+12 today' },
    { label: 'Bids placed', value: bidsPlaced.toLocaleString(), delta: '+47 live' },
    { label: 'Avg settled rate', value: '$2,400', delta: '+2.5%' },
    { label: 'Fill rate', value: '96.4%', delta: '+0.8%' },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#FBFAF8] pt-16">
        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-8">
          <div className="grid items-center gap-12 pt-16 pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pt-24 lg:pb-16">

            {/* LEFT — editorial */}
            <div className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <span className="ov-eyebrow ov-num">
                <span className="ov-livedot" />
                Market open
                <span className="text-[#C9C3B8]">/</span>
                <span className="font-normal tracking-normal text-[#8B857C]">{currentTime.toLocaleTimeString('en-US', { hour12: true })} ET</span>
              </span>

              <h1 className="ov-display mt-6 text-[clamp(42px,5.6vw,72px)]">
                The freight market,<br />
                <span className="ov-ital">priced in the open.</span>
              </h1>

              <p className="mt-6 max-w-[31rem] font-poppins text-[17px] leading-relaxed text-[#55565E]">
                Overland runs continuous auctions on live lanes. Shippers see every bid.
                Carriers see every load. Nobody sees a hidden margin.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={() => navigate('/corporate-bidding-exchange')} className="ov-btn ov-btn-ink">
                  Enter the exchange
                  <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
                <button onClick={() => setIsLoginModalOpen(true)} className="ov-btn ov-btn-outline">
                  Watch a lane price
                </button>
              </div>
            </div>

            {/* RIGHT — National Dry Van Index card */}
            <div className={`transition-all delay-150 duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <div className="ov-card overflow-hidden" style={{ boxShadow: '0 30px 70px -44px rgba(31,63,209,0.30)' }}>
                <div className="flex items-center justify-between px-7 pt-6">
                  <span className="ov-num text-[11px] font-medium uppercase tracking-[0.14em] text-[#8B857C]">National dry van index</span>
                  <span className="ov-num text-[12px] font-medium text-[#0F7A4A]">+2.5%</span>
                </div>

                <div className="px-7 pt-5">
                  <div className="flex items-end gap-2">
                    <span className="ov-num text-[52px] font-medium leading-none text-[#14161A]">${perMile.toFixed(2)}</span>
                    <span className="mb-1.5 font-poppins text-[13px] text-[#8B857C]">per mile, avg</span>
                  </div>
                </div>

                {/* sparkline */}
                <div className="px-4 pt-4">
                  <svg viewBox="0 0 460 76" className="ov-spark h-[76px] w-full" preserveAspectRatio="none" fill="none">
                    <path d="M0,58 L33,55 L66,57 L99,50 L132,52 L165,45 L198,47 L231,40 L264,43 L297,35 L330,33 L363,29 L396,31 L429,22 L460,17"
                      stroke="#1F3FD1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* footer cells */}
                <div className="mt-4 grid grid-cols-2 border-t border-[#EEEAE3]">
                  <div className="border-r border-[#EEEAE3] px-7 py-5">
                    <div className="ov-num text-[11px] uppercase tracking-[0.12em] text-[#A9A29A]">Hot lane</div>
                    <div className="mt-1.5 font-poppins text-[15px] font-medium text-[#14161A]">Los Angeles → Dallas</div>
                  </div>
                  <div className="px-7 py-5">
                    <div className="ov-num text-[11px] uppercase tracking-[0.12em] text-[#A9A29A]">Open auctions</div>
                    <div className="ov-num mt-1.5 text-[15px] font-semibold text-[#14161A]">247</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center font-poppins text-[11px] text-[#A9A29A]">
                Illustrative market data · index updates live
              </p>
            </div>
          </div>

          {/* KPI band */}
          <div className={`grid grid-cols-2 gap-px overflow-hidden border-t border-[#E7E3DC] bg-[#E7E3DC] md:grid-cols-4 transition-all delay-300 duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {kpis.map((k) => (
              <div key={k.label} className="bg-[#FBFAF8] px-2 py-8 sm:px-4">
                <div className="ov-num text-[11px] uppercase tracking-[0.12em] text-[#A9A29A]">{k.label}</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="ov-num text-[34px] font-medium leading-none text-[#14161A] sm:text-[40px]">{k.value}</span>
                  <span className="ov-num text-[12px] font-medium text-[#0F7A4A]">{k.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <BrokerLoginModal isOpen={isBrokerOnboardingOpen} onClose={() => setIsBrokerOnboardingOpen(false)} onLoginSuccess={handleOnboardingSuccess} />
      <FleetOwnerModal isOpen={isFleetOnboardingOpen} onClose={() => setIsFleetOnboardingOpen(false)} onLoginSuccess={handleOnboardingSuccess} />
      <CorporateRegistrationModal isOpen={isCorporateOnboardingOpen} onClose={() => setIsCorporateOnboardingOpen(false)} onRegistrationSuccess={handleOnboardingSuccess} />
    </>
  );
};

export default Hero;
