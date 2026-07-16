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
    <div className="space-y-5">
      {options.map((option) => (
        <div key={option.name} className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-light)]">{option.name}</p>
          <div className="flex flex-wrap gap-3">
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
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]"
                      : "border-[var(--line)] bg-[rgba(255,255,255,0.04)] text-[var(--cream)] hover:border-[var(--gold)]"
                  } ${!isAvailable ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {value} {!isAvailable ? " (Sold out)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
