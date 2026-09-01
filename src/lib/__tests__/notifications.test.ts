import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 3 Notifications Triggers & Migration 0008', () => {
  it('0008_notification_triggers.sql defines trigger functions that never abort inserts', () => {
    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/0008_notification_triggers.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    expect(sql).toMatch(/create or replace function public\.notify_on_bid_insert/i);
    expect(sql).toMatch(/create or replace function public\.notify_on_deal_insert/i);
    expect(sql).toMatch(/exception when others then/i);
    expect(sql).toMatch(/trigger_notify_bid_insert/i);
    expect(sql).toMatch(/trigger_notify_deal_insert/i);
  });
});
