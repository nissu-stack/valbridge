"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { updateCartLine } from "@/app/(storefront)/cart/actions";
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
    <div>
      <div className={`inline-grid h-11 grid-cols-[42px_48px_42px] border border-[var(--line)] bg-[var(--panel)] transition ${isPending ? "opacity-55" : ""}`} aria-label="Quantity" aria-busy={isPending}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => updateCartLine(lineId, quantity - 1))}
          aria-label="Decrease quantity"
          className="inline-flex items-center justify-center text-[var(--mut)] transition hover:bg-[rgba(201,150,43,0.09)] hover:text-[var(--gold-light)] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)] disabled:cursor-wait"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
        <span className="inline-flex items-center justify-center border-x border-[var(--line-soft)] bg-[var(--coal)] text-sm font-medium tabular-nums text-[var(--cream)]" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          disabled={isPending || quantity >= 99}
          onClick={() => run(() => updateCartLine(lineId, quantity + 1))}
          aria-label="Increase quantity"
          className="inline-flex items-center justify-center text-[var(--mut)] transition hover:bg-[rgba(201,150,43,0.09)] hover:text-[var(--gold-light)] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)] disabled:cursor-wait disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-300" role="alert">{error}</p> : null}
    </div>
  );
}
