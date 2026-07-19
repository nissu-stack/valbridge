import { NextResponse } from "next/server";
import { getCartFromCookies } from "@/lib/shopify/cart";

export const dynamic = "force-dynamic";

export async function GET() {
  const cart = await getCartFromCookies();
  return NextResponse.json(
    { cart },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
