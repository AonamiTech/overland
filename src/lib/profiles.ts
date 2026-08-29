/**
 * Profiles, deal history and ratings.
 *
 * The reputation layer is what makes an open board workable: we verify nothing, so
 * the only signal a counterparty has is what other people on the board say about
 * someone. Ratings are therefore attached to a *deal*, never freestanding - you can
 * only rate someone you actually connected with, which is what stops a review section
 * turning into a comment box.
 *
 * Persisted to localStorage. Every read/write goes through this module so swapping in
 * Supabase later is one file, not a hunt through components.
 */

export type Role = 'shipper' | 'carrier';
export type AccountType = 'individual' | 'company';

export type DealStatus = 'awaiting' | 'confirmed' | 'fell-through';

export type Deal = {
  id: string;
  laneId: string;
  lane: string;              // "Dallas → Los Angeles"
  counterpartyId: string;
  counterpartyName: string;
  amount: number;
  at: number;
  status: DealStatus;
  /** Set once this user has left a rating for the deal. One rating per deal, per side. */
  ratedByMe: boolean;
};

export type Rating = {
  id: string;
  dealId: string;
  fromName: string;
  stars: 1 | 2 | 3 | 4 | 5;
  note?: string;
  at: number;
};

export type Profile = {
  id: string;
  name: string;
  role: Role;
  accountType: AccountType;
  orgName?: string;
  city: string;
  phone?: string;
  email?: string;
  /** Self-declared. We never fetch or verify it - see lib/carrier.ts. */
  website?: string;
  mcNumber?: string;
  usdotNumber?: string;
  joinedAt: number;
  deals: Deal[];
  ratings: Rating[];
};

const KEY = 'overland.profiles.v1';
const DAY = 864e5;

/* ---------------------------------------------------------------- seed */

/** Demo counterparties, so a bid has a profile worth opening on day one. */
const SEED: Profile[] = [
  {
    id: 'rio-grande', name: 'Rio Grande Carriers', role: 'carrier', accountType: 'company',
    orgName: 'Rio Grande Carriers', city: 'Laredo, TX', mcNumber: '412885', usdotNumber: '1885402',
    email: 'dispatch@riograndecarriers.com', website: 'riograndecarriers.com', phone: '9565550118',
    joinedAt: Date.now() - 420 * DAY, deals: [], ratings: [],
  },
  {
    id: 'keystone', name: 'Keystone Logistics', role: 'carrier', accountType: 'company',
    orgName: 'Keystone Logistics', city: 'Harrisburg, PA', mcNumber: '778110', usdotNumber: '2331097',
    email: 'ops@keystonelog.com', website: 'keystonelog.com', phone: '7175550143',
    joinedAt: Date.now() - 260 * DAY, deals: [], ratings: [],
  },
  {
    id: 'summit', name: 'Summit Freight', role: 'carrier', accountType: 'company',
    orgName: 'Summit Freight', city: 'Denver, CO', mcNumber: '904221',
    email: 'book@summitfreight.co', website: 'summitfreight.co', phone: '3035550177',
    joinedAt: Date.now() - 95 * DAY, deals: [], ratings: [],
  },
  {
    id: 'dave-thompson', name: 'Dave Thompson', role: 'carrier', accountType: 'individual',
    city: 'Memphis, TN', mcNumber: '1188402', usdotNumber: '3902118',
    email: 'dave@thompsontrucking.com', website: 'thompsontrucking.com', phone: '9015550164',
    joinedAt: Date.now() - 180 * DAY, deals: [], ratings: [],
  },
];

/* Deterministic seed history so profiles do not look empty, and so the numbers on a
   card match the numbers on the profile behind it. */
const SEED_ACTIVITY: Record<string, Array<[string, number, DealStatus, number, string]>> = {
  // id: [lane, amount, status, stars, note]
  'rio-grande': [
    ['Dallas → Los Angeles', 2450, 'confirmed', 5, 'Picked up early, sent the POD same day.'],
    ['Laredo → San Antonio', 640, 'confirmed', 5, 'Straightforward, no chasing.'],
    ['Houston → New Orleans', 980, 'confirmed', 4, 'Late by two hours, called ahead though.'],
    ['Dallas → Newark', 3180, 'confirmed', 5, ''],
  ],
  keystone: [
    ['Newark → Charlotte', 1720, 'confirmed', 4, 'Good comms.'],
    ['Chicago → Atlanta', 1890, 'confirmed', 5, 'Would use again.'],
    ['Dallas → Newark', 3260, 'fell-through', 2, 'Backed out the morning of pickup.'],
  ],
  summit: [
    ['Denver → Phoenix', 1640, 'confirmed', 4, ''],
    ['Chicago → Denver', 2010, 'confirmed', 3, 'Rate crept up after acceptance.'],
  ],
  'dave-thompson': [
    ['Memphis → Chicago', 1380, 'confirmed', 5, 'Owner-operator, answered every call.'],
    ['Atlanta → Miami', 1290, 'confirmed', 5, 'Reefer held temp, no issues.'],
    ['Savannah → Atlanta', 560, 'confirmed', 5, ''],
  ],
};

const RATERS = ['Reed Logistics', 'Heartland Foods', 'Cascade Foods', 'Ridgeline Supply', 'Delta Mills'];

function seeded(): Profile[] {
  return SEED.map((p) => {
    const acts = SEED_ACTIVITY[p.id] ?? [];
    const deals: Deal[] = [];
    const ratings: Rating[] = [];
    acts.forEach(([lane, amount, status, stars, note], i) => {
      const id = `${p.id}-d${i}`;
      const at = Date.now() - (i + 1) * 12 * DAY;
      deals.push({
        id, laneId: lane, lane, counterpartyId: 'seed', counterpartyName: RATERS[i % RATERS.length],
        amount, at, status, ratedByMe: true,
      });
      ratings.push({
        id: `${id}-r`, dealId: id, fromName: RATERS[i % RATERS.length],
        stars: stars as Rating['stars'], note: note || undefined, at,
      });
    });
    return { ...p, deals, ratings };
  });
}

/* ---------------------------------------------------------------- store */

function readAll(): Profile[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Profile[];
  } catch { /* fall through to seed */ }
  const s = seeded();
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

function writeAll(ps: Profile[]) {
  localStorage.setItem(KEY, JSON.stringify(ps));
}

export function allProfiles(): Profile[] { return readAll(); }

export function getProfile(id: string): Profile | null {
  return readAll().find((p) => p.id === id) ?? null;
}

/** Creates the signed-in user's own profile the first time they land on it. */
export function ensureProfile(seed: Omit<Profile, 'deals' | 'ratings' | 'joinedAt'>): Profile {
  const all = readAll();
  const found = all.find((p) => p.id === seed.id);
  if (found) return found;
  const created: Profile = { ...seed, joinedAt: Date.now(), deals: [], ratings: [] };
  writeAll([...all, created]);
  return created;
}

export function addDeal(profileId: string, deal: Omit<Deal, 'id' | 'at' | 'status' | 'ratedByMe'>): Deal {
  const all = readAll();
  const p = all.find((x) => x.id === profileId);
  const full: Deal = { ...deal, id: `d${Date.now()}`, at: Date.now(), status: 'awaiting', ratedByMe: false };
  if (p) { p.deals = [full, ...p.deals]; writeAll(all); }
  return full;
}

export function setDealStatus(profileId: string, dealId: string, status: DealStatus) {
  const all = readAll();
  const d = all.find((p) => p.id === profileId)?.deals.find((x) => x.id === dealId);
  if (d) { d.status = status; writeAll(all); }
}

/** Rating lands on the counterparty's profile and closes out the deal on ours. */
export function rateDeal(
  raterProfileId: string, raterName: string,
  counterpartyId: string, dealId: string,
  stars: Rating['stars'], note?: string,
) {
  const all = readAll();
  const target = all.find((p) => p.id === counterpartyId);
  if (target) {
    target.ratings = [
      { id: `r${Date.now()}`, dealId, fromName: raterName, stars, note: note?.trim() || undefined, at: Date.now() },
      ...target.ratings,
    ];
  }
  const mine = all.find((p) => p.id === raterProfileId)?.deals.find((d) => d.id === dealId);
  if (mine) mine.ratedByMe = true;
  writeAll(all);
}

/* ------------------------------------------------------------- derived */

export function stats(p: Profile) {
  const done = p.deals.filter((d) => d.status === 'confirmed').length;
  const fell = p.deals.filter((d) => d.status === 'fell-through').length;
  const total = p.ratings.length;
  const avg = total ? p.ratings.reduce((a, r) => a + r.stars, 0) / total : 0;
  return {
    avg: Number(avg.toFixed(1)),
    count: total,
    confirmed: done,
    fellThrough: fell,
    // A rate needs a denominator to mean anything; hide it below three deals.
    completion: done + fell >= 3 ? Math.round((done / (done + fell)) * 100) : null,
    monthsOn: Math.max(1, Math.round((Date.now() - p.joinedAt) / (30 * DAY))),
  };
}

export const ago = (t: number) => {
  const d = Math.round((Date.now() - t) / DAY);
  if (d < 1) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return `${d}d ago`;
  const m = Math.round(d / 30);
  return m < 12 ? `${m}mo ago` : `${Math.round(m / 12)}y ago`;
};
