"use client";

import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartDrawerStore } from "@/lib/cart/store";

type CartIconButtonProps = {
  initialCount?: number;
};

export function CartIconButton({ initialCount = 0 }: CartIconButtonProps) {
  const openDrawer = useCartDrawerStore((state) => state.openDrawer);
  const setCartCount = useCartDrawerStore((state) => state.setCartCount);
  const cartCount = useCartDrawerStore((state) => state.cartCount);
  const optimisticQuantity = useCartDrawerStore((state) => state.optimisticQuantity);

  useEffect(() => {
    if (initialCount > 0 && cartCount === 0) {
      setCartCount(initialCount);
    }
  }, [cartCount, initialCount, setCartCount]);

  const totalCount = cartCount + optimisticQuantity;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] p-3 text-[var(--ink)] transition hover:border-[var(--gold)] hover:text-[var(--gold-l)]"
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold-l)] px-1 text-[10px] font-semibold text-zinc-950">
        {totalCount > 0 ? totalCount : 0}
      </span>
    </button>
  );
}
