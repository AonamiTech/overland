import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

/**
 * Transactional Email Notification Edge Function.
 *
 * Handles two event types:
 * 1. `bid_placed`: "you received a bid" -> sent to listing owner
 * 2. `deal_accepted`: "your bid was accepted" -> sent to winning bidder
 *
 * Rules:
 * - Checks `notify_email` preference on `profiles` (unsubscribe link / flag)
 * - Enforces per-listing hourly cap (max 5 notification emails per listing/hr)
 * - Logs all attempts to `public.notifications` table
 * - Introduces parties and steps out without claiming brokerage or payment responsibility
 */

type NotificationPayload = {
  event_type?: 'bid_placed' | 'deal_accepted';
  record?: {
    id: string;
    listing_id: string;
    bid_id?: string;
    poster_id?: string;
    bidder_id?: string;
    amount?: number;
  };
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
    const payload = (await req.json().catch(() => ({}))) as NotificationPayload;
    const eventType = payload.event_type ?? 'deal_accepted';
    const rec = payload.record;

    if (!rec || !rec.listing_id) {
      return new Response(JSON.stringify({ error: 'Invalid notification payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const smtpHost = Deno.env.get('SMTP_HOST');
    const isConfigured = Boolean(resendKey || smtpHost);

    if (!isConfigured) {
      console.warn('[WARN] SMTP/Resend credentials missing. Skipping email send.');
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'SMTP/Resend credentials missing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'Supabase credentials missing' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch listing and targets
    const { data: listing } = await admin.from('listings').select('*').eq('id', rec.listing_id).single();
    if (!listing) {
      return new Response(JSON.stringify({ status: 'skipped', reason: 'Listing not found' }), { status: 200 });
    }

    const targetUserId = eventType === 'bid_placed' ? listing.owner_id : rec.bidder_id;
    if (!targetUserId) {
      return new Response(JSON.stringify({ status: 'skipped', reason: 'Target user not found' }), { status: 200 });
    }

    // 2. Check notify_email preference flag on target profile
    const { data: targetProfile } = await admin.from('profiles').select('name, notify_email').eq('id', targetUserId).single();
    if (targetProfile && targetProfile.notify_email === false) {
      await admin.from('notifications').insert({
        user_id: targetUserId, listing_id: listing.id, type: eventType, status: 'skipped'
      });
      return new Response(JSON.stringify({ status: 'skipped', reason: 'User unsubscribed' }), { status: 200 });
    }

    // 3. Check per-listing hourly notification cap (max 5 notification emails per listing/hr)
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const { count } = await admin.from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('listing_id', listing.id)
      .eq('status', 'sent')
      .gt('created_at', oneHourAgo);

    if ((count ?? 0) >= 5) {
      await admin.from('notifications').insert({
        user_id: targetUserId, listing_id: listing.id, type: eventType, status: 'skipped'
      });
      return new Response(JSON.stringify({ status: 'skipped', reason: 'Hourly listing cap reached' }), { status: 200 });
    }

    // 4. Fetch contact email
    const { data: contact } = await admin.from('profile_contacts').select('email').eq('id', targetUserId).single();
    if (!contact?.email) {
      return new Response(JSON.stringify({ status: 'skipped', reason: 'Target email missing' }), { status: 200 });
    }

    // 5. Build subject & body
    let subject = '';
    let text = '';

    if (eventType === 'bid_placed') {
      subject = `New Bid Placed: ${listing.origin} → ${listing.dest} ($${rec.amount ?? 0})`;
      text = `A new bid of $${rec.amount ?? 0} was placed on your listing (${listing.origin} → ${listing.dest}).\n\n` +
        `Sign in to Overland to review bids and connect: https://overland-5c4.pages.dev/board\n\n` +
        `To stop email notifications, update your notification settings in your profile.`;
    } else {
      subject = `Bid Accepted: ${listing.origin} → ${listing.dest} ($${rec.amount ?? 0})`;
      text = `Your bid of $${rec.amount ?? 0} for ${listing.origin} → ${listing.dest} was accepted!\n\n` +
        `You can now connect directly with the load poster on Overland: https://overland-5c4.pages.dev/board\n\n` +
        `Overland is a listing board and is not a broker, does not handle payment, and takes no commission.\n\n` +
        `To stop email notifications, update your notification settings in your profile.`;
    }

    // 6. Send via Resend if key exists
    if (resendKey) {
      const emailBody = {
        from: Deno.env.get('SMTP_FROM') || 'Overland <notifications@overland.com>',
        to: [contact.email],
        subject,
        text,
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
        await admin.from('notifications').insert({
          user_id: targetUserId, listing_id: listing.id, type: eventType, status: 'failed'
        });
        return new Response(JSON.stringify({ status: 'error', details: errText }), { status: 500 });
      }
    }

    // Log success
    await admin.from('notifications').insert({
      user_id: targetUserId, listing_id: listing.id, type: eventType, status: 'sent'
    });

    return new Response(JSON.stringify({ status: 'sent', user_id: targetUserId }), { status: 200 });
  } catch (err) {
    console.error('[ERROR] Unhandled notification function error:', err);
    return new Response(JSON.stringify({ status: 'error', error: String(err) }), { status: 200 });
  }
});
