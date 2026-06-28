import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { TrackView } from "@/components/analytics/TrackView";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Fresh Origins — ordering and WhatsApp checkout, delivery across Bangalore and Hosur, our millets, rice and ready-to-cook mixes, ingredients and allergens, payments, and wholesale.",
};

/* -------------------------------------------------------------------------- */
/*  Global FAQ content                                                         */
/*  Grouped, factual, claim-disciplined — no urgency or medical claims.        */
/* -------------------------------------------------------------------------- */

type Faq = { q: string; a: string };
type FaqGroup = { id: string; title: string; faqs: Faq[] };

const faqGroups: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering & delivery",
    faqs: [
      {
        q: "Where do you deliver?",
        a: "We currently deliver across Bangalore and Hosur, with more areas planned. Enter your pincode on any product page or in the cart to check whether we reach you. If we don't serve your area yet, you can register interest so we can prioritise it.",
      },
      {
        q: "How do I place an order?",
        a: "Add items to your cart and check out on the website, or complete your purchase on WhatsApp — whichever is easier for you. On WhatsApp we confirm your items, delivery area and total before anything is finalised.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders are typically delivered within 2–3 days of confirmation, depending on your area and product availability. We confirm the expected timeline when we process your order. (Exact timelines are being finalised ahead of launch.)",
      },
      {
        q: "Is there a delivery charge?",
        a: "Delivery charge depends on your area and is shown when we process your order. Orders above the free-delivery threshold shown in your cart qualify for free delivery. (Threshold and charges are being finalised ahead of launch.)",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is confirmed you'll receive an order number. You can view status from your account, and we keep you updated on WhatsApp through to delivery.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & ingredients",
    faqs: [
      {
        q: "What does Fresh Origins sell?",
        a: "Purposeful millet blends, traditional rice varieties, and ready-to-cook staples — khichdi, adai, kanji and roti mixes — built from whole millets, pulses and traditional grains. Each product is designed to keep a familiar Indian meal recognisable while using whole grains and pulses.",
      },
      {
        q: "Do your products contain maida or added sugar?",
        a: "No. There is no maida (refined wheat flour) and no added sugar across the range. Every ingredient is listed on the pack in descending order of quantity, with nothing hidden.",
      },
      {
        q: "Are your products gluten-free?",
        a: "Most millets are naturally free from gluten, and some products are made to be wheat-free or gluten-free*. Where a gluten-free claim applies, it is subject to validated cross-contamination control and final testing. Always check the specific pack and the allergen line, as several products are made in a facility that also handles cereals containing gluten and tree nuts.",
      },
      {
        q: "Where are your ingredients sourced?",
        a: "We work with traditional grain and pulse varieties and show the grain variety and region of origin wherever available — on the pack and on the product page. You can read more on our Our Sourcing pages.",
      },
      {
        q: "Are the nutrition values verified?",
        a: "Nutrition is shown per serving and per 100 g on each product page. Some launch values are indicative prototype figures pending final lab validation; the pack carries the verified nutrition information for that batch.",
      },
      {
        q: "Do you make health or medical claims?",
        a: "No. Our health-goal categories and educational content are about everyday food choices and grain education — not medical treatment or advice. For dietary or medical guidance specific to you, please consult a qualified professional.",
      },
    ],
  },
  {
    id: "cooking",
    title: "Cooking & storage",
    faqs: [
      {
        q: "How do I cook the ready-to-cook mixes?",
        a: "Each mix is made to cook the way you already prepare the dish — follow the steps on the pack and on the product page. Most one-pot khichdi and kanji mixes are ready in around 15–18 minutes; batter-based adai mixes need a short rest before pan-cooking.",
      },
      {
        q: "Do I need to soak millets and traditional rice?",
        a: "Soaking is recommended. A 20–30 minute soak for millets, and 30–45 minutes for whole and coloured rice (a little longer for black rice), softens the grain, shortens cooking and improves texture.",
      },
      {
        q: "How should I store the products?",
        a: "Store in a cool, dry place away from direct sunlight, and reseal the pack after opening. Each pack carries a batch-specific packing date and the shelf life for that product.",
      },
      {
        q: "Where can I find recipes?",
        a: "Our Recipes section has dishes matched to specific products — from millet khichdi bowls to protein adai and heritage kanji. Each product page also links to a recipe where one is available.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & account",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "You can pay through the supported online payment options shown at checkout, or complete payment when ordering on WhatsApp. The available methods are confirmed at the point of checkout.",
      },
      {
        q: "Do I need an account to order?",
        a: "You can browse and start an order without an account. Creating an account lets you view your orders and saved addresses and makes reordering faster.",
      },
      {
        q: "Can I order in bulk or for a group?",
        a: "Yes. For larger household, apartment-community, corporate or retail quantities, see our For Business page and send an enquiry — we'll respond with options suited to your needs.",
      },
    ],
  },
  {
    id: "business",
    title: "Business & wholesale",
    faqs: [
      {
        q: "Do you work with retailers and supermarkets?",
        a: "Yes. We share range, pack sizes, shelf life and wholesale details with retail and supermarket partners. Start on the For Business page and choose the retail enquiry path.",
      },
      {
        q: "Can you support apartment communities or corporate wellness?",
        a: "We work with apartment communities on sampling, group orders and wellness sessions, and with workplaces on healthy pantry products and curated gift boxes. Tell us about your requirement through the For Business enquiry form.",
      },
      {
        q: "Are you open to nutrition professionals?",
        a: "Yes. We provide education, content review and institutional purchase options for nutrition professionals. Reach out through the For Business page.",
      },
    ],
  },
];

const allFaqs: Faq[] = faqGroups.flatMap((g) => g.faqs);

export default function FaqPage() {
  return (
    <>
      <TrackView event="view_page" properties={{ page: "faq" }} />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "FAQ", url: "/faq" },
          ]),
          faqJsonLd(allFaqs.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <div className="fo-container">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        />
      </div>

      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="fo-container max-w-editorial">
          <p className="fo-eyebrow">Questions? We&apos;ve got answers</p>
          <h1 className="mb-4 text-[clamp(2.1rem,4.5vw,3.1rem)]">
            Frequently asked questions
          </h1>
          <p className="text-[1.05rem] text-fo-muted">
            Everything about ordering, delivery across Bangalore and Hosur, our
            millets, rice and ready-to-cook mixes, ingredients and allergens,
            payments, and wholesale. Can&apos;t find what you need? Reach us on{" "}
            <Link
              href="/contact"
              className="font-semibold text-fo-accent underline underline-offset-2 hover:text-fo-green-900"
            >
              our contact page
            </Link>
            .
          </p>

          {/* Quick jump links */}
          <nav className="mt-6 flex flex-wrap gap-2.5" aria-label="FAQ sections">
            {faqGroups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="inline-flex items-center rounded-pill border border-fo-line bg-white px-4 py-2 text-[0.88rem] font-semibold text-fo-green-900 transition hover:border-fo-green-600 hover:shadow-card"
              >
                {g.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* FAQ groups */}
      {faqGroups.map((group, idx) => (
        <Section key={group.id} tight surface={idx % 2 === 0} id={group.id}>
          <SectionHead title={group.title} />
          <div className="max-w-editorial divide-y divide-fo-line rounded-card border border-fo-line bg-white">
            {group.faqs.map((faq) => (
              <details key={faq.q} className="group px-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-semibold text-fo-green-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="text-fo-green-600 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[0.95rem] text-fo-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </Section>
      ))}

      {/* Still need help */}
      <Section tight>
        <div className="max-w-editorial rounded-card border border-fo-line bg-fo-sage-100 p-8">
          <h2 className="mb-2 text-[1.4rem]">Still have a question?</h2>
          <p className="mb-5 text-fo-muted">
            We&apos;re happy to help with anything about products, an order, or
            delivery to your area.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="fo-btn-primary">
              Contact us
            </Link>
            <Link href="/shop" className="fo-btn-secondary">
              Shop the range
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
