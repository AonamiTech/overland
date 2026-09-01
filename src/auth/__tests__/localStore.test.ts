import { beforeEach, describe, expect, it } from 'vitest';
import {
  ACCOUNTS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  clearLocalSession,
  createLocalUser,
  readLocalAccount,
  readLocalSession,
  saveLocalAccount,
  writeLocalSession,
} from '../localStore';

describe('local auth storage', () => {
  beforeEach(() => localStorage.clear());

  it('keeps profile metadata in an account registry and clears only the active session', () => {
    const user = createLocalUser('  DRIVER@EXAMPLE.COM ', 'carrier', {
      name: 'Driver Example',
      phone: '+12145550148',
      city: 'Dallas, TX',
      usdotNumber: '1234567',
    });

    saveLocalAccount(user);
    writeLocalSession(user);
    expect(readLocalSession()).toEqual(user);
    expect(readLocalAccount('driver@example.com')).toEqual(user);

    clearLocalSession();
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(readLocalAccount('driver@example.com')).toEqual(user);
    expect(JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) ?? '{}')).toHaveProperty('driver@example.com');
  });

  it('normalizes account keys and does not store a password', () => {
    const user = createLocalUser('OWNER@example.com', 'shipper', { name: 'Owner' });
    saveLocalAccount(user);

    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY) ?? '';
    expect(stored).toContain('owner@example.com');
    expect(stored).not.toMatch(/password/i);
  });
});
