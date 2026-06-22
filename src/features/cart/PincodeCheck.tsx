"use client";

import { useState } from "react";
import { formatINR } from "@/lib/commerce/format";

interface PincodeResult {
  ok?: boolean;
  serviceable: boolean;
  city?: string;
  zone?: string;
  etaDays?: [number, number];
  freeDeliveryThresholdPaise?: number | null;
  deliveryChargePaise?: number;
  message?: string;
}

function formatEta(eta: [number, number] | undefined): string {
  if (!eta) return "";
  const [min, max] = eta;
  if (min === max) return ` · ~${min} days`;
  return ` · ${min}–${max} days`;
}

/**
 * Checks a delivery pincode against /api/pincode and shows whether we deliver,
 * the city/zone, ETA, and the free-delivery threshold (spec §26 / cart.html).
 */
export function PincodeCheck() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setError(null);
    setResult(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/pincode?code=${encodeURIComponent(code.trim())}`);
      const data = (await res.json()) as PincodeResult;
      setResult(data);
    } catch {
      setError("Could not check this pincode. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 rounded-card border border-fo-line bg-fo-cream-50 p-4">
      <label
        htmlFor="cart-pincode"
        className="mb-2 block text-[0.85rem] font-bold text-fo-green-900"
      >
        Delivery availability
      </label>
      <div className="flex gap-2">
        <input
          id="cart-pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          placeholder="Enter pincode"
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          className="flex-1 rounded-control border-[1.5px] border-fo-line px-3 py-2.5"
        />
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="fo-btn-secondary px-4 py-2.5 text-[0.85rem] disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </div>

      {error && <p className="mt-2 text-[0.82rem] text-fo-error">{error}</p>}

      {result && result.serviceable && (
        <p className="mt-2 text-[0.82rem] text-fo-success">
          ✓ Delivers to {result.city ?? "your area"} ({code})
          {formatEta(result.etaDays)}
          {typeof result.freeDeliveryThresholdPaise === "number"
            ? ` · Free delivery over ${formatINR(result.freeDeliveryThresholdPaise)}`
            : ""}
        </p>
      )}

      {result && !result.serviceable && (
        <p className="mt-2 text-[0.82rem] text-fo-muted">
          {result.message ??
            "We don't deliver to this pincode yet. We currently cover Bangalore and Hosur."}
        </p>
      )}
    </div>
  );
}
