"use client";

/**
 * Client-side event tracking. Fires to our first-party /api/event endpoint and,
 * when GA4 is configured, also to gtag. Fire-and-forget; never throws.
 */
export type TrackProps = Record<string, unknown>;

function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem("fo_sid");
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem("fo_sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

export function track(
  event: string,
  opts: {
    productId?: string;
    variantId?: string;
    properties?: TrackProps;
  } = {},
): void {
  // First-party
  try {
    void fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ event, sessionId: sessionId(), ...opts }),
    });
  } catch {
    /* ignore */
  }

  // GA4 (if loaded)
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, opts.properties ?? {});
    }
  } catch {
    /* ignore */
  }
}
