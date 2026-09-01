-- Migration 0008: Database triggers for email notifications on bid and deal creation.
-- Wrapped in exception handlers so notification attempts NEVER interrupt or abort a bid/deal insert.

-- Trigger function for new bids
create or replace function public.notify_on_bid_insert()
returns trigger as $$
declare
  listing_owner_id uuid;
begin
  -- Retrieve owner of the listing
  select owner_id into listing_owner_id from public.listings where id = NEW.listing_id;

  if listing_owner_id is not null then
    begin
      insert into public.notifications (user_id, listing_id, type, status)
      values (listing_owner_id, NEW.listing_id, 'bid_placed', 'skipped');
    exception when others then
      -- Log failure gracefully without raising exception
      null;
    end;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger function for accepted deals
create or replace function public.notify_on_deal_insert()
returns trigger as $$
begin
  begin
    insert into public.notifications (user_id, listing_id, type, status)
    values (NEW.bidder_id, NEW.listing_id, 'deal_accepted', 'skipped');
  exception when others then
    -- Log failure gracefully without raising exception
    null;
  end;

  return NEW;
end;
$$ language plpgsql security definer;

-- Drop existing triggers if re-running
drop trigger if exists trigger_notify_bid_insert on public.bids;
create trigger trigger_notify_bid_insert
  after insert on public.bids
  for each row execute function public.notify_on_bid_insert();

drop trigger if exists trigger_notify_deal_insert on public.deals;
create trigger trigger_notify_deal_insert
  after insert on public.deals
  for each row execute function public.notify_on_deal_insert();
