/**
 * SEO / GEO / AEO helpers.
 *
 * SEO  - classic crawlers: unique title, description, canonical, JSON-LD.
 * GEO  - generative engines (ChatGPT, Perplexity, AI Overviews) lift short, factual,
 *        self-contained statements. They cannot execute a bidding UI, so the answer has
 *        to exist as plain prose in the DOM.
 * AEO  - answer engines want an explicit question -> answer pair, which is what
 *        FAQPage schema encodes.
 *
 * The lane pages are the asset here: "what does Dallas to Los Angeles pay" is a real
 * query with real volume, and nobody gives that number away for free.
 */

export type LaneSeo = {
  originCode: string; destCode: string;
  origin: string; dest: string;
  miles: number; equipment: string;
  rpm: number; linehaul: number; avgRpm: number;
};

export const laneSlug = (a: string, b: string) => `${a}-${b}`.toLowerCase();

export const laneTitle = (l: LaneSeo) =>
  `${l.origin} to ${l.dest} freight rates — $${l.rpm.toFixed(2)}/mi | Overland`;

export const laneDescription = (l: LaneSeo) =>
  `${l.origin} to ${l.dest} is ${l.miles.toLocaleString()} miles. ` +
  `Current ${l.equipment.toLowerCase()} rate is $${l.rpm.toFixed(2)} per mile, ` +
  `about $${l.linehaul.toLocaleString()} for the load. ` +
  `See live bids and post freight or a truck free on Overland.`;

/** One-sentence answers, phrased so a generative engine can quote them whole. */
export function laneAnswers(l: LaneSeo): Array<[string, string]> {
  const dir = l.rpm >= l.avgRpm ? 'above' : 'below';
  return [
    [
      `What does ${l.origin} to ${l.dest} pay?`,
      `${l.origin} to ${l.dest} currently pays about $${l.linehaul.toLocaleString()} for a ${l.equipment.toLowerCase()} load, ` +
      `which is $${l.rpm.toFixed(2)} per mile over ${l.miles.toLocaleString()} miles. ` +
      `That is ${dir} the 30-day average of $${l.avgRpm.toFixed(2)} per mile.`,
    ],
    [
      `How far is ${l.origin} to ${l.dest}?`,
      `${l.origin} to ${l.dest} is roughly ${l.miles.toLocaleString()} road miles.`,
    ],
    [
      `How do I find a truck for ${l.origin} to ${l.dest}?`,
      `Post the load on Overland and carriers bid on it in the open. Every bid is visible, ` +
      `there is no broker in the middle, and Overland charges no platform fees. ` +
      `When you accept a bid both sides get each other's contact details by email.`,
    ],
    [
      `Is Overland a freight broker?`,
      `No. Overland is an open listing board. It does not arrange transportation for ` +
      `compensation, handle payment, or take a percentage of any rate. It verifies email ` +
      `addresses only, and each party is responsible for checking the other's authority ` +
      `and insurance on the FMCSA register.`,
    ],
  ];
}

/** JSON-LD: FAQPage for answer engines, plus a Place-to-Place trip for context. */
export function laneJsonLd(l: LaneSeo, url: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: laneAnswers(l).map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: `${l.origin} to ${l.dest} freight`,
        serviceType: `${l.equipment} truckload`,
        provider: { '@type': 'Organization', name: 'Overland', url: 'https://overland-ochre.vercel.app' },
        areaServed: { '@type': 'Country', name: 'United States' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: l.linehaul,
          description: `${l.miles} miles at $${l.rpm.toFixed(2)} per mile`,
        },
      },
    ],
  };
}

/** Writes title, description, canonical and JSON-LD. Cleans up its own tags. */
export function applySeo(opts: { title: string; description: string; canonical?: string; jsonLd?: unknown }) {
  document.title = opts.title;

  const meta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
    let t = document.querySelector(`meta[${attr}="${name}"]`);
    if (!t) { t = document.createElement('meta'); t.setAttribute(attr, name); document.head.appendChild(t); }
    t.setAttribute('content', content);
  };
  meta('description', opts.description);
  meta('og:title', opts.title, 'property');
  meta('og:description', opts.description, 'property');
  meta('twitter:title', opts.title);
  meta('twitter:description', opts.description);

  if (opts.canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); }
    link.setAttribute('href', opts.canonical);
  }

  document.getElementById('ov-jsonld')?.remove();
  if (opts.jsonLd) {
    const s = document.createElement('script');
    s.id = 'ov-jsonld';
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(opts.jsonLd);
    document.head.appendChild(s);
  }
}
