"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { WhatsAppButton } from "@/components/commerce/WhatsAppButton";
import { formatINR, discountPercent } from "@/lib/commerce/format";
import type { ProductVariant } from "@/types/database";

/**
 * Interactive buy box: real pack-size selection that drives the variant added
 * to cart and the displayed price. Also renders a sticky mobile buy bar so the
 * primary CTA stays reachable on long product pages (spec §19.9).
 */
export function ProductBuyBox({
  productName,
  variants,
}: {
  productName: string;
  variants: ProductVariant[];
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const selected =
    variants.find((v) => v.id === selectedId) ?? variants[0] ?? null;

  if (!selected) return null;

  const hasDiscount = selected.selling_price_paise < selected.mrp_paise;
  const savePercent = discountPercent(
    selected.mrp_paise,
    selected.selling_price_paise,
  );

  return (
    <>
      {/* Price */}
      <div className="mb-6 flex items-baseline gap-2.5">
        <span className="text-[1.8rem] font-bold tabular-nums text-fo-green-900">
          {formatINR(selected.selling_price_paise)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-[1rem] tabular-nums text-fo-muted line-through">
              {formatINR(selected.mrp_paise)}
            </span>
            <span className="rounded-pill bg-[#e3f1e8] px-2.5 py-1 text-[0.8rem] font-bold text-fo-success">
              Save {savePercent}%
            </span>
          </>
        )}
      </div>

      {/* Pack size — real radio group */}
      {variants.length > 1 && (
        <fieldset className="mb-6">
          <legend className="mb-2 block text-[0.8rem] font-bold uppercase tracking-[0.05em] text-fo-muted">
            Pack size
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const active = v.id === selectedId;
              return (
                <label
                  key={v.id}
                  className={`cursor-pointer rounded-control border-[1.5px] px-4 py-2.5 text-[0.9rem] font-semibold transition ${
                    active
                      ? "border-fo-green-900 bg-fo-sage-100 text-fo-green-900"
                      : "border-fo-line bg-white text-fo-charcoal-900 hover:border-fo-green-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="pack-size"
                    value={v.id}
                    checked={active}
                    onChange={() => setSelectedId(v.id)}
                    className="sr-only"
                  />
                  {v.title} · {formatINR(v.selling_price_paise)}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <p className="mb-6 flex items-center gap-2 text-[0.9rem] font-semibold text-fo-success">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full bg-fo-success"
        />
        In stock — typically delivered in 2–3 days
      </p>

      <div className="mb-3 flex gap-2.5">
        <AddToCartButton variantId={selected.id} />
      </div>
      <div className="mb-6">
        <WhatsAppButton />
      </div>

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] flex items-center gap-3 border-t border-fo-line bg-white p-3 shadow-[0_-4px_16px_rgba(31,42,34,0.08)] lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-[0.78rem] text-fo-muted">{productName}</p>
          <p className="text-[1.05rem] font-bold tabular-nums text-fo-green-900">
            {formatINR(selected.selling_price_paise)}
            <span className="ml-1 text-[0.75rem] font-normal text-fo-muted">
              {selected.title}
            </span>
          </p>
        </div>
        <div className="ml-auto flex flex-none items-center gap-2">
          <AddToCartButton variantId={selected.id} small />
          <WhatsAppButton iconOnly small />
        </div>
      </div>
    </>
  );
}
