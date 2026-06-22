"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Overview", exact: true },
  { href: "/account/orders", label: "Orders", exact: false },
  { href: "/account/addresses", label: "Addresses", exact: false },
  { href: "/account/profile", label: "Profile", exact: false },
];

export function AccountNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav aria-label="Account sections" className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = isActive(link.href, link.exact);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-control px-4 py-2.5 text-[0.95rem] font-bold transition ${
              active
                ? "bg-fo-sage-100 text-fo-green-900"
                : "text-fo-charcoal-900 hover:bg-fo-sage-100/60"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <form action="/auth/sign-out" method="post" className="mt-1">
        <button
          type="submit"
          className="w-full rounded-control px-4 py-2.5 text-left text-[0.95rem] font-bold text-fo-error transition hover:bg-fo-error/10"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}
