import { describe, it, expect } from 'vitest';
import { US_STATES, CITIES_BY_STATE, DIAL_CODES, digitsOnly, isValidPhone, formatPhone, isValidZip } from '../geo';

describe('geo', () => {
  it('covers all 50 states plus DC', () => {
    expect(US_STATES).toHaveLength(51);
    expect(US_STATES.map(([a]) => a)).toContain('TX');
    expect(US_STATES.map(([a]) => a)).toContain('DC');
  });

  it('has no duplicate state codes', () => {
    const codes = US_STATES.map(([a]) => a);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('only suggests cities for states that exist', () => {
    const valid = new Set(US_STATES.map(([a]) => a));
    for (const st of Object.keys(CITIES_BY_STATE)) expect(valid.has(st)).toBe(true);
  });

  it('offers the cross-border dial codes freight actually uses', () => {
    const codes = DIAL_CODES.map(([c]) => c);
    expect(codes).toContain('+1');
    expect(codes).toContain('+52');   // Laredo / El Paso crossings
  });

  describe('phone', () => {
    it('strips everything that is not a digit', () => {
      expect(digitsOnly('(214) 555-0148')).toBe('2145550148');
      expect(digitsOnly('+1 214.555.0148')).toBe('12145550148');
    });

    it('accepts a full 10-digit US number', () => {
      expect(isValidPhone('+1', '(214) 555-0148')).toBe(true);
      expect(isValidPhone('+1', '2145550148')).toBe(true);
    });

    it('rejects a short number — the bug from the screenshot', () => {
      expect(isValidPhone('+1', '214315269')).toBe(false);   // 9 digits
      expect(isValidPhone('+1', '214')).toBe(false);
    });

    it('rejects an over-long US number', () => {
      expect(isValidPhone('+1', '21455501489')).toBe(false);
    });

    it('formats only when complete', () => {
      expect(formatPhone('+1', '2145550148')).toBe('(214) 555-0148');
      expect(formatPhone('+1', '21455')).toBe('21455');
    });
  });

  describe('zip', () => {
    it('accepts 5 digits', () => expect(isValidZip('75201')).toBe(true));
    it('rejects ZIP+4 and short codes', () => {
      expect(isValidZip('75201-1234')).toBe(false);
      expect(isValidZip('7520')).toBe(false);
      expect(isValidZip('abcde')).toBe(false);
    });
  });
});
