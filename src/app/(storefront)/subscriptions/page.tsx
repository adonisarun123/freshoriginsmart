import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = {
  title: "Subscriptions — Coming soon",
  description:
    "Fresh Origins subscriptions are coming soon — monthly essentials chosen by meal preference and household size. Join the waitlist to hear when our subscription boxes launch.",
};

const boxes = [
  {
    name: "Monthly Family Staples Box",
    label: "Monthly Family Staples Box — millets, rice & mixes",
    desc: "A reliable monthly refill of everyday grains, rice and ready-to-cook mixes for the whole household.",
  },
  {
    name: "Millet Breakfast Box",
    label: "Millet Breakfast Box — breakfast grains & blends",
    desc: "Breakfast-friendly millets, porridge bases and quick mixes to start the day with traditional grains.",
  },
  {
    name: "Protein & Fibre Box",
    label: "Protein & Fibre Box — high-protein, high-fibre staples",
    desc: "A selection chosen around protein and fibre — pulses, blends and grains for fuller, balanced meals.",
  },
  {
    name: "Senior-Friendly Staples Box",
    label: "Senior-Friendly Staples Box — gentle, easy-to-cook staples",
    desc: "Easy-to-digest, easy-to-cook staples thoughtfully selected for older family members.",
  },
  {
    name: "Custom recurring basket",
    label: "Custom recurring basket — your own chosen items",
    desc: "Build your own basket from our range and have exactly what you want delivered on repeat.",
  },
];

const steps = [
  { title: "Choose plan & frequency", body: "Pick a box concept and how often you'd like it — monthly or your own interval." },
  { title: "Set your delivery day", body: "Tell us the day that suits your kitchen and we'll line up each delivery around it." },
  { title: "Skip or pause anytime", body: "Travelling or well-stocked? Skip a cycle or pause whenever you need to." },
  { title: "Manage from your account", body: "Change items, swap boxes, or cancel — all from your Fresh Origins account." },
];

export default function SubscriptionsPage() {
  return (
    <>
      <div className="fo-container pt-6">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Subscriptions" }]}
        />
      </div>

      {/* Hero */}
      <section className="bg-fo-green-900 py-16 text-[#eafbef]">
        <div className="fo-container max-w-[860px]">
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill bg-fo-lime-500 px-3.5 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-green-900">
            Coming soon
          </span>
          <p className="fo-eyebrow text-fo-lime-500">Subscriptions · Phase 3</p>
          <h1 className="text-white">
            Your monthly essentials, chosen by meal preference and household size.
          </h1>
          <p className="mb-0 text-[1.1rem] text-[#cfe6d6]">
            We&apos;re building Fresh Origins subscriptions so your everyday staples
            arrive on a schedule that suits your kitchen — picked around how you eat and
            how many you feed. It&apos;s launching later, but you can be first to know
            when it&apos;s ready.
          </p>
        </div>
      </section>

      {/* Box concepts */}
      <Section>
        <SectionHead eyebrow="What we're planning" title="Subscription box concepts">
          <p className="mt-3 text-fo-muted">
            A look at the boxes we&apos;re designing. These are early concepts — names,
            contents, and pricing may change before launch.
          </p>
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {boxes.map((box) => (
            <div
              key={box.name}
              className="relative rounded-card border border-fo-line bg-white p-6"
            >
              <span className="absolute right-4 top-4 rounded-pill bg-fo-sage-100 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.05em] text-fo-green-900">
                Planned
              </span>
              <Placeholder ratio="4x3" label={box.label} className="mb-4" />
              <h2 className="mb-1.5 text-[1.1rem]">{box.name}</h2>
              <p className="m-0 text-[0.9rem] text-fo-muted">{box.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[0.9rem] text-fo-muted">
          Boxes are curated food selections — not personalised medical or therapeutic
          plans.
        </p>
      </Section>

      {/* How it will work */}
      <Section tight surface>
        <SectionHead eyebrow="The plan" title="How it will work" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
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

      {/* Waitlist note */}
      <Section tight>
        <div className="max-w-editorial rounded-card border border-fo-line bg-white p-8 text-center">
          <p className="fo-eyebrow">Be first to know</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Join the waitlist</h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-fo-muted">
            A waitlist sign-up will open on this page soon. Waitlist members get early
            access when subscriptions go live. In the meantime, follow us through our
            newsletter or reach out on WhatsApp to register your interest.
          </p>
        </div>
      </Section>

      {/* Disclaimer */}
      <Section tight>
        <Disclaimer title="A note on subscriptions:">
          Subscriptions are a planned feature and not yet available. We do not offer
          personalised medical or therapeutic plans; our boxes are food selections, not
          medical advice.
        </Disclaimer>
      </Section>
    </>
  );
}
