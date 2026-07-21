"use client";

import { useEffect, useState } from "react";
import type { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { findAvailableVariant, getInitialVariantSelection, isOptionValueAvailable } from "@/lib/shopify/variants";

type VariantSelectorProps = {
  variants: ProductVariant[];
  options: ProductOption[];
  onSelect: (variantId: string | null) => void;
};

export function VariantSelector({ variants, options, onSelect }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => getInitialVariantSelection(variants, options).selections,
  );

  useEffect(() => {
    if (options.length === 0) {
      onSelect(getInitialVariantSelection(variants, options).variant?.id ?? null);
      return;
    }

    const selectedVariant = findAvailableVariant(variants, selectedOptions);

    onSelect(selectedVariant?.id ?? null);
  }, [onSelect, options, selectedOptions, variants]);

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
              const isAvailable = isOptionValueAvailable(variants, selectedOptions, option.name, value);

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(option.name, value)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  className={`border px-4 py-2 text-sm font-medium transition ${
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
