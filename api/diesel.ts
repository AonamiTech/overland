/**
 * US on-highway diesel, weekly, from the EIA.
 *
 * Runs server-side for one reason: the API key. Anything prefixed `VITE_` is
 * inlined into the client bundle at build time, so putting the key there would
 * publish it — and this repository is public. The key stays in a Vercel
 * environment variable that only this function reads.
 *
 * Diesel is the one genuinely real number we can put on the page. Every rate in
 * the lane index is modelled; this is measured, published weekly by the US
 * Department of Energy, and it is what a carrier's cost actually moves with.
 */

type EiaRow = { period: string; value: number | string };

const SERIES =
  'https://api.eia.gov/v2/petroleum/pri/gnd/data/' +
  '?frequency=weekly&data[0]=value' +
  '&facets[product][]=EPD2D&facets[duoarea][]=NUS' +
  '&sort[0][column]=period&sort[0][direction]=desc&length=8';

/** Typical loaded fuel economy for a class-8 tractor. Used only to express the
 *  published price as cost per mile, which is the unit freight is priced in. */
const MPG = 6.5;

type ApiReq = { url?: string };
type ApiRes = {
  setHeader(k: string, v: string): void;
  status(c: number): { json(b: unknown): void };
};

export default async function handler(req: ApiReq, res: ApiRes) {
  const url = req?.url ?? '';
  if (url.includes('health=1') || url.includes('health=true')) {
    res.status(200).json({
      status: 'ok',
      endpoint: 'diesel',
      configured: Boolean(process.env.EIA_API_KEY),
    });
    return;
  }

  const key = process.env.EIA_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'Diesel feed is not configured.' });
    return;
  }

  try {
    const r = await fetch(`${SERIES}&api_key=${key}`);
    if (!r.ok) throw new Error(`EIA responded ${r.status}`);
    const body = (await r.json()) as { response?: { data?: EiaRow[] } };
    const rows = body.response?.data ?? [];
    if (!rows.length) throw new Error('EIA returned no rows');

    const num = (v: EiaRow['value']) => (typeof v === 'number' ? v : Number(v));
    const latest = num(rows[0].value);
    const prior = rows[1] ? num(rows[1].value) : null;

    // A week is a short window; a year ago is the comparison a carrier actually
    // feels. Eight weekly points is all we fetch, so this stays week-over-week.
    const change = prior === null ? null : latest - prior;

    res.setHeader(
      'Cache-Control',
      // The series updates once a week, on Mondays. An hour of edge cache costs
      // nothing in freshness and keeps us far inside EIA's rate limit.
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );
    res.status(200).json({
      week: rows[0].period,
      usdPerGallon: Number(latest.toFixed(3)),
      changeWeek: change === null ? null : Number(change.toFixed(3)),
      usdPerMile: Number((latest / MPG).toFixed(2)),
      mpgAssumed: MPG,
      history: rows.map((d) => ({ week: d.period, value: num(d.value) })).reverse(),
      source: 'US Energy Information Administration, weekly retail on-highway diesel',
    });
  } catch (e) {
    // A dead feed must never take the page down; the caller renders nothing.
    res.status(502).json({ error: e instanceof Error ? e.message : 'Diesel feed unavailable.' });
  }
}
