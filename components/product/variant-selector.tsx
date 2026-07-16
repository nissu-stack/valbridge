"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

type VariantSelectorProps = {
  variants: ProductVariant[];
  options: ProductOption[];
  onSelect: (variantId: string | null) => void;
};

export function VariantSelector({ variants, options, onSelect }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (options.length === 0) {
      onSelect(null);
      return;
    }

    const selectedVariant = variants.find((variant) =>
      variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
    );

    onSelect(selectedVariant?.id ?? null);
  }, [onSelect, options.length, selectedOptions, variants]);

  const handleSelect = (name: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.name} className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">{option.name}</p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const matchingVariant = variants.find((variant) =>
                variant.selectedOptions.some((variantOption) => variantOption.name === option.name && variantOption.value === value),
              );
              const isAvailable = matchingVariant?.availableForSale ?? true;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(option.name, value)}
                  disabled={!isAvailable}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    isSelected ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-700"
                  } ${!isAvailable ? "cursor-not-allowed opacity-50" : "hover:border-zinc-950"}`}
                >
                  {value} {!isAvailable ? "(Sold out)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
