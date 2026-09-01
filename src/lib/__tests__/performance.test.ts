import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task 11 Performance and Accessibility Cleanup', () => {
  // Inverted deliberately. theme.css was imported here and broke the homepage in
  // dark mode: index.css and the components hardcode light values, so flipping
  // the tokens under prefers-color-scheme left 147 elements below 3:1 contrast,
  // several at exactly 1.00. It stays unimported until index.css is tokenised.
  it('src/theme.css is NOT imported in main.tsx', () => {
    const main = fs.readFileSync(path.resolve(process.cwd(), 'src/main.tsx'), 'utf8');
    expect(main).not.toMatch(/import '\.\/theme\.css';/);
  });

  it('unused edge functions news and ai-search are deleted', () => {
    const newsPath = path.resolve(process.cwd(), 'supabase/functions/news');
    const aiSearchPath = path.resolve(process.cwd(), 'supabase/functions/ai-search');

    expect(fs.existsSync(newsPath)).toBe(false);
    expect(fs.existsSync(aiSearchPath)).toBe(false);
  });
});
