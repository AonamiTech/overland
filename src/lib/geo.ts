/**
 * US states and dial codes for the signup form.
 *
 * Dial codes are limited to the countries that actually move truckload freight into
 * and out of the US - cross-border Mexico (Laredo, El Paso) and Canada are a real part
 * of this market, so +52 and +1 both matter. A full ITU list would be noise.
 */

export const US_STATES: Array<[string, string]> = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
  ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
  ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
  ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
  ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
  ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
  ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],
  ['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],
  ['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],
  ['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
];

/** Freight-heavy cities, offered as suggestions per state. Not exhaustive - the field
 *  stays free text so nobody in a small town is locked out. */
export const CITIES_BY_STATE: Record<string, string[]> = {
  TX: ['Dallas','Fort Worth','Houston','San Antonio','Laredo','El Paso','Austin','Lubbock'],
  CA: ['Los Angeles','Long Beach','Fresno','Oakland','San Bernardino','Stockton','Sacramento'],
  IL: ['Chicago','Joliet','Rockford','Peoria'],
  GA: ['Atlanta','Savannah','Macon','Columbus'],
  FL: ['Miami','Jacksonville','Orlando','Tampa','Lakeland'],
  PA: ['Philadelphia','Pittsburgh','Harrisburg','Allentown'],
  OH: ['Columbus','Cleveland','Cincinnati','Toledo'],
  TN: ['Memphis','Nashville','Knoxville','Chattanooga'],
  NJ: ['Newark','Jersey City','Edison','Trenton'],
  IN: ['Indianapolis','Fort Wayne','Gary'],
  AZ: ['Phoenix','Tucson','Nogales'],
  NC: ['Charlotte','Greensboro','Raleigh'],
  WA: ['Seattle','Tacoma','Spokane'],
  CO: ['Denver','Colorado Springs','Pueblo'],
  MO: ['Kansas City','St. Louis','Springfield'],
  UT: ['Salt Lake City','Ogden'],
  MI: ['Detroit','Grand Rapids','Lansing'],
  LA: ['New Orleans','Baton Rouge','Shreveport'],
  NY: ['New York','Buffalo','Syracuse','Albany'],
  SC: ['Charleston','Greenville','Columbia'],
};

export const DIAL_CODES: Array<[string, string, string]> = [
  ['+1',  'US', 'United States'],
  ['+1',  'CA', 'Canada'],
  ['+52', 'MX', 'Mexico'],
];

/** Digits only, for storage. Display formatting happens at render time. */
export const digitsOnly = (v: string) => v.replace(/\D/g, '');

/** North American numbers are 10 digits; Mexican are 10 too. Keep one rule. */
export function isValidPhone(dial: string, raw: string): boolean {
  const d = digitsOnly(raw);
  if (dial === '+1') return d.length === 10;
  if (dial === '+52') return d.length === 10;
  return d.length >= 7 && d.length <= 15;
}

export function formatPhone(dial: string, raw: string): string {
  const d = digitsOnly(raw);
  if (dial === '+1' && d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  return d;
}

export const isValidZip = (v: string) => /^\d{5}$/.test(v.trim());
