import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 8 Notifications Edge Function & Setup', () => {
  it('send-deal-email edge function exists and contains SMTP guard logic', () => {
    const fnPath = path.resolve(process.cwd(), 'supabase/functions/send-deal-email/index.ts');
    const code = fs.readFileSync(fnPath, 'utf8');

    expect(code).toMatch(/RESEND_API_KEY/i);
    expect(code).toMatch(/SMTP_HOST/i);
    expect(code).toMatch(/SMTP\/Resend credentials not set/i);
    expect(code).toMatch(/status: 'skipped'/i);
  });

  it('supabase/SETUP.md documents email notification configuration', () => {
    const setupPath = path.resolve(process.cwd(), 'supabase/SETUP.md');
    const doc = fs.readFileSync(setupPath, 'utf8');

    expect(doc).toMatch(/Email Notifications \(Edge Function\)/i);
    expect(doc).toMatch(/send-deal-email/i);
    expect(doc).toMatch(/RESEND_API_KEY/i);
  });
});
