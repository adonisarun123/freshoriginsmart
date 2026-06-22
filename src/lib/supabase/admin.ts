import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. BYPASSES RLS — use ONLY in trusted server
 * modules (route handlers, server actions) for operations that genuinely need
 * elevated access: guest-cart persistence, order creation, public-token order
 * lookup, webhook processing. Never import this into a Client Component.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
