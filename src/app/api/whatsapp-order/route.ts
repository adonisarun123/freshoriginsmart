import { NextResponse } from "next/server";
import { whatsappOrderSchema } from "@/lib/validation/schemas";
import { createWhatsAppOrder } from "@/features/orders/create-whatsapp-order";

/**
 * POST /api/whatsapp-order
 * Creates a server-side order record, then returns the WhatsApp deep link
 * (spec §26). The browser opens the link; no payment is taken in Phase 1.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = whatsappOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await createWhatsAppOrder(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("whatsapp-order failed:", err);
    // Only surface our own intentional, user-safe messages; never leak raw
    // DB/internal error text to the client.
    const safe = new Set(["Your cart is empty."]);
    const message =
      err instanceof Error && safe.has(err.message)
        ? err.message
        : "We couldn't create your order right now. Please try again.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
