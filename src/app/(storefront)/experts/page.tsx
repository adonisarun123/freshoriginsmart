import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";

export const metadata: Metadata = {
  title: "Meet the Experts",
  description:
    "Fresh Origins works with qualified nutritionists and dietitians who review specific content for accuracy. Meet our reviewers, understand what 'reviewed' means, and see our content review workflow.",
};

const meaning = [
  {
    icon: "⌖",
    title: "Specific content, defined scope",
    body: "Experts review specific content within their stated scope — for example, the educational accuracy of one article or product page — not the whole site or brand.",
  },
  {
    icon: "✓",
    title: "Nutritional & educational accuracy",
    body: "Review is for nutritional and educational accuracy: that the information is current, fairly presented, and consistent with reputable guidance.",
  },
  {
    icon: "⊘",
    title: "Not a medical endorsement",
    body: "Review is NOT a medical endorsement of the whole brand or a treatment claim. It does not say a product cures, treats, or prevents any condition.",
  },
];

const experts = [
  {
    cred: "RD, MSc Nutrition",
    bio: "Clinical dietitian focused on everyday balanced eating and plant-forward Indian meal patterns.",
    areas: ["Protein & Fibre", "Balanced Meals"],
    scope: "Nutritional accuracy of protein- and fibre-related educational content. Not a product or treatment endorsement.",
  },
  {
    cred: "RD, PhD Food Science",
    bio: "Researcher in whole grains and digestive health with a focus on fibre and traditional grains.",
    areas: ["Gut Health", "Whole Grains"],
    scope: "Educational accuracy of gut-health and fibre content. Not a medical endorsement of any product.",
  },
  {
    cred: "RD, Geriatric Nutrition",
    bio: "Dietitian specialising in nutrition for older adults and easy-to-digest everyday staples.",
    areas: ["Senior Nutrition", "Easy Digestion"],
    scope: "Nutritional accuracy of senior-nutrition educational content. Not a treatment claim.",
  },
  {
    cred: "RD, Paediatric Nutrition",
    bio: "Paediatric dietitian advising on age-appropriate, balanced foods for growing children.",
    areas: ["Child Nutrition", "Family Meals"],
    scope: "Educational accuracy of child- and family-nutrition content. Not medical or dietary advice.",
  },
];

const flow = [
  { n: 1, title: "Draft", body: "Our writers prepare the content with clear, careful language." },
  { n: 2, title: "Expert review", body: "A qualified reviewer checks the content for nutritional accuracy, within their scope." },
  { n: 3, title: "Compliance review", body: "Claims, allergens, and disclaimers are checked against labelling and advertising rules." },
  { n: 4, title: "Published", body: "The content goes live with reviewer scope and review dates shown where applicable." },
];

export default function ExpertsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-fo-sage-100 py-16">
        <div className="fo-container max-w-[900px]">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Learn", href: "/learn" },
              { label: "Meet the Experts" },
            ]}
          />
          <p className="fo-eyebrow mt-6">Reviewed for accuracy</p>
          <h1 className="mb-4">Meet the experts</h1>
          <p className="m-0 text-[1.1rem] text-fo-muted">
            Fresh Origins works with qualified nutritionists and dietitians who review
            specific content for accuracy. Our experts are reviewers with an explicit,
            defined scope — they check selected educational and nutritional material so
            you can trust what you read, and we make plain exactly what each review does
            and does not cover.
          </p>
        </div>
      </section>

      {/* What "reviewed" means */}
      <Section>
        <SectionHead eyebrow="An important distinction" title='What "reviewed" means'>
          <p className="mt-3 max-w-[60ch] text-fo-muted">
            When you see a &ldquo;reviewed for accuracy&rdquo; note on our content, it
            means a qualified expert has checked that specific piece of content within a
            clearly defined scope. It is not a blanket endorsement of Fresh Origins or
            any of our products.
          </p>
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-3">
          {meaning.map((m) => (
            <div
              key={m.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-fo-sage-100 text-[1.2rem] text-fo-green-900">
                {m.icon}
              </div>
              <h3 className="mb-1.5 text-[1.1rem]">{m.title}</h3>
              <p className="m-0 text-[0.9rem] text-fo-muted">{m.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-editorial text-[0.9rem] text-fo-muted">
          In short: a review tells you that a defined piece of content was checked for
          accuracy by a qualified person. It never means an expert is recommending Fresh
          Origins as a brand or prescribing a product for a health condition.
        </p>
      </Section>

      {/* Expert profile cards */}
      <Section tight surface>
        <SectionHead
          eyebrow="Our reviewers"
          title="The experts who review our content"
        >
          <p className="mt-3 text-[0.9rem] text-fo-muted">
            Profiles below are placeholders. Real reviewer profiles appear here only
            after a qualified expert has been formally onboarded and has agreed to a
            defined scope of review.
          </p>
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {experts.map((expert, i) => (
            <article
              key={i}
              className="flex flex-col rounded-card border border-fo-line bg-white p-6"
            >
              <div className="mb-4 grid h-16 w-16 flex-none place-items-center rounded-full bg-fo-sage-100 text-[1.3rem] font-bold text-fo-green-900">
                RD
              </div>
              <h3 className="mb-0.5 text-[1.1rem]">[Registered Dietitian name]</h3>
              <p className="mb-3 text-[0.82rem] font-bold text-fo-accent">
                {expert.cred}
              </p>
              <p className="mb-4 text-[0.9rem] text-fo-muted">{expert.bio}</p>
              <span className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.06em] text-fo-muted">
                Areas of review
              </span>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {expert.areas.map((a) => (
                  <span key={a} className="fo-badge">
                    {a}
                  </span>
                ))}
              </div>
              <p className="mt-auto border-t border-fo-line pt-3 text-[0.82rem] text-fo-muted">
                <strong className="text-fo-green-900">Scope:</strong> {expert.scope}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Workflow */}
      <Section tight>
        <SectionHead
          eyebrow="How content gets published"
          title="Our content review workflow"
        >
          <p className="mt-3 max-w-[60ch] text-fo-muted">
            Health and nutrition content moves through a defined sequence before it goes
            live. Expert review is one step in this process — focused on accuracy,
            within scope.
          </p>
        </SectionHead>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((step) => (
            <div
              key={step.n}
              className="rounded-card border border-fo-line bg-white p-6 text-center"
            >
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-fo-green-900 font-display text-[1.1rem] font-[650] text-white">
                {step.n}
              </div>
              <h3 className="mb-1 text-[1rem]">{step.title}</h3>
              <p className="m-0 text-[0.82rem] text-fo-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Disclaimer */}
      <Section tight>
        <Disclaimer title="About expert review:">
          Experts review selected content within a defined scope. Their involvement does
          not constitute a medical endorsement of the brand or any product, and is not a
          substitute for personalised professional advice.
        </Disclaimer>
      </Section>
    </>
  );
}
