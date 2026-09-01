import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 9 Transactional Email Setup', () => {
  it('supabase/SETUP.md includes Custom SMTP & Domain Auth documentation', () => {
    const setupPath = path.resolve(process.cwd(), 'supabase/SETUP.md');
    const doc = fs.readFileSync(setupPath, 'utf8');

    expect(doc).toMatch(/Transactional Auth Email/i);
    expect(doc).toMatch(/auth@overland\.com/i);
    expect(doc).toMatch(/Client Configuration/i);
  });
});
