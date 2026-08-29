import { describe, it, expect } from 'vitest';
import { CITIES, laneMiles, project, VIEW, lanePath } from '../usmap';

describe('usmap', () => {
  it('projects every city inside the viewbox', () => {
    for (const [code, c] of Object.entries(CITIES)) {
      const [x, y] = project(c.lon, c.lat);
      expect(x, code).toBeGreaterThanOrEqual(0);
      expect(x, code).toBeLessThanOrEqual(VIEW.w);
      expect(y, code).toBeGreaterThanOrEqual(0);
      expect(y, code).toBeLessThanOrEqual(VIEW.h);
    }
  });

  it('gets real US distances roughly right', () => {
    // LA -> Dallas is ~1,435 road miles
    expect(laneMiles('LAX', 'DFW')).toBeGreaterThan(1250);
    expect(laneMiles('LAX', 'DFW')).toBeLessThan(1650);
    // Laredo -> San Antonio is ~157
    expect(laneMiles('LRD', 'SAT')).toBeGreaterThan(120);
    expect(laneMiles('LRD', 'SAT')).toBeLessThan(220);
  });

  it('is symmetric', () => {
    expect(laneMiles('CHI', 'ATL')).toBe(laneMiles('ATL', 'CHI'));
  });

  it('returns 0 for unknown cities rather than NaN', () => {
    expect(laneMiles('ZZZ', 'DFW')).toBe(0);
  });

  it('draws an arc between two known cities', () => {
    expect(lanePath('DFW', 'LAX')).toMatch(/^M[\d.]+,[\d.]+ Q/);
    expect(lanePath('ZZZ', 'LAX')).toBe('');
  });
});
