import { describe, it, expect, vi } from 'vitest';
import { trackFunnelEvent, isAnalyticsEnabled, events } from '../analytics';

describe('Task 10 Funnel Instrumentation', () => {
  it('isAnalyticsEnabled returns false when keys are missing in local dev', () => {
    const origKey1 = import.meta.env.VITE_POSTHOG_KEY;
    const origKey2 = import.meta.env.VITE_ANALYTICS_KEY;
    delete (import.meta.env as any).VITE_POSTHOG_KEY;
    delete (import.meta.env as any).VITE_ANALYTICS_KEY;

    expect(isAnalyticsEnabled()).toBe(false);

    (import.meta.env as any).VITE_POSTHOG_KEY = origKey1;
    (import.meta.env as any).VITE_ANALYTICS_KEY = origKey2;
  });

  it('trackFunnelEvent fires posthog capture when enabled', () => {
    (import.meta.env as any).VITE_POSTHOG_KEY = 'phc_test_key_123';
    const mockCapture = vi.fn();
    window.posthog = { capture: mockCapture };

    trackFunnelEvent('signup_started', { role: 'carrier' });

    expect(mockCapture).toHaveBeenCalledWith('signup_started', { role: 'carrier' });

    delete window.posthog;
    delete (import.meta.env as any).VITE_POSTHOG_KEY;
  });
});
