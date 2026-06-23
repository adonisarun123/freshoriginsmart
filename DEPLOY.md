# Deploying Fresh Origins (Vercel + Supabase)

This is the end-to-end checklist to take the app from repo → live site.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → New project. Choose a region close
   to your customers (e.g. Mumbai / `ap-south-1` for India).
2. Once created, open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-only secret)

## 2. Create the database schema + seed

Open **SQL Editor → New query**, paste the entire contents of
[`supabase/setup_all.sql`](./supabase/setup_all.sql), and **Run**. This creates all
tables, Row Level Security policies, the order-number function, and seed data
(5 launch products, categories, health goals, Bangalore/Hosur pincodes).

> Run this **once** on a fresh project. To re-run, reset the database first
> (Settings → Database → Reset) — the script uses `create table`, not
> `create table if not exists`.

## 3. Configure Vercel environment variables

In your Vercel project → **Settings → Environment Variables**, add (Production +
Preview):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<your-app>.vercel.app` (or your domain) |
| `NEXT_PUBLIC_SITE_NAME` | `Fresh Origins` |
| `NEXT_PUBLIC_SUPABASE_URL` | from step 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | from step 1 (keep secret) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | full intl format, no `+` — e.g. `9198XXXXXXXX` |
| `NEXT_PUBLIC_FEATURE_ONLINE_CHECKOUT` | `false` |

> The build succeeds even without these (queries degrade to empty), but the
> storefront only shows products once the Supabase vars are set **and** the
> schema/seed from step 2 is applied.

## 4. Deploy

Push to the connected GitHub branch (or click **Redeploy** in Vercel after adding
env vars). Vercel auto-detects Next.js — no build settings needed.

```bash
git add -A
git commit -m "Deploy Fresh Origins"
git push
```

## 5. Enable sign-in (Supabase Auth)

Customer accounts use email magic links. In Supabase → **Authentication → URL
Configuration**:

- **Site URL**: `https://<your-app>.vercel.app`
- **Redirect URLs**: add `https://<your-app>.vercel.app/auth/callback`

## 6. Make yourself an admin

1. Visit `/account` on the live site and sign in once (this creates your
   `profiles` row).
2. In Supabase SQL Editor, run:

   ```sql
   update profiles set role = 'admin'
   where email = 'you@example.com';
   ```

3. You can now reach `/admin`.

## 7. Smoke test

- Home shows featured products; `/shop` lists all; a product page loads.
- Add to cart → `/cart` → fill the WhatsApp form → it opens WhatsApp prefilled
  and creates an order record (visible in `/admin`).
- `/contact` and `/for-business` forms submit (check **Admin → Enquiries**).
- Newsletter footer form subscribes (check `newsletter_subscribers` in Supabase).

## Notes

- A harmless build warning — *"A Node.js API is used (process.version)… Edge
  Runtime"* from `@supabase/ssr` in middleware — does not fail the build. The
  Node middleware runtime that would silence it is only stable in Next.js 15.5+;
  this project is on 14.2.x.
- Pre-launch content still to finalise (not code): real product photos, final
  prices/pack sizes, validated nutrition + allergens, the full pincode list,
  FSSAI licence + legal entity for the footer/policy pages, and the production
  vector logo.
