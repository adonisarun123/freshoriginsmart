import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Section, SectionHead } from "@/components/content/Section";
import { WhatsAppButton } from "@/components/commerce/WhatsAppButton";
import { ContactForm } from "@/features/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Contact & FAQ",
  description:
    "Get in touch with Fresh Origins on WhatsApp or email, and find answers to common questions about delivery, orders, ingredients, and our products.",
};

const channels = [
  { icon: "✆", title: "WhatsApp", body: "+91 XXXXX XXXXX · 9 AM–7 PM, Mon–Sat" },
  { icon: "✉", title: "Email", body: "hello@freshoriginsmart.com" },
  { icon: "⌖", title: "Delivery area", body: "Bangalore & Hosur. More cities coming soon." },
  {
    icon: "⚖",
    title: "Grievance & support",
    body: "Customer support & grievance details to be added before launch (FSSAI / legal entity).",
  },
];

const faqs = [
  {
    q: "Where do you deliver?",
    a: "We currently deliver across Bangalore and Hosur. Enter your pincode on any product or in the cart to check availability. If we don't reach you yet, you can join the waitlist for your area.",
  },
  {
    q: "How do I place an order?",
    a: "Add products to your cart and tap “Order on WhatsApp.” We create a secure order record and open WhatsApp with your order pre-filled. Our team confirms availability and delivery charge before anything is finalised. Online payment is coming in a later phase.",
  },
  {
    q: "How is delivery charged?",
    a: "Delivery charge depends on your area and is confirmed when we process your WhatsApp order. Orders above the free-delivery threshold (shown in your cart) qualify for free delivery.",
  },
  {
    q: "Are your products gluten-free?",
    a: "Some products are wheat-free, and our roti mix is formulated to be gluten-free. Where a product is packed in a facility that also handles gluten, we state this clearly in the allergen section. Always check the allergen block on each product page.",
  },
  {
    q: "How fresh are the products?",
    a: "We pack in small, fresh batches. Each pack carries a batch-specific packing date, shown on the pack and in your order details.",
  },
  {
    q: "Can I return a product?",
    a: "Our shipping and returns policy will be published before launch. For any issue with an order, message us on WhatsApp and we'll make it right.",
  },
];

export default function ContactPage() {
  return (
    <div className="fo-container">
      <JsonLd
        data={faqJsonLd(
          faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
        )}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="max-w-[60ch] py-8">
        <p className="fo-eyebrow">We&apos;re here to help</p>
        <h1 className="mb-3">Contact Fresh Origins</h1>
        <p className="text-fo-muted">
          The fastest way to reach us is WhatsApp. You can also use the channels below
          and we&apos;ll reply by email.
        </p>
      </div>

      <Section tight>
        <div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
          {/* Channels */}
          <div>
            {channels.map((channel) => (
              <div
                key={channel.title}
                className="mb-4 flex items-start gap-3 rounded-card border border-fo-line bg-white p-4"
              >
                <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-fo-sage-100 text-[1.1rem] text-fo-green-900">
                  {channel.icon}
                </div>
                <div>
                  <h2 className="mb-0.5 text-[1.05rem]">{channel.title}</h2>
                  <p className="m-0 text-[0.9rem] text-fo-muted">{channel.body}</p>
                </div>
              </div>
            ))}
            <div className="mt-2">
              <WhatsAppButton />
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHead eyebrow="Common questions" title="Frequently asked questions" />
        <div className="max-w-editorial">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              open={i === 0}
              className="border-b border-fo-line py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.02rem] font-bold">
                {faq.q}
              </summary>
              <p className="mt-3 text-fo-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}
