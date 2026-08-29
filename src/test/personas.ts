/**
 * Personas used across the test suite.
 *
 * These are not decoration. Each one exists because it exercises a path the others
 * cannot: a shipper who knows the jargon versus one who does not, a carrier with a
 * safety record versus one with nothing, a fleet versus a single truck. Bugs on this
 * board tend to be about *whose* view is being rendered, so the tests are organised by
 * person rather than by module.
 */

export type Persona = {
  key: string;
  name: string;
  role: 'shipper' | 'carrier';
  accountType: 'individual' | 'company';
  orgName?: string;
  city: string;
  mcNumber?: string;
  usdotNumber?: string;
  website?: string;
  /** Verbatim phrasing this person would type into search. */
  searches: string[];
  /** Why they are in the suite - the path only they cover. */
  covers: string;
};

export const PERSONAS: Persona[] = [
  {
    key: 'dana',
    name: 'Dana Whitfield',
    role: 'shipper',
    accountType: 'company',
    orgName: 'Heartland Foods',
    city: 'Memphis, TN',
    website: 'heartlandfoods.com',
    searches: [
      'reefer from Memphis to Chicago under $1500',
      'cheapest reefer MEM to CHI',
    ],
    covers: 'Experienced shipper who knows equipment names and quotes a budget.',
  },
  {
    key: 'marcus',
    name: 'Marcus Boone',
    role: 'carrier',
    accountType: 'individual',
    city: 'Memphis, TN',
    mcNumber: '1188402',
    usdotNumber: '3902118',
    searches: [
      'loads out of Memphis dry van',
      'backhaul from Chicago to Memphis',
    ],
    covers: 'Owner-operator: one truck, has a DOT number, searches for backhauls.',
  },
  {
    key: 'rosa',
    name: 'Rosa Delgado',
    role: 'carrier',
    accountType: 'company',
    orgName: 'Rio Grande Carriers',
    city: 'Laredo, TX',
    mcNumber: '412885',
    usdotNumber: '1885402',
    website: 'https://riograndecarriers.com',
    searches: ['freight from Laredo to Dallas flatbed'],
    covers: 'Fleet with full credentials and a website - the fully-populated card.',
  },
  {
    key: 'errol',
    name: 'Errol Nakamura',
    role: 'shipper',
    accountType: 'individual',
    city: 'Seattle, WA',
    searches: [
      'cheap trucks for 15X15 carton from LA to SF',
      'how much to move some boxes from Seattle to Salt Lake City',
    ],
    covers: 'First-timer with no freight vocabulary - the natural-language path.',
  },
  {
    key: 'priya',
    name: 'Priya Raman',
    role: 'carrier',
    accountType: 'individual',
    city: 'Fresno, CA',
    usdotNumber: '4120993',
    searches: ['any loads from Fresno'],
    covers: 'Brand new carrier: no deals, no reviews - the zero-reputation card.',
  },
];

export const byKey = (k: string): Persona => {
  const p = PERSONAS.find((x) => x.key === k);
  if (!p) throw new Error(`no persona ${k}`);
  return p;
};
