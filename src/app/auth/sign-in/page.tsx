"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("loading");

    const supabase = createClient();
    const origin = window.location.origin;
    const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(
      redirect,
    )}`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("idle");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="fo-container py-16">
      <div className="mx-auto max-w-md">
        <p className="fo-eyebrow">Fresh Origins account</p>
        <h1 className="text-[clamp(1.8rem,3vw,2.4rem)]">Sign in or create an account</h1>

        {status === "sent" ? (
          <div className="fo-card mt-8 p-6">
            <h2 className="text-[1.3rem]">Check your email</h2>
            <p className="mt-3 text-fo-muted">
              We&apos;ve sent a secure sign-in link to{" "}
              <span className="font-bold text-fo-charcoal-900">{email}</span>.
              Open it on this device to continue. The link expires shortly for
              your security.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              className="fo-btn-secondary mt-6"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fo-card mt-8 p-6">
            <p className="text-fo-muted">
              Enter your email and we&apos;ll send you a secure link to sign in.
              No password needed.
            </p>

            {urlError && (
              <p className="mt-4 rounded-control border border-fo-error/30 bg-fo-error/10 px-4 py-3 text-[0.9rem] text-fo-error">
                Something went wrong with that link. Please request a new one.
              </p>
            )}
            {error && (
              <p className="mt-4 rounded-control border border-fo-error/30 bg-fo-error/10 px-4 py-3 text-[0.9rem] text-fo-error">
                {error}
              </p>
            )}

            <label htmlFor="email" className="mt-6 block text-[0.9rem] font-bold">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-control border border-fo-line bg-white px-4 py-3 text-[0.95rem] focus:border-fo-green-900 focus:outline-none"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="fo-btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Sending link…" : "Email me a sign-in link"}
            </button>

            <p className="mt-6 text-[0.82rem] text-fo-muted">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-fo-green-900">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-fo-green-900">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="fo-container py-16">
          <div className="mx-auto max-w-md">
            <p className="fo-eyebrow">Fresh Origins account</p>
            <h1 className="text-[clamp(1.8rem,3vw,2.4rem)]">Sign in</h1>
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
