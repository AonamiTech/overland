import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageView } from '@/lib/analytics';

/**
 * Per-route <title> and meta description.
 *
 * Mounted once inside the router rather than added to all 30+ page components:
 * one map is easier to keep truthful than thirty scattered strings, and it cannot
 * drift out of sync with the route table.
 */

const BASE = 'Overland';
const TAGLINE = 'Freight and trucks, priced in the open';

const TITLES: Record<string, [string, string]> = {
  '/':                       [TAGLINE, 'An open board for US freight. Post a load or a truck, take open bids, and deal direct. Free to use, no commission.'],
  '/terms':                  ['Terms of use', 'How Overland works, and why it is not a freight broker.'],
  '/board':                  ['Rate board', 'Live lane rates across US freight lanes. Rate per mile, 30-day averages and open bids.'],
  '/broker-dashboard':       ['Broker dashboard', 'Manage posted loads and incoming bids.'],
  '/fleet-dashboard':        ['Fleet dashboard', 'Your trucks, your bids and your booked lanes.'],
  '/corporate-dashboard':    ['Shipper dashboard', 'Your posted freight and the bids against it.'],
  '/post-loads':             ['Post a load', 'Put a lane on the board and take open bids on it.'],
  '/hire-trucks':            ['Find a truck', 'Browse available capacity and bid on it directly.'],
  '/post-truck':             ['Post a truck', 'List available capacity and take bids on your empty legs.'],
  '/fleet-management':       ['Fleet management', 'Trucks, drivers and equipment in one place.'],
  '/gps-tracking':           ['Tracking', 'Live location on active loads.'],
  '/reports-analytics':      ['Reports', 'Lane performance and rate history.'],
  '/settings':               ['Settings', 'Account, notifications and preferences.'],
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
