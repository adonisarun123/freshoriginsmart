"use client";

import { useState } from "react";

const TOPICS = [
  "General question",
  "Order help",
  "Product / ingredients",
  "Delivery & serviceability",
  "Feedback",
] as const;

export function ContactForm() {
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
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enquiryType: "general",
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        message: String(data.get("message") ?? ""),
        metadata: { topic: String(data.get("topic") ?? "") },
      }),
    });
    if (res.ok) {
      setStatus("sent");
      form.reset();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not send your message. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-card border border-fo-line bg-white p-8 shadow-soft">
        <h3 className="text-[1.2rem]">Thanks — message received.</h3>
        <p className="mt-2 text-fo-muted">
          We&apos;ll get back to you by email. For anything urgent, reach us on
          WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-fo-line bg-white p-8 shadow-soft"
    >
      <h3 className="mt-0 text-[1.2rem]">Send us a message</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <input name="name" required className={inputCls} />
        </Field>
        <Field label="Email" required>
          <input name="email" type="email" required className={inputCls} />
        </Field>
        <Field label="Phone">
          <input name="phone" type="tel" className={inputCls} />
        </Field>
        <Field label="Topic">
          <select name="topic" className={inputCls} defaultValue={TOPICS[0]}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Message" required>
          <textarea
            name="message"
            required
            className={`${inputCls} min-h-[110px] resize-y`}
            placeholder="How can we help?"
          />
        </Field>
      </div>
      {error && <p className="mt-3 text-sm text-fo-error">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="fo-btn-primary mt-5"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-control border-[1.5px] border-fo-line bg-white px-3.5 py-3 text-[0.95rem] focus:border-fo-green-600 focus:outline-none focus:ring-2 focus:ring-fo-green-600";

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
