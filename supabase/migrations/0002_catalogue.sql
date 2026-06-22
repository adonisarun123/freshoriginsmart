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
