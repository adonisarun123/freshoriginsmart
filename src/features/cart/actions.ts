"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  ensureCartToken,
  readCartToken,
  hashToken,
} from "@/features/cart/cart-token";
import { cartItemSchema } from "@/lib/validation/schemas";

/** Finds or creates the active cart for the current user/guest. */
async function resolveCartId(): Promise<string> {
  const admin = createAdminClient();
  const ssr = createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();

  if (user) {
    const { data: existing } = await admin
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (existing) return existing.id;
    const { data: created, error } = await admin
      .from("carts")
      .insert({ user_id: user.id, status: "active" })
      .select("id")
      .single();
    if (error) throw error;
    return created.id;
  }

  const raw = ensureCartToken();
  const tokenHash = hashToken(raw);
  const { data: existing } = await admin
    .from("carts")
    .select("id")
    .eq("guest_token_hash", tokenHash)
    .eq("status", "active")
    .maybeSingle();
  if (existing) return existing.id;
  const { data: created, error } = await admin
    .from("carts")
    .insert({ guest_token_hash: tokenHash, status: "active" })
    .select("id")
    .single();
  if (error) throw error;
  return created.id;
}

export async function addToCart(variantId: string, quantity = 1) {
  const parsed = cartItemSchema.safeParse({ variantId, quantity });
  if (!parsed.success) return { ok: false, error: "Invalid item" };

  const admin = createAdminClient();
  const cartId = await resolveCartId();

  // Validate variant is active + priced server-side (never trust client).
  const { data: variant } = await admin
    .from("product_variants")
    .select("id, active")
    .eq("id", parsed.data.variantId)
    .maybeSingle();
  if (!variant || !variant.active) {
    return { ok: false, error: "Item unavailable" };
  }

  const { data: existing } = await admin
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("variant_id", parsed.data.variantId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("cart_items")
      .update({ quantity: existing.quantity + parsed.data.quantity })
      .eq("id", existing.id);
  } else {
    await admin.from("cart_items").insert({
      cart_id: cartId,
      variant_id: parsed.data.variantId,
      quantity: parsed.data.quantity,
    });
  }

  revalidatePath("/cart");
  return { ok: true };
}

export async function updateCartItem(itemId: string, quantity: number) {
  const admin = createAdminClient();
  if (quantity <= 0) {
    await admin.from("cart_items").delete().eq("id", itemId);
  } else {
    await admin
      .from("cart_items")
      .update({ quantity: Math.min(quantity, 50) })
      .eq("id", itemId);
  }
  revalidatePath("/cart");
  return { ok: true };
}

export async function removeCartItem(itemId: string) {
  const admin = createAdminClient();
  await admin.from("cart_items").delete().eq("id", itemId);
  revalidatePath("/cart");
  return { ok: true };
}

/** Merges a guest cart into the user's cart after login (spec §25.1). */
export async function mergeGuestCart(userId: string) {
  const raw = readCartToken();
  if (!raw) return;
  const admin = createAdminClient();
  const tokenHash = hashToken(raw);

  const { data: guestCart } = await admin
    .from("carts")
    .select("id")
    .eq("guest_token_hash", tokenHash)
    .eq("status", "active")
    .maybeSingle();
  if (!guestCart) return;

  let { data: userCart } = await admin
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!userCart) {
    const { data } = await admin
      .from("carts")
      .insert({ user_id: userId, status: "active" })
      .select("id")
      .single();
    userCart = data;
  }
  if (!userCart) return;

  const { data: guestItems } = await admin
    .from("cart_items")
    .select("variant_id, quantity")
    .eq("cart_id", guestCart.id);

  for (const item of guestItems ?? []) {
    const { data: existing } = await admin
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", userCart.id)
      .eq("variant_id", item.variant_id)
      .maybeSingle();
    if (existing) {
      await admin
        .from("cart_items")
        .update({ quantity: existing.quantity + item.quantity })
        .eq("id", existing.id);
    } else {
      await admin.from("cart_items").insert({
        cart_id: userCart.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      });
    }
  }

  await admin.from("carts").update({ status: "merged" }).eq("id", guestCart.id);
}
