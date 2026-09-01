/**
 * Scroll an element into view, reliably.
 *
 * `html, body { overflow-x: clip }` is load-bearing here - it stops horizontal
 * overflow without turning the body into its own scroll container, which is what
 * `hidden` does and what broke `position: sticky`. The cost is that Chromium then
 * ignores smooth scrolling on the document: `scrollIntoView({behavior:'smooth'})`
 * and `window.scrollTo({behavior:'smooth'})` both resolve to no movement at all,
 * while the instant forms work. Measured on the live homepage - smooth left
 * scrollY at 0, instant reached 9248.
 *
 * So this asks for smooth, then checks whether anything actually happened and
 * falls back. A nicety that silently does nothing is worse than no nicety: the
 * mobile tab bar's "Lanes" tap was dead because of it.
 */
export function scrollToEl(el: Element | null, opts: { offset?: number } = {}) {
  if (!el) return;
  const offset = opts.offset ?? 0;
  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  const start = window.scrollY;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    try { window.scrollTo({ top: target, behavior: 'smooth' }); } catch { /* older engines */ }
  }

  // If the smooth request moved nothing, jump. Two frames is enough to tell the
  // difference between "animating" and "ignored".
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (Math.abs(window.scrollY - start) < 2 && Math.abs(target - start) > 4) {
      window.scrollTo(0, target);
    }
  }));
}
