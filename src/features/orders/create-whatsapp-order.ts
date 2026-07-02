import "server-only";

import { randomBytes, createHash } from "crypto";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCart } from "@/features/cart/queries";
import { site } from "@/config/site";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp/order-message";
import type { WhatsAppOrderInput } from "@/lib/validation/schemas";

export interface CreatedWhatsAppOrder {
  publicOrderNumber: string;
  publicToken: string;
  publicOrderUrl: string;
  whatsappUrl: string;
  totalPaise: number;
}

/**
 * Creates a real server-side order record (status whatsapp_pending), an
 * unguessable public token, and the prefilled WhatsApp deep link (spec §26).
 * Prices/stock are re-read server-side; the browser total is never trusted.
 */
export async function createWhatsAppOrder(
  input: WhatsAppOrderInput,
): Promise<CreatedWhatsAppOrder> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error("Ordering is temporarily unavailable. Please try again.");
  }
  const admin = createAdminClient();
  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();

  const cart = await getCart();
  if (!cart.cartId || cart.lines.length === 0) {
    throw new Error("Your cart is empty.");
  }

  // Public identifiers
  const publicOrderNumber = await nextOrderNumber(admin);
  const publicToken = randomBytes(24).toString("hex");
  const publicTokenHash = createHash("sha256")
    .update(publicToken)
    .digest("hex");

  // Server-trusted totals (delivery confirmed later by admin in Phase 1)
  const subtotalPaise = cart.subtotalPaise;
  const totalPaise = subtotalPaise;

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      public_order_number: publicOrderNumber,
      public_token_hash: publicTokenHash,
      user_id: user?.id ?? null,
      source: "whatsapp",
      status: "whatsapp_pending",
      payment_status: "not_required",
      customer_name: input.name,
      customer_phone: input.phone,
      customer_email: input.email || null,
      shipping_address: input.addressLine
        ? { line: input.addressLine, pincode: input.pincode }
        : { pincode: input.pincode },
      pincode: input.pincode,
      subtotal_paise: subtotalPaise,
      total_paise: totalPaise,
      customer_note: input.note || null,
    })
    .select("id")
    .single();
  if (error) throw error;

  // Immutable order-item snapshots (spec §39 order_items)
  const items = cart.lines.map((l) => ({
    order_id: order.id,
    product_id: l.productId,
    variant_id: l.variantId,
    product_name: l.productName,
    variant_name: l.variantName,
    sku: l.sku,
    quantity: l.quantity,
    unit_price_paise: l.unitPricePaise,
    total_price_paise: l.unitPricePaise * l.quantity,
  }));
  const { error: itemsError } = await admin.from("order_items").insert(items);
  if (itemsError) throw itemsError;

  // Close the cart so it isn't reused (non-fatal if it fails)
  await admin
    .from("carts")
    .update({ status: "ordered" })
    .eq("id", cart.cartId);

  const publicOrderUrl = `${site.url}/order/${publicOrderNumber}?t=${publicToken}`;
  const message = buildWhatsAppMessage({
    publicOrderNumber,
    items: cart.lines.map((l) => ({
      quantity: l.quantity,
      product_name: l.productName,
      variant_name: l.variantName,
      unit_price_paise: l.unitPricePaise,
    })),
    cartTotalPaise: totalPaise,
    pincode: input.pincode,
    publicOrderUrl,
  });

  return {
    publicOrderNumber,
    publicToken,
    publicOrderUrl,
    whatsappUrl: buildWhatsAppUrl(message),
    totalPaise,
  };
}

async function nextOrderNumber(
  admin: ReturnType<typeof createAdminClient>,
): Promise<string> {
  const { data, error } = await admin.rpc("next_order_number");
  if (!error && typeof data === "string") return data;
  // Fallback if the RPC is unavailable
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FO-${year}-${rand}`;
}
