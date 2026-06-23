# Fresh Origins — admin & content guide

How to run day-to-day operations. The `/admin` dashboard is read-focused for
now (orders, low stock, enquiries); product/content **editing** is done in the
Supabase Table Editor or SQL Editor until the admin write-UI is built. Both are
safe because Row Level Security protects the tables.

---

## Become an admin

Sign in once at `/account` (creates your profile), then in Supabase SQL Editor:

```sql
update profiles set role = 'admin' where email = 'you@example.com';
```

Roles: `customer`, `editor`, `nutrition_reviewer`, `operations`, `admin`.
`admin` and `operations` see all of `/admin`.

---

## Confirm a WhatsApp order (the core Phase-1 flow)

1. A customer places an order → it appears in **Admin → Dashboard → Orders
   awaiting confirmation** with status `whatsapp_pending`.
2. You receive their WhatsApp message (prefilled with the order number).
3. Confirm stock + delivery charge with the customer on WhatsApp.
4. Update the order in Supabase (Table Editor → `orders`): set `status` to
   `confirmed`, fill `shipping_paise`, recompute `total_paise`, set
   `confirmed_at`. Then progress through `packed → out_for_delivery →
   delivered` as you fulfil it.

The customer's order page (`/order/<number>?t=<token>`) and their account order
history reflect the status automatically.

---

## Add a new product

A product needs rows in several tables. Do it in the SQL Editor in one go.
Replace the values; keep claim discipline (only set `is_gluten_free`,
`is_high_*` flags after lab validation; nutrition stays `estimated` until
approved).

```sql
-- 1) The product
insert into products (id, name, slug, short_description, product_type, status,
  featured, is_wheat_free, is_gluten_free, is_vegan, no_added_sugar, no_maida,
  preparation_time_minutes, storage_instructions, allergen_information,
  suitability_text, seo_title, seo_description, published_at)
values (gen_random_uuid(), 'New Product Name', 'new-product-slug',
  'One-line descriptor for cards.', 'mix', 'active', false,
  true, false, true, true, true, 20,
  'Store in a cool, dry place. Reseal after opening.',
  'Contains pulses. Manufactured in a facility that also handles gluten.',
  'May suit people looking for higher-fibre staples.',
  'New Product Name – Descriptor', 'Shop New Product Name…', now());

-- 2) A variant (price in paise: ₹245 = 24500) + inventory
with p as (select id from products where slug = 'new-product-slug')
insert into product_variants (id, product_id, sku, title, weight_value,
  weight_unit, mrp_paise, selling_price_paise, sort_order)
select gen_random_uuid(), p.id, 'NPN-500', '500 g', 500, 'g', 27500, 24500, 1
from p;

insert into inventory (variant_id, available_quantity, low_stock_threshold)
select id, 40, 10 from product_variants where sku = 'NPN-500';

-- 3) Put it in a category (Millets / Traditional Rice / Ready-to-Cook Mixes)
insert into product_categories (product_id, category_id)
select p.id, c.id from products p, categories c
where p.slug = 'new-product-slug' and c.slug = 'ready-to-cook-mixes';

-- 4) (Optional) link to a health goal with a documented reason
insert into product_health_goals (product_id, health_goal_id, relevance_summary, display_order)
select p.id, h.id, 'Why this product fits this goal.', 1
from products p, health_goals h
where p.slug = 'new-product-slug' and h.slug = 'protein-and-fibre';
```

To make it show in the homepage "Featured" row, set `featured = true`.

### Quick edits

- **Change a price**: update `product_variants.selling_price_paise` /
  `mrp_paise` (paise). Optionally insert a `price_history` row for the audit
  trail.
- **Take a product offline**: set `products.status = 'archived'`.
- **Update stock**: edit `inventory.available_quantity`. When it drops to/below
  `low_stock_threshold` it appears in the admin low-stock widget and the card
  shows a low-stock state.

---

## Publish a recipe / article (Learn content)

Insert into `recipes` or `articles` with `status = 'published'` and set
`published_at = now()`. Health articles must carry a `reviewer_id` (an `experts`
row) and `reviewed_at` before publishing — this enforces the spec's
health-content governance. Public pages only show `published` content.

---

## Manage enquiries

B2B and contact submissions land in the `enquiries` table and **Admin →
Enquiries**. Update `status` (`new → assigned → in_progress → closed`) and set
`assigned_to` as you work them.

---

## Delivery serviceability

Add pincodes you deliver to in `delivery_pincodes` (linked to a row in
`delivery_zones` which holds the charge, free-delivery threshold, and ETA).
The pincode checker on product/cart pages reads these live.

---

## Safety reminders

- Never paste the **service_role** key anywhere client-side; it's only in Vercel
  server env.
- Don't display `estimated` nutrition as final label facts — keep the status on
  `nutrition_facts` accurate; the public PDP only treats `approved` rows as
  shown values.
- Keep to factual / validated claims; the product card shows a **maximum of two
  badges** by design.
