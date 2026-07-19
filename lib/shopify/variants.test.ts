import { describe, expect, it } from "vitest";
import { findAvailableVariant, getInitialVariantSelection, isOptionValueAvailable } from "@/lib/shopify/variants";
import type { ProductVariant } from "@/lib/shopify/types";

const variants: ProductVariant[] = [
  { id: "sold", availableForSale: false, selectedOptions: [{ name: "Size", value: "Small" }, { name: "Pack", value: "Single" }], price: { amount: "10", currencyCode: "CHF" } },
  { id: "available", availableForSale: true, selectedOptions: [{ name: "Size", value: "Large" }, { name: "Pack", value: "Single" }], price: { amount: "20", currencyCode: "CHF" } },
];

describe("variant selection", () => {
  it("initializes from the first available variant", () => {
    expect(getInitialVariantSelection(variants, []).variant?.id).toBe("available");
  });

  it("never selects a sold-out combination", () => {
    expect(findAvailableVariant(variants, { Size: "Small", Pack: "Single" })).toBeNull();
  });

  it("reports availability using the complete selection", () => {
    expect(isOptionValueAvailable(variants, { Pack: "Single" }, "Size", "Large")).toBe(true);
    expect(isOptionValueAvailable(variants, { Pack: "Single" }, "Size", "Small")).toBe(false);
  });
});
