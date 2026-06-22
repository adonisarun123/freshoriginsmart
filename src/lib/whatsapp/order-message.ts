import { formatINR } from "@/lib/commerce/format";
import { site } from "@/config/site";

export interface WhatsAppLineItem {
  quantity: number;
  product_name: string;
  variant_name: string | null;
  unit_price_paise: number;
}

export interface WhatsAppOrderParams {
  publicOrderNumber: string;
  items: WhatsAppLineItem[];
  cartTotalPaise: number;
  pincode: string;
  publicOrderUrl: string;
}

/** Builds the prefilled WhatsApp message body (spec §26.2). */
export function buildWhatsAppMessage(params: WhatsAppOrderParams): string {
  const lines = params.items
    .map((i) => {
      const name = i.variant_name
        ? `${i.product_name} (${i.variant_name})`
        : i.product_name;
      return `${i.quantity}× ${name} — ${formatINR(i.unit_price_paise * i.quantity)}`;
    })
    .join("\n");

  return [
    "Hello Fresh Origins,",
    "",
    `I would like to place order ${params.publicOrderNumber}.`,
    "",
    "Items:",
    lines,
    "",
    `Cart total: ${formatINR(params.cartTotalPaise)}`,
    `Delivery area/pincode: ${params.pincode}`,
    "",
    `Order summary: ${params.publicOrderUrl}`,
    "",
    "Please confirm availability, delivery charge, and next steps.",
  ].join("\n");
}

/** Builds the wa.me deep link (spec §26.4). */
export function buildWhatsAppUrl(message: string): string {
  const number = site.whatsappNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
