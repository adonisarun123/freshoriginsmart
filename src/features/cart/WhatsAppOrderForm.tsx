"use client";

import { useState } from "react";

interface OrderResult {
  ok: boolean;
  publicOrderNumber?: string;
  publicToken?: string;
  publicOrderUrl?: string;
  whatsappUrl?: string;
  totalPaise?: number;
  error?: string;
}

/**
 * Collects the minimal details needed to create a WhatsApp order, POSTs to
 * /api/whatsapp-order (which creates the order record server-side BEFORE
 * WhatsApp opens — spec §26), then shows the prefilled message preview and a
 * big "Open WhatsApp" action plus a link to the secure order summary.
 */
export function WhatsAppOrderForm({ cartId }: { cartId: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      cartId,
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim() || undefined,
      pincode: String(data.get("pincode") ?? "").trim(),
      addressLine: String(data.get("addressLine") ?? "").trim() || undefined,
      note: String(data.get("note") ?? "").trim() || undefined,
    };

    try {
      const res = await fetch("/api/whatsapp-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as OrderResult;
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not create your order. Please try again.");
        return;
      }
      setResult(json);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok && result.whatsappUrl) {
    return (
      <div className="rounded-card border border-[#cdeed6] bg-[#f3fbf5] p-6">
        <h3 className="text-fo-green-900">Order {result.publicOrderNumber} created</h3>
        <p className="mt-1 text-[0.92rem] text-fo-muted">
          Your order record is saved. Tap below to open WhatsApp with your message
          pre-filled — no payment is taken yet. Our team confirms availability and
          delivery charge first.
        </p>

        <button
          type="button"
          onClick={() => window.open(result.whatsappUrl, "_blank", "noopener")}
          className="fo-btn-whatsapp mt-4 w-full"
        >
          Open WhatsApp
        </button>

        {result.publicOrderUrl && (
          <p className="mt-3 text-center text-[0.85rem]">
            <a
              href={result.publicOrderUrl}
              className="text-fo-green-900 underline"
            >
              View your secure order summary
            </a>
          </p>
        )}

        <p className="mt-4 text-[0.78rem] text-fo-muted">
          If WhatsApp didn&apos;t open, save your order link above — you can return
          to it any time to message us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-fo-line bg-white p-6">
      <h3 className="text-fo-green-900">Your details</h3>
      <p className="mt-1 text-[0.9rem] text-fo-muted">
        We create a secure order record, then open WhatsApp with your order
        pre-filled. No payment is taken yet.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
        />
        <Field
          label="Email (optional)"
          name="email"
          type="email"
          autoComplete="email"
        />
        <Field
          label="Pincode"
          name="pincode"
          required
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
        />
      </div>

      <div className="mt-4">
        <Field label="Address (optional)" name="addressLine" autoComplete="street-address" />
      </div>

      <div className="mt-4">
        <label
          htmlFor="wa-note"
          className="mb-2 block text-[0.9rem] font-bold text-fo-green-900"
        >
          Note to your order (optional)
        </label>
        <textarea
          id="wa-note"
          name="note"
          maxLength={500}
          placeholder="e.g. preferred delivery time, gate code, or a question about a product"
          className="min-h-[70px] w-full resize-y rounded-control border-[1.5px] border-fo-line p-3 text-[0.92rem]"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-control border border-fo-line border-l-4 border-l-fo-error bg-[#fdf3f3] px-4 py-3 text-[0.88rem] text-fo-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="fo-btn-whatsapp mt-5 w-full disabled:opacity-60"
      >
        {submitting ? "Creating order…" : "Continue to WhatsApp"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "text";
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={`wa-${name}`}
        className="mb-2 block text-[0.9rem] font-bold text-fo-green-900"
      >
        {label}
        {required && <span className="text-fo-error"> *</span>}
      </label>
      <input
        id={`wa-${name}`}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full rounded-control border-[1.5px] border-fo-line px-3 py-2.5 text-[0.92rem]"
      />
    </div>
  );
}
