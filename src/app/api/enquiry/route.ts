import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enquirySchema } from "@/lib/validation/schemas";

/** POST /api/enquiry — B2B / contact enquiries (spec §24). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("enquiries").insert({
    enquiry_type: parsed.data.enquiryType,
    name: parsed.data.name,
    organisation: parsed.data.organisation || null,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    city: parsed.data.city || null,
    message: parsed.data.message || null,
    metadata: parsed.data.metadata ?? null,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Could not submit." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
