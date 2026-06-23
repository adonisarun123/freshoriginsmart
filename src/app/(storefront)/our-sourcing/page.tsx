import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Illustration } from "@/components/brand/Illustration";

export const metadata: Metadata = {
  title: "Our Sourcing",
  description:
    "How Fresh Origins sources traditional grains — selection criteria, verified regions, our clean-to-pack workflow, and an honest transparency commitment.",
};

const regions = [
  {
    name: "Karnataka drylands",
    desc: "Rainfed foxtail & barnyard millet from the semi-arid interior.",
    href: "/our-sourcing/regions/karnataka-drylands",
    live: true,
  },
  {
    name: "Tamil Nadu",
    desc: "Kodo & little millets and pulses for our blends.",
    href: "/our-sourcing",
    live: false,
  },
  {
    name: "Regional rice belts",
    desc: "Red, black & brown traditional rice varieties.",
    href: "/our-sourcing",
    live: false,
  },
];

const criteria = [
  "Grain variety suited to the region's soil and climate",
  "Partner and farmer verification before sourcing",
  "Variety and seasonality considered for each batch",
  "Quality screening before cleaning and packing",
];

const workflow = [
  { title: "Identify varieties", body: "Select suitable traditional grain varieties for each product." },
  { title: "Source & verify", body: "Source from verified regions and partners, with consent and accurate records." },
  { title: "Clean, mill & blend", body: "Clean, mill or blend, and pack to specification in small batches." },
  { title: "Share clearly", body: "Show nutrition, storage, allergens, and pack information openly." },
];

export default function OurSourcingPage() {
  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Our Sourcing" }]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Our Sourcing</p>
        <h1 className="mb-3">From verified regions to your kitchen</h1>
        <p className="max-w-[62ch] text-fo-muted">
          We select traditional grain varieties from regions suited to growing them,
          verify our partners before sourcing, and are honest about what we can and
          can&apos;t yet trace. Below is an overview of where our grains come from and
          how they reach your kitchen.
        </p>
      </div>

      {/* Regions */}
      <Section tight>
        <SectionHead eyebrow="Where our grains grow" title="Sourcing regions" />
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
          <Illustration
            name="origin"
            className="aspect-[4/3] rounded-card"
            title="Sourcing regions map — Karnataka & Tamil Nadu drylands"
          />
          <div className="grid gap-4">
            {regions.map((region) => (
              <Link
                key={region.name}
                href={region.href}
                className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-card border border-fo-line bg-white p-4 transition hover:shadow-soft"
              >
                <Illustration
                  name="field"
                  className="aspect-square rounded-card"
                  title={`${region.name} region`}
                />
                <div>
                  <h3 className="mb-0.5 flex items-center gap-2 text-[1rem]">
                    {region.name}
                    {!region.live && (
                      <span className="rounded-pill bg-fo-sage-100 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.05em] text-fo-green-900">
                        Detail coming soon
                      </span>
                    )}
                  </h3>
                  <p className="m-0 text-[0.82rem] text-fo-muted">{region.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Criteria */}
      <Section tight surface>
        <SectionHead eyebrow="How we choose" title="Selection criteria" />
        <ul className="grid gap-4 sm:grid-cols-2">
          {criteria.map((c) => (
            <li
              key={c}
              className="flex gap-2.5 rounded-control border border-fo-line bg-fo-cream-50 p-4 text-[0.92rem]"
            >
              <span className="font-bold text-fo-green-600">◦</span>
              {c}
            </li>
          ))}
        </ul>
      </Section>

      {/* Workflow */}
      <Section tight>
        <SectionHead eyebrow="From origin to pack" title="Our clean-to-pack workflow" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map((step, i) => (
            <div
              key={step.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <span className="font-display text-[2rem] font-[650] text-fo-green-600">
                {i + 1}
              </span>
              <h3 className="my-1.5 text-[1.1rem]">{step.title}</h3>
              <p className="m-0 text-[0.85rem] text-fo-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Transparency */}
      <Section tight>
        <Disclaimer title="Our transparency statement:">
          We share what we can verify. Where we cannot yet trace a batch to a specific
          farm, we will not imply direct farmer sourcing. Sourcing regions, varieties,
          and processing details are shown when confirmed, and we update them as our
          traceability improves. Coordinates and farmer stories are shared only with
          consent.
        </Disclaimer>
      </Section>
    </div>
  );
}
