import Link from "next/link";
import Image from "next/image";

/**
 * Fresh Origins logo — transparent PNG, so it sits cleanly on the cream header
 * and the dark-green footer alike (white background knocked out from the source
 * JPEG). Replace with an approved vector (SVG) before production for crispness.
 */
export function Logo({
  variant = "default",
}: {
  variant?: "default" | "footer";
}) {
  return (
    <Link
      href="/"
      aria-label="Fresh Origins home"
      className="inline-flex items-center"
    >
      <Image
        src="/brand/fresh-origins-logo.png"
        alt="Fresh Origins"
        width={170}
        height={40}
        priority={variant === "default"}
        className="h-10 w-auto"
        sizes="170px"
      />
    </Link>
  );
}
