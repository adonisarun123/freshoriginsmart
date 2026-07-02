"use client";

import { useEffect, useState } from "react";

/**
 * Thin brand-gradient bar fixed to the top of the viewport that fills as
 * the reader moves through the article element identified by `targetId`.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      const done = Math.min(Math.max(-rect.top, 0), total);
      setProgress(done / total);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[130] h-[3px]"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-fo-green-600 to-fo-lime-500"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
