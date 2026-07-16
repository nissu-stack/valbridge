import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

// Register these webhook topics in Shopify Admin: products/update, products/delete, inventory_levels/update, collections/update
// Route: /api/webhooks
// This route must be excluded from auth middleware because Shopify calls it directly.

export async function POST(request: NextRequest) {
  const body = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!secret || !hmacHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const generatedHmac = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  if (crypto.timingSafeEqual(Buffer.from(generatedHmac), Buffer.from(hmacHeader))) {
    const payload = JSON.parse(body) as {
      handle?: string;
      product?: { handle?: string };
      collection?: { handle?: string };
    };

    const productHandle = payload.handle ?? payload.product?.handle;
    const collectionHandle = payload.collection?.handle;

    const topic = request.headers.get("x-shopify-topic");

    if (topic === "products/update" || topic === "products/delete" || topic === "inventory_levels/update") {
      if (productHandle) {
        revalidatePath(`/products/${productHandle}`);
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
