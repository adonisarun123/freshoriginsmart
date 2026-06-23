import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { primaryNav } from "@/config/navigation";
import { CartButton } from "@/components/commerce/CartButton";
import { getCart } from "@/features/cart/queries";

export async function Header() {
  let cartCount = 0;
  try {
    const cart = await getCart();
    cartCount = cart.itemCount;
  } catch {
    // Cart unavailable (e.g. Supabase not configured) — show an empty badge.
  }

  return (
    <header className="sticky top-0 z-[100] border-b border-fo-line bg-fo-cream-50/90 backdrop-blur">
      <div className="fo-container flex items-center gap-6 py-3.5">
        <Logo />
        <nav aria-label="Primary" className="mx-auto hidden gap-6 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="border-b-2 border-transparent py-1.5 text-[0.95rem] font-semibold text-fo-charcoal-900 hover:border-fo-green-600 hover:text-fo-green-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-[42px] w-[42px] place-items-center rounded-xl border-[1.5px] border-fo-line bg-white text-fo-green-900 hover:bg-fo-sage-100"
          >
            ⌕
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="grid h-[42px] w-[42px] place-items-center rounded-xl border-[1.5px] border-fo-line bg-white text-fo-green-900 hover:bg-fo-sage-100"
          >
            ☻
          </Link>
          <CartButton count={cartCount} />
        </div>
      </div>
    </header>
  );
}
