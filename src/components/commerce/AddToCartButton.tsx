"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/features/cart/actions";
import { track } from "@/lib/analytics/track";

export function AddToCartButton({
  variantId,
  small = false,
}: {
  variantId: string;
  small?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    startTransition(async () => {
      await addToCart(variantId, 1);
      track("add_to_cart", { variantId });
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    });
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isPending}
      className={`fo-btn-primary flex-1 ${small ? "min-h-[38px] px-4 py-2.5 text-[0.85rem]" : ""}`}
      aria-live="polite"
    >
      {added ? "Added ✓" : isPending ? "Adding…" : "Add to Cart"}
    </button>
  );
}
