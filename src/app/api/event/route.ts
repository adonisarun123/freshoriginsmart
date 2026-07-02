import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED = new Set([
  "view_home",
  "view_category",
  "select_health_goal",
  "view_item_list",
  "select_item",
  "view_item",
  "add_to_cart",
  "remove_from_cart",
  "view_cart",
  "search",
  "check_serviceability",
  "begin_whatsapp_order",
  "whatsapp_order_created",
  "purchase",
  "submit_enquiry",
  "newsletter_signup",
  "view_recipe",
  "click_related_product",
]);

/**
 * POST /api/event — lightweight first-party behavioural events (spec §53).
 * Stores no raw PII: any session id is hashed. Fire-and-forget from the client.
 */
export async function POST(request: Request) {
  let body: {
    event?: string;
    productId?: string;
    variantId?: string;
    properties?: Record<string, unknown>;
    sessionId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.event || !ALLOWED.has(body.event)) {
    return NextResponse.json({ ok: false, error: "Unknown event" }, { status: 400 });
  }

  const admin = createAdminClient();
  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();

  await admin.from("analytics_events").insert({
    event_name: body.event,
    user_id: user?.id ?? null,
    session_token_hash: body.sessionId
      ? createHash("sha256").update(body.sessionId).digest("hex")
      : null,
    product_id: body.productId ?? null,
    variant_id: body.variantId ?? null,
    properties: body.properties ?? null,
  });

  return NextResponse.json({ ok: true });
}
