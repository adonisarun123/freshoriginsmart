import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { getHealthGoals } from "@/features/catalogue/queries";

export const metadata: Metadata = {
  title: "Browse by health goal",
  description:
    "Explore Fresh Origins food choices grouped by everyday health goals — protein and fibre, gut health, blood-sugar-conscious eating, and senior nutrition. Educational guidance, not medical treatment.",
};

export default async function HealthGoalsPage() {
  const goals = await getHealthGoals();

  return (
    <>
      {/* Hero */}
      <section className="bg-fo-sage-100 py-14">
        <div className="fo-container max-w-[900px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Health Goals" }]}
          />
          <p className="fo-eyebrow mt-6">
            Health goals · Educational guidance
          </p>
          <h1 className="mb-4 text-[clamp(2.2rem,4.6vw,3.2rem)]">
            Browse by health goal
          </h1>
          <p className="mb-4 max-w-[58ch] text-[1.1rem] text-fo-muted">
            Each goal groups everyday foods by a general nutritional theme — like
            protein and fibre or gut-friendly eating — so it&apos;s easier to
            choose staples that fit how you already cook.
          </p>
          <p className="m-0 text-[0.9rem] font-semibold text-fo-green-900">
            Explore food choices and educational guidance — not medical treatment.
          </p>
        </div>
      </section>

      {/* Goal grid */}
      <Section tight>
        <SectionHead
          eyebrow="Find food by purpose"
          title="Choose a goal to explore"
        >
          <p className="mt-3 text-[0.9rem] text-fo-muted">
            Pick a theme below to read short, expert-reviewed guidance and see the
            Fresh Origins staples that relate to it.
          </p>
        </SectionHead>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              href={`/health-goals/${goal.slug}`}
              className="group flex flex-col rounded-card border border-fo-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-fo-sage-100 text-[1.3rem] text-fo-green-900">
                {goal.icon ?? "◎"}
              </div>
              <h2 className="mb-1.5 text-[1.1rem]">{goal.name}</h2>
              {goal.summary && (
                <p className="text-[0.9rem] text-fo-muted">{goal.summary}</p>
              )}
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[0.85rem] font-semibold text-fo-accent">
                Explore
                <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </span>
              {goal.status === "coming_soon" && (
                <span className="mt-3 inline-block self-start rounded-pill bg-fo-sage-100 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.05em] text-fo-green-900">
                  Coming soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section tight surface>
        <div className="max-w-editorial">
          <Disclaimer title="Educational information, not medical advice.">
            These pages explain general food choices and are not intended to
            diagnose, treat, cure, or prevent any disease. Buying a product does
            not replace medical care, medication, or professional dietary advice.
            Consult a qualified healthcare professional for personalised guidance.
          </Disclaimer>
        </div>
      </Section>
    </>
  );
}
