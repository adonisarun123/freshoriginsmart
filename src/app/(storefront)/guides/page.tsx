import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section } from "@/components/content/Section";
import { Illustration } from "@/components/brand/Illustration";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { guides } from "@/features/growth/guides";

export const metadata: Metadata = {
  title: "Buying Guides — Choosing Millets, Rice & Flours Well",
  description:
    "Practical, no-hype buying guides: the best millets for blood-sugar-conscious eating, weight management, beginners, and the gluten-free flours that actually make good rotis.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  return (
    <div className="fo-container">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Buying guides", url: "/guides" },
          ]),
          itemListJsonLd(
            guides.map((g) => ({ name: g.title, url: `/guides/${g.slug}` })),
          ),
        ]}
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Buying guides" }]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Choose well</p>
        <h1 className="mb-3">Buying guides, minus the hype</h1>
        <p className="max-w-[60ch] text-fo-muted">
          Which millet for which goal, what to buy first, and what the marketing
          leaves out — practical guides written under the same claim discipline
          we apply to our own packs.
        </p>
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="overflow-hidden rounded-card border border-fo-line bg-white transition hover:shadow-card"
            >
              <Illustration
                name={g.illustration}
                className="aspect-[16/7]"
                title={g.title}
              />
              <div className="p-5">
                <p className="fo-eyebrow mb-1">{g.eyebrow}</p>
                <h2 className="mb-1.5 text-[1.1rem]">{g.title}</h2>
                <p className="m-0 text-[0.88rem] text-fo-muted">
                  {g.metaDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
