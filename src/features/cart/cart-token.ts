import "server-only";

import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

const COOKIE = "fo_cart";

/** SHA-256 of the raw token; only the hash is stored in the DB. */
export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Reads the guest cart token from cookies, if present. */
export function readCartToken(): string | null {
  return cookies().get(COOKIE)?.value ?? null;
}

/** Ensures a guest cart token cookie exists, returning the raw token. */
export function ensureCartToken(): string {
  const existing = cookies().get(COOKIE)?.value;
  if (existing) return existing;
  const raw = randomBytes(24).toString("hex");
  cookies().set(COOKIE, raw, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days
  });
  return raw;
}
