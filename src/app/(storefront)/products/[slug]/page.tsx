import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Placeholder } from "@/components/ui/Placeholder";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WhatsAppButton } from "@/components/commerce/WhatsAppButton";
import { formatINR, discountPercent } from "@/lib/commerce/format";
import { productBadges } from "@/lib/commerce/badges";
import {
  getProductBySlug,
  getProductSlugs,
} from "@/features/catalogue/queries";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seo_title ?? product.name,
    description:
      product.seo_description ??
      product.short_description ??
      `Shop ${product.name} from Fresh Origins.`,
  };
}

const thumbs = ["Front", "Back", "Ingredients", "Cooked dish", "Origin"];

const suitableFor = [
  "Families seeking higher-fibre staples",
  "People choosing whole-grain meal options",
  "Protein-conscious vegetarians",
  "Adults wanting ready-to-cook traditional grain meals",
];

const prepSteps = [
  "Rinse 1 cup of mix until water runs clear.",
  "Add 3 cups of water (or 1:3 ratio) and a pinch of salt.",
  "Pressure cook for 3–4 whistles, or simmer for 15–18 minutes until soft.",
  "Rest for 5 minutes, add ghee or a tempering if you like, and serve warm.",
];

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const badges = productBadges(product);
  const variants = product.product_variants ?? [];
  const primary = variants[0];
  const hasDiscount =
    primary && primary.selling_price_paise < primary.mrp_paise;
  const savePercent = primary
    ? discountPercent(primary.mrp_paise, primary.selling_price_paise)
    : 0;

  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />

      {/* Above the fold */}
      <div className="grid items-start gap-12 pt-6 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <Placeholder
            label={`Pack front — ${product.name}`}
            className="mb-3"
          />
          <div className="grid grid-cols-5 gap-2.5">
            {thumbs.map((thumb, i) => (
              <Placeholder
                key={thumb}
                label={thumb}
                className={`!text-[0.65rem] ${i === 0 ? "ring-2 ring-fo-green-900" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          <p className="fo-eyebrow mb-0">{product.product_type === "rice" ? "Traditional Rice" : product.product_type === "millet" ? "Millets" : "Ready-to-Cook Mixes"}</p>
          <h1 className="my-1.5 text-[clamp(1.8rem,3vw,2.4rem)]">{product.name}</h1>
          {product.short_description && (
            <p className="mb-4 text-[1.05rem] text-fo-muted">
              {product.short_description}
            </p>
          )}

          {badges.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b} className="fo-badge">
                  {b}
                </span>
              ))}
            </div>
          )}

          {primary && (
            <div className="mb-6 flex items-baseline gap-2.5">
              <span className="text-[1.8rem] font-bold tabular-nums text-fo-green-900">
                {formatINR(primary.selling_price_paise)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-[1rem] tabular-nums text-fo-muted line-through">
                    {formatINR(primary.mrp_paise)}
                  </span>
                  <span className="rounded-pill bg-[#e9f5ee] px-2.5 py-1 text-[0.8rem] font-bold text-fo-success">
                    Save {savePercent}%
                  </span>
                </>
              )}
            </div>
          )}

          {/* Variant pills */}
          {variants.length > 0 && (
            <>
              <span className="mb-2 block text-[0.8rem] font-bold uppercase tracking-[0.05em] text-fo-muted">
                Pack size
              </span>
              <div className="mb-6 flex flex-wrap gap-2.5">
                {variants.map((v, i) => (
                  <span
                    key={v.id}
                    className={`rounded-control border-[1.5px] px-4 py-2.5 text-[0.9rem] font-semibold ${
                      i === 0
                        ? "border-fo-green-900 bg-fo-sage-100"
                        : "border-fo-line bg-white"
                    }`}
                  >
                    {v.title}
                  </span>
                ))}
              </div>
            </>
          )}

          <p className="mb-6 flex items-center gap-2 text-[0.9rem] font-semibold text-fo-success">
            <span className="inline-block h-2 w-2 rounded-full bg-fo-success" />
            In stock — typically delivered in 2–3 days
          </p>

          {/* Primary action + WhatsApp */}
          {primary && (
            <div className="mb-3 flex gap-2.5">
              <AddToCartButton variantId={primary.id} />
            </div>
          )}
          <div className="mb-6">
            <WhatsAppButton />
          </div>

          {/* Pincode check note */}
          <div className="mb-6 rounded-card border border-fo-line bg-white p-4">
            <p className="mb-1 text-[0.9rem] font-bold">
              Check delivery availability
            </p>
            <p className="text-[0.85rem] text-fo-muted">
              Enter your pincode in the cart to confirm serviceability across
              Bangalore and Hosur. Free delivery over the threshold shown in your
              cart.
            </p>
          </div>

          <p className="flex flex-wrap gap-4 text-[0.85rem] text-fo-muted">
            <span>✓ Clearly listed ingredients</span>
            <span>✓ Region-of-origin transparency</span>
            <span>✓ Expert-reviewed content</span>
          </p>
        </div>
      </div>

      {/* Detail sections */}
      <div>
        {/* Why this exists */}
        <section className="border-t border-fo-line py-12">
          <h2 className="text-[1.6rem]">Why this product exists</h2>
          <p className="max-w-editorial text-fo-muted">
            Made with traditional millets and pulses, this product is designed as a
            practical option for families seeking higher-fibre staples — without
            cooking a separate meal for each person. It keeps the everyday meal
            recognisable while bringing more fibre and plant protein to the plate.
          </p>
        </section>

        {/* Ingredients note + How to prepare */}
        <section className="border-t border-fo-line py-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-[1.6rem]">Ingredients</h2>
              <p className="text-[0.92rem] text-fo-muted">
                Traditional millets, split pulses, and gentle spices. Clearly listed
                ingredients with key percentages.{" "}
                <strong className="text-fo-charcoal-900">
                  No maida. No added sugar.
                </strong>{" "}
                Full ingredient breakdown and percentages are shown on the pack.
              </p>
            </div>
            <div>
              <h2 className="text-[1.6rem]">How to prepare</h2>
              <ol className="grid gap-4">
                {prepSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-fo-green-900 font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[0.95rem]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Suitable for + Allergens & storage */}
        <section className="border-t border-fo-line py-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-[1.6rem]">May suit people looking for…</h2>
              <ul className="grid gap-2.5">
                {(product.suitability_text
                  ? product.suitability_text.split("\n").filter(Boolean)
                  : suitableFor
                ).map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="font-bold text-fo-green-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[1.6rem]">Allergens &amp; storage</h2>
              <div className="mb-4 rounded-control border border-[#efd9b8] border-l-4 border-l-fo-warning bg-[#fbf0e2] px-6 py-4">
                <h3 className="text-[1rem] text-fo-warning">
                  Allergen information
                </h3>
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

        {/* Disclaimer */}
        <section className="border-y border-fo-line py-12">
          <Disclaimer>{product.disclaimer_text ?? undefined}</Disclaimer>
        </section>
      </div>
    </div>
  );
}
