import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Unit tests run against a stub URL so nothing reaches the network. But the
    // RLS suite in src/lib/__tests__/db.policies.test.ts skips itself when the URL
    // contains "fake" — hardcoding it here made those five tests unreachable in
    // every configuration. Real credentials in the environment now win.
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://fake.supabase.co',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'fake-anon-key',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
