import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Accordion } from "@/components/content/Accordion";
import { ProductImage } from "@/components/commerce/ProductImage";
import { ProductCard } from "@/components/commerce/ProductCard";
import { PincodeCheck } from "@/features/cart/PincodeCheck";
import { TrackView } from "@/components/analytics/TrackView";
import { JsonLd } from "@/components/seo/JsonLd";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { productBadges } from "@/lib/commerce/badges";
import {
  getProductDetail,
  getProductSlugs,
  getFeaturedProducts,
} from "@/features/catalogue/queries";
import { ProductBuyBox } from "@/features/catalogue/ProductBuyBox";
import type { ProductContent } from "@/types/database";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await getProductDetail(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seo_title ?? product.name,
    description:
      product.seo_description ??
      product.short_description ??
      `Shop ${product.name} from Fresh Origins.`,
  };
}

// Composition bar colour ramp (brand greens → lime → earth)
const RAMP = [
  "var(--fo-green-900)",
  "var(--fo-green-600)",
  "var(--fo-lime-500)",
  "var(--fo-green-500)",
  "var(--fo-earth-700)",
  "#8a9a4f",
  "#3f7a4a",
  "#b0894f",
];

const categoryLabel = (t: string) =>
  t === "rice" ? "Traditional Rice" : t === "millet" ? "Millets" : "Ready-to-Cook Mixes";

const categorySlug = (t: string) =>
  t === "rice"
    ? "traditional-rice"
    : t === "millet"
      ? "millets"
      : "ready-to-cook-mixes";

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductDetail(params.slug);
  if (!product) notFound();

  // Cross-sell: a few other products from the range (exclude the current one).
  const related = (await getFeaturedProducts(4))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const content = (product.description ?? {}) as ProductContent;
  const badges = productBadges(product);
  const variants = product.product_variants ?? [];
  const primary = variants[0];

  const ingredients = product.product_ingredients ?? [];
  const nutrition = product.nutrition_facts?.[0] ?? null;
  const suitable = product.suitability_text
    ? product.suitability_text.split("\n").filter(Boolean)
    : [];

  return (
    <div className="fo-container">
      <TrackView
        event="view_item"
        productId={product.id}
        variantId={primary?.id}
        properties={{ name: product.name, slug: product.slug }}
      />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
            {
              name: categoryLabel(product.product_type),
              url: `/shop/${categorySlug(product.product_type)}`,
            },
            { name: product.name, url: `/products/${product.slug}` },
          ]),
          ...(primary
            ? [
                productJsonLd({
                  name: product.name,
                  slug: product.slug,
                  description: product.short_description ?? "",
                  sku: primary.sku,
                  pricePaise: primary.selling_price_paise,
                  inStock: true,
                }),
              ]
            : []),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          {
            label: categoryLabel(product.product_type),
            href: `/shop/${categorySlug(product.product_type)}`,
          },
          { label: product.name },
        ]}
      />

      {/* Above the fold */}
      <div className="grid items-start gap-12 pt-6 md:grid-cols-2">
        {/* Gallery */}
        <div className="md:sticky md:top-[90px]">
          <ProductImage
            product={product}
            priority
            sizes="(min-width: 768px) 520px, 90vw"
          />
        </div>

        {/* Buy box */}
        <div>
          <p className="fo-eyebrow mb-0">{categoryLabel(product.product_type)}</p>
          <h1 className="my-1.5 text-[clamp(1.8rem,3vw,2.4rem)]">
            {product.name}
          </h1>
          {product.short_description && (
            <p className="mb-4 text-[1.05rem] text-fo-muted">
              {product.short_description}
            </p>
          )}

          {content.bestFor && (
            <p className="mb-4 flex items-start gap-2 rounded-control border border-fo-line border-l-4 border-l-fo-green-600 bg-fo-sage-100 px-4 py-2.5 text-[0.95rem] text-fo-charcoal-900">
              <strong className="font-bold text-fo-green-900">Best for:</strong>
              <span>{content.bestFor}</span>
            </p>
          )}

          {badges.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b} className="fo-badge">
                  {b}
                </span>
              ))}
            </div>
          )}

          {variants.length > 0 && (
            <ProductBuyBox productName={product.name} variants={variants} />
          )}

          {/* Validated front-of-pack claims */}
          {content.fopClaims && content.fopClaims.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {content.fopClaims.map((c) => (
                <span
                  key={c}
                  className="rounded-pill border border-fo-line bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-fo-green-900"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Real interactive serviceability check (Bangalore & Hosur) */}
          <div className="mb-6">
            <PincodeCheck />
          </div>

          <p className="flex flex-wrap gap-4 text-[0.85rem] text-fo-muted">
            <span>✓ Clearly listed ingredients</span>
            <span>✓ Region-of-origin transparency</span>
            <span>✓ Expert-reviewed content</span>
          </p>
        </div>
      </div>

      {/* Why this exists */}
      <section className="border-t border-fo-line py-12">
        <h2 className="text-[1.6rem]">Why this product exists</h2>
        <p className="max-w-editorial text-fo-muted">
          {content.why ??
            "Made with traditional millets and pulses, designed as a practical, higher-fibre everyday staple that keeps the familiar meal recognisable."}
        </p>
      </section>

      {/* Benefits grid */}
      {content.benefits && content.benefits.length > 0 && (
        <section className="border-t border-fo-line py-12">
          <h2 className="mb-6 text-[1.6rem]">Why choose this</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.benefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-card border border-fo-line bg-white p-4"
              >
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-fo-sage-100 text-[0.8rem] font-bold text-fo-green-900">
                  ✓
                </span>
                <span className="text-[0.95rem]">{b}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ingredients (listed in descending order of quantity) */}
      {ingredients.length > 0 && (
        <section className="border-t border-fo-line py-12">
          <h2 className="text-[1.6rem]">What&apos;s inside</h2>
          <p className="mb-5 max-w-editorial text-fo-muted">
            Every ingredient and its role, listed in descending order of
            quantity. No maida.
          </p>
          <ul className="grid max-w-editorial gap-3 sm:grid-cols-2">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 h-3.5 w-3.5 flex-none rounded"
                  style={{ background: RAMP[i % RAMP.length] }}
                />
                <span className="text-[0.9rem]">
                  <strong className="text-fo-charcoal-900">
                    {ing.ingredients?.common_name}
                  </strong>
                  {ing.display_name_override && (
                    <span className="block text-fo-muted">
                      {ing.display_name_override}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Nutrition */}
      {nutrition && (
        <section className="border-t border-fo-line py-12">
          <h2 className="text-[1.6rem]">Nutrition</h2>
          <p className="mb-4 max-w-editorial text-[0.82rem] text-fo-muted">
            Indicative prototype values pending final lab validation.
            {nutrition.serving_size_value
              ? ` Serving size: ${nutrition.serving_size_value} ${nutrition.serving_size_unit ?? "g"}.`
              : ""}
            {nutrition.servings_per_pack
              ? ` ~${nutrition.servings_per_pack} servings per pack.`
              : ""}
          </p>
          <table className="w-full max-w-editorial border-collapse text-[0.92rem]">
            <thead>
              <tr>
                <th className="border-b border-fo-line bg-fo-sage-100 p-3 text-left font-bold text-fo-green-900">
                  Nutrient
                </th>
                <th className="border-b border-fo-line bg-fo-sage-100 p-3 text-right font-bold text-fo-green-900">
                  Per 100 g
                </th>
                <th className="border-b border-fo-line bg-fo-sage-100 p-3 text-right font-bold text-fo-green-900">
                  Per serving
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Energy", nutrition.energy_kcal_100g, nutrition.energy_kcal_serving, "kcal"],
                  ["Protein", nutrition.protein_g_100g, nutrition.protein_g_serving, "g"],
                  ["Carbohydrate", nutrition.carbohydrate_g_100g, null, "g"],
                  ["Dietary fibre", nutrition.dietary_fibre_g_100g, nutrition.dietary_fibre_g_serving, "g"],
                  ["Total fat", nutrition.fat_g_100g, null, "g"],
                ] as const
              ).map(([label, per100, perServ, unit]) => (
                <tr key={label}>
                  <th
                    scope="row"
                    className="border-b border-fo-line p-3 text-left font-bold"
                  >
                    {label}
                  </th>
                  <td className="border-b border-fo-line p-3 text-right tabular-nums">
                    {per100 != null ? `${per100} ${unit}` : "—"}
                  </td>
                  <td className="border-b border-fo-line p-3 text-right tabular-nums">
                    {perServ != null ? `${perServ} ${unit}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* How to prepare (accordion of methods) */}
      {content.cooking && content.cooking.length > 0 && (
        <section className="border-t border-fo-line py-12">
          <h2 className="mb-6 text-[1.6rem]">How to prepare</h2>
          <Accordion
            items={content.cooking.map((m) => ({
              title: m.title,
              body: (
                <ol className="grid gap-3">
                  {m.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-fo-green-900 text-[0.85rem] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-[0.95rem] text-fo-charcoal-900">
                        {s}
                      </span>
                    </li>
                  ))}
                </ol>
              ),
            }))}
          />
          {content.cookingNotes && content.cookingNotes.length > 0 && (
            <ul className="mt-5 grid max-w-editorial gap-2 text-[0.88rem] text-fo-muted">
              {content.cookingNotes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="text-fo-green-600">•</span>
                  {n}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Suitable for + Allergens & storage */}
      <section className="border-t border-fo-line py-12">
        <div className="grid gap-12 md:grid-cols-2">
          {suitable.length > 0 && (
            <div>
              <h2 className="text-[1.6rem]">May suit people looking for…</h2>
              <ul className="grid gap-2.5">
                {suitable.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="font-bold text-fo-green-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="text-[1.6rem]">Allergens &amp; storage</h2>
            <div className="mb-4 rounded-control border border-[#efd9b8] border-l-4 border-l-fo-warning bg-[#fbf0e2] px-6 py-4">
              <h3 className="text-[1rem] text-fo-warning">Allergen information</h3>
              <p className="text-[0.9rem]">
                {product.allergen_information ??
                  "Contains pulses. Manufactured in a facility that also handles cereals containing gluten and tree nuts."}
              </p>
            </div>
            <p className="text-[0.9rem] text-fo-muted">
              <strong className="text-fo-charcoal-900">Storage:</strong>{" "}
              {product.storage_instructions ??
                "Store in a cool, dry place away from direct sunlight. Reseal after opening."}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {content.faq && content.faq.length > 0 && (
        <section className="border-t border-fo-line py-12">
          <h2 className="mb-6 text-[1.6rem]">Product FAQs</h2>
          <Accordion
            items={content.faq.map((f) => ({
              title: f.q,
              body: <p className="m-0">{f.a}</p>,
            }))}
          />
        </section>
      )}

      {/* More from the range (cross-sell) */}
      {related.length > 0 && (
        <section className="border-t border-fo-line py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[1.6rem]">More from the range</h2>
            <Link
              href="/shop"
              className="text-[0.9rem] font-bold text-fo-accent underline underline-offset-2 hover:text-fo-green-900"
            >
              Shop all products →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="border-y border-fo-line py-12">
        <Disclaimer>{product.disclaimer_text ?? undefined}</Disclaimer>
      </section>
    </div>
  );
}
