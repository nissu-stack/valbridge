"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { VariantSelector } from "@/components/product/variant-selector";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { getFirstAvailableVariant } from "@/lib/shopify/variants";
import { formatMoney } from "@/lib/format";

type ProductPurchasePanelProps = {
  variants: ProductVariant[];
  options: ProductOption[];
};

export function ProductPurchasePanel({ variants, options }: ProductPurchasePanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => getFirstAvailableVariant(variants)?.id ?? null);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? null;

  return (
    <div className="space-y-4">
      <VariantSelector variants={variants} options={options} onSelect={setSelectedVariantId} />
      {selectedVariant ? (
        <div className="flex flex-wrap items-center gap-3 text-sm" aria-live="polite">
          <span className="font-semibold text-[var(--gold-light)]">{formatMoney(selectedVariant.price)}</span>
          {selectedVariant.compareAtPrice ? (
            <span className="text-[var(--mut)] line-through">{formatMoney(selectedVariant.compareAtPrice)}</span>
          ) : null}
        </div>
      ) : null}
      <AddToCartButton selectedVariantId={selectedVariantId} />
    </div>
  );
}
