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
