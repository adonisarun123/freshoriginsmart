import {
  createPublicClient as createClient,
  hasSupabaseEnv,
} from "@/lib/supabase/public";
import type {
  Category,
  HealthGoal,
  ProductWithVariants,
  ProductDetail,
} from "@/types/database";

const PRODUCT_SELECT = "*, product_variants(*)";

function sortVariants(p: ProductWithVariants): ProductWithVariants {
  p.product_variants = (p.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order);
  return p;
}

export async function getFeaturedProducts(
  limit = 4,
): Promise<ProductWithVariants[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("featured", true)
    .limit(limit);
  return (data ?? []).map(sortVariants);
}

export async function getAllProducts(): Promise<ProductWithVariants[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("name");
  return (data ?? []).map(sortVariants);
}

export type ShopSort = "featured" | "newest" | "price-asc" | "price-desc";

export interface ShopFilters {
  category?: string; // category slug
  goal?: string; // health-goal slug
  diet?: string[]; // any of: wheat-free, gluten-free, no-maida, vegan
  inStock?: boolean;
  sort?: ShopSort;
}

/**
 * Server-side filtered + sorted product listing for the shop page.
 * Filters map to real data: category (join), health goal (join), dietary
 * boolean flags, and availability (inventory). Sort is applied in-memory on
 * the (small) result set so it can sort by the primary variant's price.
 */
export async function getShopProducts(
  filters: ShopFilters,
): Promise<ProductWithVariants[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();

  // Resolve the set of product IDs constrained by category and/or goal joins.
  let idConstraint: Set<string> | null = null;

  async function intersect(ids: string[]) {
    const set = new Set(ids);
    idConstraint =
      idConstraint === null
        ? set
        : new Set([...idConstraint].filter((id) => set.has(id)));
  }

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .maybeSingle();
    if (!cat) return [];
    const { data } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", cat.id);
    await intersect((data ?? []).map((r) => r.product_id as string));
  }

  if (filters.goal) {
    const { data: goal } = await supabase
      .from("health_goals")
      .select("id")
      .eq("slug", filters.goal)
      .maybeSingle();
    if (!goal) return [];
    const { data } = await supabase
      .from("product_health_goals")
      .select("product_id")
      .eq("health_goal_id", goal.id);
    await intersect((data ?? []).map((r) => r.product_id as string));
  }

  let query = supabase
    .from("products")
    .select(`${PRODUCT_SELECT}, inventory:product_variants(inventory(available_quantity))`)
    .eq("status", "active");

  if (idConstraint !== null) {
    const ids = [...(idConstraint as Set<string>)];
    if (ids.length === 0) return [];
    query = query.in("id", ids);
  }

  // Dietary boolean flags
  for (const d of filters.diet ?? []) {
    if (d === "wheat-free") query = query.eq("is_wheat_free", true);
    else if (d === "gluten-free") query = query.eq("is_gluten_free", true);
    else if (d === "no-maida") query = query.eq("no_maida", true);
    else if (d === "vegan") query = query.eq("is_vegan", true);
  }

  const { data } = await query;
  let products = (data ?? []).map((p) => sortVariants(p as ProductWithVariants));

  // Availability: keep products with at least one variant in stock.
  if (filters.inStock) {
    products = products.filter((p) => {
      const inv = (p as unknown as {
        inventory?: { inventory?: { available_quantity: number }[] }[];
      }).inventory;
      if (!inv) return true; // unknown stock → don't hide
      return inv.some((v) => (v.inventory ?? []).some((i) => i.available_quantity > 0));
    });
  }

  // Sort
  const priceOf = (p: ProductWithVariants) =>
    p.product_variants?.[0]?.selling_price_paise ?? Number.MAX_SAFE_INTEGER;
  switch (filters.sort) {
    case "price-asc":
      products.sort((a, b) => priceOf(a) - priceOf(b));
      break;
    case "price-desc":
      products.sort((a, b) => priceOf(b) - priceOf(a));
      break;
    case "newest":
      products.sort((a, b) =>
        (b.published_at ?? "").localeCompare(a.published_at ?? ""),
      );
      break;
    case "featured":
    default:
      products.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
      );
  }

  return products;
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductWithVariants[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!cat) return [];

  const { data } = await supabase
    .from("product_categories")
    .select("products(*, product_variants(*))")
    .eq("category_id", cat.id);

  return (data ?? [])
    .map((row) => row.products as unknown as ProductWithVariants)
    .filter((p) => p && p.status === "active")
    .map(sortVariants);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithVariants | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data ? sortVariants(data as ProductWithVariants) : null;
}

/** Full product detail incl. ingredient composition + nutrition for the PDP. */
export async function getProductDetail(
  slug: string,
): Promise<ProductDetail | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "*, product_variants(*), product_ingredients(percentage, label_order, display_name_override, ingredients(common_name, allergen_flag)), nutrition_facts(*)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (!data) return null;
  const detail = data as unknown as ProductDetail;
  detail.product_variants = (detail.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order);
  detail.product_ingredients = (detail.product_ingredients ?? []).sort(
    (a, b) => a.label_order - b.label_order,
  );
  return detail;
}

export async function getProductSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "active");
  return (data ?? []).map((r) => r.slug);
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("sort_order");
  return data ?? [];
}

export async function getHealthGoals(): Promise<HealthGoal[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("health_goals")
    .select("*")
    .in("status", ["published", "coming_soon"])
    .order("sort_order");
  return data ?? [];
}

export async function getHealthGoalBySlug(
  slug: string,
): Promise<HealthGoal | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  const { data } = await supabase
    .from("health_goals")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function getProductsForHealthGoal(
  healthGoalId: string,
): Promise<ProductWithVariants[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("product_health_goals")
    .select("products(*, product_variants(*))")
    .eq("health_goal_id", healthGoalId)
    .order("display_order");
  return (data ?? [])
    .map((row) => row.products as unknown as ProductWithVariants)
    .filter((p) => p && p.status === "active")
    .map(sortVariants);
}
