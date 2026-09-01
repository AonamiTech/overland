// Trucking market headlines.
//
// Reads publisher RSS feeds server-side (browsers cannot, because of CORS) and returns
// headline + link + source. It never returns article bodies: RSS exists for syndication,
// but republishing the text would be copyright infringement. Every item links out to the
// publisher.
//
// Cached in memory for 15 minutes so we are not hammering anyone's feed, and so the
// section stays fast.
//
// Deploy:  supabase functions deploy news --no-verify-jwt

const FEEDS: Array<{ source: string; url: string }> = [
  { source: 'FreightWaves', url: 'https://www.freightwaves.com/news/feed' },
  { source: 'Overdrive',    url: 'https://www.overdriveonline.com/rss' },
  { source: 'Land Line',    url: 'https://landline.media/feed/' },
  { source: 'Trucking Dive', url: 'https://www.truckingdive.com/feeds/news/' },
];

// Only surface items that actually concern pricing or capacity - a general trucking
// headline is noise on a rate board.
const RELEVANT = /rate|spot|price|pricing|capacity|tender|diesel|fuel|freight market|truckload|demand|index/i;

type Item = { title: string; link: string; source: string; published: string | null };

let cache: { at: number; items: Item[] } | null = null;
const TTL = 15 * 60 * 1000;

function textBetween(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!m) return null;
  return m[1]
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .trim();
}

async function readFeed(f: { source: string; url: string }): Promise<Item[]> {
  try {
    const res = await fetch(f.url, {
      headers: { 'user-agent': 'OverlandBot/1.0 (+https://overland-5c4.pages.dev)' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const blocks = xml.split(/<item[\s>]/i).slice(1);
    return blocks.slice(0, 25).map((b) => ({
      title: textBetween(b, 'title') ?? '',
      link: (textBetween(b, 'link') ?? '').trim(),
      source: f.source,
      published: textBetween(b, 'pubDate'),
    })).filter((i) => i.title && i.link);
  } catch {
    return [];   // one dead feed must not take the section down
  }
}

Deno.serve(async () => {
  const headers = {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'cache-control': 'public, max-age=900',
  };

  if (cache && Date.now() - cache.at < TTL) {
    return new Response(JSON.stringify({ items: cache.items, cached: true }), { headers });
  }

  const all = (await Promise.all(FEEDS.map(readFeed))).flat();

  const items = all
    .filter((i) => RELEVANT.test(i.title))
    .sort((a, b) => {
      const ta = a.published ? Date.parse(a.published) : 0;
      const tb = b.published ? Date.parse(b.published) : 0;
      return tb - ta;
    })
    .slice(0, 8);

  cache = { at: Date.now(), items };
  return new Response(JSON.stringify({ items, cached: false }), { headers });
});
