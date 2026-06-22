import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free anon client for PUBLIC catalogue/content reads.
 *
 * Safe to call from anywhere — Server Components, Route Handlers, sitemap, and
 * (crucially) `generateStaticParams`, which runs at build time outside any
 * request scope where `cookies()` is unavailable. Uses the anon key, so RLS
 * still applies; it simply carries no user session (none is needed for public
 * data). For per-user reads (cart, account, orders) use the SSR `server` client.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
