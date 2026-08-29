/**
 * Natural-language freight search.
 *
 * "cheap trucks for 15x15 carton from LA to SF" -> structured filters.
 *
 * Deterministic first, model second. Most freight queries are highly patterned - two
 * place names, an equipment word, a price hint - and a parser handles those instantly,
 * offline, for free, and identically every time. The model is a fallback for the messy
 * tail, not the default path. Sending every keystroke to an LLM would be slower, cost
 * money per search, and give non-reproducible results for queries a regex nails.
 */

export type ParsedQuery = {
  kind?: 'load' | 'truck';
  originCode?: string;
  destCode?: string;
  equipment?: string;
  maxRate?: number;
  minRate?: number;
  /** 'cheap' -> price ascending, 'best'/'top rated' -> rating */
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  dims?: string;
  weightLbs?: number;
  /** What the parser understood, shown back to the user so it is never a black box. */
  understood: string[];
  /** True when the text had content the parser could not place. */
  residual?: string;
};

/* Aliases people actually type. Airport-style codes are the canonical form because the
   board already keys lanes on them. */
const CITY_ALIASES: Record<string, string> = {
  la: 'LAX', 'l.a.': 'LAX', losangeles: 'LAX', 'los angeles': 'LAX', socal: 'LAX', lax: 'LAX',
  sf: 'SFO', 'san francisco': 'SFO', sanfran: 'SFO', frisco: 'SFO', bayarea: 'SFO', sfo: 'SFO',
  nyc: 'EWR', 'new york': 'EWR', newark: 'EWR', ewr: 'EWR', nj: 'EWR',
  dallas: 'DFW', dfw: 'DFW', 'dallas fort worth': 'DFW',
  houston: 'HOU', hou: 'HOU',
  chicago: 'CHI', chi: 'CHI', chitown: 'CHI',
  atlanta: 'ATL', atl: 'ATL',
  miami: 'MIA', mia: 'MIA',
  phoenix: 'PHX', phx: 'PHX',
  denver: 'DEN', den: 'DEN',
  seattle: 'SEA', sea: 'SEA',
  memphis: 'MEM', mem: 'MEM',
  charlotte: 'CLT', clt: 'CLT',
  savannah: 'SAV', sav: 'SAV',
  laredo: 'LRD', lrd: 'LRD',
  'san antonio': 'SAT', sat: 'SAT',
  fresno: 'FAT', fat: 'FAT',
  detroit: 'DTW', dtw: 'DTW',
  'kansas city': 'MCI', kc: 'MCI', mci: 'MCI',
  'salt lake city': 'SLC', slc: 'SLC', saltlake: 'SLC',
  'new orleans': 'MSY', nola: 'MSY', msy: 'MSY',
};

const EQUIPMENT_WORDS: Array<[RegExp, string]> = [
  [/\b(reefer|refrigerated|temp[- ]?control|frozen|chilled)\b/i, 'Reefer'],
  [/\b(flat ?bed|flat)\b/i, 'Flatbed'],
  [/\b(step ?deck|stepdeck)\b/i, 'Step deck'],
  [/\b(power ?only)\b/i, 'Power only'],
  [/\b(hot ?shot)\b/i, 'Hotshot'],
  [/\b(box ?truck)\b/i, 'Box truck'],
  [/\b(sprinter|cargo van)\b/i, 'Sprinter van'],
  [/\b(tanker|tank)\b/i, 'Tanker'],
  [/\b(conestoga)\b/i, 'Conestoga'],
  [/\b(lowboy|rgn)\b/i, 'Lowboy / RGN'],
  [/\b(car ?hauler|auto ?transport)\b/i, 'Car hauler'],
  [/\b(dry ?van|van|carton|box(es)?|pallet|crate)\b/i, 'Dry van'],
];

// Commas must survive normalisation, or "$2,500" becomes "2 500" and the money regex
// matches just "2". Caught by the price test.
const norm = (s: string) => s.toLowerCase().replace(/[^\w\s.$,-]/g, ' ').replace(/\s+/g, ' ').trim();

function findCity(text: string): { code: string; at: number; len: number } | null {
  // longest alias first, so "san antonio" beats "san"
  const keys = Object.keys(CITY_ALIASES).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    const i = text.indexOf(k);
    if (i === -1) continue;
    const before = i === 0 ? ' ' : text[i - 1];
    const after = text[i + k.length] ?? ' ';
    if (/[\w]/.test(before) || /[\w]/.test(after)) continue;   // whole word only
    return { code: CITY_ALIASES[k], at: i, len: k.length };
  }
  return null;
}

export function parseQuery(raw: string): ParsedQuery {
  const text = norm(raw);
  const understood: string[] = [];
  const out: ParsedQuery = { understood };
  if (!text) return out;

  // what side of the market
  if (/\b(truck|trucks|carrier|capacity|driver)\b/.test(text)) { out.kind = 'truck'; understood.push('trucks'); }
  else if (/\b(load|loads|freight|shipment|cargo)\b/.test(text)) { out.kind = 'load'; understood.push('freight'); }

  // from X to Y - handle explicitly so direction is never guessed
  /* The destination runs to the end of the string, not to the next space. Stopping at
     the first space truncated every multi-word city - "salt lake city" became "salt"
     and resolved to nothing. findCity already matches the longest known alias inside
     whatever it is handed, so trailing qualifiers like "under $1500" are harmless. */
  const fromTo = /\bfrom\s+(.+?)\s+to\s+(.+)$/.exec(text);
  if (fromTo) {
    const a = findCity(fromTo[1]); const b = findCity(fromTo[2]);
    if (a) { out.originCode = a.code; }
    if (b) { out.destCode = b.code; }
    if (a && b) understood.push(`${a.code} → ${b.code}`);
  } else {
    // "LA to SF" without the leading "from"
    const toSplit = text.split(/\s+to\s+/);
    if (toSplit.length === 2) {
      const a = findCity(toSplit[0]); const b = findCity(toSplit[1]);
      if (a) out.originCode = a.code;
      if (b) out.destCode = b.code;
      if (a && b) understood.push(`${a.code} → ${b.code}`);
    } else {
      const only = findCity(text);
      if (only) { out.originCode = only.code; understood.push(`near ${only.code}`); }
    }
  }

  // equipment
  for (const [re, label] of EQUIPMENT_WORDS) {
    if (re.test(text)) { out.equipment = label; understood.push(label.toLowerCase()); break; }
  }

  // price intent
  if (/\b(cheap|cheapest|low(est)?|budget|affordable)\b/.test(text)) {
    out.sort = 'price-asc'; understood.push('cheapest first');
  } else if (/\b(best|top|highest|premium|good)\b/.test(text)) {
    out.sort = 'rating'; understood.push('best rated first');
  } else if (/\b(new|newest|latest|recent)\b/.test(text)) {
    out.sort = 'newest'; understood.push('newest first');
  }

  // explicit money
  const under = /\b(?:under|below|less than|max|up to)\s*\$?\s*([\d,]+)/.exec(text);
  if (under) { out.maxRate = Number(under[1].replace(/,/g, '')); understood.push(`under $${out.maxRate.toLocaleString()}`); }
  const over = /\b(?:over|above|more than|min|at least)\s*\$?\s*([\d,]+)/.exec(text);
  if (over) { out.minRate = Number(over[1].replace(/,/g, '')); understood.push(`over $${out.minRate.toLocaleString()}`); }

  // dimensions like 15x15 or 15 x 15 x 8
  const dims = /\b(\d+(?:\.\d+)?)\s*(?:x|by)\s*(\d+(?:\.\d+)?)(?:\s*(?:x|by)\s*(\d+(?:\.\d+)?))?\b/.exec(text);
  if (dims) {
    out.dims = dims[3] ? `${dims[1]}x${dims[2]}x${dims[3]}` : `${dims[1]}x${dims[2]}`;
    understood.push(`${out.dims} ft`);
  }

  // weight
  const wt = /\b([\d,]+)\s*(lbs?|pounds?|k?g)\b/.exec(text);
  if (wt) {
    const n = Number(wt[1].replace(/,/g, ''));
    out.weightLbs = /k?g/.test(wt[2]) ? Math.round(n * 2.205) : n;
    understood.push(`${out.weightLbs.toLocaleString()} lbs`);
  }

  if (understood.length === 0) out.residual = raw.trim();
  return out;
}
