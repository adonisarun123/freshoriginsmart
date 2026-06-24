"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics/track";

interface PincodeResult {
  serviceable: boolean;
  city?: string;
  zone?: string;
  etaDays?: [number, number];
  message?: string;
}

/**
 * Compact header affordance: "Deliver to?" opens a small popover where a
 * visitor can check serviceability before browsing. Reuses /api/pincode.
 */
export function ServiceabilityCheck() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/pincode?code=${encodeURIComponent(code.trim())}`,
      );
      const data = (await res.json()) as PincodeResult;
      setResult(data);
      track("check_serviceability", {
        properties: { serviceable: data.serviceable ?? false, source: "header" },
      });
    } catch {
      setError("Could not check this pincode. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="hidden items-center gap-1.5 rounded-xl border-[1.5px] border-fo-line bg-white px-3 py-2 text-[0.85rem] font-semibold text-fo-green-900 hover:bg-fo-sage-100 sm:flex"
      >
        <Icon name="map-pin" size={16} className="text-fo-accent" />
        {result
          ? result.serviceable
            ? `Delivers to ${code}`
            : "Check another pincode"
          : "Deliver to?"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Check delivery availability"
          className="absolute right-0 top-[calc(100%+8px)] z-[120] w-[280px] rounded-card border border-fo-line bg-white p-4 shadow-card"
        >
          <p className="mb-2 text-[0.85rem] font-bold text-fo-green-900">
            Check delivery availability
          </p>
          <form onSubmit={check} className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit pincode"
              aria-label="Pincode"
              className="min-w-0 flex-1 rounded-control border-[1.5px] border-fo-line px-3 py-2 text-[0.9rem] focus:border-fo-green-600 focus:outline-none focus:ring-2 focus:ring-fo-green-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="fo-btn-primary px-3 py-2 text-[0.82rem]"
            >
              {loading ? "…" : "Check"}
            </button>
          </form>
          {error && (
            <p className="mt-2 text-[0.8rem] text-fo-error">{error}</p>
          )}
          {result && result.serviceable && (
            <p className="mt-2 text-[0.82rem] text-fo-green-900">
              ✓ We deliver to {result.city ?? "your area"}
              {result.etaDays
                ? ` · ${result.etaDays[0]}–${result.etaDays[1]} days`
                : ""}
              .
            </p>
          )}
          {result && !result.serviceable && (
            <p className="mt-2 text-[0.82rem] text-fo-muted">
              {result.message ??
                "We don't deliver here yet — but we're expanding across Bangalore & Hosur."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
