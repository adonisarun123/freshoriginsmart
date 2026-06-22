-- ============================================================================
-- 0004 — Profiles, addresses, carts, orders, delivery (spec §39, §41)
-- ============================================================================

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  marketing_consent boolean not null default false,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row when an auth user is created
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper: is the current user an admin/operations role?
create or replace function is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'operations', 'editor', 'nutrition_reviewer')
  );
$$;

create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  label text,
  recipient_name text,
  phone text,
  line1 text not null,
  line2 text,
  landmark text,
  city text,
  state text,
  pincode text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_user_idx on addresses (user_id);

create table delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  delivery_charge_paise integer not null default 0,
  free_delivery_threshold_paise integer,
  min_days integer,
  max_days integer,
  active boolean not null default true
);

create table delivery_pincodes (
  pincode text primary key,
  zone_id uuid not null references delivery_zones (id) on delete cascade,
  active boolean not null default true
);

create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  guest_token_hash text,
  status text not null default 'active',
  currency text not null default 'INR',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index carts_user_idx on carts (user_id);
create index carts_guest_idx on carts (guest_token_hash);
create trigger carts_set_updated_at before update on carts
  for each row execute function set_updated_at();

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts (id) on delete cascade,
  variant_id uuid not null references product_variants (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);
create trigger cart_items_set_updated_at before update on cart_items
  for each row execute function set_updated_at();

-- Human-readable public order number generator
create sequence if not exists order_number_seq;

create table orders (
  id uuid primary key default gen_random_uuid(),
  public_order_number text not null unique,
  public_token_hash text not null,
  user_id uuid references profiles (id) on delete set null,
  source order_source not null default 'whatsapp',
  status order_status not null default 'whatsapp_pending',
  payment_status payment_status not null default 'not_required',
  -- customer snapshots
  customer_name text,
  customer_phone text,
  customer_email text,
  -- shipping snapshot
  shipping_address jsonb,
  pincode text,
  subtotal_paise integer not null default 0,
  discount_paise integer not null default 0,
  shipping_paise integer not null default 0,
  total_paise integer not null default 0,
  customer_note text,
  admin_note text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  fulfilled_at timestamptz
);
create index orders_user_idx on orders (user_id);
create index orders_status_idx on orders (status);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid,
  variant_id uuid,
  product_name text not null,
  variant_name text,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price_paise integer not null,
  total_price_paise integer not null
);
create index order_items_order_idx on order_items (order_id);

-- ── Future payment tables (Razorpay phase 2) ────────────────────────────────
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null default 'created',
  signature_verified_at timestamptz,
  captured_at timestamptz,
  failure_code text,
  failure_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger payments_set_updated_at before update on payments
  for each row execute function set_updated_at();

create table payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text unique,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
