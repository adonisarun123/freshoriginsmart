/**
 * Branded image placeholder used until real product/lifestyle photography is
 * supplied (spec §14). Decorative by default; pass a label for context.
 */
export function Placeholder({
  label,
  ratio = "square",
  className = "",
}: {
  label?: string;
  ratio?: "square" | "4x3" | "16x9";
  className?: string;
}) {
  const aspect =
    ratio === "16x9"
      ? "aspect-video"
      : ratio === "4x3"
        ? "aspect-[4/3]"
        : "aspect-square";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-card bg-gradient-to-br from-fo-sage-100 to-[#eef3da] text-center text-[0.85rem] font-semibold text-fo-green-900 ${aspect} ${className}`}
      role={label ? "img" : "presentation"}
      aria-label={label || undefined}
    >
      {label ? <span className="px-3 opacity-85">{label}</span> : null}
    </div>
  );
}
