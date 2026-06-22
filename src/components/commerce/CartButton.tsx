import Link from "next/link";

/**
 * Cart icon with item-count badge. The count is wired to the cart store/server
 * action; shown statically here until cart state is connected.
 */
export function CartButton({ count = 0 }: { count?: number }) {
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} items`}
      className="relative grid h-[42px] w-[42px] place-items-center rounded-xl border-[1.5px] border-fo-line bg-white text-fo-green-900 hover:bg-fo-sage-100"
    >
      🛒
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-[9px] bg-fo-green-900 px-1 text-[0.7rem] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
