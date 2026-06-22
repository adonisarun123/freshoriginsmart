import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import {
  getCategories,
  getHealthGoals,
  getProductSlugs,
} from "@/features/catalogue/queries";

/** Build an absolute URL from a path using site.url as the base. */
function url(path: string): string {
  const base = site.url.replace(/\/$/, "");
  return path === "/" ? `${base}/` : `${base}${path}`;
}

/** Static, always-indexable storefront routes. Excludes admin/account/cart/api/search. */
const STATIC_PATHS: string[] = [
  "/",
  "/shop",
  "/health-goals",
  "/about",
  "/our-sourcing",
  "/recipes",
  "/learn",
  "/experts",
  "/for-business",
  "/contact",
  "/subscriptions",
  // Policy pages
  "/privacy",
  "/terms",
  "/shipping-returns",
  "/disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [productSlugs, categories, healthGoals] = await Promise.all([
    getProductSlugs(),
    getCategories(),
    getHealthGoals(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: url(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: url(`/products/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: url(`/shop/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const healthGoalEntries: MetadataRoute.Sitemap = healthGoals.map((goal) => ({
    url: url(`/health-goals/${goal.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...productEntries,
    ...categoryEntries,
    ...healthGoalEntries,
  ];
}
