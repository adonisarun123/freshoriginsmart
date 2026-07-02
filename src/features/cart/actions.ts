"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  ensureCartToken,
  readCartToken,
  hashToken,
} from "@/features/cart/cart-token";
import { cartItemSchema, cartContactSchema } from "@/lib/validation/schemas";

/** Finds or creates the active cart for the current user/guest. */
async function resolveCartId(): Promise<string> {
  const admin = createAdminClient();
  const ssr = await createClient();
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

  const raw = await ensureCartToken();
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

  try {
    const admin = createAdminClient();
    const cartId = await resolveCartId();

    // Validate variant is active + priced server-side (never trust client).
    const { data: variant, error: variantErr } = await admin
      .from("product_variants")
      .select("id, active")
      .eq("id", parsed.data.variantId)
      .maybeSingle();
    if (variantErr) throw variantErr;
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
      const { error } = await admin
        .from("cart_items")
        .update({ quantity: existing.quantity + parsed.data.quantity })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from("cart_items").insert({
        cart_id: cartId,
        variant_id: parsed.data.variantId,
        quantity: parsed.data.quantity,
      });
      if (error) throw error;
    }

    revalidatePath("/cart");
    return { ok: true };
  } catch (err) {
    console.error("addToCart failed:", err);
    return {
      ok: false,
      error: "We couldn't add that to your cart. Please try again.",
    };
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
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
  } catch (err) {
    console.error("updateCartItem failed:", err);
    return { ok: false, error: "Could not update your cart. Please try again." };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    const admin = createAdminClient();
    await admin.from("cart_items").delete().eq("id", itemId);
    revalidatePath("/cart");
    return { ok: true };
  } catch (err) {
    console.error("removeCartItem failed:", err);
    return { ok: false, error: "Could not update your cart. Please try again." };
  }
}

/**
 * Saves an OPT-IN contact email (and optional name) onto the active cart so we
 * can follow up on abandoned carts. Only stored with explicit consent
 * (spec §52 / privacy). Does not create a cart if none exists.
 */
export async function saveCartContact(input: {
  email: string;
  name?: string;
  marketingConsent: boolean;
}) {
  const parsed = cartContactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a valid email." };

  try {
    const admin = createAdminClient();
    const ssr = await createClient();
    const {
      data: { user },
    } = await ssr.auth.getUser();

    let cartId: string | null = null;
    if (user) {
      const { data } = await admin
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      cartId = data?.id ?? null;
    } else {
      const token = await readCartToken();
      if (token) {
        const { data } = await admin
          .from("carts")
          .select("id")
          .eq("guest_token_hash", hashToken(token))
          .eq("status", "active")
          .maybeSingle();
        cartId = data?.id ?? null;
      }
    }
    if (!cartId) return { ok: false, error: "No active cart." };

    const { error } = await admin
      .from("carts")
      .update({
        contact_email: parsed.data.email,
        contact_name: parsed.data.name ?? null,
        marketing_consent: parsed.data.marketingConsent,
      })
      .eq("id", cartId);
    if (error) throw error;

    return { ok: true };
  } catch (err) {
    console.error("saveCartContact failed:", err);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

/** Merges a guest cart into the user's cart after login (spec §25.1).
 *  Best-effort: never throw — a merge failure must not break sign-in. */
export async function mergeGuestCart(userId: string) {
  try {
  const raw = await readCartToken();
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
  } catch (err) {
    console.error("mergeGuestCart failed:", err);
  }
}
