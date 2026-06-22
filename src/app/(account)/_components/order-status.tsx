import type { OrderStatus } from "@/types/database";

/** Human labels + tone for each order status (mirrors prototype copy). */
const STATUS_META: Record<
  OrderStatus,
  { label: string; tone: "pending" | "progress" | "success" | "muted" | "error" }
> = {
  draft: { label: "Draft", tone: "muted" },
  whatsapp_pending: { label: "WhatsApp pending", tone: "pending" },
  awaiting_confirmation: { label: "Awaiting confirmation", tone: "pending" },
  confirmed: { label: "Confirmed", tone: "progress" },
  packed: { label: "Packed", tone: "progress" },
  out_for_delivery: { label: "Out for delivery", tone: "progress" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "error" },
  refunded: { label: "Refunded", tone: "error" },
};

const TONE_CLASSES: Record<string, string> = {
  pending: "bg-fo-warning/15 text-fo-warning",
  progress: "bg-fo-info/15 text-fo-info",
  success: "bg-fo-success/15 text-fo-success",
  muted: "bg-fo-sage-100 text-fo-muted",
  error: "bg-fo-error/15 text-fo-error",
};

export function OrderStatusTag({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2.5 py-[5px] text-[0.72rem] font-bold ${TONE_CLASSES[meta.tone]}`}
    >
      {meta.label}
    </span>
  );
}

export function orderStatusLabel(status: OrderStatus): string {
  return STATUS_META[status].label;
}

/** Ordered fulfilment steps for the order-detail timeline. */
export const FULFILMENT_STEPS: { status: OrderStatus; title: string; meta: string }[] =
  [
    {
      status: "awaiting_confirmation",
      title: "Order placed",
      meta: "We've received your order",
    },
    {
      status: "confirmed",
      title: "Confirmed",
      meta: "Final order & delivery charge confirmed",
    },
    { status: "packed", title: "Packed", meta: "Packed fresh for dispatch" },
    {
      status: "out_for_delivery",
      title: "Out for delivery",
      meta: "On the way to you",
    },
    { status: "delivered", title: "Delivered", meta: "Enjoy your order" },
  ];

const STEP_ORDER: OrderStatus[] = [
  "awaiting_confirmation",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
];

/** Index of the current status within the fulfilment flow (-1 if not in flow). */
export function fulfilmentStepIndex(status: OrderStatus): number {
  if (status === "whatsapp_pending" || status === "draft") return 0;
  return STEP_ORDER.indexOf(status);
}
