import { describe, it, expect } from 'vitest';
import { parseQuery } from '../parseQuery';

describe('parseQuery', () => {
  it('handles the whole example query', () => {
    const q = parseQuery('cheap trucks for 15X15 carton from LA to SF');
    expect(q.kind).toBe('truck');
    expect(q.originCode).toBe('LAX');
    expect(q.destCode).toBe('SFO');
    expect(q.equipment).toBe('Dry van');    // "carton" implies dry van
    expect(q.sort).toBe('price-asc');
    expect(q.dims).toBe('15x15');
  });

  it('reads direction, never guesses it', () => {
    expect(parseQuery('dallas to atlanta').originCode).toBe('DFW');
    expect(parseQuery('dallas to atlanta').destCode).toBe('ATL');
    expect(parseQuery('atlanta to dallas').originCode).toBe('ATL');
    expect(parseQuery('atlanta to dallas').destCode).toBe('DFW');
  });

  it('matches whole words only, so "sat" inside another word is not San Antonio', () => {
    expect(parseQuery('saturated market').originCode).toBeUndefined();
  });

  it('prefers the longest city alias', () => {
    expect(parseQuery('san antonio to houston').originCode).toBe('SAT');
  });

  it('picks up equipment', () => {
    expect(parseQuery('reefer loads to miami').equipment).toBe('Reefer');
    expect(parseQuery('flatbed from houston').equipment).toBe('Flatbed');
    expect(parseQuery('need a sprinter van').equipment).toBe('Sprinter van');
  });

  it('understands price intent and explicit limits', () => {
    expect(parseQuery('cheapest loads').sort).toBe('price-asc');
    expect(parseQuery('best rated carriers').sort).toBe('rating');
    expect(parseQuery('loads under $2,500').maxRate).toBe(2500);
    expect(parseQuery('over 3000 dallas to newark').minRate).toBe(3000);
  });

  it('reads dimensions and weight, converting kg', () => {
    expect(parseQuery('20 x 8 x 8 container').dims).toBe('20x8x8');
    expect(parseQuery('11000 lbs electronics').weightLbs).toBe(11000);
    expect(parseQuery('1000 kg pallet').weightLbs).toBe(2205);
  });

  it('reports what it understood, so the user is never guessing', () => {
    const q = parseQuery('cheap reefer from atlanta to miami');
    expect(q.understood).toContain('cheapest first');
    expect(q.understood).toContain('reefer');
    expect(q.understood).toContain('ATL → MIA');
  });

  it('flags a residual when it understood nothing', () => {
    expect(parseQuery('zzzz qqqq').residual).toBeTruthy();
    expect(parseQuery('cheap loads').residual).toBeUndefined();
  });
});
