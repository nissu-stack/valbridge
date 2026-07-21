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
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.name}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[var(--cream)]">{option.name} auswählen</p>
            <span className="text-xs text-[var(--mut)]">{selectedOptions[option.name]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                  className={`min-h-11 border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] ${
                    isSelected
                      ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--obsidian)]"
                      : "border-[var(--line)] bg-transparent text-[var(--cream-dim)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
                  } ${!isAvailable ? "cursor-not-allowed text-[var(--mut)] line-through opacity-45" : ""}`}
                >
                  {value} {!isAvailable ? " (Ausverkauft)" : ""}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
