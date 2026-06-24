"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/track";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
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
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(data.get("email") ?? ""), source }),
    });
    if (res.ok) {
      setStatus("sent");
      track("newsletter_signup", { properties: { source } });
      form.reset();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not subscribe. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-[0.9rem] text-[#c8ddce]">
        Thanks for subscribing — look out for practical recipes and grain
        education.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        aria-label="Email address"
        className="w-full rounded-control border-none px-3.5 py-3 text-fo-charcoal-900"
      />
      {error && <p className="mt-2 text-[0.8rem] text-[#ffd9d9]">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="fo-btn-secondary mt-3 w-full bg-white"
      >
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
