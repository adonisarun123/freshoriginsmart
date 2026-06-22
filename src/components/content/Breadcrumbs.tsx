import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 pt-6 text-[0.85rem] text-fo-muted">
      {items.map((c, i) => (
        <span key={c.label} className="flex gap-2">
          {c.href ? (
            <Link href={c.href} className="hover:text-fo-green-900">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page">{c.label}</span>
          )}
          {i < items.length - 1 && <span className="opacity-50">/</span>}
        </span>
      ))}
    </nav>
  );
}
