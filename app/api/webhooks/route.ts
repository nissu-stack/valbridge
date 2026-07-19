import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyShopifyWebhook } from "@/lib/shopify/webhook";

// Register these webhook topics in Shopify Admin: products/update, products/delete, inventory_levels/update, collections/update
// Route: /api/webhooks
// This route must be excluded from auth middleware because Shopify calls it directly.

export async function POST(request: NextRequest) {
  const body = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET ?? process.env.SHOPIFY_REVALIDATION_SECRET;

  if (!secret || !hmacHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!verifyShopifyWebhook(body, hmacHeader, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body) as {
      handle?: string;
      product?: { handle?: string };
      collection?: { handle?: string };
    };

    const productHandle = payload.handle ?? payload.product?.handle;
    const topic = request.headers.get("x-shopify-topic");

    if (topic === "products/create" || topic === "products/update" || topic === "products/delete" || topic === "inventory_levels/update") {
      if (productHandle) {
        revalidatePath(`/products/${productHandle}`);
      }

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/search");
    }

    if (topic === "collections/create" || topic === "collections/update" || topic === "collections/delete") {
      revalidatePath("/");
      revalidatePath("/shop");
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
