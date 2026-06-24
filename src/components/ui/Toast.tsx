"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Tiny toast system with no provider needed. Any client component calls
 * `showToast({...})`; a single <ToastHost /> (mounted once in the layout)
 * listens via a module-level event and renders it. SSR-safe — the host only
 * subscribes on the client.
 */

export interface ToastOptions {
  message: string;
  /** Optional action link shown on the right (e.g. View cart). */
  actionLabel?: string;
  actionHref?: string;
  /** Auto-dismiss after this many ms (default 4000). */
  durationMs?: number;
}

type ToastListener = (t: ToastOptions) => void;
const listeners = new Set<ToastListener>();

export function showToast(options: ToastOptions): void {
  listeners.forEach((l) => l(options));
}

export function ToastHost() {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listener: ToastListener = (t) => {
      setToast(t);
      setVisible(true);
      const ms = t.durationMs ?? 4000;
      window.clearTimeout((listener as { _t?: number })._t);
      (listener as { _t?: number })._t = window.setTimeout(
        () => setVisible(false),
        ms,
      );
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex justify-center px-4 transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex max-w-[92vw] items-center gap-4 rounded-card border border-fo-line bg-white px-4 py-3 shadow-card">
        <span className="text-[0.92rem] font-medium text-fo-green-900">
          {toast.message}
        </span>
        {toast.actionLabel && toast.actionHref && (
          <Link
            href={toast.actionHref}
            className="shrink-0 text-[0.88rem] font-bold text-fo-accent underline underline-offset-2 hover:text-fo-green-900"
            onClick={() => setVisible(false)}
          >
            {toast.actionLabel}
          </Link>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setVisible(false)}
          className="shrink-0 text-fo-muted hover:text-fo-green-900"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
