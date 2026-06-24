"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics/track";

/**
 * A Next.js Link that fires an analytics event when clicked. Lets Server
 * Components (e.g. ProductCard) record interactions like select_item without
 * becoming Client Components themselves.
 */
export function TrackedLink({
  href,
  event,
  productId,
  variantId,
  properties,
  className,
  children,
}: {
  href: string;
  event: string;
  productId?: string;
  variantId?: string;
  properties?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, { productId, variantId, properties })}
    >
      {children}
    </Link>
  );
}
