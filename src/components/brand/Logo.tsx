import Link from "next/link";

/**
 * Fresh Origins wordmark (text rendition until the approved vector logo is
 * supplied — see spec §9.1). Swap the .mark span for the SVG when available.
 */
export function Logo({
  variant = "default",
}: {
  variant?: "default" | "footer";
}) {
  const wordA = variant === "footer" ? "text-white" : "text-fo-green-900";
  const wordB = "text-fo-green-600";
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
        <span className={wordA}>Fresh</span>
        <span className={wordB}>Origins</span>
      </span>
    </Link>
  );
}
