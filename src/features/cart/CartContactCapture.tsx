"use client";

import { useState } from "react";
import { saveCartContact } from "@/features/cart/actions";

/**
 * Optional, opt-in email capture on the cart so the team can follow up on
 * abandoned carts. Nothing is stored unless the customer submits, and marketing
 * contact only happens if they tick consent.
 */
export function CartContactCapture() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const data = new FormData(e.currentTarget);
    const res = await saveCartContact({
      email: String(data.get("email") ?? ""),
      name: String(data.get("name") ?? ""),
      marketingConsent: data.get("consent") === "on",
    });
    if (res.ok) setStatus("saved");
    else {
      setError(res.error ?? "Could not save. Please try again.");
      setStatus("error");
    }
  }

  if (status === "saved") {
    return (
      <div className="rounded-card border border-fo-line bg-fo-sage-100/60 p-5 text-[0.9rem] text-fo-green-900">
        Saved — we&apos;ll keep your cart and can send you a reminder if you don&apos;t
        finish today.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-fo-line bg-white p-5"
    >
      <h3 className="text-[1.05rem] font-bold text-fo-green-900">
        Save your cart
      </h3>
      <p className="mb-3 mt-1 text-[0.85rem] text-fo-muted">
        Add your email and we&apos;ll hold your cart — handy if you want to finish
        later.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          aria-label="Your name (optional)"
          placeholder="Name (optional)"
          className="rounded-control border-[1.5px] border-fo-line px-3 py-2.5 text-[0.9rem]"
        />
        <input
          name="email"
          type="email"
          required
          aria-label="Your email"
          placeholder="you@email.com"
          className="rounded-control border-[1.5px] border-fo-line px-3 py-2.5 text-[0.9rem]"
        />
      </div>
      <label className="mt-3 flex items-start gap-2 text-[0.82rem] text-fo-muted">
        <input
          name="consent"
          type="checkbox"
          className="mt-0.5 h-4 w-4 flex-none accent-fo-green-900"
        />
        <span>
          Email me reminders about this cart and occasional offers. You can
          unsubscribe anytime.
        </span>
      </label>
      {error && <p className="mt-2 text-sm text-fo-error">{error}</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="fo-btn-secondary mt-3 min-h-[40px] px-4 py-2.5 text-[0.85rem]"
      >
        {status === "saving" ? "Saving…" : "Save my cart"}
      </button>
    </form>
  );
}
