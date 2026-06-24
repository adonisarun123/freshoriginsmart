import type { Metadata } from "next";
import { createHash } from "crypto";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { formatINR } from "@/lib/commerce/format";
import { buildWhatsAppUrl } from "@/lib/whatsapp/order-message";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Illustration } from "@/components/brand/Illustration";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order summary",
  description: "Order details and status for your Fresh Origins order.",
  robots: { index: false, follow: false },
};

/**
 * order_status enum → friendly label. Steps are ordered for the timeline; the
 * "current" step is the order's status (or the closest preceding tracked step).
 */
const TIMELINE: { status: string; title: string; meta: string }[] = [
  { status: "whatsapp_pending", title: "Order placed", meta: "WhatsApp order created" },
  {
    status: "awaiting_confirmation",
    title: "Awaiting confirmation",
    meta: "We're confirming availability and delivery charge.",
  },
  { status: "confirmed", title: "Confirmed", meta: "Final order & delivery charge confirmed" },
  { status: "packed", title: "Packed", meta: "Packed fresh for dispatch" },
  { status: "out_for_delivery", title: "Out for delivery", meta: "On the way to you" },
  { status: "delivered", title: "Delivered", meta: "Delivered to you" },
];

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  whatsapp_pending: "Order placed",
  awaiting_confirmation: "Awaiting confirmation",
  confirmed: "Confirmed",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

interface OrderRow {
  id: string;
  public_order_number: string;
  public_token_hash: string;
  status: string;
  subtotal_paise: number;
  shipping_paise: number;
  total_paise: number;
  created_at: string;
}

interface OrderItemRow {
  product_name: string;
  variant_name: string | null;
  sku: string | null;
  quantity: number;
  unit_price_paise: number;
  total_price_paise: number;
}

export default async function OrderSummaryPage({
  params,
  searchParams,
}: {
  params: { number: string };
  searchParams: { t?: string };
}) {
  const token = searchParams.t;
  if (!token) notFound();
  if (!hasSupabaseAdminEnv()) notFound();

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      "id, public_order_number, public_token_hash, status, subtotal_paise, shipping_paise, total_paise, created_at",
    )
    .eq("public_order_number", params.number)
    .maybeSingle<OrderRow>();

  if (!order) notFound();

  const tokenHash = createHash("sha256").update(token).digest("hex");
  if (tokenHash !== order.public_token_hash) notFound();

  const { data: itemsData } = await admin
    .from("order_items")
    .select(
      "product_name, variant_name, sku, quantity, unit_price_paise, total_price_paise",
    )
    .eq("order_id", order.id);

  const items: OrderItemRow[] = itemsData ?? [];
  const isCancelled = order.status === "cancelled" || order.status === "refunded";
  const currentIndex = TIMELINE.findIndex((s) => s.status === order.status);
  const statusLabel = STATUS_LABEL[order.status] ?? "Order placed";

  const placedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const helpMessage = `Hello Fresh Origins, I have a question about my order ${order.public_order_number}.`;

  return (
    <div className="fo-container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: order.public_order_number },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4 py-8">
        <div>
          <h1 className="mb-1">Order {order.public_order_number}</h1>
          <p className="m-0 text-fo-muted">Placed {placedDate} · via WhatsApp</p>
        </div>
        <span className="fo-badge text-[0.85rem]">{statusLabel}</span>
      </div>

      <div className="grid items-start gap-8 pb-12 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Status timeline */}
          <section className="fo-card mb-6 p-6">
            <h2 className="text-[1.2rem]">Order status</h2>
            {isCancelled ? (
              <p className="mt-2 text-fo-muted">
                This order is {statusLabel.toLowerCase()}. If you have any questions,
                please message us on WhatsApp.
              </p>
            ) : (
              <ol className="mt-4 space-y-4">
                {TIMELINE.map((step, i) => {
                  const done = currentIndex >= 0 && i < currentIndex;
                  const current = i === currentIndex;
                  return (
                    <li key={step.status} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] ${
                          done
                            ? "bg-fo-green-900 text-white"
                            : current
                              ? "bg-fo-green-600 text-white"
                              : "border border-fo-line bg-white"
                        }`}
                      >
                        {done ? "✓" : current ? "●" : ""}
                      </span>
                      <div>
                        <div
                          className={`text-[0.95rem] font-bold ${
                            done || current ? "text-fo-green-900" : "text-fo-muted"
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
            <h2 className="text-[1.2rem]">Items</h2>
            <div className="mt-2">
              {items.map((item, i) => (
                <div
                  key={`${item.sku ?? item.product_name}-${i}`}
                  className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-fo-line py-3 last:border-b-0"
                >
                  <Illustration
                    name="mixes"
                    title={item.product_name}
                    className="h-16 w-16"
                  />
                  <div>
                    <h3 className="mb-0.5 text-[0.98rem]">{item.product_name}</h3>
                    <div className="text-[0.8rem] text-fo-muted">
                      {[item.variant_name, item.sku ? `SKU ${item.sku}` : null, `Qty ${item.quantity}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                    <div className="mt-0.5 text-[0.8rem] text-fo-muted">
                      {formatINR(item.unit_price_paise)} each
                    </div>
                  </div>
                  <div className="text-right font-bold text-fo-green-900 tabular-nums">
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
            <h2 className="text-[1.2rem]">Summary</h2>
            <div className="mt-2 flex justify-between py-2 text-[0.95rem]">
              <span className="text-fo-muted">Subtotal</span>
              <span className="tabular-nums">{formatINR(order.subtotal_paise)}</span>
            </div>
            <div className="flex justify-between py-2 text-[0.95rem]">
              <span className="text-fo-muted">Delivery</span>
              <span>
                {order.shipping_paise > 0
                  ? formatINR(order.shipping_paise)
                  : "To be confirmed"}
              </span>
            </div>
            <div className="mt-1.5 flex justify-between border-t border-fo-line pt-3 text-[1.1rem] font-bold text-fo-green-900">
              <span>Total</span>
              <span className="tabular-nums">{formatINR(order.total_paise)}</span>
            </div>
          </section>

          <section className="fo-card p-6">
            <h2 className="text-[1.2rem]">Need help?</h2>
            <p className="mt-1 text-[0.9rem] text-fo-muted">
              Questions about this order? Reach us on WhatsApp.
            </p>
            <a
              href={buildWhatsAppUrl(helpMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="fo-btn-whatsapp mt-3 w-full"
            >
              Message us
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
}
