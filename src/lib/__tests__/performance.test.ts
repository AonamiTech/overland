import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 11 Performance and Edge Functions', () => {
  it('src/theme.css is NOT imported in main.tsx', () => {
    const mainPath = path.resolve(process.cwd(), 'src/main.tsx');
    const code = fs.readFileSync(mainPath, 'utf8');

    expect(code).not.toMatch(/import '\.\/theme\.css';/);
  });

  it('news edge function is restored as live production code and ai-search remains un-deployed', () => {
    const newsPath = path.resolve(process.cwd(), 'supabase/functions/news/index.ts');
    const aiSearchPath = path.resolve(process.cwd(), 'supabase/functions/ai-search');

    expect(fs.existsSync(newsPath)).toBe(true);
    expect(fs.existsSync(aiSearchPath)).toBe(false);
  });
});
