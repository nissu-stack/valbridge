"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { VariantSelector } from "@/components/product/variant-selector";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { getFirstAvailableVariant } from "@/lib/shopify/variants";
import { MAX_CART_QUANTITY } from "@/lib/cart/constants";
import { formatMoney } from "@/lib/format";

type ProductPurchasePanelProps = {
  variants: ProductVariant[];
  options: ProductOption[];
};

export function ProductPurchasePanel({ variants, options }: ProductPurchasePanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => getFirstAvailableVariant(variants)?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? null;
  const hasAvailableVariants = variants.some((variant) => variant.availableForSale);

  return (
    <div>
      <VariantSelector variants={variants} options={options} onSelect={setSelectedVariantId} />

      <div className="mt-7 bg-[var(--coal)] px-5 py-5">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[0.64rem] font-medium uppercase tracking-[0.24em] text-[var(--mut)]">Ausgewählter Preis</p>
            <div className="mt-2 flex flex-wrap items-center gap-3" aria-live="polite">
              <span className="font-display text-2xl text-[var(--gold-pale)]">{selectedVariant ? formatMoney(selectedVariant.price) : "—"}</span>
              {selectedVariant?.compareAtPrice ? <span className="text-sm text-[var(--mut)] line-through">{formatMoney(selectedVariant.compareAtPrice)}</span> : null}
            </div>
          </div>
          <p className={`text-xs uppercase tracking-[0.14em] ${selectedVariant ? "text-[var(--gold-light)]" : "text-[var(--mut)]"}`}>
            {selectedVariant ? "Verfügbar" : hasAvailableVariants ? "Optionen auswählen" : "Nicht verfügbar"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[132px_minmax(0,1fr)]">
        <div className="grid h-12 grid-cols-[42px_48px_42px] border border-[var(--line)] bg-[var(--panel)]" aria-label="Menge">
          <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} disabled={quantity === 1} className="inline-flex items-center justify-center text-[var(--mut)] transition hover:text-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Menge verringern">
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span className="inline-flex items-center justify-center border-x border-[var(--line-soft)] text-sm font-medium tabular-nums text-[var(--cream)]" aria-live="polite">{quantity}</span>
          <button type="button" onClick={() => setQuantity((current) => Math.min(MAX_CART_QUANTITY, current + 1))} disabled={quantity === MAX_CART_QUANTITY} className="inline-flex items-center justify-center text-[var(--mut)] transition hover:text-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Menge erhöhen">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <AddToCartButton selectedVariantId={selectedVariantId} quantity={quantity} unavailable={!hasAvailableVariants} />
      </div>
    </div>
  );
}
