import Image from "next/image";
import Link from "next/link";
import { CartIconButton } from "@/components/layout/cart-icon-button";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { cookies } from "next/headers";
import { NAV_LINKS } from "@/lib/config/navigation";
import { shopifyClient } from "@/lib/shopify/client";
import { CART_QUERY } from "@/lib/shopify/queries";
import type { CartQueryData } from "@/lib/shopify/types";

async function getCartForHeader() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return null;
  }

  try {
    const data = await shopifyClient.request<CartQueryData>(CART_QUERY, { cartId });
    return data.cart;
  } catch {
    return null;
  }
}

export async function SiteHeader() {
  const cart = await getCartForHeader();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line-soft)] bg-[rgba(10,10,10,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Valbridge Group">
            <Image
              src="/logo.png"
              alt="Valbridge Group logo"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
            />
            <span className="font-serif text-lg tracking-wide text-[var(--porcelain)] sm:text-xl">
              Valbridge Group
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[0.74rem] uppercase tracking-[0.24em] text-[var(--mist)] md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="relative py-1 transition hover:text-[var(--gold-light)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[var(--gold)] after:transition-all after:duration-300 hover:after:w-full">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CartIconButton initialCount={cart?.totalQuantity ?? 0} />
          </div>
        </div>
      </header>
      <CartDrawer cart={cart} />
    </>
  );
}