import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pincodeSchema } from "@/lib/validation/schemas";

/** GET /api/pincode?code=560001 — checks serviceability (spec §27). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = pincodeSchema.safeParse(searchParams.get("code") ?? "");
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 6-digit pincode" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("delivery_pincodes")
    .select("pincode, active, delivery_zones(name, city, min_days, max_days, free_delivery_threshold_paise, delivery_charge_paise)")
    .eq("pincode", parsed.data)
    .eq("active", true)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({
      ok: true,
      serviceable: false,
      message:
        "We don't deliver to this pincode yet. Join the waitlist for your area.",
    });
  }

  const zone = data.delivery_zones as unknown as {
    name: string;
    city: string;
    min_days: number;
    max_days: number;
    free_delivery_threshold_paise: number | null;
    delivery_charge_paise: number;
  };

  return NextResponse.json({
    ok: true,
    serviceable: true,
    city: zone.city,
    zone: zone.name,
    etaDays: [zone.min_days, zone.max_days],
    freeDeliveryThresholdPaise: zone.free_delivery_threshold_paise,
    deliveryChargePaise: zone.delivery_charge_paise,
  });
}
