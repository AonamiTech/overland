import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 2 & 6 Anonymous Reads & Profile Gate', () => {
  it('0005_anon_read.sql grants select on listings and bids to anon', () => {
    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/0005_anon_read.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    expect(sql).toMatch(/grant select on public\.listings to anon;/i);
    expect(sql).toMatch(/grant select on public\.bids to anon;/i);
    expect(sql).toMatch(/revoke all on public\.profile_contacts from anon;/i);
  });

  it('0006_public_profiles_view.sql revokes direct profiles access from anon and creates non-identifying view', () => {
    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/0006_public_profiles_view.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    expect(sql).toMatch(/revoke select on public\.profiles from anon;/i);
    expect(sql).toMatch(/create or replace view public\.public_profiles/i);
    expect(sql).toMatch(/grant select on public\.public_profiles to anon;/i);
    expect(sql).not.toMatch(/mc_number/i);
    expect(sql).not.toMatch(/usdot_number/i);
  });
});
