import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Lane {
  origin: string;
  dest: string;
  miles: number;
  pickup: string;
  equipment: string;
  bidders: number;
  bid: number;
  delta: number;
  secs: number;
}

const INITIAL: Lane[] = [
  { origin: 'Los Angeles', dest: 'Dallas', miles: 1435, pickup: 'Aug 7', equipment: "Flatbed", bidders: 22, bid: 2438, delta: 66, secs: 9054 },
  { origin: 'Dallas', dest: 'Newark', miles: 1552, pickup: 'Aug 6', equipment: "Dry van 53'", bidders: 17, bid: 3215, delta: 45, secs: 9910 },
  { origin: 'Atlanta', dest: 'Miami', miles: 662, pickup: 'Aug 5', equipment: 'Reefer', bidders: 12, bid: 1329, delta: 59, secs: 5494 },
  { origin: 'Phoenix', dest: 'Los Angeles', miles: 372, pickup: 'Aug 5', equipment: "Dry van 53'", bidders: 21, bid: 1156, delta: 108, secs: 7274 },
  { origin: 'Chicago', dest: 'Denver', miles: 1003, pickup: 'Aug 6', equipment: "Dry van 53'", bidders: 9, bid: 1871, delta: -15, secs: 10834 },
  { origin: 'Seattle', dest: 'Salt Lake City', miles: 832, pickup: 'Aug 8', equipment: 'Reefer', bidders: 15, bid: 2118, delta: 106, secs: 12614 },
];

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const LiveMarket = () => {
  const navigate = useNavigate();
  const [lanes, setLanes] = useState<Lane[]>(INITIAL);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      setLanes((prev) => prev.map((l) => ({ ...l, secs: Math.max(0, l.secs - 1) })));
    }, 1000);
    const b = setInterval(() => {
      setLanes((prev) => prev.map((l) => {
        const move = Math.random() > 0.6 ? Math.floor(Math.random() * 30) - 8 : 0;
        return move ? { ...l, bid: l.bid + move, delta: l.delta + move, bidders: l.bidders + (Math.random() > 0.9 ? 1 : 0) } : l;
      }));
    }, 3200);
    return () => { clearInterval(t); clearInterval(b); };
  }, []);

  return (
    <section id="market" className="bg-[#FBFAF8] py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        {/* header */}
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="ov-eyebrow"><span className="dot" />Live market</span>
            <h2 className="ov-display mt-4 text-[clamp(30px,4vw,50px)]">
              Live lanes, <span className="ov-ital">priced right now.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#E7E3DC] bg-white px-3.5 py-2">
            <span className="ov-livedot" />
            <span className="ov-num text-[11px] font-medium uppercase tracking-[0.12em] text-[#5B6470]">Market open</span>
            <span className="ov-num text-[12px] text-[#A9A29A]">{clock.toLocaleTimeString('en-US', { hour12: false })} ET</span>
          </div>
        </div>

        {/* table */}
        <div className="mt-10 overflow-x-auto">
          <div className="min-w-[820px]">
            {/* column header */}
            <div className="grid grid-cols-[minmax(210px,1.7fr)_120px_84px_130px_120px_120px] items-center gap-4 px-2 pb-3">
              {['Lane', 'Equipment', 'Bidders', 'Current bid', 'Time left', ''].map((h, i) => (
                <span key={i} className={`ov-num text-[10px] uppercase tracking-[0.12em] text-[#A9A29A] ${i >= 3 && i <= 4 ? 'text-right' : ''}`}>{h}</span>
              ))}
            </div>

            {lanes.map((l) => {
              const up = l.delta >= 0;
              return (
                <div key={`${l.origin}-${l.dest}`} className="ov-mkt-row grid grid-cols-[minmax(210px,1.7fr)_120px_84px_130px_120px_120px] items-center gap-4 px-2 py-4">
                  <div>
                    <div className="font-poppins text-[15px] font-medium text-[#14161A]">{l.origin} <span className="text-[#B9B1A6]">→</span> {l.dest}</div>
                    <div className="ov-num mt-0.5 text-[11px] text-[#A9A29A]">{l.miles.toLocaleString()} mi · picks up {l.pickup}</div>
                  </div>
                  <div className="font-poppins text-[13px] text-[#5B6470]">{l.equipment}</div>
                  <div className="ov-num text-[13px] text-[#5B6470]">{l.bidders}</div>
                  <div className="text-right">
                    <div className="ov-num text-[16px] font-semibold text-[#14161A]">${l.bid.toLocaleString()}</div>
                    <div className="ov-num text-[11px] font-medium" style={{ color: up ? '#0F7A4A' : '#A8412F' }}>
                      {up ? '+' : '−'}${Math.abs(l.delta)}
                    </div>
                  </div>
                  <div className="ov-num text-right text-[13px] tabular-nums text-[#5B6470]">{fmt(l.secs)}</div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/corporate-bidding-exchange')}
                      className="rounded-full border border-[#D8D3CA] bg-white px-4 py-2 font-poppins text-[13px] font-semibold text-[#14161A] transition-colors hover:border-[#14161A]"
                    >
                      Place bid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <button onClick={() => navigate('/corporate-bidding-exchange')} className="ov-btn ov-btn-ink">
            See the full board
            <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <span className="ov-num text-[12px] text-[#A9A29A]">Flat 3% on settled freight. No brokerage spread.</span>
        </div>
      </div>
    </section>
  );
};

export default LiveMarket;
