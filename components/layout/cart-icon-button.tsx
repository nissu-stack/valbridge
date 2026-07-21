"use client";

import { ShoppingBag } from "lucide-react";
import { useCartDrawerStore } from "@/lib/cart/store";

export function CartIconButton() {
  const openDrawer = useCartDrawerStore((state) => state.openDrawer);
  const isOpen = useCartDrawerStore((state) => state.isOpen);
  const cartCount = useCartDrawerStore((state) => state.cartCount);

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative inline-flex items-center justify-center border border-[var(--line)] bg-[var(--panel)] p-3 text-[var(--ink)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
      aria-label="Open cart"
      aria-controls="cart-panel"
      aria-expanded={isOpen}
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold-light)] px-1 text-[10px] font-semibold text-zinc-950" aria-live="polite">
        {cartCount}
      </span>
    </button>
  );
}
