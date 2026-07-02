"use client";

import { useEffect, useState } from "react";

import type { ArticleHeading } from "@/features/learn/content";

/**
 * Sticky "On this page" outline with scrollspy highlighting.
 * Rendered in the desktop side rail; the mobile equivalent is a plain
 * <details> block (no JS) in the page itself.
 */
export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // Trigger when a heading enters the upper third of the viewport.
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-[0.86rem]">
      <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.09em] text-fo-accent">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-fo-line">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={[
                  "-ml-px block border-l-2 py-1.5 leading-snug transition-colors",
                  h.level === 3 ? "pl-7" : "pl-4",
                  active
                    ? "border-fo-green-600 font-semibold text-fo-green-900"
                    : "border-transparent text-fo-muted hover:border-fo-line hover:text-fo-green-900",
                ].join(" ")}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
