import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section } from "@/components/content/Section";
import { Illustration } from "@/components/brand/Illustration";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { comparisons } from "@/features/growth/comparisons";

export const metadata: Metadata = {
  title: "Grain Comparisons — Millets, Rice & More, Side by Side",
  description:
    "Honest, number-backed comparisons of everyday grains: millets vs rice, millets vs quinoa, jowar vs bajra vs ragi, and red vs brown vs white rice.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndexPage() {
  return (
    <div className="fo-container">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Comparisons", url: "/compare" },
          ]),
          itemListJsonLd(
            comparisons.map((c) => ({
              name: c.title,
              url: `/compare/${c.slug}`,
            })),
          ),
        ]}
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Comparisons" }]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Side by side</p>
        <h1 className="mb-3">Grain comparisons, without the hype</h1>
        <p className="max-w-[60ch] text-fo-muted">
          Every grain has a job it does best. These comparisons put real numbers
          side by side — fibre, protein, minerals, price, cooking behaviour —
          and end with a practical verdict instead of a sales pitch.
        </p>
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card"
            >
              <Illustration
                name={c.illustration}
                className="aspect-[16/7]"
                title={c.title}
              />
              <div className="p-5">
                <p className="fo-eyebrow mb-1">{c.eyebrow}</p>
                <h2 className="mb-1.5 text-[1.1rem]">{c.title}</h2>
                <p className="m-0 text-[0.88rem] text-fo-muted">
                  {c.metaDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
