import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 11 Performance and Accessibility Cleanup', () => {
  it('src/theme.css is imported in main.tsx', () => {
    const mainPath = path.resolve(process.cwd(), 'src/main.tsx');
    const code = fs.readFileSync(mainPath, 'utf8');

    expect(code).toMatch(/import '\.\/theme\.css';/);
  });

  it('unused edge functions news and ai-search are deleted', () => {
    const newsPath = path.resolve(process.cwd(), 'supabase/functions/news');
    const aiSearchPath = path.resolve(process.cwd(), 'supabase/functions/ai-search');

    expect(fs.existsSync(newsPath)).toBe(false);
    expect(fs.existsSync(aiSearchPath)).toBe(false);
  });
});
