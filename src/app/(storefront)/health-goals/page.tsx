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
    <div className="fo-container">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Health Goals" }]}
      />

      <div className="py-8">
        <p className="fo-eyebrow">Find food by purpose</p>
        <h1 className="mb-3">Browse by health goal</h1>
        <p className="max-w-[60ch] text-fo-muted">
          Each goal groups foods by a general nutritional theme to help you choose.
        </p>
        <p className="mt-3 text-[0.9rem] text-fo-muted">
          Explore food choices and educational guidance — not medical treatment.
        </p>
      </div>

      <Section tight>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              href={`/health-goals/${goal.slug}`}
              className="block rounded-card border border-fo-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-fo-sage-100 text-[1.3rem] text-fo-green-900">
                {goal.icon ?? "◎"}
              </div>
              <h2 className="mb-1.5 text-[1.1rem]">{goal.name}</h2>
              <p className="text-[0.9rem] text-fo-muted">{goal.summary}</p>
              {goal.status === "coming_soon" && (
                <span className="mt-3 inline-block rounded-pill bg-fo-sage-100 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.05em] text-fo-green-900">
                  Coming soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </Section>

      <Section tight>
        <Disclaimer title="Educational information, not medical advice.">
          These pages explain general food choices and are not intended to diagnose,
          treat, cure, or prevent any disease. Buying a product does not replace
          medical care, medication, or professional dietary advice. Consult a
          qualified healthcare professional for personalised guidance.
        </Disclaimer>
      </Section>
    </div>
  );
}
