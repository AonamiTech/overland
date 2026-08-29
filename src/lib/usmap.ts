/**
 * Minimal US lane map.
 *
 * A projected SVG rather than map tiles: no API key, nothing to load, and it sits
 * inside the editorial design instead of dropping a Google/OSM rectangle into it.
 *
 * Projection is equirectangular with a cosine correction at the mid-latitude of the
 * continental US, which is accurate enough at this scale and keeps the country's
 * proportions honest. Distances are haversine great-circle, then multiplied by a
 * road-circuity factor - straight-line miles would understate every quoted lane.
 */

export const LAT0 = 39.5;                       // mid-latitude of CONUS
const K = Math.cos((LAT0 * Math.PI) / 180);

/** Road miles run longer than great-circle. 1.17 is the usual planning factor. */
const CIRCUITY = 1.17;

export const VIEW = { w: 960, h: 600 };

const LON_MIN = -125.5, LON_MAX = -66.5;
const LAT_MIN = 24.0,  LAT_MAX = 49.5;

export function project(lon: number, lat: number): [number, number] {
  const x = ((lon - LON_MIN) * K) / ((LON_MAX - LON_MIN) * K);
  const y = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);
  return [x * VIEW.w, y * VIEW.h];
}

/** Simplified continental outline, lon/lat, clockwise from the Pacific Northwest. */
const OUTLINE: Array<[number, number]> = [
  [-124.7, 48.4], [-124.2, 46.3], [-124.0, 43.8], [-124.2, 42.0], [-122.4, 39.2],
  [-121.9, 36.9], [-120.6, 34.6], [-118.4, 33.7], [-117.1, 32.5],
  [-114.7, 32.7], [-111.1, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.9, 30.6],
  [-103.0, 29.0], [-101.4, 29.8], [-99.5, 27.6], [-97.2, 26.0],
  [-97.4, 27.9], [-95.0, 29.2], [-93.8, 29.7], [-91.0, 29.2], [-89.4, 29.0],
  [-88.9, 30.2], [-87.5, 30.3], [-85.0, 29.7], [-84.0, 30.1], [-82.9, 29.1],
  [-82.6, 27.4], [-81.1, 25.2], [-80.1, 25.8], [-80.5, 28.5], [-81.4, 30.7],
  [-80.9, 32.0], [-79.2, 33.2], [-77.9, 34.2], [-75.9, 36.9], [-76.3, 38.0],
  [-75.0, 38.8], [-74.2, 39.6], [-74.0, 40.7], [-72.0, 41.1], [-70.9, 41.6],
  [-70.0, 41.8], [-70.8, 43.1], [-68.5, 44.3], [-67.0, 44.8],
  [-69.2, 47.5], [-71.5, 45.0], [-74.7, 45.0], [-76.5, 44.0], [-79.0, 43.3],
  [-79.1, 42.8], [-81.3, 42.2], [-82.5, 41.7], [-82.7, 43.6], [-83.1, 46.0],
  [-84.6, 46.5], [-86.5, 46.6], [-88.4, 48.3], [-89.5, 48.0], [-92.3, 46.7],
  [-95.2, 49.0], [-104.0, 49.0], [-111.0, 49.0], [-117.0, 49.0], [-122.8, 49.0],
];

export const OUTLINE_PATH =
  OUTLINE.map(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';

/** Cities used across the board. Code -> [lon, lat]. */
export const CITIES: Record<string, { name: string; lon: number; lat: number }> = {
  LAX: { name: 'Los Angeles',    lon: -118.24, lat: 34.05 },
  PHX: { name: 'Phoenix',        lon: -112.07, lat: 33.45 },
  DFW: { name: 'Dallas',         lon: -96.80,  lat: 32.78 },
  ATL: { name: 'Atlanta',        lon: -84.39,  lat: 33.75 },
  MIA: { name: 'Miami',          lon: -80.19,  lat: 25.76 },
  CHI: { name: 'Chicago',        lon: -87.63,  lat: 41.88 },
  DEN: { name: 'Denver',         lon: -104.99, lat: 39.74 },
  EWR: { name: 'Newark',         lon: -74.17,  lat: 40.74 },
  CLT: { name: 'Charlotte',      lon: -80.84,  lat: 35.23 },
  SEA: { name: 'Seattle',        lon: -122.33, lat: 47.61 },
  SLC: { name: 'Salt Lake City', lon: -111.89, lat: 40.76 },
  HOU: { name: 'Houston',        lon: -95.37,  lat: 29.76 },
  MSY: { name: 'New Orleans',    lon: -90.07,  lat: 29.95 },
  MEM: { name: 'Memphis',        lon: -90.05,  lat: 35.15 },
  SAV: { name: 'Savannah',       lon: -81.09,  lat: 32.08 },
  LRD: { name: 'Laredo',         lon: -99.51,  lat: 27.51 },
  SAT: { name: 'San Antonio',    lon: -98.49,  lat: 29.42 },
  FAT: { name: 'Fresno',         lon: -119.79, lat: 36.75 },
  DTW: { name: 'Detroit',        lon: -83.05,  lat: 42.33 },
  MCI: { name: 'Kansas City',    lon: -94.58,  lat: 39.10 },
};

/** Great-circle miles, then road circuity. */
export function laneMiles(a: string, b: string): number {
  const A = CITIES[a], B = CITIES[b];
  if (!A || !B) return 0;
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(B.lat - A.lat);
  const dLon = toRad(B.lon - A.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(A.lat)) * Math.cos(toRad(B.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * CIRCUITY);
}

/** Arc between two cities, bowed toward the pole so overlapping lanes stay readable. */
export function lanePath(a: string, b: string): string {
  const A = CITIES[a], B = CITIES[b];
  if (!A || !B) return '';
  const [x1, y1] = project(A.lon, A.lat);
  const [x2, y2] = project(B.lon, B.lat);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${(my - dist * 0.18).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

export function cityPoint(code: string): [number, number] | null {
  const c = CITIES[code];
  return c ? project(c.lon, c.lat) : null;
}
