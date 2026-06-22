import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Fresh Origins collects, uses, and protects your personal information — a working draft to be finalised before launch.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your data"
      title="Privacy Policy"
      toc={[
        { id: "what-we-collect", label: "What we collect" },
        { id: "how-we-use", label: "How we use your data" },
        { id: "sharing", label: "Sharing & processors" },
        { id: "retention", label: "Retention" },
        { id: "your-rights", label: "Your rights" },
        { id: "contact", label: "Contact" },
      ]}
    >
      <div className="mt-4 rounded-control border border-fo-line border-l-4 border-l-fo-earth-700 bg-fo-cream-50 px-6 py-4 text-[0.88rem] text-fo-muted">
        <strong className="text-fo-earth-700">Draft placeholder.</strong> This Privacy
        Policy is a working draft and will be reviewed and finalised before launch.
        Bracketed items such as [Legal entity name] are placeholders.
      </div>

      <p>
        [Legal entity name] (&ldquo;Fresh Origins,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us&rdquo;) respects your privacy. This policy explains what personal
        information we collect when you use our website or place an order, how we use it,
        and the choices you have.
      </p>

      <h2 id="what-we-collect">1. What we collect</h2>
      <p>
        We collect information you give us directly — such as your name, phone number,
        email address, and delivery address when you place an order or make an enquiry —
        and basic technical information (such as device and usage data) collected
        automatically as you browse.
      </p>

      <h2 id="how-we-use">2. How we use your data</h2>
      <p>
        We use your information to process and deliver orders, respond to enquiries,
        provide customer support, improve our products and website, and — where you have
        opted in — send you updates. We process WhatsApp orders to confirm availability,
        delivery charge, and delivery details.
      </p>

      <h2 id="sharing">3. Sharing &amp; processors</h2>
      <p>
        We share data only with service providers who help us operate (for example,
        delivery partners and messaging or hosting providers) and where required by law.
        We do not sell your personal information. [List of processors to be confirmed
        before launch.]
      </p>

      <h2 id="retention">4. Retention</h2>
      <p>
        We keep personal information only as long as needed for the purposes described
        here or as required by law. Order records are retained for accounting and
        compliance for the period required under applicable Indian law.
      </p>

      <h2 id="your-rights">5. Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal
        information, and you may withdraw consent to marketing at any time. To exercise
        these rights, contact us using the details below. [Specific statutory rights and
        timelines to be confirmed before launch.]
      </p>

      <h2 id="contact">6. Contact</h2>
      <p>
        For privacy questions or requests, reach us through our{" "}
        <a href="/contact">contact page</a>. Operated by [Legal entity name],
        [registered address], India · Grievance officer: [name &amp; contact to be
        confirmed before launch].
      </p>
    </LegalPage>
  );
}
