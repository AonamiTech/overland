import { describe, it, expect } from 'vitest';
import { buildLanes, tick, nationalIndex, rpmFmt, money, sparkPath } from '../market';

describe('market', () => {
  const lanes = buildLanes();

  it('is deterministic — two builds must match, or sparklines jump on re-render', () => {
    const a = buildLanes(), b = buildLanes();
    expect(a.map((l) => l.rpm)).toEqual(b.map((l) => l.rpm));
  });

  it('derives linehaul from miles x rpm, so the numbers reconcile', () => {
    for (const l of lanes) {
      const implied = l.linehaul / l.miles;
      expect(Math.abs(implied - l.rpm)).toBeLessThan(0.05);
    }
  });

  it('keeps rates in a plausible US spot range', () => {
    for (const l of lanes) {
      expect(l.rpm).toBeGreaterThan(1.2);
      expect(l.rpm).toBeLessThan(6);
    }
  });

  it('prices short hauls higher per mile', () => {
    const short = lanes.filter((l) => l.miles < 400);
    const long = lanes.filter((l) => l.miles > 1000);
    const avg = (xs: typeof lanes) => xs.reduce((a, l) => a + l.rpm, 0) / xs.length;
    expect(avg(short)).toBeGreaterThan(avg(long));
  });

  it('keeps 30 sessions of history per lane', () => {
    for (const l of lanes) expect(l.history).toHaveLength(30);
  });

  it('tick preserves lane count and history length', () => {
    const next = tick(lanes);
    expect(next).toHaveLength(lanes.length);
    for (const l of next) expect(l.history).toHaveLength(30);
  });

  it('weights the index by miles, not lane count', () => {
    const idx = nationalIndex(lanes);
    const naive = lanes.reduce((a, l) => a + l.rpm, 0) / lanes.length;
    expect(idx.now).toBeGreaterThan(0);
    expect(idx.now).not.toBe(naive);
  });

  it('formats money and rates', () => {
    expect(rpmFmt(2.4)).toBe('$2.40');
    expect(money(2450)).toBe('$2,450');
  });

  it('draws a sparkline path inside its box', () => {
    const d = sparkPath([1, 2, 3, 2, 1]);
    expect(d.startsWith('M')).toBe(true);
    const ys = [...d.matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((m) => Number(m[2]));
    for (const y of ys) { expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(28); }
  });
});
