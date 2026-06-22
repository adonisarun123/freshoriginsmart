import type { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/features/cart/queries";
import { formatINR, discountPercent } from "@/lib/commerce/format";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/content/Section";
import { CartLineControls } from "@/features/cart/CartLineControls";
import { PincodeCheck } from "@/features/cart/PincodeCheck";
import { WhatsAppOrderForm } from "@/features/cart/WhatsAppOrderForm";

// Reads the per-user / guest cart (cookies) — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your cart",
  description:
    "Review your Fresh Origins cart, check delivery availability in Bangalore and Hosur, and complete your order on WhatsApp.",
};

export default async function CartPage() {
  const cart = await getCart();
  const isEmpty = cart.lines.length === 0 || !cart.cartId;

  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <div className="py-8">
        <h1>Your cart</h1>
        <p className="text-fo-muted">
          {isEmpty
            ? "Your cart is empty."
            : `${cart.itemCount} ${cart.itemCount === 1 ? "item" : "items"} · Review your order, then complete it on WhatsApp.`}
        </p>
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          <div className="grid items-start gap-8 pb-8 lg:grid-cols-[1fr_380px]">
            {/* Line items */}
            <section aria-label="Cart items">
              <div className="fo-card">
                {cart.lines.map((line) => {
                  const off = discountPercent(line.mrpPaise, line.unitPricePaise);
                  return (
                    <div
                      key={line.itemId}
                      className="grid grid-cols-[88px_1fr_auto] items-center gap-4 border-b border-fo-line p-4 last:border-b-0"
                    >
                      <Link href={`/products/${line.slug}`} aria-hidden="false">
                        <Placeholder
                          label={line.productName}
                          className="h-[88px] w-[88px] text-[0.62rem]"
                        />
                      </Link>
                      <div>
                        <h4 className="mb-0.5 text-[1rem]">
                          <Link
                            href={`/products/${line.slug}`}
                            className="hover:text-fo-green-600"
                          >
                            {line.productName}
                          </Link>
                        </h4>
                        <p className="mb-2 text-[0.82rem] text-fo-muted">
                          {line.variantName} · SKU {line.sku}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-fo-green-900 tabular-nums">
                            {formatINR(line.unitPricePaise)}
                          </span>
                          {off > 0 && (
                            <>
                              <span className="text-[0.82rem] text-fo-muted line-through tabular-nums">
                                {formatINR(line.mrpPaise)}
                              </span>
                              <span className="fo-badge">{off}% off</span>
                            </>
                          )}
                        </div>
                      </div>
                      <CartLineControls
                        itemId={line.itemId}
                        quantity={line.quantity}
                        productName={line.productName}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link href="/shop" className="fo-btn-secondary">
                  ← Continue shopping
                </Link>
              </div>
            </section>

            {/* Summary */}
            <aside
              aria-label="Order summary"
              className="fo-card sticky top-[90px] p-6"
            >
              <h3 className="text-[1.3rem]">Order summary</h3>

              <div className="mt-4">
                <PincodeCheck />
              </div>

              {/* Disabled coupon (Phase 2) */}
              <div
                aria-disabled="true"
                className="my-4 flex gap-2 opacity-55"
              >
                <input
                  type="text"
                  placeholder="Coupon code"
                  disabled
                  className="flex-1 rounded-control border-[1.5px] border-fo-line px-3 py-2.5"
                />
                <button
                  type="button"
                  disabled
                  className="fo-btn-secondary px-4 py-2.5 text-[0.85rem]"
                >
                  Apply
                </button>
              </div>
              <p className="-mt-2 mb-4 text-[0.75rem] text-fo-muted">
                Coupons will be available with online checkout (Phase 2).
              </p>

              <div className="flex justify-between py-2 text-[0.95rem]">
                <span className="text-fo-muted">Subtotal</span>
                <span className="tabular-nums">{formatINR(cart.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between py-2 text-[0.95rem]">
                <span className="text-fo-muted">Delivery</span>
                <span>Confirmed on WhatsApp</span>
              </div>
              <div className="mt-1.5 flex justify-between border-t border-fo-line pt-4 text-[1.15rem] font-bold text-fo-green-900">
                <span>Cart total</span>
                <span className="tabular-nums">{formatINR(cart.subtotalPaise)}</span>
              </div>

              <a href="#wa-order" className="fo-btn-whatsapp mt-4 w-full">
                Order on WhatsApp
              </a>
              <button
                type="button"
                disabled
                className="fo-btn-primary mt-2.5 w-full opacity-50"
              >
                Pay online (coming soon)
              </button>
              <p className="mt-3 text-center text-[0.78rem] text-fo-muted">
                Online payment arrives in Phase 2. For now, complete your order on
                WhatsApp.
              </p>
            </aside>
          </div>

          {/* WhatsApp order section */}
          <Section id="wa-order" tight>
            <div className="mb-6 max-w-editorial">
              <p className="fo-eyebrow">Complete your order</p>
              <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">
                Order on WhatsApp
              </h2>
              <p className="mt-2 text-fo-muted">
                When you continue, we create a secure order record and open
                WhatsApp with your order pre-filled. No payment is taken yet — our
                team confirms availability and delivery charge first.
              </p>
            </div>
            <WhatsAppOrderForm cartId={cart.cartId!} />
          </Section>
        </>
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="fo-card my-8 flex flex-col items-center gap-4 p-12 text-center">
      <Placeholder label="Fresh Origins" className="h-24 w-24" />
      <h3 className="text-[1.3rem]">Your cart is empty</h3>
      <p className="max-w-md text-fo-muted">
        Explore our purposeful millet blends, traditional rice, and ready-to-cook
        staples — thoughtfully sourced for healthier everyday living.
      </p>
      <Link href="/shop" className="fo-btn-primary">
        Browse the shop
      </Link>
    </div>
  );
}
