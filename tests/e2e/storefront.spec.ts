import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage exposes the primary storefront navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /shop now/i })).toHaveAttribute("href", "/shop");
});

test("search provides a usable query control", async ({ page }) => {
  await page.goto("/search");
  await expect(page.getByRole("searchbox", { name: /search products/i })).toBeVisible();
});

test("homepage has no automatically detectable serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});
