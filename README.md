# Fresh Origins — Next.js + Supabase storefront

Production scaffold for the Fresh Origins e-commerce site, built from the
Brand & Build Specification (v1.0). Stack: **Next.js 14 (App Router) + TypeScript
(strict) + Tailwind CSS + Supabase (Postgres, Auth, Storage, RLS)**.

Phase 1 commerce model: product discovery → cart → **WhatsApp-assisted order**
(real server-side order record) → admin confirmation. Razorpay online checkout is
architected but kept behind a feature flag for Phase 2.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    then fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#    SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_WHATSAPP_NUMBER

# 3. Set up the database (local Supabase CLI)
supabase start
supabase db reset        # applies migrations in supabase/migrations + seed.sql

# 4. Run the app
npm run dev              # http://localhost:3000
```

To use a hosted Supabase project instead of local, set the env vars to your
project's values and run `supabase db push` (or apply the SQL in
`supabase/migrations/` via the SQL editor), then `supabase/seed.sql`.

## Useful scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` strict type check |
| `npm run lint` | Next.js / ESLint |
| `npm run db:reset` | Reset local DB and re-apply migrations + seed |

## Project structure

```
src/
  app/                  App Router routes
    (storefront)/       Public storefront (home, shop, product, cart, content…)
    (account)/          Customer account (auth-gated)
    (admin)/            Admin dashboard (admin-role gated)
    api/                Route handlers (cart, pincode, whatsapp-order…)
    auth/callback/      Supabase auth callback
    sitemap.ts robots.ts manifest.ts
  components/           brand / layout / commerce / product / content / ui
  features/             cart, catalogue, orders (domain logic)
  lib/                  supabase clients, whatsapp, commerce, seo, validation
  config/               brand.ts, navigation.ts, site.ts
  types/                shared + database types
supabase/
  migrations/           SQL migrations (catalogue, orders, RLS…)
  seed.sql              5 launch products + categories + health goals + pincodes
```

## Health-content governance

This is a food-health brand, so claim discipline is enforced in code and content:
- Nutrition values carry a status (`estimated` / `tested` / `approved`); estimated
  values are never presented as final label facts.
- Regulated claims (high fibre, gluten-free, etc.) are boolean flags set only after
  validation; product cards show a **maximum of two** badges.
- A food/medical disclaimer renders on product and health-goal pages.

See the specification document for the full governance workflow.

> **Pre-launch dependencies:** final product data, pack/pricing, delivery pincode
> list, WhatsApp number, FSSAI/legal entity details, and approved vector logo.
