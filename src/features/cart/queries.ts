import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { readCartToken, hashToken } from "@/features/cart/cart-token";

export interface CartLineView {
  itemId: string;
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string;
  unitPricePaise: number;
  mrpPaise: number;
  quantity: number;
  slug: string;
  imageUrl: string | null;
}

export interface CartView {
  cartId: string | null;
  lines: CartLineView[];
  subtotalPaise: number;
  itemCount: number;
}

const EMPTY: CartView = {
  cartId: null,
  lines: [],
  subtotalPaise: 0,
  itemCount: 0,
};

/**
 * Resolves the active cart for the current user (by auth id) or guest (by
 * hashed cookie token). Uses the service-role client so guest carts work
 * without an anon RLS policy (spec §25.1, §42).
 */
export async function getCart(): Promise<CartView> {
  if (!hasSupabaseAdminEnv()) return EMPTY;
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
    if (!token) return EMPTY;
    const { data } = await admin
      .from("carts")
      .select("id")
      .eq("guest_token_hash", hashToken(token))
      .eq("status", "active")
      .maybeSingle();
    cartId = data?.id ?? null;
  }

  if (!cartId) return EMPTY;

  const { data: items } = await admin
    .from("cart_items")
    .select(
      "id, quantity, variant_id, product_variants(id, sku, title, mrp_paise, selling_price_paise, products(id, name, slug, image_url))",
    )
    .eq("cart_id", cartId);

  const lines: CartLineView[] = (items ?? []).map((it) => {
    const v = it.product_variants as unknown as {
      id: string;
      sku: string;
      title: string;
      mrp_paise: number;
      selling_price_paise: number;
      products: {
        id: string;
        name: string;
        slug: string;
        image_url: string | null;
      };
    };
    return {
      itemId: it.id,
      variantId: it.variant_id,
      productId: v.products.id,
      productName: v.products.name,
      variantName: v.title,
      sku: v.sku,
      unitPricePaise: v.selling_price_paise,
      mrpPaise: v.mrp_paise,
      quantity: it.quantity,
      slug: v.products.slug,
      imageUrl: v.products.image_url,
    };
  });

  const subtotalPaise = lines.reduce(
    (s, l) => s + l.unitPricePaise * l.quantity,
    0,
  );
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  return { cartId, lines, subtotalPaise, itemCount };
}
