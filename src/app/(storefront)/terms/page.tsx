import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of the Fresh Origins website and orders — a working draft to be finalised before launch.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="The fine print"
      title="Terms of Service"
      toc={[
        { id: "use", label: "Use of the site" },
        { id: "orders", label: "Orders & pricing" },
        { id: "whatsapp", label: "WhatsApp ordering" },
        { id: "delivery", label: "Delivery" },
        { id: "ip", label: "Intellectual property" },
        { id: "liability", label: "Limitation of liability" },
      ]}
    >
      <div className="mt-4 rounded-control border border-fo-line border-l-4 border-l-fo-earth-700 bg-fo-cream-50 px-6 py-4 text-[0.88rem] text-fo-muted">
        <strong className="text-fo-earth-700">Draft placeholder.</strong> These Terms of
        Service are a working draft and will be reviewed and finalised before launch.
        Bracketed items such as [Legal entity name] are placeholders.
      </div>

      <p>
        These terms govern your use of the Fresh Origins website and any orders you
        place. By using the site, you agree to these terms. The site is operated by
        [Legal entity name].
      </p>

      <h2 id="use">1. Use of the site</h2>
      <p>
        You may use our site for lawful, personal, non-commercial purposes. You agree
        not to misuse the site, attempt to disrupt it, or use it in any way that
        infringes the rights of others.
      </p>

      <h2 id="orders">2. Orders &amp; pricing</h2>
      <p>
        Prices are shown in Indian Rupees and may change. We make reasonable efforts to
        display accurate prices and availability, but errors may occur; where an error
        is identified, we may cancel or correct the affected order and inform you.
        Acceptance of an order takes place when we confirm it.
      </p>

      <h2 id="whatsapp">3. WhatsApp ordering</h2>
      <p>
        Some orders are completed through WhatsApp. When you choose this option, we
        create an order record and our team confirms availability, delivery charge, and
        delivery details before the order is finalised. Online payment is a planned
        feature for a later phase.
      </p>

      <h2 id="delivery">4. Delivery</h2>
      <p>
        We currently deliver across Bangalore and Hosur. Delivery timelines and charges
        are confirmed at the time of order and are subject to serviceability of your
        area. See our <a href="/shipping-returns">Shipping &amp; Returns</a> policy for
        details.
      </p>

      <h2 id="ip">5. Intellectual property</h2>
      <p>
        All content on this site — including text, design, logos, and images — belongs to
        [Legal entity name] or its licensors and is protected by applicable laws. You may
        not reproduce or reuse it without permission.
      </p>

      <h2 id="liability">6. Limitation of liability</h2>
      <p>
        To the extent permitted by law, Fresh Origins is not liable for indirect or
        consequential losses arising from use of the site or products. Nothing in these
        terms limits liability that cannot be excluded under applicable law. [Final
        liability wording to be confirmed before launch.] Questions? Reach us through our{" "}
        <a href="/contact">contact page</a>.
      </p>
    </LegalPage>
  );
}
