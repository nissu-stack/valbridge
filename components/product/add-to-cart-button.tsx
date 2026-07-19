"use client";

import { useState } from "react";
import { useCartDrawerStore } from "@/lib/cart/store";
import { addToCart } from "@/app/(storefront)/cart/actions";

type AddToCartButtonProps = {
  selectedVariantId: string | null;
};

export function AddToCartButton({ selectedVariantId }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const openDrawer = useCartDrawerStore((state) => state.openDrawer);
  const setCart = useCartDrawerStore((state) => state.setCart);

  const handleClick = async () => {
    if (!selectedVariantId) {
      setMessage("Please select a variant first.");
      return;
    }

    setIsPending(true);
    setMessage(null);

    try {
      const result = await addToCart(selectedVariantId, 1);

      if (result.userErrors?.length || !result.cart) {
        setMessage(result.userErrors[0]?.message ?? "Unable to add to cart.");
        return;
      }

      setCart(result.cart);
      openDrawer();
      setMessage("Added to cart.");
    } catch {
      setMessage("Unable to reach the cart. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || !selectedVariantId}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--obsidian)] transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Adding..." : selectedVariantId ? "Add to cart" : "Select a variant"}
      </button>
      {message ? <p className="text-sm text-[var(--gold-light)]">{message}</p> : null}
    </div>
  );
}
