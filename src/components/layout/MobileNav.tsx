"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { primaryNav } from "@/config/navigation";
import { Icon } from "@/components/ui/Icon";

/**
 * Mobile navigation drawer (visible < lg). Fixes the gap where primary nav was
 * hidden on phones/tablets with no alternative.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="fo-mobile-menu"
        className="grid h-[42px] w-[42px] place-items-center rounded-xl border-[1.5px] border-fo-line bg-white text-fo-green-900 hover:bg-fo-sage-100"
      >
        <Icon name="menu" size={22} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200]"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-fo-charcoal-900/40"
          />
          <nav
            id="fo-mobile-menu"
            aria-label="Primary"
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-[340px] flex-col bg-fo-cream-50 p-6 shadow-card"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-[1.2rem] font-[650] text-fo-green-900">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-xl border-[1.5px] border-fo-line bg-white text-fo-green-900"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block min-h-[44px] rounded-control px-3 py-3 text-[1.05rem] font-semibold text-fo-charcoal-900 hover:bg-fo-sage-100 hover:text-fo-green-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex gap-2 pt-6">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="fo-btn-secondary flex-1"
              >
                Account
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="fo-btn-primary flex-1"
              >
                Cart
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
