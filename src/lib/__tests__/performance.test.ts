import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 8 Theme Resolution & Edge Functions', () => {
  it('src/theme.css is deleted to prevent unimported theme footguns', () => {
    const themePath = path.resolve(process.cwd(), 'src/theme.css');
    expect(fs.existsSync(themePath)).toBe(false);
  });

  it('news edge function is restored as live production code and ai-search remains un-deployed', () => {
    const newsPath = path.resolve(process.cwd(), 'supabase/functions/news/index.ts');
    const aiSearchPath = path.resolve(process.cwd(), 'supabase/functions/ai-search');

    expect(fs.existsSync(newsPath)).toBe(true);
    expect(fs.existsSync(aiSearchPath)).toBe(false);
  });
});
