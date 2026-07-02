import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/commerce/format";
import type { Order, OrderItem, OrderStatus } from "@/types/database";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { formatOrderDate } from "../../../_components/format";
import {
  OrderStatusTag,
  FULFILMENT_STEPS,
  fulfilmentStepIndex,
} from "../../../_components/order-status";

type ShippingAddress = {
  recipient_name?: string | null;
  line1?: string | null;
  line2?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  phone?: string | null;
};

const SOURCE_LABELS: Record<string, string> = {
  whatsapp: "via WhatsApp",
  web: "online",
  admin: "by our team",
  subscription: "as a subscription",
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("public_order_number")
    .eq("id", params.id)
    .maybeSingle();
  return {
    title: data ? `Order ${data.public_order_number}` : "Order",
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // RLS ensures the user can only read their own order.
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .maybeSingle<Order>();

  if (!order) {
    notFound();
  }

  const { data: itemsData } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  const items = (itemsData ?? []) as OrderItem[];
  const address = (order.shipping_address ?? null) as ShippingAddress | null;
  const sourceLabel = SOURCE_LABELS[order.source] ?? "";

  const currentStep = fulfilmentStepIndex(order.status);
  const terminal: OrderStatus[] = ["cancelled", "refunded"];
  const isTerminal = terminal.includes(order.status);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders", href: "/account/orders" },
          { label: order.public_order_number },
        ]}
      />

      <header className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-4">
        <div>
          <h1 className="text-[clamp(1.6rem,2.6vw,2.1rem)]">
            Order {order.public_order_number}
          </h1>
          <p className="mt-1 text-fo-muted">
            Placed {formatOrderDate(order.created_at)} {sourceLabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusTag status={order.status} />
          <Link href="/cart" className="fo-btn-secondary !min-h-0 !px-4 !py-2 text-[0.85rem]">
            Repeat order
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          {/* Status timeline */}
          <section className="fo-card mb-6 p-6">
            <h2 className="text-[1.15rem]">Order status</h2>
            {isTerminal ? (
              <p className="mt-4 rounded-control bg-fo-error/10 px-4 py-3 text-[0.92rem] font-bold text-fo-error">
                This order was {order.status}.
              </p>
            ) : (
              <ol className="mt-5 space-y-0">
                {FULFILMENT_STEPS.map((step, index) => {
                  const done = index < currentStep;
                  const current = index === currentStep;
                  return (
                    <li key={step.status} className="flex gap-4 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold ${
                            done
                              ? "bg-fo-success text-white"
                              : current
                                ? "bg-fo-green-900 text-white"
                                : "border border-fo-line bg-white text-fo-muted"
                          }`}
                        >
                          {done ? "✓" : current ? "●" : ""}
                        </span>
                        {index < FULFILMENT_STEPS.length - 1 && (
                          <span
                            className={`mt-1 w-px flex-1 ${
                              done ? "bg-fo-success" : "bg-fo-line"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-1">
                        <div
                          className={`font-bold ${
                            done || current
                              ? "text-fo-green-900"
                              : "text-fo-muted"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-[0.82rem] text-fo-muted">
                          {step.meta}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* Items */}
          <section className="fo-card p-6">
            <h2 className="text-[1.15rem]">Items</h2>
            <div className="mt-4 divide-y divide-fo-line">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div>
                    <h3 className="text-[0.98rem] font-bold text-fo-charcoal-900">
                      {item.product_name}
                    </h3>
                    <p className="text-[0.8rem] text-fo-muted">
                      {[item.variant_name, item.sku ? `SKU ${item.sku}` : null, `Qty ${item.quantity}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="tabular-nums font-bold text-fo-green-900">
                    {formatINR(item.total_price_paise)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="fo-card p-6">
            <h2 className="text-[1.15rem]">Summary</h2>
            <dl className="mt-4 space-y-2 text-[0.92rem]">
              <div className="flex justify-between">
                <dt className="text-fo-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatINR(order.subtotal_paise)}</dd>
              </div>
              {order.discount_paise > 0 && (
                <div className="flex justify-between">
                  <dt className="text-fo-muted">Discount</dt>
                  <dd className="tabular-nums text-fo-success">
                    −{formatINR(order.discount_paise)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-fo-muted">Delivery</dt>
                <dd className="tabular-nums">
                  {order.shipping_paise > 0
                    ? formatINR(order.shipping_paise)
                    : "To be confirmed"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-fo-line pt-3 text-[1.05rem] font-bold text-fo-green-900">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatINR(order.total_paise)}</dd>
              </div>
            </dl>
          </section>

          {address && (
            <section className="fo-card p-6">
              <h2 className="text-[1.15rem]">Delivery address</h2>
              <address className="mt-3 text-[0.92rem] not-italic leading-relaxed text-fo-charcoal-900">
                {address.recipient_name ?? order.customer_name}
                <br />
                {address.line1}
                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}
                {address.landmark && (
                  <>
                    <br />
                    {address.landmark}
                  </>
                )}
                <br />
                {[address.city, address.state].filter(Boolean).join(", ")}
                {address.pincode ? ` — ${address.pincode}` : ""}
                {(address.phone ?? order.customer_phone) && (
                  <>
                    <br />
                    {address.phone ?? order.customer_phone}
                  </>
                )}
              </address>
            </section>
          )}

          {order.customer_note && (
            <section className="fo-card p-6">
              <h2 className="text-[1.15rem]">Your note</h2>
              <p className="mt-3 text-[0.92rem] text-fo-muted">
                {order.customer_note}
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
