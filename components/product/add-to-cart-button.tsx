"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartDrawerStore } from "@/lib/cart/store";
import { addToCart } from "@/app/(storefront)/cart/actions";

type AddToCartButtonProps = {
  selectedVariantId: string | null;
  quantity?: number;
  unavailable?: boolean;
  onSuccess?: () => void;
};

export function AddToCartButton({ selectedVariantId, quantity = 1, unavailable = false, onSuccess }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const openDrawer = useCartDrawerStore((state) => state.openDrawer);
  const setCart = useCartDrawerStore((state) => state.setCart);

  const handleClick = async () => {
    if (!selectedVariantId) {
      setMessage("Bitte wählen Sie zuerst eine Variante.");
      return;
    }

    setIsPending(true);
    setMessage(null);

    try {
      const result = await addToCart(selectedVariantId, quantity);

      if (result.userErrors?.length || !result.cart) {
        setMessage(result.userErrors[0]?.message ?? "Das Produkt konnte nicht in den Warenkorb gelegt werden.");
        return;
      }

      setCart(result.cart);
      onSuccess?.();
      openDrawer();
      setMessage("Zum Warenkorb hinzugefügt.");
    } catch {
      setMessage("Der Warenkorb ist nicht erreichbar. Bitte versuchen Sie es erneut.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || !selectedVariantId || unavailable}
        className="site-button site-button--primary w-full"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Wird hinzugefügt..." : unavailable ? "Derzeit nicht verfügbar" : selectedVariantId ? "In den Warenkorb" : "Variante auswählen"}
      </button>
      {message ? <p className="text-sm text-[var(--gold-light)]" role="status">{message}</p> : null}
    </div>
  );
}
