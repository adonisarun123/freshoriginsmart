import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Placeholder } from "@/components/ui/Placeholder";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return [{ slug: "karnataka-drylands" }];
}

export const metadata: Metadata = {
  title: "Karnataka Drylands — Sourcing Region",
  description:
    "A sourcing-region detail for the Karnataka drylands — rainfed foxtail and barnyard millet, agricultural context, partner type, associated products, batch and season notes, and our transparency commitments.",
};

const facts = [
  ["State", "Karnataka, India"],
  ["Primary crops", "Foxtail & barnyard millet"],
  ["Cultivation", "Rainfed / dryland"],
  ["Partner type", "Verified farmer groups"],
  ["Approx. location", "Shown approximate only"],
];

const photos = [
  "Rainfed millet field under monsoon sky, Karnataka drylands",
  "Close-up of harvested foxtail millet grain",
  "Hand harvesting and sorting millet at the threshing floor",
  "Conversations with a verified farmer group during sourcing",
];

const associated = [
  { title: "Metabolic Balance Khichdi", body: "Uses foxtail millet from this region", href: "/products/metabolic-balance-khichdi", label: "Khichdi" },
  { title: "Foxtail Millet (whole grain)", body: "Rainfed, dryland-grown", href: "/shop/millets", label: "Foxtail" },
  { title: "Barnyard Millet (whole grain)", body: "Seasonal Kharif supply", href: "/shop/millets", label: "Barnyard" },
];

const batches = [
  ["Kharif 2026", "Foxtail millet", "In supply", "Current harvest; cleaned and packed in small batches."],
  ["Kharif 2026", "Barnyard millet", "Incoming", "Partial harvest received; quality screening in progress."],
  ["Kharif 2025", "Foxtail millet", "Sold out", "Previous season; retained for reference and records."],
];

export default function RegionDetailPage({ params }: PageProps) {
  void params;
  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Our Sourcing", href: "/our-sourcing" },
          { label: "Regions", href: "/our-sourcing" },
          { label: "Karnataka Drylands" },
        ]}
      />

      {/* Hero */}
      <section className="pt-6">
        <p className="fo-eyebrow">Sourcing region</p>
        <h1>Karnataka Drylands</h1>
        <p className="max-w-editorial text-fo-muted">
          A rainfed millet-growing belt across the semi-arid interior of Karnataka, where
          foxtail and barnyard millet have long been cultivated without irrigation. We
          work here with verified farmer groups to source traditional varieties suited to
          the region&apos;s soil and seasons.
        </p>
        <Placeholder
          ratio="16x9"
          label="Karnataka dryland millet fields"
          className="mt-6 !rounded-hero"
        />
      </section>

      {/* Quick facts */}
      <Section tight>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {facts.map(([term, def]) => (
            <div
              key={term}
              className="rounded-card border border-fo-line bg-fo-cream-50 p-4"
            >
              <dt className="mb-1.5 text-[0.72rem] uppercase tracking-[0.06em] text-fo-muted">
                {term}
              </dt>
              <dd className="m-0 text-[0.95rem] font-bold text-fo-green-900">{def}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Agricultural context */}
      <Section tight>
        <div className="max-w-editorial">
          <SectionHead eyebrow="Agricultural context" title="Climate, soil & seasonality" />
          <p>
            The Karnataka drylands sit in a semi-arid zone with low, monsoon-dependent
            rainfall and red to sandy-loam soils that drain quickly. These conditions
            suit hardy small millets like foxtail and barnyard, which mature on limited
            water and tolerate the dry spells that make irrigated crops difficult here.
            Cultivation relies on the south-west monsoon rather than canals or borewells.
          </p>
          <p>
            The main growing window is the Kharif (monsoon) season, with sowing through
            the early rains and harvest as the weather turns dry. Yields and grain
            quality vary year to year with rainfall, so we treat each season&apos;s
            supply as distinct and record crop and variety at the batch level rather than
            assuming uniformity across harvests.
          </p>
        </div>
      </Section>

      {/* Photo grid */}
      <Section tight>
        <SectionHead eyebrow="From the region" title="Photographs from the field" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((caption) => (
            <Placeholder key={caption} label={caption} />
          ))}
        </div>
      </Section>

      {/* Associated products */}
      <Section tight>
        <SectionHead
          eyebrow="Associated products"
          title="Products that draw from this region"
        >
          <p className="mt-3 text-fo-muted">
            Products below use millet varieties sourced, at least in part, from the
            Karnataka drylands. Batch-level traceability is shown on each product where
            confirmed.
          </p>
        </SectionHead>
        <div className="grid gap-4 sm:grid-cols-3">
          {associated.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 rounded-card border border-fo-line bg-white p-3 transition hover:shadow-soft"
            >
              <Placeholder label={item.label} className="!h-14 !w-14 !text-[0.55rem]" />
              <div>
                <h3 className="m-0 text-[0.92rem]">{item.title}</h3>
                <p className="m-0 text-[0.8rem] text-fo-muted">{item.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Batch & season notes */}
      <Section tight>
        <SectionHead eyebrow="Traceability" title="Batch & season notes" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.92rem]">
            <thead>
              <tr className="bg-fo-sage-100 text-fo-green-900">
                {["Season", "Crop", "Status", "Notes"].map((h) => (
                  <th key={h} scope="col" className="p-3 text-left font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((row) => (
                <tr key={`${row[0]}-${row[1]}`} className="border-b border-fo-line">
                  {row.map((cell, i) => (
                    <td key={i} className="p-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Transparency */}
      <Section tight>
        <Disclaimer title="Transparency commitment:">
          We share what we can verify. Coordinates are approximate and farmer stories are
          shared only with consent. We do not imply direct farmer sourcing for a batch
          unless it is traceable.
        </Disclaimer>
      </Section>
    </div>
  );
}
