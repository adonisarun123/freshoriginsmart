import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/Icon";

/**
 * Assisted-ordering action. Per spec §12.5 this must NOT match the visual
 * weight of Add to Cart (the primary commerce action). Icon-only on cards.
 */
export function WhatsAppButton({
  href = "/cart",
  iconOnly = false,
  small = false,
}: {
  href?: string;
  iconOnly?: boolean;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label="Order on WhatsApp"
      className={`fo-btn-whatsapp ${iconOnly ? "w-11 flex-none px-0" : ""} ${
        small ? "min-h-[38px] px-4 py-2.5 text-[0.85rem]" : ""
      }`}
    >
      <WhatsAppIcon size={18} className="text-fo-whatsapp" />
      {!iconOnly && "Order on WhatsApp"}
    </Link>
  );
}
