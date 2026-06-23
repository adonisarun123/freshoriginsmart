import Link from "next/link";
import Image from "next/image";
import logoSrc from "../../../public/brand/fresh-origins-logo.jpg";

/**
 * Fresh Origins logo.
 *
 * - `default` (light backgrounds, e.g. header): uses the supplied brand image.
 * - `footer` (dark green background): the supplied JPEG has a white background
 *   that would show as a box on dark, so we keep the clean text wordmark there
 *   until a transparent / reversed (white) logo asset is available (spec §9.1).
 */
export function Logo({
  variant = "default",
}: {
  variant?: "default" | "footer";
}) {
  if (variant === "footer") {
    return (
      <Link
        href="/"
        aria-label="Fresh Origins home"
        className="inline-flex items-center gap-2.5 font-display font-[650]"
      >
        <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-gradient-to-b from-fo-green-600 to-fo-green-900 text-[1.15rem] font-bold text-white">
          F
        </span>
        <span className="text-[1.4rem] leading-none">
          <span className="text-white">Fresh</span>
          <span className="text-fo-green-600">Origins</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Fresh Origins home" className="inline-flex items-center">
      <Image
        src={logoSrc}
        alt="Fresh Origins"
        priority
        className="h-10 w-auto"
        sizes="160px"
      />
    </Link>
  );
}
