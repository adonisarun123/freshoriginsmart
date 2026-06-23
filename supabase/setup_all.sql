-- ============================================================================
-- Fresh Origins — complete database setup (run once in Supabase SQL Editor)
-- Concatenation of migrations 0001–0007 + seed. Idempotent-ish: intended for
-- a fresh project. Wrapped per-section as authored.
-- ============================================================================

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0001_init_extensions_enums.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0001 — Extensions, enums, shared helpers
-- Fresh Origins data model (spec Part VIII)
-- ============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- search / fuzzy matching

-- ── Enums ───────────────────────────────────────────────────────────────────
create type product_type as enum ('mix', 'millet', 'rice');
create type publish_status as enum ('draft', 'active', 'archived');
create type content_status as enum (
  'draft', 'editorial_review', 'expert_review', 'compliance_review',
  'scheduled', 'published', 'hidden'
);
create type nutrition_status as enum ('estimated', 'tested', 'approved');
create type health_goal_status as enum ('published', 'coming_soon', 'hidden', 'under_review');
create type order_source as enum ('whatsapp', 'web', 'admin', 'subscription');
create type order_status as enum (
  'draft', 'whatsapp_pending', 'awaiting_confirmation', 'confirmed',
  'packed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
);
create type payment_status as enum ('not_required', 'pending', 'paid', 'failed', 'refunded');
create type user_role as enum (
  'customer', 'editor', 'nutrition_reviewer', 'operations', 'admin'
);
create type enquiry_type as enum (
  'retail', 'distributor', 'apartment_community', 'corporate_wellness',
  'professional', 'wellness_centre', 'general'
);
create type enquiry_status as enum ('new', 'assigned', 'in_progress', 'closed');

-- ── updated_at trigger helper ───────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0002_catalogue.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0002 — Catalogue: products, variants, categories, health goals, ingredients,
--        nutrition (spec §36)
-- ============================================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description jsonb,                       -- rich PDP content
  product_type product_type not null default 'mix',
  status publish_status not null default 'draft',
  featured boolean not null default false,
  -- factual flags
  is_wheat_free boolean not null default false,
  is_gluten_free boolean not null default false,   -- only true after validation
  is_vegan boolean not null default false,
  no_added_sugar boolean not null default false,
  no_maida boolean not null default false,
  preparation_time_minutes integer,
  storage_instructions text,
  allergen_information text,
  suitability_text text,
  disclaimer_text text,
  -- SEO
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_status_idx on products (status);
create index products_featured_idx on products (featured) where featured;
create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  sku text not null unique,
  title text not null,                     -- e.g. "500 g"
  weight_value numeric,
  weight_unit text,                        -- g, kg, ml
  mrp_paise integer not null check (mrp_paise >= 0),
  selling_price_paise integer not null check (selling_price_paise >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  barcode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index product_variants_product_idx on product_variants (product_id);
create trigger product_variants_set_updated_at before update on product_variants
  for each row execute function set_updated_at();

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  status publish_status not null default 'active',
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table product_categories (
  product_id uuid not null references products (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  primary key (product_id, category_id)
);

create table health_goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  summary text,
  educational_content jsonb,
  disclaimer text,
  reviewer_id uuid,                        -- FK added after experts table
  reviewed_at timestamptz,
  status health_goal_status not null default 'coming_soon',
  icon text,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table product_health_goals (
  product_id uuid not null references products (id) on delete cascade,
  health_goal_id uuid not null references health_goals (id) on delete cascade,
  relevance_summary text,                  -- documented reason (spec §21.4)
  approved_by uuid,
  approved_at timestamptz,
  display_order integer not null default 0,
  primary key (product_id, health_goal_id)
);

create table ingredients (
  id uuid primary key default gen_random_uuid(),
  common_name text not null,
  regional_name text,
  description text,
  image text,
  allergen_flag boolean not null default false
);

create table product_ingredients (
  product_id uuid not null references products (id) on delete cascade,
  ingredient_id uuid not null references ingredients (id) on delete cascade,
  percentage numeric,
  label_order integer not null default 0,
  display_name_override text,
  notes text,
  primary key (product_id, ingredient_id)
);

create table nutrition_facts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products (id) on delete cascade,
  variant_id uuid references product_variants (id) on delete cascade,
  serving_size_value numeric,
  serving_size_unit text,
  servings_per_pack numeric,
  energy_kcal_100g numeric,
  energy_kcal_serving numeric,
  protein_g_100g numeric,
  protein_g_serving numeric,
  carbohydrate_g_100g numeric,
  carbohydrate_g_serving numeric,
  total_sugars_g_100g numeric,
  added_sugars_g_100g numeric,
  dietary_fibre_g_100g numeric,
  dietary_fibre_g_serving numeric,
  fat_g_100g numeric,
  saturated_fat_g_100g numeric,
  trans_fat_g_100g numeric,
  sodium_mg_100g numeric,
  lab_name text,
  report_date date,
  report_document_path text,
  status nutrition_status not null default 'estimated',
  created_at timestamptz not null default now(),
  check (product_id is not null or variant_id is not null)
);
create index nutrition_facts_product_idx on nutrition_facts (product_id);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0003_sourcing_inventory.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0003 — Sourcing, batches, inventory, pricing, discounts (spec §37, §38)
-- ============================================================================

create table sourcing_regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  state text,
  country text default 'India',
  description text,
  latitude numeric,                        -- approximate only
  longitude numeric,
  image text,
  status publish_status not null default 'active',
  created_at timestamptz not null default now()
);

create table experts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  qualification text,
  registration_details text,
  bio text,
  photo text,
  areas_of_review text[],
  status publish_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- Now that experts exists, wire the health_goals reviewer FK
alter table health_goals
  add constraint health_goals_reviewer_fk
  foreign key (reviewer_id) references experts (id) on delete set null;

create table farmer_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  region_id uuid references sourcing_regions (id) on delete set null,
  story text,
  consent_status boolean not null default false,
  image text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table product_sources (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  region_id uuid references sourcing_regions (id) on delete set null,
  farmer_id uuid references farmer_profiles (id) on delete set null,
  crop_variety text,
  source_type text,
  valid_from date,
  valid_to date
);

create table product_batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text not null unique,
  variant_id uuid not null references product_variants (id) on delete cascade,
  packed_at date,
  milled_at date,
  best_before_at date,
  quantity_received integer,
  quantity_available integer,
  source_region_id uuid references sourcing_regions (id) on delete set null,
  lab_report_path text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table inventory (
  variant_id uuid primary key references product_variants (id) on delete cascade,
  available_quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  low_stock_threshold integer not null default 5,
  updated_at timestamptz not null default now()
);
create trigger inventory_set_updated_at before update on inventory
  for each row execute function set_updated_at();

create table price_history (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references product_variants (id) on delete cascade,
  mrp_paise integer not null,
  selling_price_paise integer not null,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  reason text
);

create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null,             -- 'percent' | 'fixed'
  value numeric not null,
  minimum_order_paise integer,
  maximum_discount_paise integer,
  usage_limit integer,
  per_customer_limit integer,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table discount_redemptions (
  id uuid primary key default gen_random_uuid(),
  discount_code_id uuid not null references discount_codes (id) on delete cascade,
  customer_id uuid,
  order_id uuid,
  amount_paise integer not null,
  created_at timestamptz not null default now()
);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0004_customers_cart_orders.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0005_content_leads.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0005 — Content, recipes, articles, enquiries, newsletter, audit (spec §40, §46.4)
-- ============================================================================

create table content_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text not null,
  slug text not null unique,
  body jsonb,
  seo_title text,
  seo_description text,
  status content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  body jsonb,
  author_id uuid references profiles (id) on delete set null,
  reviewer_id uuid references experts (id) on delete set null,
  reviewed_at timestamptz,
  next_review_at timestamptz,
  references_json jsonb,
  health_goal_tags text[],
  status content_status not null default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index articles_status_idx on articles (status);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  prep_time_minutes integer,
  cook_time_minutes integer,
  servings integer,
  ingredients jsonb,
  instructions jsonb,
  nutrition_estimate jsonb,
  allergen_text text,
  author_id uuid references profiles (id) on delete set null,
  reviewer_id uuid references experts (id) on delete set null,
  meal_occasion text,
  status content_status not null default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index recipes_status_idx on recipes (status);

create table recipe_products (
  recipe_id uuid not null references recipes (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  primary key (recipe_id, product_id)
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type enquiry_type not null default 'general',
  name text not null,
  organisation text,
  email text not null,
  phone text,
  city text,
  message text,
  metadata jsonb,
  status enquiry_status not null default 'new',
  assigned_to uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index enquiries_status_idx on enquiries (status);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  consent_timestamp timestamptz not null default now(),
  source text,
  status text not null default 'subscribed'
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  previous_values jsonb,
  new_values jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);

-- ── Full-text search vector over products (spec §45) ────────────────────────
alter table products add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(short_description, '')), 'B')
  ) stored;
create index products_search_idx on products using gin (search_vector);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0006_rls_policies.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0006 — Row Level Security (spec §42 policy matrix)
-- Defence-in-depth: RLS is enabled even though routes are also protected.
-- The service-role key bypasses RLS and is used only in trusted server modules.
-- ============================================================================

-- Enable RLS on all exposed tables
alter table products enable row level security;
alter table product_variants enable row level security;
alter table categories enable row level security;
alter table product_categories enable row level security;
alter table health_goals enable row level security;
alter table product_health_goals enable row level security;
alter table ingredients enable row level security;
alter table product_ingredients enable row level security;
alter table nutrition_facts enable row level security;
alter table sourcing_regions enable row level security;
alter table experts enable row level security;
alter table farmer_profiles enable row level security;
alter table product_sources enable row level security;
alter table product_batches enable row level security;
alter table inventory enable row level security;
alter table price_history enable row level security;
alter table discount_codes enable row level security;
alter table discount_redemptions enable row level security;
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table delivery_zones enable row level security;
alter table delivery_pincodes enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table payment_webhook_events enable row level security;
alter table content_pages enable row level security;
alter table articles enable row level security;
alter table recipes enable row level security;
alter table recipe_products enable row level security;
alter table enquiries enable row level security;
alter table newsletter_subscribers enable row level security;
alter table audit_logs enable row level security;

-- ── Public catalogue: anyone reads ACTIVE/published; staff manage all ────────
create policy "public read active products" on products
  for select using (status = 'active' or is_staff());
create policy "staff manage products" on products
  for all using (is_staff()) with check (is_staff());

create policy "public read variants" on product_variants
  for select using (
    active or is_staff()
  );
create policy "staff manage variants" on product_variants
  for all using (is_staff()) with check (is_staff());

-- Generic public-read tables (catalogue support data)
create policy "public read categories" on categories for select using (status = 'active' or is_staff());
create policy "staff write categories" on categories for all using (is_staff()) with check (is_staff());

create policy "public read product_categories" on product_categories for select using (true);
create policy "staff write product_categories" on product_categories for all using (is_staff()) with check (is_staff());

create policy "public read health_goals" on health_goals
  for select using (status in ('published', 'coming_soon') or is_staff());
create policy "staff write health_goals" on health_goals for all using (is_staff()) with check (is_staff());

create policy "public read product_health_goals" on product_health_goals for select using (true);
create policy "staff write product_health_goals" on product_health_goals for all using (is_staff()) with check (is_staff());

create policy "public read ingredients" on ingredients for select using (true);
create policy "staff write ingredients" on ingredients for all using (is_staff()) with check (is_staff());

create policy "public read product_ingredients" on product_ingredients for select using (true);
create policy "staff write product_ingredients" on product_ingredients for all using (is_staff()) with check (is_staff());

-- Nutrition: public sees only APPROVED; staff see all (spec §42)
create policy "public read approved nutrition" on nutrition_facts
  for select using (status = 'approved' or is_staff());
create policy "staff write nutrition" on nutrition_facts for all using (is_staff()) with check (is_staff());

create policy "public read regions" on sourcing_regions for select using (status = 'active' or is_staff());
create policy "staff write regions" on sourcing_regions for all using (is_staff()) with check (is_staff());

create policy "public read experts" on experts for select using (status = 'active' or is_staff());
create policy "staff write experts" on experts for all using (is_staff()) with check (is_staff());

create policy "public read public farmers" on farmer_profiles for select using ((is_public and consent_status) or is_staff());
create policy "staff write farmers" on farmer_profiles for all using (is_staff()) with check (is_staff());

create policy "public read product_sources" on product_sources for select using (true);
create policy "staff write product_sources" on product_sources for all using (is_staff()) with check (is_staff());

-- Batches & inventory: staff only for write; inventory readable (stock display)
create policy "staff read batches" on product_batches for select using (is_staff());
create policy "staff write batches" on product_batches for all using (is_staff()) with check (is_staff());

create policy "public read inventory" on inventory for select using (true);
create policy "staff write inventory" on inventory for all using (is_staff()) with check (is_staff());

create policy "staff read price_history" on price_history for select using (is_staff());
create policy "staff write price_history" on price_history for all using (is_staff()) with check (is_staff());

create policy "staff read discounts" on discount_codes for select using (is_staff());
create policy "staff write discounts" on discount_codes for all using (is_staff()) with check (is_staff());

create policy "staff read redemptions" on discount_redemptions for select using (is_staff());
create policy "staff write redemptions" on discount_redemptions for all using (is_staff()) with check (is_staff());

-- ── Profiles: own row read/write; staff full ────────────────────────────────
create policy "read own profile" on profiles
  for select using (id = auth.uid() or is_staff());
create policy "update own profile" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "staff manage profiles" on profiles
  for all using (is_admin()) with check (is_admin());

-- ── Addresses: own only ─────────────────────────────────────────────────────
create policy "own addresses" on addresses
  for all using (user_id = auth.uid() or is_staff()) with check (user_id = auth.uid() or is_staff());

-- ── Delivery data: public read, staff write ─────────────────────────────────
create policy "public read zones" on delivery_zones for select using (active or is_staff());
create policy "staff write zones" on delivery_zones for all using (is_staff()) with check (is_staff());
create policy "public read pincodes" on delivery_pincodes for select using (active or is_staff());
create policy "staff write pincodes" on delivery_pincodes for all using (is_staff()) with check (is_staff());

-- ── Carts & cart_items: own (logged-in) or staff. Guest carts handled server-side
--    via the service-role client (bypasses RLS), so no anon policy is needed. ──
create policy "own cart" on carts
  for all using (user_id = auth.uid() or is_staff()) with check (user_id = auth.uid() or is_staff());
create policy "own cart items" on cart_items
  for all using (
    exists (select 1 from carts c where c.id = cart_id and (c.user_id = auth.uid() or is_staff()))
  ) with check (
    exists (select 1 from carts c where c.id = cart_id and (c.user_id = auth.uid() or is_staff()))
  );

-- ── Orders: own read; staff full. Public order lookup is via service-role +
--    unguessable token in a route handler, not via anon RLS. ─────────────────
create policy "read own orders" on orders
  for select using (user_id = auth.uid() or is_staff());
create policy "staff manage orders" on orders
  for all using (is_staff()) with check (is_staff());

create policy "read own order items" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_staff()))
  );
create policy "staff manage order items" on order_items
  for all using (is_staff()) with check (is_staff());

-- ── Payments: staff only (server verifies via service role) ──────────────────
create policy "staff read payments" on payments for select using (is_staff());
create policy "staff write payments" on payments for all using (is_staff()) with check (is_staff());
create policy "staff read webhooks" on payment_webhook_events for select using (is_admin());

-- ── Content: public reads published; staff manage ───────────────────────────
create policy "public read content_pages" on content_pages
  for select using (status = 'published' or is_staff());
create policy "staff write content_pages" on content_pages for all using (is_staff()) with check (is_staff());

create policy "public read articles" on articles
  for select using (status = 'published' or is_staff());
create policy "staff write articles" on articles for all using (is_staff()) with check (is_staff());

create policy "public read recipes" on recipes
  for select using (status = 'published' or is_staff());
create policy "staff write recipes" on recipes for all using (is_staff()) with check (is_staff());

create policy "public read recipe_products" on recipe_products for select using (true);
create policy "staff write recipe_products" on recipe_products for all using (is_staff()) with check (is_staff());

-- ── Enquiries: anyone can insert; staff read/manage ─────────────────────────
create policy "anyone insert enquiry" on enquiries for insert with check (true);
create policy "staff read enquiries" on enquiries for select using (is_staff());
create policy "staff update enquiries" on enquiries for update using (is_staff()) with check (is_staff());

-- ── Newsletter: anyone can subscribe; staff read ────────────────────────────
create policy "anyone subscribe" on newsletter_subscribers for insert with check (true);
create policy "staff read subscribers" on newsletter_subscribers for select using (is_staff());

-- ── Audit logs: admin read only; writes via service role ────────────────────
create policy "admin read audit" on audit_logs for select using (is_admin());


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0007_order_number_fn.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0007 — Atomic public order number generator: FO-YYYY-NNNN
-- ============================================================================

create or replace function next_order_number()
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  n bigint;
begin
  n := nextval('order_number_seq');
  return 'FO-' || to_char(now(), 'YYYY') || '-' || lpad(n::text, 4, '0');
end;
$$;

revoke all on function next_order_number() from public;
grant execute on function next_order_number() to service_role;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  seed.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- Seed data — Fresh Origins launch catalogue (illustrative; replace with final)
-- Prices in paise. Nutrition status kept 'estimated' until lab-validated.
-- ============================================================================

-- ── Categories ──────────────────────────────────────────────────────────────
insert into categories (id, name, slug, description, status, sort_order) values
  ('11111111-0000-0000-0000-000000000001', 'Millets', 'millets', 'Whole grains, flours and blends.', 'active', 1),
  ('11111111-0000-0000-0000-000000000002', 'Traditional Rice', 'traditional-rice', 'Red, black, brown and regional varieties.', 'active', 2),
  ('11111111-0000-0000-0000-000000000003', 'Ready-to-Cook Mixes', 'ready-to-cook-mixes', 'Khichdi, adai, kanji and roti mixes.', 'active', 3);

-- ── Health goals (launch with strong pages first, spec §21.5) ───────────────
insert into health_goals (id, name, slug, summary, status, icon, sort_order) values
  ('22222222-0000-0000-0000-000000000001', 'Protein & Fibre', 'protein-and-fibre', 'Everyday products designed around pulses, whole grains, and fibre-rich ingredients.', 'published', 'protein-fibre', 1),
  ('22222222-0000-0000-0000-000000000002', 'Gut Health', 'gut-health', 'Comforting, fibre-forward formats for a digestive-wellness routine.', 'published', 'gut-health', 2),
  ('22222222-0000-0000-0000-000000000003', 'Blood-Sugar-Conscious Eating', 'blood-sugar-conscious-eating', 'Whole-grain meal options for blood-sugar-conscious meal planning.', 'published', 'blood-sugar', 3),
  ('22222222-0000-0000-0000-000000000004', 'Senior Nutrition', 'senior-nutrition', 'Simple, nourishing, easy-to-prepare meal formats for everyday use.', 'published', 'senior', 4);

-- ── Sourcing region + expert (placeholders until onboarded) ─────────────────
insert into sourcing_regions (id, name, slug, state, description, status) values
  ('33333333-0000-0000-0000-000000000001', 'Karnataka Drylands', 'karnataka-drylands', 'Karnataka', 'Rainfed millet cultivation across dryland farms.', 'active');

insert into experts (id, name, slug, qualification, bio, areas_of_review, status) values
  ('44444444-0000-0000-0000-000000000001', '[Registered Dietitian name]', 'reviewer-rd', 'RD', 'Reviews educational content for nutritional accuracy. Profile shown after formal onboarding.', array['Protein & Fibre','Gut Health','Senior Nutrition'], 'draft');

-- ── Products ────────────────────────────────────────────────────────────────
insert into products
  (id, name, slug, short_description, product_type, status, featured,
   is_wheat_free, is_gluten_free, is_vegan, no_added_sugar, no_maida,
   preparation_time_minutes, storage_instructions, allergen_information,
   suitability_text, seo_title, seo_description, published_at)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Metabolic Balance Khichdi', 'metabolic-balance-khichdi',
   'Millet and moong blend for an easy, fibre-forward meal.', 'mix', 'active', true,
   true, false, true, true, true, 18,
   'Store in a cool, dry place away from direct sunlight. Reseal after opening.',
   'Contains pulses. Manufactured in a facility that also handles cereals containing gluten and tree nuts.',
   'May suit families seeking higher-fibre staples and protein-conscious vegetarians.',
   'Metabolic Balance Khichdi – Millet & Moong Blend',
   'Shop Metabolic Balance Khichdi, made with millets and moong dal. View nutrition, preparation, storage, allergens, and delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'Protein & Fibre Adai Mix', 'protein-and-fibre-adai-mix',
   'Multi-grain savoury pancake mix with millets, pulses, and flaxseed.', 'mix', 'active', true,
   true, false, true, true, true, 20,
   'Store in a cool, dry place. Reseal after opening.',
   'Contains pulses and flaxseed. Manufactured in a facility that also handles gluten and tree nuts.',
   'May suit protein-conscious vegetarians and families wanting savoury breakfasts.',
   'Protein & Fibre Adai Mix – Millet & Pulse Pancake Mix',
   'Shop Protein & Fibre Adai Mix with millets, pulses and flaxseed. Nutrition, preparation, allergens, and delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Heritage Gut-Fibre Kanji Mix', 'heritage-gut-fibre-kanji-mix',
   'Red rice, black rice, millets, and green gram in a comforting porridge blend.', 'mix', 'active', true,
   true, false, true, true, true, 30,
   'Store in a cool, dry place. Reseal after opening.',
   'Contains pulses. Manufactured in a facility that also handles gluten and tree nuts.',
   'May suit people seeking comforting, fibre-forward meals and senior-friendly formats.',
   'Heritage Gut-Fibre Kanji Mix – Five-Grain Porridge Blend',
   'Shop Heritage Gut-Fibre Kanji Mix with red rice, black rice, millets and green gram. Nutrition, preparation, allergens, delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'Gluten-Free Protein & Fibre Roti Mix', 'gluten-free-protein-and-fibre-roti-mix',
   'Wheat-free millet, rice, and pulse flour blend for everyday flatbreads.', 'mix', 'active', true,
   true, true, true, true, true, 15,
   'Store in a cool, dry place. Reseal after opening.',
   'Contains pulses. Gluten-free claim subject to validated cross-contamination control and final testing.',
   'May suit people choosing wheat-free or gluten-free flatbread options.',
   'Gluten-Free Protein & Fibre Roti Mix – Millet & Pulse Flour',
   'Shop Gluten-Free Protein & Fibre Roti Mix. Wheat-free millet, rice and pulse flour blend. Nutrition, allergens, delivery in Bangalore and Hosur.',
   now()),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'Traditional Rice — Variety Pack', 'traditional-rice-variety-pack',
   'Red, black, and brown regional rice with origin and cooking ratio details.', 'rice', 'active', false,
   true, false, true, true, true, null,
   'Store in a cool, dry, airtight container.',
   'May contain traces from shared facility equipment.',
   'May suit households exploring traditional whole-grain rice varieties.',
   'Traditional Rice Variety Pack – Red, Black & Brown Rice',
   'Shop a Traditional Rice variety pack with red, black and brown rice. Origin, cooking ratios, and delivery in Bangalore and Hosur.',
   now());

-- product ↔ category
insert into product_categories (product_id, category_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003'),
  ('aaaaaaaa-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002');

-- product ↔ health goal (documented relevance, spec §21.4)
insert into product_health_goals (product_id, health_goal_id, relevance_summary, display_order) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Millet and moong dal in a one-pot meal with fibre and plant protein per serving.', 1),
  ('aaaaaaaa-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003', 'Whole-grain millet base for blood-sugar-conscious meal planning.', 2),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'Combines millets and pulses in one savoury batter — a direct grain-plus-pulse pairing.', 1),
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', 'Comforting, fibre-forward porridge that fits a digestive-wellness routine.', 1),
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', 'Soft, easy-to-prepare format suited to senior meal routines.', 2),
  ('aaaaaaaa-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'Millet, rice and pulse flours combined for a fibre-forward everyday flatbread.', 1);

-- ── Variants + inventory ────────────────────────────────────────────────────
insert into product_variants (id, product_id, sku, title, weight_value, weight_unit, mrp_paise, selling_price_paise, sort_order) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'MBK-500', '500 g', 500, 'g', 27500, 24500, 1),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'PFA-400', '400 g', 400, 'g', 22000, 22000, 1),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', 'HGK-450', '450 g', 450, 'g', 26000, 26000, 1),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000004', 'GRM-500', '500 g', 500, 'g', 28500, 28500, 1),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000005', 'TRV-1000', '1 kg', 1000, 'g', 19000, 19000, 1);

insert into inventory (variant_id, available_quantity, reserved_quantity, low_stock_threshold) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 48, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000002', 32, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000003', 6, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000004', 40, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000005', 25, 0, 10);

-- ── Nutrition (estimated; not shown publicly until 'approved') ───────────────
insert into nutrition_facts
  (product_id, serving_size_value, serving_size_unit, servings_per_pack,
   energy_kcal_100g, energy_kcal_serving, protein_g_100g, protein_g_serving,
   carbohydrate_g_100g, total_sugars_g_100g, dietary_fibre_g_100g, dietary_fibre_g_serving,
   fat_g_100g, sodium_mg_100g, status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 60, 'g', 8,
   358, 215, 13.6, 8.2, 62.0, 1.1, 9.4, 5.6, 3.2, 12, 'estimated');

-- ── Ingredients + composition (Metabolic Balance Khichdi) ───────────────────
insert into ingredients (id, common_name, allergen_flag) values
  ('cccccccc-0000-0000-0000-000000000001', 'Foxtail millet', false),
  ('cccccccc-0000-0000-0000-000000000002', 'Barnyard millet', false),
  ('cccccccc-0000-0000-0000-000000000003', 'Split moong dal', true),
  ('cccccccc-0000-0000-0000-000000000004', 'Spices (curry leaves, cumin, turmeric, rock salt)', false);

insert into product_ingredients (product_id, ingredient_id, percentage, label_order) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', 35, 1),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000002', 25, 2),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000003', 30, 3),
  ('aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000004', 10, 4);

-- ── Delivery zones + pincodes (Bangalore & Hosur) ───────────────────────────
insert into delivery_zones (id, name, city, delivery_charge_paise, free_delivery_threshold_paise, min_days, max_days, active) values
  ('dddddddd-0000-0000-0000-000000000001', 'Bangalore Central', 'Bangalore', 4900, 59900, 2, 3, true),
  ('dddddddd-0000-0000-0000-000000000002', 'Hosur', 'Hosur', 5900, 59900, 3, 4, true);

insert into delivery_pincodes (pincode, zone_id, active) values
  ('560001', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560038', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560066', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560078', 'dddddddd-0000-0000-0000-000000000001', true),
  ('560102', 'dddddddd-0000-0000-0000-000000000001', true),
  ('635109', 'dddddddd-0000-0000-0000-000000000002', true),
  ('635126', 'dddddddd-0000-0000-0000-000000000002', true);

-- ── Recipe + article (published examples) ───────────────────────────────────
insert into recipes (id, title, slug, summary, prep_time_minutes, cook_time_minutes, servings, meal_occasion, status, published_at,
  ingredients, instructions, nutrition_estimate, allergen_text)
values
  ('eeeeeeee-0000-0000-0000-000000000001', 'Vegetable Millet Khichdi Bowl', 'vegetable-millet-khichdi-bowl',
   'A comforting one-pot bowl made with Metabolic Balance Khichdi and everyday vegetables.', 10, 18, 3, 'Lunch', 'published', now(),
   '[{"item":"Metabolic Balance Khichdi mix","qty":"1 cup"},{"item":"Water","qty":"3 cups"},{"item":"Mixed vegetables","qty":"1 cup"},{"item":"Ghee or oil","qty":"1 tbsp"}]'::jsonb,
   '["Rinse the mix until water runs clear.","Heat ghee, add cumin and ginger.","Add vegetables and saute.","Add mix, water and salt.","Pressure cook 3-4 whistles.","Rest 5 minutes and serve."]'::jsonb,
   '{"energy_kcal":260,"protein_g":9,"fibre_g":6,"fat_g":6}'::jsonb,
   'Contains pulses; may contain gluten and tree nuts depending on garnish.');

insert into recipe_products (recipe_id, product_id) values
  ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001');

insert into articles (id, title, slug, summary, status, published_at, reviewer_id, reviewed_at, health_goal_tags,
  body, references_json)
values
  ('ffffffff-0000-0000-0000-000000000001', 'How to transition from white rice to millets', 'white-rice-to-millets',
   'A practical, expert-reviewed guide to gradually introducing millets alongside white rice.', 'published', now(),
   '44444444-0000-0000-0000-000000000001', now(), array['Millets','Whole grains','Blood-sugar-conscious'],
   '[{"h2":"Start with dishes you already make"},{"p":"Begin with one familiar dish and swap part of the rice for millets."}]'::jsonb,
   '[{"label":"Whole grains and dietary fibre guidance","note":"placeholder"}]'::jsonb);

-- ── Sample enquiry + newsletter (for admin views) ───────────────────────────
insert into enquiries (enquiry_type, name, organisation, email, city, message, status) values
  ('retail', 'Sample Retailer', 'Green Grocer', 'retailer@example.com', 'Bangalore', 'Interested in stocking ready-to-cook mixes.', 'new'),
  ('distributor', 'Sample Distributor', 'South Foods', 'dist@example.com', 'Hosur', 'Territory enquiry for Hosur.', 'new');


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0008_cart_recovery_analytics.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
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

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  migrations/0009_rich_product_data.sql  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- ============================================================================
-- 0009 — Rich product detail data (from Fresh Origins Product Portfolio)
--   * Enriches products.description with structured JSON the PDP renders
--   * Adds the new "Protein & Fibre Chapati Atta" product
--   * Refreshes ingredient composition (with functional roles) + nutrition
--   * Adds 250g/500g/1kg variants + inventory per the portfolio pack plan
--
-- All nutrition is status 'estimated' (prototype-stage; spec + portfolio note).
-- Idempotent: safe to re-run (deletes child rows it owns before reinserting).
-- ============================================================================

-- ── New product: Protein & Fibre Chapati Atta ───────────────────────────────
insert into products
  (id, name, slug, short_description, product_type, status, featured,
   is_wheat_free, is_gluten_free, is_vegan, no_added_sugar, no_maida,
   preparation_time_minutes, storage_instructions, allergen_information,
   suitability_text, seo_title, seo_description, published_at)
values
  ('aaaaaaaa-0000-0000-0000-000000000006', 'Protein & Fibre Chapati Atta',
   'protein-and-fibre-chapati-atta',
   'Whole wheat, traditional millets and roasted pulses for soft everyday chapatis.',
   'mix', 'active', false,
   false, false, true, true, true, 20,
   'Store in a cool, dry place away from sunlight, heat and moisture. Reseal tightly after every use. A high-barrier pack is recommended as millet and flaxseed fats can oxidise.',
   'Contains wheat and gluten. Not suitable for people with coeliac disease or those requiring a gluten-free diet. May contain traces from shared facility equipment.',
   E'Families seeking more nutritious chapatis\nFitness-focused consumers\nVegetarians\nWeight-conscious adults\nThose wanting familiar wheat chapatis with added millets and pulses',
   'Protein & Fibre Chapati Atta – Whole Wheat, Millets & Roasted Pulses',
   'Shop Protein & Fibre Chapati Atta — whole wheat with millets, roasted pulses and flax for softer, higher-fibre everyday chapatis. Delivery in Bangalore and Hosur.',
   now())
on conflict (slug) do nothing;

-- Map chapati atta to category + health goals
insert into product_categories (product_id, category_id)
select 'aaaaaaaa-0000-0000-0000-000000000006', id from categories where slug = 'ready-to-cook-mixes'
on conflict do nothing;

insert into product_health_goals (product_id, health_goal_id, relevance_summary, display_order)
select 'aaaaaaaa-0000-0000-0000-000000000006', id,
  'Whole wheat combined with millets and roasted pulses raises the protein and fibre of a familiar everyday chapati.', 1
from health_goals where slug = 'protein-and-fibre'
on conflict do nothing;

-- Variants for chapati atta (500 g / 1 kg) + inventory
insert into product_variants (id, product_id, sku, title, weight_value, weight_unit, mrp_paise, selling_price_paise, sort_order)
values
  ('bbbbbbbb-0000-0000-0000-000000000061', 'aaaaaaaa-0000-0000-0000-000000000006', 'PFC-500', '500 g', 500, 'g', 18500, 17500, 1),
  ('bbbbbbbb-0000-0000-0000-000000000062', 'aaaaaaaa-0000-0000-0000-000000000006', 'PFC-1000', '1 kg', 1000, 'g', 34000, 31500, 2)
on conflict (sku) do nothing;

insert into inventory (variant_id, available_quantity, reserved_quantity, low_stock_threshold)
values
  ('bbbbbbbb-0000-0000-0000-000000000061', 30, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000062', 18, 0, 10)
on conflict (variant_id) do nothing;

-- Add 250 g / 1 kg variants to the original launch products (portfolio pack plan)
insert into product_variants (id, product_id, sku, title, weight_value, weight_unit, mrp_paise, selling_price_paise, sort_order)
values
  -- Metabolic Balance Khichdi: 250 g + 1 kg (500 g already seeded)
  ('bbbbbbbb-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'MBK-250', '250 g', 250, 'g', 14500, 13500, 0),
  ('bbbbbbbb-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 'MBK-1000', '1 kg', 1000, 'g', 49000, 44000, 2),
  -- Adai Mix: 250 g (500 g style already seeded as 400 g)
  ('bbbbbbbb-0000-0000-0000-000000000021', 'aaaaaaaa-0000-0000-0000-000000000002', 'PFA-250', '250 g', 250, 'g', 14000, 14000, 0),
  -- Kanji Mix: 250 g
  ('bbbbbbbb-0000-0000-0000-000000000031', 'aaaaaaaa-0000-0000-0000-000000000003', 'HGK-250', '250 g', 250, 'g', 15500, 15500, 0),
  -- Roti Mix: 1 kg
  ('bbbbbbbb-0000-0000-0000-000000000041', 'aaaaaaaa-0000-0000-0000-000000000004', 'GRM-1000', '1 kg', 1000, 'g', 54000, 50000, 2)
on conflict (sku) do nothing;

insert into inventory (variant_id, available_quantity, reserved_quantity, low_stock_threshold)
values
  ('bbbbbbbb-0000-0000-0000-000000000011', 30, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000012', 20, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000021', 25, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000031', 20, 0, 10),
  ('bbbbbbbb-0000-0000-0000-000000000041', 15, 0, 10)
on conflict (variant_id) do nothing;

-- ── Structured PDP content (products.description JSON) ───────────────────────
-- Shape consumed by the product detail page:
-- { positioning, why, benefits[], cooking[{title, steps[]}], cookingNotes[],
--   fopClaims[], faq[{q,a}] }

update products set description = $json$
{
  "positioning": "A balanced everyday khichdi blend made with three millets and moong dal for families seeking a higher-fibre alternative to conventional white-rice khichdi.",
  "why": "Made with barnyard, foxtail and little millets plus split moong dal, this khichdi is a practical, fibre-forward one-pot meal — a better grain choice that keeps the familiar khichdi experience intact.",
  "benefits": [
    "Made with three traditional millets",
    "Plant protein from moong dal",
    "Higher fibre than ordinary rice khichdi",
    "No added sugar",
    "Convenient one-pot meal",
    "Works with vegetables and greens",
    "Familiar Indian meal format"
  ],
  "cooking": [
    {"title": "Pressure-cooker method", "steps": [
      "Add 60 g of the khichdi mix to the pressure cooker.",
      "Add about 180–210 ml water (more for a softer consistency).",
      "Add salt to taste; optionally add vegetables, spinach, coriander or a teaspoon of ghee.",
      "Pressure-cook for about 3 whistles.",
      "Let the pressure release naturally, stir and rest 3–5 minutes.",
      "Serve with curd, vegetables, pickle or a protein side."
    ]},
    {"title": "Open-pot method", "steps": [
      "Add one measure of mix to about three measures of water.",
      "Bring to a boil, cover and simmer on low for 15–18 minutes.",
      "Stir occasionally, adding hot water if needed, until grains and dal are soft."
    ]}
  ],
  "cookingNotes": [
    "For seniors, use more water and cook to a softer consistency.",
    "Vegetables add volume, flavour and make the meal more complete."
  ],
  "fopClaims": ["Three-Millet & Moong Khichdi", "High Fibre*", "Source of Plant Protein*", "No Added Sugar", "Ready-to-Cook"],
  "faq": [
    {"q": "Is this a diabetic product?", "a": "No. It is a higher-fibre, blood-sugar-conscious everyday khichdi made with whole millets and moong dal. It is a food, not a treatment for any condition."},
    {"q": "How much protein and fibre per serving?", "a": "Approximately 8.1 g protein and 6.5 g fibre per 60 g serving, based on indicative prototype values pending lab validation."},
    {"q": "Can I add vegetables?", "a": "Yes — vegetables, spinach and greens work well and make the meal more complete."}
  ]
}
$json$::jsonb
where slug = 'metabolic-balance-khichdi';

update products set description = $json$
{
  "positioning": "A wholesome savoury breakfast and dinner mix combining millets, traditional red rice, pulses and flaxseed for protein, fibre and fullness.",
  "why": "Five grains, two pulses and flaxseed in one batter — a plant-protein-rich, higher-fibre alternative to refined-flour breakfasts, in the familiar form of adai and chilla.",
  "benefits": [
    "Five grains, two pulses and flaxseed",
    "Plant-protein-rich breakfast format",
    "Higher fibre than refined-flour breakfasts",
    "No maida",
    "For adai, chilla and savoury pancakes",
    "Customise with vegetables",
    "Familiar, convenient Indian format"
  ],
  "cooking": [
    {"title": "Standard adai", "steps": [
      "Add 60 g of mix to a bowl.",
      "Add about 90–110 ml water gradually into a thick, pourable batter (optionally a tablespoon or two of curd).",
      "Rest the batter for 15–20 minutes.",
      "Add chopped onion, coriander, carrot, spinach or green chilli if you like; salt to taste.",
      "Heat and lightly grease a tawa; pour and spread into a thick adai.",
      "Cook on medium until the edges firm up, then flip and cook through.",
      "Serve hot with chutney, curd or sambar."
    ]},
    {"title": "Softer pancake", "steps": [
      "Use slightly more water and optional curd; keep the batter medium-thick.",
      "Cook smaller pancakes on medium-low heat, covering briefly on the first side."
    ]}
  ],
  "cookingNotes": [
    "The mix is coarsely milled, not a fine flour — batter hydration varies a little with flaxseed.",
    "For a higher-protein meal, serve with curd, paneer, eggs or a dal-based chutney."
  ],
  "fopClaims": ["Protein & Fibre Millet Adai", "Five Grains, Two Pulses & Flaxseed", "High Fibre*", "Source of Plant Protein*", "No Maida", "Ready-to-Cook"],
  "faq": [
    {"q": "What can I make with it?", "a": "Adai, chilla and savoury vegetable pancakes. It customises well with chopped vegetables."},
    {"q": "Does it contain maida?", "a": "No. It is made from millets, pulses, red rice and flaxseed — no refined flour."},
    {"q": "Is it a weight-loss product?", "a": "No. It is a protein- and fibre-forward food that can fit a balanced, satiety-focused diet — not a weight-loss treatment."}
  ]
}
$json$::jsonb
where slug = 'protein-and-fibre-adai-mix';

update products set description = $json$
{
  "positioning": "A comforting porridge blend of traditional red rice, black rice, millets, green gram and flaxseed for everyday fibre and grain diversity — sweet or savoury.",
  "why": "Heritage red and black rice with kodo and little millets and green gram make a soft, fibre-rich kanji that suits everyday breakfasts and senior-friendly meals.",
  "benefits": [
    "Traditional red rice and black rice",
    "Millet and pulse combination",
    "High-fibre positioning*",
    "Sweet or savoury preparation",
    "Soft format suited to seniors",
    "No maida, no added sugar in the base"
  ],
  "cooking": [
    {"title": "Savoury kanji", "steps": [
      "Add 60 g of mix to a pan or pressure cooker with about 300–360 ml water and salt to taste.",
      "Pressure-cook for ~3 whistles, or simmer covered for 20–25 minutes.",
      "Stir, adding hot water for a thinner consistency; cool slightly.",
      "Add curd or buttermilk after slight cooling if desired; garnish with coriander or roasted cumin."
    ]},
    {"title": "Breakfast porridge", "steps": [
      "Cook 60 g with ~300 ml water until soft.",
      "Add milk or plant-based milk after the grains are cooked; stir until smooth.",
      "Top with nuts, seeds or fresh fruit; sweeten lightly only if needed."
    ]},
    {"title": "Senior-friendly soft porridge", "steps": [
      "Use about 360–420 ml water for 60 g and pressure-cook until very soft.",
      "Mash or blend lightly if required; adjust seasoning to dietary needs."
    ]}
  ],
  "cookingNotes": [
    "Black rice may slightly darken the finished porridge.",
    "Cooking time varies with rice variety and milling size."
  ],
  "fopClaims": ["Heritage High-Fibre Kanji*", "Red Rice, Black Rice & Millets", "Five-Grain Blend", "No Added Sugar", "Sweet or Savoury", "Ready-to-Cook"],
  "faq": [
    {"q": "Sweet or savoury?", "a": "Both. Cook savoury with seasoning and curd, or as a breakfast porridge with milk and fruit."},
    {"q": "Is it suitable for elders?", "a": "Yes — cook with more water to a soft consistency. It is a gentle, fibre-rich porridge format."},
    {"q": "Does it heal the gut?", "a": "No. It is a fibre-rich traditional porridge, not a treatment for any digestive condition."}
  ]
}
$json$::jsonb
where slug = 'heritage-gut-fibre-kanji-mix';

update products set description = $json$
{
  "positioning": "A wheat-free roti mix of jowar, bajra, traditional red rice, protein-rich pulses, tapioca, psyllium and flaxseed for practical everyday gluten-free flatbreads.",
  "why": "Single-millet rotis are notoriously hard to roll. This blend combines millets, rice, pulses and natural binders so wheat-free, gluten-free* flatbreads roll and cook more easily.",
  "benefits": [
    "Wheat-free formulation",
    "Gluten-free positioning*",
    "Millet and pulse based",
    "High-fibre potential*",
    "Source of plant protein*",
    "No maida, no added sugar",
    "Rolls more easily than ordinary single-millet rotis"
  ],
  "cooking": [
    {"title": "Standard gluten-free roti", "steps": [
      "Add 120 g of roti mix to a heat-safe bowl.",
      "Heat about 135–150 ml water until hot, then add gradually while mixing with a spoon (optionally a teaspoon of oil).",
      "Cool until safe to handle, then knead gently into a smooth dough; rest 10–15 minutes.",
      "Divide into four; dust lightly with rice flour and roll gently (repair edge cracks with damp fingers).",
      "Cook on a properly heated tawa, turning when the first side firms up.",
      "Press gently with a cloth to encourage partial puffing; serve immediately or keep insulated."
    ]},
    {"title": "Soft-wrap variation", "steps": [
      "Use slightly more water and roll a little thicker.",
      "Cook on medium heat, brush lightly with oil, then stack and cover immediately."
    ]}
  ],
  "cookingNotes": [
    "Hot water is important for hydration and binding.",
    "Rice flour is for dusting only; the roti may partially puff (it will not puff like wheat)."
  ],
  "fopClaims": ["Millets, Traditional Rice & Pulses", "Wheat-Free", "Gluten-Free*", "High Fibre*", "Source of Plant Protein*", "No Maida", "Ready-to-Cook"],
  "faq": [
    {"q": "Why hot water?", "a": "Hot water hydrates the psyllium and starches so the dough binds and rolls without cracking. Knead once it is cool enough to handle."},
    {"q": "Is it truly gluten-free?", "a": "The recipe is wheat-free. A gluten-free claim depends on compliant sourcing, controlled processing and final testing — we mark the claim with an asterisk until that is in place."},
    {"q": "Will it puff like wheat roti?", "a": "It may partially puff. It is designed to roll and cook well, not to mimic wheat-gluten puffing."}
  ]
}
$json$::jsonb
where slug = 'gluten-free-protein-and-fibre-roti-mix';

update products set description = $json$
{
  "positioning": "A soft, familiar everyday chapati flour of whole wheat, pulses, millets, flaxseed and psyllium — more protein and fibre without a brittle dough.",
  "why": "Most multigrain attas trade softness for nutrition. This blend keeps a whole-wheat base for easy rolling and puffing while roasted pulses and millets raise protein and fibre.",
  "benefits": [
    "Familiar wheat-chapati experience",
    "Millets and pulses in an everyday staple",
    "Higher protein and fibre than refined flour",
    "No maida",
    "For chapati, phulka, paratha and thepla",
    "Rolls softer than a fully gluten-free mix"
  ],
  "cooking": [
    {"title": "Standard chapati", "steps": [
      "Add 180 g of atta to a bowl.",
      "Add about 120–135 ml lukewarm water gradually and knead for 5–6 minutes.",
      "Cover and rest the dough for 15–20 minutes, then divide into six.",
      "Roll using minimal dry flour and cook on a hot tawa.",
      "Turn when bubbles appear; finish over direct flame if desired.",
      "Store cooked chapatis in an insulated container to retain softness."
    ]}
  ],
  "cookingNotes": [
    "This blend absorbs more water than ordinary atta — add water gradually; the dough should be soft, not sticky.",
    "Too much dry flour while rolling can make the chapati drier."
  ],
  "fopClaims": ["Whole Wheat, Millets & Roasted Pulses", "High Fibre*", "Source of Plant Protein*", "No Maida", "Soft Everyday Multigrain Chapatis"],
  "faq": [
    {"q": "Does it contain gluten?", "a": "Yes. It contains wheat and gluten and is not suitable for coeliac disease or a gluten-free diet. For a wheat-free option, see our Gluten-Free Roti Mix."},
    {"q": "Will the chapatis stay soft?", "a": "Yes — flax and psyllium help retain moisture. Knead a soft dough, rest it, and store cooked chapatis insulated."},
    {"q": "What can I make?", "a": "Chapati, phulka, paratha and thepla."}
  ]
}
$json$::jsonb
where slug = 'protein-and-fibre-chapati-atta';

-- ── Ingredient composition with functional roles ────────────────────────────
-- Use display_name_override to carry the functional role for the PDP, and
-- percentage for the composition bar. Reset each product's rows first.

-- Shared ingredient rows (created if missing)
insert into ingredients (common_name, allergen_flag) values
  ('Barnyard millet', false), ('Foxtail millet', false), ('Little millet', false),
  ('Proso millet', false), ('Kodo millet', false), ('Pearl millet (bajra)', false),
  ('Finger millet (ragi)', false), ('Jowar (sorghum)', false),
  ('Split moong dal', true), ('Green gram', true), ('Black gram (urad)', true),
  ('Roasted Bengal gram', true), ('Sprouted green gram flour', true), ('Horse gram', true),
  ('Traditional red rice', false), ('Black rice', false),
  ('Flaxseed', false), ('Psyllium husk', false), ('Tapioca starch', false),
  ('Whole wheat atta', true), ('Fenugreek seeds', false),
  ('Spices & seasoning', false)
on conflict do nothing;

-- Helper: clear then insert composition for a product
-- Metabolic Balance Khichdi
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000001';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000001', id, p, o, role from (values
  ('Barnyard millet', 30::numeric, 1, 'Fibre-rich millet base'),
  ('Foxtail millet', 25, 2, 'Traditional grain, texture & fibre'),
  ('Little millet', 20, 3, 'Grain diversity & fibre'),
  ('Split moong dal', 20, 4, 'Plant protein, texture & satiety'),
  ('Fenugreek seeds', 2, 5, 'Traditional functional ingredient & flavour'),
  ('Spices & seasoning', 3, 6, 'Cumin, black pepper, turmeric & ginger')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Protein & Fibre Adai Mix
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000002';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000002', id, p, o, role from (values
  ('Proso millet', 25::numeric, 1, 'Millet base & protein contribution'),
  ('Foxtail millet', 20, 2, 'Fibre, texture & traditional grain value'),
  ('Kodo millet', 15, 3, 'Fibre & grain diversity'),
  ('Green gram', 15, 4, 'Plant protein & satiety'),
  ('Black gram (urad)', 10, 5, 'Protein, binding & adai texture'),
  ('Traditional red rice', 10, 6, 'Heritage positioning, colour & texture'),
  ('Flaxseed', 3, 7, 'Fibre, healthy fats & moisture retention'),
  ('Spices & seasoning', 2, 8, 'Cumin, chilli & curry-leaf powder')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Heritage Gut-Fibre Kanji Mix
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000003';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000003', id, p, o, role from (values
  ('Traditional red rice', 25::numeric, 1, 'Heritage grain base, colour & fibre'),
  ('Kodo millet', 20, 2, 'Fibre & grain diversity'),
  ('Little millet', 20, 3, 'Fibre & mild taste'),
  ('Black rice', 15, 4, 'Premium heritage positioning & colour'),
  ('Green gram', 15, 5, 'Plant protein & meal balance'),
  ('Flaxseed', 3, 6, 'Fibre, healthy fats & texture'),
  ('Spices & seasoning', 2, 7, 'Dry ginger, cumin & ajwain')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Gluten-Free Protein & Fibre Roti Mix
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000004';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000004', id, p, o, role from (values
  ('Jowar (sorghum)', 25::numeric, 1, 'Main millet base & mild flavour'),
  ('Roasted Bengal gram', 20, 2, 'Protein, fibre & flavour'),
  ('Pearl millet (bajra)', 15, 3, 'Fibre, minerals & traditional grain value'),
  ('Sprouted green gram flour', 15, 4, 'Plant protein & differentiation'),
  ('Traditional red rice', 12, 5, 'Dough handling & lighter texture'),
  ('Tapioca starch', 7, 6, 'Flexibility, softness & less cracking'),
  ('Psyllium husk', 4, 7, 'Binding, water retention & rolling support'),
  ('Flaxseed', 2, 8, 'Fibre, healthy fats & water retention')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- Protein & Fibre Chapati Atta
delete from product_ingredients where product_id = 'aaaaaaaa-0000-0000-0000-000000000006';
insert into product_ingredients (product_id, ingredient_id, percentage, label_order, display_name_override)
select 'aaaaaaaa-0000-0000-0000-000000000006', id, p, o, role from (values
  ('Whole wheat atta', 55::numeric, 1, 'Gluten structure, softness, rolling & puffing'),
  ('Roasted Bengal gram', 15, 2, 'Protein, fibre & roasted flavour'),
  ('Sprouted green gram flour', 10, 3, 'Plant protein & differentiation'),
  ('Pearl millet (bajra)', 8, 4, 'Fibre & traditional grain positioning'),
  ('Finger millet (ragi)', 5, 5, 'Fibre, colour & millet diversity'),
  ('Horse gram', 4, 6, 'Protein & traditional functional-food story'),
  ('Flaxseed', 2, 7, 'Fibre, healthy fats & moisture retention'),
  ('Psyllium husk', 1, 8, 'Water binding & softness support')
) v(nm, p, o, role) join ingredients i on i.common_name = v.nm;

-- ── Nutrition facts (indicative; per 100 g + per 60 g serving) ───────────────
delete from nutrition_facts where product_id in (
  'aaaaaaaa-0000-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000002',
  'aaaaaaaa-0000-0000-0000-000000000003','aaaaaaaa-0000-0000-0000-000000000004',
  'aaaaaaaa-0000-0000-0000-000000000006');

insert into nutrition_facts
  (product_id, serving_size_value, serving_size_unit, servings_per_pack,
   energy_kcal_100g, energy_kcal_serving, protein_g_100g, protein_g_serving,
   carbohydrate_g_100g, dietary_fibre_g_100g, dietary_fibre_g_serving,
   fat_g_100g, status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 60, 'g', 8, 326, 195, 13.5, 8.1, 63.5, 10.9, 6.5, 3.2, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 60, 'g', 6, 349, 209, 14.3, 8.6, 64.5, 9.3, 5.6, 3.6, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 60, 'g', 7, 354, 213, 10.7, 6.4, 68.1, 8.6, 5.2, 4.3, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 60, 'g', 8, 353, 212, 13.7, 8.2, 68.7, 12.2, 7.3, 4.2, 'estimated'),
  ('aaaaaaaa-0000-0000-0000-000000000006', 60, 'g', 8, 351, 211, 14.8, 8.9, 67.3, 11.6, 6.9, 3.6, 'estimated');



-- ============================================================


-- ============================================================
-- Migration 0010: product image URLs
-- ============================================================
-- 0010_product_images.sql
-- Adds a primary image URL to products and sets the four packshots that have
-- real photography. Images are hosted on ImageKit (full https URLs). The app's
-- resolver passes full URLs through unchanged, so any CDN works here.
-- Products without an image_url fall back to the brand SVG illustration, so this
-- is safe to run before/without every product having a photo.

alter table products
  add column if not exists image_url text;

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/kichdi-fresh-origins.png'
  where slug = 'metabolic-balance-khichdi';

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/adai-mix-fresh-origins.png'
  where slug = 'protein-and-fibre-adai-mix';

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/roti-mix-fresh-origins.png'
  where slug = 'gluten-free-protein-and-fibre-roti-mix';

update products set image_url = 'https://ik.imagekit.io/freshoriginsmart/Products/kanji-mix-fresh-origins.png'
  where slug = 'heritage-gut-fibre-kanji-mix';
