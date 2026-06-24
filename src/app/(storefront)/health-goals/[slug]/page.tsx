import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { Disclaimer } from "@/components/content/Disclaimer";
import { Illustration } from "@/components/brand/Illustration";
import { ProductCard } from "@/components/commerce/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { TrackView } from "@/components/analytics/TrackView";
import {
  getHealthGoals,
  getHealthGoalBySlug,
  getProductsForHealthGoal,
} from "@/features/catalogue/queries";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const goals = await getHealthGoals();
  return goals.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const goal = await getHealthGoalBySlug(params.slug);
  if (!goal) return { title: "Health goal" };
  return {
    title: `Food choices for ${goal.name.toLowerCase()}`,
    description:
      goal.summary ??
      `Learn how everyday foods fit a ${goal.name.toLowerCase()} eating pattern, and explore Fresh Origins products that may suit it.`,
  };
}

const faqs = [
  {
    q: "How much do I actually need?",
    a: "Needs vary by age, body size, activity, and health conditions. This page offers general food guidance; for personalised targets, consult a qualified dietitian or healthcare professional.",
  },
  {
    q: "Can I meet this on a vegetarian diet?",
    a: "Yes — combining whole grains and pulses across the day is a well-established way to build balanced vegetarian meals, alongside dairy, nuts, and seeds.",
  },
  {
    q: "Are these products a replacement for medical or dietary advice?",
    a: "No. They are foods that can fit into a balanced diet. They are not a treatment and do not replace professional advice.",
  },
];

export default async function HealthGoalPage({ params }: PageProps) {
  const goal = await getHealthGoalBySlug(params.slug);
  if (!goal) notFound();

  const products = await getProductsForHealthGoal(goal.id);
  const goalName = goal.name.toLowerCase();

  return (
    <>
      <TrackView
        event="select_health_goal"
        properties={{ goal: params.slug, count: products.length }}
      />
      {products.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            products.map((product) => ({
              name: product.name,
              url: `/products/${product.slug}`,
            })),
          )}
        />
      )}

      {/* 1. Hero */}
      <section className="bg-fo-sage-100 py-16">
        <div className="fo-container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Health Goals", href: "/health-goals" },
              { label: goal.name },
            ]}
          />
          <div className="mt-6 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="fo-eyebrow">Health goal · Educational guidance</p>
              <h1 className="mb-4 text-[clamp(2.1rem,4.4vw,3.1rem)]">
                Food choices for {goalName}
              </h1>
              <p className="mb-0 max-w-[58ch] text-[1.1rem] text-fo-muted">
                {goal.summary ??
                  `Everyday foods, grouped to help you build meals around ${goalName} — practical guidance, not medical treatment.`}
              </p>
            </div>
            <Illustration
              name="goal"
              title={`${goal.name} — food guidance`}
              className="aspect-[4/3] rounded-hero"
            />
          </div>
        </div>
      </section>

      {/* 2. AEO "In short" answer block + editorial */}
      <Section>
        <div className="max-w-editorial">
          <div className="mb-12 rounded-card border border-fo-line border-l-4 border-l-fo-green-600 bg-white p-6 shadow-soft">
            <span className="mb-2 block text-[0.78rem] font-bold uppercase tracking-[0.06em] text-fo-accent">
              In short
            </span>
            <p className="m-0 text-[1.08rem]">
              {capitalise(goalName)} is supported by your overall pattern of
              meals rather than any single ingredient. Choosing whole grains over
              refined ones where you can, combining grains with pulses, and
              including vegetables and seeds all help. Fresh Origins builds several
              ready-to-cook staples around this pattern, so familiar Indian meals
              can carry more of what this theme calls for, per serving.
            </p>
          </div>

          {/* 3. What this goal means + how food fits */}
          <h2 className="text-[1.6rem]">What this goal means</h2>
          <p>
            A {goalName} approach isn&apos;t about a single &ldquo;super&rdquo;
            ingredient. It&apos;s about the overall pattern of your meals: choosing
            whole grains over refined ones where you can, combining grains with
            pulses, and including vegetables and seeds. Done consistently, this
            pattern tends to make meals more satisfying and supports a balanced
            diet.
          </p>

          <h3 className="mt-8 text-[1.2rem]">How food choices fit</h3>
          <p>
            Whole grains and millets contribute dietary fibre and add to the
            protein in a meal. Pulses — moong, chana, urad and others — bring
            complementary plant protein. Eating them together across the day is a
            long-standing feature of Indian cooking, from adai to khichdi to
            dal-rice.
          </p>
          <p>
            Small, repeatable swaps usually matter more than dramatic changes.
            Varying your grains across the week, keeping refined flour and added
            sugar to a minimum, and pairing staples with vegetables are everyday
            habits that align well with a {goalName} pattern.
          </p>
        </div>
      </Section>

      {/* 4. Relevant products */}
      {products.length > 0 && (
        <Section tight surface>
          <SectionHead
            eyebrow="Products that may fit this goal"
            title={`Staples for ${goalName}`}
          >
            <p className="mt-3 text-[0.9rem] text-fo-muted">
              Each product appears here because it has a documented, reviewed
              relationship to this goal — not an automatic tag.
            </p>
          </SectionHead>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )}

      {/* 5. How to use them in a balanced meal */}
      <Section tight>
        <SectionHead
          eyebrow="Putting it on the plate"
          title="How to use them in a balanced meal"
        />
        <div className="max-w-editorial">
          <p>
            Build a plate around a whole-grain or millet base, add a pulse element,
            and include a vegetable plus a healthy fat such as a small amount of
            ghee, nuts, or seeds. Keep portions reasonable and rotate your grains
            across the week rather than relying on one.
          </p>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
            {[
              "Start with a whole grain or millet you already enjoy.",
              "Add a pulse — dal, sprouts, or a ready mix — for protein and fibre.",
              "Fill the rest of the plate with vegetables and a little healthy fat.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="font-bold text-fo-green-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 6. Expert reviewer */}
      <Section tight surface>
        <p className="fo-eyebrow">Reviewed for accuracy</p>
        <div className="flex max-w-editorial items-center gap-4 rounded-card border border-fo-line bg-white p-6">
          <div className="grid h-16 w-16 flex-none place-items-center rounded-full bg-fo-sage-100 text-[1.3rem] font-bold text-fo-green-900">
            RD
          </div>
          <div>
            <h3 className="mb-0.5 text-[1.1rem]">
              Reviewed by [Registered Dietitian name]
            </h3>
            <p className="m-0 text-[0.88rem] text-fo-muted">
              RD · Scope of review: nutritional accuracy of educational content on
              this page. Reviewed [date]. Next review: [date].
            </p>
          </div>
        </div>
        <p className="mt-3 max-w-editorial text-[0.9rem] text-fo-muted">
          Reviewer details shown are placeholders until an expert is formally
          onboarded. The reviewer checks educational accuracy — this is not a
          medical endorsement of any product.
        </p>
      </Section>

      {/* 7. References */}
      <Section tight>
        <p className="fo-eyebrow">References</p>
        <div className="max-w-editorial text-[0.88rem] text-fo-muted">
          <ol className="list-decimal pl-5">
            <li className="mb-1.5">
              Dietary guidance on whole grains and dietary fibre — [authoritative
              source placeholder].
            </li>
            <li className="mb-1.5">
              Plant protein and grain–pulse complementarity — [authoritative
              source placeholder].
            </li>
            <li className="mb-1.5">
              FSSAI nutrition and labelling guidance — [reference placeholder].
            </li>
          </ol>
          <p>
            Sources are placeholders pending the content-approval workflow (writer
            → expert review → compliance review → published).
          </p>
        </div>
      </Section>

      {/* 8. FAQ */}
      <Section tight surface>
        <p className="fo-eyebrow">Questions</p>
        <h2 className="mb-6 text-[clamp(1.9rem,3.4vw,2.6rem)]">
          Frequently asked questions
        </h2>
        <div className="max-w-editorial">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              open={i === 0}
              className="border-b border-fo-line py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-[1.02rem] font-bold">
                {faq.q}
              </summary>
              <p className="mt-3 text-fo-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* 9. Disclaimer */}
      <Section tight>
        <div className="max-w-editorial">
          <Disclaimer title="Educational information, not medical advice.">
            This page explains general food choices and is not intended to
            diagnose, treat, cure, or prevent any disease. Buying a product does
            not replace medical care, medication, or professional dietary advice.
            Consult a qualified healthcare professional for personalised guidance.
          </Disclaimer>
        </div>
      </Section>
    </>
  );
}

function capitalise(value: string): string {
  return value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value;
}
