/**
 * Outbound links for checking who you are about to deal with.
 *
 * We verify nothing - that is the deal on an open board - so the honest move is to
 * hand people the places where they can check for themselves, and to label every
 * field with where it came from. Nothing here asserts that a carrier is legitimate.
 *
 * SAFER is the one that matters. It is the FMCSA's public carrier snapshot: operating
 * authority, insurance on file, fleet size, crash and inspection history, keyed by
 * USDOT or MC number. It is free, needs no key, and it is the actual answer to "is
 * this a real carrier". A website is self-declared and a Google result is a search -
 * neither proves anything, which is why they are labelled differently below.
 */

export type CarrierLink = {
  key: 'safer' | 'website' | 'google';
  label: string;
  href: string;
  /** How much this link is worth as evidence. Drives the styling. */
  weight: 'verify' | 'declared' | 'search';
};

const enc = encodeURIComponent;

/** FMCSA carrier snapshot. USDOT is the better key - MC numbers get reassigned. */
export function saferUrl(opts: { usdot?: string; mc?: string }): string | null {
  const dot = opts.usdot?.replace(/\D/g, '');
  if (dot) {
    return 'https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot'
      + `&query_param=USDOT&query_string=${enc(dot)}`;
  }
  const mc = opts.mc?.replace(/\D/g, '');
  if (mc) {
    return 'https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot'
      + `&query_param=MC_MX&query_string=${enc(mc)}`;
  }
  return null;
}

/** Normalises whatever someone typed into their profile into an openable https URL. */
export function normalizeWebsite(raw?: string): string | null {
  const s = raw?.trim();
  if (!s) return null;
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withScheme);
    // Reject anything that is not a plausible hostname so a typo does not render a link.
    if (!/^[\w-]+(\.[\w-]+)+$/.test(u.hostname)) return null;
    return u.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export const hostOf = (url: string) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
};

/** A search, not a listing. We cannot know whether a company has a Google page, so we
 *  send people to look rather than fabricate a profile link. */
export function googleUrl(name: string, city?: string): string {
  return `https://www.google.com/search?q=${enc([name, city, 'trucking'].filter(Boolean).join(' '))}`;
}

export function carrierLinks(p: {
  name: string; city?: string; website?: string; mcNumber?: string; usdotNumber?: string;
}): CarrierLink[] {
  const out: CarrierLink[] = [];
  const safer = saferUrl({ usdot: p.usdotNumber, mc: p.mcNumber });
  if (safer) out.push({ key: 'safer', label: 'FMCSA SAFER', href: safer, weight: 'verify' });
  const site = normalizeWebsite(p.website);
  if (site) out.push({ key: 'website', label: hostOf(site), href: site, weight: 'declared' });
  out.push({ key: 'google', label: 'Look up on Google', href: googleUrl(p.name, p.city), weight: 'search' });
  return out;
}
