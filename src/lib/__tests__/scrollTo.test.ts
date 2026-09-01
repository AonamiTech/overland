import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollToEl } from '../scrollTo';

describe('scrollToEl', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    (window as any).scrollY = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('null element -> no throw, no scroll', () => {
    expect(() => scrollToEl(null)).not.toThrow();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('prefers-reduced-motion: reduce -> never requests smooth', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as any;

    const mockEl = {
      getBoundingClientRect: () => ({ top: 500 }),
    } as unknown as Element;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    scrollToEl(mockEl);

    const smoothCalls = scrollToSpy.mock.calls.filter(
      (args) => typeof args[0] === 'object' && (args[0] as any)?.behavior === 'smooth'
    );
    expect(smoothCalls.length).toBe(0);
  });

  it('when smooth moves nothing, falls back to an instant scrollTo at the right offset', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as any;

    const mockEl = {
      getBoundingClientRect: () => ({ top: 1000 }),
    } as unknown as Element;

    let rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    scrollToEl(mockEl, { offset: 100 });

    // Smooth scroll requested initially
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 900, behavior: 'smooth' });

    // Run first and second rAF frames
    const firstBatch = [...rafCallbacks];
    rafCallbacks = [];
    firstBatch.forEach((cb) => cb(0));

    const secondBatch = [...rafCallbacks];
    rafCallbacks = [];
    secondBatch.forEach((cb) => cb(0));

    // Because scrollY remained at 0, instant fallback scrollTo(0, 900) should be called
    expect(scrollToSpy).toHaveBeenCalledWith(0, 900);
  });

  it('when smooth does move, does not double-scroll with instant fallback', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as any;

    const mockEl = {
      getBoundingClientRect: () => ({ top: 1000 }),
    } as unknown as Element;

    let rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    scrollToEl(mockEl);

    // Simulate scroll position changing as smooth animation runs
    (window as any).scrollY = 300;

    const firstBatch = [...rafCallbacks];
    rafCallbacks = [];
    firstBatch.forEach((cb) => cb(0));

    const secondBatch = [...rafCallbacks];
    rafCallbacks = [];
    secondBatch.forEach((cb) => cb(0));

    // Instant fallback scrollTo(0, target) should NOT have been called
    const instantCalls = scrollToSpy.mock.calls.filter(
      (args) => typeof args[0] === 'number'
    );
    expect(instantCalls.length).toBe(0);
  });
});
