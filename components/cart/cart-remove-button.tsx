"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { removeCartLine } from "@/app/(storefront)/cart/actions";
import { useCartDrawerStore } from "@/lib/cart/store";

export function CartRemoveButton({ lineId, productTitle }: { lineId: string; productTitle: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const setCart = useCartDrawerStore((state) => state.setCart);
  const router = useRouter();

  const removeItem = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await removeCartLine(lineId);
        if (result.userErrors.length || !result.cart) {
          setError(result.userErrors[0]?.message ?? "Dieser Artikel konnte nicht entfernt werden.");
          return;
        }

        setCart(result.cart);
        router.refresh();
      } catch {
        setError("Dieser Artikel konnte nicht entfernt werden. Bitte versuchen Sie es erneut.");
      }
    });
  };

  return (
    <div className="absolute right-0 top-6 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={removeItem}
        disabled={isPending}
        className="inline-flex h-9 w-9 items-center justify-center border border-[var(--line-soft)] text-[var(--mut)] transition hover:border-[var(--gold)] hover:text-[var(--gold-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] disabled:cursor-wait disabled:opacity-50"
        aria-label={`${productTitle} aus dem Warenkorb entfernen`}
        aria-busy={isPending}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      {error ? <p className="max-w-48 text-right text-xs leading-5 text-red-300" role="alert">{error}</p> : null}
    </div>
  );
}
