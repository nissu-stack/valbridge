import Link from "next/link";
import { CartIconButton } from "@/components/layout/cart-icon-button";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchBar } from "@/components/layout/search-bar";
import { cookies } from "next/headers";
import { shopifyClient } from "@/lib/shopify/client";
import { CART_QUERY } from "@/lib/shopify/queries";
import type { CartQueryData } from "@/lib/shopify/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/search", label: "Provenance" },
];

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
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(11,10,8,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-lg font-semibold tracking-[0.04em] text-[var(--gold-bright)] uppercase">
            Maison Valbridge
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--mut)] md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[var(--cream)]">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end gap-3 md:max-w-xl">
            <div className="hidden flex-1 md:block">
              <SearchBar />
            </div>
            <CartIconButton initialCount={cart?.totalQuantity ?? 0} />
          </div>
        </div>
      </header>
      <CartDrawer cart={cart} />
    </>
  );
}
