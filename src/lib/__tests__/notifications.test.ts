import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 6 Notifications Edge Function & Migration 0007', () => {
  it('0007_notifications.sql creates notifications table and notify_email profile column', () => {
    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/0007_notifications.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    expect(sql).toMatch(/notify_email boolean not null default true/i);
    expect(sql).toMatch(/create table if not exists public\.notifications/i);
    expect(sql).toMatch(/users can view own notifications/i);
  });

  it('send-deal-email edge function contains bid_placed and deal_accepted event handling', () => {
    const fnPath = path.resolve(process.cwd(), 'supabase/functions/send-deal-email/index.ts');
    const code = fs.readFileSync(fnPath, 'utf8');

    expect(code).toMatch(/bid_placed/i);
    expect(code).toMatch(/deal_accepted/i);
    expect(code).toMatch(/notify_email/i);
    expect(code).toMatch(/Hourly listing cap reached/i);
    expect(code).toMatch(/RESEND_API_KEY/i);
    expect(code).toMatch(/status: 'skipped'/i);
  });
});
