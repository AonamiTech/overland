// Natural-language search fallback, using an open-weight model.
//
// Only called when the deterministic parser in src/lib/parseQuery.ts fails - most
// freight queries are patterned enough that a regex beats a model on latency, cost and
// reproducibility. This handles the tail.
//
// Runs server-side so GROQ_API_KEY never reaches the browser. The model is Llama 3.3
// 70B via Groq (open weights, free tier, very fast). Swap MODEL/ENDPOINT for Together,
// OpenRouter or a self-hosted vLLM without touching the client.
//
// Deploy:
//   supabase secrets set GROQ_API_KEY=gsk_...
//   supabase functions deploy ai-search --no-verify-jwt

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const CITY_CODES = [
  'LAX','SFO','PHX','DFW','HOU','CHI','ATL','MIA','DEN','EWR','CLT','SEA','SLC',
  'MSY','MEM','SAV','LRD','SAT','FAT','DTW','MCI',
];
const EQUIPMENT = [
  'Dry van','Reefer','Flatbed','Step deck','Conestoga','Power only','Hotshot',
  'Box truck','Sprinter van','Tanker','Car hauler','Lowboy / RGN','Dump','Intermodal container',
];

const SYSTEM = `You convert a US freight search phrase into JSON filters. Reply with JSON only, no prose.

Schema:
{ "kind": "load"|"truck"|null,
  "originCode": one of [${CITY_CODES.join(', ')}] or null,
  "destCode": same list or null,
  "equipment": one of [${EQUIPMENT.join(', ')}] or null,
  "maxRate": number|null, "minRate": number|null,
  "sort": "price-asc"|"price-desc"|"rating"|"newest"|null,
  "dims": string|null, "weightLbs": number|null,
  "understood": string[] }

Rules:
- "trucks"/"carrier"/"capacity" => kind "truck". "load"/"freight"/"cargo" => kind "load".
- Direction matters: "A to B" means originCode A, destCode B. Never swap them.
- Map city names to the nearest listed code. If a city is not on the list, use null.
- "cheap"/"budget" => sort "price-asc". "best"/"top rated" => "rating".
- Cartons, boxes and pallets imply "Dry van" unless refrigeration is mentioned.
- understood: short human phrases describing what you extracted, e.g. ["trucks","LAX to SFO","cheapest first"].
- If you cannot tell, use null. Do not invent a city or a rate.`;

Deno.serve(async (req) => {
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'authorization, content-type, apikey',
    'content-type': 'application/json',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const key = Deno.env.get('GROQ_API_KEY');
  if (!key) {
    return new Response(JSON.stringify({ error: 'not_configured' }), { status: 501, headers: cors });
  }

  let q = '';
  try { q = String((await req.json()).q ?? '').slice(0, 300); } catch { /* ignore */ }
  if (!q.trim()) return new Response(JSON.stringify({ error: 'empty' }), { status: 400, headers: cors });

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,                       // same phrase must give the same filters
        response_format: { type: 'json_object' },
        max_tokens: 300,
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: q }],
      }),
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) throw new Error(String(r.status));

    const data = await r.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? '{}');

    // Never trust the model's vocabulary - clamp everything to known values.
    const clean = {
      kind: ['load', 'truck'].includes(parsed.kind) ? parsed.kind : null,
      originCode: CITY_CODES.includes(parsed.originCode) ? parsed.originCode : null,
      destCode: CITY_CODES.includes(parsed.destCode) ? parsed.destCode : null,
      equipment: EQUIPMENT.includes(parsed.equipment) ? parsed.equipment : null,
      maxRate: Number.isFinite(parsed.maxRate) ? Math.min(1e6, Math.abs(parsed.maxRate)) : null,
      minRate: Number.isFinite(parsed.minRate) ? Math.min(1e6, Math.abs(parsed.minRate)) : null,
      sort: ['price-asc','price-desc','rating','newest'].includes(parsed.sort) ? parsed.sort : null,
      dims: typeof parsed.dims === 'string' ? parsed.dims.slice(0, 30) : null,
      weightLbs: Number.isFinite(parsed.weightLbs) ? Math.min(2e5, Math.abs(parsed.weightLbs)) : null,
      understood: Array.isArray(parsed.understood) ? parsed.understood.slice(0, 6).map(String) : [],
      via: 'model',
    };
    return new Response(JSON.stringify(clean), { headers: cors });
  } catch {
    return new Response(JSON.stringify({ error: 'model_unavailable' }), { status: 502, headers: cors });
  }
});
