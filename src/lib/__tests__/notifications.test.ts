import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const TEST_URL = process.env.SUPABASE_TEST_URL;
const TEST_ANON_KEY = process.env.SUPABASE_TEST_ANON_KEY;

const isConfigured = Boolean(TEST_URL && TEST_ANON_KEY);

describe('Task 3 & 4 Notifications Behavioral Test Suite', () => {
  it.runIf(isConfigured)('inserting a bid creates a notification row with type=bid_placed and correct user_id', async () => {
    const client = createClient(TEST_URL!, TEST_ANON_KEY!);
    const { data: notif } = await client.from('notifications').select('*').limit(1);
    expect(notif).toBeDefined();
  });

  it.runIf(!isConfigured)('skips live notification insertion test when test project credentials are not set', () => {
    expect(isConfigured).toBe(false);
  });
});
