import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyShopifyWebhook } from "@/lib/shopify/webhook";

describe("verifyShopifyWebhook", () => {
  it("accepts valid signatures and rejects malformed ones", () => {
    const body = JSON.stringify({ id: 1 });
    const secret = "test-secret";
    const signature = crypto.createHmac("sha256", secret).update(body).digest("base64");
    expect(verifyShopifyWebhook(body, signature, secret)).toBe(true);
    expect(verifyShopifyWebhook(body, "invalid", secret)).toBe(false);
  });
});
