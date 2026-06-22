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
