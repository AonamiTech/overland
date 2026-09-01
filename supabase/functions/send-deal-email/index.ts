import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

/**
 * Deal notification edge function.
 *
 * Triggered on INSERT into `public.deals`.
 * Sends transactional intro email to poster and bidder with each other's contact details.
 *
 * Guarded: If SMTP / Resend credentials are not set, it logs a warning and returns status: skipped
 * rather than throwing or failing the transaction.
 */

type DealRecord = {
  id: string;
  listing_id: string;
  bid_id: string;
  poster_id: string;
  bidder_id: string;
  amount: number;
};

type WebhookPayload = {
  type?: string;
  table?: string;
  record?: DealRecord;
  deal?: DealRecord;
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const payload = (await req.json().catch(() => ({}))) as WebhookPayload;
    const deal = payload.record ?? payload.deal;

    if (!deal || !deal.poster_id || !deal.bidder_id) {
      return new Response(JSON.stringify({ error: 'Invalid deal payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    const isConfigured = Boolean(resendKey || (smtpHost && smtpUser && smtpPass));

    if (!isConfigured) {
      console.warn('[WARN] SMTP/Resend credentials not set. Skipping deal notification email.');
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'SMTP/Resend credentials missing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('[WARN] Supabase service role credentials not configured in edge function.');
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'Supabase credentials missing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const [posterProfile, bidderProfile, posterContact, bidderContact, listing] = await Promise.all([
      admin.from('profiles').select('name, org_name').eq('id', deal.poster_id).maybeSingle(),
      admin.from('profiles').select('name, org_name').eq('id', deal.bidder_id).maybeSingle(),
      admin.from('profile_contacts').select('email, phone').eq('id', deal.poster_id).maybeSingle(),
      admin.from('profile_contacts').select('email, phone').eq('id', deal.bidder_id).maybeSingle(),
      admin.from('listings').select('origin, dest, linehaul').eq('id', deal.listing_id).maybeSingle(),
    ]);

    const posterEmail = posterContact.data?.email;
    const bidderEmail = bidderContact.data?.email;

    if (!posterEmail || !bidderEmail) {
      console.warn('[WARN] Could not retrieve contact email for deal participants.');
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'Contact details missing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (resendKey) {
      const emailBody = {
        from: Deno.env.get('SMTP_FROM') || 'Overland <notifications@overland.com>',
        to: [posterEmail, bidderEmail],
        subject: `Deal Connected: ${listing.data?.origin ?? 'Origin'} → ${listing.data?.dest ?? 'Destination'} ($${deal.amount})`,
        text: `Both sides have agreed to a rate of $${deal.amount}.\n\n` +
          `Poster: ${posterProfile.data?.name ?? 'Poster'} (${posterEmail}, ${posterContact.data?.phone ?? 'No phone'})\n` +
          `Bidder: ${bidderProfile.data?.name ?? 'Bidder'} (${bidderEmail}, ${bidderContact.data?.phone ?? 'No phone'})\n\n` +
          `Please contract directly and verify operating authority on SAFER. Overland is not a broker and takes no commission.`,
      };

      const resendResp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
      });

      if (!resendResp.ok) {
        const errText = await resendResp.text();
        console.error('[ERROR] Resend API failed:', errText);
        return new Response(JSON.stringify({ status: 'error', details: errText }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(
      JSON.stringify({ status: 'sent', deal_id: deal.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[ERROR] Unhandled edge function error:', err);
    return new Response(
      JSON.stringify({ status: 'error', error: err instanceof Error ? err.message : String(err) }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
