"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeCartLine, updateCartLine } from "@/app/(storefront)/cart/actions";
import { useCartDrawerStore } from "@/lib/cart/store";

export function CartLineControls({ lineId, quantity }: { lineId: string; quantity: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const setCart = useCartDrawerStore((state) => state.setCart);
  const router = useRouter();

  const run = (operation: () => ReturnType<typeof updateCartLine>) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await operation();
        if (result.userErrors.length || !result.cart) {
          setError(result.userErrors[0]?.message ?? "Unable to update the cart.");
          return;
        }
        setCart(result.cart);
        router.refresh();
      } catch {
        setError("Unable to update the cart. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-[var(--cream)]">
        <button type="button" disabled={isPending} onClick={() => run(() => updateCartLine(lineId, quantity - 1))} aria-label="Decrease quantity" className="rounded-full border border-[var(--line)] px-3 py-2 disabled:opacity-50">−</button>
        <span className="min-w-[2rem] text-center font-semibold" aria-live="polite">{quantity}</span>
        <button type="button" disabled={isPending || quantity >= 99} onClick={() => run(() => updateCartLine(lineId, quantity + 1))} aria-label="Increase quantity" className="rounded-full border border-[var(--line)] px-3 py-2 disabled:opacity-50">+</button>
      </div>
      <button type="button" disabled={isPending} onClick={() => run(() => removeCartLine(lineId))} className="rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--obsidian)] disabled:opacity-50">
        {isPending ? "Updating…" : "Remove"}
      </button>
      {error ? <p className="w-full text-sm text-red-300" role="alert">{error}</p> : null}
    </div>
  );
}
