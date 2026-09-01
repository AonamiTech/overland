import React, { useEffect, useState } from 'react';

/**
 * Market headlines from publisher RSS, via the `news` edge function.
 *
 * Headlines and links only - never article text. Every item links out to the source.
 *
 * If the function is not deployed, or every feed is down, this renders NOTHING rather
 * than placeholder headlines. Fabricated market news on a rate board would be worse
 * than an absent section.
 */

const INK = '#111111';
const ACCENT = '#1E4D6B';
const HAIR = 'rgba(17,17,17,.10)';

type Item = { title: string; link: string; source: string; published: string | null };

const when = (iso: string | null) => {
  if (!iso) return '';
  const h = Math.round((Date.now() - Date.parse(iso)) / 36e5);
  if (Number.isNaN(h)) return '';
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

export default function MarketNews() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    if (!base) { setLoading(false); return; }

    fetch(`${base}/functions/v1/news`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // Nothing to show and nothing to fake.
  if (!loading && items.length === 0) return null;

  return (
    <section id="market" className="bg-[#FAF9F7] pb-20 md:pb-28">
      <div className="mx-auto max-w-[1126px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="aon-eyebrow"><span className="dot" /> Market read</span>
            <h2 className="aon-display mt-3 text-[clamp(26px,3.2vw,40px)]">
              What the market is saying.
            </h2>
          </div>
          <p className="aon-body max-w-[30ch] text-[12px] leading-[1.6]">
            Headlines from the trade press on rates and capacity. Links go to the
            publisher.
          </p>
        </div>

        <ul className="mt-8" style={{ borderTop: `1px solid ${HAIR}` }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="py-4" style={{ borderBottom: `1px solid ${HAIR}` }}>
                  <div className="h-3 w-2/3 rounded" style={{ background: 'rgba(17,17,17,.06)' }} />
                </li>
              ))
            : items.map((it) => (
                <li key={it.link} style={{ borderBottom: `1px solid ${HAIR}` }}>
                  <a
                    href={it.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 transition-opacity hover:opacity-70"
                  >
                    <span className="max-w-[62ch] text-[15px] leading-[1.5]"
                          style={{ fontFamily: 'Poppins, sans-serif', color: INK }}>
                      {it.title}
                    </span>
                    <span className="flex shrink-0 items-baseline gap-3">
                      <span className="aon-eyebrow" style={{ color: ACCENT, fontSize: 9 }}>{it.source}</span>
                      <span className="aon-num text-[11px]" style={{ color: 'rgba(17,17,17,.65)' }}>
                        {when(it.published)}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
