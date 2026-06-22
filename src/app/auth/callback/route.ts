import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { mergeGuestCart } from "@/features/cart/actions";

/**
 * Auth callback. Supabase redirects here after the user clicks the email link.
 * Supports both the PKCE flow (`code`) and the OTP/magic-link verify flow
 * (`token_hash` + `type`). On success we establish the session, merge any guest
 * cart, then redirect to the requested page (or /account).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const rawRedirect = searchParams.get("redirect") ?? "/account";
  // Only allow same-site relative redirects.
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/account";

  const supabase = createClient();

  let authError: string | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) authError = error.message;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) authError = error.message;
  } else {
    authError = "missing_code";
  }

  if (authError) {
    const url = new URL("/auth/sign-in", origin);
    url.searchParams.set("error", authError);
    url.searchParams.set("redirect", redirectTo);
    return NextResponse.redirect(url);
  }

  // Session established — merge the guest cart into the user's cart.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await mergeGuestCart(user.id);
    }
  } catch {
    // Non-fatal: a failed merge should not block sign-in.
  }

  return NextResponse.redirect(new URL(redirectTo, origin));
}
