import type { Metadata } from "next";
import { Section, SectionHead } from "@/components/content/Section";
import { WhatsAppButton } from "@/components/commerce/WhatsAppButton";
import { EnquiryForm } from "@/features/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "For Business — Partnerships & Enquiries",
  description:
    "Partner with Fresh Origins — retail and supermarkets, distributors, apartment communities, corporate wellness, and nutrition professionals. Submit a tailored enquiry.",
};

const audiences = [
  {
    icon: "▤",
    title: "Retail & supermarkets",
    body: "Stock our range with merchandising support.",
    points: ["Pack sizes, shelf life & MRP", "Wholesale & minimum-order enquiry", "Geographic availability"],
  },
  {
    icon: "⇄",
    title: "Distributors",
    body: "Grow Fresh Origins in your territory.",
    points: ["Territory & channel fit", "Warehousing & sales capacity", "GST & trade terms"],
  },
  {
    icon: "⌂",
    title: "Apartment communities",
    body: "Bring healthier staples to residents.",
    points: ["Sampling events & group orders", "Resident wellness sessions", "Subscription delivery points"],
  },
  {
    icon: "♥",
    title: "Corporate wellness",
    body: "Support employee health programmes.",
    points: ["Healthy pantry products", "Curated gift boxes", "Nutrition sessions"],
  },
  {
    icon: "✚",
    title: "Nutrition professionals",
    body: "A partnership, not a paid endorsement.",
    points: ["Education & content review", "Sampling & referral", "Institutional purchase"],
  },
  {
    icon: "◈",
    title: "Wellness centres",
    body: "Offer trusted staples to your members.",
    points: ["Bulk & programme purchase", "Member education", "Co-hosted sessions"],
  },
];

export default function ForBusinessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-fo-green-900 py-16 text-[#eafbef]">
        <div className="fo-container max-w-[860px]">
          <p className="fo-eyebrow text-fo-lime-300">For Business</p>
          <h1 className="text-white">Partner with Fresh Origins</h1>
          <p className="mb-0 text-[1.1rem] text-[#cfe6d6]">
            Tailored proof points and a dedicated enquiry path for every partner —
            retail, distribution, communities, corporate wellness, and nutrition
            professionals.
          </p>
        </div>
      </section>

      {/* Audience cards */}
      <Section>
        <SectionHead eyebrow="Who we work with" title="Ways to partner" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map((aud) => (
            <div
              key={aud.title}
              className="rounded-card border border-fo-line bg-white p-6"
            >
              <div className="mb-3 grid h-[46px] w-[46px] place-items-center rounded-full bg-fo-sage-100 text-[1.2rem] text-fo-green-900">
                {aud.icon}
              </div>
              <h2 className="mb-1.5 text-[1.1rem]">{aud.title}</h2>
              <p className="mb-3 text-[0.9rem] text-fo-muted">{aud.body}</p>
              <ul className="list-disc pl-[1.1em] text-[0.85rem] text-fo-muted">
                {aud.points.map((p) => (
                  <li key={p} className="mb-1">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Enquiry */}
      <Section tight surface id="enquiry">
        <SectionHead eyebrow="Get in touch" title="Submit a business enquiry">
          <p className="mt-3 text-fo-muted">
            Tell us about your organisation and what you&apos;re looking for. We review
            business enquiries within 2–3 working days and route them to the right team.
          </p>
        </SectionHead>
        <div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded-card border border-fo-line bg-fo-cream-50 p-6">
            <h3 className="text-[1.1rem]">What to expect</h3>
            <p className="mb-4 text-[0.9rem] text-fo-muted">
              We review business enquiries within 2–3 working days and route them to the
              right team. For faster contact, you can also reach us on WhatsApp.
            </p>
            <div className="mb-4">
              <WhatsAppButton href="/contact" />
            </div>
            <p className="text-[0.9rem] text-fo-muted">
              Professional partnerships are positioned as collaboration and content
              review — not paid medical endorsement.
            </p>
          </div>
          <EnquiryForm />
        </div>
      </Section>
    </>
  );
}
