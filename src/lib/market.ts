/**
 * Lane rate market data.
 *
 * Rates are derived from miles x rate-per-mile rather than typed in, so every number
 * on the board is internally consistent: RPM is the metric US freight actually trades
 * on, and a linehaul that does not divide back into a sane RPM reads as fake instantly.
 *
 * History is generated once from a seeded PRNG, never Math.random at render time -
 * otherwise sparklines and averages would jump on every re-render.
 *
 * All of it is demo data. There is no backend yet.
 */

export type Equipment = 'Dry van' | 'Reefer' | 'Flatbed';

/** National spot averages by equipment, USD per mile. Reefer and flatbed carry the
 *  usual premium over dry van. */
const BASE_RPM: Record<Equipment, number> = {
  'Dry van': 2.18,
  Reefer: 2.61,
  Flatbed: 2.74,
};

export type Lane = {
  id: string;
  origin: string;
  originCode: string;
  dest: string;
  destCode: string;
  miles: number;
  equipment: Equipment;
  /** Lane-specific multiplier on the national RPM. Above 1 = tight capacity. */
  tension: number;
  history: number[];   // last 30 sessions, USD per mile
  rpm: number;         // current
  prevRpm: number;     // previous session close
  avgRpm: number;      // mean of history
  linehaul: number;    // rpm * miles, rounded to $5
  loads: number;       // open loads on the lane
  bids: number;        // bids placed today
};

/* mulberry32 - small, fast, seeded. Same board every load. */
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED_LANES: Array<[string, string, string, string, number, Equipment, number]> = [
  ['Los Angeles', 'LAX', 'Phoenix', 'PHX', 372, 'Dry van', 1.14],
  ['Los Angeles', 'LAX', 'Dallas', 'DFW', 1435, 'Dry van', 0.96],
  ['Dallas', 'DFW', 'Atlanta', 'ATL', 781, 'Dry van', 1.02],
  ['Atlanta', 'ATL', 'Miami', 'MIA', 662, 'Reefer', 1.09],
  ['Chicago', 'CHI', 'Atlanta', 'ATL', 716, 'Dry van', 1.05],
  ['Chicago', 'CHI', 'Denver', 'DEN', 1003, 'Dry van', 0.93],
  ['Newark', 'EWR', 'Charlotte', 'CLT', 629, 'Dry van', 1.11],
  ['Dallas', 'DFW', 'Newark', 'EWR', 1552, 'Dry van', 1.01],
  ['Seattle', 'SEA', 'Salt Lake City', 'SLC', 832, 'Reefer', 0.98],
  ['Houston', 'HOU', 'New Orleans', 'MSY', 348, 'Flatbed', 1.07],
  ['Memphis', 'MEM', 'Chicago', 'CHI', 530, 'Dry van', 1.03],
  ['Denver', 'DEN', 'Phoenix', 'PHX', 821, 'Flatbed', 0.95],
  ['Savannah', 'SAV', 'Atlanta', 'ATL', 248, 'Dry van', 1.22],
  ['Laredo', 'LRD', 'San Antonio', 'SAT', 157, 'Dry van', 1.31],
  ['Fresno', 'FAT', 'Seattle', 'SEA', 892, 'Reefer', 1.16],
  ['Detroit', 'DTW', 'Kansas City', 'MCI', 748, 'Flatbed', 0.99],
];

const round5 = (n: number) => Math.round(n / 5) * 5;

export function buildLanes(): Lane[] {
  return SEED_LANES.map(([origin, originCode, dest, destCode, miles, equipment, tension], i) => {
    const rand = rng(1000 + i * 37);
    const base = BASE_RPM[equipment] * tension;

    // Short hauls price higher per mile - fixed costs spread over fewer miles.
    const shortHaulLift = miles < 400 ? 1.24 : miles < 700 ? 1.08 : 1;
    const centre = base * shortHaulLift;

    // Random walk around the centre with mild mean reversion.
    const history: number[] = [];
    let v = centre;
    for (let d = 0; d < 30; d++) {
      const drift = (centre - v) * 0.18;
      const shock = (rand() - 0.5) * centre * 0.06;
      v = Math.max(0.6, v + drift + shock);
      history.push(Number(v.toFixed(3)));
    }

    const rpm = history[history.length - 1];
    const prevRpm = history[history.length - 2];
    const avgRpm = history.reduce((a, b) => a + b, 0) / history.length;

    return {
      id: `${originCode}-${destCode}`,
      origin, originCode, dest, destCode, miles, equipment, tension,
      history,
      rpm,
      prevRpm,
      avgRpm: Number(avgRpm.toFixed(3)),
      linehaul: round5(rpm * miles),
      loads: 2 + Math.floor(rand() * 14),
      bids: 3 + Math.floor(rand() * 40),
    };
  });
}

/** One market tick. Nudges RPM, rolls history, recomputes the derived fields. */
export function tick(lanes: Lane[]): Lane[] {
  return lanes.map((l) => {
    if (Math.random() > 0.45) return l;                 // most lanes are quiet each tick
    const move = (Math.random() - 0.48) * l.avgRpm * 0.012;
    const rpm = Number(Math.max(0.6, l.rpm + move).toFixed(3));
    const history = [...l.history.slice(1), rpm];
    const avgRpm = Number((history.reduce((a, b) => a + b, 0) / history.length).toFixed(3));
    return {
      ...l,
      prevRpm: l.rpm,
      rpm,
      history,
      avgRpm,
      linehaul: round5(rpm * l.miles),
      bids: l.bids + (Math.random() > 0.82 ? 1 : 0),
    };
  });
}

/** Miles-weighted national average - a long lane should move the index more than a
 *  200-mile drayage run. */
export function nationalIndex(lanes: Lane[]) {
  const miles = lanes.reduce((a, l) => a + l.miles, 0);
  const now = lanes.reduce((a, l) => a + l.rpm * l.miles, 0) / miles;
  const avg = lanes.reduce((a, l) => a + l.avgRpm * l.miles, 0) / miles;
  return { now: Number(now.toFixed(3)), avg: Number(avg.toFixed(3)) };
}

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;
export const rpmFmt = (n: number) => `$${n.toFixed(2)}`;

/** Sparkline path over a fixed 100x28 box. */
export function sparkPath(values: number[], w = 100, h = 28) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - lo) / span) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
