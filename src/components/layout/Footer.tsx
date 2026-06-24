import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footerColumns, policyLinks } from "@/config/navigation";
import { site } from "@/config/site";
import { fssaiLicence } from "@/config/content";
import { NewsletterForm } from "@/features/forms/NewsletterForm";

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
            <div className="mt-6 max-w-[34ch] rounded-card border border-white/15 bg-white/[0.06] p-6">
              <strong className="text-white">Join our newsletter</strong>
              <p className="mb-3 mt-1.5 text-[0.85rem] text-[#c8ddce]">
                Practical recipes, grain education, and new-product updates —
                without wellness noise.
              </p>
              <NewsletterForm source="footer" />
            </div>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-[0.95rem] font-bold tracking-[0.02em] text-white">
                {col.title}
              </h2>
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
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-[0.8rem] text-[#bcd2c2]">
          <span>
            © {new Date().getFullYear()} Fresh Origins.{" "}
            {fssaiLicence
              ? `FSSAI Lic. No. ${fssaiLicence}.`
              : "FSSAI licence, legal entity & address to be confirmed before launch."}
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
