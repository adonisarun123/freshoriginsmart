"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/features/cart/actions";
import { track } from "@/lib/analytics/track";
import { showToast } from "@/components/ui/Toast";

export function AddToCartButton({
  variantId,
  small = false,
}: {
  variantId: string;
  small?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "added" | "error">("idle");

  function handleAdd() {
    startTransition(async () => {
      const res = await addToCart(variantId, 1);
      if (res?.ok) {
        track("add_to_cart", { variantId });
        setState("added");
        // Persistent confirmation + a path forward, and refresh the
        // server-rendered header cart badge without a full reload.
        showToast({
          message: "Added to your cart",
          actionLabel: "View cart →",
          actionHref: "/cart",
        });
        router.refresh();
        setTimeout(() => setState("idle"), 1800);
      } else {
        setState("error");
        showToast({
          message: "Couldn't add that to your cart. Please try again.",
        });
        setTimeout(() => setState("idle"), 3000);
      }
    });
  }

  const label =
    state === "added"
      ? "Added ✓"
      : state === "error"
        ? "Try again"
        : isPending
          ? "Adding…"
          : "Add to Cart";

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isPending}
      className={`fo-btn-primary flex-1 ${small ? "min-h-[38px] px-4 py-2.5 text-[0.85rem]" : ""}`}
      aria-live="polite"
    >
      {label}
    </button>
  );
}
