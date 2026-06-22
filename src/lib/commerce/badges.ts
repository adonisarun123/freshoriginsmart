import { brand } from "@/config/brand";
import type { Product } from "@/types/database";

/**
 * Derives the badges to show on a product card from FACTUAL flags only.
 * Enforces the spec's max-two-badge discipline (§18.7) and priority order:
 * gluten-free/wheat-free → validated nutrition → no added sugar.
 */
export function productBadges(product: Pick<
  Product,
  "is_gluten_free" | "is_wheat_free" | "no_added_sugar" | "no_maida" | "is_vegan"
>): string[] {
  const badges: string[] = [];
  if (product.is_gluten_free) badges.push("Gluten-Free");
  else if (product.is_wheat_free) badges.push("Wheat-Free");
  if (product.no_added_sugar) badges.push("No Added Sugar");
  else if (product.no_maida) badges.push("No Maida");
  else if (product.is_vegan) badges.push("Vegan");
  return badges.slice(0, brand.maxProductBadges);
}
