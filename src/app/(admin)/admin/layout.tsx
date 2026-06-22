import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { adminNav } from "@/config/navigation";
import { site } from "@/config/site";

/**
 * Admin layout — async Server Component with an auth + role gate.
 *
 * NOTE ON CHROME: the ROOT layout (src/app/layout.tsx) renders the storefront
 * AnnouncementBar + Header + Footer around *every* route, including this admin
 * area. A nested layout cannot strip its parent's chrome, so this file renders
 * a fully self-contained admin shell instead. In production the admin area
 * should live under its own root layout / route group with its own <html>/<body>
 * (e.g. a separate `app/(admin)` root segment that does NOT inherit the
 * storefront chrome). Acceptable for this scaffold.
 */

const ALLOWED_ROLES = ["admin", "operations", "editor", "nutrition_reviewer"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as string | undefined) ?? "customer";

  if (!ALLOWED_ROLES.includes(role)) {
    redirect("/");
  }

  return (
    <div
      className="grid min-h-screen bg-fo-cream-50 max-[860px]:grid-cols-1"
      style={{ gridTemplateColumns: "240px 1fr" }}
    >
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen flex-col self-start bg-fo-green-900 py-6 text-white max-[860px]:static max-[860px]:h-auto">
        <div className="flex items-center gap-2.5 px-6 pb-6">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-white/[0.14] font-display text-lg font-bold text-white">
            F
          </span>
          <span className="font-display text-[1.05rem] font-[650] leading-none text-white">
            {site.name}
            <small className="mt-1 block font-sans text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#9fc4a9]">
              Admin
            </small>
          </span>
        </div>

        <nav
          aria-label="Admin sections"
          className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pt-3 max-[860px]:flex-none max-[860px]:flex-row max-[860px]:flex-nowrap max-[860px]:gap-1.5 max-[860px]:overflow-x-auto max-[860px]:py-3"
        >
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block whitespace-nowrap rounded-control px-3.5 py-2.5 text-[0.92rem] font-semibold text-[#d9e8dd] hover:bg-white/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mx-3 mt-4 border-t border-white/15 px-3 pt-4 text-[0.82rem] text-[#a9c2b0]">
          <strong className="mb-0.5 block text-[0.9rem] text-white">
            Signed in as
          </strong>
          <span className="break-all">{user.email}</span>
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              className="mt-1.5 inline-block font-bold text-[#f0c9c9] underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <div className="min-w-0 bg-fo-cream-50">{children}</div>
    </div>
  );
}
