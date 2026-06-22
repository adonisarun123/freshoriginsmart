import Link from "next/link";
import { Placeholder } from "@/components/ui/Placeholder";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WhatsAppButton } from "@/components/commerce/WhatsAppButton";
import { formatINR, discountPercent } from "@/lib/commerce/format";
import { productBadges } from "@/lib/commerce/badges";
import type { ProductWithVariants } from "@/types/database";

export function ProductCard({ product }: { product: ProductWithVariants }) {
  const variant = product.product_variants?.[0];
  const badges = productBadges(product);
  const hasDiscount =
    variant && variant.selling_price_paise < variant.mrp_paise;

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card">
      <div className="relative">
        {badges.length > 0 && (
          <div className="absolute left-2.5 top-2.5 z-10 flex gap-1.5">
            {badges.map((b) => (
              <span key={b} className="fo-badge">
                {b}
              </span>
            ))}
          </div>
        )}
        <Link href={`/products/${product.slug}`}>
          <Placeholder label={product.name} className="!rounded-none" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col p-4 pb-6">
        <h3 className="mb-1 text-[1.05rem] font-semibold">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mb-3 text-[0.85rem] text-fo-muted">
          {product.short_description}
          {variant ? ` · ${variant.title}` : ""}
        </p>
        {variant && (
          <p className="mb-4 text-[1.05rem] font-bold text-fo-green-900">
            <span className="tabular-nums">
              {formatINR(variant.selling_price_paise)}
            </span>
            {hasDiscount && (
              <span className="ml-1.5 text-[0.85rem] font-medium text-fo-muted line-through">
                {formatINR(variant.mrp_paise)}
              </span>
            )}
          </p>
        )}
        <div className="mt-auto flex gap-2">
          {variant && <AddToCartButton variantId={variant.id} small />}
          <WhatsAppButton iconOnly small />
        </div>
      </div>
    </article>
  );
}
