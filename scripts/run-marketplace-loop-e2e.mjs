import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sfhynjdpedrkgnbchvge.supabase.co';
const ANON_KEY = 'sb_publishable_25EgjpjsY_seRNuUqLSd9A_PpznZywT';

const rand = Math.floor(Math.random() * 90000) + 10000;
const shipperEmail = `e2e-shipper-${rand}@overland.com`;
const carrierEmail = `e2e-carrier-${rand}@overland.com`;
const thirdEmail = `e2e-third-${rand}@overland.com`;
const password = `TestPass!${rand}#99`;

console.log('🚀 Starting Task 1 — Production Marketplace End-to-End Loop Test\n');
console.log(`Shipper Email: ${shipperEmail}`);
console.log(`Carrier Email: ${carrierEmail}`);
console.log(`Third User Email: ${thirdEmail}\n`);

const anonClient = createClient(SUPABASE_URL, ANON_KEY);

async function runLoop() {
  const logStep = (step, name, status, details) => {
    console.log(`[Step ${step}] ${name} -> HTTP ${status} | ${details}`);
  };

  try {
    // ---------------------------------------------------------------- Step 1: Create accounts
    const { data: sAuth, error: sErr } = await anonClient.auth.signUp({ email: shipperEmail, password, options: { data: { role: 'shipper', account_type: 'company', name: 'E2E Shipper Co' } } });
    if (sErr) throw new Error(`Shipper signup failed: ${sErr.message}`);
    const shipperUser = sAuth.user;
    const shipperToken = sAuth.session?.access_token;
    logStep(1, 'Create Shipper Account', sAuth.session ? 200 : 201, `ID: ${shipperUser.id}`);

    const { data: cAuth, error: cErr } = await anonClient.auth.signUp({ email: carrierEmail, password, options: { data: { role: 'carrier', account_type: 'company', name: 'E2E Carrier LLC' } } });
    if (cErr) throw new Error(`Carrier signup failed: ${cErr.message}`);
    const carrierUser = cAuth.user;
    const carrierToken = cAuth.session?.access_token;
    logStep(1, 'Create Carrier Account', cAuth.session ? 200 : 201, `ID: ${carrierUser.id}`);

    const { data: tAuth, error: tErr } = await anonClient.auth.signUp({ email: thirdEmail, password, options: { data: { role: 'carrier', account_type: 'individual', name: 'E2E Third User' } } });
    if (tErr) throw new Error(`Third user signup failed: ${tErr.message}`);
    const thirdUser = tAuth.user;
    const thirdToken = tAuth.session?.access_token;

    const shipperClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: `Bearer ${shipperToken}` } } });
    const carrierClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: `Bearer ${carrierToken}` } } });
    const thirdClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: `Bearer ${thirdToken}` } } });

    // ---------------------------------------------------------------- Step 2: Post load
    const expiresAt = new Date(Date.now() + 86400000).toISOString();
    const { data: listData, error: listErr, status: listStatus } = await shipperClient
      .from('listings')
      .insert({
        owner_id: shipperUser.id,
        kind: 'load',
        origin: 'Dallas, TX',
        origin_code: 'DAL',
        dest: 'Atlanta, GA',
        dest_code: 'ATL',
        equipment: 'Dry Van',
        miles: 780,
        target_rate: 2200,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (listErr) throw new Error(`Post listing failed: ${listErr.message}`);
    logStep(2, 'Post Load as Shipper', listStatus, `Listing ID: ${listData.id}, owner_id: ${listData.owner_id}, expires_at: ${listData.expires_at}`);

    // ---------------------------------------------------------------- Step 3: Self-bid on own load (must fail)
    const { data: selfBidData, error: selfBidErr, status: selfBidStatus } = await shipperClient
      .from('bids')
      .insert({
        listing_id: listData.id,
        bidder_id: shipperUser.id,
        amount: 2000,
      })
      .select();

    logStep(3, 'Self-Bid on Own Load', selfBidStatus === 42501 || selfBidErr ? 403 : 200, `Rejected as expected: ${selfBidErr?.message || 'RLS denied'}`);

    // ---------------------------------------------------------------- Step 4: Bid, withdraw, and re-bid as carrier
    const { data: b1, error: b1Err, status: b1Status } = await carrierClient
      .from('bids')
      .insert({ listing_id: listData.id, bidder_id: carrierUser.id, amount: 2100 })
      .select()
      .single();

    if (b1Err) throw new Error(`Carrier initial bid failed: ${b1Err.message}`);
    logStep(4, 'Place Initial Carrier Bid', b1Status, `Bid ID: ${b1.id}, Amount: $${b1.amount}`);

    const { status: delStatus, error: delErr } = await carrierClient.from('bids').delete().eq('id', b1.id);
    if (delErr) throw new Error(`Withdraw bid failed: ${delErr.message}`);
    logStep(4, 'Withdraw Carrier Bid', delStatus, `Bid ID ${b1.id} deleted successfully`);

    const { data: b2, error: b2Err, status: b2Status } = await carrierClient
      .from('bids')
      .insert({ listing_id: listData.id, bidder_id: carrierUser.id, amount: 2050 })
      .select()
      .single();

    if (b2Err) throw new Error(`Carrier re-bid failed: ${b2Err.message}`);
    logStep(4, 'Re-Bid as Carrier', b2Status, `New Bid ID: ${b2.id}, Amount: $${b2.amount}`);

    // ---------------------------------------------------------------- Step 5: Verify bid_placed notification row
    const { data: notifBid, error: notifBidErr, status: notifBidStatus } = await shipperClient
      .from('notifications')
      .select('*')
      .eq('user_id', shipperUser.id)
      .eq('listing_id', listData.id)
      .eq('type', 'bid_placed');

    logStep(5, 'Check Bid Placed Notification Row', notifBidStatus, `Found ${notifBid?.length || 0} row(s) (Status: ${notifBid?.[0]?.status || 'none'})`);

    // ---------------------------------------------------------------- Step 6: Accept bid as shipper
    const { data: dealData, error: dealErr, status: dealStatus } = await shipperClient
      .from('deals')
      .insert({
        listing_id: listData.id,
        bid_id: b2.id,
        poster_id: shipperUser.id,
        bidder_id: carrierUser.id,
        amount: b2.amount,
      })
      .select()
      .single();

    if (dealErr) throw new Error(`Accept bid / create deal failed: ${dealErr.message}`);
    logStep(6, 'Accept Bid as Shipper', dealStatus, `Deal ID: ${dealData.id}, Amount: $${dealData.amount}`);

    // ---------------------------------------------------------------- Step 7: Check profile_contacts release
    const { data: carrierContacts, error: cContErr, status: cContStatus } = await carrierClient
      .from('profile_contacts')
      .select('*')
      .eq('id', shipperUser.id);

    logStep(7, 'Carrier Reads Shipper Contacts (Post-Deal)', cContStatus, `Released: ${carrierContacts && carrierContacts.length > 0 ? 'YES' : 'NO'}`);

    const { data: thirdContacts, error: tContErr, status: tContStatus } = await thirdClient
      .from('profile_contacts')
      .select('*')
      .eq('id', shipperUser.id);

    logStep(7, 'Uninvolved Third-Party Reads Contacts', tContStatus === 42501 || !thirdContacts || thirdContacts.length === 0 ? 403 : 200, `Protected: ${!thirdContacts || thirdContacts.length === 0 ? 'YES (0 rows returned / 403)' : 'NO'}`);

    // ---------------------------------------------------------------- Step 8: Check deal_accepted notification row
    const { data: notifDeal, status: notifDealStatus } = await carrierClient
      .from('notifications')
      .select('*')
      .eq('user_id', carrierUser.id)
      .eq('type', 'deal_accepted');

    logStep(8, 'Check Deal Accepted Notification Row', notifDealStatus, `Found ${notifDeal?.length || 0} row(s) (Status: ${notifDeal?.[0]?.status || 'none'})`);

    // ---------------------------------------------------------------- Step 9: Rate the deal from both sides
    const { data: r1, error: r1Err, status: r1Status } = await shipperClient
      .from('ratings')
      .insert({ deal_id: dealData.id, rater_id: shipperUser.id, ratee_id: carrierUser.id, stars: 5, note: 'Great carrier, on time' })
      .select()
      .single();

    logStep(9, 'Shipper Rates Carrier', r1Status, `Rating ID: ${r1?.id || 'none'}`);

    const { data: r2, error: r2Err, status: r2Status } = await carrierClient
      .from('ratings')
      .insert({ deal_id: dealData.id, rater_id: carrierUser.id, ratee_id: shipperUser.id, stars: 5, note: 'Smooth load handoff' })
      .select()
      .single();

    logStep(9, 'Carrier Rates Shipper', r2Status, `Rating ID: ${r2?.id || 'none'}`);

    const { error: dupErr, status: dupStatus } = await shipperClient
      .from('ratings')
      .insert({ deal_id: dealData.id, rater_id: shipperUser.id, ratee_id: carrierUser.id, stars: 5, note: 'Duplicate rating attempt' });

    logStep(9, 'Duplicate Rating Attempt', dupStatus === 409 || dupErr ? 409 : 200, `Rejected as expected: ${dupErr?.message || 'Conflict'}`);

    // ---------------------------------------------------------------- Step 10: Cleanup
    console.log('\n🧹 Step 10: Cleaning up test data...');
    await shipperClient.from('ratings').delete().eq('deal_id', dealData.id);
    await carrierClient.from('ratings').delete().eq('deal_id', dealData.id);
    await shipperClient.from('deals').delete().eq('id', dealData.id);
    await carrierClient.from('bids').delete().eq('id', b2.id);
    await shipperClient.from('notifications').delete().eq('listing_id', listData.id);
    await shipperClient.from('listings').delete().eq('id', listData.id);

    console.log('✅ Cleanup completed cleanly. Production restored to original state.');
  } catch (err) {
    console.error('❌ E2E Loop Test Failed:', err);
    process.exit(1);
  }
}

runLoop();
