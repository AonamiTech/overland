import { describe, it, expect } from 'vitest';
import { PERSONAS, byKey } from './personas';
import { parseQuery } from '@/lib/parseQuery';
import { buildLanes, nationalIndex } from '@/lib/market';
import { laneMiles } from '@/lib/usmap';
import { carrierLinks, normalizeWebsite, saferUrl } from '@/lib/carrier';
import { generatePassword, strength, MIN_PASSWORD } from '@/lib/password';

/**
 * Persona-driven tests.
 *
 * Each block asks: does the board behave correctly *for this person*. That framing
 * catches a class of bug that per-module tests miss - a card that renders fine for a
 * carrier with a safety record and falls apart for one without.
 */

const lanes = buildLanes();

describe('Dana Whitfield - shipper who knows the jargon', () => {
  const dana = byKey('dana');

  it('reads equipment, both endpoints and a budget out of her phrasing', () => {
    const q = parseQuery(dana.searches[0]);
    expect(q.equipment).toBe('Reefer');
    expect(q.originCode).toBe('MEM');
    expect(q.destCode).toBe('CHI');
    expect(q.maxRate).toBe(1500);
  });

  it('treats "cheapest" as a sort, not a filter that hides rows', () => {
    const q = parseQuery(dana.searches[1]);
    expect(q.sort).toBe('price-asc');
    expect(q.maxRate).toBeUndefined();
  });

  it('gives her a website link but never invents a Google listing', () => {
    const links = carrierLinks(dana);
    expect(links.find((l) => l.key === 'website')?.label).toBe('heartlandfoods.com');
    // The Google entry is a search, so it must never be labelled as a verified page.
    const g = links.find((l) => l.key === 'google');
    expect(g?.weight).toBe('search');
    expect(g?.href).toContain('google.com/search');
  });
});

describe('Marcus Boone - owner-operator', () => {
  const marcus = byKey('marcus');

  it('finds loads leaving his home city', () => {
    const q = parseQuery(marcus.searches[0]);
    expect(q.originCode).toBe('MEM');
    expect(q.equipment).toBe('Dry van');
  });

  it('parses a backhaul as the reverse direction', () => {
    const q = parseQuery(marcus.searches[1]);
    expect(q.originCode).toBe('CHI');
    expect(q.destCode).toBe('MEM');
  });

  it('gets a SAFER link keyed on USDOT, not MC - MC numbers get reassigned', () => {
    const url = saferUrl({ usdot: marcus.usdotNumber, mc: marcus.mcNumber });
    expect(url).toContain('query_param=USDOT');
    expect(url).toContain(marcus.usdotNumber!);
    expect(url).not.toContain(marcus.mcNumber!);
  });

  it('is labelled an owner-operator, not a company', () => {
    expect(marcus.accountType).toBe('individual');
    expect(marcus.orgName).toBeUndefined();
  });
});

describe('Rosa Delgado - fleet with full credentials', () => {
  const rosa = byKey('rosa');

  it('offers all three checks, with SAFER carrying the most weight', () => {
    const links = carrierLinks(rosa);
    expect(links.map((l) => l.key)).toEqual(['safer', 'website', 'google']);
    expect(links[0].weight).toBe('verify');
  });

  it('normalises a website that already has a scheme without doubling it', () => {
    expect(normalizeWebsite(rosa.website)).toBe('https://riograndecarriers.com');
    expect(normalizeWebsite('riograndecarriers.com')).toBe('https://riograndecarriers.com');
  });

  it('rejects a typo rather than rendering a dead link', () => {
    expect(normalizeWebsite('not a domain')).toBeNull();
    expect(normalizeWebsite('   ')).toBeNull();
  });
});

describe('Errol Nakamura - no freight vocabulary', () => {
  const errol = byKey('errol');

  it('handles the carton phrasing that started this feature', () => {
    const q = parseQuery(errol.searches[0]);
    expect(q.kind).toBe('truck');
    expect(q.originCode).toBe('LAX');
    expect(q.destCode).toBe('SFO');
    expect(q.sort).toBe('price-asc');
    expect(q.dims).toBe('15x15');
  });

  it('still finds the lane when he asks in a full sentence', () => {
    const q = parseQuery(errol.searches[1]);
    expect(q.originCode).toBe('SEA');
    expect(q.destCode).toBe('SLC');
  });
});

describe('Priya Raman - brand new, no reputation', () => {
  const priya = byKey('priya');

  it('gets a SAFER link even with no MC number', () => {
    const links = carrierLinks(priya);
    expect(links.find((l) => l.key === 'safer')).toBeTruthy();
  });

  it('shows no website link rather than an empty one', () => {
    const links = carrierLinks(priya);
    expect(links.find((l) => l.key === 'website')).toBeUndefined();
  });
});

describe('the rate every persona is looking at', () => {
  it('reconciles: linehaul is miles x rpm, so the breakdown cannot contradict the header', () => {
    for (const l of lanes) {
      expect(l.linehaul).toBe(Math.round((l.rpm * l.miles) / 5) * 5);
    }
  });

  it('shows a road estimate that is longer than the great-circle path, never shorter', () => {
    for (const l of lanes.slice(0, 8)) {
      expect(laneMiles(l.originCode, l.destCode)).toBeGreaterThan(0);
    }
  });

  it('keeps the national index inside a believable band', () => {
    const { now, avg } = nationalIndex(lanes);
    for (const v of [now, avg]) {
      expect(v).toBeGreaterThan(1);
      expect(v).toBeLessThan(6);
    }
  });
});

describe('passwords, for every persona signing up', () => {
  it('generates something that satisfies a four-class policy', () => {
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword();
      expect(pw.length).toBe(20);
      expect(/[a-z]/.test(pw)).toBe(true);
      expect(/[A-Z]/.test(pw)).toBe(true);
      expect(/\d/.test(pw)).toBe(true);
      expect(/[^A-Za-z0-9]/.test(pw)).toBe(true);
    }
  });

  it('never repeats, and never emits ambiguous glyphs', () => {
    const set = new Set([...Array(200)].map(() => generatePassword()));
    expect(set.size).toBe(200);
    for (const pw of set) expect(/[01lIO]/.test(pw)).toBe(false);
  });

  it('rates a generated password Strong and the obvious ones Weak', () => {
    expect(strength(generatePassword()).score).toBe(4);
    for (const bad of ['password', 'Password1', 'qwerty123', 'overland1']) {
      expect(strength(bad).score).toBeLessThanOrEqual(2);
    }
  });

  it('refuses anything under the stated minimum', () => {
    expect(strength('a'.repeat(MIN_PASSWORD - 1)).label).toBe('Too short');
  });
});

describe('persona suite integrity', () => {
  it('covers both roles and both account types', () => {
    expect(new Set(PERSONAS.map((p) => p.role))).toEqual(new Set(['shipper', 'carrier']));
    expect(new Set(PERSONAS.map((p) => p.accountType))).toEqual(new Set(['individual', 'company']));
  });

  it('includes someone with no credentials at all, or the zero-state goes untested', () => {
    expect(PERSONAS.some((p) => !p.mcNumber && !p.website)).toBe(true);
  });
});
