import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 6 Open Anonymous Reads Migration', () => {
  it('0005_anon_read.sql grants select on listings, bids, and profiles to anon', () => {
    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/0005_anon_read.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    expect(sql).toMatch(/grant select on public\.listings to anon;/i);
    expect(sql).toMatch(/grant select on public\.bids to anon;/i);
    expect(sql).toMatch(/grant select on public\.profiles to anon;/i);
    expect(sql).toMatch(/revoke all on public\.profile_contacts from anon;/i);
  });
});
