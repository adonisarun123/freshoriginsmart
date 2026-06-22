import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Fresh Origins shipping and returns policy — delivery areas, timelines, charges, and how we handle issues with food orders. A working draft to be finalised before launch.",
};

export default function ShippingReturnsPage() {
  return (
    <LegalPage
      eyebrow="Delivery & support"
      title="Shipping & Returns"
      toc={[
        { id: "areas", label: "Delivery areas" },
        { id: "timelines", label: "Timelines" },
        { id: "charges", label: "Charges & free delivery" },
        { id: "freshness", label: "Freshness & packing dates" },
        { id: "returns", label: "Returns & issues" },
        { id: "contact", label: "Contact" },
      ]}
    >
      <div className="mt-4 rounded-control border border-fo-line border-l-4 border-l-fo-earth-700 bg-fo-cream-50 px-6 py-4 text-[0.88rem] text-fo-muted">
        <strong className="text-fo-earth-700">Draft placeholder.</strong> This Shipping
        &amp; Returns policy is a working draft and will be reviewed and finalised before
        launch. Specific timelines, charges, and thresholds are placeholders.
      </div>

      <p>
        This policy explains how we deliver Fresh Origins products and how we handle any
        issues with your order. Because our products are foods, some standard
        return rules differ — please read the returns section carefully.
      </p>

      <h2 id="areas">1. Delivery areas</h2>
      <p>
        We currently deliver across Bangalore and Hosur, with more cities planned. Enter
        your pincode on a product page or in the cart to check serviceability. If we
        don&apos;t reach you yet, you can register interest for your area.
      </p>

      <h2 id="timelines">2. Timelines</h2>
      <p>
        Orders are typically delivered within 2–3 days of confirmation, depending on
        your area and product availability. We confirm the expected timeline when we
        process your order. [Exact timelines to be confirmed before launch.]
      </p>

      <h2 id="charges">3. Charges &amp; free delivery</h2>
      <p>
        Delivery charge depends on your area and is confirmed when we process your order.
        Orders above the free-delivery threshold shown in your cart qualify for free
        delivery. [Threshold and charges to be confirmed before launch.]
      </p>

      <h2 id="freshness">4. Freshness &amp; packing dates</h2>
      <p>
        We pack in small, fresh batches. Each pack carries a batch-specific packing date,
        shown on the pack and in your order details, along with the shelf life for that
        product.
      </p>

      <h2 id="returns">5. Returns &amp; issues</h2>
      <p>
        As food products, items cannot generally be returned once delivered for hygiene
        and safety reasons. However, if a product arrives damaged, incorrect, or with a
        quality issue, contact us promptly and we will replace it or make it right.
        Please keep the packaging and batch details so we can investigate. [Final returns
        window and process to be confirmed before launch.]
      </p>

      <h2 id="contact">6. Contact</h2>
      <p>
        For any delivery question or order issue, message us on WhatsApp or reach us
        through our <a href="/contact">contact page</a>. Operated by [Legal entity name],
        [registered address], India.
      </p>
    </LegalPage>
  );
}
