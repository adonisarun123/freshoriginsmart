import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  HealthGoal,
  ProductWithVariants,
} from "@/types/database";

const PRODUCT_SELECT =
  "*, product_variants(*)";

function sortVariants(p: ProductWithVariants): ProductWithVariants {
  p.product_variants = (p.product_variants ?? [])
    .filter((v) => v.active)
    .sort((a, b) => a.sort_order - b.sort_order);
  return p;
}

export async function getFeaturedProducts(limit = 4): Promise<ProductWithVariants[]> {
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
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("name");
  return (data ?? []).map(sortVariants);
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductWithVariants[]> {
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
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data ? sortVariants(data as ProductWithVariants) : null;
}

export async function getProductSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "active");
  return (data ?? []).map((r) => r.slug);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("sort_order");
  return data ?? [];
}

export async function getHealthGoals(): Promise<HealthGoal[]> {
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
