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
