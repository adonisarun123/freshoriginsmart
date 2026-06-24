"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/track";

type EnquiryType =
  | "retail"
  | "distributor"
  | "corporate_wellness"
  | "professional";

const TABS: { value: EnquiryType; label: string }[] = [
  { value: "retail", label: "Retail" },
  { value: "distributor", label: "Distributor" },
  { value: "corporate_wellness", label: "Corporate" },
  { value: "professional", label: "Professional" },
];

const inputCls =
  "w-full rounded-control border-[1.5px] border-fo-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-fo-green-600 focus:outline-none focus:ring-2 focus:ring-fo-green-600";

export function EnquiryForm() {
  const [type, setType] = useState<EnquiryType>("retail");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    // Type-specific fields go into metadata
    const metadata: Record<string, string> = {};
    for (const [k, v] of data.entries()) {
      if (k.startsWith("meta_")) metadata[k.slice(5)] = String(v);
    }

    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enquiryType: type,
        name: String(data.get("name") ?? ""),
        organisation: String(data.get("organisation") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        city: String(data.get("city") ?? ""),
        message: String(data.get("message") ?? ""),
        metadata,
      }),
    });
    if (res.ok) {
      setStatus("sent");
      track("submit_enquiry", { properties: { enquiryType: type } });
      form.reset();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not submit your enquiry. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-card border border-fo-line bg-white p-8 shadow-soft">
        <h3 className="text-[1.2rem]">Thanks — enquiry received.</h3>
        <p className="mt-2 text-fo-muted">
          We review business enquiries within 2–3 working days and will be in
          touch.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Enquiry type"
        className="mb-8 flex flex-wrap gap-2 border-b border-fo-line"
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={type === t.value}
            onClick={() => setType(t.value)}
            className={`border-b-[3px] px-4 py-3 text-[0.95rem] font-semibold ${
              type === t.value
                ? "border-fo-green-600 text-fo-green-900"
                : "border-transparent text-fo-muted hover:text-fo-green-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-card border border-fo-line bg-white p-8 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <input name="name" required className={inputCls} />
          </Field>
          <Field label="Organisation" required>
            <input name="organisation" required className={inputCls} />
          </Field>
          <Field label="Email" required>
            <input name="email" type="email" required className={inputCls} />
          </Field>
          <Field label="Phone" required>
            <input name="phone" type="tel" required className={inputCls} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="City">
            <input name="city" placeholder="e.g. Bangalore" className={inputCls} />
          </Field>
        </div>

        {/* Type-specific fields */}
        {type === "retail" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Store type">
              <select name="meta_store_type" className={inputCls}>
                <option>Organic store</option>
                <option>Supermarket</option>
                <option>Speciality / health store</option>
              </select>
            </Field>
            <Field label="Number of outlets">
              <input name="meta_outlets" type="number" min={1} className={inputCls} />
            </Field>
          </div>
        )}
        {type === "distributor" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Territory">
              <input name="meta_territory" className={inputCls} />
            </Field>
            <Field label="Monthly business estimate">
              <input name="meta_monthly_estimate" placeholder="₹" className={inputCls} />
            </Field>
            <Field label="Existing brands handled">
              <input name="meta_existing_brands" className={inputCls} />
            </Field>
            <Field label="GST number">
              <input name="meta_gst" className={inputCls} />
            </Field>
          </div>
        )}
        {type === "corporate_wellness" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Programme interest">
              <select name="meta_programme" className={inputCls}>
                <option>Healthy pantry</option>
                <option>Gift boxes</option>
                <option>Nutrition sessions</option>
                <option>Employee order programme</option>
              </select>
            </Field>
            <Field label="Approx. team size">
              <input name="meta_team_size" type="number" min={1} className={inputCls} />
            </Field>
          </div>
        )}
        {type === "professional" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Qualification">
              <input name="meta_qualification" placeholder="e.g. RD, Nutritionist" className={inputCls} />
            </Field>
            <Field label="Area of interest">
              <select name="meta_interest" className={inputCls}>
                <option>Education</option>
                <option>Sampling</option>
                <option>Referral</option>
                <option>Content review</option>
                <option>Institutional purchase</option>
              </select>
            </Field>
          </div>
        )}

        <div className="mt-4">
          <Field label="Message">
            <textarea
              name="message"
              className={`${inputCls} min-h-[110px] resize-y`}
              placeholder="Tell us a little about what you're looking for"
            />
          </Field>
        </div>

        {error && <p className="mt-3 text-sm text-fo-error">{error}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="fo-btn-primary mt-5"
        >
          {status === "sending" ? "Submitting…" : "Submit enquiry"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.9rem] font-semibold">
        {label} {required && <span className="text-fo-error">*</span>}
      </span>
      {children}
    </label>
  );
}
