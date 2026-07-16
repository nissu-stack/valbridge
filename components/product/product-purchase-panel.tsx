"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { VariantSelector } from "@/components/product/variant-selector";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

type ProductPurchasePanelProps = {
  variants: ProductVariant[];
  options: ProductOption[];
  compact?: boolean;
};

export function ProductPurchasePanel({ variants, options, compact = false }: ProductPurchasePanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (!variants.length) {
      setSelectedVariantId(null);
      return;
    }

    const fallbackVariant = variants.find((variant) => variant.availableForSale) ?? variants[0];
    setSelectedVariantId(fallbackVariant?.id ?? null);
  }, [variants]);

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {!compact ? <VariantSelector variants={variants} options={options} onSelect={setSelectedVariantId} /> : null}
      <AddToCartButton selectedVariantId={selectedVariantId} />
    </div>
  );
}
