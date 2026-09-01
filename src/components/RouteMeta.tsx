import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageView } from '@/lib/analytics';

/**
 * Per-route <title> and meta description.
 *
 * Mounted once inside the router rather than added to all page components:
 * one map is easier to keep truthful than scattered strings, and it cannot
 * drift out of sync with the route table.
 */

const BASE = 'Overland';
const TAGLINE = 'Freight and trucks, priced in the open';

const TITLES: Record<string, [string, string]> = {
  '/':                       [TAGLINE, 'An open board for US freight. Post a load or a truck, take open bids, and deal direct. Free to use, no fees.'],
  '/terms':                  ['Terms of use', 'How Overland works, and why it is not a freight broker.'],
  '/privacy':                ['Privacy policy', 'What data Overland collects, how it is used, and how to request deletion.'],
  '/board':                  ['Rate board', 'Live lane rates across US freight lanes. Rate per mile, 30-day averages and open bids.'],
};

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const [name, desc] = TITLES[pathname] ?? ['Freight exchange', 'An open board for US freight.'];
    document.title = pathname === '/' ? `${BASE} — ${name}` : `${name} — ${BASE}`;

    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', desc);

    // Title is set above, so the page_view carries the right one.
    pageView(pathname);
  }, [pathname]);

  return null;
}
