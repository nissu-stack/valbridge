import { describe, expect, it } from "vitest";
import { formatMoney } from "@/lib/format";

describe("formatMoney", () => {
  it("retains currency-specific decimal precision", () => {
    const value = formatMoney({ amount: "19.95", currencyCode: "CHF" }, "de-CH");
    expect(value).toContain("19.95");
  });
});
