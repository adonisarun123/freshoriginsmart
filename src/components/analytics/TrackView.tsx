"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";

/**
 * Fires a single analytics event once, on mount. Drop into any Server Component
 * page to record a page/section view (view_item, view_item_list, view_cart,
 * purchase, etc.) without converting the page to a Client Component.
 *
 * Renders nothing. The guard ref prevents a double-fire under React 18 strict
 * mode's intentional double-invoke in development.
 */
export function TrackView({
  event,
  productId,
  variantId,
  properties,
}: {
  event: string;
  productId?: string;
  variantId?: string;
  properties?: Record<string, unknown>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, { productId, variantId, properties });
  }, [event, productId, variantId, properties]);

  return null;
}
