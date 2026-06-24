"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim top-of-page progress bar shown during client-side route transitions
 * (filter/sort submits, chip clicks, nav links). Server Components in the App
 * Router don't expose a global "navigating" flag in Next 14, so we approximate:
 * intercept same-origin clicks/submits to start the bar, and complete it when
 * the pathname or search params actually change. Purely visual; never blocks.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const timers = useRef<number[]>([]);

  // Start the bar on any same-tab navigation intent.
  useEffect(() => {
    function isInternal(url: string): boolean {
      try {
        const u = new URL(url, window.location.href);
        return u.origin === window.location.origin;
      } catch {
        return false;
      }
    }
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement)?.closest("a");
      if (a && a.href && a.target !== "_blank" && isInternal(a.href)) {
        const dest = new URL(a.href, window.location.href);
        const here = window.location;
        if (dest.pathname === here.pathname && dest.search === here.search)
          return;
        setActive(true);
      }
    }
    function onSubmit(e: SubmitEvent) {
      const form = e.target as HTMLFormElement;
      if (form && form.method.toLowerCase() === "get") setActive(true);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  // Complete the bar when the route or query actually changes.
  useEffect(() => {
    if (!active) return;
    const t1 = window.setTimeout(() => setActive(false), 400);
    timers.current.push(t1);
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[300] h-[3px] transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-full bg-fo-green-600 ${active ? "animate-[routebar_0.7s_ease-in-out_infinite]" : ""}`}
        style={{ width: active ? "100%" : "0%" }}
      />
    </div>
  );
}
