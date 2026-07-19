import crypto from "node:crypto";

export function verifyShopifyWebhook(body: string, providedHmac: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(providedHmac, "utf8");
  return expectedBuffer.length === providedBuffer.length && crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}
