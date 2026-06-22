import "server-only";

import { site } from "@/config/site";

/**
 * JSON-LD (schema.org) builders for Fresh Origins.
 *
 * Each builder returns a plain `Record<string, unknown>` so the result can be
 * passed straight to the <JsonLd> component (see src/components/seo/JsonLd.tsx)
 * which serialises it into a <script type="application/ld+json"> tag.
 *
 * Money convention: prices are stored as integer paise. JSON-LD `price` is a
 * rupee string, so we convert paise → rupees (currency always "INR").
 */

const CURRENCY = "INR";

/** Convert integer paise into a JSON-LD-friendly rupee string, e.g. 28500 → "285.00". */
function paiseToRupeeString(paise: number): string {
  return (paise / 100).toFixed(2);
}

/** Build an absolute URL from a path, using site.url as the base. */
function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = site.url.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    areaServed: site.serviceCities,
    slogan: site.positioning,
    logo: absoluteUrl("/icon"),
  };
}

export interface ProductJsonLdInput {
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  pricePaise: number;
  inStock: boolean;
  brand?: string;
}

export function productJsonLd({
  name,
  slug,
  description,
  sku,
  pricePaise,
  inStock,
  brand = site.name,
}: ProductJsonLdInput): Record<string, unknown> {
  const url = absoluteUrl(`/products/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description ?? undefined,
    sku: sku ?? undefined,
    url,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: CURRENCY,
      price: paiseToRupeeString(pricePaise),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Path or absolute URL for this crumb. */
  url: string;
}

export function breadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export interface RecipeJsonLdInput {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  recipeYield?: string | null;
  ingredients?: string[];
  instructions?: string[];
  datePublished?: string | null;
  authorName?: string | null;
}

/** ISO-8601 duration for a number of minutes, e.g. 15 → "PT15M". */
function minutesToDuration(minutes?: number | null): string | undefined {
  if (minutes == null || minutes <= 0) return undefined;
  return `PT${Math.round(minutes)}M`;
}

export function recipeJsonLd({
  name,
  slug,
  description,
  image,
  prepTimeMinutes,
  cookTimeMinutes,
  recipeYield,
  ingredients,
  instructions,
  datePublished,
  authorName,
}: RecipeJsonLdInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name,
    url: absoluteUrl(`/recipes/${slug}`),
    description: description ?? undefined,
    image: image ? absoluteUrl(image) : undefined,
    prepTime: minutesToDuration(prepTimeMinutes),
    cookTime: minutesToDuration(cookTimeMinutes),
    recipeYield: recipeYield ?? undefined,
    recipeIngredient:
      ingredients && ingredients.length > 0 ? ingredients : undefined,
    recipeInstructions:
      instructions && instructions.length > 0
        ? instructions.map((step) => ({
            "@type": "HowToStep",
            text: step,
          }))
        : undefined,
    datePublished: datePublished ?? undefined,
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: site.name },
  };
}

export interface ArticleJsonLdInput {
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  /** Path segment the article lives under, e.g. "learn". Defaults to "learn". */
  section?: string;
}

export function articleJsonLd({
  title,
  slug,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  section = "learn",
}: ArticleJsonLdInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    url: absoluteUrl(`/${section}/${slug}`),
    description: description ?? undefined,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? datePublished ?? undefined,
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon") },
    },
  };
}
