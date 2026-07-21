"use client";

import { useRef, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { QuickAddDialog } from "@/components/product/quick-add-dialog";
import type { Product } from "@/lib/shopify/types";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const quickAddTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const handleOpen = (product: Product, trigger: HTMLButtonElement) => {
    quickAddTriggerRef.current = trigger;
    setActiveProduct(product);
  };

  const handleClose = () => {
    setActiveProduct(null);
  };

  return (
    <>
      <div className="grid gap-x-4 gap-y-9 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-5 xl:gap-y-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickAdd={handleOpen} />
        ))}
      </div>

      {activeProduct ? (
        <QuickAddDialog
          key={activeProduct.id}
          product={activeProduct}
          returnFocusRef={quickAddTriggerRef}
          onClose={handleClose}
        />
      ) : null}
    </>
  );
}
