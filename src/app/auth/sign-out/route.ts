import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Signs the current user out and returns them to the homepage. */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("sign-out failed:", err);
  }
  // Always return home, even if sign-out errored.
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
