import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

export function getFirstAvailableVariant(variants: ProductVariant[]) {
  return variants.find((variant) => variant.availableForSale) ?? null;
}

export function getSelectionsForVariant(variant: ProductVariant | null) {
  return Object.fromEntries(variant?.selectedOptions.map((option) => [option.name, option.value]) ?? []);
}

export function getInitialVariantSelection(variants: ProductVariant[], options: ProductOption[]) {
  const variant = getFirstAvailableVariant(variants);

  if (variant) {
    return { variant, selections: getSelectionsForVariant(variant) };
  }

  return {
    variant: null,
    selections: Object.fromEntries(options.map((option) => [option.name, option.values[0] ?? ""])),
  };
}

export function findAvailableVariant(variants: ProductVariant[], selections: Record<string, string>) {
  return variants.find(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every((option) => selections[option.name] === option.value),
  ) ?? null;
}

export function isOptionValueAvailable(
  variants: ProductVariant[],
  selections: Record<string, string>,
  optionName: string,
  value: string,
) {
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every((option) => {
        if (option.name === optionName) {
          return option.value === value;
        }

        return !selections[option.name] || selections[option.name] === option.value;
      }),
  );
}
