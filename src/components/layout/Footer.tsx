import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footerColumns, policyLinks } from "@/config/navigation";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-20 bg-fo-green-900 py-16 text-[#d9e8dd]">
      <div className="fo-container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="mb-4">
              <Logo variant="footer" />
            </div>
            <p className="max-w-[34ch] text-[0.9rem] text-[#c8ddce]">
              {site.positioning}
            </p>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-[0.95rem] font-bold tracking-[0.02em] text-white">
                {col.title}
              </h5>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-1 text-[0.9rem] text-[#cfe2d5] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-[0.8rem] text-[#a9c2b0]">
          <span>
            © {new Date().getFullYear()} Fresh Origins. FSSAI licence, legal
            entity &amp; address to be confirmed before launch.
          </span>
          <span className="flex flex-wrap gap-2">
            {policyLinks.map((p, i) => (
              <span key={p.label}>
                <Link href={p.href} className="hover:text-white">
                  {p.label}
                </Link>
                {i < policyLinks.length - 1 ? " · " : ""}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
