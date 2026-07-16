"use client";

import { useState } from "react";
import { useCartDrawerStore } from "@/lib/cart/store";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { addToCart } from "@/app/(storefront)/cart/actions";

type AddToCartButtonProps = {
  selectedVariantId: string | null;
};

export function AddToCartButton({ selectedVariantId }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const openDrawer = useCartDrawerStore((state) => state.openDrawer);

  const handleClick = async () => {
    if (!selectedVariantId) {
      setMessage("Please select a variant first.");
      return;
    }

    setIsPending(true);
    setMessage(null);

    const result = await addToCart(selectedVariantId, 1);
    setIsPending(false);

    if ("userErrors" in result && result.userErrors?.length) {
      setMessage(result.userErrors[0]?.message ?? "Unable to add to cart.");
      return;
    }

    openDrawer();
    setMessage("Added to cart.");
  };

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || !selectedVariantId}
        className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Adding..." : selectedVariantId ? "Add to cart" : "Select a variant"}
      </button>
      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </div>
  );
}
