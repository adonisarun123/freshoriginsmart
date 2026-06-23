"use client";

import { useState, useTransition } from "react";
import { updateCartItem, removeCartItem } from "@/features/cart/actions";

/**
 * Interactive quantity stepper + remove control for a single cart line.
 * Optimistically reflects the new quantity while the server action runs,
 * then lets revalidatePath("/cart") refresh the authoritative totals.
 */
export function CartLineControls({
  itemId,
  quantity,
  productName,
}: {
  itemId: string;
  quantity: number;
  productName: string;
}) {
  const [qty, setQty] = useState(quantity);
  const [isPending, startTransition] = useTransition();

  function change(next: number) {
    const clamped = Math.max(1, Math.min(50, next));
    setQty(clamped);
    startTransition(async () => {
      await updateCartItem(itemId, clamped);
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(itemId);
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div
        role="group"
        aria-label={`Quantity for ${productName}`}
        className="inline-flex items-center overflow-hidden rounded-control border-[1.5px] border-fo-line"
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={isPending || qty <= 1}
          onClick={() => change(qty - 1)}
          className="grid h-11 w-11 place-items-center bg-white text-[1.1rem] text-fo-green-900 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-9 text-center text-[0.9rem] font-bold tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={isPending || qty >= 50}
          onClick={() => change(qty + 1)}
          className="grid h-11 w-11 place-items-center bg-white text-[1.1rem] text-fo-green-900 disabled:opacity-40"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={remove}
        disabled={isPending}
        className="text-[0.8rem] text-fo-muted underline hover:text-fo-error disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
