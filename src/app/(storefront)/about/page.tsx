import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Illustration } from "@/components/brand/Illustration";

export const metadata: Metadata = {
  title: "About & Our Sourcing",
  description:
    "Why Fresh Origins exists, what we do differently, and how we source traditional grains — selection criteria, regions, and our clean-to-pack workflow, with an honest transparency statement.",
};

const principles = [
  {
    icon: "⊕",
    title: "Purposeful nutrition",
    body: "Every product has a defensible nutritional reason to exist — not a trend to chase.",
  },
  {
    icon: "❀",
    title: "Familiar everyday use",
    body: "Products fit into recognisable meal formats families already cook.",
  },
  {
    icon: "⌖",
    title: "Transparent origins",
    body: "Region, grain variety, and processing shown wherever available.",
  },
  {
    icon: "☰",
    title: "Modern trust",
    body: "Careful claims, clear allergens, and expert-reviewed health content.",
  },
];

const willClaim = [
  "List every ingredient in descending order of quantity",
  "Show region of origin and packing date where available",
  "Use nutrition claims only after lab validation",
  "Have health content reviewed by qualified experts",
  "Declare allergens clearly and prominently",
];

const wontClaim = [
  "Claim a food cures, reverses, or treats disease",
  "Use words like miracle, detox, or guilt-free",
  "Imply medical endorsement we don't have",
  "Publish estimated nutrition as final facts",
  "Shame anyone for eating rice, wheat, or sugar",
];

const regions = [
  {
    name: "Karnataka drylands",
    desc: "Foxtail & barnyard millets · rainfed cultivation",
    href: "/our-sourcing/regions/karnataka-drylands",
  },
  {
    name: "Tamil Nadu",
    desc: "Kodo & little millets · pulses for blends",
    href: "/our-sourcing",
  },
  {
    name: "Regional rice belts",
    desc: "Red, black & brown traditional varieties",
    href: "/our-sourcing",
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

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-fo-green-900 py-16 text-[#eafbef]">
        <div className="fo-container max-w-[860px]">
          <p className="fo-eyebrow text-fo-lime-300">About Fresh Origins</p>
          <h1 className="text-white">Healthy tradition made practical.</h1>
          <p className="mb-0 text-[1.1rem] text-[#cfe6d6]">
            Fresh Origins brings thoughtfully selected traditional foods into modern
            households through clear sourcing, practical formats, transparent nutrition,
            and responsible health communication.
          </p>
        </div>
      </section>

      {/* Why we exist */}
      <Section>
        <div className="max-w-editorial">
          <h2 className="text-[1.7rem]">Why Fresh Origins exists</h2>
          <p>
            Healthy eating shouldn&apos;t require a nutrition degree or a separate meal
            for every member of the family. Yet the &ldquo;health food&rdquo; aisle is
            often confusing — heavy on claims, light on clarity, and disconnected from
            how Indian households actually cook.
          </p>
          <p>
            We started Fresh Origins to make better everyday food decisions simple. Not
            by inventing exotic ingredients, but by taking traditional grains and pulses
            and shaping them into purposeful, familiar staples — khichdi, adai, kanji,
            roti, and rice — with the nutrition and origin made plain.
          </p>

          <h2 className="mt-12 text-[1.7rem]">What we do differently</h2>
          <p>
            We don&apos;t sell random &ldquo;healthy&rdquo; ingredients. We develop and
            curate everyday staples around a clear nutritional reason, familiar Indian
            meal formats, and transparent sourcing. Every product has to earn its place:
            a defensible reason to exist, an honest ingredient list, and a meal it
            genuinely fits into.
          </p>
        </div>
      </Section>

      {/* Principles */}
      <Section tight>
        <SectionHead
          eyebrow="How we build products"
          title="Our product-development principles"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-fo-sage-100 text-[1.2rem] text-fo-green-900">
                {p.icon}
              </div>
              <h3 className="mb-1.5 text-[1.1rem]">{p.title}</h3>
              <p className="m-0 text-[0.9rem] text-fo-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Will / won't claim */}
      <Section tight>
        <SectionHead
          eyebrow="An honest commitment"
          title="What we will and will not claim"
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-[#cfe6c2] bg-[#eef6e9] p-6">
            <h3 className="text-fo-success">We will</h3>
            <ul className="mt-3 grid gap-2 text-[0.9rem]">
              {willClaim.map((item) => (
                <li key={item}>
                  <span className="font-bold text-fo-success">✓ </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-[#f0d2d2] bg-[#fbeeee] p-6">
            <h3 className="text-fo-error">We won&apos;t</h3>
            <ul className="mt-3 grid gap-2 text-[0.9rem]">
              {wontClaim.map((item) => (
                <li key={item}>
                  <span className="font-bold text-fo-error">✕ </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Sourcing */}
      <Section surface id="sourcing">
        <SectionHead
          eyebrow="Our Sourcing"
          title="From verified regions to your kitchen"
        >
          <p className="mt-3 text-fo-muted">
            We select traditional grain varieties from regions suited to growing them,
            and we&apos;re honest about what we can and can&apos;t yet trace.
          </p>
        </SectionHead>

        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_1fr]">
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
                className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-card border border-fo-line bg-fo-cream-50 p-4 transition hover:shadow-soft"
              >
                <Illustration
                  name="field"
                  className="aspect-square rounded-card"
                  title={`${region.name} region`}
                />
                <div>
                  <h3 className="mb-0.5 text-[1rem]">{region.name}</h3>
                  <p className="m-0 text-[0.82rem] text-fo-muted">{region.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <h3 className="mt-12 text-[1.2rem]">Selection criteria</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
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

      {/* CTA */}
      <Section tight>
        <div className="text-center">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.6rem)]">
            Ready to try Fresh Origins?
          </h2>
          <p className="mx-auto mb-6 max-w-[52ch] text-fo-muted">
            Shop our launch range, or get in touch about retail, distribution,
            community, or professional partnerships.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="fo-btn-primary">
              Shop Fresh Origins
            </Link>
            <Link href="/for-business" className="fo-btn-secondary">
              Partner with us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
