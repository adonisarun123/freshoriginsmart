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
