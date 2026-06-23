import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/validation/schemas";

/** POST /api/newsletter — newsletter subscription (spec §40 newsletter_subscribers). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .upsert(
      {
        email: parsed.data.email,
        source: parsed.data.source ?? "footer",
        status: "subscribed",
      },
      { onConflict: "email" },
    );

  if (error) {
    return NextResponse.json({ ok: false, error: "Could not subscribe." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
