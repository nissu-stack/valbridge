import "server-only";

import { cookies } from "next/headers";
import { shopifyClient } from "@/lib/shopify/client";
import { CART_QUERY } from "@/lib/shopify/queries";
import type { CartQueryData } from "@/lib/shopify/types";

export async function getCartById(cartId: string) {
  if (!cartId.startsWith("gid://shopify/Cart/")) {
    return null;
  }

  try {
    const data = await shopifyClient.request<CartQueryData>(CART_QUERY, { cartId });
    return data.cart;
  } catch {
    return null;
  }
}

export async function getCartFromCookies() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  return cartId ? getCartById(cartId) : null;
}
