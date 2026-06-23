-- ============================================================================
-- 0008 — Abandoned-cart recovery + behavioural analytics
--   * Adds opt-in contact + freshness fields to carts
--   * Adds an analytics_events table for behavioural events (spec §53)
-- ============================================================================

-- ── Cart recovery fields ────────────────────────────────────────────────────
alter table carts
  add column if not exists contact_email text,
  add column if not exists contact_name text,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists reminded_at timestamptz,
  add column if not exists reminder_count integer not null default 0;

-- Keep last_activity_at fresh whenever the cart row changes
create or replace function touch_cart_activity()
returns trigger language plpgsql as $$
begin
  new.last_activity_at = now();
  return new;
end;
$$;

drop trigger if exists carts_touch_activity on carts;
create trigger carts_touch_activity before update on carts
  for each row execute function touch_cart_activity();

-- Bump the parent cart's activity when items change
create or replace function bump_cart_activity_from_item()
returns trigger language plpgsql as $$
begin
  update carts set last_activity_at = now()
  where id = coalesce(new.cart_id, old.cart_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists cart_items_bump_activity on cart_items;
create trigger cart_items_bump_activity
  after insert or update or delete on cart_items
  for each row execute function bump_cart_activity_from_item();

create index if not exists carts_recovery_idx
  on carts (status, last_activity_at)
  where status = 'active';

-- ── Behavioural analytics events ────────────────────────────────────────────
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,            -- e.g. add_to_cart, view_item
  user_id uuid references profiles (id) on delete set null,
  session_token_hash text,             -- hashed guest/session id, never raw PII
  product_id uuid,
  variant_id uuid,
  properties jsonb,                    -- category, health goal, price, qty…
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_name_idx on analytics_events (event_name, created_at);

alter table analytics_events enable row level security;
-- Writes happen server-side via the service-role client (bypasses RLS).
-- Only staff may read aggregated event data.
create policy "staff read analytics" on analytics_events
  for select using (is_staff());
