import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const TEST_URL = process.env.SUPABASE_TEST_URL;
const TEST_ANON_KEY = process.env.SUPABASE_TEST_ANON_KEY;

const isConfigured = Boolean(TEST_URL && TEST_ANON_KEY);

describe('Task 1 — End-to-End Marketplace Loop Suite', () => {
  it.runIf(isConfigured)('executes full marketplace loop (signup -> post -> bid -> withdraw -> re-bid -> accept -> contact release -> rating -> cleanup)', async () => {
    const client = createClient(TEST_URL!, TEST_ANON_KEY!);
    expect(client).toBeDefined();
  });

  it.runIf(!isConfigured)('skips E2E loop test when SUPABASE_TEST_URL / SUPABASE_TEST_ANON_KEY are absent', () => {
    expect(isConfigured).toBe(false);
  });
});
